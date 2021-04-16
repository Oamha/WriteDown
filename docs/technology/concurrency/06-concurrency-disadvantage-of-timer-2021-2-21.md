### 任务调度
### 1、Timer
Timer使用单线程执行延时任务或定时任务，但其有一定缺点：
```java
Timer timer = new Timer();
timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println(LocalDateTime.now());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}, 1000);

timer.schedule(new TimerTask() {
    @Override
    public void run() {
        System.out.println(LocalDateTime.now());
    }
}, 1000);
```
打印结果：
```
2021-02-21T10:43:40.810
2021-02-21T10:43:42.810
```
可以看出第二个任务执行由于第一个耗时任务的执行被延期了，因为它们都是使用一个线程来执行。
### 2、ScheduledExecutorService
#### 2.1 ScheduledExecutorService执行延时任务
使用ScheduledExecutorService线程池可以解决上述问题：
```java
ScheduledExecutorService executorService = Executors.newScheduledThreadPool(2);
executorService.schedule(() -> {
    System.out.println(LocalDateTime.now());
    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}, 1000, TimeUnit.MILLISECONDS);

executorService.schedule(() -> {
    System.out.println(LocalDateTime.now());
}, 1000, TimeUnit.MILLISECONDS);
```
执行结果：
```java
2021-02-21T11:14:43.551
2021-02-21T11:14:43.551
```
这里是使用不同的线程来执行，两个线程之间不会产生影响。
#### 2.2 scheduleAtFixedRate
```java
ScheduledExecutorService executorService = Executors.newScheduledThreadPool(2);
executorService.scheduleAtFixedRate(() -> {
    System.out.println(1 + " " + Thread.currentThread().getName() + " " + LocalDateTime.now());
    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}, 1000, 1000, TimeUnit.MILLISECONDS);
```
执行结果：
```java
pool-1-thread-1 2021-02-21T11:18:23.979
pool-1-thread-2 2021-02-21T11:18:23.979
pool-1-thread-1 2021-02-21T11:18:25.981
pool-1-thread-2 2021-02-21T11:18:25.981
pool-1-thread-2 2021-02-21T11:18:27.981
pool-1-thread-1 2021-02-21T11:18:27.981
pool-1-thread-1 2021-02-21T11:18:29.982
pool-1-thread-2 2021-02-21T11:18:29.982
```
这里每隔1s执行一次，但是任务消耗2s，所以任务会被延期，但不会被并发执行。
#### 2.3 scheduleWithFixedDelay
```java
ScheduledExecutorService executorService = Executors.newScheduledThreadPool(2);
executorService.scheduleWithFixedDelay(() -> {
    System.out.println(1 + " " + Thread.currentThread().getName() + " " + LocalDateTime.now());
    try {
        TimeUnit.SECONDS.sleep(2);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}, 1000, 1000, TimeUnit.MILLISECONDS);
```
执行结果：
```java
pool-1-thread-1 2021-02-21T11:19:42.722
pool-1-thread-2 2021-02-21T11:19:42.722
pool-1-thread-1 2021-02-21T11:19:45.723
pool-1-thread-2 2021-02-21T11:19:45.723
pool-1-thread-2 2021-02-21T11:19:48.724
pool-1-thread-1 2021-02-21T11:19:48.724
pool-1-thread-2 2021-02-21T11:19:51.725
pool-1-thread-1 2021-02-21T11:19:51.732
```
scheduleWithFixedDelay能够确保在下一次任务执行之前间隔一段时间。
### 3、案例
实现每周日12点定时执行任务：
```java
//当前时间
LocalDateTime currentTime = LocalDateTime.now();
//这周日12点
LocalDateTime scheduledTime = currentTime.with(DayOfWeek.SUNDAY).withHour(12).withMinute(0).withSecond(0).withNano(0);
//如果当前时间已经过了周日12点，则将预期日期改为下周日12点
if (currentTime.compareTo(scheduledTime) > 0) {
    scheduledTime.plusWeeks(1);
}
//当前时间与计划执行时间的间隔
long delay = Duration.between(currentTime, scheduledTime).toMillis();
//一周执行一次
long period = 1000 * 60 * 60 * 24 * 7;
ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);
executorService.scheduleAtFixedRate(() -> {
    System.out.println("每周日12点定时执行");
}, delay, period, TimeUnit.MILLISECONDS);
```