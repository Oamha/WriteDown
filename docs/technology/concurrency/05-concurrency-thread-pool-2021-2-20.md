### JDK线程池
### 1、继承关系
线程池主要分为两种，一种是普通的线程池(ThreadPoolExecutor)，还有一种在普通线程池基础上实现了任务调度(ScheduledThreadPoolExecutor)。Executor定义了执行器应该具有的功能：执行任务，即execute方法；ExecutorService定义了线程池的通用功能，关闭(shutdown)、提交任务(submit)等；ScheduledExecutorService定义了通用的任务调度方法，如延时执行(schedule)，定时执行(scheduleAtFixedRate)。
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'class-hierarchy-of-thread-pool.png'"/>
### 2、线程池的状态
线程池用一个int类型32位二进制来表示运行状态，高3位表示状态，低29位表示线程数量，并用原子整型进行CAS更新。
```java
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
private static final int COUNT_BITS = Integer.SIZE - 3;
private static final int CAPACITY   = (1 << COUNT_BITS) - 1;

private static final int RUNNING    = -1 << COUNT_BITS;
private static final int SHUTDOWN   =  0 << COUNT_BITS;
private static final int STOP       =  1 << COUNT_BITS;
private static final int TIDYING    =  2 << COUNT_BITS;
private static final int TERMINATED =  3 << COUNT_BITS;
```
+ `RUNNING` 接受新任务，处理阻塞队列里的任务
+ `SHUTDOWN` 不会接受新任务，但会处理阻塞队列里的任务
+ `STOP` 会中断正在执行的任务，同时抛弃阻塞队列里的任务
+ `TIDYING` 任务全部执行完毕，活动线程为0即将进入终结
+ `TERMINATED` 终结状态
::: warning
大小关系为：`TERMINATED` > `TIDYING` > `STOP` > `SHUTDOWN` > `RUNNING`
:::
### 3、构造方法的含义
```java
public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler)
```
+ `corePoolSize` 核心线程数，JDK提供的线程池中的线程类型分为核心线程和救急线程；
+ `maximumPoolSize` 最大线程数，`maximumPoolSize`减去`corePoolSize`等于救急线程数；
+ `keepAliveTime` 救急线程的存活时间，当工作队列中没有任务时，救急线程再从队列中获取任务会陷入阻塞状态，阻塞一定时间后会被释放；
+ `unit` `keepAliveTime`时间的单位；
+ `workQueue` 阻塞队列，当线程数已经达到`corePoolSize`时，所有核心线程都在忙，此时任务将会被放入`workQueue`；
+ `threadFactory` 线程工厂，可以自定义创建线程的逻辑，如为线程起个名字，方便排查错误；
+ `handler` 拒绝策略，当线程数达到`corePoolSize`，工作队列也满了，救急线程也达到上限了，这时会执行拒绝策略；
### 4、线程池的种类
为方便线程池的构建，JDK提供了Executors工具类，提供了很多工厂方法来进行常用类型线程池的构建。
#### 4.1 固定数量线程线程池
固定数量线程线程池没有救急线程，使用无界的阻塞队列，救急线程的存活时间也为零。适用于任务量已知，相对耗时的任务。
```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>());
}
```
#### 4.2 单一线程线程池
单一线程线程池只有一个核心线程，没有救急线程，使用无界的阻塞队列
+ 单一线程线程池执行出错后会创建一个新的线程，始终保持线程池内有一个线程；
+ 单一线程线程池返回的是一个包装类FinalizableDelegatedExecutorService，只暴露了ExecutorService中的方法，没法调用ThreadPoolExecutor中的方法；
```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
        (new ThreadPoolExecutor(1, 1,
                                0L, TimeUnit.MILLISECONDS,
                                new LinkedBlockingQueue<Runnable>()));
}
```
#### 4.3 缓冲线程池
缓冲功能的线程池没有核心线程，只能创建救急线程，救急线程的存活时间为1分钟，使用同步的阻塞队列，适用于任务数密集，但每个任务执行时间较短的情形
```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                    60L, TimeUnit.SECONDS,
                                    new SynchronousQueue<Runnable>());
}
```
### 5、其它API
```java
//提交任务，能阻塞获取结果
public <T> Future<T> submit(Callable<T> task);

//任意一个任务执行完毕，结束其它任务
public <T> T invokeAny(Collection<? extends Callable<T>> tasks);

//执行所有任务
public <T> List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks);

//关闭线程池，拒绝接受新任务，但会执行完正在执行的任务和任务队列中的任务
public void shutdown() {
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
        advanceRunState(SHUTDOWN);
        interruptIdleWorkers();
        onShutdown(); // hook for ScheduledThreadPoolExecutor
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
}

//关闭线程池，返回任务队列中还没执行的任务
public List<Runnable> shutdownNow() {
    List<Runnable> tasks;
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        checkShutdownAccess();
        advanceRunState(STOP);
        interruptWorkers();
        tasks = drainQueue();
    } finally {
        mainLock.unlock();
    }
    tryTerminate();
    return tasks;
}
```