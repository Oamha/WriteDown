---
sidebar: 'auto'
---
## Android中常见的几种布局
+ LinearLayout
+ RelativeLayout
+ GridLayout
+ TableLayout
+ ConstraintLayout
+ FrameLayout
+ AbsoluteLayout
::: tip

+ 除了TableLayout继承自LinearLayout之外，其余均继承自ViewGroup;
+ LinearLayout最常用，子元素可以用layout_weight设置权重，orientation可以设置布局方向;
+ RelativeLayout为相对布局，其子元素不设置相对位置的话会相互重叠，感觉跟CSS的position:absolute类似，可以设置的属性有toRightOf,toLeftOf,below,above,align**等;
+ GridLayout作为容器可以设置rowCount,columnCount,其子元素可以设置rowSpan,columnSpan;
+ TableLayout的子元素如果不用TableRow包裹则默认一个元素占一行，如果用TableRow包裹多个子元素，则这些包裹的元素合起来占一行；可以通过设置stretchColumns来设置哪列可以拉伸，通过设置shrinkColumns来设置哪列可以收缩;
+ ConstraintLayout是比较新的布局方式，通过上下左右约束进行布局;
+ FrameLayout的子元素会进行叠加，通常自定义View可以继承自FrameLayout;
+ AbsoluteLayout已过时，不建议使用;
:::