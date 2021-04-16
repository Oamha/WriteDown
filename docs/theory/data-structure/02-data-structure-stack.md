### 栈
+ 栈相当于将上一节实现的数组的一端封住，只让其一端来出入元素；
+ 栈具有后进先出的特点；
+ 利用上一节动态数组的addLast和removeLast方法很容易来模拟栈；
### 1、简单实现
#### 1.1、接口定义
```java
public interface Stack<E> {
    void push(E e);

    E pop();

    boolean isEmpty();

    int size();

    E peek();
}
```
#### 1.2、基于数组的Stack实现
```java
public class ArrayStack<E> implements Stack<E> {
    private Array<E> array;

    public ArrayStack() {
        array = new Array<>();
    }

    @Override
    public void push(E e) {
        array.addLast(e);
    }

    @Override
    public E pop() {
        if (array.isEmpty()) {
            throw new EmptyStackException();
        }
        return array.removeLast();
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
    public E peek() {
        if (array.isEmpty()) {
            throw new EmptyStackException();
        }
        return array.getLast();
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Stack size: %d\n", size()));
        sb.append("[");
        for (int i = 0; i < size(); i++) {
            sb.append(array.get(i));
            if (i != size() - 1) {
                sb.append(", ");
            }
        }
        sb.append("] top");
        return sb.toString();
    }
}
```
### 2、时间复杂度分析
得益于数组的addLast、removeLast和getLast方法，ArrayStack的push、pop和peek的时间复杂度都是O(1)级别；
|方法|时间复杂度|
|:---:|:----:|
|push|O(1)|
|pop|O(1)|
|peek|O(1)|