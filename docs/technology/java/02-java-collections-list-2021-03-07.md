### Java集合之ArrayList源码分析
::: tip 概念
Java中的List代表了一类有序（按插入顺序）的，支持重复元素，支持null值的集合类型。它继承了`Collection`接口。
`ArrayList`是`List`接口的一个重要实现。
:::
### 1、构造方法
`ArrayList`提供了三种构造方法：
+ 如果调用有参构造方法，提供初始容量大小，则会创建指定大小的数组；
+ 如果调用无参构造方法，JDK1.8会指定一个空数组，然后在第一次添加元素时才会将容量扩容到10；而JDK1.7会创建默认大小为10的数组；
```java
//如果扩容时elementData==DEFAULTCAPACITY_EMPTY_ELEMENTDATA，则将容量扩容到DEFAULT_CAPACITY
private static final int DEFAULT_CAPACITY = 10;
//指定了初始容量为0时，elementData指定为该空数组
private static final Object[] EMPTY_ELEMENTDATA = {};
//没指定初始容量时，elementData指定为该空数组
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
//存储数据的数组
transient Object[] elementData; 
//元素个数
private int size;

public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                            initialCapacity);
    }
}

public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}

public ArrayList(Collection<? extends E> c) {
    elementData = c.toArray();
    if ((size = elementData.length) != 0) {
        if (elementData.getClass() != Object[].class)
            elementData = Arrays.copyOf(elementData, size, Object[].class);
    } else {
        this.elementData = EMPTY_ELEMENTDATA;
    }
}
```
### 2、添加元素
ArrayList每次添加元素时都会检查当前数组容量大小是否满足需求，如果不满足将触发扩容
```java
public boolean add(E e) {
    ensureCapacityInternal(size + 1);
    elementData[size++] = e;
    return true;
}

private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private static int calculateCapacity(Object[] elementData, int minCapacity) {
    //如果ArrayList创建时没指定初始容量，则会用一个空数组来初始化，第一次添加元素才会将容量扩容到10
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    return minCapacity;
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private void grow(int minCapacity) {
    int oldCapacity = elementData.length;
    //每次扩容将容量设置为原来的1.5倍
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    //MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8
    //如果原来容量的1.5倍超出最大容量限制，则根据minCapacity来指定容量
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    //将原来数组元素进行拷贝，容量扩大到指定大小
    elementData = Arrays.copyOf(elementData, newCapacity);
}

private static int hugeCapacity(int minCapacity) {
    if (minCapacity < 0)
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```
### 3、删除元素
```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);
    //计算删除元素后，有多少元素需要向前挪动
    int numMoved = size - index - 1;
    if (numMoved > 0)
        //将后续元素向前挪动
        System.arraycopy(elementData, index+1, elementData, index,
                            numMoved);
    //清除最后一个位置的元素
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
//索引超出范围时抛出异常
private void rangeCheck(int index) {
    if (index >= size)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
```
### 4、其它特点
+ ArrayList中有一个modCount成员变量，它表示ArrayList结构变化的次数，在遍历ArrayList的同时如果进行添加删除数据，会产生ConcurrentModificationException异常；
+ ArrayList不是线程安全的，线程安全的List实现有Vector；
+ ArrayList的随机索取效率非常高，因为它是基于数组来实现的，但插入，删除效率比较低，因为涉及到元素的挪动。
+ Vector初始化时默认大小是10，它能够保证线程安全的原理是在每个方法上加上了synchronized关键字。如果不指定每次扩容多大时(capacityIncrement)，那么每次将容量扩大为原来的2倍，扩容的源码如下：
```java{4}
private void grow(int minCapacity) {
    // overflow-conscious code
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + ((capacityIncrement > 0) ? capacityIncrement : oldCapacity);
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```
+ 除了Vector，使用Collections.synchronizedList(list)方法也能返回一个线程安全的List包装类；