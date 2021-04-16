### 空格替换
::: tip 描述
请实现一个函数，把字符串 s 中的每个空格替换成"%20"。

示例 1：

输入：s = "We are happy."

输出："We%20are%20happy."
::: 
```java
public class Offer_05 {
    //解法一 库函数
    public static String replaceSpace(String s) {
        return s.replace(" ", "%20");
    }

    //解法二 拼接字符串
    public static String replaceSpace2(String s) {
        StringBuilder sb = new StringBuilder();
        char ch;
        for (int i = 0; i < s.length(); i++) {
            ch = s.charAt(i);
            if(Character.isSpaceChar(ch)){
                sb.append("%20");
                continue;
            }
            sb.append(ch);
        }
        return sb.toString();
    }
}
```