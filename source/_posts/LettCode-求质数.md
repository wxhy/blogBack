title: LettCode-厄拉多塞筛法求质数
author: Carlos
abbrlink: d432b74b
tags:
  - LettCode
categories: []
date: 2019-09-05 13:10:00
---
<a href="https://leetcode-cn.com/problems/count-primes/" class="LinkCard">LeetCode(204)- 计数质数</a>
## 题目描述

统计所有小于非负整数 n 的质数的数量。


## 解题思路
如求10之内的质数，首先列出2~N-1的所有数，如果当前数为质数，则其倍数就是质数，如
+ 第一个质数为2，在2上画圈，其倍数4/6/8不是质数，划掉4/6/8，继续遍历
+ 下一个质数为3，在3上画圈，其倍数6/9不是质数，划掉6/9，继续遍历
+ 下一个质数为5，在5上画圈，没有倍数，继续遍历
+ 下一个质数为7，在7上画圈，没有倍数，继续遍历。
<!-- more -->
最后再次遍历整个数组，画圈的数字就是质数，即2,3,5,7
转换为代码就是如果需要求<n的所有质数个数，则创建一个长度为n的整数数组，所有元素值变为1，1表示对应的索引值为质数，0表示对应的索引值为非质数。从2开始遍历，如果当前数字值为1，则获取其所有倍数，将元素值变为0（标记为非质数）。遍历完成后再次遍历数组，从2开始，记录元素为1的个数，即为对应的质数个数。

## 代码实现

```java
class Solution {
    public int countPrimes(int n) {
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) {
            nums[i] = 1;
        }

        for (int i = 2; i < n; i++) {
        	//如果当前数为质数
            if (nums[i] == 1) {
            	//将对应数的倍数变为0
                for (int j = 2; i * j < n; j++) {
                    nums[i * j] = 0;
                }
            }
        }

        int res = 0;
        //遍历数组，统计值为1的元素个数
        for (int i = 2; i < n; i++) {
            if (nums[i] == 1) {
                res++;
            }
        }

        return res;
    }
}
```