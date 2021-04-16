## intent-filter的过滤规则总结
+ 一个Activity可以配置多组intent-filter,每组可以配置多个action、category、data,只要一组intent-filter匹配即可成功启动Activity；
```java
 <activity android:name=".FilterActivity">
    <intent-filter>
        <action android:name="com.oamha.intent.test1" />
        <action android:name="com.oamha.intent.test2" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="com.oamha.category.category1" />
        <category android:name="com.oamha.category.category2" />
    </intent-filter>

    <intent-filter>
        <action android:name="com.oamha.intent.test3" />
        <action android:name="com.oamha.intent.test4" />

        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="com.oamha.category.category3" />
        <category android:name="com.oamha.category.category4" />

        <data android:mimeType="image/*" />
    </intent-filter>
</activity>
```
+ 创建intent时只能设置一个action，只有该action和配置的过滤规则中的任意一条action匹配，即算匹配成功；
```java
 Intent intent = new Intent();
 intent.setAction("");
```
+ 创建intent时可以添加多个category，只有当添加的category都出现在配置的过滤规则中，才算匹配成功，这点和intent不太一样；
```java
Intent intent = new Intent();
intent.addCategory("");
intent.addCategory("");
```
+ 使用隐式启动时，要添加android.intent.category.DEFAULT这条category；
+ data的匹配规则和intent类似，只要定义了data的匹配规则，那么启动Activity的intent的data也必须和定义的data匹配；
+ data的schema有默认值为content和file；
+ 为intent设置data要用setDataAndType，不能先调用setData再调用setType，因为两者会清除对方的值；
```java
public Intent setData(Uri data) {
    mData = data;
    mType = null;
    return this;
}
```
+ 启动Activity之前可以对intent匹配结果进行判断，避免找不到Activity启动报错：
```java
Intent intent = new Intent();
intent.setAction("com.oamha.intent.test1");
PackageManager packageManager = getPackageManager();
ResolveInfo resolveInfo = packageManager.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY);
```