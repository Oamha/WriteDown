## Binder
:::tip 什么是Binder？
Binder从表面看其实就是一个类，它实现了IBinder接口。但从IPC角度来看，它能够实现跨进程通信，在进行进程之间的通信时，我们可以拿到一个Binder对象，通过它对服务端进行业务调用，便可实现数据的传递。
:::

:::tip 什么是AIDL？
AIDL是快速实现Binder的一种方式，避免每次实现Binder都要写重复的代码，可以把它当做一种工具；
:::

### 1、实现Binder的简单例子
### 1.1 新建Book实体类
它实现了Parcelable接口，用于在进程之间传递
```java
package com.zzkj.ipc;
public class Book implements Parcelable {
    private String name;
    private int id;
    private String author;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Book(String name, int id, String author) {
        this.name = name;
        this.id = id;
        this.author = author;
    }

    protected Book(Parcel in) {
        name = in.readString();
        id = in.readInt();
        author = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeInt(id);
        dest.writeString(author);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Book> CREATOR = new Creator<Book>() {
        @Override
        public Book createFromParcel(Parcel in) {
            return new Book(in);
        }

        @Override
        public Book[] newArray(int size) {
            return new Book[size];
        }
    };
}
```
### 1.2 新建Book.aidl
Book.aidl是Book.java在aidl中的声明,它和Book实体类一一对应，包名也相同
```java
package com.zzkj.ipc;
parcelable Book;
```
### 1.3 新建IBookManager.aidl业务接口
这里虽然Book.aidl和IBookManager.aidl在同一包下，但想要使用Book.aidl，还是要进行引入
```java {2}
package com.zzkj.ipc;
import com.zzkj.ipc.Book;
interface IBookManager {
    List<Book> findBooks();

    void addBook(in Book book);
}
```
### 1.4 make一下Project
```java{6,20,90}
package com.zzkj.ipc;
public interface IBookManager extends android.os.IInterface
{
  /** Default implementation for IBookManager. */
  public static class Default implements com.zzkj.ipc.IBookManager
  {
    @Override public java.util.List<com.zzkj.ipc.Book> findBooks() throws android.os.RemoteException
    {
      return null;
    }
    @Override public void addBook(com.zzkj.ipc.Book book) throws android.os.RemoteException
    {
    }
    @Override
    public android.os.IBinder asBinder() {
      return null;
    }
  }
  /** Local-side IPC implementation stub class. */
  public static abstract class Stub extends android.os.Binder implements com.zzkj.ipc.IBookManager
  {
    private static final java.lang.String DESCRIPTOR = "com.zzkj.ipc.IBookManager";
    /** Construct the stub at attach it to the interface. */
    public Stub()
    {
      this.attachInterface(this, DESCRIPTOR);
    }
    /**
     * Cast an IBinder object into an com.zzkj.ipc.IBookManager interface,
     * generating a proxy if needed.
     */
     //在bindService成功之后利用它可以拿到服务端的binder对象
    public static com.zzkj.ipc.IBookManager asInterface(android.os.IBinder obj)
    {
      if ((obj==null)) {
        return null;
      }
      android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
      //如果客户端和服务端在同一进程，返回Stub对象本身
      if (((iin!=null)&&(iin instanceof com.zzkj.ipc.IBookManager))) {
        return ((com.zzkj.ipc.IBookManager)iin);
      }
      //如果客户端和服务端不在同一进程，返回Stub的代理类Proxy的对象
      return new com.zzkj.ipc.IBookManager.Stub.Proxy(obj);
    }
    //返回binder对象
    @Override public android.os.IBinder asBinder()
    {
      return this;
    }
    //此方法运行于Binder的线程池内
    @Override public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException
    {
      java.lang.String descriptor = DESCRIPTOR;
      switch (code)
      {
        case INTERFACE_TRANSACTION:
        {
          reply.writeString(descriptor);
          return true;
        }
        case TRANSACTION_findBooks:
        {
          data.enforceInterface(descriptor);
          java.util.List<com.zzkj.ipc.Book> _result = this.findBooks();
          reply.writeNoException();
          reply.writeTypedList(_result);
          return true;
        }
        case TRANSACTION_addBook:
        {
          data.enforceInterface(descriptor);
          com.zzkj.ipc.Book _arg0;
          if ((0!=data.readInt())) {
            _arg0 = com.zzkj.ipc.Book.CREATOR.createFromParcel(data);
          }
          else {
            _arg0 = null;
          }
          this.addBook(_arg0);
          reply.writeNoException();
          return true;
        }
        default:
        {
          return super.onTransact(code, data, reply, flags);
        }
      }
    }
    private static class Proxy implements com.zzkj.ipc.IBookManager
    {
      private android.os.IBinder mRemote;
      Proxy(android.os.IBinder remote)
      {
        mRemote = remote;
      }
      @Override public android.os.IBinder asBinder()
      {
        return mRemote;
      }
      public java.lang.String getInterfaceDescriptor()
      {
        return DESCRIPTOR;
      }
      //此方法只有客户端和服务端不在同一进程时才会调用
      @Override public java.util.List<com.zzkj.ipc.Book> findBooks() throws android.os.RemoteException
      {
        //创建输入型对象，用于封装参数信息
        android.os.Parcel _data = android.os.Parcel.obtain();
        //创建输出型对象，用于返回执行结果
        android.os.Parcel _reply = android.os.Parcel.obtain();
        java.util.List<com.zzkj.ipc.Book> _result;
        try {
          _data.writeInterfaceToken(DESCRIPTOR);
          //发起RPC调用，稍后onTransact会被执行
          boolean _status = mRemote.transact(Stub.TRANSACTION_findBooks, _data, _reply, 0);
          if (!_status && getDefaultImpl() != null) {
            return getDefaultImpl().findBooks();
          }
          _reply.readException();
          _result = _reply.createTypedArrayList(com.zzkj.ipc.Book.CREATOR);
        }
        finally {
          _reply.recycle();
          _data.recycle();
        }
        return _result;
      }

      //此方法只有客户端和服务端不在同一进程时才会调用
      @Override public void addBook(com.zzkj.ipc.Book book) throws android.os.RemoteException
      {
        //创建输入型对象，用于封装参数信息
        android.os.Parcel _data = android.os.Parcel.obtain();
        //创建输出型对象，用于返回执行结果
        android.os.Parcel _reply = android.os.Parcel.obtain();
        try {
          _data.writeInterfaceToken(DESCRIPTOR);
          if ((book!=null)) {
            _data.writeInt(1);
            book.writeToParcel(_data, 0);
          }
          else {
            _data.writeInt(0);
          }
          //发起RPC调用，稍后onTransact会被执行
          boolean _status = mRemote.transact(Stub.TRANSACTION_addBook, _data, _reply, 0);
          if (!_status && getDefaultImpl() != null) {
            getDefaultImpl().addBook(book);
            return;
          }
          _reply.readException();
        }
        finally {
          _reply.recycle();
          _data.recycle();
        }
      }
      public static com.zzkj.ipc.IBookManager sDefaultImpl;
    }

    //为我们的方法生成了唯一的标识，服务端用此标识判断客户端要调用的方法
    static final int TRANSACTION_findBooks = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);
    static final int TRANSACTION_addBook = (android.os.IBinder.FIRST_CALL_TRANSACTION + 1);

    public static boolean setDefaultImpl(com.zzkj.ipc.IBookManager impl) {
      if (Stub.Proxy.sDefaultImpl == null && impl != null) {
        Stub.Proxy.sDefaultImpl = impl;
        return true;
      }
      return false;
    }
    public static com.zzkj.ipc.IBookManager getDefaultImpl() {
      return Stub.Proxy.sDefaultImpl;
    }
  }
  public java.util.List<com.zzkj.ipc.Book> findBooks() throws android.os.RemoteException;
  public void addBook(com.zzkj.ipc.Book book) throws android.os.RemoteException;
}
```
### 1.5 创建Service
```java
public class RemoteService extends Service {
    private static final String TAG = "RemoteService";

    private IBookManager.Stub mProxy = new IBookManager.Stub() {
        @Override
        public List<Book> findBooks() throws RemoteException {
            List<Book> books = new ArrayList<>();
            books.add(new Book("book1", 1, "author1"));
            books.add(new Book("book2", 2, "author2"));
            books.add(new Book("book3", 3, "author3"));
            Log.w(TAG, "findBooks: " + Thread.currentThread().getName());
            return books;
        }

        @Override
        public void addBook(Book book) throws RemoteException {
            Log.w(TAG, "addBook: " + Thread.currentThread().getName());
        }
    };

    @Override
    public IBinder onBind(Intent intent) {
        Log.w(TAG, "onBind: ");
        return mProxy.asBinder();
    }
}
```
注意这里要将RemoteService运行在另外一个进程上
```java
<service
    android:name=".RemoteService"
    android:enabled="true"
    android:exported="true"
    android:process=":remote" />
```
然后你会发现findBooks和addBook方法打印的都是binder线程池中的线程。
注意，客户端发起RPC调用后会一直等待执行结果，所以耗时任务不能放在主线程执行。
### 1.6 绑定服务
```java
public class MainActivity extends AppCompatActivity {

    private IBookManager mManager;
    private static final String TAG = "MainActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Button btn = findViewById(R.id.btn);

        btn.setOnClickListener(v -> bindService(new Intent(this, RemoteService.class), new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName name, IBinder service) {
                //当客户端和服务端在同一进程中，mManager是IBookManager.Stub的实例
                //当客户端和服务端不在同一进程，mManager是IBookManager.Stub.Proxy的实例
                mManager = IBookManager.Stub.asInterface(service);
            }

            @Override
            public void onServiceDisconnected(ComponentName name) {

            }
        }, Context.BIND_AUTO_CREATE));
        Button btn1 = findViewById(R.id.btn1);
        btn1.setOnClickListener(v -> {
            try {
                List<Book> books = mManager.findBooks();
                Log.w(TAG, "onCreate: " + books);
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        });
        Button btn2 = findViewById(R.id.btn2);
        btn2.setOnClickListener(v -> {
            try {
                mManager.addBook(new Book("boo6", 6, "author6"));
            } catch (RemoteException e) {
                e.printStackTrace();
            }
        });
    }
}
```
