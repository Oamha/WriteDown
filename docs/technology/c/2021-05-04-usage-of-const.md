### const妙用
const主要有下面几种用法：
+ const修饰普通变量（常量）；
+ const修饰指针指向的变量（指向常量的指针变量）；
+ const修饰指针的指向（常指针）；
+ const既修饰指针指向的变量，又修饰指针的指向（指向常量的常指针）；
```c
#include <iostream>
using namespace std;
int main()
{
    //第一种
	const int a = 10;
	//a = 20;

    //第二种
	char ch = 'H';
	const char * cPtr = &ch;
	//*cPtr = 'a';            //指针指向的内容不能通过指针修改
	ch = 'a';                 //直接通过变量操作存储单元里的值是允许的

    //第三种
	float f = 3.1415f;
	float * const fPtr = &f;
	//fPtr++;                //不能改变指针的指向

    //第四种
	short s = 255;
	const short * const sPtr = &s;
	//*s = 333;             //指针指向的内容不能通过指针修改
	//sPtr++;               //不能改变指针的指向

	return 0;
}
```
指向常量的指针变量(第二种用法)常用于函数形参:
```c
void modify(const char * cPtr) {
	*cPtr = 'a'; //报错 ，只能利用cPtr读取值，不能修改值
}
```