### JNI静态注册和动态注册
### 1、静态注册
#### 1.1 原理：根据函数名来建立 java 方法与 JNI 函数的一一对应关系；
Java类中声明native方法
```java
public native String stringFromJNI();
```
在cpp文件中进行实现
```java
//jni方法命名规制为Java_包名_类名_方法名
//前两个参数为JNIENV和jobject
extern "C" JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk_MainActivity_stringFromJNI(JNIEnv *env, jobject jobj) {
    std::string hello = "Hello from C++";
    return env->NewStringUTF(hello.c_str());
}
```
::: warning
extern "C"的主要作用就是为了能够正确实现C++代码调用其他C语言代码。加上extern "C"后，会指示编译器这部分代码按C语言（而不是C++）的方式进行编译。由于C++支持函数重载，因此编译器编译函数的过程中会将函数的参数类型也加到编译后的代码中，而不仅仅是函数名；而C语言并不支持函数重载，因此编译C语言代码的函数时不会带上函数的参数类型，一般只包括函数名。
:::
#### 1.2 优缺点
+ 方法名字太长，书写不方便（不过现在AS能够自动生成，所以这条可以忽略）；
+ 程序运行效率低，因为初次调用native函数时需要根据函数名在JNI层中搜索对应的本地函数，然后建立对应关系，这个过程比较耗时；
### 2、动态注册
#### 1.1 原理：利用`RegisterNatives`方法来注册java方法与JNI函数的一一对应关系；
声明native方法
```java
    public native int sum(int a, int b);

    public native String getJNIString();
```
在cpp中进行实现
```c
//getJNIString方法的本地实现
jstring getMessage(JNIEnv *env, jobject jobj) {
    return env->NewStringUTF("string from dynamic-loaded method");
}
//sum方法的本地实现
jint plus(JNIEnv *env, jobject jobj, int a, int b) {
    return a + b;
}
```
在`JNI_OnLoad`回调中进行动态注册，`JNI_Onload`方法会在动态库被加载时回调
```c
int registerNatives(JNIEnv *env, const char *name, const JNINativeMethod *methods,
                    jint nMethods) {
    jclass jclazz = env->FindClass("com/zzkj/ndk1/MainActivity");
    if (jclazz == nullptr) {
        return JNI_FALSE;
    }
    env->RegisterNatives(jclazz, methods, nMethods);
    return JNI_OK;
}

//加载动态库时会回调JNI_OnLoad方法
JNIEXPORT jint JNI_OnLoad(JavaVM *vm, void *reserved) {
    LOGE("JNI_ONLOAD");
    JNIEnv *env;
    if (vm->GetEnv(reinterpret_cast<void **>(&env), JNI_VERSION_1_6) != JNI_OK) {
        return JNI_FALSE;
    }
    //native方法和jni方法一一对应
    JNINativeMethod methods[] = {
            {"sum",          "(II)I",                (void *) plus},
            {"getJNIString", "()Ljava/lang/String;", (void *) getMessage},
    };
    const char *javaCalss = "com/zzkj/ndk1/MainActivity";
    //调用registerNatives进行注册
    registerNatives(env, javaCalss, methods, 2);
    return JNI_VERSION_1_6;
}

```
#### 1.2 优缺点
+ 流程更加清晰可控；
+ 效率更高；