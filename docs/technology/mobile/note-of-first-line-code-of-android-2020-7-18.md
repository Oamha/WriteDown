## Android第一行代码读书笔记
::: tip 前言
看了一下Android第一行代码这本书，记录一下自己以前没有留意的知识点。
:::

+ Andy Rubin创办了Android之后，后期被Google收购。Android操作系统2008年推出第一个版本后，发展受到iPhone的阻挠，又因为使用Java开发语言被甲骨文公司控告侵犯知识产权，所以后期决定采用Kotlin作为其开发语言;

+ Android系统推出仅仅两年，市场占有率就超过了诺基亚的Symbian(塞班)操作系统;

+ 为什么项目最外层的build.gradle依赖了Gradle插件？Gradle并不单单是为了构建Android项目而产生的，还可以构建Java，C++项目，因此要构建Android项目，要依赖Gradle插件，同时它的版本一般跟Android Studio的版本一致;

+ 模块内的build.gradle文件首行apply plugin "com.android.application"和apply plugin "com.android.library"的区别：前者是可以运行的应用程序，后者是一个需要依赖其它模块才能运行的库;

+ targetSdkVersion的含义：表示你已经在目标版本上做了充分测试，系统将为你启用最新的功能和特性。比如Android6.0(23)引入了运行时权限，如果将targetSdkVersion设置为22，系统则不会启用该特性;

+ buildTypes闭包下有两个选项：release(生成正式版安装文件)和debug(生成测试版本安装文件); minifyEnabled表示是否混淆;

+ Android三种依赖方式：本地依赖(jar包、目录)、库依赖(模块)和远程依赖;

+ Javac将.java文件转换为字节码文件，由java虚拟机解释执行，Kotlin也是同样的原理;

+ kotlin的val和var的区别：val不能再次赋值，var可以重新赋值;

+ 为什么要单独区分val和var两种定义变量的方式？Java编码规范是除非一个变量明确表明是可变的，否则都应该加上final修饰符，而绝大多数程序员没有这个习惯，仅仅因为final修饰符是可选的，这就造成了在分工合作时一个变量常常被多人修改，这是不安全的。kotlin在设计上就注意到了这一点，所以给出了val和var两种变量定义方式，由开发人员明确给出可变还是不可变;

+ kotlin的类为什么默认是不能继承的？这跟Java中final变量是同一个道理，除非一个类是为继承专门设计的，否则都应该用final修饰。

+ kotlin中，一个类继承父类时，有主构造函数，被继承的父类才加()，只有次构造函数时，不用加();

+ kotlin中，同时有主构造函数和次构造函数时，次构造函数要直接或间接调用主构造函数;

+ data关键字用于生成一个数据类，自动生成equals()、hashCode()、toString()等固定且无实际逻辑意义的方法;

+ object关键字可以用来声明一个单例类, 也可以用来生成一个匿名类实例;

+ 当lambda参数是函数的最后一个参数时，可以将lambda参数移到函数括号的外面;

+ 当lambda参数是函数的唯一一个参数时，函数的括号可以省略;

+ kotlin拥有出色的类型推导机制，lambda表达式的参数列表大多数情况下不用声明参数类型;
 
+ 当lambda表达式的参数列表只有一个参数时，也不必声明参数名，直接用it替代;

+ kotlin将非空检测提前到编译期间，检测通过才能运行;

+ `obj?.let{}`的形式可以简化多条语句的非空判断;

+ kotlin的if和when是有返回值的;

+ kotlin调用java的方法时，如果方法接收一个单抽象方法接口作为参数，则可以使用函数式API的形式进行调用,如：
``` kotlin
Thread {
    //do something
}.start()
```
+ kotlin隐藏了java的Getter、Setter细节;

+ 一个Intent只能指定一个action, 但是可以指定多个category;

+ Intent.ACTION_DIAL 可以打开拨号界面;

+ kotlin中javaClass.simpleName相当于java中getClass(), 而XXX::class.java相当于XXX.class;

+ 通常使用一个伴生类来描述启动一个Activity所需的参数， 如：
``` kotlin
class TestActivity: AppCompatActivity(){
    companion object{
        fun start(context: Context, data: String){
            val intent = Intent(context, AnotherActivity::class.java)
            intent.putExtra("param", data)
            context.startActivity(intent)
        }
    }
    ...
}
```
+ with、run、apply标准函数（定义在standard.kt文件中)的区别：
  - with在参数中传入上下文;
  - run以对象调用的形式;
  - apply无法指定返回值，默认返回调用对象;

+ kotlin定义静态的方法的三种方式：
  - object单例;
  - 伴生类;
  - 注解和顶层方法;
::: warning
前两种不是真正意义上的静态方法；

注解要加在单例类或伴生类的方法上；

顶层方法指的是没有定义在任何类中的方法，在.kt文件中，kotlin可以直接调用，java则需要按照XXXKt.methodName的形式;
:::

+ lateinit可以延迟对成员变量的初始化, ::XXX.isInitialized可以判断变量是否被初始化;

+ sealed class(密封类)可以避免分支遗忘，如一个密封类有个三个子类，现在判断一个实例是哪个子类的实例，使用when关键字会被强制要求判断三个分支;

+ kotlin的拓展函数特性允许向一个类增加方法，即使是final类型的，如向String类添加方法，定义一个String.kt文件(通常拓展哪个类就定义一个同名的.kt文件):
``` kotlin
fun String.letterCount(): Int{
  var count = 0
  for(ch in this){
    if(ch.isLetter()){
      count++
    }
  }
  return count
}
```
然后就可以这样调用了，"test".letterCount()

+ kotlin的运算符重载特性：

实现字符串和数字相乘，达到多个相同字符串拼接的效果
``` kotlin
operator fun String.times(n: Int) = repeat(n)
```

实现对象和数字相加
```kotlin
class Money(val value: Int){
  operator fun plus(money: Int){
    return Money(value + money)
  }
}
```
可重载的运算符有plus(+), minus(-), times(*), div(/), rem(%), inc(++), dec(--), not(!), equals(==, >, <), contains(in), rangeTo(a..b), get(a[b]), set(a[b]=c)

+ 广播可以静态注册和动态注册，动态注册在应用启动后才能收到广播，静态注册在未启动的时候也能收到广播;

+ Android在8.0后大部分隐式广播（没有指明发送给哪个应用的广播）使用静态注册就收不到了,防止应用在后台自行唤醒。大多数系统广播都是隐式广播，但仍然有少量的系统广播可以进行静态注册，如BOOT_COMPLETE;

+ 自定义广播都是隐式广播，因此静态注册自定义广播要调用intent.setPackage方法设置要发送给指定的应用;
