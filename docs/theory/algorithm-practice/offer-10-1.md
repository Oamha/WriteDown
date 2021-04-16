### 斐波那契数列
::: tip 描述
写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。斐波那契数列的定义如下：<br/>
F(0) = 0,   F(1) = 1<br/>
F(N) = F(N - 1) + F(N - 2), 其中 N > 1.<br/>
斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。<br/>
答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

示例 1：<br/>
输入：n = 2<br/>
输出：1<br/>

示例 2：<br/>
输入：n = 5<br/>
输出：5<br/>

提示：<br/>
0 <= n <= 100<br/>
:::
```java
public class Offer_10_1 {
    public static int fib(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        int prev = 0, next = 1, sum;
        for (int i = 2; i <= n; i++) {
            sum = (prev + next) % 1_000_000_007;
            prev = next;
            next = sum;
        }
        return next;
    }

    public static int fib1(int n) {
        if (n == 0) return 0;
        if (n == 1) return 1;
        return fib1(n - 1) + fib1(n - 2);
    }
}
```
解题思路：
主要有两种解法，递归形式和动态规划形式
+ 递归形式存在大量重复计算，如f(3)、f(4)都需要计算f(2)；
+ 动态规划主要考虑要计算的目标值只跟前两个值有关，因此只需要定义三个变量，prev，next，sum，分别表示前两个值和目标值；
+ 还要考虑溢出问题，所以要对中间的计算结果取模，这里考查的公式是(a + b) % x = (a % x + b % x) % x；
<Common-Thumb :prefix="'/img/theory/algorithm'" :urls="'mod-derive.png'"/>
从推导过程来看，最终要计算的`f(n)%x`和在计算过程中就对中间结果求模是等效的；
::: warning
(a + b) % p = (a % p + b % p) % p <br/>
(a - b) % p = (a % p - b % p) % p <br/>
(a * b) % p = (a % p * b % p) % p <br/>
(a^b) % p = ((a % p)^b) % p
:::
