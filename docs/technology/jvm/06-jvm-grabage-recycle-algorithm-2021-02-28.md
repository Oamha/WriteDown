## 垃圾回收算法
### 1、标记清除算法(Mark Sweep)
标记处垃圾对象的位置，将垃圾对象的位置记录下来（不会将该空间置为零），下次分配对象，遍历这些空间。
#### 1.1 优点
速度较快
#### 1.2 缺点
容易产生内存碎片
### 2、标记整理算法(Mark Compact)
对空间进行整理，对已用空间进行挪动，使已用空间更加紧凑。
#### 2.1 优点
没有内存碎片
#### 2.2 缺点
速度慢
### 3、复制算法(Copy)
将可用空间化为两块，将已用空间的存活对象拷贝到另一块，然后一次释放已用空间的内存，最后交换两块内存空间地址。
#### 3.1 优点
没有内存碎片
#### 3.2 缺点
需要双倍内存空间