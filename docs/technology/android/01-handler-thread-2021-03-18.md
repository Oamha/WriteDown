## HandlerThread
::: tip 概念
HandlerThread本质上还是一个线程，不过它封装了Looper，在线程运行时调用Looper.loop()开启消息循环，不断地从消息队列中取出消息并在子线程执行。同时它还暴露了getLooper方法，我们通过这个getLooper方法就能够获取Looper，从而创建Handler的时候就能够指定Looper，保证消息发送到指定的消息队列。
::: 
### 1、用法
```java
HandlerThread handlerThread = new HandlerThread("handler-thread");
handlerThread.start();
Handler handler = new Handler(handlerThread.getLooper()) {
    @Override
    public void handleMessage(@NonNull Message msg) {
        //do something in background
    }
};
handler.post(() -> {
    //submit task... 
});
```
### 2、源码
```java
public class HandlerThread extends Thread {
    int mPriority;
    int mTid = -1;
    Looper mLooper;
    private @Nullable Handler mHandler;

    public HandlerThread(String name) {
        super(name);
        mPriority = Process.THREAD_PRIORITY_DEFAULT;
    }
    
    public HandlerThread(String name, int priority) {
        super(name);
        mPriority = priority;
    }
    
    protected void onLooperPrepared() {
    }

    @Override
    public void run() {
        mTid = Process.myTid();
        //线程运行时创建Looper
        Looper.prepare();
        synchronized (this) {
            mLooper = Looper.myLooper();
            notifyAll();
        }
        Process.setThreadPriority(mPriority);
        onLooperPrepared();
        //开启消息循环，不断处理其它线程发送过来的任务
        Looper.loop();
        mTid = -1;
    }
    
    public Looper getLooper() {
        if (!isAlive()) {
            return null;
        }
        //如果Looper还没创建完成就获取Looper，这里会进行阻塞
        synchronized (this) {
            while (isAlive() && mLooper == null) {
                try {
                    wait();
                } catch (InterruptedException e) {
                }
            }
        }
        return mLooper;
    }

    @NonNull
    public Handler getThreadHandler() {
        if (mHandler == null) {
            mHandler = new Handler(getLooper());
        }
        return mHandler;
    }

    //任务执行完成，退出消息循环
    public boolean quit() {
        Looper looper = getLooper();
        if (looper != null) {
            looper.quit();
            return true;
        }
        return false;
    }

    //任务执行完成，退出消息循环
    public boolean quitSafely() {
        Looper looper = getLooper();
        if (looper != null) {
            looper.quitSafely();
            return true;
        }
        return false;
    }

    public int getThreadId() {
        return mTid;
    }
}
```
### 3、总结
HandlerThread主要方便了我们创建子线程并向其提交任务这一过程。