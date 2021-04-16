### Map映射
+ 映射通常用来表示一一对应的关系，在一些计算机语言中又将其称之为字典，因为每个词都有自己相对应的释义；
+ 映射在计算机中以K-V键值对的形式来表示；
+ 与Set类似，实现Map的方式也有很多种；
### 1、接口定义
```java
public interface Map<K, V> {
    //返回键值对的个数
    int size();
    //Map集合是否为空
    boolean isEmpty();
    //Map中是否包含指定key
    boolean containsKey(K key);
    //Map中是否包含指定value
    boolean containsValue(V value);
    //向Map中添加k-v键值对，如果key已经存在，则更新key对应的value，返回原来的value，如果key不存在，则添加，返回null
    V put(K key, V value);
    //获取指定key对应的value
    V get(K key);
    //删除指定的k-v键值对，返回key对应的value
    V remove(K key);
}
```
### 2、基于链表的Map集合
#### 2.1、代码实现
```java
public class LinkedListMap<K, V> implements Map<K, V> {
    private Node dummyHead;
    private int size;

    public LinkedListMap() {
        this.dummyHead = new Node();
        this.size = 0;
    }

    @Override
    public int size() {
        return size;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public boolean containsKey(K key) {
        return getNodeByKey(key) != null;
    }

    //查找指定key的node
    private Node getNodeByKey(K key) {
        Node curr = dummyHead.next;
        while (curr != null) {
            if (curr.key == key || (curr.key != null && curr.key.equals(key))) {
                return curr;
            }
            curr = curr.next;
        }
        return null;
    }

    @Override
    public boolean containsValue(V value) {
        return getNodeByValue(value) != null;
    }

    //查找指定value的node
    private Node getNodeByValue(V value) {
        Node curr = dummyHead.next;
        while (curr != null) {
            if (curr.value == value || (curr.value != null && curr.value.equals(value))) {
                return curr;
            }
            curr = curr.next;
        }
        return null;
    }

    @Override
    public V put(K key, V value) {
        Node node = getNodeByKey(key);
        V oldValue = null;
        if (node != null) {
            //key已经存在，更新value
            oldValue = node.value;
            node.value = value;
        } else {
            //key不存在，创建新节点
            dummyHead.next = new Node(key, value, dummyHead.next);
            size++;
        }
        return oldValue;
    }

    @Override
    public V get(K key) {
        Node target = getNodeByKey(key);
        return target == null ? null : target.value;
    }

    @Override
    public V remove(K key) {
        Node prev = dummyHead;
        while (prev.next != null) {
            if (prev.next.key == key || (prev.next.key != null && prev.next.key.equals(key))) {
                break;
            }
            prev = prev.next;
        }
        Node target = prev.next;
        if (target != null) {
            prev.next = target.next;
            target.next = null;
            size--;
            return target.value;
        }
        return null;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(String.format("Map size: %d\n", size));
        sb.append("{");
        Node curr = dummyHead.next;
        for (int i = 0; i < size; i++) {
            sb.append(curr);
            curr = curr.next;
        }
        sb.append("}");
        return sb.toString();
    }

    //K-V键值对
    private class Node {
        K key;
        V value;
        Node next;

        public Node(K key, V value, Node next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }

        public Node(K key, V value) {
            this(key, value, null);
        }

        public Node() {
            this(null, null, null);
        }

        @Override
        public String toString() {
            return "{ " + this.key + " : " + this.value + " }";
        }
    }
}
```
#### 2.2、时间复杂度分析
基于链表的Map集合的所有操作都要遍历链表，所以时间复杂度都是O(n);
|操作|实现复杂度|
|:----:|:----:|
|containsKey|O(n)|
|containsValue|O(n)|
|put|O(n)|
|get|O(n)|
|remove|O(n)|
### 3、基于二分搜索树的Map集合
#### 3.1、代码实现
```java
public class BSTMap<K extends Comparable<K>, V> implements Map<K, V> {
    private Node root;
    private int size;

    @Override
    public int size() {
        return size;
    }

    @Override
    public boolean isEmpty() {
        return size == 0;
    }

    @Override
    public boolean containsKey(K key) {
        Node target = getNodeByKey(key);
        return target != null;
    }

    public Node getNodeByKey(K key) {
        return getNodeByKey(root, key);
    }

    //递归查找指定key对应的node节点
    private Node getNodeByKey(Node node, K key) {
        if (node == null) {
            return null;
        }
        if (key.compareTo(node.key) == 0) {
            return node;
        } else if (key.compareTo(node.key) < 0) {
            return getNodeByKey(node.left, key);
        } else {
            return getNodeByKey(node.right, key);
        }
    }

    @Override
    public boolean containsValue(V value) {
        return containsValue(root, value);
    }

    private boolean containsValue(Node root, V value) {
        if (root == null) {
            return false;
        }
        if (Objects.equals(root.value, value)) {
            return true;
        }
        return containsValue(root.left, value) || containsValue(root.right, value);
    }

    @Override
    public V put(K key, V value) {
        Node target = getNodeByKey(key);
        V oldValue = null;
        if (target != null) {
            //key已经存在，更新key对应的value
            oldValue = target.value;
            target.value = value;
        } else {
            //key不存在，添加新节点
            add(key, value);
        }
        return oldValue;
    }

    private void add(K key, V value) {
        root = add(root, key, value);
    }

    private Node add(Node node, K key, V value) {
        if (node == null) {
            size++;
            return new Node(key, value);
        }
        if (key.compareTo(node.key) < 0) {
            node.left = add(node.left, key, value);
        } else if (key.compareTo(node.key) > 0) {
            node.right = add(node.right, key, value);
        }
        return node;
    }

    @Override
    public V get(K key) {
        Node target = getNodeByKey(key);
        return target == null ? null : target.value;
    }

    @Override
    public V remove(K key) {
        Node target = getNodeByKey(key);
        if (target == null) {
            return null;
        }
        root = remove(root, key);
        return target.value;
    }

    //删除任意节点，逻辑与之前二分搜索删除逻辑一样
    private Node remove(Node node, K key) {
        if (node == null) {
            return null;
        }
        int compareResult = key.compareTo(node.key);
        if (compareResult < 0) {
            node.left = remove(node.left, key);
            return node;
        } else if (compareResult > 0) {
            node.right = remove(node.right, key);
            return node;
        } else {
            if (node.left == null) {
                Node rightNode = node.right;
                node.right = null;
                size--;
                return rightNode;
            }

            if (node.right == null) {
                Node leftNode = node.left;
                node.right = null;
                size--;
                return leftNode;
            }

            Node successor = getMin(node.right);
            successor.left = node.left;
            successor.right = removeMin(node.right);
            node.left = null;
            node.right = null;
            return successor;
        }
    }

    //移除一个树中的最小节点(最左边的节点), 同时返回移除最小节点后的这棵树的根
    private Node removeMin(Node node) {
        if (node.left == null) {
            Node rightNode = node.right;
            node.right = null;
            size--;
            return rightNode;
        }
        node.left = removeMin(node.left);
        return node;
    }

    //找到以node为根的树的最小节点
    private Node getMin(Node node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }

    /**
     * K-V键值对的节点类型
     */
    private class Node {
        private K key;
        private V value;
        //左孩子
        private Node left;
        //右孩子
        private Node right;

        public Node(K key, V value) {
            this.key = key;
            this.value = value;
            this.left = null;
            this.right = null;
        }

        @Override
        public String toString() {
            return key.toString() + " : " + value.toString();
        }
    }
}
```
#### 3.2、时间复杂度分析
|操作|实现复杂度|
|:----:|:----:|
|containsKey|O(logn)|
|containsValue|O(n)|
|put|O(logn)|
|get|O(logn)|
|remove|O(logn)|

::: warning 注意
基于链表的Map集合的实现中不要求K类型实现Comparable接口，而基于二分搜索树的Map集合实现中K类型必须要实现Comparable接口，因为二分搜索树要依靠Comparable接口来进行key的比较，从而保证节点的相应顺序。
:::