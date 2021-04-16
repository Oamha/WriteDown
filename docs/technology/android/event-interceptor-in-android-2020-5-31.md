## 事件拦截
::: tip 前言
安卓中的View体系结构是树形结构，当你点击一个按钮时，它有可能包含在一个父容器中，而这个父容器又有可能包含在另一个父容器中，层层嵌套，那么该点击事件该交由谁来处理呢？这个View（Button)?还是其父容器(ViewGroup)? 还是Activity?事件拦截就是来解决此类问题。
:::
+ 事件拦截在ViewGroup中涉及三个方法：`onInterceptTouchEvent`、`dispatchTouchEvent`和`onTouchEvent`;
+ 在View和Activity中则只有`dispatchTouchEvent`和`onTouchEvent`;
+ 事件传递的方向是由外到内:从Activity -> ViewGroup -> View;
+ 事件处理的方向是由内到外:从View -> ViewGroup -> Activity;
+ 事件处理方法是: onTouchEvent;
+ 事件分发方法为: dispatchTouchEvent;
+ 事件拦截方法为：onInterceptorTouchEvent;
+ 三个方法都有boolean类型的返回值;

事件传递的层次如图所示:
<Common-Thumb :prefix="'/img/conclusion/android'" :width="400" :urls="'event-hierarchy.png'"/>

经分析事件拦截的流程大致如图所示:
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'event-dispatch.png'"/>