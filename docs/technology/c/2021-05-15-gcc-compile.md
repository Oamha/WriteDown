### C程序生成exe文件的流程
### 1、预处理
预处理阶段使用gcc -E test.c -o test.i，不检测语法；
+ 头文件展开 将include的内容引入源文件；
+ 宏替换 将用到的宏名用对应的宏值替换；
+ 替换注释 将源文件中的注释替换成空行；
+ 条件编译 处理#ifdef中的语句；
### 2、编译和汇编
### 2.1、编译
汇编阶段使用gcc -S test.i -o test.s将源文件中的c指令转为汇编指令；
### 2.2、汇编
汇编阶段使用gcc -c test.s -o test.o将汇编指令转换为对应的二进制指令；
### 3、链接
链接阶段使用gcc test.o -o test.exe将二进制目标文件链接成可执行文件；
+ 数据段合并；
+ 数据地址回填；
+ 库引入；