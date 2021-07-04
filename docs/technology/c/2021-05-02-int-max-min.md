### int类型的最大值最小值
:::tip 概念
计算机内存中的数据都是以二进制补码的形式进行存储的，主要是为了将减法运算也转换为加法运算。4字节的int类型表示范围为2^31 - 1 ~ -2^31，最大值用16进制表示为0x7fffffff，最小值用16进制表示为0x80000000.
:::
```c
#include <cstdio>
int main()
{
	//-1
	printf("%x\n", -1);

	//int最大值
	int max = (unsigned(~0)) >> 1;
	printf("%x\n", max);

	//int最小值
	int min = 1 << 31;
	printf("%x\n", min);

	//int最大值加一变为最小值
	printf("%x\n", max + 1);

	//int最小值减一变为最大值
	printf("%x\n", min - 1);

	return 0;
}
```
```c
运行结果：

ffffffff
7fffffff
80000000
80000000
7fffffff
```
计算机中整数的表示可以看成是循环往复的，最大值再大一个数就变成了最小值，最小值再小一个数就变成了最大值。