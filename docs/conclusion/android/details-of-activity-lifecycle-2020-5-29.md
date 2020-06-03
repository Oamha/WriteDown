## Activity的生命周期
<Common-Thumb :prefix="'/img/conclusion/android'" :urls="'lifecycle-of-activity.jpg'" :width="600"/>

+ 第一次打开执行`onCreate` -> `onStart` -> `onResume`;
+ 用户按back键，执行`onPause` -> `onStop` -> `onDestroy`;
+ 当跳转新的Activity或者按Home键返回桌面，执行`onPause` -> `onStop`,但当跳转的Activity主题为透明时，不会执行`onStop`方法;
+ 屏幕关闭时执行`onPause` -> `onStop`;

::: warning 注意
Activity A跳转到Activity B时，<strong>A执行完`onPause`之后，随后B再执行`onCreate` -> `onStart` -> `onResume`, 最后A执行`onStop`</strong>，因此`onPause`方法中不能做重量级的回收工作，否则会造成页面卡顿。
:::
::: warning 注意
`onSaveInstanceState`和`onRestoreInstanceState`会在Activity非正常情况下销毁并有机会重新展示的情况下进行调用，不是所有情况都会调用。
:::
::: warning 注意
`onSaveInstanceState`方法会在紧急情况下触发，如Activity被系统kill掉，又或者是关闭屏幕；
API 28之后该方法会在onStop之后调用，API28之前会在onStop之前调用，但不能保证是在onPause之前还是之后。
:::
::: warning 注意
`onRestoreInstanceState`方法不一定会被调用，如上面提到的关闭屏幕虽调用了`onSaveInstanceState`,却不调用`onRestoreInstanceState`;屏幕旋转时会发生两种方法均调用。该方法会在`onStart`之后`onPostCreate`之前调用。
:::
::: warning 注意
不仅仅Activity拥有`onSaveInstanceState`,`onRestoreInstanceState`,每个View也有这两个方法，用于保存View的状态。Activity意外终止时，会调用`onSaveInstanceState`方法保存状态，Activity又会委托Window去保存状态，Window又会委托它上面的顶级容器去保存状态。顶层容器是一个ViewGroup，通常是DecorView，最后顶层容器再逐一委托其子View去保存状态。
:::

::: danger 弹出Dialog时Activity会执行onPause吗？
不会
:::
::: danger 弹出PopupWindow时Activity会执行onPause吗？
不会
:::
::: danger 下拉状态栏会触发onPause吗？
不会
:::
::: danger 给Activity A弹出的Dialog中的View设置点击事件，通过点击跳转到Activity B，生命周期函数如何？
`onPause(A)` -> `onCreate(B)` -> `onStart(B)` -> `onResume(B)` -> `onStop(A)` -> `onSaveInstanceState(A)`

从B返回时：
`onPause(B)` -> `onRestart(A)` -> `onStart(A)` -> `onResume(A)` -> `onStop(B)` -> `onDestroy(B)`
:::

::: danger 突然来电话
`onPause` -> `onStop` -> `onSaveInstanceState`， 其中`onSaveInstanceState`的调用时机根据API不同而有所差异
:::

::: danger 从一个应用的Activity跳转另一个应用的Activity
`onPause` -> `onStop` -> `onSaveInstanceState`， 其中`onSaveInstanceState`的调用时机根据API不同而有所差异
:::

::: details 将Activity设置为透明主题
继承自Activity(不继承自AppCompatActivity)，在`AndroidManifest.xml`设置theme为`@android:style/Theme.Translucent`;
:::
