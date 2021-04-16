### JNI异常处理
### 1、程序崩溃
调用本地方法`callNative`，JNI回调Java方法`javaException`
```java
public native void callNative();

public void javaException() {
    int a = 2 / 0;
}
```
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ExceptionActivity_callNative(JNIEnv *env, jobject thiz) {
    jclass jclz = env->GetObjectClass(thiz);
    jmethodID jMid = env->GetMethodID(jclz, "javaException", "()V");
    env->CallVoidMethod(thiz, jMid);
}
```
这时程序会发生崩溃。
为了不发生上述直接崩溃的问题，可以进行异常清除
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ExceptionActivity_callNative(JNIEnv *env, jobject thiz) {
    jclass jclz = env->GetObjectClass(thiz);
    jmethodID jMid = env->GetMethodID(jclz, "javaException", "()V");
    env->CallVoidMethod(thiz, jMid);
    if (env->ExceptionCheck()) {
        //打印异常信息
        env->ExceptionDescribe();
        //清除异常
        env->ExceptionClear();
    }
}
```
也可以在JNI层抛出异常，这时程序仍然会崩溃
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ExceptionActivity_callNative(JNIEnv *env, jobject thiz) {
    jclass jclz = env->GetObjectClass(thiz);
    jmethodID jMid = env->GetMethodID(jclz, "javaException", "()V");
    env->CallVoidMethod(thiz, jMid);
    jthrowable throwable = env->ExceptionOccurred();
    env->Throw(throwable);
}
```
### 2、向Java层抛出异常
native方法声明
```java
public native void nativeThrowException() throws RuntimeException;
```
在jni层向java层抛出一个运行时异常
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ExceptionActivity_nativeThrowException(JNIEnv *env, jobject thiz) {
    jclass jExceptionClz = env->FindClass("java/lang/RuntimeException");
    env->ThrowNew(jExceptionClz, "runtime exception");
}
```
这时在java层进行捕获，便可以打印异常信息
```java
findViewById(R.id.btn).setOnClickListener(v -> {
    try{
        nativeThrowException();
    }catch (Exception e){
        Log.e("tag", e.getMessage());
    }
});
```