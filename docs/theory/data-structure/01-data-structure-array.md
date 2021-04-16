### 动态数组
+ Java不支持直接new一个泛型数组，要经过Object数组的转换;
+ 动态数组的本质是通过创建更大容量的新数组，然后将旧数组拷贝到新数组来实现的；
+ 每次扩容多大最好根据当前元素个数来决定，这里采用扩大到当前元素个数的2倍；
+ 当元素个数较少时，可以进行缩容；
### 1、简单实现
```java{30-32,57-59}
public class Array<E> {
    private int size;
    private E[] elements;
    private static final int DEFAULT_INITIAL_CAPACITY = 10;

    public Array(int initCapacity) {
        if (initCapacity < 0) {
            throw new IllegalArgumentException("initCapacity can not be negative");
        }
        elements = (E[]) new Object[initCapacity];
        size = 0;
    }

    public Array() {
        this(DEFAULT_INITIAL_CAPACITY);
    }

    public void addLast(E e) {
        add(size, e);
    }

    public void addFirst(E e) {
        add(0, e);
    }

    public void add(int index, E e) {
        if (index < 0 || index > size) {
            throw new IllegalArgumentException("index is illegal");
        }
        if (size == elements.length) {
            resize(2 * elements.length);
        }
        for (int i = size - 1; i >= index; i--) {
            elements[i + 1] = elements[i];
        }
        elements[index] = e;
        size++;
    }

    private void resize(int newCapacity) {
        E[] newElements = (E[]) new Object[newCapacity];
        for (int i = 0; i < size; i++) {
            newElements[i] = elements[i];
        }
        elements = newElements;
    }

    public E remove(int index) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        E removeEle = elements[index];
        for (int i = index + 1; i < size; i++) {
            elements[i - 1] = elements[i];
        }
        elements[--size] = null; //help gc
        //当元素少于1/4时，触发缩容，这里采用了懒惰的思想，元素个数少于容量1/4时才将容量缩小为1/2，这时为了防止反复添加元素删除元素导致反复扩容缩容
        if (size <= elements.length / 4 && elements.length / 2 != 0 ) {
            resize(elements.length / 2);
        }
        return removeEle;
    }

    public E removeFirst() {
        return remove(0);
    }

    public E removeLast() {
        return remove(size - 1);
    }

    public boolean removeElement(E e) {
        int index = find(e);
        if (index != -1) {
            remove(index);
            return true;
        }
        return false;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public int getCapacity() {
        return elements.length;
    }

    public E get(int index) {
        if (index < 0 || index >= size) {
            throw new ArrayIndexOutOfBoundsException();
        }
        return elements[index];
    }

    public void set(int index, E e) {
        if (index < 0 || index >= size) {
            throw new IllegalArgumentException("index is illegal");
        }
        elements[index] = e;
    }

    public int find(E e) {
        for (int i = 0; i < size; i++) {
            if (elements[i] == e || (e != null && e.equals(elements[i]))) {
                return i;
            }
        }
        return -1;
    }

    public boolean contains(E e) {
        for (int i = 0; i < size; i++) {
            if (elements[i] == e || (e != null && e.equals(elements[i]))) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Array Size : %d , Array Capacity: %d \n", size(), getCapacity()));
        sb.append("[");
        for (int i = 0; i < size; i++) {
            sb.append(elements[i]);
            if (i != size - 1) {
                sb.append(", ");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}
```
### 2、时间复杂度分析
| 方法    |   时间复杂度  |
|:----:|:----:|
|add|O(n)|
|addFirst|O(n)|
|addLast|O(1)|
|remove|O(n)|
|removeFirst|O(n)|
|removeLast|O(1)|
|find|O(n)|
|get|O(1)|
|contains|O(n)|
+ 总体来说，添加、删除元素的时间复杂度都为O(n)(考虑最坏的情况)；根据元素查找时间复杂度为O(n)，根据索引查找时间复杂度为O(1)；
+ 如果考虑扩容的话，可以利用分摊时间复杂度的思想。就addLast方法而言，假设容量为10的话，添加10次元素，第11次添加时触发扩容，此时需要拷贝10个元素，再执行1次添加，总共执行了21次操作，平均每次添加执行2(21/11)次操作，也就是addLast是O(1)级别的；