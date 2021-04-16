---
title: Annotation
sidebar: auto
---
## 1、Annotation
::: tip
注解(Annotation)是JavaSE5引入的新特性，系统内置了三种注解，定义在java.lang包中，SuppressWarnings, Deprecated, Override，使用注解来生成描述符文件，甚至或是新的类定义，有助于减轻编写"样板"代码的负担。
:::

## 2、元注解
元注解专门用于注解其它的注解:
|注解       |用途              |
|:----------|:----------------:|
|@Target    |表示该注解用在什么地方|
|@Retention |表示该注解在什么级别可用|
|@Documented|将此注解包含在JavaDoc中|
|@Inherited |允许子类继承父类的注解|

## 3、注解元素
使用注解时可以以键值对的形式传递值，支持以下类型：
+ 所有基本类型（int、float、boolean等）
+ String
+ Class
+ enum
+ annotation
+ 以上类型的数组

## 4、使用注解的流程
### 4.1 创建注解
这里像定义一个接口一样创建了UseCase注解，不同的是使用了@interface声明：
```java
@Target(ElementType.METHOD) //注解用于方法上
@Retention(RetentionPolicy.RUNTIME) //运行时可用
public @interface UseCase {
    int value();

    String description() default "no description yet";
}
```
### 4.2 使用注解
这里对创建的注解进行使用，分别传递value和description，value是必须的，description是可选的(有默认值)
```java
public class PasswordUtil {
    @UseCase(value = 33, description = "password must contain at least one numeric")
    public static boolean checkPassword(String password) {
        return password.matches("\\w*\\d\\w*");
    }

    @UseCase(34)
    public static String encryptPassword(String password) {
        return new StringBuilder(password).reverse().toString();
    }

    @UseCase(value = 35, description = "new passwords can't equal previously used ones")
    public static boolean isUsedBefore(String oldPass, String newPass) {
        return oldPass.equals(newPass);
    }
}
```
### 4.3 创建注解处理器
这里在main方法中传递一个value的集合和使用注解的类，
```java
public class UseCaseHandler {

    /**
     * 找出类中标注了注解的方法，以及没有标注注解的方法
     * @param taskIds  id集合（id对应UseCase中的value,标注注解时给出的值)
     * @param cz 使用了注解的类
     */
    public static void getUseCases(List<Integer> taskIds, Class<?> cz) {
        Method[] methods = cz.getMethods();
        for (Method method : methods) {
            UseCase annotation = method.getAnnotation(UseCase.class);
            if (annotation != null) {
                System.out.println(method.getName() + " " + annotation.value() + " " + annotation.description());
                taskIds.remove(new Integer(annotation.value()));
            }
        }
        for (Integer taskId : taskIds) {
            System.out.format("use case %d hasn't complete yet", taskId);
        }
    }


    /**
     * 测试
     * @param args
     */
    public static void main(String[] args) {
        List<Integer> tasks = new ArrayList<>();
        Collections.addAll(tasks, 32, 33, 34, 35);
        UseCaseHandler.getUseCases(tasks, PasswordUtil.class);
    }
}
```