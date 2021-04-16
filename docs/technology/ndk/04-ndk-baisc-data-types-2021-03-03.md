### JNI基础数据类型 
### 1、数据类型的对应关系
|Java数据类型| JNI本地类型| C/C++数据类型 |数据类型描述 | 
| :-------------: |:-------------:| :-----:| :-----: |
|boolean |jboolean |unsigned char| C/C++无符号8为整数 |
|byte |jbyte| signed char| C/C++有符号8位整数  |
|char |jchar | unsigned short| C/C++无符号16位整数  |
|short |jshort | signed short | C/C++有符号16位整数 | 
|int| jint | signed int | C/C++有符号32位整数  |
|long |jlong |signed long | C/C++有符号64位整数  |
|float| jfloat | float| C/C++32位浮点数 |
|double |jdouble | double |C/C++64位浮点数 |
### 2、测试代码
#### 2.1 Java代码
```java
public class SecondActivity extends AppCompatActivity {

    static {
        System.loadLibrary("native-lib");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_second);
        Button btn = findViewById(R.id.btn);

        btn.setOnClickListener((v) -> {
            Log.w("tag", invokeNativeInt(10) + "");
            Log.w("tag", invokeNativeShort((short) 10) + "");
            Log.w("tag", invokeNativeLong(10) + "");
            Log.w("tag", invokeNativeFloat(10.0f) + "");
            Log.w("tag", invokeNativeDouble(1.125) + "");
            Log.w("tag", invokeNativeByte((byte) 10) + "");
            Log.w("tag", invokeNativeBoolean(true) + "");
            Log.w("tag", invokeNativeChar('A') + "");
        });


    }

    //调用native方法
    public native int invokeNativeInt(int param);
    public native short invokeNativeShort(short param);
    public native long invokeNativeLong(long param);
    public native float invokeNativeFloat(float param);
    public native double invokeNativeDouble(double param);
    public native byte invokeNativeByte(byte param);
    public native boolean invokeNativeBoolean(boolean param);
    public native char invokeNativeChar(char param);
}
```
#### 2.2 JNI实现
在本地方法中对Java传递的参数进行打印并修改，再返回给Java层进行打印
```c
#include <jni.h>
#include <base.h>

extern "C"
JNIEXPORT jint JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeInt(JNIEnv *env, jobject thiz, jint param) {
    LOGE("java int is %d", param);
    int a = param + 10;
    return a;
}
extern "C"
JNIEXPORT jshort JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeShort(JNIEnv *env, jobject thiz, jshort param) {
    LOGE("java short is %d", param);
    jshort result = param * 2;
    return result;
}
extern "C"
JNIEXPORT jlong JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeLong(JNIEnv *env, jobject thiz, jlong param) {
    LOGE("java long is %lld", param);
    jlong result = param * 2;
    return result;
}
extern "C"
JNIEXPORT jfloat JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeFloat(JNIEnv *env, jobject thiz, jfloat param) {
    LOGE("java float is %f", param);
    jfloat result = param  + 1.0;
    return result;
}
extern "C"
JNIEXPORT jdouble JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeDouble(JNIEnv *env, jobject jobj, jdouble param) {
    LOGE("java double is %lf", param);
    jdouble result = param + 1.0;
    return result;
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeBoolean(JNIEnv *env, jobject jobj, jboolean param) {
    LOGE("java boolean is %d", param);
    jboolean result = !param;
    return result;
}
extern "C"
JNIEXPORT jbyte JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeByte(JNIEnv *env, jobject thiz, jbyte param) {
    LOGE("java byte is %d", param);
    jbyte result = param - 1;
    return result;
}
extern "C"
JNIEXPORT jchar JNICALL
Java_com_zzkj_ndk1_SecondActivity_invokeNativeChar(JNIEnv *env, jobject thiz, jchar param) {
    LOGE("java char is %d", param);
    jchar result = param + 3;
    return result;
}
```