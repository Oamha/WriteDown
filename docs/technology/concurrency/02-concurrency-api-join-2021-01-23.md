## Join
::: tip 概念
join方法能实现一个线程等待另一个线程执行结束的效果。
:::
### 1、源码
```java
//Waits for this thread to die(等待线程结束)
public final void join() throws InterruptedException {
    join(0);
}

//参数为0表示无限等待
public final synchronized void join(long millis)
    throws InterruptedException {
    long base = System.currentTimeMillis();
    //当前时间起点为0
    long now = 0;

    //如果等待时间小于零，则抛出异常
    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    //如果等待时间为零，则无限等待直到线程结束
    if (millis == 0) {
        while (isAlive()) {
            wait(0);
        }
    } else {
        //否则根据超时时间进行等待
        while (isAlive()) {
            //根据已经等待了的时间和要等待的时间计算还要等待的时间
            long delay = millis - now;
            //如果已经等待了足够多的时间，则结束
            if (delay <= 0) {
                break;
            }
            wait(delay);
            //中途被唤醒，计算已经等待了的时间
            now = System.currentTimeMillis() - base;
        }
    }
}
```
### 2、总结
+ join机制是依靠wait方法实现的，因此方法要加synchronized锁，锁的是要等待结束执行的线程对象；
+ 调用thread.join()方法的线程会暂停执行的原因是当前线程被加入到了等待结束执行线程对象的WaitSet中；
+ 当前线程何时继续执行？线程执行结束时会触发thread.notifyAll()方法，这样处于WaitSet中的线程就被唤醒了;
源码中的解释：
```java
This implementation uses a loop of this.wait calls conditioned on this.isAlive. As a thread terminates the this.notifyAll method is invoked. It is recommended that applications not use wait, notify, or notifyAll on Thread instances.
```
+ 为什么要在thread.start()之后才能调用thread.join()?因为源码中进行wait的依据是thread.isAlive(),只有start了还没结束isAlive()才返回true；
源码中的解释：
```java
Tests if this thread is alive. A thread is alive if it has been started and has not yet died
```
### 3、模仿实现一下：
```java
public class JoinClass {
    //等待其结束的线程，要把它作为锁的对象，调用其wait方法，
    //在其结束时系统会调用该线程的notifyAll方法,将该线程对象相关联的WaitSet中的阻塞的线程唤醒
    private Thread thread;

    public JoinClass(Thread thread) {
        this.thread = thread;
    }

    public void join() throws InterruptedException {
        join(0);
    }

    public void join(long mills) throws InterruptedException {
        //这里要锁thread，不能像源码中那样锁this
        synchronized (thread) {
            if (mills < 0) {
                throw new IllegalArgumentException("timeout value is negative");
            }
            long now = 0;
            long base = System.currentTimeMillis();
            if (mills == 0) {
                while (thread.isAlive()) {
                    //thread的wait方法
                    thread.wait(0);
                }
            } else {
                //thread的isAlive()
                while (thread.isAlive()) {
                    long delay = mills - now;
                    if (delay <= 0) {
                        break;
                    }
                    thread.wait(delay);
                    now = System.currentTimeMillis() - base;
                }
            }
        }
    }

    //更精细（纳秒）的等待
    public synchronized void join(long mills, long nanos) throws InterruptedException {
        if (mills < 0) {
            throw new IllegalArgumentException("mill timeout value is negative");
        }
        if (nanos < 0 || nanos > 999999) {
            throw new IllegalArgumentException("nanos timeout value out of range");
        }
        //其实就是个大概值，大于或等于1/2毫秒时或者毫秒为0纳秒不为0都会去多等1毫秒
        if (nanos >= 500000 || (mills == 0 && nanos != 0)) {
            mills++;
        }
        join(mills);
    }
}
```