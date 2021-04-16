### 从尾到头打印链表
::: tip 描述
输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

示例 1：

输入：head = [1,3,2]<br/>
输出：[2,3,1]
:::
```java
public class Offer_06 {
    public static class ListNode {
        int val;
        ListNode next;

        ListNode(int x) {
            val = x;
        }

        @Override
        public String toString() {
            return "ListNode{" +
                    "val=" + val +
                    '}';
        }
    }

    //利用栈
    public static int[] reversePrint(ListNode head) {
        Stack<Integer> stack = new Stack<>();
        while (head != null) {
            stack.add(head.val);
            head = head.next;
        }
        int[] arr = new int[stack.size()];
        for (int i = 0; i < arr.length; i++) { //arr.length不能写成stack.size()，否则一边遍历一边删除
            arr[i] = stack.pop();
        }
        return arr;
    }

    //利用递归的形式
    public static int[] reversePrint2(ListNode head) {
        List<Integer> list = new ArrayList<>();
        list = recursiveTraversal(head, list);
        int[] arr = new int[list.size()];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = list.get(i);
        }
        return arr;
    }

    private static List<Integer> recursiveTraversal(ListNode head, List<Integer> list) {
        if (head != null) {
            list = recursiveTraversal(head.next, list);
            list.add(head.val);
        }
        return list;
    }

    /**
     * 将链表原地反转
     *
     * @param head
     * @return
     */
    public static int[] reversePrint3(ListNode head) {
        if (head == null) return new int[0];
        int count = 1;
        ListNode p, tail = head;
        while (tail.next != null) {
            count++;
            p = head;
            head = tail.next;
            tail.next = head.next;
            head.next = p;
        }
        int[] arr = new int[count];
        int len = 0;
        while (len < count) {
            arr[len] = head.val;
            head = head.next;
            len++;
        }
        return arr;
    }
}
```
#### 解题思路：
+ 将元素一一入栈再出栈，出栈的顺序便是逆序的；
+ 利用递归，递归本身具有栈的性质；
+ 将链表原地反转，反转过程如下：
<Common-Thumb :prefix="'/img/theory/algorithm'" :urls="'reverse-link-list.png'"/>
