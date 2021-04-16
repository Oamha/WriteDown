### Java集合
::: tip 概念
Java集合总体上分为存储value类型(Collection)和存储key-value类型(Map);
:::
### 1、Collection及其子类
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'java-collections-hierarchy.png'"/>
总结:
+ List、Set、Queue三大类容器都扩展自Collection接口，Collection接口继承了Iterable接口（都是可迭代的）；
+ List代表了一类有序，允许重复元素的集合；
+ Set代表了一类无序，不允许重复元素的集合；
+ Queue代表了队列，有先进先出的特性；

### 2、Map及其子类
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'java-map-hierarchy.png'"/>
总结:
+ Map也大致分为了两种，基于hash算法无序实现和基于树的有序实现；

