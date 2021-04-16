---
sidebar: 'auto'
---
## Android中的动画
### 1 帧动画
::: tip 特点
帧动画主要用于播放连续的图片，呈现出动画的效果，主要利用了AnimationDrawable类，实际项目很少使用。
:::
#### 1.1 定义要播放的图片列表
在`res/drawable`下创建帧动画的drawable，如`frame_anim.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="false">
    <item
        android:drawable="@drawable/a1"
        android:duration="200" />
    <item
        android:drawable="@drawable/a2"
        android:duration="200" />
    <item
        android:drawable="@drawable/a3"
        android:duration="200" />
    <item
        android:drawable="@drawable/a4"
        android:duration="200" />
</animation-list>
```
#### 1.2 获取控件并将帧动画设置为background
``` java
View view = findViewById(R.id.view);
AnimationDrawable drawable  = (AnimationDrawable) getResources().getDrawable(R.drawable.frame_anim);
view.setBackground(drawable);
drawable.start();
```
### 2 补间动画
::: tip 特点
为什么要叫补间动画？
补间动画指的是只确定首尾帧，中间过程由系统计算完成，省去了中间动画制作的复杂过程。
:::
补间动画主要有四种: AlphaAnimation、RotateAnimation、ScaleAnimation和TranslateAnimation;它们都继承自Animation;Animation的子类还有AnimationSet，它表示一组可执行的动画。
### 3 ViewPropertyAnimator动画
::: tip 特点
ViewPropertyAnimator语法简单，可以进行链式操作，适合于多个属性一起进行动画操作；
:::
简单使用
``` java
view.animate()
    .translationX(100)
    .scaleX(1.5f)
    .alpha(0.6f)
    .rotation(-180)
    .setDuration(3000).withEndAction(() -> {
        //动画结束所做的动作
    }).start();
```
### 4 转场动画
::: tip 特点
用于放在startActivity/finish之后，用于设置Activity切换的效果;
:::
java语句
``` java
activity.overridePendingTransition(R.anim.activity_enter_anim, R.anim.activity_exit_anim);
```
进入动画`activity_enter_anim.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_longAnimTime">
    <translate
        android:duration="2000"
        android:fromYDelta="100%"
        android:toYDelta="0"/>
</set>
```
退出动画`activity_exit_anim.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="@android:integer/config_longAnimTime">
    <scale
        android:duration="2000"
        android:fillAfter="true"
        android:fillBefore="false"
        android:fromXScale="1.0"
        android:fromYScale="1.0"
        android:pivotX="0%"
        android:pivotY="100%"
        android:repeatCount="1"
        android:toXScale="1.0"
        android:toYScale="0" />
</set>
```
::: warning
进入动画、退出动画同时设置可以看到黑色界面，只设置一个就可以了；
:::
### 5 布局动画
::: tip 特点
可以通过layoutAnimation属性给ListView或RecyclerView的子元素设置第一次布局时的动画;
:::
#### 5.1 布局中设置
布局文件中给ListView指定`layoutAnimation`
```xml{13}
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical"
    tools:context="com.hncj.animation.ViewAnimation">
    <ListView
        android:id="@+id/lv"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:entries="@array/arrays"
        android:layoutAnimation="@anim/layout_anim" />
</LinearLayout>
```
在`res/anim`下创建`layout_anim.xml`布局动画
```xml
<?xml version="1.0" encoding="utf-8"?>
<layoutAnimation xmlns:android="http://schemas.android.com/apk/res/android"
    android:animation="@anim/layout_animation"
    android:animationOrder="normal"
    android:delay="0.5"
    android:interpolator="@android:anim/accelerate_interpolator" />
```
在`res/anim`下创建`layout_animation.xml`动画描述文件
```xml
<?xml version="1.0" encoding="utf-8"?>
<set xmlns:android="http://schemas.android.com/apk/res/android">
    <translate
        android:duration="3000"
        android:fromXDelta="500"
        android:toXDelta="0" />
</set>
```
#### 5.2 代码中设置
```java{2}
//这里直接加载的是动画描述文件，不是layoutAnimation文件
Animation animation = AnimationUtils.loadAnimation(this, R.anim.layout_animation);
LayoutAnimationController controller = new LayoutAnimationController(animation);
controller.setInterpolator(new AccelerateInterpolator());
controller.setDelay(0.5f);
ListView listView = findViewById(R.id.lv);
listView.setLayoutAnimation(controller);
listView.startAnimation(animation);
```
### 6 触控动画
::: tip 特点
可以对列表、按钮等设置触控动画改善用户体验;
:::
```xml{3,11}
<!-- 无边界 -->
<LinearLayout
    android:background="?android:attr/selectableItemBackgroundBorderless"
    android:layout_width="match_parent"
    android:layout_height="200dp"
    android:clickable="true"
    android:focusable="true" />

<!-- 有边界 -->
<LinearLayout
    android:background="?android:attr/selectableItemBackground"
    android:layout_width="match_parent"
    android:layout_height="200dp"
    android:clickable="true"
    android:focusable="true"/>
```
### 7 属性动画
::: tip 特点
属性动画继承自Animator抽象类，常用的有ValueAnimator、ObjectAnimator和AnimatorSet;支持的属性有scaleX,ScaleY,translationX,translationY,alpha,rotation,rotationX,rotationY;
:::
常见用法
```java
ObjectAnimator animator = ObjectAnimator.ofFloat(findViewById(R.id.iv), "rotation", 0, 180f);
animator.setDuration(3000);
animator.setRepeatCount(1);
animator.setRepeatMode(ValueAnimator.RESTART);
animator.addListener(new AnimatorListenerAdapter() {
@Override
public void onAnimationEnd(Animator animation) {
    super.onAnimationEnd(animation);
}
});
animator.start();
```