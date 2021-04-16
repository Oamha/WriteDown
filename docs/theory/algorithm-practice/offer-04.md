### 二维数组中的查找
::: tip 描述
在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数

[<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[1,   4,  7, 11, 15],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[2,   5,  8, 12, 19],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[3,   6,  9, 16, 22],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[10, 13, 14, 17, 24],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[18, 21, 23, 26, 30]<br/>
]

给定 target = 5，返回 true。

给定 target = 20，返回 false。
:::
```java
public class Offer_04 {
    /**
     * 从右上角开始查找
     *
     * @param matrix
     * @param target
     * @return
     */
    public static boolean findNumberIn2DArray(int[][] matrix, int target) {
        if (matrix == null) throw new NullPointerException();
        int rowLen = matrix.length;
        if (rowLen == 0) return false;
        int colLen = matrix[0].length;  //这一步之前必须判断matrix.length是否为0
        if (colLen == 0) return false;
        int row = 0, col = matrix[0].length - 1;
        while (true) {
            if (row < 0 || row >= rowLen || col < 0 || col >= colLen) {
                return false;
            }
            if (matrix[row][col] > target) {
                col--;
            } else if (matrix[row][col] < target) {
                row++;
            } else {
                return true;
            }
        }
    }


    /**
     * 从左下角开始查找
     *
     * @param matrix
     * @param target
     * @return
     */
    public static boolean findNumberIn2DArray2(int[][] matrix, int target) {
        if (matrix == null) throw new NullPointerException();
        int rowLen = matrix.length;
        if (rowLen == 0) return false;
        int colLen = matrix[0].length;
        if (colLen == 0) return false;
        int row = rowLen - 1, col = 0;
        while (true) {
            if (row < 0 || row >= rowLen || col < 0 || col >= colLen) {
                return false;
            }
            if (matrix[row][col] > target) {
                row--;
            } else if (matrix[row][col] < target) {
                col++;
            } else {
                return true;
            }
        }
    }
}
```
#### 主要思路：
从右上角开始查找，如果当前元素比目标小，则行数加一；如果当前元素比目标大，则列数减一；