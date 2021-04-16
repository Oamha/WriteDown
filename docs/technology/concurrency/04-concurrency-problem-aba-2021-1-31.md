## 原子引用
::: tip 概念
`java.util.concurrent.atomic`包下提供了`AtomicInteger`、`AtomicBoolean`、`AtomicLong`类能够对Integer、Boolean、Long类型进行原子更新，从而实现无锁下的线程安全，而对于其它引用类型怎么办呢？我们可以使用AtomicReference。
:::
### 2、用法
```java
Student student = new Student("sunny");
AtomicReference<Student> atomicReference = new AtomicReference<>(student);

//主线程希望将jack修改为mary，但中途有一个线程将其修改成了lily，主线程将修改失败
new Thread(() -> {
    boolean update = atomicReference.compareAndSet(student, new Student("lily"));
    System.out.println(update);
}).start();

TimeUnit.SECONDS.sleep(1);

boolean update = atomicReference.compareAndSet(student, new Student("mary"));
System.out.println(update);
```
跟踪一下源码
```java
public final boolean compareAndSet(V expect, V update) {
    return unsafe.compareAndSwapObject(this, valueOffset, expect, update);
}
```
可以看到CAS涉及几个参数：this, valueOffset, expect, update, 根据valueOffset可以找到要修改的内容在内存中的地址，expect表示原来的值，update表示要把它修改成的值，如果传入的expect值跟内存中的不一致，那么本次修改失败。那么问题来了，如果修改过程中，有其它线程将其改变后再改变回来，是不是会被误认为没有修改过？这就是下面要说的ABA问题。
### 2、ABA问题
```java
Student student = new Student("sunny");
AtomicReference<Student> atomicReference = new AtomicReference<>(student);

//主线程希望将sunny修改为mary，但中途有一个线程将其修改成了lily
new Thread(() -> {
    boolean update = atomicReference.compareAndSet(student, new Student("lily"));
    System.out.println(update);
}).start();

TimeUnit.SECONDS.sleep(1);

//另一个线程又将lily修改为了sunny
new Thread(() -> {
    boolean update = atomicReference.compareAndSet(atomicReference.get(), student);
    System.out.println(update);
}).start();

TimeUnit.SECONDS.sleep(1);

//主线程误认为sunny还是sunny，所以修改成功，其实这中间已经发生了两次变化
boolean update = atomicReference.compareAndSet(student, new Student("mary"));
System.out.println(update);
```
### 3、AtomicStampedReference
AtomicStampedReference每次更新都会对版本号进行一次修改，当预期版本号与真实版本号不一致时，更新失败。只有预期值和内存中的值相同而且预期版本号与当前版本号一致时，才能更新成功
```java
    Student student = new Student("sunny");
    AtomicStampedReference<Student> atomicReference = new AtomicStampedReference<>(student, 0);
    Student reference = atomicReference.getReference();
    int oldStamp = atomicReference.getStamp();

    //将sunny更新为lily,版本号加一
    new Thread(() -> {
        int stamp = atomicReference.getStamp();
        Student oldReference = atomicReference.getReference();
        boolean update = atomicReference.compareAndSet(oldReference, new Student("lily"), stamp, stamp + 1);
        System.out.println(update);
    }).start();

    TimeUnit.SECONDS.sleep(1);

    //将lily再变回sunny，版本号加一
    new Thread(() -> {
        int stamp = atomicReference.getStamp();
        Student oldReference = atomicReference.getReference();
        boolean update = atomicReference.compareAndSet(oldReference, student, stamp, stamp + 1);
        System.out.println(update);
    }).start();

    TimeUnit.SECONDS.sleep(1);

    //主线程希望将sunny变为mary，虽然sunny没变，但是版本已经被修改两次了，所以更新失败
    boolean update = atomicReference.compareAndSet(reference, new Student("mary"), oldStamp, oldStamp + 1);
    System.out.println(update);
}
```
### 4、AtomicMarkableReference
从AtomicStampedReference可以看出变量被修改了几次，而有时我们不关心到底修改了几次，只是关心有没有被修改，这时可以使用AtomicMarkableReference
```java
private static void testAtomicMarkableReference() throws InterruptedException {
    Student student = new Student("sunny");
    AtomicMarkableReference<Student> markableReference = new AtomicMarkableReference<>(student, true);
    Student reference = markableReference.getReference();

    new Thread(() -> {
        boolean update = markableReference.compareAndSet(reference, new Student("lily"), true, false);
        System.out.println(update);
    }).start();

    Thread.sleep(1);

    //修改失败 mark已经被修改为false, sunny也被修改成了lily
    boolean update = markableReference.compareAndSet(reference, new Student("mary"), true, false);
    System.out.println(update);
}
```