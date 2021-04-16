### Java内部类
<strong>Java中有四种内部类：</strong>
+ 成员内部类
+ 局部内部类
+ 匿名内部类
+ 静态内部类
### 1、成员内部类
成员内部类类似于成员变量，定义在类中。
```java
public class MemberInnerClass {
    private int a;

    class InnerClass {
    }
}
```
除了静态内部类，其它内部类会持有外部类的引用，有可能导致外部类使用完无法释放，从而导致内存泄漏。使用javap反编译后MemberInnerClass$InnerClass.class，可以看到其有一个this$0的成员变量，这就是外部类的引用，同时在构造方法中会为this$0赋值.
```java{36,48}
Classfile /E:/Intellj-workspace/FifteenDays/practice-java-basis/target/classes/com/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass.class
  Last modified 2021-4-7; size 648 bytes
  MD5 checksum 94def544c20d197dc198721bd026b560
  Compiled from "MemberInnerClass.java"
class com.oamha.fifteen.days.basis.innerclass.MemberInnerClass$InnerClass
  minor version: 0
  major version: 52
  flags: ACC_SUPER
Constant pool:
   #1 = Fieldref           #3.#18         // com/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass.this$0:Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;
   #2 = Methodref          #4.#19         // java/lang/Object."<init>":()V
   #3 = Class              #21            // com/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass
   #4 = Class              #22            // java/lang/Object
   #5 = Utf8               this$0
   #6 = Utf8               Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;
   #7 = Utf8               <init>
   #8 = Utf8               (Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;)V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               InnerClass
  #14 = Utf8               InnerClasses
  #15 = Utf8               Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass;
  #16 = Utf8               SourceFile
  #17 = Utf8               MemberInnerClass.java
  #18 = NameAndType        #5:#6          // this$0:Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;
  #19 = NameAndType        #7:#23         // "<init>":()V
  #20 = Class              #24            // com/oamha/fifteen/days/basis/innerclass/MemberInnerClass
  #21 = Utf8               com/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass
  #22 = Utf8               java/lang/Object
  #23 = Utf8               ()V
  #24 = Utf8               com/oamha/fifteen/days/basis/innerclass/MemberInnerClass
{
    //成员变量
  final com.oamha.fifteen.days.basis.innerclass.MemberInnerClass this$0;
    descriptor: Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;
    flags: ACC_FINAL, ACC_SYNTHETIC

    //构造方法 
  com.oamha.fifteen.days.basis.innerclass.MemberInnerClass$InnerClass(com.oamha.fifteen.days.basis.innerclass.MemberInnerClass);
    descriptor: (Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;)V
    flags:
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: aload_1
         2: putfield      #1                  //给this$0赋值
         5: aload_0
         6: invokespecial #2                  // Method java/lang/Object."<init>":()V
         9: return
      LineNumberTable:
        line 9: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      10     0  this   Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass;
            0      10     1 this$0   Lcom/oamha/fifteen/days/basis/innerclass/MemberInnerClass;
}
SourceFile: "MemberInnerClass.java"
InnerClasses:
     #13= #3 of #20; //InnerClass=class com/oamha/fifteen/days/basis/innerclass/MemberInnerClass$InnerClass of class com/oamha/fifteen/days/basis/innerclass/MemberInnerClass
```
### 2、局部内部类
局部内部类定义在方法块中。
```java
public class LocalInnerClass {
    public static void main(String[] args) {
        class LocalClass {

        }
    }
}
```
### 3、静态内部类
静态内部类用static修饰，它不会持有外部类的引用，它只能访问外部类的静态成员。如果要访问外部类的其它成员，可以保存外部类的弱引用对象。
```java
public class StaticInnerClass {
    private int a = 10;
    private static String s = "hello";

    static class StaticClass {
        public void test() {
            //System.out.println(a); 静态内部类不能直接访问外部类的非静态成员
            System.out.println(new StaticInnerClass().a);
            System.out.println(s);
        }
    }
}
```
### 4、匿名内部类
匿名内部类使用非常广泛，比如设置一个监听器。
```java
public class AnonymousInnerClass {
    public static void main(String[] args) {
        new AnonymousClass() {
            @Override
            public void doSomething() {
                System.out.println("doSomething...");
            }
        };
    }

    interface AnonymousClass {
        void doSomething();
    }
}
```
### 5、内部类的命名规则
+ 匿名内部类的命名规则为 `OuterClassName$num`，即外部类的类名$数字1、2、3...;
+ 局部内部类的命名规则为 `OuterClassName$functionNumInnerClassName`, 即外部类类名$方法编号+内部类类名
+ 静态内部类和成员内部类的命名规则为 `OuterClassName$InnerClassName`，即外部类类名$内部类类名；
