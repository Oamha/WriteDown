---
sidebar: 'auto'
---
## Dart语法基础
### 1、Dart的特点
+ 任何变量都是一个对象，并且所有的对象都是对应一个类的实例。无论是数字，函数和null都是对象。所有对象继承自 `Object`类。
+ 尽管`Dart`是强类型的，但是`Dart`可以推断类型，所以类型声明是可选的。如果要明确说明不需要任何类型，可以使用特殊类型`dynamic`。
+ `Dart`支持泛型，如`List<int>`或`List<dynamic>`。
+ `Dart`支持顶级函数(例如 main())，同样有静态函数和实例函数。以及支持函数内创建函数（嵌套或局部函数）。
+ 类似地，`Dart`支持顶级变量，同样有静态变量和实例变量。实例变量有时称为字段或属性。
+ 与`Java`不同，`Dart`没有关键字 “public” ， “protected” 和 “private” 。如果标识符以下划线_开头，则它相对于库是私有的。
+ 标识符以字母或下划线_开头，后跟任意字母和数字组合。
+ `Dart`语法中包含表达式和语句。例如,条件表达式 condition ? expr1 : expr2 的值可能是 expr1 或 expr2 。 将其与 if-else 语句相比较，if-else 语句没有值。 一条语句通常包含一个或多个表达式，相反表达式不能直接包含语句。
+ `Dart`工具提示两种类型问题：警告和错误。 警告只是表明代码可能无法正常工作，但不会阻止程序的执行。错误可能是编译时错误或者运行时错误。 编译时错误会阻止代码的执行; 运行时错误会导致代码在执行过程中引发exception。
### 2、语法细节
#### 2.1 所有变量的默认值都是null;
```dart
var a;
print(a); //null
```
#### 2.2 变量的声明方式
dart声明变量有var、具体的变量类型(如int)、final、const、dynamic等多种形式;
#### 2.3 dynamic和Object的区别
```dart
Object a = 'hello';
print(a.substring(1));  //编译错误，Object没有字符串的substring方法
print((a as String).substring(1)); //正常编译


dynamic b = 'hello';
print(b.substring(1));  //正常编译
```
#### 2.4 final和const的异同
+ 两者声明时都要赋初始值;
+ const具有final的所有特性(声明时就要赋值，不能进行二次赋值);
+ const类型变量赋的值要能够在编译时就确定,final类型声明的变量可以是运行时确定，如下例子;
```dart
const a = DateTime.now(); //编译错误，DateTime.now()不是编译时确定。一般字面量都是编译时常量
final b = DateTime.now(); //正常编译
```
+ 实例的属性不能为const, 但可以为final。如果要声明类级别的const变量，要用static const;
+ const 关键字不仅可以用于声明常量。还可以用来创建常量值，常量值可以被赋给任意对象;
```dart
const a = const []; //等同于 const a = [];
a = [1];            //报错，const不能再被赋值
final b = const [];
print(identical(a, b)); //true
var c = const [];
c = ['var声明的变量能被再次赋值，尽管它引用过前面的常量值。但要保证类型一致'];
```
+ const 还可以用来声明常量构造方法，用常量构造方法生成的对象是同一个对象;
``` dart{8}
class Person {
  final String name;
  final int age;
  const Person(this.name, this.age);
}
const p1 = Person('tom', 22);
const p2 = Person('tom', 22);
print(identical(p1, p2)); //true p1,p2为同一个对象
```
#### 2.5 dart的内置类型
+ Number(int, double)
+ String
+ Boolean
+ List
+ Map
+ Set
+ Rune
+ Symbol
```dart
//字符串转数字
print(double.parse('11.22'));
print(int.parse('11'));
//数字转字符串
print(1.toString());
print(1.22.toString());
//创建空的Map
final map = {};
print(map.runtimeType); //_InternalLinkedHashMap<dynamic, dynamic>
//创建空的Set
final Set<String> set1 = {};
final set2 = <String>{};
print(set1.runtimeType); //_CompactLinkedHashSet<String>
print(set2.runtimeType);//_CompactLinkedHashSet<String>
```
#### 2.6 常量的类型检查与类型转换
```dart
const Object number = 3;
const list = [number as int];
print(list);
final map = {if (number is int) number: number.toString()};
print(map);
final set = {if (list is List<int>) ...list}; //相当于es的解构写法
print(set);
```
#### 2.7 函数
命名可选参数的使用(传参顺序不用一致)
``` dart{5}
main(List<String> args) {
  print(test(10, b: 20));
}

int test(int a, {int b, int c}) {
  if (b != null) {
    return a + b;
  } else if (c != null) {
    return a + c;
  } else {
    return a;
  }
}
```
位置可选参数(传参顺序要一致)
```dart{5}
main(List<String> args) {
  print(test(10, 20));
}

int test(int a, [int b, int c]) {
  if (b != null) {
    return a + b;
  } else if (c != null) {
    return a + c;
  } else {
    return a;
  }
}
```
位置可选参数和命名可选参数可以用默认值
```dart{5}
main(List<String> args) {
  test();
}

test({String msg = "hello"}) {
  print(msg);
}
```
#### 2.8 特殊的运算符
空值判断并赋值
```dart
var b;
b ??= "value";
print(b); //value
```
```dart
var str = 'hello dart';
var a = str ?? 'null';
print(a);
```
拓展运算符和null-aware拓展运算符
```dart
final list1 = [1, 2, 3, 4];
final list2 = [...list1, 5];
print(list2); //[1, 2, 3, 4, 5]
final list3 = [...?list1, 5]; //防止list1为空
print(list3);
```
collections-for和collections-if
```dart
var isAdd = true;
final names = {'tom', 'jim', 'frank', if (isAdd) 'michael'};
print(names); //{tom, jim, frank, michael}
final extendNames = ['#-jack', for (var name in names) '#-$name'];
print(extendNames); //[#-jack, #-tom, #-jim, #-frank, #-michael]
```

