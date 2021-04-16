### 1、Java中线程间通信的方式有很多种：
+ volatile(保证可见性)和Synchronized(可见性，排它性)
+ wait/notify
::: tip
一个生产者消费者模式
:::
```java
package com.oamha.thread;

import java.util.ArrayList;
import java.util.List;

public class ProducerAndConsumer {
    private static List<Good> goods = new ArrayList<>(20);

    public static void main(String[] args) {
        for (int i = 0; i < 3; i++) {
            new Thread(new Consumer(3), "consumer" + i).start();
        }
        for (int i = 0; i < 2; i++) {
            new Thread(new Producer(5), "producer" + i).start();
        }
    }

    static class Producer implements Runnable {
        private int produceCount;

        public Producer(int produceCount) {
            this.produceCount = produceCount;
        }

        @Override
        public void run() {
            while (true) {
                synchronized (goods) {
                    while (goods.size() == 20) {
                        try {
                            goods.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    int min = Math.min(produceCount, 20 - goods.size());
                    for (int i = 0; i < min; i++) {
                        goods.add(new Good("good"));
                    }
                    System.out.println(Thread.currentThread().getName() + " produced " + min + " goods, the size is " + goods.size());
                    goods.notifyAll();
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static class Consumer implements Runnable {
        private int consumeCount;

        public Consumer(int consumeCount) {
            this.consumeCount = consumeCount;
        }

        @Override
        public void run() {
            while (true) {
                synchronized (goods) {
                    while (goods.size() == 0) {
                        try {
                            goods.wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    int min = Math.min(consumeCount, goods.size());
                    for (int i = 0; i < min; i++) {
                        goods.remove(goods.size() - 1);
                    }
                    System.out.println(Thread.currentThread().getName() + " consumed " + min + " goods, current size is " + goods.size());
                    goods.notifyAll();
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

class Good {
    String name;

    public Good(String name) {
        this.name = name;
    }
}

```
+ Thread.join()
::: tip
Join时调用当前线程实例的wait方法进行阻塞，线程退出时调用notifyAll方法进行通知
:::
```java{10-12}
public final synchronized void join(long millis) throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis < 0) {
        throw new IllegalArgumentException("timeout value is negative");
    }

    if (millis == 0) {
        while (isAlive()) {
            wait(0);
        }
    } else {
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                break;
            }
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```
+ ThreadLocal 
::: tip
在当前线程上挂载一个ThreadLocalMap类型的变量threadLocals，里面存放的是一个个Entry，Entry的key是ThreadLocal，Value是我们存放的值。取值时先拿到threadLocals，再根据hash算法并把当前ThreadLocal对象当做Key进行比对拿到Entry，最后取出值，如果没有设置值，则返回我们可以进行重写的方法initialValue的返回值
:::
```java 
public T get() {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    return setInitialValue();
}
```
```java
public void set(T value) {
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null)
        map.set(this, value);
    else
        createMap(t, value);
}
```
+ 管道(PipedReader, PipedWriter) 
::: tip
以内存为媒介，实现线程间的数据传输
:::
```java
public class Pipe {

    public static void main(String[] args) throws IOException {
        PipedReader reader = new PipedReader();
        PipedWriter writer = new PipedWriter();
        writer.connect(reader);

        new Thread(new ReadThread(reader)).start();


        int receiver = 0;
        while ((receiver = System.in.read()) != -1) {
            writer.write(receiver);
        }
    }

    static class ReadThread implements Runnable {
        private PipedReader reader;

        public ReadThread(PipedReader reader) {
            this.reader = reader;
        }

        @Override
        public void run() {
            int hasRead;
            try {
                while ((hasRead = reader.read()) != -1) {
                    System.out.print((char) hasRead);
                }
            } catch (Exception e) {

            }
        }
    }
}
```