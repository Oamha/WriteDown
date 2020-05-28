---
sidebar: 'auto'
---
## 1、Java的异常相关类
<Common-Thumb :prefix="'/img/conclusion/java'" :urls="'IOException.png'"></Common-Thumb>

+ Java异常的基类为Throwable；
+ Java异常分为Error和Exception两种；
+ Exception又分为受检异常和非受检异常；
+ 受检异常通常编译时期就会报错，即没有处理受检异常的代码是执行不了的，这时可以抛出或捕获；
+ 非受检异常通常运行时才会报错，无法事先预测；
+ Error通常表示程序发生了不可控的错误，要终止程序的运行；

## 2、列举常见的5个运行时异常
+ IndexOutOfBoundsException
+ ClassCastException
+ ArithmeticException
+ NullPointerException
+ IllegalArgumentException
+ ConcurrentModificationException

## 3、列举常见的5个编译时异常
+ SQLException
+ FileNotFoundException
+ UnknownTypeException
+ ClassNotFoundException
+ NoSuchMethodException