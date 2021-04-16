### Java集合之HashMap
::: tip 概念
HashMap实现了Map接口，用于存储K-V键值对，是一类无序的集合。
:::
### 1、源码解读
#### 1.1、成员变量
```java
//默认初始容量16
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

//桶的最大容量
static final int MAXIMUM_CAPACITY = 1 << 30;

//默认负载因子的数值0.75
static final float DEFAULT_LOAD_FACTOR = 0.75f;

//链表长度大于8时，转换为红黑树
static final int TREEIFY_THRESHOLD = 8;

//红黑树元素少于6时，转换为链表
static final int UNTREEIFY_THRESHOLD = 6;

//散列表的容量达到64，链表长度达到8，才能转换为红黑树
static final int MIN_TREEIFY_CAPACITY = 64;

//存储数据的数组，长度总是2的幂次
transient Node<K,V>[] table;

//遍历时的entrySet
transient Set<Map.Entry<K,V>> entrySet;

//当前键值对的个数
transient int size;

//结构改变的次数，比如添加，rehash等
transient int modCount;

//扩容的阈值，等于capacity * load factor
int threshold;

//负载因子，衡量数组的装载程度
final float loadFactor;
```
#### 1.2、构造方法
```java
public HashMap(int initialCapacity, float loadFactor) {
    //判断初始容量的合法性
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    //判断负载因子的合法性(大于0)
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
    this.loadFactor = loadFactor;
    //根据用户输入的initialCapacity，算出一个大于等于initialCapacity并且最小的2的幂次的数作为容量
    this.threshold = tableSizeFor(initialCapacity);
}
```
```java
//求出一个最接近且大于cap的2的幂次数
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```
#### 1.3、求hash值
HashMap计算hash值的方式：先取key的hashcode，再将其与自身无符号右移16位之后的结果进行异或运算
```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
#### 1.4、添加元素
```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                boolean evict) {
    //Node数组的引用
    Node<K,V>[] tab; 
    //根据hash算法算出的对应的桶位
    Node<K,V> p; 
    //Node数组的长度和p桶位对应的下标
    int n, i;
    //如果Node数组还没初始化，则进行resize创建数组
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    //如果根据hash算法找到key对应的桶位还没有存放数据，即没有发生冲突，则直接放入该桶
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
    //当前桶位已经有数据
        Node<K,V> e; K k;
        //如果key相同，则直接替换现在的value
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        //如果当前桶位中的节点已经形成树
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
        //如果当前桶位中的节点已经形成链表，则沿着链表进行查找
            for (int binCount = 0; ; ++binCount) {
                //查找到链表尾部也没查找到key相同的节点，则在链表尾部添加当前元素
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                    //如果链表长度大于等于8，且哈希表的容量达到64，转换为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1)
                        treeifyBin(tab, hash);
                    break;
                }
                //沿着链表查找到key相同的元素，则替换该节点的value
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
        //e!=null说明查找到了相同key的节点，这时要进行替换操作
        if (e != null) {
            V oldValue = e.value;
            //onlyIfAbsent表示是否只有在key不存在的情况下才进行添加（如果key已经存在，则更新值），这里通常是false，表示key如果存在，再添加相同的key，就会用新的value替换旧的value。
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    //如果元素个数大于阈值，则进行扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```
put过程总结：
+ 调用hash函数，将hashcode和自身的高16位进行异或运算，拿到hash值；
+ 判断哈希表是否被初始化过，如果没有初始化，则调用resize进行初始化，初始化后容量为默认容量16；
+ 让hash值对长度取模，算出哈希表的索引位置；
+ 如果该索引位置还没有元素放置，则将元素放在该位置；
+ 如果该索引位置已经存在元素，则判断key是否相同，如果相同，则进行替换操作；
+ 如果该索引位置已经存在元素且两者的key不相同，则判断当前节点类型是链表还是红黑树；
+ 如果是红黑树，则将元素插入树中；
+ 如果是链表，则将该元素与链表中的元素一一比较，如果key相同，则进行替换；如果都不相同，则将该元素放在链表尾部，同时判断链表长度是否超过8，
#### 1.5、resize扩容方法
```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    //扩容之前的容量，阈值
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;

    //扩容之后的容量，阈值
    int newCap, newThr = 0;

    //oldCap > 0 表示已经数组初始化过
    if (oldCap > 0) {
        //如果oldCap大于最大容量限制，则返回原来的数组，不再进行扩容
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        //否则的话计算当前容量的二倍，如果小于最大容量而且oldCap >= 16，将新的阈值设置为老的阈值的2倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                    oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }

    //oldCap == 0 数组还没初始化，但是阈值oldThr已经确定，比如下面的情况：
    //new HashMap(initCap, int loadFactor)
    //new HashMap(initCap)
    //new HashMap(map)
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;

    //oldCap == 0 数组还没初始化，oldThr == 0， 比如下面的情况：
    //new HashMap()
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }

    //上面的两个else if分支有可能导致newThr没有设置，这里要统一设置
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                    (int)ft : Integer.MAX_VALUE);
    }

    //将计算出来的阈值保存到成员变量
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})

    //创建数组
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;

    //如果原来的数组中有数据，则要进行相应的拷贝
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                //如果当前桶位只有一个元素，则直接重新利用 hash & (newCap - 1) 计算桶下标，将元素放入
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                //如果当前桶位已经形成树
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                //如果当前桶位已经成链，则扩容后会将单链拆分成两条链
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        //判断容量的最高位是0还是1，如果是0，则会被放入低链
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        //如果是1，则会被放入高链
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    //划分为两条链之后，清空两条链尾指针的next指向，因为在循环遍历中loTail,hiTail都有可能是原来单链的中间节点，那么loTail，hiTail都有下一个节点，分成两条链之后应该将其下一个节点指向清空.
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```