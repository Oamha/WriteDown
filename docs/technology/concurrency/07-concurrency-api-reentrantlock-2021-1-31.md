## ReentrantLock

### 特点
+ ReentrantLock和synchronized一样，支持可重入；
```java
public class ReentrantLockTest {

    static ReentrantLock lock = new ReentrantLock();

    public static void main(String[] args) {
        m1();
    }

    public static void m1() {
        //第一次加锁
        lock.lock();
        try {
            System.out.println("当前线程获得锁");
            m2();
        } finally {
            lock.unlock();
        }
    }

    public static void m2() {
        //第二次加锁
        lock.lock();
        try {
            System.out.println("当前线程再次获得锁");
        } finally {
            lock.unlock();
        }
    }
}

```
+ 可响应中断
```java
public static void main(String[] args) throws InterruptedException {
    Thread thread = new Thread(() -> {
        try {
            //子线程获得锁时阻塞
            lock.lockInterruptibly();
            try {
                System.out.println("hello");
            } finally {
                lock.unlock();
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }, "t1");
    thread.start();

    //主线程容易先获得锁
    lock.lock();
    try {
        TimeUnit.SECONDS.sleep(1);
        //中断子线程获得锁
        thread.interrupt();
    } catch (InterruptedException e) {
        e.printStackTrace();
    } finally {
        lock.unlock();
    }
}
```
+ 能够尝试获取锁，超时获取锁
```java
private static void m4() {
    Thread thread = new Thread(() -> {
        if (lock.tryLock()) {
            try {
                System.out.println("子线程获取锁");
            } finally {
                lock.unlock();
            }
        } else {
            System.out.println("子线程没获取到");
        }
    }, "t1");

    //等待一段时间获取锁，超时后获取失败
    // try {
    //     if (lock.tryLock(2, TimeUnit.SECONDS)) {
    //         try {
    //             System.out.println("子线程获取锁");
    //         } finally {
    //             lock.unlock();
    //         }
    //     } else {
    //         System.out.println("子线程没获取到");
    //     }
    // } catch (InterruptedException e) {
    //     e.printStackTrace();
    // }
    // thread.start();

    //让主线程先获取锁
    lock.lock();
    try {
        System.out.println("主线程获取锁");
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        e.printStackTrace();
    } finally {
        lock.unlock();
    }
}
```

+ 支持公平锁、非公平锁
```java
 ReentrantLock lock2 = new ReentrantLock(true);
```

+ 支持多个条件变量，即多个WaitSet，而synchronized只有一个
```java
 private static void m6() {
    Condition condition = lock.newCondition();
    Thread thread = new Thread(() -> {
        lock.lock();
        try {
            condition.await();
            System.out.println(Thread.currentThread().getName() + "开始执行");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }, "t1");
    thread.start();

    try {
        TimeUnit.SECONDS.sleep(1);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    lock.lock();
    try {
        condition.signal();
    } finally {
        lock.unlock();
    }
}
```