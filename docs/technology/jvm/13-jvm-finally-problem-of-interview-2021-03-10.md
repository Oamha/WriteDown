## finally面试题
### 1、题一
```java
public static int method() {
    try {
        return 10;
    } finally {
        return 20;
    }
}
```
注意：这里最终返回的是20
```java{6-9}
public static int method();
    descriptor: ()I
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=2, args_size=0
         0: bipush        10      //10入栈
         2: istore_0              //10存入到局部变量表 a=10
         3: bipush        20      //20入栈
         5: ireturn               //返回 栈顶元素20
         6: astore_1              //捕获到任何异常，将异常对象存储到局部变量表1号槽位
         7: bipush        20      //20入栈
         9: ireturn               //返回栈顶元素
      Exception table:
         from    to  target type
             0     3     6   any
```
从字节码来看，finally代码块被添加到了try代码块之后，return 10时函数并没有返回，而是等到finally代码执行完了才返回；
::: warning 注意
一般代码出现异常，声明的异常又没有匹配到，finally都有一个athrow字节码指令来继续抛出异常，但如果在finally里执行return语句，异常就被吞掉了，所以不建议在finally里执行return语句；
:::
比如下面这段代码就不会出现异常信息:
```java
public static int method() {
    try {
        int a = 10/0;
    } finally {
        return 20;
    }
}
```
### 2、题二
```java
public static int method() {
    int a = 0;
    try {
        return a;
    } finally {
        a = 20;
    }
}
```
这段代码最终结果仍然为0；
```java
public static int method();
    descriptor: ()I
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=3, args_size=0
         0: iconst_0              //常量0压入栈中
         1: istore_0              //0出栈，存入局部变量表0号槽位，a=0
         2: iload_0               //将局部变量表0号槽位的0入栈
         3: istore_1              //0出栈，存储局部变量表1号槽位（这里相当于对a进行了拷贝，防止后期对a进行修改影响返回结果）
         4: bipush        20      //20入栈
         6: istore_0              //20出栈，存入局部变量表0号槽位，相当于a=20
         7: iload_1               //0入栈
         8: ireturn               //返回 0
         9: astore_2              //捕获到任何异常，异常变量存入局部变量表2号槽位
        10: bipush        20      //20入栈
        12: istore_0              //a=20
        13: aload_2               //异常对象引用入栈
        14: athrow                //抛出异常
      Exception table:
         from    to  target type
             2     4     9   any
```