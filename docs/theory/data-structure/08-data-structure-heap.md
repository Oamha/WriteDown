### 堆
### 1、堆的性质
+ 堆属于一种完全二叉树；
+ 大顶堆的根不小于其子节点；
+ 小顶堆的根不大于其子节点；
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'heap.png'"/>
+ 图一就是一个大顶堆，而图二不符合完全二叉树的定义，完全二叉树可以简单理解为从层次上节点按顺序排列，但16节点还没有左孩子节点，就已经有右孩子节点了，显然不符合定义；
+ 另外，大顶堆只限制根节点小于等于孩子节点，但孩子节点和叔叔节点并无大小关系，比如图一中的16小于32和18，但仍然符合大顶堆的定义；
+ 得益于完全二叉树的特性，我们可以用数组来表示堆：
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'array-heap.png'"/>
从图中可以看出:
+ leftChildIndex = 2 * parentIndex + 1;
+ rightChildIndex =  2 * parentIndex + 2;
+ parentIndex = childIndex / 2;

leftChildIndex、rightChildIndex、parentIndex分别表示左孩子的索引、右孩子的索引和父亲节点的索引；
### 2、堆的实现
```java
//大顶堆
public class MaxHeap<E extends Comparable<E>> {
    private Array<E> array;

    public MaxHeap(int capacity) {
        array = new Array<>(capacity);
    }

    public MaxHeap() {
        array = new Array<>();
    }

    private MaxHeap(E[] arr) {
        array = new Array<E>(arr);
        //从最后一个非叶子节点开始下沉，直到根节点
        for (int i = parentIndex(array.size() - 1); i >= 0; i--) {
            siftDown(i);
        }
    }

    //将任意一个数组整理为堆
    public static <E extends Comparable<E>> MaxHeap<E> heapify(E[] arr) {
        return new MaxHeap<E>(arr);
    }

    public boolean isEmpty() {
        return array.isEmpty();
    }

    public int size() {
        return array.size();
    }

    /**
     * 在数组末尾添加元素并将其上浮直至重新满足大顶堆
     *
     * @param e
     */
    public void add(E e) {
        //(1)将元素添加至最后一个叶子节点
        array.addLast(e);
        //(2)将元素上浮至合适的位置
        siftUp(array.size() - 1);
    }

    private void siftUp(int index) {
        int parentIndex;
        //不断与根比较大小，如果当前节点比根大，则当前节点与根交互
        while (index != 0 && array.get(parentIndex = parentIndex(index)).compareTo(array.get(index)) < 0) {
            array.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    /**
     * 获取子节点的父亲节点在数组中的位置
     *
     * @param childIndex
     * @return
     */
    public int parentIndex(int childIndex) {
        if (childIndex == 0) {
            throw new IllegalArgumentException("heap root has not parent node");
        }
        return childIndex / 2;
    }

    /**
     * 移除堆顶元素
     *
     * @return
     */
    public E extractMax() {
        E maxValue = array.getFirst();
        //(1)将最后的子节点移至堆顶
        array.swap(0, array.size() - 1);
        //(2)删除最后一个子节点
        array.removeLast();
        //(3)下沉堆顶节点至合适的位置
        siftDown(0);
        return maxValue;
    }

    private void siftDown(int index) {
        int leftChildIndex, rightChildIndex, targetIndex;
        while ((leftChildIndex = leftChildIndex(index)) < size()) {
            targetIndex = leftChildIndex;
            if ((rightChildIndex = leftChildIndex + 1) < size() && array.get(leftChildIndex).compareTo(array.get(rightChildIndex)) < 0) {
                targetIndex = rightChildIndex;
            }
            if (array.get(index).compareTo(array.get(targetIndex)) >= 0) {
                break;
            }
            array.swap(index, targetIndex);
            index = targetIndex;
        }
    }

    /**
     * 获取父节点的左孩子节点在数组中的位置
     *
     * @param parentIndex
     * @return
     */
    public int leftChildIndex(int parentIndex) {
        return 2 * parentIndex + 1;
    }

    /*
    * 返回堆顶元素
    *
    * @return
    */
    public E getHeapTop() {
        if(size() == 0){
            throw new ArrayIndexOutOfBoundsException();
        }
        return array.getFirst();
    }

    /**
     * 替换堆顶元素
     *
     * @param e
     * @return
     */
    public E replace(E e) {
        E maxValue = array.getFirst();
        array.set(0, e);
        siftDown(0);
        return maxValue;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        int count = 0;
        int bound = (int) Math.pow(2, count);
        for (int i = 0; i < size(); i++) {
            sb.append(array.get(i))
                    .append(" ");
            bound--;
            if (bound <= 0) {
                sb.append("\n");
                count++;
                bound = (int) Math.pow(2, count);
            }
        }
        return sb.toString();
    }
}
```
### 3、堆的应用
使用上面实现的大顶堆，我们可以轻松地实现一个优先队列(入队时正常入队，出队时按照一定的优先级)。
```java
public class PriorityQueue<E extends Comparable<E>> implements Queue<E> {
    private MaxHeap<E> heap;

    public PriorityQueue() {
        heap = new MaxHeap<>();
    }

    @Override
    public boolean isEmpty() {
        return heap.isEmpty();
    }

    @Override
    public int size() {
        return heap.size();
    }

    @Override
    public void enqueue(E e) {
        heap.add(e);
    }

    @Override
    public E dequeue() {
        return heap.extractMax();
    }

    @Override
    public E front() {
        return heap.getHeapTop();
    }
}
```