### JNI引用数据类型
### 1、类型
|Java的类型 |JNI的引用类型 |类型描述 |
| :--------: |:-----------:| :------:|
|java.lang.Object |jobject |可以表示任何Java的对象，或者没有JNI对应类型的Java对象（实例方法的强制参数） |
|java.lang.String |jstring |Java的String字符串类型的对象 |
|java.lang.Class |jclass |Java的Class类型对象（静态方法的强制参数） |
|Object[] |jobjectArray |Java任何对象的数组表示形式 |
|boolean[] |jbooleanArray| Java基本类型boolean的数组表示形式 |
|byte[] |jbyteArray| Java基本类型byte的数组表示形式 |
|char[] |jcharArray |Java基本类型char的数组表示形式 |
|short[] |jshortArray| Java基本类型short的数组表示形式 |
|int[] |jintArray |Java基本类型int的数组表示形式 |
|long[] |jlongArray| Java基本类型long的数组表示形式 |
|float[] |jfloatArray |Java基本类型float的数组表示形式 |
|double[] |jdoubleArray| Java基本类型double的数组表示形式 |
|java.lang.Throwable |jthrowable| Java的Throwable类型，表示异常的所有类型和子类 |
|void |void |N/A|
### 2、案例
字符串相关操作
```c
extern "C"
JNIEXPORT jstring JNICALL
Java_com_zzkj_ndk1_ThirdActivity_convertString(JNIEnv *env, jobject jobj, jstring jstr) {
    //jstring转为c风格的字符串
    const char *arr = env->GetStringUTFChars(jstr, NULL);
    LOGE("%s", arr);
    //获取字符串长度
    int length = env->GetStringLength(jstr);
    LOGE("string length is %d", length);
    char strArr[50];
    //截取字符串
    env->GetStringUTFRegion(jstr, 0, length - 1, strArr);
    LOGE("%s", strArr);
    //释放占用空间
    env->ReleaseStringUTFChars(jstr, arr);
    //新创建字符串
    return env->NewStringUTF("string from c");
}
```
数组相关操作
```c
extern "C"
JNIEXPORT jobjectArray JNICALL
Java_com_zzkj_ndk1_ThirdActivity_callNativeStringArray(JNIEnv *env, jobject jobj,
                                                       jobjectArray jObjArr) {
    //获取数组长度                                                           
    int length = env->GetArrayLength(jObjArr);
    LOGE("string array length is %d", length);
    //获取数组中的某个元素
    jstring str = static_cast<jstring>(env->GetObjectArrayElement(jObjArr, 0));
    const char *cStr = env->GetStringUTFChars(str, 0);
    LOGE("the first string is %s", cStr);
    //设置数组中某个元素的值
    env->SetObjectArrayElement(jObjArr, 0, env->NewStringUTF("modified apple"));
    env->ReleaseStringUTFChars(str, cStr);
    return jObjArr;
}
```