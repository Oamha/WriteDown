---
sidebar: 'auto'
---
## 1 前言
::: tip
本系统移动端主要采用MVVM模式搭建。MVVM是Google的Jetpack工具包中所推崇的一种应用架构设计。作为MVC，MVP的改良版，MVVM将视图层的状态和行为进行抽象，使得视图UI和应用的业务逻辑分离开来，很大程度地缩减Activity和Fragment的工作量。该实现模式下主要包括以下组件：实时数据(LiveData)，数据绑定(DataBinding)，视图模型(ViewModel)和对象映射库(Room)。
:::
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :width="600" :urls="'app-development-mvvm.png'"/>
## 2 组件基础
### 2.1 实时数据
安卓开发常常需要考虑一些极端情形。如用户触发的屏幕旋转，接听电话等操作，这些都会影响Activity的生命周期，当用户再次返回应用界面时，常常会发生数据丢失或数据过时的现象，如何及时地更新数据成为了改善应用体验的关键。实时数据很好地解决了此类问题。实时数据LiveData被设计为一类可观测的对象，Activity、Fragment等组件可以通过注册为实时数据的观察者的形式来实时获取数据的更新，当Activity或Fragment声明周期结束时会进行自动清理，从而避免了内存泄漏。
### 2.2 数据绑定
数据绑定也是MVVM模式中的一大特色。数据绑定允许开发者直接将实体类绑定到页面布局中，避免了在Activity中进行的大量的赋值操作。使用数据绑定DataBinding取代了视图中的findViewById操作，避免了空指针异常和内存泄漏现象的发生。

``` xml{5-11,24,29}
<?xml version="1.0" encoding="utf-8"?>
<layout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <data>
        <variable
            name="listener"
            type="com.hncj.music.core.ui.home.HomeFragment.OnModuleSelectListener" />

        <variable
            name="song"
            type="com.hncj.music.beans.Song" />


    </data>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:onClick="@{() -> listener.onAlbumModuleSelect()}"/> <!--绑定点击的回调方法-->

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@{song.songName}"/> <!--绑定实体属性-->

    </LinearLayout>
</layout>
```
### 2.3 视图模型
视图模型ViewModel是MVVM模式的核心，它以生命周期的形式来管理应用的数据，使得设备在发生屏幕旋转等配置变化时数据依然保存在内存当中，不会造成数据的重新加载。解决此类问题的传统方式是在onSaveInstanceState方法中保存相关数据状态，然后在onCreate重新创建时恢复数据，然而此种方式存在严重局限性，比如它只适合于保存序列化的少量数据。视图模型在应用状态保存上存在很大优势，它的存在主要是为了给界面准备数据。而且，视图模型的使用为一个Activity和多个Fragment之间相互通信、共享数据提供了巨大方便，此种情形下，视图模型的生命周期与Fragment所在的Activity的生命周期相同，Fragment销毁时，由于Activity生命周期并未结束，所以视图模型并不会被销毁，当Fragment重新创建时，便会立即取得原始数据。
#### 2.3.1 创建ViewModel类
``` java{2,23}
public class AlbumViewModel extends ViewModel {
    private MutableLiveData<List<Album>> mAlbums; //LiveData对象

    public MutableLiveData<List<Album>> getAlbums() {
        if (mAlbums == null) {
            mAlbums = new MutableLiveData<>();
        }
        return mAlbums;
    }

    public void loadAlbums(int currentPage) {    //加载数据
        Map<String, String> params = new HashMap<>();
        params.put("currentPage", String.valueOf(currentPage));
        RequestParams requestParams = new RequestParams();
        requestParams.normalParams = params;
        HttpClient.doPost(RequestHelper.BASE_ALBUM_API + "/more", requestParams, new BaseRequestLifecycleCallback<WithListBeanResult<Album>>() {
            @Override
            protected void failure(Call call, Exception e) {
            }

            @Override
            protected void response(WithListBeanResult<Album> result) {
                mAlbums.setValue(result.data);  //给LiveData赋值后会通知其观察者
            }
        });
    }
}
```

#### 2.3.2 在Activity或Fragment中构建ViewModel实例
```java
AlbumViewModel mAlbumViewModel = new ViewModelProvider(this).get(AlbumViewModel.class);
```

#### 2.3.2 在Activity或Fragment中监听数据
```java
mAlbumViewModel.getAlbums().observe(getViewLifecycleOwner(), albums -> {
    //数据回来会回调此方法
    //这里可以进行更新界面等操作
});
```

### 2.4 对象映射库
Room是Jetpack提出的持久层解决方案，它对SQLite的功能进行了抽象，使开发者能够在享受SQLite的强大功能的同时，以ORM的形式操作数据库。Room的主要使用场景是用来缓存应用数据，当用户设备网络不可用时，仍然能以离线的方式浏览相应数据，从而优化体验。
#### 2.4.1 创建实体类
```java
@Entity(tableName = "tb_query_history", indices = {@Index(value = "name", unique = true)})
public class QueryHistory {

    /*必须加NotNull注解*/
    @PrimaryKey
    @NotNull
    public String id;

    @ColumnInfo(name = "name")
    public String name;

    @ColumnInfo(name = "type")
    public String type;

    @ColumnInfo(name = "time")
    public Date time;

    public QueryHistory() {
    }

    @Ignore
    public QueryHistory(String name, String type) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.type = type;
        this.time = new Date();
    }

    @Ignore
    public QueryHistory(QuerySuggestion suggestion) {
        this.id = suggestion.id;
        this.name = suggestion.name;
        this.type = suggestion.type;
        this.time = new Date();
    }

    @Override
    public String toString() {
        return "QueryHistory{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", time=" + time +
                '}';
    }
}
```
#### 2.4.2 创建DAO
```java
@Dao
public interface QueryHistoryDao {
    @Query("SELECT * FROM tb_query_history WHERE type = :type order by time DESC")
    List<QueryHistory> queryAll(String type);

    //插入冲突时进行替换
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    long insertOne(QueryHistory history);

    @Query("DELETE FROM tb_query_history WHERE type = :type")
    int deleteAll(String type);
}
```
::: warning
Dao标注的为接口，运行时会被自动实例化；
:::
#### 2.4.3 创建RoomDatabase
```java
/*构造方法不能用private*/
@TypeConverters(value = {Converters.class})
@Database(version = 4, entities = {QueryHistory.class}, exportSchema = false)
public abstract class MusicDB extends RoomDatabase {
    private static MusicDB sInstance;

    public static MusicDB getInstance(Context context) {
        if (sInstance == null) {
            synchronized (MusicDB.class) {
                if (sInstance == null) {
                    sInstance = Room.databaseBuilder(context, MusicDB.class, "music")
                            .allowMainThreadQueries()
                            .fallbackToDestructiveMigration()
                            .build();
                }
            }
        }
        return sInstance;
    }
    /* 提供抽象方法用于获取Dao实例 */
    public abstract QueryHistoryDao getQueryHistoryDao();
}
```
#### 2.4.4 类型转换器(用于时间类型的转换)
```java
public class Converters {
    @TypeConverter
    public static long dateToLong(Date date) {
        return date == null ? 0 : date.getTime();
    }

    @TypeConverter
    public static Date longToDate(long time) {
        return new Date(time);
    }
}
```
## 3 应用导航设计
移动端应用通常涉及多个界面，每个界面又有多个入口和多个出口。如果不统一模块之间通信的接口并进行合理的APP路由设计，应用就会显得杂乱无章，增大应用异常崩溃的风险。本课题中移动端涉及四个模块，下面分别针对每个模块给出具体的路由导航设计。
### 3.1 歌曲模块
歌曲模块的主要界面是推荐界面。它负责系统的核心路由跳转，从该界面可以跳转到专辑界面、榜单界面、推荐歌手界面、分类界面，比如从推荐界面跳转专辑界面会展示专辑下的歌曲信息。这些界面又有一个统一的出口，即歌曲列表界面，该界面的职能是根据不同的来源展示不同的歌曲，用户在此界面点击歌曲可跳转播放界面。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'router-of-song-module.png'" :width="600"/>
### 3.2 视频模块和朋友圈模块
视频模块和朋友圈模块路由设计相对简单，用户从主界面点击视频的导航按钮，即可跳转视频列表界面。视频列表界面展示了社会、世界、生活、娱乐、财富五个分类的视频，用户选择任意分类的视频，即可跳转到视频播放界面；同理，用户从主界面点击圈子模块的底部导航按钮，可以跳转到朋友圈列表界面，在朋友圈列表界面，用户可以点击右上方发布按钮，可以跳转到发布界面，发布完成后，返回朋友圈列表界面。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'router-of-social-and-video-module.png'" :width="600"/>
### 3.3 用户信息模块
用户界面提供了与具体用户身份有关的路由跳转。从用户界面可以到达关注信息界面、收藏信息界面、本地音乐界面、浏览历史界面，而这些界面又统一跳转到播放界面进行播放。用户界面还可以跳转到用户详情界面进行信息修改操作。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'router-of-user-module.png'" :width="600"/>