## Java中的四种引用类型
### 1、强引用
只有所有GC Root对象都不通过强引用引用该对象，该对象才能被回收；
```java
public class StrongReferenceTest {
    public static void main(String[] args) throws IOException {
        StrongReferenceTest o = new StrongReferenceTest();
        o = null;
        System.gc();
        System.in.read();
    }

    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize");
    }
}
```
运行结果：
```java
finalize
```
### 2、软引用
只有在内存不足时，GC才会回收软引用对象
```java
public class SoftReferenceTest {
    //设置堆大小-Xmx20m
    public static void main(String[] args) {
        List<SoftReference<byte[]>> list = new ArrayList<>();
        int i = 0;
        for (i = 0; i < 5; i++) {
            byte[] bytes = new byte[1024 * 1024 * 4]; //4M的字节数组
            SoftReference<byte[]> softReference = new SoftReference<>(bytes);
            list.add(softReference);
            list.forEach(it -> System.out.print(it.get() + " "));
            System.out.println();
        }
    }
}
```
运行结果：
```java
[B@7ba4f24f 
[B@7ba4f24f [B@3b9a45b3 
[B@7ba4f24f [B@3b9a45b3 [B@7699a589 
[B@7ba4f24f [B@3b9a45b3 [B@7699a589 [B@58372a00 
null null null null [B@4dd8dc3 
```
可以看到第五次创建字节数组时内存不足，前4次创建的字节数组已经被回收
::: warning 应用
软引用常用于各种缓存的实现中，如Android中的DiskLRUCache。
:::
### 3、弱引用
弱引用对象一旦被GC察觉到，就会被回收
```java
public class WeakReferenceTest {

    public static void main(String[] args) throws InterruptedException {
        WeakReference<byte[]> weakReference = new WeakReference<>(new byte[1024 * 1024 * 10]);
        System.out.println(weakReference.get());

        System.gc();

        Thread.sleep(1000);
        //GC后被回收
        System.out.println(weakReference.get());
    }
}
```
运行结果：
```java
[B@1540e19d
null
```
### 4、虚引用
虚引用就好像没引用一样，通过get方法也获取不到引用的对象。不过它强制使用一个引用队列，当对象被回收时，该虚引用会入队。
```java
public class PhantomReferenceTest {
    public static void main(String[] args) {
        ReferenceQueue<byte[]> queue = new ReferenceQueue<>();
        PhantomReference<byte[]> phantomReference = new PhantomReference<>(new byte[1024], queue);
        System.out.println(phantomReference.get());
        System.gc();  //字节数组被回收
        Reference<? extends byte[]> reference;
        do {
            //等待虚引用对象被加入引用队列
        } while ((reference = queue.poll()) == null);
        System.out.println(reference);
    }
}
```
运行结果：
```java
null
java.lang.ref.PhantomReference@6d6f6e28
```
::: warning 应用
虚引用用于直接内存(NIO的ByteBuffer)的回收中。Cleaner类继承自PhantomReference，当new出来的ByteBuffer对象被回收时，虚引用对象会被加入到引用队列，然后由ReferenceHandler线程执行该虚引用的clean方法进行直接内存的释放。
:::