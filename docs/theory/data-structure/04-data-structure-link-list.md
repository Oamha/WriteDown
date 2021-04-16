### 链表
+ 链表是一种动态数组结构，在需要时动态申请内存；而数组一次性分配，后续无法再改变；
+ 链表在内存地址空间中是不连续的，数组在内存地址空间中是连续的；
### 1、不带头结点的链表
```java
public class LinkedList<E> {
    private int size;
    private Node<E> head;

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public boolean contains(E ele) {
        Node<E> curr = head;
        while (curr != null) {
            if (curr.e == ele || (curr.e != null && curr.e.equals(ele))) {
                return true;
            }
            curr = curr.next;
        }
        return false;
    }

    public void set(int index, E e) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        Node<E> curr = head;
        for (int i = 0; i < index; i++) {
            curr = curr.next;
        }
        curr.e = e;
    }

    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        Node<E> curr = head;
        for (int i = 0; i < index; i++) {
            curr = curr.next;
        }
        return curr.e;
    }

    public E getFirst() {
        return get(0);
    }

    public E getLast() {
        return get(size - 1);
    }

    public void addLast(E e) {
        add(size, e);
    }

    public void addFirst(E e) {
        head = new Node<>(e, head);
        size++;
    }

    public void add(int index, E e) {
        if (index < 0 || index > size) {
            throw new IllegalArgumentException("index is illegal");
        }
        //添加元素时要找到待添加位置的前一个元素，如果要在头部添加元素，由于头部没有前一个元素，因此要特殊处理
        if (index == 0) {
            addFirst(e);
            return;
        }
        Node<E> prev = head;
        for (int i = 0; i < index - 1; i++) {
            prev = prev.next;
        }
        prev.next = new Node<>(e, prev.next);
        size++;
    }

    public E remove(int index) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        //添加元素时要找到待删除位置的前一个元素，如果要在头部删除元素，由于头部没有前一个元素，因此要特殊处理
        if (index == 0) {
            return removeFirst();
        }
        Node<E> prev = head;
        for (int i = 0; i < index - 1; i++) {
            prev = prev.next;
        }
        Node<E> curr = prev.next;
        prev.next = curr.next;
        curr.next = null;
        size--;
        return curr.e;
    }

    public void removeLast() {
        remove(size - 1);
    }

    public E removeFirst() {
        if (isEmpty()) {
            throw new IllegalStateException("linked list is empty");
        }
        Node<E> retNode = head;
        head = head.next;
        retNode.next = null;
        size--;
        return retNode.e;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("LinkedList size: %d\n", size()));
        Node<E> temp = head;
        for (int i = 0; i < size; i++) {
            sb.append(temp.e);
            temp = temp.next;
            if (temp != null) {
                sb.append("-->");
            } else {
                sb.append("-->NULL");
            }
        }
        return sb.toString();
    }

    private static class Node<E> {
        E e;
        Node<E> next;

        public Node() {
            this.e = null;
            this.next = null;
        }

        public Node(E e, Node next) {
            this.e = e;
            this.next = next;
        }

        public Node(E e) {
            this.e = e;
            this.next = null;
        }

        @Override
        public String toString() {
            return e.toString();
        }
    }
}
```
### 2、带有虚假头结点链表
+ 设置一个虚假的头结点，能够保证每个存储数据的节点前面都有另外一个节点，统一了添加和删除操作；
```java
public class DummyHeadLinkedList<E> {

    private int size;
    //虚假头结点，不存储数据
    private Node<E> dummyHead;

    public DummyHeadLinkedList() {
        dummyHead = new Node<>();
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public boolean contains(E ele) {
        Node<E> curr = dummyHead.next;
        while (curr != null) {
            if (curr.e == ele || (curr.e != null && curr.e.equals(ele))) {
                return true;
            }
            curr = curr.next;
        }
        return false;
    }

    public void set(int index, E e) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        Node<E> curr = dummyHead.next;
        for (int i = 0; i < index; i++) {
            curr = curr.next;
        }
        curr.e = e;
    }

    public void add(int index, E e) {
        if (index < 0 || index > size) {
            throw new IllegalArgumentException("index is illegal");
        }
        //从虚假头结点开始移动
        Node<E> prev = dummyHead;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }
        prev.next = new Node<>(e, prev.next);
        size++;
    }

    public void addLast(E e) {
        add(size, e);
    }

    public void addFirst(E e) {
        add(0, e);
    }

    public E remove(int index) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        //从虚假头结点开始移动
        Node<E> prev = dummyHead;
        for (int i = 0; i < index; i++) {
            prev = prev.next;
        }
        Node<E> curr = prev.next;
        prev.next = curr.next;
        curr.next = null;
        size--;
        return curr.e;
    }

    public E removeFirst() {
        return remove(0);
    }

    public E removeLast() {
        return remove(size - 1);
    }

    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        Node<E> curr = dummyHead.next;
        for (int i = 0; i < index; i++) {
            curr = curr.next;
        }
        return curr.e;
    }

    public E getFist() {
        return get(0);
    }

    public E getLast() {
        return get(size - 1);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("LinkedList size: %d\n", size()));
        Node<E> curr = dummyHead.next;
        for (int i = 0; i < size; i++) {
            sb.append(curr.e);
            curr = curr.next;
            if (curr != null) {
                sb.append("-->");
            } else {
                sb.append("-->NULL");
            }
        }
        return sb.toString();
    }

    private static class Node<E> {
        E e;
        Node<E> next;

        public Node() {
            this.e = null;
            this.next = null;
        }

        public Node(E e, Node next) {
            this.e = e;
            this.next = next;
        }

        public Node(E e) {
            this.e = e;
            this.next = null;
        }

        @Override
        public String toString() {
            return e.toString();
        }
    }
}
```
### 3、时间复杂度的分析
|方法|时间复杂度|
|:----:|:----:|
|addLast|O(n)|
|addFirst|O(1)|
|add|O(n)|
|removeLast|O(n)|
|removeFirst|O(1)|
|remove|O(n)|
|get|O(n)|
|contains|O(n)|
链表添加、删除本质上操作很少，但其定位元素需要花费很多时间。
### 4、应用
#### 4.1、基于链表的栈
由于在链表的头部进行添加、删除元素时间复杂度都是O(1), 我们可以将链表头部作为栈顶来模拟栈。
```java
public class LinkedStack<E> implements Stack<E> {
    private DummyHeadLinkedList<E> linkedList;

    public LinkedStack() {
        linkedList = new DummyHeadLinkedList<>();
    }

    @Override
    public void push(E e) {
        linkedList.addFirst(e);
    }

    @Override
    public E pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return linkedList.removeFirst();
    }

    @Override
    public boolean isEmpty() {
        return linkedList.isEmpty();
    }

    @Override
    public int size() {
        return linkedList.size();
    }

    @Override
    public E peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return linkedList.getFist();
    }
}
```
#### 4.2、基于链表的队列
当基于链表来实现队列时，出队，入队总有一个时间复杂度是O(n)，这在数据规模比较大时，耗时将会很长。
```java
public class LinkedQueue<E> implements Queue<E> {
    private DummyHeadLinkedList<E> linkedList;

    public LinkedQueue() {
        this.linkedList = new DummyHeadLinkedList<>();
    }

    @Override
    public boolean isEmpty() {
        return linkedList.isEmpty();
    }

    @Override
    public int size() {
        return linkedList.size();
    }

    @Override
    public void enqueue(E e) {
        //链表尾部作为队尾
        linkedList.addLast(e);
    }

    @Override
    public E dequeue() {
        if (linkedList.isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        //链表首部作为队首
        return linkedList.removeFirst();
    }

    @Override
    public E front() {
        if (linkedList.isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        return linkedList.getFist();
    }
}
```
我们可以通过添加一个尾指针来优化入队操作，不用每次入队都要重新定位尾部元素，这样出队，入队时间复杂度都是O(1)；
```java
public class OptimizedLinkedQueue<E> implements Queue<E> {

    private Node<E> head;
    private Node<E> tail;
    private int size;

    public OptimizedLinkedQueue() {
        size = 0;
        head = null;
        tail = null;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public void enqueue(E e) {
        //如果队列为空，head = tail = 新创建的节点
        if (tail == null) {
            tail = new Node<>(e);
            head = tail;
        } else {
        //否则在tail后添加节点并将tail后移
            tail.next = new Node<>(e);
            tail = tail.next;
        }
        size++;
    }

    @Override
    public E dequeue() {
        if (isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        Node<E> temp = head;
        //删除头结点，头指针后移
        head = head.next;
        temp.next = null;
        if (head == null) {
            tail = null;
        }
        size--;
        return temp.e;
    }

    @Override
    public E front() {
        if (isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        return head.e;
    }

    private static class Node<E> {
        E e;
        Node<E> next;

        public Node() {
            this.e = null;
            this.next = null;
        }

        public Node(E e, Node next) {
            this.e = e;
            this.next = next;
        }

        public Node(E e) {
            this.e = e;
            this.next = null;
        }

        @Override
        public String toString() {
            return e.toString();
        }
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("OptimizedLinkedQueue %d\n", size()));
        sb.append("front [");
        Node<E> temp = head;
        for (int i = 0; i < size; i++) {
            sb.append(temp.e);
            temp = temp.next;
            if (temp != null) {
                sb.append(", ");
            }
        }
        sb.append("] tail");
        return sb.toString();
    }
}
```