### Set集合
+ Set代表了一类没有重复元素的集合；
+ Set的底层实现可以有很多种，可以用链表，数组，当然更好的实现方式可以用上一节实现的二分搜索树，因为二分搜索树具有天然的去重特性；
### 1、接口定义
```java
public interface Set<E> {
    int size();

    boolean isEmpty();

    void add(E e);

    boolean remove(E e);

    boolean contains(E e);
}
```
### 2、基于链表的Set集合
#### 2.1、代码实现
第二节已经实现了带有虚假头结点的链表的增删查改等逻辑，我们可以利用它来实现Set的逻辑
```java
public class LinkedListSet<E> implements Set<E> {
    private DummyHeadLinkedList<E> linkedList;

    public LinkedListSet() {
        linkedList = new DummyHeadLinkedList<>();
    }

    @Override
    public int size() {
        return linkedList.size();
    }

    @Override
    public boolean isEmpty() {
        return linkedList.isEmpty();
    }

    @Override
    public void add(E e) {
        if (!linkedList.contains(e)) {
            linkedList.addFirst(e);
        }
    }

    @Override
    public boolean remove(E e) {
        return linkedList.removeElement(e);
    }

    @Override
    public boolean contains(E e) {
        return linkedList.contains(e);
    }

    @Override
    public String toString() {
        return linkedList.toString();
    }
}
```
#### 2.2、时间复杂度分析
+ 删除、查找都要遍历一次链表，时间复杂度毫无疑问是O(n)；
+ 添加元素这里采用在链表头部插入，时间复杂度为O(1)，但每次添加之前要判断元素是否已经存在，所以总体来说添加操作的时间复杂度也是O(n)；

|方法|时间复杂度|
|:----:|:----:|
|add|O(n)|
|remove|O(n)|
|contains|O(n)|
### 3、基于二分搜索树的Set集合
#### 3.1、代码实现
这里复用了第五节实现的二分搜索树.
```java
public class BSTSet<E extends Comparable<E>> implements Set<E> {
    private BinarySearchTree<E> bst;

    public BSTSet() {
        bst = new BinarySearchTree<>();
    }

    @Override
    public int size() {
        return bst.size();
    }

    @Override
    public boolean isEmpty() {
        return bst.isEmpty();
    }

    @Override
    public void add(E e) {
        bst.add(e);
    }

    @Override
    public boolean remove(E e) {
        return bst.remove(e);
    }

    @Override
    public boolean contains(E e) {
        return bst.contains(e);
    }
}
```
#### 3.2、时间复杂度
remove，add，contains都跟二分搜索树的高度有关，理想情况下将二分搜索树看作一个满二叉树，则元素个数n=2^h-1(h为高度)， 则h = log<sub>2</sub>(n+1)，即时间复杂度为O(log<sub>2</sub>(n+1))，忽略底数、常数即是O(logn);
|方法|时间复杂度|
|:----:|:----:|
|add|O(logn)|
|remove|O(logn)|
|contains|O(logn)|