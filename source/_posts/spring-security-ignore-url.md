---
title: Spring Security 在配置文件中配置ignoreUrls
tags: 软件配置
categories: Spring Security
abbrlink: 8a0eef75
date: 2019-07-02 15:57:48
---

Spring Security 资源服务器配置免登录链接如下：

```java
@Configuration
public class WebSecurityConfigurer extends ResourceServerConfigurerAdapter {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeRequests()
                .antMatchers("/actuator/**").permitAll()
                .anyRequest().authenticated();
    }
}
```

多个项目时，为了方便配置，现在将配置从Java Config中提取yml中。
主要原理是借用 ImportBeanDefinitionRegistrar 接口实现动态注入 ResourceServerConfigurerAdapter
<!-- more -->

## **获取需要拦截的URL**

```java
@Data
@Configuration
@RefreshScope
@ConditionalOnExpression("!'${security.oauth2.client.ignore-urls}'.isEmpty()")
@ConfigurationProperties(prefix = "security.oauth2.client")
public class PermitAllUrlProperties {
    private List<String> ignoreUrls = new ArrayList<>();
}

```

## **重写ResourceServerConfigurerAdapter**

```java
public class BootResourceServerConfigurerAdapter extends ResourceServerConfigurerAdapter {

    @Autowired
    private PermitAllUrlProperties permitAllUrlProperties;


    @Override
    @SneakyThrows
    public void configure(HttpSecurity http) {
        //允许使用iframe 嵌套，避免swagger-ui 不被加载的问题
        http.headers().frameOptions().disable();
        ExpressionUrlAuthorizationConfigurer<HttpSecurity>
            .ExpressionInterceptUrlRegistry registry = http
            .authorizeRequests();
        permitAllUrlProperties.getIgnoreUrls().forEach(url-> registry.antMatchers(url).permitAll());
        registry.anyRequest().authenticated()
                .and().csrf().disable();
    }
}

```


## **动态注入资源服务器配置**

```java
public class SecurityBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {


    @Override
    public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
        if (registry.isBeanNameInUse(SecurityConstants.RESOURCE_SERVER_CONFIGURER)) {
            log.warn("本地存在资源服务器配置，覆盖默认配置:" + SecurityConstants.RESOURCE_SERVER_CONFIGURER);
            return;
        }
        GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClass(BootResourceServerConfigurerAdapter.class);
        registry.registerBeanDefinition(SecurityConstants.RESOURCE_SERVER_CONFIGURER,beanDefinition);
    }
}

```


自定义EnableResourceServer注解

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Import({BootResourceServerAutoConfiguration.class, SecurityBeanDefinitionRegistrar.class})
public @interface EnableBootResourceServer {
}


```

BootResourceServerAutoConfiguration主要是配置了包扫描 ComponentScan