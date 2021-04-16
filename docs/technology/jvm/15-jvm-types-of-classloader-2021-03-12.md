## 类加载器
### 1、分类
|名称|加载类的位置|说明|
|:----:|:----:|:----:|
|Bootstrap ClassLoader|<JAVA_HOME>/jre/lib|无法直接访问|
|Ext ClassLoader|<JAVA_HOME>/jre/lib/ext|上级为启动类加载器|
|App ClassLoader|classpath|上级为拓展类加载器|
|自定义类加载器|自定义路径|上级为系统类加载器|
### 2、启动类加载器
启动类加载器用于加载系统的一些核心类
#### 2.1、查看加载的内容
可以通过`sun.boot.class.path`系统属性查看启动类加载器具体加载了哪些jar包；
```java
System.out.println("BootClassPath: " + System.getProperty("sun.boot.class.path"));
```
#### 2.2、验证
String类是系统的核心类，它位于`<JAVA_HOME>/jre/lib/rt.jar`，属于启动类加载器的加载范围，可以打印一下它的类加载器
```java
System.out.println(String.class.getClassLoader());
```
运行结果：
```
null
```
从结果来看，启动类加载器是不允许我们获取到的。
::: tip 补充
我们还可以通过jvm参数`-Xbootclasspath`修改启动类加载器的加载路径，比如：`java -Xbootclasspath/a:. Test`，
其中`/a:.`表示在原来加载路径后面追加当前路径，把Test类也纳入启动类加载器的加载范围；
:::
### 3、拓展类加载器
#### 3.1、查看加载的内容
拓展类加载器用于加载一些拓展类，可以通过`java.ext.dirs`系统属性查看启动类加载器具体加载了哪些jar包；
```java
System.out.println("ExtClassPath: " + System.getProperty("java.ext.dirs"));
```
#### 3.2、验证
```java
public class ClassLoader4 {
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> aClass = Class.forName("com.oamha.jvm.classloader.G"); //加载自定义的G类
        System.out.println(aClass.getClassLoader());
    }
}

class G {
    static {
        System.out.println("G init");
    }
}
```
运行结果：
```java
G init
sun.misc.Launcher$AppClassLoader@18b4aac2
```
正常情况下，我们自己写的类都是由AppClassLoader来加载的。<br/>
下面我们对G类进行打包`jar -cvf test.jar com\oamha\jvm\classloader\G.class`，将jar包放入`<JAVA_HOME>/jre/lib/ext`目录下，再运行程序：
```java
G init
sun.misc.Launcher$ExtClassLoader@29453f44
```
可以看到已经是拓展类加载器加载的G类了。
### 4、系统类加载器
#### 4.1、查看加载的内容
系统类加载器用于加载自己写的类，可以通过`java.class.path`系统属性查看系统类加载器具体加载哪些类；
```java
System.out.println(System.getProperty("java.class.path"));
```
#### 4.2、验证
获取系统类加载器
```java
System.out.println(java.lang.ClassLoader.getSystemClassLoader());
```
### 5、自定义类加载器
#### 5.1、实现
```java
public class ClassLoader5 extends java.lang.ClassLoader {
    public static void main(String[] args) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        ClassLoader5 classLoader5 = new ClassLoader5();
        Class<?> g1 = classLoader5.loadClass("G");
        Class<?> g2 = classLoader5.loadClass("G");
        System.out.println(g1 == g2);
        Object o = g1.newInstance();
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        String path = "E://" + name + ".class";
        try {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            Files.copy(Paths.get(path), bos);
            byte[] bytes = bos.toByteArray();
            return defineClass(name, bytes, 0, bytes.length);
        } catch (IOException e) {
            e.printStackTrace();
            throw new ClassNotFoundException();
        }
    }
}
```
自定义类加载器的流程：
+ 继承自ClassLoader，重写findClass方法；
+ 读取类的字节码文件；
+ 调用父类的defineClass方法加载类；
+ 调用者调用loadClass来加载类；
### 6、双亲委派模式
所谓的双亲委派，就是指调用类加载器的 loadClass 方法时，查找类的规则
```java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
{
    synchronized (getClassLoadingLock(name)) {
        // First, check if the class has already been loaded
        //查看当前类加载器是否加载过该类
        Class<?> c = findLoadedClass(name);
        if (c == null) {
            long t0 = System.nanoTime();
            try {
                if (parent != null) {
                    //如果当前类加载器没加载过，查看父级类加载器有没有加载过；
                    c = parent.loadClass(name, false);
                } else {
                    //如果父级类加载器为null，说明父级类加载器是启动类加载器，查询启动类加载器有无加载过；
                    c = findBootstrapClassOrNull(name);
                }
            } catch (ClassNotFoundException e) {
                // ClassNotFoundException thrown if class not found
                // from the non-null parent class loader
            }

            if (c == null) {
                // If still not found, then invoke findClass in order
                // to find the class.
                long t1 = System.nanoTime();
                //如果父级类加载器也没加载过， 尝试自己加载
                c = findClass(name);

                // this is the defining class loader; record the stats
                sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                sun.misc.PerfCounter.getFindClasses().increment();
            }
        }
        if (resolve) {
            resolveClass(c);
        }
        return c;
    }
}
```