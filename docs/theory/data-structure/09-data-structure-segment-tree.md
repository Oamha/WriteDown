### 线段树
有时我们会遇到这些问题：
+ 针对一个数组，对其一段区间内元素进行快速求和；
+ 统计一段区间内的最大最小值；
这时我们就有可能用到线段树；
### 1、特性
线段树有以下特性：
+ 线段树是平衡二叉树；
+ 线段树不一定是完全二叉树；
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'segment-tree.png'"/>
如图中，我们用根节点表示0-9这10个元素的和，而根节点的左右孩子节点分别表示0-4这5个元素的和与5-9这5个元素的和，以此类推，直到到达叶子节点，此时叶子节点分别表示每个元素的值（区间长度为一）；对于不能平分的区间，我们这里采用了用右孩子来存储更大的区间的方式，当然用左孩子来表示更大的区别也是没有问题的；
### 2、线段树的表示
与堆类似，线段树也是可以用数组来存储的，只不过数组会有很多空闲的空间；
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'represent-segment-tree-using-array.png'"/>
从图中我们发现一棵满二叉树前h层总共有2<sup>h</sup>-1个元素，第h+1层有2<sup>h</sup>个元素，每一层元素个数大概是前面所有层元素个数之和。假设第h+1层有n个节点，全部用来存储线段树所有叶子节点的话（区间长度为一的节点的话），那么之前的h层也是n个节点，这就至少2n个数组空间来进行存储了。考虑最坏的情况，n = 2<sup>h</sup> + 1，也就是最后一层存不下所有叶子节点，那么就需要再加一层来保证所有元素都被放入数组当中，所以用数组来存储线段树至少保证有4n的空间。
### 3、实现
```java
public class SegmentTree<E> {
    private E[] tree;
    private E[] data;
    private MergePolicy<E> policy;

    interface MergePolicy<E> {
        E merge(E a1, E a2);
    }

    public SegmentTree(E[] arr, MergePolicy<E> policy) {
        this.policy = policy;
        data = (E[]) new Object[arr.length];
        for (int i = 0; i < arr.length; i++) {
            data[i] = arr[i];
        }
        tree = (E[]) new Object[4 * arr.length];
        buildSegmentTree();
    }

    private void buildSegmentTree() {
        buildSegmentTree(0, 0, data.length - 1);
    }

    /**
     * 递归构建线段树
     *
     * @param parentIndex
     * @param l
     * @param r
     */
    private void buildSegmentTree(int parentIndex, int l, int r) {
        //到达叶子节点，对叶子节点进行赋值
        if (l == r) {
            tree[parentIndex] = data[l];
            return;
        }
        //没有到达叶子节点
        int mid = l + (r - l) / 2;
        int leftChildIndex = leftChildIndex(parentIndex);
        int rightChildIndex = rightChildIndex(parentIndex);
        //递归构建左子树
        buildSegmentTree(leftChildIndex, l, mid);
        //递归构建右子树
        buildSegmentTree(rightChildIndex, mid + 1, r);
        //回溯的时候根据左子树和右子树对根节点进行求值
        tree[parentIndex] = policy.merge(tree[leftChildIndex], tree[rightChildIndex]);
    }

    /**
     * 查询一段区间内元素的和
     *
     * @param l
     * @param r
     * @return
     */
    public E search(int l, int r) {
        if (l < 0 || l >= data.length || r < 0 || r >= data.length || l > r) {
            throw new ArrayIndexOutOfBoundsException();
        }
        return search(0, 0, data.length - 1, l, r);
    }

    private E search(int parentIndex, int l, int r, int targetL, int targetR) {
        //查找到指定区间，返回节点值
        if (l == targetL && r == targetR) {
            return tree[parentIndex];
        }
        int mid = l + (r - l) / 2;
        int leftChildIndex = leftChildIndex(parentIndex);
        int rightChildIndex = rightChildIndex(parentIndex);
        //待查找区间在该节点所表示区间的右半部分
        if (targetL >= mid + 1) {
            return search(rightChildIndex, mid + 1, r, targetL, targetR);
        } else if (targetR <= mid) {
            //待查找区间在该节点所表示区间的左半部分
            return search(leftChildIndex, l, mid, targetL, targetR);
        } else {
            //待查找区间在该节点所表示区间的左右部分都有分布
            E leftResult = search(leftChildIndex, l, mid, targetL, mid);
            E rightResult = search(rightChildIndex, mid + 1, r, mid + 1, targetR);
            return policy.merge(leftResult, rightResult);
        }
    }

    /**
     * 更新线段树中的节点值
     *
     * @param index
     * @param e
     */
    public void set(int index, E e) {
        if (index < 0 || index > data.length) {
            throw new ArrayIndexOutOfBoundsException();
        }
        data[index] = e;
        update(0, 0, data.length - 1, index, e);
    }

    private void update(int parentIndex, int l, int r, int index, E e) {
        //到达叶子节点，说明查找到指定索引
        if (l == r) {
            tree[parentIndex] = e;
            return;
        }
        int mid = l + (r - l) / 2;
        int leftChildIndex = leftChildIndex(parentIndex);
        int rightChildIndex = rightChildIndex(parentIndex);
        //待更新索引在该节点所表示区间的左边
        if (index <= mid) {
            update(leftChildIndex, l, mid, index, e);
        } else {
            //待更新索引在该节点所表示区间的右边
            update(rightChildIndex, mid + 1, r, index, e);
        }
        //回溯时更新父节点
        tree[parentIndex] = policy.merge(tree[leftChildIndex], tree[rightChildIndex]);
    }

    private int rightChildIndex(int parentIndex) {
        return 2 * parentIndex + 2;
    }

    private int leftChildIndex(int parentIndex) {
        return 2 * parentIndex + 1;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < tree.length; i++) {
            if (tree[i] == null) {
                sb.append("null");
            } else {
                sb.append(tree[i]);
            }
            if (i != tree.length - 1) {
                sb.append(" ");
            }
        }
        return sb.toString();
    }
}
```