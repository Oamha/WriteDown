## 面试题
### 1、题一
虽然问题很简单，但适合理解字节码指令
```java
public static void main(String[] args) {
    int a = 10;
    int b = a++ + ++a + a--;
    System.out.println(a);
    System.out.println(b);
}
```
运行结果：
```
11
34
```
字节码指令
```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: bipush        10                  //将10压入栈
         2: istore_1                          //将栈顶的10出栈，存储到局部变量表中的1号槽位

         3: iload_1                           //将局部变量表1号槽位的10压入栈
         4: iinc          1, 1                //对局部变量表中的1号槽位进行加一 此时a=11,栈中有一个10

         7: iinc          1, 1                //对局部变量表中的1号槽位进行加一 此时a=12,栈中有一个10
        10: iload_1                           //局部变量表1号槽位的12压入栈，此时栈中为12,10

        11: iadd                              //将12和10出栈，执行相加，结果22入栈

        12: iload_1                           //将局部变量表1号槽位的12入栈 此时栈中为22,12
        13: iinc          1, -1               //将局部变量表1号槽位的12减一，a变成11

        16: iadd                              //将22和12出栈，执行相加，结果34入栈

        17: istore_2                          //将34存入到局部变量表的2号槽位，即b=34

        18: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        21: iload_1
        22: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V

        25: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        28: iload_2
        29: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V
        32: return
```
从字节码指令可以看出a++和++a的区别在于：
+ a++先执行aload，再执行iinc
+ ++a先执行iinc，再执行aload;
### 2、题二
```java
public static void main(String[] args) {
    int i = 0;
    int x = 0;
    while (i < 10) {
        x = x++;
        i++;
    }
    System.out.println(x);
}
```
运行结果:
```java
0
```
字节码指令：
```java{13-16}
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: iconst_0
         1: istore_1
         2: iconst_0
         3: istore_2
         4: iload_1
         5: bipush        10
         7: if_icmpge     21
        10: iload_2                           //将局部变量表中2号槽位的值即0加载到操作数栈
        11: iinc          2, 1                //将局部变量表2号槽位的值自增1
        14: istore_2                          //将操作数栈顶的值存储到局部变量表中的2号槽位，相当于将之前自增的值覆盖了
        15: iinc          1, 1
        18: goto          4
        21: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        24: iload_2
        25: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V
        28: return
```