## 字节码角度看待一些问题
### 1、条件语句
```java
public static void main(String[] args) {
    int a = 0;
    if (a < 0) {
        a = 10;
    } else {
        a = 20;
    }
}
```
```java{9,12}
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=2, args_size=1
         0: iconst_0
         1: istore_1
         2: iload_1
         3: ifge          12
         6: bipush        10
         8: istore_1
         9: goto          15
        12: bipush        20
        14: istore_1
        15: return
```
可以看到条件语句的实现是依赖`ifge`，`goto`指令实现的，当a>=0时，跳转12对应的字节码；
### 2、循环语句
```java
public static void main(String[] args) {
    int a = 0;
    while (a < 10) {
        a++;
    }
}
```
```java{10,12}
 public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=1
         0: iconst_0
         1: istore_1
         2: iload_1
         3: bipush        10
         5: if_icmpge     14
         8: iinc          1, 1
        11: goto          2
        14: return
```
可以看出循环语句实现的原理也是一些比较指令（if_icmpge）加goto指令；
### 3、静态变量的初始化
```java
private static int a = 10;

static {
    a = 20;
}

static {
    a = 30;
}
```
最终a的值为30
```java
 static {};
    descriptor: ()V
    flags: ACC_STATIC
    Code:
      stack=1, locals=0, args_size=0
         0: bipush        10
         2: putstatic     #3                  // Field a:I
         5: bipush        20
         7: putstatic     #3                  // Field a:I
        10: bipush        30
        12: putstatic     #3                  // Field a:I
        15: return
```
可以看到静态变量的初始化语句都被按顺序收集起来，按序执行；
### 4、成员变量初始化
```java
private int a = 10;

{
    a = 20;
}

{
    a = 30;
}
```
最终a的值为30
```java
//该类的构造方法
 public com.oamha.jvm.bytecode.InterviewProblem();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V

         4: aload_0
         5: bipush        10
         7: putfield      #2                  // Field a:I

        10: aload_0
        11: bipush        20
        13: putfield      #2                  // Field a:I

        16: aload_0
        17: bipush        30
        19: putfield      #2                  // Field a:I
        22: return
```
成员变量也类似与静态变量，只不过被按顺序放在构造方法中，按顺序执行；
### 5、方法调用
```java
public class MethodInvocation {
    //普通public方法
    public void test1() {

    }

    //私有方法
    private void test2() {

    }

    //静态方法
    public static void test3() {

    }


    public static void main(String[] args) {
        MethodInvocation mi = new MethodInvocation();
        mi.test1();
        mi.test2();
        MethodInvocation.test3();
        mi.test3();
    }
}
```
对应的字节码：
```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=1
         0: new           #2                  //创建对象，分配堆内存，创建成功压入栈
         3: dup                               //复制一份对象的引用放入操作数栈，此时操作数栈有两个对象引用
         4: invokespecial #3                  //出栈，调用init方法
         7: astore_1                          //出栈，存储到局部变量表
         8: aload_1                          //加载局部变量表的1号槽位到操作数栈
         9: invokevirtual #4                  //调用test1（）
        12: aload_1                           //加载局部变量表的1号槽位到操作数栈
        13: invokespecial #5                  //调用test2（）
        16: invokestatic  #6                  // 调用test3（）
        19: aload_1                           //加载局部变量表的1号槽位到操作数栈
        20: pop                               //栈顶元素出栈
        21: invokestatic  #6                  // 调用test3（）
        24: return
```
+ 普通成员方法调用使用invokevirtual，表示动态绑定，支持多态；
+ 私有方法、构造方法调用使用invokespecial；
+ 静态方法调用使用invokestatic，属于静态绑定；
+ 如果用对象实例来调用静态方法，会导致一次多余的引用对象出入栈；
### 6、异常捕获的原理
#### 6.1、单个异常捕获
```java
public class ExceptionClass {
    public static void main(String[] args) {
        int a = 0;
        try {
            a = 20;
        } catch (Exception e) {
            a = 30;
        }
    }
}
```
```java{17}
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=3, args_size=1
         0: iconst_0
         1: istore_1
         2: bipush        20
         4: istore_1
         5: goto          12
         8: astore_2
         9: bipush        30
        11: istore_1
        12: return
      Exception table:
         from    to  target type
             2     5     8   Class java/lang/Exception
             LocalVariableTable:
      Start  Length  Slot  Name   Signature
          9       3     2     e   Ljava/lang/Exception;
          0      13     0  args   [Ljava/lang/String;
          2      11     1     a   I
```
Exception table标明了要监测的字节码为2~5，不包括5，如果这段代码出现异常，将跳转8，`astore_2`表示将异常变量e存储到局部变量表中；
#### 6.2、多个异常捕获
```java
public static void main(String[] args) {
    int a = 0;
    try {
        a = 10;
    } catch (IllegalArgumentException e) {
        a = 20;
    } catch (ArithmeticException e) {
        a = 30;
    }catch (Exception e){
        a = 40;
    }
}
```
```java{25-27}
 public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=3, args_size=1
         0: iconst_0
         1: istore_1
         2: bipush        10
         4: istore_1
         5: goto          26
         8: astore_2
         9: bipush        20
        11: istore_1
        12: goto          26
        15: astore_2
        16: bipush        30
        18: istore_1
        19: goto          26
        22: astore_2
        23: bipush        40
        25: istore_1
        26: return
      Exception table:
         from    to  target type
             2     5     8   Class java/lang/IllegalArgumentException
             2     5    15   Class java/lang/ArithmeticException
             2     5    22   Class java/lang/Exception
    LocalVariableTable:
        Start  Length  Slot  Name   Signature
            9       3     2     e   Ljava/lang/IllegalArgumentException;
           16       3     2     e   Ljava/lang/ArithmeticException;
           23       3     2     e   Ljava/lang/Exception;
            0      27     0  args   [Ljava/lang/String;
            2      25     1     a   I
```
可以看到仍然是通过监测指定代码片段来捕获异常，只不过多个异常复用局部变量表中的一个槽位，发生异常时，异常都会传递给e；
#### 6.3、multi-catch原理
```java
public static void main(String[] args) {
    int a = 0;
    try {
        a = 20;
    } catch (NullPointerException | IllegalArgumentException e) {
        a = 30;
    }
}
```
```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=3, args_size=1
         0: iconst_0
         1: istore_1
         2: bipush        20
         4: istore_1
         5: goto          12
         8: astore_2
         9: bipush        30
        11: istore_1
        12: return
      Exception table:
         from    to  target type
             2     5     8   Class java/lang/NullPointerException
             2     5     8   Class java/lang/IllegalArgumentException
      LocalVariableTable:
      Start  Length  Slot  Name   Signature
          9       3     2     e   Ljava/lang/RuntimeException;
          0      13     0  args   [Ljava/lang/String;
          2      11     1     a   I
```
可以看到新的multi-catch语法原理也是和上面捕获多个异常的原理是一致的；
### 7、finally原理
```java
 public static void main(String[] args) {
    int a = 0;
    try {
        a = 10;
    } catch (Exception e) {
        a = 20;
    } finally {
        a = 30;
    }
}
```
```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=1, locals=4, args_size=1
         0: iconst_0
         1: istore_1
         2: bipush        10
         4: istore_1
         5: bipush        30        //finally代码块的内容被添加在try块代码之后
         7: istore_1
         8: goto          27
        11: astore_2
        12: bipush        20
        14: istore_1
        15: bipush        30        //finally代码块的内容被添加在catch块代码之后
        17: istore_1
        18: goto          27
        21: astore_3                //发生异常，但不是匹配的类型，该异常引用会被存储到局部变量表的3号槽位
        22: bipush        30        //执行finally块的代码
        24: istore_1                
        25: aload_3                 //将局部变量表3号槽位的异常引用加载到操作数栈
        26: athrow                  //继续抛出
        27: return
      Exception table:
         from    to  target type
             2     5    11   Class java/lang/Exception
             2     5    21   any   //try块没有捕获到指定的异常，跳转21
            11    15    21   any   //catch块又发生异常，跳转21
     LocalVariableTable:
      Start  Length  Slot  Name   Signature
         12       3     2     e   Ljava/lang/Exception;
          0      28     0  args   [Ljava/lang/String;
          2      26     1     a   I
```
可以看到finally代码块被添加到所有可能发生异常的代码块之后，保证该finally代码块一定会被执行；