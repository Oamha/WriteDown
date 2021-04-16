### 用两个栈实现队列
::: tip 描述
用两个栈实现一个队列。队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，分别完成在队列尾部插入整数和在队列头部删除整数的功能。(若队列中没有元素，deleteHead 操作返回 -1 )

示例 1：<br/>
输入：<br/>
["CQueue","appendTail","deleteHead","deleteHead"]<br/>
[[],[3],[],[]]<br/>
输出：[null,null,3,-1]<br/>

示例 2：<br/>
输入：<br/>
["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]<br/>
[[],[],[5],[2],[],[]]<br/>
输出：[null,-1,null,null,5,2]
:::
```java
public class Offer_09 {

    private Stack<Integer> stack1 = new Stack<>();
    private Stack<Integer> stack2 = new Stack<>();

    public void appendTail(int value) {
        stack1.push(value);
    }

    public int deleteHead() {
        if (!stack2.isEmpty()) {
            return stack2.pop();
        }
        while (!stack1.isEmpty()) {
            stack2.push(stack1.pop());
        }
        if (stack2.isEmpty())
            return -1;
        return stack2.pop();
    }
}
```
解题思路：
+ appendTail直接将元素添加到第一个栈中就好；
+ deleteHead时如果第二个栈中不为空，则直接移除栈顶元素就好，否则将第一个栈中的所有元素移入第二个栈中；
+ 注意最终要判断栈是否为空，为空时返回-1；