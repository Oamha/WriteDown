---
sidebar: 'auto'
---
## 1 FastDFS体系结构
### 1.1 组件基础
与其它分布式文件系统类似，FastDFS架构中有三种角色，分别是追踪服务器、存储服务器和客户端。客户端是实现FastDFS API的任何客户端或者直接是真实的应用设备，它可以通过网络向FastDFS发起文件请求。追踪服务器是整个系统的枢纽，它负责接收客户端的请求，然后根据具体的负载均衡策略挑选对应的存储服务器用于响应客户端的请求，在追踪服务器所处的物理机的内存中，还维护了对应存储服务器的IP、磁盘等配置信息。存储服务器是真正用于存储的服务器节点，除了响应客户端的上传下载请求外，还要定时地向追踪服务器传递自己的心跳信息。

### 1.2 备份策略
FastDFS中可以有多个追踪服务器，也可以有多个存储服务器。FastDFS 使用了一种分组机制，将存储集群分为不同的组Group，组内有一到多台存储服务器，方便管理也易于扩展，每个组之间的文件彼此独立，相同组内的存储服务器上的文件之间进行备份，当一个新的存储加入到组时，组内已存储的数据会同步到新增的存储上，同步完成后，该存储服务器对外工作。分组的方式使得同一组中的Storage地位是对等的，当一组内的一台服务器故障时，不会影响其他Storage正常工作，即不存在单点故障问题。同时分组使得文件系统的横向扩容变得非常简单。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-architecture.png'"/>

### 1.3 负载均衡策略
常见的负载均衡算法主要有加权轮询，最小连接数，ip_hash, url_hash和fair算法[11]。而FastDFS文件提供了三种负载均衡策略，分别是round robin、specify group和load balance。round robin策略下FastDFS会以轮询的方式挑选组来进行上传下载操作；specify group则是由用户指定某个组来进行上传下载；load balance则会优先选择存储空间最大的组。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-load-balance.png'"/>

### 1.4 文件命名策略
FastDFS的追踪服务器与其它分布式文件系统的master节点非常相似，它们都用于监听存储节点的生命信息。而FastDFS的追踪服务器最大的不同之处是它不需要存储文件的元信息，在文件被写入磁盘时，存储服务器会为文件生成一个唯一标识。这个标识包含以下几个部分：组名、存储路径、存储目录、文件名、后缀名。进行下载操作时，用户只需用Tracker的访问地址拼接上该访问路径，存储服务器便会自动解析出文件的存储位置。

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-naming.png'"/>

### 1.5 文件上传
（1）客户端向追踪服务器发起文件上传请求，追踪服务器查询可用的存储服务器的IP和端口并返回；<br/>
（2）Client向存储服务器上传文件内容，存储服务器为文件生成唯一标识并将文件写入磁盘，将文件标识返回；<br/>
（3）客户端持久存储文件标识；<br/>

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-upload.png'"/>

### 1.6 文件下载
（1）客户端向追踪服务器发起文件下载请求，追踪服务器根据负载状况返回空闲存储服务器的IP和端口；<br/>
（2）Client与存储服务器建立连接，存储服务器查询文件存储路径；<br/>
（3）存储服务器返回文件内容；<br/>

<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-download.png'"/>

## 2 本系统中采用的架构
常见架构中，为了保证高可用性，分布式文件系统大多采用Master和Slaver的主从结构。Master只有一个，Slaver可以有多个。当Master发生故障后，Slaver会重新进行投票选择Master，从而将票数最多的Slaver提升为Master，这种模式有很多局限性，比如：实现逻辑复杂，要考虑票数相同的情形，还有可能发生多轮选举的情形。<br/>

FastDFS分布式文件系统具有支持多追踪服务器和多分组的特点。这使得FastDFS集群不存在单点问题，也避免了重新选举主节点的复杂逻辑。当一台追踪服务器故障时，客户端会选择其它追踪服务器提供服务；同理，当一台存储服务器故障时，追踪服务器会选择同组的正常工作的存储服务器提供文件操作服务。<br/>

由于设备欠缺，本系统采用单追踪服务器、多存储服务器、多分组的架构模式。现有3台云服务器，IP分别为129.211.90.161（腾讯），39.100.33.214（阿里），139.196.122.183（阿里）。腾讯云服务器作为追踪服务器，端口号为22122，负责接收客户端的请求，并根据轮询的负载均衡策略交替式地选择存储服务器来处理请求。阿里云的每台服务器分别启动两个存储服务器，一台属于Group1， 另一台属于Group2，由于同一组的存储服务器要求端口号相同，所以Group1的端口号统一为23000， Group2的端口号统一为23001。这样阿里云的两台服务器就起到了相互备份的效果。<br/>
<Common-Thumb :prefix="'/img/practice/audio-video-app-based-fastdfs'" :urls="'fastdfs-architecture-in-my-sys.png'"/>



