---
title: Spring Boot 整合 Druid数据源
tags: 数据库
abbrlink: ce2b196c
date: 2019-08-16 13:28:46
---


首先引入maven配置：

``` java
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>druid-spring-boot-starter</artifactId>
        <version>1.1.18</version>
    </dependency>

```


更改配置bootstrap.yml:
<!-- more -->

``` java
spring:
    datasource:
        driver-class-name: com.mysql.cj.jdbc.Driver
        url: jdbc:mysql://boot-mysql:3306/boot?characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8&allowMultiQueries=true
        username: root
        password: 123456
        type: com.alibaba.druid.pool.DruidDataSource
        druid:
        #初始化大小
        initial-size: 8
        #连接池最小值
        min-idle: 8
        #连接池最大值
        max-active: 12
        #配置获取连接等待超时的时间(单位：毫秒)
        max-wait: 60000
        #配置间隔多久才进行一次检测，检测需要关闭的空闲连接(单位：毫秒)
        time-between-eviction-runs-millis: 2000
        #配置一个连接在池中（含空闲）最小生存的时间(单位：毫秒)
        min-evictable-idle-time-millis: 60000
        #配置一个连接在池中空闲最大生存的时间(单位：毫秒)
        max-evictable-idle-time-millis: 90000
        #检测连接是否有效的测试语句
        validation-query: select 1
        #申请连接时执行validationQuery检测连接是否有效。此配置会造成一定性能降低
        test-on-borrow: false
        #申请连接的时候，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效
        test-while-idle: true
        #归还连接时执行validationQuery检测连接是否有效。此配置会造成一定性能降低
        test-on-return: false
        #打开后，增强timeBetweenEvictionRunsMillis的周期性连接检查，minIdle内的空闲连接，每次检查强制验证连接有效性.
        keep-alive: true
        #是否缓存preparedStatement（也就是PSCache），PSCache对支持游标的数据库性能提升巨大，如：oracle，在mysql下建议关闭。
        pool-prepared-statements: false
        #检查连接泄露依据（超时时间）
        remove-abandoned-timeout-millis: 300000
        #abanded连接时输出错误日志，方便出现连接泄露时可以通过错误日志定位忘记关闭连接的位置
        log-abandoned: true
        filters: stat,wall
        connectionProperties: druid.stat.mergeSql=true;druid.stat.slowSqlMillis=5000
        ######Druid监控配置######
        web-stat-filter:
            enabled: true
            session-stat-enable: false
            session-stat-max-count: 1000
            principal-cookie-name: admin
            principal-session-name: admin
            profile-enable: true
            # 根据配置中的url-pattern来访问内置监控页面，如果是上面的配置，内置监控页面的首页是/druid/index.html
            # http://loacalhsot:8081/druid
        stat-view-servlet:
            enabled: true
            # 允许清空统计数据
            reset-enable: true
            login-username: admin
            login-password: 123456
            allow:
            deny:

```

配置文件中已经配置了Monitor，所以我们可以直接访问Druid monitor


