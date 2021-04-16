### 青蛙跳台阶问题
::: tip 描述
一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。<br/>
答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。<br/>
示例 1：<br/>
输入：n = 2<br/>
输出：2

示例 2：<br/>
输入：n = 7<br/>
输出：21

示例 3：<br/>
输入：n = 0<br/>
输出：1

提示：<br/>
0 <= n <= 100
:::
```java
public class Offer_10_11 {
    public int numWays(int n) {
        if (n == 0) {
            return 1;
        }
        if (n <= 2) {
            return n;
        }
        int prev = 1, next = 2, sum;
        for (int i = 3; i <= n; i++) {
            sum = (prev + next) % 1_000_000_007;
            prev = next;
            next = sum;
        }
        return next;
    }
}
```
解题思路：<br/>
最终的数学模型跟斐波那契数列问题是一样的。当青蛙处于n级台阶，它可能是从n-1或者n-2级台阶跳过来的，所以要求n-1级台阶的跳法和n-2级台阶的跳法，即递推式f(n) = f(n-1) + f(n-2);
