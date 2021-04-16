### 二分搜索树
+ 没有重复元素；
+ 每个根节点的值大于其左孩子节点的值；
+ 每个根节点的值小于其右孩子节点的值；
+ 每棵子树也是二分搜索树；
+ 二分搜索树中序遍历出的节点是按从小到大顺序的；
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'bst.png'"/>
### 1、简单实现
#### 1.1、代码实现
```java
public class BinarySearchTree<E extends Comparable<E>> {
    private int size;
    private Node root;

    public BinarySearchTree() {
        size = 0;
        root = null;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    /**
     * 是否存在某元素
     *
     * @param e
     * @return
     */
    public boolean contains(E e) {
        return contains(root, e);
    }

    private boolean contains(Node node, E e) {
        if (node == null) {
            return false;
        }
        if (e.compareTo(node.e) == 0) {
            return true;
        } else if (e.compareTo(node.e) < 0) {
            return contains(node.left, e);
        } else {
            return contains(node.right, e);
        }
    }

    /**
     * 添加元素
     *
     * @param e
     */
    public void add(E e) {
        root = add(root, e);
    }

    /**
     * 向以node为根的子树中添加节点，并返回添加节点后该子树的根
     *
     * @param node
     * @param e
     * @return
     */
    private Node add(Node node, E e) {
        if (node == null) {
            size++;
            return new Node(e);
        }
        if (e.compareTo(node.e) < 0) {
            node.left = add(node.left, e);
        } else if (e.compareTo(node.e) > 0) {
            node.right = add(node.right, e);
        }
        return node;
    }

    /**
     * 删除元素
     *
     * @param e
     * @return
     */
    public boolean remove(E e) {
        if (isEmpty()) {
            return false;
        }
        int originSize = size();
        root = remove(root, e);
        return size() < originSize;
    }

    /**
     * 从以node为根的树中删除元素e，并返回删除e之后的该树的根
     *
     * @param node
     * @param e
     * @return
     */
    private Node remove(Node node, E e) {
        //如果树为空或没找到e元素，返回null
        if (node == null) {
            return null;
        }
        //从左子树删除e
        if (e.compareTo(node.e) < 0) {
            node.left = remove(node.left, e);
            return node;
        } else if (e.compareTo(node.e) > 0) {
            //从右子树删除e
            node.right = remove(node.right, e);
            return node;
        } else {
            //当前节点值就是e，删除当前节点

            //如果当前节点只有右子树，则右子树的根即为要返回的根
            if (node.left == null) {
                Node rightNode = node.right;
                node.right = null;
                size--;
                return rightNode;
            }
            //如果当前节点只有左子树，则左子树的根即为要返回的节点
            if (node.right == null) {
                Node leftNode = node.left;
                node.left = null;
                size--;
                return leftNode;
            }
            //如果当前节点既有左子树，又有右子树，则需要查找后继节点（右子树中的最小节点）或者前驱节点（左子树中的最大节点），将前驱节点或后继节点设为要返回的根节点
            //(1)在右子树中查找最小节点（后继节点）
            Node successor = getMin(node.right);
            //(2)后继节点的右子树就是右子树删除后继节点之后的树
            successor.right = removeMin(node.right);
            //(3)后继节点的左子树就是删除节点（node）的左子树
            successor.left = node.left;
            //(4)最后将删除节点的指向左右子树的引用置为空
            node.left = null;
            node.right = null;
            //(5)将这个后继节点作为根节点返回
            return successor;
        }
    }

    /**
     * 删除二分搜索树中的最小节点（最左边的节点）
     *
     * @return
     */
    public E removeMin() {
        E min = getMin();
        root = removeMin(root);
        return min;
    }

    /**
     * 删除以node为根的树中的最小节点，并返回删除最小节点后的树的根
     *
     * @param node
     * @return
     */
    private Node removeMin(Node node) {
        //如果最小节点有右子树，右子树的根需要作为根被返回
        if (node.left == null) {
            Node rightNode = node.right;
            node.right = null;
            size--;
            return rightNode;
        }
        node.left = removeMin(node.left);
        return node;
    }

    /**
     * 删除二分搜索树中的最大节点（最右边的节点）
     *
     * @return
     */
    public E removeMax() {
        E max = getMax();
        root = removeMax(root);
        return max;
    }

    /**
     * 删除以node为根的树中的最大节点，并返回删除最大节点后的树的根
     *
     * @param node
     * @return
     */
    private Node removeMax(Node node) {
        //如果最大节点有左子树，左子树的根需要作为根被返回
        if (node.right == null) {
            Node leftNode = node.left;
            node.left = null;
            size--;
            return leftNode;
        }
        node.right = removeMax(node.right);
        return node;
    }

    /**
     * 前序遍历
     */
    public void preOrderTraversal() {
        preOrderTraversal(root);
    }

    private void preOrderTraversal(Node node) {
        if (node == null) return;
        System.out.println(node.e);
        preOrderTraversal(node.left);
        preOrderTraversal(node.right);
    }

    /**
     * 前序遍历的非递归形式
     */
    public void preOrderTraversalNonRecursive() {
        if (root == null) return;
        Stack<Node> stack = new Stack<>();
        //第一种写法
        /*stack.push(root);
        while (!stack.isEmpty()) {
            Node curr = stack.pop();
            System.out.println(curr.e);
            if (curr.right != null) {
                stack.push(curr.right);
            }
            if (curr.left != null) {
                stack.push(curr.left);
            }
        }*/
        //第二种写法
        Node node = root;
        while (node != null || !stack.isEmpty()) {
            if (node != null) {
                System.out.println(node.e);
                stack.push(node);
                node = node.left;
            } else {
                node = stack.pop().right;
            }
        }
    }

    /**
     * 中序遍历
     */
    public void inOrderTraversal() {
        inOrderTraversal(root);
    }

    private void inOrderTraversal(Node node) {
        if (node == null) return;
        inOrderTraversal(node.left);
        System.out.println(node.e);
        inOrderTraversal(node.right);
    }

    /**
     * 中序遍历的非递归形式
     */
    public void inOrderTraversalNonRecursive() {
        if (root == null) return;
        Stack<Node> stack = new Stack<>();
        Node node = root;
        while (node != null || !stack.isEmpty()) {
            if (node != null) {
                stack.push(node);
                node = node.left;
            } else {
                node = stack.pop();
                System.out.println(node.e);
                node = node.right;
            }
        }
    }

    /**
     * 后序遍历
     */
    public void postOrderTraversal() {
        postOrderTraversal(root);
    }

    private void postOrderTraversal(Node node) {
        if (node == null) return;
        postOrderTraversal(node.left);
        postOrderTraversal(node.right);
        System.out.println(node.e);
    }

    /**
     * 后序遍历的非递归形式
     * stack1入栈顺序是： 根->左孩子->右孩子
     * stack2入栈顺序是： 根->右孩子->左孩子 ，所以stack2出栈顺序是 左孩子->右孩子->根，从而实现后序遍历
     */
    public void postOrderTraversalNonRecursive() {
        if (root == null) return;
        Stack<Node> stack1 = new Stack<>();
        Stack<Node> stack2 = new Stack<>();
        stack1.push(root);
        while (!stack1.isEmpty()) {
            Node node = stack1.pop();
            stack2.push(node);
            if (node.left != null) {
                stack1.push(node.left);
            }
            if (node.right != null) {
                stack1.push(node.right);
            }
        }
        while (!stack2.isEmpty()) {
            System.out.println(stack2.pop().e);
        }
    }

    /**
     * 层次遍历
     */
    public void levelTraversal() {
        if (root == null) return;
        Queue<Node> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node node = queue.remove();
            System.out.println(node.e);
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
    }

    /**
     * 递归获取最小元素
     *
     * @return
     */
    public E getMin() {
        if (isEmpty()) {
            throw new IllegalStateException();
        }
        return getMin(root).e;
    }

    private Node getMin(Node node) {
        if (node.left == null) {
            return node;
        }
        return getMin(node.left);
    }

    /**
     * 递归获取最大元素
     *
     * @return
     */
    public E getMax() {
        if (isEmpty()) {
            throw new IllegalStateException();
        }
        return getMax(root).e;
    }

    private Node getMax(Node node) {
        if (node.right == null) {
            return node;
        }
        return getMax(node.right);
    }

    /**
     * 节点类型
     */
    private class Node {
        private E e;
        //左孩子
        private Node left;
        //右孩子
        private Node right;

        public Node(E e) {
            this.e = e;
            this.left = null;
            this.right = null;
        }

        @Override
        public String toString() {
            return e.toString();
        }
    }
}
```
### 2、时间复杂度分析
| 操作 | 时间复杂度（平均) |
|:----:|:----:|
|删除|O(logn)|
|添加|O(logn)|
|查找|O(logn)|
二分搜索树的插入、删除、查找效率跟它的高度有关。假设二分搜索树是一个满二叉树的话，高度为h的二分搜索树节点个数n=2^h-1，h=log<sub>2</sub>(n+1)，即一个元素从根查找到叶子节点最多经过log<sub>2</sub>(n+1)步，所以二分搜索树的时间复杂度为O(log<sub>2</sub>n)级别的，当然这只是理想情况，二分搜索树不一定都是满二叉树，一棵二分搜索树也可能退化成链表，这时时间复杂度会变成O(n)级别，如下图：
<Common-Thumb :prefix="'/img/theory/data-structure'" :width="600" :urls="'bst-to-linked-list.png'"/>
