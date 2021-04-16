## 垃圾回收器
### 1、串行
+ 单线程；
+ 适用于堆内存较小的情形；
+ 开启参数：-XX:+UseSerialGC
### 2、吞吐量优先
+ 多线程；
+ 堆内存较大，多核CPU；
+ 主要目标是单位时间内STW时间较短；
+ 开启参数：-XX:+UseParallelGC -XX:+UseParallelOldGC；
+ -XX:ParallelGCThreads=n 控制并行线程的数量；
### 3、响应时间优先
+ 多线程
+ 堆内存较大，多核CPU；
+ 主要目标是单次回收STW时间较短；