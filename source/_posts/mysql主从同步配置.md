title: mysql主从同步配置
tags: []
categories: []
date: 2019-08-19 14:07:00
---
-- Mysql主从同步配置
date: 2017-10-24 13:10:01
tags: [Mysql]
categories: Mysql
---

mysql主从同步主要基于日志（binlog）的主从复制方式


## 主库配置
在主库的mysql配置文件my.cnf的 [mysqld]下添加配置：

```java
## 开启日志文件
log-bin=mysql-bin
## 服务器ID 一般为IP末尾
server-id=27
## 不参与主从的数据库名
binlog-ignore-db=mysql
##需要同步的数据库，多个的话另外起一行配置 binlog-do-db=test
binlog-do-db=boot

```

主库新增用户，主服务器给从服务器账号授权：
```java
##创建用户
create user 'mstest'@'%' identified WITH mysql_native_password by '123456'; 
##用户授权
GRANT REPLICATION SLAVE ON *.* to 'mstest'@'%' ; 
```
如果报错，记得修改mysql密码验证策略
<!-- more -->
执行 show master status;

![upload successful](/uploads/mysql-master.png)


## 从库配置

```java
[mysqld]
server-id=187
log-bin=mysql-bin

```

重启mysql

进入mysql, mysql -u root -p;

```java
stop slave;
change master to 
master_host='192.168.1.128',
master_user='mstest',
master_password='123456',
master_log_file='mysql-bin.000003',
master_log_pos=852;
start slave;

```
master_host: 主库IP地址

master_user：上面新建的用户名

master_password：密码

master_log_file：主库的日志文件

master_log_pos： 主库日志文件起始位置，具体查看上图

执行show slave status\G;



![upload successful](/uploads/mysql-slave.png)

## MySQL同步故障：" Slave_SQL_Running:No"


一般是事务回滚造成的：
解决办法：
```java
 stop slave ;
 set GLOBAL SQL_SLAVE_SKIP_COUNTER=1;
 start slave ;
 ```
