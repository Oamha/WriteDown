## JVM内存结构
### 1、程序计数器
#### 1.1 作用
用于记住下一条JVM指令的执行地址。解释器会从程序计数器中取出指令地址，加载指令，从而持续执行。
#### 1.2 特点
+ 线程私有；
+ 不存在内存溢出；
### 2、虚拟机栈
#### 2.1 作用
每个线程运行时也需要一定的内存空间，这个内存空间就是虚拟机栈。每个虚拟机栈由多个栈帧组成，每个栈帧对应着相应方法调用时所用的内存空间，每个线程都有一个活动栈帧，对应着当前正在执行的方法；
#### 2.2 特点
+ 线程私有；
+ 栈内存不涉及垃圾回收；
+ -Xss 可以设置栈内存大小，最小设置108k；
+ 方法调用需要考虑线程安全问题（是否是局部变量，是否引用成员变量，局部变量是否逃离方法作用范围）；
+ 栈内存溢出的原因：栈帧过多或栈帧占用内存过大，会抛出java.lang.StackOverflowError；

常见的案例导致的StackOverflowError：
```java
/**
 * Jackson转json出现栈溢出
 * 对象关联
 * 一个部门关联两个员工
 * 员工分别关联该部门
 */
public class StackTest1 {

    public static void main(String[] args) throws JsonProcessingException {
        Dept dept = new Dept();
        dept.setName("财务部");

        Student student1 = new Student();
        student1.setName("stu1");
        student1.setDept(dept);
        Student student2 = new Student();
        student2.setName("stu2");
        student2.setDept(dept);

        dept.setList(Arrays.asList(student1, student2));

        //转为JSON时产生循环依赖问题，导致栈溢出， 可以使用JsonIgnore解决
        ObjectMapper objectMapper = new ObjectMapper();
        System.out.println(objectMapper.writeValueAsString(dept));
    }

}

class Dept {
    private String name;
    private List<Student> list;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Student> getList() {
        return list;
    }

    public void setList(List<Student> list) {
        this.list = list;
    }
}

class Student {
    @JsonIgnore
    private Dept dept;
    private String name;

    public Dept getDept() {
        return dept;
    }

    public void setDept(Dept dept) {
        this.dept = dept;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```
### 3、本地方法栈
#### 3.1 作用
类似于虚拟机栈，提供本地方法调用时的内存空间；
### 4、堆
#### 4.1 作用
存放new出来Java对象
#### 4.2 特点
+ 垃圾回收的主战场；
+ 需要考虑线程安全；
+ 存在内存溢出，产生OutOfMemoryError；
+ -Xmx虚拟机参数可以调整堆大小；
+ 堆内存调试工具：jmap -heap pid / jconsole /jvisualvm
```java
/**
 * 不断往堆中创建对象导致堆空间不足
 */
public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    String s = "hello";
    int a = 0;
    try {
        while (true) {
            System.out.println(a);
            list.add(s);
            s = s + s;
            a++;
        }
    } catch (Throwable throwable) {
        throwable.printStackTrace();
        System.out.println(a);
    }
}

运行结果：
java.lang.OutOfMemoryError: Java heap space
26
```
### 5、方法区
#### 5.1 作用
用于存储类的结构信息，比如运行时常量池，属性和方法数据，构造方法等；
#### 5.2 特点
+ 存在内存溢出，抛出OutOfMemoryError；
+ JDK1.6用永久代作为方法区的实现，占用堆的内存；
```java
/**
 * JDK 1.6
 * 执行20000次类的加载出现永久代内存不足
 * 设置元空间大小 -XX:MaxPermSize=8m
 */
public class ClassLoaderTest1 extends ClassLoader {

    public static void main(String[] args) {
        ClassLoaderTest1 test = new ClassLoaderTest1();
        int i = 0;
        try {
            for (i = 0; i < 20000; i++) {
                ClassWriter writer = new ClassWriter(0);
                //版本，访问修饰符，类型，包名，父类，接口
                writer.visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Class" + i, null, "java/lang/Object", null);
                byte[] bytes = writer.toByteArray();
                //执行类的加载
                test.defineClass("Class" + i, bytes, 0, bytes.length);
            }
        } catch (Throwable t) {
            System.out.println(i);
            t.printStackTrace();
        }
    }
}
执行结果：
19315
java.lang.OutOfMemoryError: PermGen space
```
+ JDK1.8用元空间作为方法区的实现，不占用堆的内存，占用本地内存，即操作系统的内存，串池（StringTable）被移入堆中；
```java
/**
 * 执行10000次类的加载出现元空间内存不足
 * 设置元空间大小 -XX:MaxMetaspaceSize=10m -XX:-UseCompressedClassPointers
 */
public class ClassLoaderTest extends ClassLoader {

    public static void main(String[] args) {
        ClassLoaderTest test = new ClassLoaderTest();
        int i = 0;
        try {
            for (i = 0; i < 10000; i++) {
                ClassWriter writer = new ClassWriter(0);
                //版本，访问修饰符，类型，包名，父类，接口
                writer.visit(Opcodes.V1_8, Opcodes.ACC_PUBLIC, "Class" + i, null, "java/lang/Object", null);
                byte[] bytes = writer.toByteArray();
                //执行类的加载
                test.defineClass("Class" + i, bytes, 0, bytes.length);
            }
        } catch (Throwable t) {
            System.out.println(i);
            t.printStackTrace();
        }
    }

}
执行结果：
9344
java.lang.OutOfMemoryError: Metaspace
```
