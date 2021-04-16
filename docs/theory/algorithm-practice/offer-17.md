### 打印从1到最大的n位数
::: tip 描述
输入数字 n，按顺序打印出从 1 到最大的 n 位十进制数。比如输入 3，则打印出 1、2、3 一直到最大的 3 位数 999。<br/>

示例 1:<br/>
输入: n = 1<br/>
输出: [1,2,3,4,5,6,7,8,9]

说明：<br/>
用返回一个整数列表来代替打印<br/>
n 为正整数
:::
```java
public class Offer_17 {
    public int[] printNumbers(int n) {
        int max = (int) Math.pow(10, n) - 1;
        int[] arr = new int[max];
        for (int i = 1; i <= max; i++) {
            arr[i - 1] = i;
        }
        return arr;
    }

    public static void main(String[] args) {
        System.out.println(new Offer_17().printNumbers(3).length);
    }
}
```