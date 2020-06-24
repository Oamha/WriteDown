## Git日常总结
### 1、Git暂存区覆盖工作目录
适用于`git add`操作，但未进行`git commit`操作
``` shell
git checkout . //全部覆盖
```
``` shell
git checkout -- filename //覆盖局部文件
```
### 2、Git版本库覆盖工作目录
适用于`git add`之后又进行`git commit`操作
``` shell
git checkout HEAD .
```
``` shell
git checkout HEAD -- filename
```
::: warning
以上两种方式都会导致本地代码被覆盖，因此要谨慎使用
:::
### 3、Git diff的使用
比较尚未`git add`的改动
``` shell
git diff
```
比较`git add`之后的改动
``` shell
git diff --cached
```
### 4、Git rest的使用
用版本库内容覆盖暂存库内容，使状态回到`git add`之前，但不会影响当前工作区的内容
``` shell
git reset HEAD
```