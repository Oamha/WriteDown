---
sidebar: 'auto'
---
## 1、Collection及其子类
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'java-collections.jpg'"/>
知识点总结:
+ Collection接口继承自Iterable接口，主要目的是提供iterator方法，供子类实现进行元素迭代操作；
+ Iterable接口自jdk1.8之后提供了forEach默认方法实现，支持函数式编程；
+ Collection主要有三大子类：List、Set、Queue；
+ List的特点是：有序(按添加顺序)，存储单列数据集合；
+ List线程不同步，Vector线程同步；
+ Set的特点是：无序、唯一，其子类LinkedHashSet能保证添加顺序，子类TreeSet能自定义排序规则；

## 2、Map及其子类
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'java-map.jpg'"/>
知识点总结:
+ HashMap直接继承自AbstractMap, 键和值都允许为null值；
+ HashTable直接继承自Dictionary，键和值不允许为null值；
+ TreeMap能自定义排序规则；
+ LinkedHashMap能保证插入顺序；

