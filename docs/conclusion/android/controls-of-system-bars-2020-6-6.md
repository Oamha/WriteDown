---
sidebar: 'auto'
---
## 系统栏的控制
::: tip 前言
 The system bars are screen areas dedicated to the display of notifications, communication of device status, and device navigation. Typically the system bars (which consist of the status and navigation bars) are displayed concurrently with your app. Apps that display immersive content, such as movies or images, can temporarily dim the system bar icons for a less distracting experience, or temporarily hide the bars for a fully immersive experience.

If you're familiar with the Android Design Guide, you know the importance of designing your apps to conform to standard Android UI guidelines and usage patterns. You should carefully consider your users' needs and expectations before modifying the system bars, since they give users a standard way of navigating a device and viewing its status.
:::
<p>
系统栏主要包括顶部状态栏（用于展示通知，设备状态）和底部导航栏（用于设备中导航）。有时需要控制系统栏的显示与隐藏，达到沉浸式效果，改善用户体验。
</p>

### 1、调暗系统栏
官网说下面代码在 Android 4.0（API 级别 14）及更高版本中调暗系统栏（即状态和导航栏）。在更早期的版本中，Android 不提供调暗系统栏的内置方式。使用此方法时，内容大小不会调整，但系统栏中的图标会消失。用户只要轻触屏幕的状态栏或导航栏区域，这两个栏就会全面显示出来。
```java
    View decorView = getActivity().getWindow().getDecorView();
    int uiOptions = View.SYSTEM_UI_FLAG_LOW_PROFILE;
    decorView.setSystemUiVisibility(uiOptions);
```
清除的话，可以使用下面代码：
```java
    decorView.setSystemUiVisibility(0);
```
试了一下，好像没起什么作用

### 2、隐藏状态栏
```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
    View decorView = getWindow().getDecorView();
    int uiOption = View.SYSTEM_UI_FLAG_FULLSCREEN;
    decorView.setSystemUiVisibility(uiOption);
} else {
    getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
}
```

### 3、实现内容占全屏，状态栏覆盖在内容之上
```java
/*第一种*/
  getWindow().addFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
/*第二种*/
  View view = getWindow().getDecorView();
  view.setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
  getWindow().setStatusBarColor(Color.TRANSPARENT);
```

### 4、实现打游戏、看电影时的沉浸式模式
```java
 @Override
public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
        View decorView = getWindow().getDecorView();
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        decorView.setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
    }
}
```