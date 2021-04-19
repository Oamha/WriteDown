### 数值的整数次方
::: tip 描述
实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，x^n）。不得使用库函数，同时不需要考虑大数问题。

示例 1：<br/>
输入：x = 2.00000, n = 10<br/>
输出：1024.00000

示例 2：<br/>
输入：x = 2.10000, n = 3<br/>
输出：9.26100

示例 3：<br/>
输入：x = 2.00000, n = -2<br/>
输出：0.25000<br/>
解释：2-2 = 1/22 = 1/4 = 0.25
 
提示：<br/>
-100.0 < x < 100.0<br/>
<strong>-2^31 <= n <= 2^31-1</strong><br/>
-104 <= x^n <= 104
:::
```java
public class Offer_16 {
    public double myPow(double x, int n) {
        if (x == 0) return 0;
        long m = n;        //用long保存n
        if (m < 0) {
            x = 1 / x;
            m = -m;
        }
        double sum = 1;
        while (m != 0) {
            if ((m & 1) == 1) {
                sum = sum * x;
            }
            x *= x;         //每次x = x^2，得到x^2, x^4, x^8, x^16....
            m = m >>> 1;
        }
        return sum;
    }
}
```
解题思路：<br/>
+ 主要是运用快速幂运算的思想来进行拆分，比如x^9 = x^8 + x^1, x^15 = x^8 + x^4 + x^2 + x^1；
+ 特别注意，x^n的取值取到了整形的最小值(0x80000000)，最小值取反(按位取反得到0x7fffffff，再加一得到0x80000000)仍然是最小值，还是个负数，负数在有符号移位过程中会造成死循环，导致运行超时，所以解题中用一个long类型来保存n；
+ 整型最大值0x7fffffff（2147483647），最小值0x80000000（-2147483648）；
+ 整型最大值加一变成最小值；