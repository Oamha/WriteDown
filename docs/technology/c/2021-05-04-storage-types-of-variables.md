### C++变量存储类别
### 1、auto
通常情况下，我们定义的变量都是自动变量，在程序运行期间动态分配内存，auto可以自动识别变量类型，如：
```c
	auto c = 'A';
	auto a = 10; 
```
### 2、register
register关键字用于定义一个寄存器变量，可以加快变量的访问速度，避免反复从内存取值，如：
```c
	register int aa = 10;
```
### 3、extern
extern能够拓展变量的作用域，使得在一个源文件中能够访问到另一个源文件中的变量，如：<br/>
A.cpp
```c 
#include <iostream>
using namespace std;
int main()
{
	extern int global;  //global变量的定义在B.cpp中
    printf("%d", global);
	return 0;
}
```
B.cpp
```c 
int global = 10;
```
A.cpp和B.cpp在同一个工程下，`A.cpp`利用`extern`关键字能够访问到`B.cpp`中定义的`global`变量；
+ extern能够使变量的声明和定义分离，如上面的例子；
+ 如果变量的声明和定义都在一个文件中，extern的作用就是扩展变量的作用域到变量的声明位置，如下面的例子：
```c
#include <iostream>
using namespace std;
int main()
{
	extern int gg;  //gg的作用域被提前到声明处
	printf("%d", gg);
	return 0;
}

int gg = 10;
```
### 4、static
#### 4.1、static用在函数作用域中
static在函数作用域定义变量时，该变量在编译时被初始化一次，函数执行时不再初始化，函数执行完成该变量内存空间不会释放，再次执行函数会用上一次函数执行后该变量的值；
```c
#include <iostream>
using namespace std;

void localStaticVariableTest() {
	static int count = 10;
	count++;
	cout << count << endl;
}

int main()
{
	localStaticVariableTest(); 
	localStaticVariableTest(); 
	localStaticVariableTest(); 
	return 0;
}
```
运行结果：
```c
11
12
13
```
可以看出static用在函数作用域中是为了限制变量的作用范围，函数执行完成，虽然变量没有释放，但已经无法使用该变量；
#### 4.2、static用在全局作用域中
static用在全局作用域主要是限定变量或函数的作用域在本文件中；<br/>
A.cpp
```c
#include <iostream>
using namespace std;
int main()
{
    extern int global;
	printf("%d", global);
	return 0;
}
```
B.cpp
```c
static int global = 10;
```
这段代码试图在`A.cpp`中访问`B.cpp`中的`global`变量，虽然用了extern关键字，但由于global变量用了static声明，所以程序运行时会报错。