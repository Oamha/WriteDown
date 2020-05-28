---
sidebar: 'auto'
---
## 1、基本概念
::: tip 手机尺寸
手机尺寸指的是手机屏幕对角线的尺寸，通常用英寸作为单位，1英寸(inch)等于2.54厘米。
:::

::: tip 分辨率
分辨率就是屏幕图像的精密度，指的是显示器能显示像素的多少，显示器可显示的像素越多，<br/>
画面就越精细，同样，屏幕区域内能显示的信息也越多。
:::

::: tip dpi像素密度(Dots per inch)
像素密度，即每英寸屏幕所拥有的像素数，像素密度越大，显示画面细节就越丰富。<br/>
计算公式：(√(长度像素数^2+宽度像素数^2))/屏幕尺寸
:::

::: tip 屏幕密度
屏幕密度将像素密度划分为几个等级：一般情况下的普通屏幕：ldpi是120dpi，mdpi是160dpi，hdpi是240dpi，xhdpi是320dpi ，xxhdpi 是480dpi。android以像素密度160dpi为基准对屏幕进行划分，当像素密度为160dpi时屏幕密度为1.0，像素密度为120dpi时屏幕密度为0.75，像素密度为320dpi时屏幕密度为2.0.
:::

## 2、Android中常见的单位
|单位|特点|
|:---|:---|
|px|像素，代表物理上的一个像素点|
|dp|又称dip，在每英寸160点的显示屏上，1dp = 1px，即px = dp(dpi / 160)，即px=dp*density|
|sp|与dp很类似，通常用于指定字体的大小，当用户修改手机显示的字体时，字体大小会随之改变|

## 3、Android中的屏幕相关的各种取值
```java
DisplayMetrics displayMetrics = this.getResources().getDisplayMetrics();
Log.d(TAG, "屏幕宽度: " + displayMetrics.widthPixels);
Log.d(TAG, "屏幕高度: " + displayMetrics.heightPixels);
Log.d(TAG, "屏幕密度: " + displayMetrics.density);
Log.d(TAG, "像素密度: " + displayMetrics.densityDpi);
Log.d(TAG, "水平方向像素密度: " + displayMetrics.xdpi);
Log.d(TAG, "垂直方向像素密度: " + displayMetrics.ydpi);

屏幕宽度: 1080
屏幕高度: 2232
屏幕密度: 3.0
像素密度: 480
水平方向像素密度: 409.432
垂直方向像素密度: 412.75
```
## 4、常用的工具类
```java
public class SizeUtil {

    //系统提供的转换方式
    public static float dp2pxVal(Context context, float dpVal) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dpVal, context.getResources().getDisplayMetrics());
    }

    public static float sp2pxVal(Context context, float pxVal) {
        return TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, pxVal, context.getResources().getDisplayMetrics());
    }

    /**
     * dp转为px
     * @param context
     * @param dpVal
     * @return
     */
    public static int dp2px(Context context, float dpVal) {
        float density = context.getResources().getDisplayMetrics().density;
        return (int) (dpVal * density + 0.5);
    }

    /**
     * px转为dp
     * @param context
     * @param pxVal
     * @return
     */
    public static int px2dp(Context context, float pxVal) {
        float density = context.getResources().getDisplayMetrics().density;
        return (int) (pxVal / density + 0.5);
    }

    /**
     * sp转为px
     * @param context
     * @param spVal
     * @return
     */
    public static int sp2px(Context context, float spVal) {
        float scaledDensity = context.getResources().getDisplayMetrics().scaledDensity;
        return (int) (spVal * scaledDensity + 0.5);
    }

    /**
     * px转换为sp
     * @param context
     * @param pxVal
     * @return
     */
    public static int px2sp(Context context, float pxVal) {
        float scaledDensity = context.getResources().getDisplayMetrics().scaledDensity;
        return (int) (pxVal / scaledDensity + 0.5);
    }

    /**
     * 获取屏幕宽度
     * @param context
     * @return
     */
    public static float getScreenWidth(Context context){
        return context.getResources().getDisplayMetrics().widthPixels;
    }

    /**
     * 获取屏幕长度
     * @param context
     * @return
     */
    public static float getScreenHeight(Context context){
        return context.getResources().getDisplayMetrics().heightPixels;
    }


}
```
::: warning
这里进行单位转换时都加了0.5，目的是为了进行四舍五入取整。
:::
