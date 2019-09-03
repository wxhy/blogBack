---
title: Intellij IDEA运行报Command line is too long错误
categories: 常见问题
abbrlink: 7107112b
date: 2019-06-29 16:23:53
tags:
---

IDEA 运行springBoot Application 出现 command line is too long错误

解决办法：
修改项目中的 .idea\workspace.xml:

```java
  <component name="PropertiesComponent">
    <property name="dynamic.classpath" value="true" />
  </component>

```

<!-- more -->