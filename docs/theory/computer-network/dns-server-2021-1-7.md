## DNS服务
::: tip 基本概念
DNS(Domain Name System)，又称作域名系统。主机之间要通信，必须要知道对方的IP地址，而32位的IP地址并不方便人们记忆。域名系统用于将便于人们使用的机器名称转换为IP地址，从而不用记忆较长的IP地址。早期计算机数量较小时并不使用域名系统，而是用存储在本机上的hosts文件完成主机名到IP地址的映射。
:::
### 1、域名结构
#### 1.1 域名组成 
域名采用树状结构，由标号组成，标号之间用点隔开，最右边为最高级，最左边为最低级，不区分大小写，如：
```
abc.xyz.com
```
abc为三级域名，xyz为二级域名，com为顶级域名；

#### 1.2 顶级域名分类 
顶级域名分为三类：
+ 国家顶级域名（.cn，.us，.uk等）；
+ 通用顶级域名（.com，.net，.org等）；
+ 基础结构域名（.arpa，用于反向域名解析）；

#### 1.3 域名树
```
                                根
                               /  \ 
顶级域名                      com  cn  .....
                            /  \     \
二级域名                  cctv huawei  edu .....
                          /
三级域名                 mail...............
```
### 2、域名服务器
为完成域名解析，可以在上图中每一级的域名都放置一台服务器，但这样做会使域名服务器过多，因此DNS采用分区管理的形式。
+ 根域名服务器 最高层次的服务器，也是最重要的服务器。当本地域名服务器无法解析一个域名时便会请求根域名服务器。它记录着所有顶级域名服务器的域名和IP地址；
+ 顶级域名服务器 负责在该顶级域名下的二级域名解析；
+ 权限域名服务器 它负责一个区的域名解析，当它还不能给出最终ip时，会去请求其它权限域名服务器；
+ 本地域名服务器 DNS请求会首先送达本地域名服务器，本地域名服务器解析不了时，才送达根域名服务器。比如我们在学校常设置网络属性中的首选DNS和备用DNS就是本地域名服务器；

### 3、域名解析
#### 3.1 递归查询(主机向本地域名服务器查询)
主机不知道域名对应的IP时向本地域名服务器查询，本地域名服务器解析不了时以DNS客户的身份再向根域名服务器查询，最后将结果返回，或者报错（查询不到）；
#### 3.2 迭代查询(本地域名服务器向根域名服务器查询)
主机不知道域名对应的IP时向本地域名服务器查询，本地域名服务器再分别向根域名服务器查询，根域名服务器返回顶级域名服务器的IP地址，本地域名服务器再向顶级域名服务器查询，顶级域名服务器返回权限域名服务器的IP地址，本地域名服务器再向权限域名服务器查询。

### 4、高速缓存
+ 为减少域名服务器的负载和网络上DNS查询的流量包，域名服务器广泛使用了高速缓存。如果要解析的域名不久前查询过，那么可以直接将高速缓存中的历史查询结果直接返回。
+ 域名缓存有一定时限，域名服务器在响应DNS查询时会指明域名和IP绑定的有效期，过期时会删掉缓存。
+ 不仅本地域名服务器存在高速缓存，主机中也存在。有些主机开机时就会从本地域名服务器下载名字和地址的数据库，维护在本地。