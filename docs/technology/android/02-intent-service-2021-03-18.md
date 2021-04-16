## IntentService
::: tip 概念
通常的，Service执行任务还是在主线程中，如果执行耗时任务，仍然会触发ANR异常。但IntentService继承自Service，它在onCreate生命周期中创建了一个HandlerThread(一个线程)，用于执行后期的任务，执行完任务之后，IntentService会自行销毁。
:::
### 1、用法
+ 继承自IntentService，重写onHandleIntent方法
```java
public class BackgroundIntentService extends IntentService {
    public BackgroundIntentService(String name) {
        super(name);
    }

    public BackgroundIntentService() {
        this("worker thread");  //给后台线程一个名字，便于调试
    }

    //该方法将在子线程中执行，可以做一些耗时任务
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        //do some time-consuming tasks
    }
}
```
+ 启动IntentService
```java
startService(new Intent(context, BackgroundIntentService.class));
```
### 2、源码
```java
public abstract class IntentService extends Service {
    private volatile Looper mServiceLooper;
    @UnsupportedAppUsage
    private volatile ServiceHandler mServiceHandler;
    private String mName;
    private boolean mRedelivery;

    private final class ServiceHandler extends Handler {
        public ServiceHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            onHandleIntent((Intent)msg.obj);
            stopSelf(msg.arg1);
        }
    }

    public IntentService(String name) {
        super();
        mName = name;
    }

    public void setIntentRedelivery(boolean enabled) {
        mRedelivery = enabled;
    }

    @Override
    public void onCreate() {

        super.onCreate();
        //创建子线程
        HandlerThread thread = new HandlerThread("IntentService[" + mName + "]");
        //开启消息循环
        thread.start();

        mServiceLooper = thread.getLooper();
        mServiceHandler = new ServiceHandler(mServiceLooper);
    }

    @Override
    public void onStart(@Nullable Intent intent, int startId) {
        //IntentService启动后发送消息，在Handler的handleMessage方法中进行处理，调用onHandleIntent方法，
        Message msg = mServiceHandler.obtainMessage();
        msg.arg1 = startId;
        msg.obj = intent;
        mServiceHandler.sendMessage(msg);
    }

    @Override
    public int onStartCommand(@Nullable Intent intent, int flags, int startId) {
        onStart(intent, startId);
        return mRedelivery ? START_REDELIVER_INTENT : START_NOT_STICKY;
    }

    @Override
    public void onDestroy() {
        mServiceLooper.quit();
    }
    
    @Override
    @Nullable
    public IBinder onBind(Intent intent) {
        return null;
    }

    @WorkerThread
    protected abstract void onHandleIntent(@Nullable Intent intent);
}

```