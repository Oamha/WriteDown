### Java集合之LinkedList
::: tip 概念
`LinkedList`是`List`接口的另一个实现。与`ArrayList`不同的是，`LinkedList`理论上无容量限制，它采用双向链表的实现方式，使得添加、删除元素效率更高，但占用了更多的空间（存储前驱节点和后继节点的指针），而且查找也没`ArrayList`那样高效。
:::
### 1、构造方法
`LinkedList`提供了两个构造方法，一个空构造方法，一个允许传递一个集合
```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable{
    //当前元素个数
    transient int size = 0;
    //指向首节点的指针
    transient Node<E> first;
    //指向尾结点的指针
    transient Node<E> last;

    public LinkedList() {
    }

    public LinkedList(Collection<? extends E> c) {
        this();
        addAll(c);
    }

    //节点类型
    private static class Node<E> {
        E item;
        Node<E> next;
        Node<E> prev;

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }

    ......
}
```
### 2、添加元素
#### 2.1、在尾部添加元素
```java
public boolean add(E e) {
    linkLast(e);
    return true;
}

void linkLast(E e) {
    final Node<E> l = last;
    //创建一个Node节点，让其prev指针指向last，next指针指向null
    final Node<E> newNode = new Node<>(l, e, null);
    //新创建的节点晋升为最后一个节点
    last = newNode;
    //如果是第一次添加元素，那么头结点就是newNode
    if (l == null)
        first = newNode;
    else
    //否则让原来的尾结点的next指向newNode
        l.next = newNode;
    size++;
    modCount++;
}
```
#### 2.2、在任意位置添加元素
在指定位置添加元素的思路是先判断位置是否合法，如果是末尾，则直接调用linkedLast方法，否则执行linkBefore方法在指定位置插入.
```java
public void add(int index, E element) {
    //检测index是否合法
    checkPositionIndex(index);
    //如果要在末尾追加元素，则调用linkLast
    if (index == size)
        linkLast(element);
    else
    //否则调用linkBefore
        linkBefore(element, node(index));
}

//node方法用于查找指定节点
Node<E> node(int index) {
    //这里的逻辑主要是为了优化查找效率
    //如果index < size/2 ，则从头部开始查找
    if (index < (size >> 1)) {
        Node<E> x = first;
        for (int i = 0; i < index; i++)
            x = x.next;
        return x;
    } else {
    //如果index >= size/2 ，则从尾部开始查找
        Node<E> x = last;
        for (int i = size - 1; i > index; i--)
            x = x.prev;
        return x;
    }
}

//linkBefore的逻辑几乎和linkLast的逻辑一致
void linkBefore(E e, Node<E> succ) {
    final Node<E> pred = succ.prev;
    final Node<E> newNode = new Node<>(pred, e, succ);
    succ.prev = newNode;
    if (pred == null)
        first = newNode;
    else
        pred.next = newNode;
    size++;
    modCount++;
}
```
### 3、删除元素
#### 3.1、删除头结点
```java
public E remove() {
    return removeFirst();
}

public E removeFirst() {
    final Node<E> f = first;
    //如果头结点为空，抛出异常
    if (f == null)
        throw new NoSuchElementException();
    return unlinkFirst(f);
}

private E unlinkFirst(Node<E> f) {
    final E element = f.item;
    final Node<E> next = f.next;
    //释放头结点占用的空间
    f.item = null;
    f.next = null; // help GC
    //头结点的下一个节点晋升为头结点
    first = next;
    //如果删掉头结点后没有节点了，将last置空
    if (next == null)
        last = null;
    else
    //晋升为头结点之后，就没有前一个节点了
        next.prev = null;
    size--;
    modCount++;
    return element;
}
```
#### 3.2、删除尾结点
```java
public E removeLast() {
    final Node<E> l = last;
    if (l == null)
        throw new NoSuchElementException();
    return unlinkLast(l);
}

private E unlinkLast(Node<E> l) {
    // assert l == last && l != null;
    final E element = l.item;
    final Node<E> prev = l.prev;
    //释放尾结点占用的空间
    l.item = null;
    l.prev = null; // help GC
    //尾结点的前一个节点晋升为尾结点
    last = prev;
    //如果删除尾结点，没有节点了，将first置空
    if (prev == null)
        first = null;
    else
    //晋升为尾结点后，就没有后一个节点了
        prev.next = null;
    size--;
    modCount++;
    return element;
}
```
#### 3.3、删除任意一个节点
```java
public E remove(int index) {
    checkElementIndex(index);
    return unlink(node(index));
}

E unlink(Node<E> x) {
    // assert x != null;
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;
    //如果该节点为首节点，那么删除后，它的下一个节点晋升为首节点
    if (prev == null) {
        first = next;
    } else {
        //如果该节点不是首节点，那么删除后，它的前一个节点要链接到该节点的下一个节点
        prev.next = next;
        //清除该节点指向上一个节点的指针
        x.prev = null;
    }

    //如果该节点为尾结点，那么删除后，它的前一个节点晋升为尾节点
    if (next == null) {
        last = prev;
    } else {
         //如果该节点不为尾结点，那么删除后，它的下一个节点要链接到它的前一个节点
        next.prev = prev;
        //清除该节点指向下一个节点的指针
        x.next = null;
    }

    x.item = null;
    size--;
    modCount++;
    return element;
}
```
### 4、其它特点
+ `LinkedList`也不是线程安全的；