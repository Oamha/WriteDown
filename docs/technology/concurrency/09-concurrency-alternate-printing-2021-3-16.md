## 面试题
::: tip 描述
实现三个线程交替打印abc
:::
### 1、park/unpark方式
```java
public static void parkMethod() {
    List<Thread> list = new ArrayList<>();
    class Task implements Runnable {
        //下一个要唤醒的线程
        private int next;
        //当前线程要打印的内容
        private char ch;

        public Task(int next, char ch) {
            this.next = next;
            this.ch = ch;
        }

        @Override
        public void run() {
            for (; ; ) {
                LockSupport.park();
                System.out.print(ch);
                LockSupport.unpark(list.get(next));
            }
        }
    }
    for (int i = 0; i < 3; i++) {
        list.add(new Thread(new Task((i + 1) % 3, (char) ('A' + i))));
    }
    for (Thread t : list) {
        t.start();
    }
    LockSupport.unpark(list.get(0));
}
```
运行结果：
```java
ABCABCABC.....
```
### 2、wait/notify方式
```java
public static void waitMethod() {
    class Task {
        //下一个应该执行打印的线程
        private int threadNumToRun = 0;

        public void print(int currentThreadNum) {
            for (; ; ) {
                synchronized (this) {
                    //如果当前线程不是执行打印的线程，线程进入阻塞
                    while (currentThreadNum != this.threadNumToRun) {
                        try {
                            wait();
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                    System.out.print(((char) (currentThreadNum + 'A')));
                    //当前线程打印完，下一个线程打印
                    threadNumToRun = (threadNumToRun + 1) % 3;
                    //唤醒其它阻塞线程
                    notifyAll();
                }
            }
        }
    }
    Task task = new Task();
    for (int i = 0; i < 3; i++) {
        int finalI = i;
        new Thread(() -> task.print(finalI)).start();
    }
}
```
运行结果：
```java
ABCABCABC.....
```
### 3、lock方式
```java
public static void lockMethod() {
    ReentrantLock lock = new ReentrantLock();
    List<Condition> conditionList = Arrays.asList(lock.newCondition(), lock.newCondition(), lock.newCondition());
    class Task {
        private int nextToPrintNum = 0;

        public void print(int current) {
            for (; ; ) {
                lock.lock();
                try {
                    while (nextToPrintNum != current)
                        conditionList.get(current).await();
                    System.out.print(((char) (current + 'A')));
                    nextToPrintNum = (nextToPrintNum + 1) % 3;
                    conditionList.get(nextToPrintNum).signalAll();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    lock.unlock();
                }
            }
        }
    }
    Task task = new Task();
    for (int i = 0; i < 3; i++) {
        int finalI = i;
        new Thread(() -> task.print(finalI)).start();
    }
}
```
运行结果：
```java
ABCABCABC.....
```