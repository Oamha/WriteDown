---
siderbar: 'auto'
---
## 单例模式
::: tip 需求
开发过程中，有些类我们可能希望它只有一个实例对象，而不想它被实例化多次，单例模式可以满足这个需求。
:::
### 1、第一种
饿汉式单例模式
```java{2,4}
public final class Singleton {
    private static final Singleton INSTANCE = new Singleton();

    private Singleton() {
    }

    public static Singleton getInstance() {
        return INSTANCE;
    }
}
```
可以饿汉式单例模式在类初始化时就会创建该类的对象，而不是等到需要用的时候才去创建，它由jvm来保证创建时的线程安全。
### 2、第二种
```java{8-10}
public final class Singleton1 {
    private static Singleton1 instance;

    private Singleton1() {
    }

    public static Singleton1 getInstance() {
        if(instance == null){
            instance = new Singleton1();
        }
        return instance;
    }
}
```
可以看到这种单例模式是在需要时才会创建对象，但多线程访问时会重复创建对象；
### 3、第三种
```java{7}
public final class Singleton2 {
    private static Singleton2 instance;

    private Singleton2() {
    }

    public static synchronized Singleton2 getInstance() {
        if (instance == null) {
            instance = new Singleton2();
        }
        return instance;
    }
}
```
这种单例模式对静态方法加了同步锁，虽然避免了多个线程并发访问导致的重复创建对象问题，但影响了效率；
### 4、第四种
```java
public final class Singleton3 {
    private static Singleton3 instance;

    private Singleton3() {
    }

    public static Singleton3 getInstance() {
        if (instance == null) {
            synchronized (Singleton3.class) {
                instance = new Singleton3();
            }
        }
        return instance;
    }
}
```
这种单例模式虽然缩小了加锁范围，但同样存在多线程重复创建对象问题。当一个线程退出同步代码段时，之前因为获取不到同步锁而阻塞的线程已经判断过`instance==null`成立，当其获取到同步锁时，便继续执行，从而再次创建了对象。为了解决这个问题，可以采用双重锁检验的机制，如下面这种写法。
### 5、第五种
```java
public final class Singleton4 {
    //加上volatile防止指令重排
    private static volatile Singleton4 instance;

    private Singleton4() {

    }

    public static Singleton4 getInstance() {
        if (instance == null) {
            synchronized (Singleton4.class) {
                if (instance == null) {
                    instance = new Singleton4();
                }
            }
        }
        return instance;
    }
}
```
这种写法既没有重复创建对象的问题，也保证了效率。注意，这里声明变量时加上了volatile，主要是为了防止指令重排序。我们可以看一下`getInstance`方法的字节码：
```java{14-17}
public static com.oamha.patterns.singleton.Singleton4 getInstance();
    descriptor: ()Lcom/oamha/patterns/singleton/Singleton4;
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=0
         0: getstatic     #2                  // Field instance:Lcom/oamha/patterns/singleton/Singleton4;
         3: ifnonnull     37
         6: ldc           #3                  // class com/oamha/patterns/singleton/Singleton4
         8: dup
         9: astore_0
        10: monitorenter
        11: getstatic     #2                  // Field instance:Lcom/oamha/patterns/singleton/Singleton4;
        14: ifnonnull     27
        17: new           #3                  // class com/oamha/patterns/singleton/Singleton4
        20: dup
        21: invokespecial #4                  // Method "<init>":()V
        24: putstatic     #2                  // Field instance:Lcom/oamha/patterns/singleton/Singleton4;
        27: aload_0
        28: monitorexit
        29: goto          37
        32: astore_1
        33: aload_0
        34: monitorexit
        35: aload_1
        36: athrow
        37: getstatic     #2                  // Field instance:Lcom/oamha/patterns/singleton/Singleton4;
        40: areturn
```
+ new表示创建对象，创建完成将引用放入操作数栈；
+ dup表示复制一份该对象的引用，放入操作数栈，一会用它去调用构造方法；
+ invokespecial表示调用构造方法，调用完成之后对象的引用出栈；
+ putstatic表示把操作数栈中剩余的一份引用赋值给成员变量；

问题是有些时候jvm会做一些优化，进行指令重排，导致先执行putstatic，再执行invokespecial。假设出现这样的情况：一个线程正在执行putstatic，但还没执行invokespecial（还没执行构造方法，虽然对象的内存空间已经分配，但构造函数里的逻辑还没执行），这时另一个线程来了，它会发现`instance == null`不成立，这时直接返回了一个不完整的对象。
### 6、第六种
```java
public final class Singleton5 {

    private Singleton5() {
    }

    private static class SingletonHolder {
        private static final Singleton5 INSTANCE = new Singleton5();
    }

    public static Singleton5 getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```
静态内部类的形式也保证了懒加载，同时也避免了对象重复创建。
### 7、第七种
```java
public enum Singleton6 {

    INSTANCE;

    public static Singleton6 getInstance() {
        return INSTANCE;
    }
}
```
使用枚举类也能实现单例，而且它具有防止反序列化生成多个对象的优点，比如下面的代码：
```java
public enum Singleton6 {

    INSTANCE;

    public static Singleton6 getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        //将对象序列化到文件
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("obj.txt"));
        objectOutputStream.writeObject(INSTANCE);
        objectOutputStream.flush();
        objectOutputStream.close();
        //反序列化后仍然是同一个实例对象
        ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream("obj.txt"));
        Singleton6 o = (Singleton6) objectInputStream.readObject();
        objectInputStream.close();
        System.out.println(o == INSTANCE); //true
    }
}
```
前面的几种单例模式，将对象序列化到文件再反序列化，会创建新的对象，而使用枚举单例不会出现这样的情况。这是因为ObjectOutputStream在序列化时会先在writeObject0方法中判断实例类型，如果是Enum类型，那么会调用writeEnum方法只将枚举实例的name属性进行序列化。
<Common-Thumb :prefix="'/img/technology/'" :urls="'write-enum.png'"/>

而在反序列化时也会在ObjectInputStream的readObject0中判断实例类型，如果是Enum类型，根据name去查找对应的枚举实例，即将原来的实例返回，而不会创建对象。
<Common-Thumb :prefix="'/img/technology/'" :urls="'read-enum.png'"/>

另外，枚举单例还能防止反射创建对象，这就比较强大了，前面的几种单例都不能满足。
```java
public enum Singleton6 {
    INSTANCE;

    public static Singleton6 getInstance() {
        return INSTANCE;
    }

    public static void main(String[] args) throws IllegalAccessException, InvocationTargetException, InstantiationException {
        //通过反射调用枚举类两个参数的构造方法
        Constructor<?>[] declaredConstructors = Singleton6.class.getDeclaredConstructors();
        Singleton6 instance = (Singleton6) declaredConstructors[0].newInstance("INSTANCE2", 2);
        System.out.println(instance);
    }
}
```
运行结果：
```java
Exception in thread "main" java.lang.IllegalArgumentException: Cannot reflectively create enum objects
```
可以看到newInstance方法对Enum类型进行了判断，利用反射创建枚举实例会报错：
```java{11,12}
public T newInstance(Object ... initargs)
        throws InstantiationException, IllegalAccessException,
               IllegalArgumentException, InvocationTargetException
{
    if (!override) {
        if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {
            Class<?> caller = Reflection.getCallerClass();
            checkAccess(caller, clazz, null, modifiers);
        }
    }
    if ((clazz.getModifiers() & Modifier.ENUM) != 0)
        throw new IllegalArgumentException("Cannot reflectively create enum objects");
    ConstructorAccessor ca = constructorAccessor;   // read volatile
    if (ca == null) {
        ca = acquireConstructorAccessor();
    }
    @SuppressWarnings("unchecked")
    T inst = (T) ca.newInstance(initargs);
    return inst;
}
```
另外，补充一点：
如果普通的单例想防止反序列化创建新的对象，可以在类中提供一个`readResolve`方法，如下：
```java{16-18}
public class Singleton5 implements Serializable {
    private static final long serialVersionUID = 1L;

    private Singleton5() {
    }

    private static class SingletonHolder {
        private static final Singleton5 INSTANCE = new Singleton5();
    }

    public static Singleton5 getInstance() {
        return SingletonHolder.INSTANCE;
    }

    //反序列化时直接返回单例对象
    public Object readResolve(){
        return SingletonHolder.INSTANCE;
    }
}
```