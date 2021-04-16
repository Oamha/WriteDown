## 分代回收算法
### 1、堆的划分
JVM将堆划分为新生代和老年代，新生代用于存放生命周期较短的对象，老年代用于存放生命周期较长的对象。
#### 1.1 新生代
新生代又被进一步划分为Eden、Survivor From和Survivor To.
#### 1.2 老年代
### 2、回收流程
+ 对象首先分配在Eden区域；
+ Eden区空间不足时，触发Minor GC，此时会将Eden区域和Survivor From区域中的存活对象拷贝到Survivor To区域中，将存活的对象年龄加一并且交换Survivor From和Survivor To区域；
+ Minor GC会触发Stop The World，即停止所有用户线程，等垃圾回收完成后，才恢复；
+ 当对象寿命超过阈值（15）时，会晋升到老年代；
+ 当老年代内存不足，会先触发Minor GC，如果回收后内存仍然不足，那么触发Full GC；