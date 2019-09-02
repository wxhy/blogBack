title: LeetCode - 两数之合
author: Carlos
tags:
  - LettCode
  - 哈希
categories:
  - LettCode
date: 2019-09-02 10:06:00
---
## 题目描述

给出一个整数数组，请在数组中找出两个加起来等于目标值的数，
你给出的函数twoSum 需要返回这两个数字的下标（index1，index2），需要满足 index1 小于index2.。注意：下标是从1开始的
假设给出的数组中只存在唯一解
例如：
给出的数组为 {2, 7, 11, 15},目标值为9
输出 ndex1=1, index2=2


## 解题思路

使用HashMap 保存 键为target-每个数的结果 值为下标，每次放入的时候看是否包含 当前值，
有的话说明当前值和已包含的值下标的那个元素为需要的结果

<!-- more -->

``` java
import java.util.Map;
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        int[] result = new int[2];
        Map<Integer,Integer> map = new HashMap<>();
        for(int i=0; i<nums.length; i++) {
            if(map.containsKey(nums[i])) {
                result[0] = map.get(nums[i]);
                result[1] = i;
                break;
            } else {
                map.put(target - nums[i],i);
            }
        }
        return result;
    }
}

```