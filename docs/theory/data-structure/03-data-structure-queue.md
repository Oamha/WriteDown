### 队列
+ 队列相当于对动态数组进行限制，一端只能进，另一端只能出；
+ 队列具有先进先出的特点；
+ 利用动态数组的removeFirst和addLast方法可以模拟队列；
### 1、接口定义
```java
public interface Queue<E> {
    boolean isEmpty();

    int size();

    void enqueue(E e);

    E dequeue();

    E front();
}
```
### 2、基于动态数组的Queue实现
```java
public class ArrayQueue<E> implements Queue<E> {
    private Array<E> array;

    public ArrayQueue() {
        this.array = new Array<>();
    }

    @Override
    public boolean isEmpty() {
        return array.isEmpty();
    }

    @Override
    public int size() {
        return array.size();
    }

    @Override
    public void enqueue(E e) {
        array.addLast(e);
    }

    @Override
    public E dequeue() {
        if(array.isEmpty()){
            throw new NoSuchElementException();
        }
        return array.removeFirst();
    }

    @Override
    public E front() {
        if(array.isEmpty()){
            throw new NoSuchElementException();
        }
        return array.getFirst();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Queue size: %d\n", size()));
        sb.append("front [");
        for (int i = 0; i < size(); i++) {
            sb.append(array.get(i));
            if (i != size() - 1) {
                sb.append(", ");
            }
        }
        sb.append("] tail");
        return sb.toString();
    }
}
```
#### 2.1、时间复杂度分析
由于动态数组删除头元素后续元素都要前移，所以基于动态数组来实现的的队列出队的时间复杂度为O(n);
|方法|时间复杂度|
|:----:|:---:|
|enqueue|O(1)|
|dequeue|O(n)|
### 3、循环队列的实现
为了解决上面所说的出队时间复杂度为O(n)的问题，我们考虑每次出队，能不能不移动元素，于是有了循环队列。循环队列有两个指针，分别指向第一个元素和最后一个元素的下一个位置。
+ 循环队列为空时：front == tail;
+ 循环队列满时：(tail + 1) % elements.length == front;
```java
public class LoopQueue<E> implements Queue<E> {
    private E[] elements;
    private int size;
    private int front;
    private int tail;
    private static final int DEFAULT_INIT_CAPACITY = 10;

    public LoopQueue(int initCapacity) {
        if (initCapacity < 0) {
            throw new IllegalArgumentException("initCapacity can not be negative");
        }
        elements = (E[]) new Object[initCapacity + 1];
        size = 0;
        front = 0;
        tail = 0;
    }

    public LoopQueue() {
        this(DEFAULT_INIT_CAPACITY);
    }

    @Override
    public boolean isEmpty() {
        return front == tail;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public void enqueue(E e) {
        if ((tail + 1) % elements.length == front) {
            resize(2 * elements.length);
        }
        elements[tail] = e;
        //入队时尾指针向后移动
        tail = (tail + 1) % elements.length;
        size++;
    }

    private void resize(int newCapacity) {
        E[] newElements = (E[]) new Object[newCapacity + 1];
        for (int i = 0; i < size; i++) {
            newElements[i] = elements[(front + i) % elements.length];
        }
        elements = newElements;
        front = 0;
        tail = size;
    }

    @Override
    public E dequeue() {
        if (isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        E retVal = elements[front];
        elements[front] = null;   //help gc
        //出队时头指针向后移动
        front = (front + 1) % elements.length;
        size--;
        return retVal;
    }

    @Override
    public E front() {
        if (isEmpty()) {
            throw new IllegalStateException("can not dequeue from an empty queue");
        }
        return elements[front];
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("LoopQueue front: %d, tail: %d, size %d, capacity: %d\n", front, tail, size, elements.length));
        sb.append("[");
        int index;
        //第一种遍历方式
        /*for (int i = 0; i < size; i++) {
            index = (front + i) % elements.length;
            sb.append(elements[index]);
            if ((index + 1) % elements.length != tail) {
                sb.append(", ");
            }
        }*/

        //第二种遍历方式
        for (int i = front; i != tail; i = (i + 1) % elements.length) {
            sb.append(elements[i]);
            if ((i + 1) % elements.length != tail) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
```
#### 3.1、时间复杂度分析
没有了元素移动，队列的出队时间复杂度变成了O(1);
|方法|时间复杂度|
|:----:|:----:|
|enqueue|O(1)|
|dequeue|O(1)|