### JNI引用类型管理
JNI中分为三种引用，局部引用，全局引用和弱引用。
### 1、局部引用
```c {4}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ReferenceActivity_getLocalRefString(JNIEnv *env, jobject jobj) {
    jclass jStringClz = env->FindClass("java/lang/String");
    jmethodID jmid = env->GetMethodID(jStringClz, "<init>", "(Ljava/lang/String;)V");
    jstring jStr = static_cast<jstring>(env->NewObject(jStringClz, jmid,
                                                       env->NewStringUTF("hello world")));
    return jStr;
}
```
这里的`jStringClz`就是一个局部引用，它会在方法执行完之后自动释放。
### 2、全局引用
```c {5,9,11}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ReferenceActivity_getGlobalReferString(JNIEnv *env, jobject thiz) {
    //将jStringClz声明为static，让其指向一个全局引用，对第一次查找结果进行缓存，再次执行时不用再进行查找
    static jclass jStringClz = nullptr;
    if (jStringClz == nullptr) {
        jclass jclz = env->FindClass("java/lang/String");
        //这里不能用NewLocalRef，方法执行完局部引用会被回收，导致jStringClz成为野指针
        jStringClz = static_cast<jclass>(env->NewGlobalRef(jclz));
        //也可以手动释放局部引用
        env->DeleteLocalRef(jclz);
    } else {
        LOGE("load cache");
    }
    jmethodID jmid = env->GetMethodID(jStringClz, "<init>", "(Ljava/lang/String;)V");
    return static_cast<jstring>(env->NewObject(jStringClz, jmid, env->NewStringUTF("hello world")));
}
```
### 3、弱引用
弱引用在GC时容易被回收
```c{7,13}
extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ReferenceActivity_getWeakReferString(JNIEnv *env, jobject thiz) {
    static jclass jStringClz = nullptr;
    if (jStringClz == nullptr) {
        jclass jclz = env->FindClass("java/lang/String");
        jStringClz = static_cast<jclass>(env->NewWeakGlobalRef(jclz));
        env->DeleteLocalRef(jclz);
    } else {
        LOGE("load cache");
    }
    //判断弱引用是否已经被回收
    if (env->IsSameObject(jStringClz, nullptr)) {
        LOGE("cache was recycled");
        return nullptr;
    }
    jmethodID jmid = env->GetMethodID(jStringClz, "<init>", "(Ljava/lang/String;)V");
    return static_cast<jstring>(env->NewObject(jStringClz, jmid, env->NewStringUTF("hello world")));
}
```