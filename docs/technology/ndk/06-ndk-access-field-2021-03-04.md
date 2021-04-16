### JNI访问Java属性和方法
### 1、JNI访问Java对象属性
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_accessJavaObjectField(JNIEnv *env, jobject thiz, jobject student) {
    //获取student的类型
    jclass jclz = env->GetObjectClass(student);
    //获取Field  指定属性名，类型，String类型在jvm中的表示是Ljava/lang/String
    //如果是类属性，则使用   jfieldID numId = env->GetStaticFieldID(jclz, "num", "I");
    //                     int num = env->GetStaticIntField(jclz, numId);
    jfieldID nameId = env->GetFieldID(jclz, "name", "Ljava/lang/String;");
    //获取值
    jstring name = static_cast<jstring>(env->GetObjectField(student, nameId));
    LOGE("the name of this student is %s", env->GetStringUTFChars(name, 0));
}
```
::: warning
如果native方法是静态的，那么jni对应方法的第二个参数可以为jclass类型，如：
native方法：<br/>
`public native static void staticNativeMethod()`<br/>
jni方法：<br/>
`extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_staticNativeMethod(JNIEnv *env, jclass jclz)
{
}`
:::
### 2、JNI访问Java方法
```c
extern "C"
JNIEXPORT void JNICALL
Java_com_zzkj_ndk1_ThirdActivity_accessJavaMethod(JNIEnv *env, jobject thiz, jobject student) {
    //查找对象类型
    jclass jclz = env->GetObjectClass(student);
    //查找方法 指定方法名称和方法签名
    jmethodID methodId = env->GetMethodID(jclz, "nativeCallback",
                                          "([Ljava/lang/String;I)Ljava/lang/String;");
    //构建一个String[]
    jobjectArray jarray = env->NewObjectArray(3, env->FindClass("java/lang/String"),
                                              env->NewStringUTF("apple"));
    //调用方法取得返回值
    jstring result = env->CallObjectMethod(student, methodId, jarray, 10);
    //将执行结果转为c类型的字符串进行打印
    const char *arr = env->GetStringUTFChars(result, 0);
    LOGE("resutl is %s",arr);
    //释放字符串占用的空间
    env->ReleaseStringUTFChars(result, arr);
}
```
::: warning
上面是调用实例方法，如果是静态方法，则使用以下方法：<br/>
`env->GetStaticMethodID();`<br/>
`env->CallStaticObjectMethod();`
:::
### 3、JNI访问Java构造方法
native声明
```java
    public native String nativeCallJavaConstructor1();

    public native String nativeCallJavaConstructor2();
```
在本地实现中调用Java构造方法来创建对象
```c
extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ConstructorActivity_nativeCallJavaConstructor1(JNIEnv *env, jobject jobj) {
    jclass jStrClz = env->FindClass("java/lang/String");
    jmethodID jMid = env->GetMethodID(jStrClz, "<init>", "(Ljava/lang/String;)V");
    //直接调用构造方法来创建对象
    jstring str = static_cast<jstring>(env->NewObject(jStrClz, jMid,
                                                      env->NewStringUTF("hello world")));
    return str;
}


extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ConstructorActivity_nativeCallJavaConstructor2(JNIEnv *env, jobject thiz) {
    jclass jStrclz = env->FindClass("java/lang/String");
    jmethodID jMid = env->GetMethodID(jStrclz, "<init>", "(Ljava/lang/String;)V");
    //先分配对象
    jstring str = static_cast<jstring>(env->AllocObject(jStrclz));
    //在赋值
    env->CallNonvirtualVoidMethod(str, jStrclz, jMid, env->NewStringUTF("hello world"));
    return str;
}
```