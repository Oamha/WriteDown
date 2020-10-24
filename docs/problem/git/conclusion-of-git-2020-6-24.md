## Git日常总结
### 1、Git暂存区覆盖工作目录
适用于`git add`操作之后，但未进行`git commit`操作
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
可以理解为比较尚未`git add`的改动
``` shell
git diff
```
可以理解为比较`git add`之后的改动
``` shell
git diff --cached
```
和历史版本库进行比较
``` shell
git diff HEAD
```
查看修改的元数据
``` shell
git diff --stat
```
### 4、Git reset的使用
用版本库内容覆盖暂存库内容，使状态回到`git add`之前，但不会影响当前工作区的内容
``` shell
git reset HEAD
```
### 5、Git commit的使用
相当于`git add`之后再`git commit`
``` shell
git commit -am message
```
### 6、Git branch的使用
查看分支、创建分支、删除分支
``` shell
git branch branchName //创建分支
git branch -d branchName //删除分支
```
### 7、Git checkout的使用
创建分支、切换分支
```
git checkout -b branchName
``` shell
### 8、Git merge的使用
合并分支
``` shell
git merge branchName
```
### 9、Git log的使用
查看历史记录
``` shell
git log --oneline //简洁版
git log --graph   //分支信息
git log --author=Oamha --oneline
```
### 10、Git tag的使用
为某一阶段打上标签
``` shell
git tag -a v1.0.0 版本号
```
