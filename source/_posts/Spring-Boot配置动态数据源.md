title: Spring Boot读写分离配置
author: Carlos
tags:
  - Spring Boot
categories:
  - Spring Boot
date: 2019-08-20 17:29:00
---
## 数据源配置

```java
## 数据库连接池
spring:
  dynamic:
    master:
      driver-class-name: com.mysql.cj.jdbc.Driver
      jdbc-url: jdbc:mysql://192.168.1.117:3306/boot?characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8&allowMultiQueries=true
      username: ENC(y0MVSykTX0iVSqMpaGusFA==)
      password: ENC(VMgWiFR16g8bFGkUo0oZ9A==)
    slave:
      driver-class-name: com.mysql.cj.jdbc.Driver
      jdbc-url: jdbc:mysql://192.168.1.118:3306/boot?characterEncoding=utf8&zeroDateTimeBehavior=convertToNull&useSSL=false&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=GMT%2B8&allowMultiQueries=true
      username: ENC(y0MVSykTX0iVSqMpaGusFA==)
      password: ENC(TNa/fF1g0RJ39k80QKSQLPpAr1E8oqPZ)

```