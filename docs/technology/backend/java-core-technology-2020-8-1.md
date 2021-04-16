## Java核心技术笔记
### IO
<font size="3">
1、Java的IO操作分为两类，一类是面向字节流的(InputStream, OutputStream)，一类是面向Unicode编码形式(Reader, Writer,都是基于两字节的Unicode码元);

2、InputStream的核心方法是read，用于读入一个字节，并返回这个字节，其它子类只需覆盖这个方法。拓展方法read(byte[] bytes)都是间接调用这个方法，OutputStream也是同样的道理;

3、对于Reader及其子类，read方法用于读取一个Unicode码元(0-65535);

4、available方法用于查看当前还可以读取多少字节，该方法调用以非阻塞的形式;

5、skip用于跳过指定字节数，其底层还是通过read方法，提前读取要跳过的字节数;
```java
 public long skip(long n) throws IOException {
    long remaining = n;
    int nr;
    if (n <= 0) {
        return 0;
    }
    int size = (int)Math.min(MAX_SKIP_BUFFER_SIZE, remaining);
    byte[] skipBuffer = new byte[size];
    while (remaining > 0) {
        nr = read(skipBuffer, 0, (int)Math.min(size, remaining));
        if (nr < 0) {
            break;
        }
        remaining -= nr;
    }
    return n - remaining;
}
```
6、Closeable接口抽象为可关闭的资源对象，它拓展了AutoCloseable接口，Closeable接口的close方法只能抛出IOException，而AutoCloseable接口的close方法可以抛出所有异常，这样AutoCloseable的子类就可以重写close方法，抛出指定的异常，比如IOException异常，甚至可以不抛出异常;

7、try-with-resources语句是一种声明了一种或多种资源的try语句。资源是指在程序用完了之后必须要关闭的对象。try-with-resources语句保证了每个声明了的资源在语句结束的时候都会被关闭。任何实现了java.lang.AutoCloseable接口的对象，和实现了java.io.Closeable接口的对象，都可以当做资源使用。

8、java.io中的类都将相对路径名解释为以工作目录开始，可以通过`System.getProperty("user.dir")`来获取;

9、getClass().getResourceAsStream(name)的name如果不以`/`开头，则路径被解释为package/name，如果以`/`开头，则路径被解释为`/`后面的内容;

如获取当前包下的一个.txt文件可以用以下方式：
```java
getClass().getResourceAsStream("/com/oamha/io/test.txt")
或者
getClass().getResourceAsStream("test.txt")
```

</font>