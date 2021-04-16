## 垃圾回收案例分析
### 案例一
```java
public class GarbageTest1 {
    //-XX:+PrintGCDetails -verbose:gc  打印详细GC信息
    //-Xmx20m 最大堆大小
    //-Xms20m 初始堆大小
    //-Xmn10m 新生代内存大小
    //-XX:+UseSerialGC 使用串行GC
    public static void main(String[] args) {

    }
}
```
执行结果：
```java
Heap
    //新生代占用9M，因为to区域要保持空闲
 def new generation   total 9216K, used 2384K [0x00000000fec00000, 0x00000000ff600000, 0x00000000ff600000)
  eden space 8192K,  29% used [0x00000000fec00000, 0x00000000fee54230, 0x00000000ff400000)
  from space 1024K,   0% used [0x00000000ff400000, 0x00000000ff400000, 0x00000000ff500000)
  to   space 1024K,   0% used [0x00000000ff500000, 0x00000000ff500000, 0x00000000ff600000)
  //老年代占用10M
 tenured generation   total 10240K, used 0K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
   the space 10240K,   0% used [0x00000000ff600000, 0x00000000ff600000, 0x00000000ff600200, 0x0000000100000000)
 Metaspace       used 3485K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 382K, capacity 388K, committed 512K, reserved 1048576K
```
### 案例二
