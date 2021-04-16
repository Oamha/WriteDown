## 直接内存
::: tip 概念
直接内存不属于Java虚拟机的内存管理，它属于操作系统的内存。
:::
### 1、特点
+ 常用于NIO操作，用于数据缓存区；
+ 分配回收成本高，但读写性能高；
+ 不受JVM内存管理；
### 2、性能测试
两种IO形式进行文件读取：
```java
public class DirectMemoryTest {

    static final String FROM = "D:\\linux\\ubuntu-14.04.6-desktop-amd64.iso";
    static final String TO = "E:\\ubuntu.iso";
     static final int CAPACITY = 1024 * 1024;
    static final int RATE = 1000 * 1000;

    public static void main(String[] args) {
        normalIO();

        nio();
    }

    private static void nio() {
        long l = System.nanoTime();
        try (FileChannel from = new FileInputStream(FROM).getChannel();
             FileChannel to = new FileOutputStream(TO).getChannel()) {
            ByteBuffer buffer = ByteBuffer.allocateDirect(CAPACITY);
            while (from.read(buffer) != -1) {
                buffer.flip();
                to.write(buffer);
                buffer.clear();
            }
            System.out.println((System.nanoTime() - l) / RATE);
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private static void normalIO() {
        long start = System.nanoTime();
        try (FileInputStream fis = new FileInputStream(FROM);
             FileOutputStream fos = new FileOutputStream(TO)) {
            byte[] bytes = new byte[CAPACITY];
            int len;
            while ((len = fis.read(bytes)) != -1) {
                fos.write(bytes, 0, len);
            }
            fos.flush();
            System.out.println((System.nanoTime() - start) / RATE);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

运行结果：
2320
882
```
可见直接内存IO的效率是普通IO的三倍左右；
### 3、直接内存的内存溢出
```java
public class DirectMemoryTest1 {
    static final int SIZE = 100 * 1024 * 1024;

    public static void main(String[] args) {
        List<ByteBuffer> bufferList = new ArrayList<>();
        int count = 0;
        try {
            while (true) {
                //每次分配100M内存
                bufferList.add(ByteBuffer.allocateDirect(SIZE));
                Thread.sleep(1000);
                count++;
            }
        } catch (Throwable e) {
            System.out.println(count);
            e.printStackTrace();
        }
    }
}

运行结果：
45
java.lang.OutOfMemoryError: Direct buffer memory
```
### 4、直接内存的分配原理
直接内存的分配是靠`Unsafe`类中的`allocateMemory`来实现的。
```java
public class DirectMemoryTest3 {

    private static final long _1GB = 1024 * 1024 * 1024;

    public static void main(String[] args) throws IOException {
        Unsafe unsafe = getUnSafe();
        long base = unsafe.allocateMemory(_1GB);
        unsafe.setMemory(base, _1GB, (byte) 0);
        System.out.println("分配完成");
        System.in.read();

        unsafe.freeMemory(base);
        System.out.println("回收完成");
        System.in.read();
    }

    private static Unsafe getUnSafe() {
        try {
            Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
            theUnsafe.setAccessible(true);
            return (Unsafe) theUnsafe.get(null);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

}
```
### 5、直接内存的释放原理
直接内存的释放依靠虚引用和`Unsafe`类的`freeMemory`方法来完成。
```java{18,30,41,59,84}
//ByteBuffer.allocateDirect创建了一个DirectByteBuffer对象
public static ByteBuffer allocateDirect(int capacity) {
    return new DirectByteBuffer(capacity);
}

//DirectByteBuffer构造方法中利用unsafe.allocateMemory分配内存；
//同时创建了一个Cleaner的实例，Cleaner继承自虚引用PhantomReference，当ByteBuffer对象被回收时，该虚引用会进行引用队列；
//创建Cleaner对象时还传入了一个Deallocator对象，它继承自Runnable对象，在它的run方法中调用unsafe的freeMemory方法进行直接内存回收；
DirectByteBuffer(int cap) {                  
    super(-1, 0, cap, cap);
    boolean pa = VM.isDirectMemoryPageAligned();
    int ps = Bits.pageSize();
    long size = Math.max(1L, (long)cap + (pa ? ps : 0));
    Bits.reserveMemory(size, cap);

    long base = 0;
    try {
        base = unsafe.allocateMemory(size);
    } catch (OutOfMemoryError x) {
        Bits.unreserveMemory(size, cap);
        throw x;
    }
    unsafe.setMemory(base, size, (byte) 0);
    if (pa && (base % ps != 0)) {
        // Round up to page boundary
        address = base + ps - (base & (ps - 1));
    } else {
        address = base;
    }
    cleaner = Cleaner.create(this, new Deallocator(base, size, cap));
    att = null;
}


public static Cleaner create(Object var0, Runnable var1) {
    return var1 == null ? null : add(new Cleaner(var0, var1));
}

//Cleaner的构造方法，调用父类构造方法，传入ByteBuffer对象和引用队列
private Cleaner(Object var1, Runnable var2) {
    super(var1, dummyQueue);
    this.thunk = var2;
}

private static synchronized Cleaner add(Cleaner var0) {
    if (first != null) {
        var0.next = first;
        first.prev = var0;
    }

    first = var0;
    return var0;
}

//ReferenceHandler调用Cleaner的clean方法
public void clean() {
        if (remove(this)) {
            try {
                this.thunk.run();  //这里调用Deallocator.run()中进行直接内存回收
            } catch (final Throwable var2) {
                AccessController.doPrivileged(new PrivilegedAction<Void>() {
                    public Void run() {
                        if (System.err != null) {
                            (new Error("Cleaner terminated abnormally", var2)).printStackTrace();
                        }

                        System.exit(1);
                        return null;
                    }
                });
            }

        }
    }

//Deallocator.run()中进行直接内存回收
private static class Deallocator
        implements Runnable{
  public void run() {
      if (address == 0) {
          // Paranoia
          return;
      }
      unsafe.freeMemory(address);
      address = 0;
      Bits.unreserveMemory(size, capacity);
  }
}
```
总结一下，调用ByteBuffer.allocateDirect()实际完成了：
+ 调用UnSafe.allocateMemory()分配直接内存；
+ 创建了Cleaner对象，它是一个虚引用，用于回收直接内存，构建它的同时传入了一个Runnable类型的Deallocator对象，它负责调用unsafe.freeMemory()真正完成直接内存的回收；
+ Cleaner对象的创建过程可以简单理解为这样的形式：`PhantomReference<ByteBuffer> reference = new PhantomReference<>(byteBuffer, queue);`
+ 当创建Cleaner对象时传入的byteBuffer对象被回收时，这个cleaner虚引用就会被加入queue这个引用队列，随后ReferenceHandler这个守护线程就会调用cleaner.clean()方法，在这个方法中最终调用Deallocator的run方法进行直接内存回收；
### 6、禁用显式垃圾回收影响直接内存的回收
```java{6,7}
//-XX:+DisableExplicitGC 禁用显式GC
public static void main(String[] args) throws IOException {
    ByteBuffer buffer = ByteBuffer.allocateDirect(1024 * 1024 * 1024);
    System.out.println("分配成功");
    System.in.read();   //运行到此处查看任务管理器可以看到当前程序占用了1G多内存
    buffer = null;
    System.gc();  
    System.in.read();   //运行到此处查看任务管理器可以看到当前程序仍然占用了1G多内存，并没有释放内存
}
```
将buffer置为null后，这时尽管ByteBuffer对象没有引用来引用它，但由于禁用了显式GC，System.gc()无效，所以ByteBuffer对象仍然不能被回收，导致虚引用也不能入队，ReferenceHandler不能调用Cleaner的clean方法，最终导致它所关联的直接内存也不能被回收。