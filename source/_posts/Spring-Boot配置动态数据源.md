title: Spring Boot读写分离配置
author: Carlos
tags:
  - Spring Boot
categories:
  - Spring Boot
date: 2019-08-20 17:29:00
---
数据源配置

```java
## 数据库连接池
spring:
  dynamic:
    master:
      driver-class-name: com.mysql.cj.jdbc.Driver
      jdbc-url: jdbc:mysql://192.168.1.117:3306/boot
      username: root
      password: 123456
    slave:
      driver-class-name: com.mysql.cj.jdbc.Driver
      jdbc-url: jdbc:mysql://192.168.1.118:3306/boot
      username: root
      password: 123456

```

项目结构：

![项目结构](/uploads/zhucong1.png)

首先创建 DataSourceContants 数据源枚举类：
<!-- more -->

```java
@Getter
@AllArgsConstructor
public enum DataSourceContants {

    /**
     * 主库
     */
    MASTER("master", "主库"),

    /**
     * 从库
     */
    SLAVE("slave", "从库");

    public String value;

    public String description;

}

```

创建存储当前数据源的类DynamicDataSourceContextHolder，和用于切换数据源的DynamicDataSource
```java
/**
 *  根据当前线程来选择具体的数据源
 * @author carlos
 */
@UtilityClass
public class DynamicDataSourceContextHolder {

    private static final ThreadLocal<String> CONTEXT_HOLDER = new ThreadLocal<>();

    public static void add(String dataSourceName) {
        CONTEXT_HOLDER.set(dataSourceName);
    }

    public static String get() {
        return CONTEXT_HOLDER.get();
    }

    public static void clear(){
        CONTEXT_HOLDER.remove();
    }

}
```

```java
@Slf4j
public class DynamicDataSource extends AbstractRoutingDataSource {


    @Override
    protected Object determineCurrentLookupKey() {
        String dataSourceName = DynamicDataSourceContextHolder.get();
        logger.info("当前数据源是：" + dataSourceName);
        return DynamicDataSourceContextHolder.get();
    }
}

```
配置多数据源：
```java
@Slf4j
@Configuration
@AllArgsConstructor
@AutoConfigureBefore(DataSourceAutoConfiguration.class)
public class DynamicDataSourceAutoConfiguration{
    private final Map<Object, Object> dataSourceMap = new HashMap<>(8);

    /**
     * 主库
     * @return
     */
    @Bean
    @ConfigurationProperties("spring.dynamic.master")
    public DataSource masterDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    /**
     * 从库
     * @return
     */
    @Bean
    @ConfigurationProperties("spring.dynamic.slave")
    public DataSource slaveDataSource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    /**
     * 动态数据源
     * @return
     */
    @Bean
    @Primary
    public DataSource dynamicDataSource() {
        dataSourceMap.put(DataSourceContants.MASTER.getValue(), masterDataSource());
        dataSourceMap.put(DataSourceContants.SLAVE.getValue(), slaveDataSource());
        DynamicDataSource dynamicDataSource = new DynamicDataSource();
        dynamicDataSource.setDefaultTargetDataSource(masterDataSource());
        dynamicDataSource.setTargetDataSources(dataSourceMap);

        return dynamicDataSource;
    }

}

```


我们这里基于mybatis的插件来实现数据源切换条件判断。
实现自定义mybatis插件MasterSlaveAutoRoutingPlugin。
```java
@Intercepts({
        @Signature(type = Executor.class, method = "query", args = {MappedStatement.class, Object.class,
                RowBounds.class, ResultHandler.class}),
        @Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class})
})
@Slf4j
public class MasterSlaveAutoRoutingPlugin implements Interceptor {
    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        Object[] args = invocation.getArgs();
        MappedStatement ms = (MappedStatement) args[0];
        try {
            DynamicDataSourceContextHolder.add(ms.getSqlCommandType().equals(SqlCommandType.SELECT) 
            ? DataSourceContants.SLAVE.getValue()
            : DataSourceContants.MASTER.getValue());
            return invocation.proceed();
        } finally {
            DynamicDataSourceContextHolder.clear();
        }
    }

    @Override
    public Object plugin(Object target) {
        return target instanceof Executor ? Plugin.wrap(target, this) : target;
    }

    @Override
    public void setProperties(Properties properties) {

    }
}
```
注册MasterSlaveAutoRoutingPlugin插件
```java
 /**
     * 数据源切换Mybatis插件
     * @return
     */
    @Bean
    public MasterSlaveAutoRoutingPlugin masterSlaveAutoRoutingPlugin(){
        return new MasterSlaveAutoRoutingPlugin();
    }
}
```