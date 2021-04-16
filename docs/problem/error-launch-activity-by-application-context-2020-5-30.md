## 1 使用非Activity类型的Context启动Activity发生异常
### 1.1 前提
::: tip 前提
通常启动Activity会调用`startActivity`方法，它是`Context`类的方法，这一点是需要明确的。
:::

### 1.2 Context的常用子类有Application、Service、Activity
<Common-Thumb :prefix="'/img/problem/android'" :width="600" :urls="'hierarchy-of-context.jpg'"/>

### 1.3 异常复现
使用Application的Context去启动Activity
```java
findViewById(R.id.first_activity).setOnClickListener(v -> {
    Intent intent = new Intent(this, SecondActivity.class);
    getApplicationContext().startActivity(intent);
});
```
错误信息
```
Calling startActivity() from outside of an Activity  context requires the FLAG_ACTIVITY_NEW_TASK flag. Is this really what you want?
```
分析了一下原因：每次启动Activity，新创建的Activity都会被丢进原来Activity所处的任务栈中（如果不指定taskAffinity的话），而拿着Application的Context，Application没有任务栈，所以报了这个错。提示信息也说出了解决方案，即设置一个flag来新建一个任务栈。
```java
intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
```