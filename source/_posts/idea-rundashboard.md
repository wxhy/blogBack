---
title: IDEA 显示 RunDashboard
date: 2019-06-29 16:30:25
tags:
categories: 常见问题
---

关于IDEA 启动多个服务时，不自动提示RunDashboard

解决办法：
修改项目中的 .idea\workspace.xml:

```java
  <component name="RunDashboard">
    <option name="configurationTypes">
      <set>
        <option value="SpringBootApplicationConfigurationType" />
      </set>
    </option>
   </component>

```

<!-- more -->