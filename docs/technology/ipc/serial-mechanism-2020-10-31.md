## 序列化机制
::: tip 前言
跨进程通信要涉及到对数据进行序列化，通常有两种方式，一种是实现Java原生的Serializable接口，一种是Android提供的Parcelable；
:::
### 1、实现Serializable接口
```java {6}
public class Book implements Serializable {
    private String name;
    private String author;
    private int id;

    private static final long serialVersionUID = 1L;

    public Book(String name, int id, String author) {
        this.name = name;
        this.id = id;
        this.author = author;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Book{" +
                "name='" + name + '\'' +
                ", author='" + author + '\'' +
                ", id=" + id +
                '}';
    }
}
```
实现了Serializable接口之后，便能对对象进行序列化存储：
```java {11,12}
 Book book = new Book("book", 1, "author");
//序列化到test.txt
try (ObjectOutputStream os = new ObjectOutputStream(new FileOutputStream("test.txt"))) {
    os.writeObject(book);
} catch (IOException e) {
    e.printStackTrace();
}
//反序列化 从文件到对象
try (ObjectInputStream is = new ObjectInputStream(new FileInputStream("test.txt"));) {
    Book book1 = (Book) is.readObject();
    System.out.println(book1);
    System.out.println(book == book1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```
运行结果：
```java
Book{name='book', author='author', id=1}
false
```
从11，12行的结果可以看出虽然book和book1的内容完全相同，但他们并不是同一个对象；<br/>
另外，我们发现Serializable的实现类中有一个serialVersionUID字段，这个字段有什么作用呢？<br/>
是这样的，序列化时系统会把当前类的serialVersionUID写入序列化的文件中，当反序列化时系统会检测序列化文件中的serialVersionId，看它是否和当前类的serialVersionId一致，如果一致说明类的版本一致，没有发生改变；如果不一致，说明类已经发生了改变，会导致反序列化失败；

比如，我们先把serialVersionId字段删了，并且删掉Book类的id字段，再用刚才的序列化文件进行反序列化，反序列化就会失败。<br/>
修改后的Book类：
```java
public class Book implements Serializable {
    private String name;
    private String author;

    public Book(String name, String author) {
        this.name = name;
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Book{" +
                "name='" + name + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}
```
修改后的main函数:
```java
//反序列化 从文件到对象
try (ObjectInputStream is = new ObjectInputStream(new FileInputStream("test.txt"));) {
    Book book1 = (Book) is.readObject();
    System.out.println(book1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```
此时，程序就崩溃了：
```java
java.io.InvalidClassException: com.oamha.serializable.Book; local class incompatible: stream classdesc serialVersionUID = 1, local class serialVersionUID = -5875083119353439196
```
但如果我们保留serialVersionId字段，删除Book类的id字段，反序列化仍然能成功：<br/>
修改后的Book类：
```java
public class Book implements Serializable {
    private String name;
    private String author;

    private static final long serialVersionUID = 1L;

    public Book(String name, String author) {
        this.name = name;
        this.author = author;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    @Override
    public String toString() {
        return "Book{" +
                "name='" + name + '\'' +
                ", author='" + author + '\'' +
                '}';
    }
}
```
main函数仍然保持：
```java
try (ObjectInputStream is = new ObjectInputStream(new FileInputStream("test.txt"));) {
    Book book1 = (Book) is.readObject();
    System.out.println(book1);
} catch (IOException | ClassNotFoundException e) {
    e.printStackTrace();
}
```
运行结果：
```java
Book{name='book', author='author'}
```
所以添加serialVersionId字段能很大程度上避免反序列化的失败。
另外，静态变量和transient修饰的变量不会进行被序列化；
### 2、实现Parcelable接口
Parcelable接口是Android提供的更加高效的序列化接口
```java
public class User implements Parcelable {
    private String username;
    private boolean isMarried;
    private Book book;

    protected User(Parcel in) {
        username = in.readString();
        isMarried = in.readByte() != 0;
        book = in.readParcelable(Book.class.getClassLoader());
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(username);
        dest.writeByte((byte) (isMarried ? 1 : 0));
        dest.writeParcelable(book, flags);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<User> CREATOR = new Creator<User>() {
        @Override
        public User createFromParcel(Parcel in) {
            return new User(in);
        }

        @Override
        public User[] newArray(int size) {
            return new User[size];
        }
    };
}
```
writeToParcel方法负责进行序列化，静态常量CREATOR负责反序列化，这里book也是一个Parcelable的实现类，所以反序列化时要传入类加载器，否则会报错；

针对这两种序列化方式，分别有不同的使用场景，通常在内存中操作对象使用Parcelable更加高效，在网络上传输或者持久化到文件，这时使用Serializable更加高效。