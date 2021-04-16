### 1、数组中重复的数字
::: tip 描述
在一个长度为 n 的数组 nums 里的所有数字都在 0～n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字重复了，也不知道每个数字重复了几次。请找出数组中任意一个重复的数字。

输入：
[2, 3, 1, 0, 2, 5, 3]

输出：2 或 3 
:::
```java
public class Offer_03 {
    //解法一 使用map
    public static int findRepeatNumber(int[] nums) {
         Map<Integer, Integer> map = new HashMap<>();
        Integer value;
        for (int i = 0; i < nums.length; i++) {
            value = map.get(nums[i]);
            if (value == null) {
                map.put(nums[i], 1);
            } else if(value == 1){
                return nums[i];
            }
        }
        throw new IllegalStateException();
    }

    //解法二 使用数组
    public static int findRepeatNumber2(int[] nums) {
        int[] arr = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            arr[nums[i]]++;
            if (arr[nums[i]] > 1) {
                return nums[i];
            }
        }
        throw new IllegalStateException();
    }
}
```
#### 主要知识点：
hash的思想，key存储出现的数字，value对应出现的次数。