### JNI线程操作
### 1、创建线程
#### 1.1、引入头文件
```c
#include <pthread.h>
```
#### 1.2、创建线程任务
这里声明了一个函数，作为线程创建后要执行的任务
```c
void *threadMethod(void *) {
    LOGE("thread execute....");
    //线程执行结束调用pthread_exit方法或者return一个值，否则会崩溃
    pthread_exit(0); //return nullptr;
}
```
#### 1.3、创建线程
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_createThreadMethod1(JNIEnv *env, jobject thiz) {
    pthread_t handle;
    //传递刚刚创建的函数作为线程任务
    pthread_create(&handle, nullptr, threadMethod, nullptr);
}
```
### 2、传递参数
pthread_create方法的第四个参数允许我们在创建线程时给线程传递参数
#### 2.1、构建参数
这里我们用一个结构体表示参数
```c
struct Param {
    int id;
    int result;
};
```
#### 2.2、传递参数
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_createThreadMethod2(JNIEnv *env, jobject thiz) {
    pthread_t handle;
    Param *p = new Param;
    p->id = 10;
    p->result = 100;
    //传递p
    pthread_create(&handle, nullptr, threadMethod2, p);
}
```
#### 2.3、获取参数
```c
void *threadMethod2(void *args) {
    //对参数进行类型转换
    Param *p = static_cast<Param *>(args);
    //打印参数信息
    LOGE("the id is %d", p->id);
    LOGE("the result is %d", p->result);
    return nullptr;
}
```
### 3、等待线程执行结束
pthread_join方法会阻塞创建线程的线程，等待创建的线程执行完成才继续执行
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_createThreadMethod3(JNIEnv *env, jobject thiz) {
    pthread_t handle;
    int create_result = pthread_create(&handle, nullptr, threadMethod3, nullptr);
    if (create_result == 0) {
        LOGE("create success");
        //ret表示线程执行结束之后的返回值
        void *ret = nullptr;
        pthread_join(handle, &ret);
        Param *p = static_cast<Param *>(ret);
        LOGE("result is %d", p->result);
        LOGE("result is %d", p->id);
    } else {
        LOGE("create failed");
    }
}
```
在线程任务里我们模拟一下耗时操作
```c
void *threadMethod3(void *) {
    timeval start, end;
    gettimeofday(&start, nullptr);
    sleep(3);
    gettimeofday(&end, nullptr);
    LOGE("the time waste is %d", (end.tv_sec - start.tv_sec));
    //线程执行结束，返回一个Param结构体作为执行结果
    Param *p = new Param;
    p->result = 102;
    p->id = 100;
    return p;
}
```
::: warning
时间操作要引入unistd.h头文件
:::
### 4、线程同步
```java
public class ThreadActivity extends AppCompatActivity {

    static {
        System.loadLibrary("native-lib");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_thread);
        findViewById(R.id.btn1).setOnClickListener(v -> {
            createWaitThread();
        });
        findViewById(R.id.btn2).setOnClickListener(v -> {
            createNotifyThread();
        });
    }
    //创建一个线程，让其处于阻塞状态
    public native void createWaitThread();

    //创建一个线程，用于唤醒上面阻塞的线程
    public native void createNotifyThread();
}
```
```c
#include <base.h>
#include <pthread.h>
#include <unistd.h>

pthread_mutex_t mutex;
pthread_cond_t condition;
int flag = 0;

void *waitThreadMethod(void *) {
    pthread_mutex_lock(&mutex);
    //条件不满足一直等待
    while (flag == 0) {
        LOGE("waiting");
        pthread_cond_wait(&condition, &mutex);
    }
    LOGE("execute....");
    pthread_mutex_unlock(&mutex);
    return nullptr;
}

void *notifyThreadMethod(void *) {
    pthread_mutex_lock(&mutex);
    //改变条件，唤醒等待线程
    flag = 1;
    pthread_cond_signal(&condition);
    LOGE("signal...");
    sleep(3);
    pthread_mutex_unlock(&mutex);
    return nullptr;
}

extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThreadActivity_createWaitThread(JNIEnv *env, jobject thiz) {
    //初始化信号量
    pthread_mutex_init(&mutex, nullptr);
    //初始化等待条件变量
    pthread_cond_init(&condition, nullptr);
    //创建等待线程
    pthread_t waitThread;
    pthread_create(&waitThread, nullptr, waitThreadMethod, nullptr);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThreadActivity_createNotifyThread(JNIEnv *env, jobject thiz) {
    //创建唤醒线程
    pthread_t notifyThread;
    pthread_create(&notifyThread, nullptr, notifyThreadMethod, nullptr);
}
```
### 5、生产者消费者模式
```c
pthread_cond_t emptyCondition, fullCondition;
pthread_mutex_t signX;
queue<int> que;

void *produce(void *) {
    while (true) {
        pthread_mutex_lock(&signX);
        while (que.size() == 10) {
            LOGE("队列满，等待消费者消费");
            pthread_cond_wait(&fullCondition, &signX);
        }
        que.push(1);
        LOGE("生产者生产了一个");
        pthread_cond_signal(&emptyCondition);
        pthread_mutex_unlock(&signX);
    }
    return nullptr;
}

void *consume(void *) {
    while (true) {
        pthread_mutex_lock(&signX);
        while (que.empty()) {
            LOGE("队列空，等待生产者生成");
            pthread_cond_wait(&emptyCondition, &signX);
        }
        que.pop();
        LOGE("消费者消费了一个");
        pthread_cond_signal(&fullCondition);
        pthread_mutex_unlock(&signX);
    }
    return nullptr;
}

extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThreadActivity_productConsumerPattern(JNIEnv *env, jobject thiz) {
    pthread_mutex_init(&signX, nullptr);
    pthread_cond_init(&emptyCondition, nullptr);
    pthread_cond_init(&fullCondition, nullptr);
    pthread_t producerThread, consumerThread;
    pthread_create(&producerThread, nullptr, produce, nullptr);
    pthread_create(&consumerThread, nullptr, consume, nullptr);
}
```