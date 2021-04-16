## 运行时常量池
### 1、常量池
#### 1.1、一个简单的HelloWorld类：
```java
public class ConstantPoolTest {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}
```
使用javap -v 进行反编译后我们可以看到其常量池部分，它类似于一张表。虚拟机根据这张表找到要执行的类名、类方法、参数类型、字面量等信息。
```java
//类的基本信息部分
Classfile /E:/Intellj-workspace/JVM/target/classes/com/oamha/jvm/constantpool/ConstantPoolTest.class
  Last modified 2021-2-27; size 605 bytes
  MD5 checksum 1649da5bdcf52591df6c2bf9ca19ab2a
  Compiled from "ConstantPoolTest.java"
public class com.oamha.jvm.constantpool.ConstantPoolTest
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
//常量池部分
Constant pool:
   #1 = Methodref          #6.#20         // java/lang/Object."<init>":()V
   #2 = Fieldref           #21.#22        // java/lang/System.out:Ljava/io/PrintStream;
   #3 = String             #23            // hello world
   #4 = Methodref          #24.#25        // java/io/PrintStream.println:(Ljava/lang/String;)V
   #5 = Class              #26            // com/oamha/jvm/constantpool/ConstantPoolTest
   #6 = Class              #27            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lcom/oamha/jvm/constantpool/ConstantPoolTest;
  #14 = Utf8               main
  #15 = Utf8               ([Ljava/lang/String;)V
  #16 = Utf8               args
  #17 = Utf8               [Ljava/lang/String;
  #18 = Utf8               SourceFile
  #19 = Utf8               ConstantPoolTest.java
  #20 = NameAndType        #7:#8          // "<init>":()V
  #21 = Class              #28            // java/lang/System
  #22 = NameAndType        #29:#30        // out:Ljava/io/PrintStream;
  #23 = Utf8               hello world
  #24 = Class              #31            // java/io/PrintStream
  #25 = NameAndType        #32:#33        // println:(Ljava/lang/String;)V
  #26 = Utf8               com/oamha/jvm/constantpool/ConstantPoolTest
  #27 = Utf8               java/lang/Object
  #28 = Utf8               java/lang/System
  #29 = Utf8               out
  #30 = Utf8               Ljava/io/PrintStream;
  #31 = Utf8               java/io/PrintStream
  #32 = Utf8               println
  #33 = Utf8               (Ljava/lang/String;)V
//方法部分
{
  public com.oamha.jvm.constantpool.ConstantPoolTest();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 4: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/oamha/jvm/constantpool/ConstantPoolTest;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String hello world
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
      LineNumberTable:
        line 6: 0
        line 7: 8
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  args   [Ljava/lang/String;
}
SourceFile: "ConstantPoolTest.java"
```
### 2、运行时常量池
常量池是存在于字节码文件中的，类加载时，字节码的常量池信息会被放入运行时常量池；
### 3、StringTable(串池)
StringTable是运行时常量池的一部分，常量池信息被放入运行时常量池后，这时常量池中的字符串信息还是以符号形式在运行时常量池中进行存储，只有运行到某条指令需要该字符串时，才会在StringTable中创建相应的字符串对象；
#### 3.1 字符串拼接
```java
public static void main(String[] args){
    String a = "a";
    String b = "b";
    String c = "ab";
    String d = a + b;
    System.out.println(c == d);  //c和d引用的是同一个对象吗？
}

运行结果：
false
```
看一下反编译后的字节码指令：
```java
public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=3, locals=5, args_size=1
         0: ldc           #2                  // String a 从运行时常量池中加载字符串'a'，如果没有则创建，如果存在则返回
         2: astore_1                          //将字符串'a'对象赋值给引用a
         3: ldc           #3                  // String b 从运行时常量池中加载字符串'b'，如果没有则创建，如果存在则返回
         5: astore_2                          //将字符串'b'对象赋值给引用b
         6: ldc           #4                  // String ab 从运行时常量池中加载字符串'ab'，如果没有则创建，如果存在则返回
         8: astore_3                          //将字符串'ab'对象赋值给引用c
         9: new           #5                  // class java/lang/StringBuilder
        12: dup
        13: invokespecial #6                  // Method java/lang/StringBuilder."<init>":()V
        16: aload_1
        17: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        20: aload_2
        21: invokevirtual #7                  // Method java/lang/StringBuilder.append:(Ljava/lang/String;)Ljava/lang/StringBuilder;
        24: invokevirtual #8                  // Method java/lang/StringBuilder.toString:()Ljava/lang/String;
        27: astore        4
        29: getstatic     #9                  // Field java/lang/System.out:Ljava/io/PrintStream;
        32: aload_3
        33: aload         4
        35: if_acmpne     42
        38: iconst_1
        39: goto          43
        42: iconst_0
        43: invokevirtual #10                 // Method java/io/PrintStream.println:(Z)V
        46: return
      LineNumberTable:
        line 6: 0
        line 7: 3
        line 8: 6
        line 9: 9
        line 10: 29
        line 11: 46
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      47     0  args   [Ljava/lang/String;
            3      44     1     a   Ljava/lang/String;
            6      41     2     b   Ljava/lang/String;
            9      38     3     c   Ljava/lang/String;
           29      18     4     d   Ljava/lang/String;
      StackMapTable: number_of_entries = 2
        frame_type = 255 /* full_frame */
          offset_delta = 42
          locals = [ class "[Ljava/lang/String;", class java/lang/String, class java/lang/String, class java/lang/String, class java/lang/String ]
          stack = [ class java/io/PrintStream ]
        frame_type = 255 /* full_frame */
          offset_delta = 0
          locals = [ class "[Ljava/lang/String;", class java/lang/String, class java/lang/String, class java/lang/String, class java/lang/String ]
          stack = [ class java/io/PrintStream, int ]
}
```
可以看出`String c = "ab"`是从运行时常量池查找"ab"字符串对象，而`String d = "a" + "b"`是通过创建一个`StringBuilder`对象，然后调用`append`方法，最终调用`toString`返回一个堆中的新对象，所以`c!=d`;
#### 3.2 编译器优化
```java
public static void main(String[] args) {
    String c = "ab";
    String e = "a" + "b";
    System.out.println(e == c); // e和c引用的对象相同吗
}

运行结果：
true
```
看一下反编译后的字节码指令：
```java
  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=3, locals=3, args_size=1
         0: ldc           #2                  // String ab  
         2: astore_1
         3: ldc           #2                  // String ab
         5: astore_2
         6: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
         9: aload_2
        10: aload_1
        11: if_acmpne     18
        14: iconst_1
        15: goto          19
        18: iconst_0
        19: invokevirtual #4                  // Method java/io/PrintStream.println:(Z)V
        22: return
      LineNumberTable:
        line 7: 0
        line 8: 3
        line 9: 6
        line 10: 22
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      23     0  args   [Ljava/lang/String;
            3      20     1     c   Ljava/lang/String;
            6      17     2     e   Ljava/lang/String;
      StackMapTable: number_of_entries = 2
        frame_type = 255 /* full_frame */
          offset_delta = 18
          locals = [ class "[Ljava/lang/String;", class java/lang/String, class java/lang/String ]
          stack = [ class java/io/PrintStream ]
        frame_type = 255 /* full_frame */
          offset_delta = 0
          locals = [ class "[Ljava/lang/String;", class java/lang/String, class java/lang/String ]
          stack = [ class java/io/PrintStream, int ]
}
```
可以看到`"a" + "b"`和`"ab"`都是通过ldc加载常量池中的"ab"字符串对象，这是因为在编译时编译器会将`"a" + "b"`直接优化为`"ab"`，所以`e==c`;
#### 3.3、字符串延迟加载
StringTable中创建对象的过程是懒汉式的，只有真正执行到某条字节码指令才会在StringTable中创建相应的字符串对象，可以通过debug窗口的memory视图配合单步执行查看类的个数变化
```java
public static void main(String[] args) {
      System.out.println("1");
      System.out.println("2");
      System.out.println("3");
      System.out.println("4");
      System.out.println("5");
      System.out.println("6");
      System.out.println("7");
      System.out.println("1");
      System.out.println("2");
      System.out.println("3");
      System.out.println("4");
      System.out.println("5");
      System.out.println("6");
      System.out.println("7");
  }
```
可以通过调试窗口的memory视图配合单步执行查看String类的个数变化：
<Common-Thumb :prefix="'/img/technology/'" :urls="'lazy-creation-of-string-in-string-table.png'"/>
#### 3.4、intern方法
intern方法用于将一个字符串移入StringTable，并将该字符串的引用返回；
+ JDK1.8执行intern时，如果StringTable存在该字符串对象，则直接返回该对象的引用；如果不存在，则将堆中的字符串对象移入StringTable，然后返回该对象的引用；
+ JDK1.6执行intern时，如果StringTable存在该字符串对象，则直接返回该对象的引用；如果不存在，则将堆中的字符串对象拷贝一份进入StringTable，然后返回拷贝对象的引用；
##### JDK1.8
```java
public static void main(String[] args) {
    //StringTable中["a", "b"]
    //堆中存放："a", "b", "ab"
    String s = new String("a") + new String("b");
    //StringTable中并没有"ab", 堆中的"ab"被放入StringTable，所以s==s1
    String s1 = s.intern();
    System.out.println(s == s1);
}

运行结果：
true
```

```java
public static void test() {
    String origin = "ab";
    String s = new String("a") + new String("b");
    String s1 = s.intern(); //StringTable中已经存在"ab"字符串对象，直接返回其引用，值就是origin
    System.out.println(origin == s);
    System.out.println(origin == s1);
}

运行结果：
false
true
```
##### JDK1.6
```java
public static void main(String[] args) {
    //StringTable中["a", "b"]
    //堆中存放："a", "b", "ab"
    String s = new String("a") + new String("b");
    //StringTable中并不存在"ab"对象，将堆中的"ab"拷贝一份进入StringTable，该对象是新的对象，所以s!=s1
    String s1 = s.intern();
    System.out.println(s == s1);
}

运行结果：
false
```
```java
public static void test2() {
    String origin = "ab";
    String s = new String("a") + new String("b");
    String s1 = s.intern();
    System.out.println(origin == s);
    System.out.println(origin == s1);
}

运行结果：
false
true
```
```java
public static void test3() {
    String s = new String("a") + new String("b");
    String s1 = s.intern();
    String origin = "ab";
    System.out.println(origin == s);
    System.out.println(origin == s1);
}

运行结果：
false
true
```
#### 3.5、StringTable的位置
+ JDK1.8 StringTable位于堆空间中；
```java
//设置虚拟机参数 -Xmx10m
public class ConstantPoolTest5 {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        int i = 0;
        try {
            for (i = 0; i < 20_0000; i++) {
                list.add(String.valueOf(i).intern());
            }
        } catch (Throwable t) {
            System.out.println(i);
            t.printStackTrace();
        }
    }
}

运行结果：
106710
java.lang.OutOfMemoryError: Java heap space
```
+ JDK1.6 StringTable位于永久代；
```java
//设置虚拟机参数 -XX:MaxPermSize=10m
public class ConstantPoolTest5 {
    public static void main(String[] args) {
        List<String> list = new ArrayList<String>();
        int i = 0;
        try {
            for (i = 0; i < 300000; i++) {
                list.add(String.valueOf(i).intern());
            }
        } catch (Throwable t) {
            System.out.println(i);
            t.printStackTrace();
        }
    }
}

运行结果：
259048
java.lang.OutOfMemoryError: PermGen space
```
详情位置：
<Common-Thumb :prefix="'/img/technology/'" :urls="'graph-of-runtime-constant-pool.png'"/>
#### 3.6、StringTable的垃圾回收
```java
/**
 * StringTable的垃圾回收
 * -Xmx10m -XX:+PrintStringTableStatistics -XX:+PrintGCDetails -verbose:gc
 */
public static void main(String[] args) {
    int i = 0;
    try {
        for (i = 0; i < 100000; i++) {
            String.valueOf(i).intern();
        }
    } catch (Throwable t) {
        t.printStackTrace();
    }
}
运行结果：
//这里发生了垃圾回收
[GC (Allocation Failure) [PSYoungGen: 2048K->488K(2560K)] 2048K->675K(9728K), 0.0010081 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 2536K->504K(2560K)] 2723K->719K(9728K), 0.0047929 secs] [Times: user=0.02 sys=0.00, real=0.01 secs] 
[GC (Allocation Failure) [PSYoungGen: 2552K->488K(2560K)] 2767K->711K(9728K), 0.0016814 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 2560K, used 1778K [0x00000000ffd00000, 0x0000000100000000, 0x0000000100000000)
  eden space 2048K, 63% used [0x00000000ffd00000,0x00000000ffe42980,0x00000000fff00000)
  from space 512K, 95% used [0x00000000fff00000,0x00000000fff7a020,0x00000000fff80000)
  to   space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
 ParOldGen       total 7168K, used 223K [0x00000000ff600000, 0x00000000ffd00000, 0x00000000ffd00000)
  object space 7168K, 3% used [0x00000000ff600000,0x00000000ff637d80,0x00000000ffd00000)
 Metaspace       used 3489K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 382K, capacity 388K, committed 512K, reserved 1048576K
SymbolTable statistics:
Number of buckets       :     20011 =    160088 bytes, avg   8.000
Number of entries       :     14241 =    341784 bytes, avg  24.000
Number of literals      :     14241 =    604608 bytes, avg  42.455
Total footprint         :           =   1106480 bytes
Average bucket size     :     0.712
Variance of bucket size :     0.717
Std. dev. of bucket size:     0.847
Maximum bucket size     :         6
StringTable statistics:                                            //StringTable类似于HashMap
Number of buckets       :     60013 =    480104 bytes, avg   8.000 //桶的个数
Number of entries       :     24291 =    582984 bytes, avg  24.000 //entry的个数
Number of literals      :     24291 =   1419624 bytes, avg  58.442 //字符串的个数
Total footprint         :           =   2482712 bytes
Average bucket size     :     0.405
Variance of bucket size :     0.405
Std. dev. of bucket size:     0.637
Maximum bucket size     :         4
```
#### 3.7、StringTable调优
StringTable在内存中的数据结构类似于HashMap，桶的个数越大，冲突越小，字符串的入池效率越高，可以通过-XX:StringTableSize设置StringTable桶的大小；