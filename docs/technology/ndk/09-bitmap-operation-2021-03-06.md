### Bitmap
### 1、引入图像操作库
```groovy{3,8}
find_library( # Sets the name of the path variable.
        log-lib
        jnigraphics
        log)

target_link_libraries( # Specifies the target library.
        native-lib
        jnigraphics
        ${log-lib})
```
### 2、Native声明
传入一个Bitmap，进行镜像后再返回一个Bitmap
```java
public class BitmapActivity extends AppCompatActivity {

    static {
        System.loadLibrary("native-lib");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_bitmap);
        ImageView preview = findViewById(R.id.preview);
        Bitmap previewImage = BitmapFactory.decodeResource(getResources(), R.mipmap.test);
        preview.setImageBitmap(previewImage);
        preview.setOnClickListener(v -> {
            Bitmap bitmap = getNativeBitmap(previewImage);
            preview.setImageBitmap(bitmap);
        });
    }

    public native Bitmap getNativeBitmap(Bitmap previewImage);
}
```
3、对Bitmap进行镜像
```c
#include <base.h>
//bitmap操作的头文件
#include <android/bitmap.h>
#include <cstring>

jobject createNewBitmap(JNIEnv *pEnv, jobject pJobject, uint32_t width, uint32_t height);

extern "C"
JNIEXPORT jobject JNICALL
Java_com_zzkj_ndk1_BitmapActivity_getNativeBitmap(JNIEnv *env, jobject jobj, jobject source) {
    AndroidBitmapInfo sourceInfo;
    AndroidBitmap_getInfo(env, source, &sourceInfo);
    LOGE("source bitmap width is %d", sourceInfo.width);
    LOGE("source bitmap height is %d", sourceInfo.height);
    void *addrPtr;
    //获取bitmap的像素信息
    AndroidBitmap_lockPixels(env, source, &addrPtr);
    //创建数组，用于存储镜像后的像素信息
    uint32_t *pixels = new uint32_t[sourceInfo.width * sourceInfo.height];
    uint32_t current = 0;
    //对bitmap进行左右像素点交换
    for (int i = 0; i < sourceInfo.height; i++) {
        for (int j = sourceInfo.width - 1; j >= 0; j--) {
            pixels[i * sourceInfo.width + j] = ((uint32_t *) addrPtr)[current++];
        }
    }
    //
    AndroidBitmap_unlockPixels(env, source);
    //创建新的bitmap
    jobject target = createNewBitmap(env, jobj, sourceInfo.width, sourceInfo.height);
    void *targetPixels;
    AndroidBitmap_lockPixels(env, target, &targetPixels);
    //将镜像后的像素信息拷贝到新建的bitmap像素信息中
    memcpy(targetPixels, pixels, sizeof(uint32_t) * sourceInfo.width * sourceInfo.height);
    AndroidBitmap_unlockPixels(env, target);
    //释放空间
    delete[]pixels;
    return target;
}

//调用Bitmap.createBitmap(int,int,Config)创建bitmap
jobject createNewBitmap(JNIEnv *env, jobject jobj, uint32_t width, uint32_t height) {
    jclass jBitmapClz = env->FindClass("android/graphics/Bitmap");
    jmethodID jBitmapMid = env->GetStaticMethodID(jBitmapClz, "createBitmap",
                                                  "(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;");
    jclass jConfigClz = env->FindClass("android/graphics/Bitmap$Config");
    jmethodID jConfigMid = env->GetStaticMethodID(jConfigClz, "valueOf",
                                                  "(Ljava/lang/String;)Landroid/graphics/Bitmap$Config;");
    jobject jConfig = env->CallStaticObjectMethod(jConfigClz, jConfigMid,
                                                  env->NewStringUTF("ARGB_8888"));
    jobject jBitmap = env->CallStaticObjectMethod(jBitmapClz, jBitmapMid, (int) width, (int) height,
                                                  jConfig);
    return jBitmap;
}
```
### 4、运行结果
可以看到图片已经被左右翻转
<Common-Thumb :prefix="'/img/technology/'" :width="300" :urls="['bitmap-reverse.png', 'bitmap-pre-reverse.png']"/>