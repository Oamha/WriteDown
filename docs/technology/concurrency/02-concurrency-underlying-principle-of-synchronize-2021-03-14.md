## synchronized原理
### 1、Java对象头
#### 1.1、简介
以64位虚拟机为例：
<table size="400px">
    <tr>
        <th colspan="2">对象头</th>
    </tr>
    <tr>
        <td>Mark Word（8个字节）</td>
        <td>Klass Word</td>
    </tr>
</table>
这里JVM开启了指针压缩，所以Klass Word通常占用4个字节，如果关闭指针压缩，Klass Word占用8个字节；
#### 1.2、Mark Word
<Common-Thumb :prefix="'/img/technology/'" :urls="'mark-word.png'"/>
#### 1.3、对象头查看
使用jol可以查看对象在内存中的布局，引入下列依赖：
```xml
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.14</version>
</dependency>
```
测试下列代码:
```java
System.out.println(ClassLayout.parseInstance(new Object()).toPrintable());
```
运行结果：
```java{3-4}
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           e5 01 00 f8 (11100101 00000001 00000000 11111000) (-134217243)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```
3-4行表示对象头中的Mark Word，第5行表示对象头中的Klass Word，第6行表示字节对齐（一个对象占用空间要是8的倍数）。一个Object实例占用了16个字节。上面是开启指针压缩的情况，当我们关闭指针压缩时（-XX:-UseCompressedOops），发现Klass Word占用了8个字节：
```java
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           00 1c 12 1e (00000000 00011100 00010010 00011110) (504503296)
     12     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```
我们看到1.2节无锁状态下Mark Word中应该有对象的hashcode信息，但这运行结果中的二进制位大部分都为0，显然没有我们想要的hashcode。这是因为hashcode是懒加载的，只有调用过hashcode方法，hashcode才会被存储到对象头。我们来测试一下：
```java
Object instance = new Object();
System.out.println(Integer.toHexString(instance.hashCode())); //转换为16进制，方便比较
System.out.println(ClassLayout.parseInstance(instance).toPrintable());
```
运行结果：
```java
4554617c
java.lang.Object object internals:
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 7c 61 54 (00000001 01111100 01100001 01010100) (1415674881)
      4     4        (object header)                           45 00 00 00 (01000101 00000000 00000000 00000000) (69)
      8     4        (object header)                           00 1c 4b 1e (00000000 00011100 01001011 00011110) (508238848)
     12     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
Instance size: 16 bytes
Space losses: 0 bytes internal + 0 bytes external = 0 bytes total
```
我们看到二进制位中的hashcode存储顺序刚好和运行结果相反，这是因为java对象在内存中是按小端存储的，即低位字节在前，高位字节在后。
#### 1.4、对jol进行修改
在上面我们看到对象头的打印总是逆序的，看着不是很方便，于是可以对jol源码进行修改，先看一下打印的源码在什么地方，进入toPrintable方法：
```java
for (long off = 0; off < headerSize(); off += 4) {
    int word = vm.getInt(instance, off);
    pw.printf(" %6d %5d %" + maxTypeLen + "s %-" + maxDescrLen + "s %s%n", off, 4, "", "(object header)",
                    toHex((word >> 0)  & 0xFF) + " " +
                    toHex((word >> 8)  & 0xFF) + " " +
                    toHex((word >> 16) & 0xFF) + " " +
                    toHex((word >> 24) & 0xFF) + " " +
                    "(" +
                    toBinary((word >> 0)  & 0xFF) + " " +
                    toBinary((word >> 8)  & 0xFF) + " " +
                    toBinary((word >> 16) & 0xFF) + " " +
                    toBinary((word >> 24) & 0xFF) + ") " +
                    "(" + word + ")"
    );
}
```
显然是这一段代码打印的，虽然看不懂什么意思，但我们可以对其进行简单修改，去掉for循环，只打印出Mark Word即可：
```java
int word1 = vm.getInt(instance, 4);
int word2 = vm.getInt(instance, 0);
pw.print(toHex((word1 >> 24) & 0xFF) + " " +
        toHex((word1 >> 16) & 0xFF) + " " +
        toHex((word1 >> 8) & 0xFF) + " " +
        toHex((word1 >> 0) & 0xFF) + " " +
        toHex((word2 >> 24) & 0xFF) + " " +
        toHex((word2 >> 16) & 0xFF) + " " +
        toHex((word2 >> 8) & 0xFF) + " " +
        toHex((word2 >> 0) & 0xFF) + " ");
pw.println("(" + toBinary((word1 >> 24) & 0xFF) + " " +
                toBinary((word1 >> 16) & 0xFF) + " " +
                toBinary((word1 >> 8) & 0xFF) + " " +
                toBinary((word1 >> 0) & 0xFF) + " " +
                toBinary((word2 >> 24) & 0xFF) + " " +
                toBinary((word2 >> 16) & 0xFF) + " " +
                toBinary((word2 >> 8) & 0xFF) + " " +
                toBinary((word2 >> 0) & 0xFF) + ") ");
```
修改后再进行打包，导入我们自己的项目，再进行前面的打印：
```java
4554617c
00 00 00 45 54 61 7c 01 (00000000 00000000 00000000 01000101 01010100 01100001 01111100 00000001)
```
结果就一目了然了，最后两位二进制01表示无锁状态，从左往右第26位到第56位总共31位都是hashcode的内容；
### 2、偏向锁
#### 2.1、介绍
偏向锁默认是开启的，偏向锁可以认为适用于没有竞争的情况，就一个线程在访问synchronized代码块。它是对轻量级锁的优化，因为加轻量级锁时会用CAS来交换对象头的Mark Word和线程栈帧中的锁记录，效率较低。而偏向锁只需将Mark Word中的一部分修改为线程ID，效率较高。
#### 2.2、验证
```java
public static void main(String[] args) throws InterruptedException {
    TimeUnit.SECONDS.sleep(5);
    Object o = new Object();
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
}
```
偏向锁是延迟开启的，所以主线程需要睡眠一段时间。下面的例子都通过设置`-XX:BiasedLockingStartupDelay=0`来关闭延迟。
运行结果：
```java
00 00 00 00 00 00 00 05 (00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101)
```
可以看到倒数第三位为1，表示处于可偏向状态。下面我们对该对象加锁：
```java
public static void main(String[] args) throws InterruptedException {
    Object o = new Object();
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
    synchronized (o){
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
}
```
运行结果：
```java
00 00 00 00 00 00 00 05 (00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101) 
00 00 00 00 02 f2 38 05 (00000000 00000000 00000000 00000000 00000010 11110010 00111000 00000101) 
00 00 00 00 02 f2 38 05 (00000000 00000000 00000000 00000000 00000010 11110010 00111000 00000101) 
```
可以看到前54位已经变成了线程id，即使锁被撤销，线程id仍然存储在对象头中；
#### 2.3、偏向锁的升级
多种情况下会导致偏向锁的升级。
##### 2.3.1、多线程访问导致偏向锁升级
当其它线程访问该对象时，但访问时间是错开的，即同一时刻线程之间没有竞争，偏向锁会升级为轻量级锁。
```java
public static void main(String[] args) throws InterruptedException {
    Object o = new Object();
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
    synchronized (o){
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }
    System.out.println(ClassLayout.parseInstance(o).toPrintable());

    //主线程访问完之后，子线程再访问该对象
    Thread.sleep(1000);
    new Thread(() -> {
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
        synchronized (o){
            System.out.println(ClassLayout.parseInstance(o).toPrintable());
        }
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }).start();
}
```
运行结果：
```java
//101可偏向状态，但还没有偏向的线程，称为匿名偏向
00 00 00 00 00 00 00 05 (00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101) 
//加锁后，偏向主线程 mark word中记录主线程的id
00 00 00 00 02 a7 38 05 (00000000 00000000 00000000 00000000 00000010 10100111 00111000 00000101) 
//解锁后仍然偏向主线程 mark word中记录主线程的id
00 00 00 00 02 a7 38 05 (00000000 00000000 00000000 00000000 00000010 10100111 00111000 00000101) 
//解锁后仍然偏向主线程 mark word中记录主线程的id
00 00 00 00 02 a7 38 05 (00000000 00000000 00000000 00000000 00000010 10100111 00111000 00000101) 
//子线程加锁，撤销偏向锁，升级为轻量级锁，mark word替换为线程栈帧中的锁记录地址
00 00 00 00 21 07 f1 90 (00000000 00000000 00000000 00000000 00100001 00000111 11110001 10010000) 
//子线程解锁，回到无锁状态，并且不可偏向
00 00 00 00 00 00 00 01 (00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001) 
```
##### 2.3.2、hashCode方法
hashCode方法的调用会导致偏向锁升级为轻量级锁，因为调用该方法后mark word只够存储hash码，没有空间再来存储线程id。
轻量级锁会把mark word（包含hashCode）存储在线程栈帧的锁记录中，而重量级锁会将mark word存在monitor对象中，它们都有足够的空间来存储hash码，所以hashCode方法不会导致轻量级锁或重量级锁的撤销。
```java
public static void main(String[] args) throws InterruptedException {
    Object o = new Object();
    o.hashCode();
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
    synchronized (o){
        System.out.println(ClassLayout.parseInstance(o).toPrintable());
    }
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
}
```
运行结果：
```java
//调用hashCode方法后处于不可偏向状态
00 00 00 15 40 e1 9d 01 (00000000 00000000 00000000 00010101 01000000 11100001 10011101 00000001) 
//最后两位00表示直接加的是轻量级锁
00 00 00 00 02 e8 f8 58 (00000000 00000000 00000000 00000000 00000010 11101000 11111000 01011000) 
//解锁后也处于不可偏向
00 00 00 15 40 e1 9d 01 (00000000 00000000 00000000 00010101 01000000 11100001 10011101 00000001)
```
##### 2.3.3、wait-notify导致偏向锁升级
```java
public static void main(String[] args) throws InterruptedException {
    Object o = new Object();
    System.out.println(ClassLayout.parseInstance(o).toPrintable());
    new Thread(() -> {
        synchronized (o) {
            System.out.println(ClassLayout.parseInstance(o).toPrintable());
            try {
                o.wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(ClassLayout.parseInstance(o).toPrintable());
        }
    }).start();

    Thread.sleep(1000);
    synchronized (o) {
        o.notify();
    }
}
```
运行结果：
```java
//加锁之前处于可偏向状态
00 00 00 00 00 00 00 05 (00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000101) 
//加锁之后偏向于第一个线程
00 00 00 00 1f c6 d0 05 (00000000 00000000 00000000 00000000 00011111 11000110 11010000 00000101)
//调用了wait方法之后升级为重量级锁，因为wait之后，当前线程要进入o对象关联的monitor对象中的waitSet进行等待 
00 00 00 00 1e 48 fd 9a (00000000 00000000 00000000 00000000 00011110 01001000 11111101 10011010)
```
### 3、轻量级锁
#### 3.1、介绍
轻量级锁的使用场景：如果一个对象虽然有多线程要加锁，但加锁的时间是错开的（也就是没有竞争），那么可以
使用轻量级锁来优化。
#### 3.2、原理
加轻量级锁的流程：每个线程的栈帧都会包含一个锁记录的结构，内部可以存储锁定对象的Mark Word，加锁时让锁记录中 Object reference指向锁对象，并尝试用cas替换Object的Mark Word，将Mark Word的值存入锁记录。
<Common-Thumb :prefix="'/img/technology/'" :urls="'light-weight-lock.png'"/>

如果cas替换成功，对象头中存储了锁记录地址和状态00，而锁记录中存储了Mark Word，如下图：
<Common-Thumb :prefix="'/img/technology/'" :urls="'light-weight-lock-success.png'"/>
如果替换失败，可能有两种情况：
+ 如果是其它线程已经持有了该Object的轻量级锁，这时表明有竞争，进入锁膨胀过程；
    + 为Object对象申请Monitor锁，让Object的mark word中的部分标志位指向重量级锁；
    + 然后当前线程进入Monitor的EntryList进行阻塞等待；
<Common-Thumb :prefix="'/img/technology/'" :urls="'light-weight-lock-fat.png'"/>

+ 如果是自己执行了synchronized锁重入，那么再添加一条Lock Record作为重入的计数，如下图：
<Common-Thumb :prefix="'/img/technology/'" :urls="'light-weight-lock-reentrant.png'"/>
退出同步代码块：
+ 当退出synchronized代码块（解锁时）如果有取值为null的锁记录，表示有重入，这时重置锁记录，表示重入计数减一；
+ 当退出synchronized代码块（解锁时）锁记录的值不为null，这时使用cas将Mark Word 的值恢复给对象头成功，则解锁成功；
失败，说明轻量级锁进行了锁膨胀或已经升级为重量级锁，进入重量级锁解锁流程,即按照Monitor地址找到Monitor对象，设Owner为 null，唤醒EntryList中BLOCKED线程；
### 4、重量级锁
#### 4.1、简介
重量级锁用于激烈竞争的情况。每个Java对象都可以关联一个Monitor对象，如果使用synchronized给对象上锁（重量级）之后，该对象头的Mark Word 中就被设置指向Monitor对象的指针。
<Common-Thumb :prefix="'/img/technology/'" :urls="'heavy-weight-lock.png'"/>
+ 刚开始Monitor中Owner为null;
+ 当一个线程执行synchronized(obj)，就会将Monitor的所有者Owner置为当前线程，Monitor中只能有一个Owner;
+ 在一个线程上锁的过程中，其它线程也来执行synchronized(obj)，就会进入EntryList进行阻塞；
+ 当前线程执行完同步代码块的内容，然后唤醒EntryList中等待的线程来竞争锁，竞争时是非公平的；


