## Http服务
::: tip 基本概念
Http(Hyper Text Transfer Protocol)超文本传输协议定义了浏览器怎样向万维网服务器请求万维网文档，以及服务器怎样把文档传送给浏览器。Http是一个应用层协议，它使用TCP连接进行可靠的传输。
:::

### 1、Http工作流程

<Common-Thumb :prefix="'/img/theory/computer-network'" :urls="'procedure-of-www-network.png'"/>

+ 万维网服务器监听TCP 80端口，等待客户端浏览器建立连接请求；
+ 客户端输入浏览地址或者点击超链接发起建立连接请求，连接建立；
+ 客户端发送请求报文；
+ 服务端响应请求报文；
+ 释放TCP连接；

<font color="red">
Http虽然使用了TCP连接（面向连接的），但其本身是无连接的，也就是说在真正发送http报文之前是不需要建立http连接的；
</font>
<br/>
<font color="red">
Http协议是无状态的，第一次请求和后续请求得到的响应是一样的；
</font>
<Common-Thumb :prefix="'/img/theory/computer-network'" :urls="'time-of-request-www-doc.png'"/>

+ 从图中可以看出请求一个万维网文档所需的时间是该文档的传输时间加上两倍的往返时间RTT（一个RTT用于建立TCP连接，一个RTT用于请求和接收万维网文档）；
+ 万维网请求报文是通过建立TCP连接阶段三报文握手的第三个报文发送的；
+ HTTP1.0每请求一个对象，如图片，音频等，都要进行建立连接，释放连接，有两倍RTT的开销，这种非持续性连接会导致服务器负载很大；
+ HTTP1.1支持流水线式持续连接和非流水线式持续连接，很好地解决了该问题。非流水线式持续连接要等到响应报文回来才能继续发送请求报文，而流水线式持续连接可以在没得到响应报文之前继续发送请求报文。

### 2、Http报文结构
<Common-Thumb :prefix="'/img/theory/computer-network'" :width="400" :urls="['request-message-of-http.png', 'response-message-of-http.png']"/>
+ 请求报文和响应报文都由开始行，首部行，实体主体组成；
+ 请求报文的开始行又称作请求行，响应报文的开始行又称作状态行；
+ 请求报文的开始行由请求方法，URL，HTTP和一个换行符版本组成，每个字段用空格隔开；
+ 响应报文的开始行由HTTP版本、状态码、短语和一个换行符组成，每个字段用空格隔开；
+ 首部行用于描述浏览器、服务器和报文主体的一些信息；
+ 请求方法有GET/POST/PUT/DELETE/OPTION/HEAD/TRACE/CONNECT；
+ 状态码：1xx表示请求收到了正在处理，2xx表示请求成功，3xx表示重定向，4xx表示客户端错误，5xx表示服务端错误；