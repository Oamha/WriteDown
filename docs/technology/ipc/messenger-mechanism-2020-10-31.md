## Messenger
:::tip
Messenger基于Binder可以轻松的实现跨进程收发消息。
:::
### 1、简单使用
创建一个Service充当服务端，当然要设置其process属性，使其运行在单独的进程中。
```java
public class MessageService extends Service {
    public static final int MSG_FROM_CLIENT = 100;
    public static final int MSG_FROM_SERVICE = 101;
    private static final String TAG = "MessageService";

    private Messenger mMessenger = new Messenger(new MessageHandler());

    static class MessageHandler extends Handler {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case MSG_FROM_CLIENT:
                    //收到客户端的消息
                    Log.w(TAG, "msg from client " + msg.getData().getString("info"));

                    //准备给客户端回消息
                    Message message = Message.obtain();
                    message.what = MSG_FROM_SERVICE;
                    Bundle data = new Bundle();
                    data.putString("info", "I have received your message, call you back later");
                    message.setData(data);
                    
                    try {
                        //通过客户端传递过来的replyTo对象（还是一个Messenger）给客户端回消息
                        msg.replyTo.send(message);
                    } catch (RemoteException e) {
                        e.printStackTrace();
                    }
                    break;
            }
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        //返回binder对象
        return mMessenger.getBinder();
    }
}
```
### 2、创建客户端
```java
public class MessageActivity extends AppCompatActivity {

    private static final String TAG = "MessageActivity";

    //用于给服务端发消息的Messenger
    private Messenger mMessenger;

    //传递给服务端 用于服务端给客户端回消息的Messenger
    private Messenger mMessenger1 = new Messenger(new Handler {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case MessageService.MSG_FROM_SERVICE:
                    Log.w(TAG, "handleMessage: " + msg.getData().getString("info"));
                    break;
            }
        }
    });

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_message);
        bindService(new Intent(this, MessageService.class), new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                mMessenger = new Messenger(service);
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {

            }
        }, Context.BIND_AUTO_CREATE);
        Button btn = findViewById(R.id.btn);
        btn.setOnClickListener(v -> {
            try {
                Message message = Message.obtain();
                Bundle data = new Bundle();
                data.putString("info", "hello, i am client");
                message.setData(data);
                message.what = MessageService.MSG_FROM_CLIENT;
                //将客户端的Messenger传递给服务端
                message.replyTo = mMessenger1;
                mMessenger.send(message);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        });
    }
}
```
可以看出客户端和服务端是通过相互传递Messenger来实现通信的，从根本上说，是在相互传递binder。
服务端通过onBind方法返回`mMessenger.getBinder()`给客户端，它最终又调用`mTarget.asBinder()`, mTarget为一个类型为IMessenger的Binder，客户端通过replyTo将Messenger传递给服务端，而Messenger就是类型为IMessenger的Binder的包装类，Messenger发送消息都是通过IMessenger。

### 2、看一下Messenger的创建过程：

首先调用了handler的getIMessenger方法
```java
public Messenger(Handler target) {
    mTarget = target.getIMessenger();
}
```
如果不存在IMessenger，则去创建MessengerImpl对象
```java
final IMessenger getIMessenger() {
    synchronized (mQueue) {
        if (mMessenger != null) {
            return mMessenger;
        }
        mMessenger = new MessengerImpl();
        return mMessenger;
    }
}
```
MessengerImpl是Handler的内部类，它继承自IMessenger.Stub，显然是一个Binder
```java
private final class MessengerImpl extends IMessenger.Stub {
    public void send(Message msg) {
        msg.sendingUid = Binder.getCallingUid();
        Handler.this.sendMessage(msg);
    }
}
```
最终Messenger都是通过MessengerImpl类的send方法发送消息。