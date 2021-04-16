### 字典树
我们有时可能需要解决下面的问题：
+ 查询一个单词集合中是否存在某一个单词；
+ 查询一个单词集合中是否存在以指定前缀开始的单词；
<Common-Thumb :prefix="'/img/theory/data-structure'" :urls="'trie.png'"/>

### 1、简单实现
```java
public class Trie {

    private Node root;
    private int size;

    public Trie() {
        root = new Node();
    }

    public int getSize() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * 向字典树中添加单词word
     *
     * @param word
     */
    public void add(String word) {
        char ch;
        Node cur = root;
        for (int i = 0; i < word.length(); i++) {
            ch = word.charAt(i);
            if (cur.next.get(ch) == null) {
                cur.next.put(ch, new Node());
            }
            cur = cur.next.get(ch);
        }
        cur.isWord = true;
        size++;
    }

    /**
     * 查询字典树中是否有单词word
     *
     * @param word
     * @return
     */
    public boolean contains(String word) {
        char ch;
        Node cur = root;
        for (int i = 0; i < word.length(); i++) {
            ch = word.charAt(i);
            if (cur.next.get(ch) == null) {
                return false;
            }
            cur = cur.next.get(ch);
        }
        return cur.isWord;
    }

    /**
     * 查找字典树中是否存在前缀prefix
     *
     * @param prefix
     * @return
     */
    public boolean prefix(String prefix) {
        char ch;
        Node cur = root;
        for (int i = 0; i < prefix.length(); i++) {
            ch = prefix.charAt(i);
            if (cur.next.get(ch) == null) {
                return false;
            }
            cur = cur.next.get(ch);
        }
        return true;
    }

    private class Node {
        //以该节点为终点的是否是一个单词
        private boolean isWord;
        //从该节点还能到达哪些节点
        private Map<Character, Node> next;

        public Node(boolean isWord) {
            this.isWord = isWord;
            next = new TreeMap<>();
        }

        public Node() {
            this(false);
        }
    }
}
```
### 2、优点
字典树查询的效率是和单词长度有关的，与字典树中的单词个数无关，单词的长度一般很短，因此利用字典树解决一些问题效率很高。