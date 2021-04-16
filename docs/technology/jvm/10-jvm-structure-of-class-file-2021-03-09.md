## Java字节码文件结构
### 1、字节码文件结构
根据JVM规范，一个字节码文件的结构可以分为以下这些内容：
```java
ClassFile {
    u4             magic;               //魔数
    u2             minor_version;       //小版本
    u2             major_version;       //大版本
    u2             constant_pool_count; //常量池信息
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;        //访问修饰符
    u2             this_class;          //该类包名类名信息
    u2             super_class;         //父类包名类名信息
    u2             interfaces_count;    //接口信息
    u2             interfaces[interfaces_count];
    u2             fields_count;        //属性信息
    field_info     fields[fields_count];
    u2             methods_count;       //方法信息
    method_info    methods[methods_count];
    u2             attributes_count;    //附加的属性信息
    attribute_info attributes[attributes_count];
}
```
### 2、使用javap反编译工具查看
通常以16进制打开一个.class文件看起来会很困难，但利用javap工具反编译之后看起来就会简单很多
```java
public class RunProcedure {
    public static void main(String[] args) {
        int a = 10;
        int b = Short.MAX_VALUE + 1;
        int c = a + b;
        System.out.println(c);
    }
}
```
java代码反编译之后：
```java
Classfile /E:/Intellj-workspace/JVM/target/classes/com/oamha/jvm/bytecode/RunProcedure.class //文件路径
  Last modified 2021-3-9; size 644 bytes          //修改时间，大小
  MD5 checksum 6d18254ac4e7297383be5c36248685c2   //文件签名
  Compiled from "RunProcedure.java"               //源文件
public class com.oamha.jvm.bytecode.RunProcedure  //全限定名
  minor version: 0                                //小版本号
  major version: 52                               //大版本号
  flags: ACC_PUBLIC, ACC_SUPER                    //访问修饰符

//常量池信息
Constant pool:
   #1 = Methodref          #7.#25         // java/lang/Object."<init>":()V
   #2 = Class              #26            // java/lang/Short
   #3 = Integer            32768
   #4 = Fieldref           #27.#28        // java/lang/System.out:Ljava/io/PrintStream;
   #5 = Methodref          #29.#30        // java/io/PrintStream.println:(I)V
   #6 = Class              #31            // com/oamha/jvm/bytecode/RunProcedure
   #7 = Class              #32            // java/lang/Object
   #8 = Utf8               <init>
   #9 = Utf8               ()V
  #10 = Utf8               Code
  #11 = Utf8               LineNumberTable
  #12 = Utf8               LocalVariableTable
  #13 = Utf8               this
  #14 = Utf8               Lcom/oamha/jvm/bytecode/RunProcedure;
  #15 = Utf8               main
  #16 = Utf8               ([Ljava/lang/String;)V
  #17 = Utf8               args
  #18 = Utf8               [Ljava/lang/String;
  #19 = Utf8               a
  #20 = Utf8               I
  #21 = Utf8               b
  #22 = Utf8               c
  #23 = Utf8               SourceFile
  #24 = Utf8               RunProcedure.java
  #25 = NameAndType        #8:#9          // "<init>":()V
  #26 = Utf8               java/lang/Short
  #27 = Class              #33            // java/lang/System
  #28 = NameAndType        #34:#35        // out:Ljava/io/PrintStream;
  #29 = Class              #36            // java/io/PrintStream
  #30 = NameAndType        #37:#38        // println:(I)V
  #31 = Utf8               com/oamha/jvm/bytecode/RunProcedure
  #32 = Utf8               java/lang/Object
  #33 = Utf8               java/lang/System
  #34 = Utf8               out
  #35 = Utf8               Ljava/io/PrintStream;
  #36 = Utf8               java/io/PrintStream
  #37 = Utf8               println
  #38 = Utf8               (I)V

{
    //构造方法
  public com.oamha.jvm.bytecode.RunProcedure();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
    //stack表示操作数栈的最大深度，locals表示局部变量表的槽位数，args_size表示参数个数
      stack=1, locals=1, args_size=1
         0: aload_0           //将局部变量表中的0号槽位存储的this引用加载到操作数栈
         1: invokespecial #1  //调用init方法
         4: return            
                              //行号表，字节码行数与源代码行数一一对应
      LineNumberTable:
        line 3: 0             //3对应源代码的第三行，0代表字节码的0
                              //局部变量表，存储方法内用到的局部变量
      LocalVariableTable:     
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lcom/oamha/jvm/bytecode/RunProcedure;

    //main方法
  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=4, args_size=1
         0: bipush        10  //向操作数栈压入一个常量10
         2: istore_1          //将10出栈，存储到局部变量表的1号槽位，即a=10
         3: ldc           #3  //从常量池中加载整数32768到操作数栈          
         5: istore_2          //将32768出栈，存储到局部变量表的2号槽位，即b=32768
         6: iload_1           //将局部变量表1号槽位的10压入栈中
         7: iload_2           //将局部变量表2号槽位的32768压入栈中
         8: iadd              //将操作数栈中32768和10出栈，执行相加，将结果压入栈中
         9: istore_3          //将结果出栈，存储到局部变量表中的3号槽位，即c=a+b
        10: getstatic     #4  //获取静态属性System.out                
        13: iload_3           //将c的值从局部变量表中压入栈中
        14: invokevirtual #5  //调用println方法进行打印               
        17: return
      LineNumberTable:
        line 5: 0
        line 6: 3
        line 7: 6
        line 8: 10
        line 9: 17
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      18     0  args   [Ljava/lang/String;
            3      15     1     a   I
            6      12     2     b   I
           10       8     3     c   I
}
SourceFile: "RunProcedure.java"
```
### 3、常见的字节码指令
+ aload_x 表示将局部变量表中x号槽位对应的对象引用加载到操作数栈中；
+ iload_x 和aload_x很相似，不过加载的是整形数字;
+ istore_x 表示将操作数栈顶元素出栈，存储到局部变量表的x号槽位中；
+ ldc 表示从常量池加载数据；
+ bipush 表示将一个常数压入栈中；
+ 当一个数取值在-1~5时，将该常数压入栈使用的是iconst，这个常数直接和方法字节码指令存放在一块;
+ 当一个数取值在-128~127采用bipush指令，这个常数直接和方法字节码指令存放在一块；
+ 当一个数取值在-32768~32767采用sipush指令，这个常数直接和方法字节码指令存放在一块；
+ 当一个数取值在-2147483648~2147483647，这个常数存储在运行时常量池中；