## 类加载过程
### 1、加载阶段
::: tip 概念
将描述类的数据从Class文件加载到内存，并对数据进行校验，转换解析和初始化，最终形成可以被虚拟机直接使用的Java类型；
:::
+ 加载的主要工作是将字节码载入方法区，内部采用c++的instanceKlass结构来描述类；
+ 如果这个类的父类还没有加载，先加载父类；
+ instanceKlass 这样的元数据是存储在方法区(1.8后的元空间内)，占用本地内存，但 _java_mirror是存储在堆中;
+ instanceKlass结构包含了：
    + _java_mirror即java的类镜像，例如对String来说，就是String.class，作用是把klass暴露给java使用
    + _super 即父类
    + _fields 即成员变量
    + _methods 即方法
    + _constants 即常量池
    + _class_loader 即类加载器
    + _vtable 虚方法表
    + _itable 接口方法表

instanceKlass结构：
<Common-Thumb :prefix="'/img/technology/'" :urls="'structure-of-instanceklass.png'"/>
### 2、链接阶段
#### 2.1、验证
::: tip 概念
对字节码文件进行校验，目的是为了确保Class文件的字节流中包含的信息符合当前虚拟机的要求，并且不会危害虚拟机自身的安全；
:::
+ 文件格式验证 验证字节流是否符合Class文件格式的规范，并且能被当前版本的虚拟机处理；
+ 元数据验证 对类的元数据信息进行语义校验，是否存在不符合Java语言规范的元数据信息；
+ 字节码验证 最复杂的一个阶段，主要目的是通过数据流和控制流分析，确定程序语义是合法的，符合逻辑的。对类的方法体进行校验分析，保证被校验类的方法在运行时不会做出危害虚拟机安全的事件；
+ 符号引用验证 最后一个阶段的校验发生在虚拟机将符号引用转换为直接引用的时候，这个转换动作将在链接的第三个阶段——解析阶段中发生，符号验证的目的是确保解析动作能正常进行；

比如修改字节码文件的魔数`CAFEBABE`为`CAFEBABA`再次执行就会校验失败：
```java
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.ClassFormatError: Incompatible magic value 1128351301 in class file com/oamha/jvm/classloader/ClassLoader
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(Unknown Source)
        at java.security.SecureClassLoader.defineClass(Unknown Source)
        at java.net.URLClassLoader.defineClass(Unknown Source)
        at java.net.URLClassLoader.access$100(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.net.URLClassLoader$1.run(Unknown Source)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.misc.Launcher$AppClassLoader.loadClass(Unknown Source)
        at java.lang.ClassLoader.loadClass(Unknown Source)
        at sun.launcher.LauncherHelper.checkAndLoadMain(Unknown Source)
```
#### 2.2、准备
::: tip 概念
准备阶段是正式为类变量分配内存并设置类变量初始值的阶段。
:::
+ static变量在JDK7之前存储于instanceKlass末尾，从JDK7开始，存储于_java_mirror末尾；
+ static变量分配空间和赋值是两个步骤，分配空间在准备阶段完成，赋值在初始化阶段完成；
+ 如果static变量是final的基本类型，以及字符串常量，那么编译阶段值就确定了，赋值在准备阶段完成；
+ 如果static变量是final的，但属于引用类型，那么赋值也会在初始化阶段完成；
```java
public class ClassLoader {
    private static final int a = 20;
    private static final String b = "hello";
    private static final Object obj = new Object();

    public static void main(String[] args) {

    }
}
```
使用javap -p -v 查看字节码：
```java{43-46,48-51,53-55,88-91}
Classfile /E:/Intellj-workspace/JVM/target/classes/com/oamha/jvm/classloader/ClassLoader.class
  Last modified 2021-3-11; size 630 bytes
  MD5 checksum dc3fd3c87df1eb1dab211a446db2c88c
  Compiled from "ClassLoader.java"
public class com.oamha.jvm.classloader.ClassLoader
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #2.#28         // java/lang/Object."<init>":()V
   #2 = Class              #29            // java/lang/Object
   #3 = Fieldref           #4.#30         // com/oamha/jvm/classloader/ClassLoader.obj:Ljava/lang/Object;
   #4 = Class              #31            // com/oamha/jvm/classloader/ClassLoader
   #5 = Utf8               a
   #6 = Utf8               I
   #7 = Utf8               ConstantValue
   #8 = Integer            20
   #9 = Utf8               b
  #10 = Utf8               Ljava/lang/String;
  #11 = String             #32            // hello
  #12 = Utf8               obj
  #13 = Utf8               Ljava/lang/Object;
  #14 = Utf8               <init>
  #15 = Utf8               ()V
  #16 = Utf8               Code
  #17 = Utf8               LineNumberTable
  #18 = Utf8               LocalVariableTable
  #19 = Utf8               this
  #20 = Utf8               Lcom/oamha/jvm/classloader/ClassLoader;
  #21 = Utf8               main
  #22 = Utf8               ([Ljava/lang/String;)V
  #23 = Utf8               args
  #24 = Utf8               [Ljava/lang/String;
  #25 = Utf8               <clinit>
  #26 = Utf8               SourceFile
  #27 = Utf8               ClassLoader.java
  #28 = NameAndType        #14:#15        // "<init>":()V
  #29 = Utf8               java/lang/Object
  #30 = NameAndType        #12:#13        // obj:Ljava/lang/Object;
  #31 = Utf8               com/oamha/jvm/classloader/ClassLoader
  #32 = Utf8               hello
{
  private static final int a;
    descriptor: I
    flags: ACC_PRIVATE, ACC_STATIC, ACC_FINAL
    ConstantValue: int 20

  private static final java.lang.String b;
    descriptor: Ljava/lang/String;
    flags: ACC_PRIVATE, ACC_STATIC, ACC_FINAL
    ConstantValue: String hello

  private static final java.lang.Object obj;
    descriptor: Ljava/lang/Object;
    flags: ACC_PRIVATE, ACC_STATIC, ACC_FINAL

  public com.oamha.jvm.classloader.ClassLoader();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/oamha/jvm/classloader/ClassLoader;

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=0, locals=1, args_size=1
         0: return
      LineNumberTable:
        line 10: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       1     0  args   [Ljava/lang/String;

  static {};
    descriptor: ()V
    flags: ACC_STATIC
    Code:
      stack=2, locals=0, args_size=0
         0: new           #2                  // class java/lang/Object
         3: dup
         4: invokespecial #1                  // Method java/lang/Object."<init>":()V
         7: putstatic     #3                  // Field obj:Ljava/lang/Object;
        10: return
      LineNumberTable:
        line 6: 0
}
SourceFile: "ClassLoader.java"
```
可以看到静态常量a,b的值已经由`ConstantValue`字段确定了，而obj的初始化步骤还需要在static片段中取执行；
#### 2.2、解析
::: tip 概念
虚拟机将常量池内的符号引用替换为直接引用的过程
::: 
### 3、初始化阶段
::: tip 概念
初始化即调用`<clinit>()V` ，虚拟机会保证这个类的构造方法的线程安全,`<clinit>()V`方法是由编译器自动收集类中的所有类变量的赋值动作和静态语句块中的语句合并产生的。
:::
<b>类初始化是懒惰的，下面的情况会导致类的初始化:</b>
+ main方法所在的类，总会被首先初始化；
+ 首次访问这个类的静态变量或静态方法时；
+ 子类初始化，如果父类还没初始化，会引发；
+ 子类访问父类的静态变量，只会触发父类的初始化；
+ Class.forName；
+ new会导致初始化；

<b>不会导致类初始化的情况</b>
+ 访问类的static final静态常量（基本类型和字符串）不会触发初始化(静态常量在准备阶段已经确定)；
+ 类对象.class不会触发初始化(类对象在加载阶段已经在堆中创建)；
+ 创建该类的数组不会触发初始化；
```java
public class ClassLoader2 {
    static {
        System.out.println("main initialized");
    }

    public static void main(String[] args) throws ClassNotFoundException {
        //初次访问类的静态变量会触发初始化
        //System.out.println(B.b);
        //初次访问类的静态方法会触发初始化
        //B.testInit();
        //子类访问父类的静态变量，只会触发父类的初始化
        //System.out.println(B.a);
        //new导致初始化
        //new B();
        //Class.forName不会导致初始化（initialize参数为false）
        //java.lang.ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        //Class<?> aClass = Class.forName("com.oamha.jvm.classloader.B", false, contextClassLoader);
        //loadClass不会触发初始化
        //java.lang.ClassLoader contextClassLoader = Thread.currentThread().getContextClassLoader();
        //contextClassLoader.loadClass("com.oamha.jvm.classloader.A");
        //访问类对象不会初始化
        //System.out.println(B.class);
        //创建数组不会初始化
        //System.out.println(new B[10]);
        //访问类的基本类型常量或者字符串常量不会触发初始化
        //System.out.println(B.c);
        //System.out.println(B.str);
    }
}

class A {
   static int a = 10;

    static {
        System.out.println("A initialized");
    }
}

class B extends A {
    static int b = 10;
    static final int c = 10;
    static final String str = "str";

    public static void testInit() {
        System.out.println("static method");
    }

    static {
        System.out.println("B initialized");
    }
}
```