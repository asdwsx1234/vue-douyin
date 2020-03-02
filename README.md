# 低仿抖音短视频
------
临近毕业，选了《微视频社交网站的开发》这个题作为毕业设计，然后就照着[抖音](https://www.douyin.com/)打算用自己自学的知识（前端方向）来实现一遍。该项目基本使用JavaScript（ES6/7）开发，混入了Python写的爬虫来爬取[梨视频](https://www.pearvideo.com/)的短视频来丰满自己的数据库。

__注：本项目仅供学习交流使用，切勿用于商业用途，如有侵犯第三方版权问题及时联系我__

## 前端技术栈
 - Axios
 - Vue2
 - Vuex
 - Vue Router
 - Vue CLI 3
 - Vue-socket.io
 - Stylus
## 后端技术栈
 - koa2
 - sequelize
 - ioredis
 - socket.io

## 项目运行
### 使用Docker： 
> 自学docker时用这个项目做了实践，不用本地装数据库啥的，（仅效果预览）推荐使用这种方法！！！

1. 首先安装[docker](https://www.docker.com/products/docker-desktop)， 如果安装过就不需要了。
2. (方案1)自己构建镜像，需要等待一段时间。终端在该项目目录下运行 ```docker image build -t vue-douyin .``` 

   (方案2)直接从dockerhub拉取镜像，需要等待一段时间。终端运行```docker pull asdwsx1234/vue-douyin```
3. (方案1)然后运行 ```docker container run --rm -p 3000:3000 -it vue-douyin``` 运行该容器。
   
   (方案2)然后运行 ```docker container run --rm -p 3000:3000 -it asdwsx1234/vue-douyin``` 运行该容器。

   端口必须是3000啊，否则请求的地址会错！
4. 浏览器访问[http://127.0.0.1:3000](http://127.0.0.1:3000)或者[http://127.0.0.1:3000/admin](http://127.0.0.1:3000/admin)

### 在本机部署的方法： 

__注意：node 需要 6.0 以上版本__
```
git clone https://github.com/asdwsx1234/vue-douyin.git 

cd vue-douyin

npm install

启动redis数据库和mysql数据库

redis数据库配置文件为./server/redis.js
mysql数据库配置文件为./server/config.js

node ./server/init-db.js (初始化数据库生成表结构) -- 空表
或者将./server/utils/backup.sql还原到你自己的数据库下

node ./server/app.js （启动服务器）

npm run serve （前端项目）


```
前后端都在一个项目里（感觉不是很合理），所以必须先启动后端相关的服务器。

## 说明
>  如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ :grin:

## 效果演示
~~服务器2020.03.03到期，到时候就预览不了啦，不续了。~~

~~[查看demo请戳这里](http://www.zhoubaba.club)（请用chrome手机模式预览）~~

~~__移动端扫描下方二维码__~~

<img src="./screenshot/QRcode.png" width="200" height="200"/>

## 目标功能
 - [x] 登录、注册
 - [x] 密码找回
 - [x] 修改个人资料
 - [x] 个人信息浏览（已发布、点赞的视频）
 - [x] 上传头像
 - [x] 发送邮件验证
 - [x] 视频浏览
 - [x] 关注与粉丝
 - [x] 视频点赞、评论点赞
 - [x] 视频评论、回复评论
 - [x] 评论@用户
 - [x] 关注动态浏览
 - [x] 好友（互相关注）间私信
 - [x] 发布动态
 - [x] 搜索视频，用户（根据视频描述，根据昵称或id）
 - [x] 私信、被关注、被评论、被@、被点赞、关注人发布动态的消息提醒
 - [ ] 删除评论
 - [ ] 删除视频
 - [ ] 分享
 - [ ] [后台管理](https://github.com/asdwsx1234/vue-douyin-admin)
 
## 总结
>  不定时补充，就当写毕业论文了 :grin:

1、项目断断续续大概写了3个月，重要的功能基本已经完成，而且对vue的MVVM框架有了进一步的理解（数据和视图的分离，解耦，以数据驱动视图，只关心数据变化，DOM操作被封装），也更熟悉了vue的使用。

2、会话管理是用的koa-session2插件，通过session和cookie结合来管理会话。用户登录成功之后可以用户信息存入session中。koa-session2会将sessionId写入cookie，再把session对象写入redis，键值为sessionId，这样只要cookie没有过期，客户端的每次请求就会携带这个sessionId，在服务端就可以从redis中获取登录信息，当然也可以用作会话拦截。注销的时候只需要将ctx.session置为空对象，这样cookie就会被清掉了。

### 前端

## 部分截图
### 登录页
<img src="./screenshot/login.jpg" width="375" height="812"/>

### 注册页
<img src="./screenshot/register.jpg" width="375" height="812"/>

### 取回密码页
<img src="./screenshot/retrievePswd.jpg" width="375" height="812"/>

### 主页
<img src="./screenshot/home.jpg" width="375" height="812"/>

### 动态页
<img src="./screenshot/followed.jpg" width="375" height="812"/>
<img src="./screenshot/commentList.jpg" width="375" height="812"/>

### 消息页
<img src="./screenshot/msg.jpg" width="375" height="812"/>

### 粉丝消息页
<img src="./screenshot/msgFans.jpg" width="375" height="812"/>

### 赞消息页
<img src="./screenshot/msgLike.jpg" width="375" height="812"/>

### @我的消息页
<img src="./screenshot/msg@.jpg" width="375" height="812"/>

### 评论消息页
<img src="./screenshot/msgComment.jpg" width="375" height="812"/>
<img src="./screenshot/msgComment1.jpg" width="375" height="812"/>

### 个人资料页
<img src="./screenshot/profile.jpg" width="375" height="812"/>
<img src="./screenshot/profile2.jpg" width="375" height="812"/>
<img src="./screenshot/profile3.jpg" width="375" height="812"/>

### 修改个人资料页
<img src="./screenshot/modifyInfomation.jpg" width="375" height="812"/>

### 搜索视频页
<img src="./screenshot/searchVideo.jpg" width="375" height="812"/>

### 搜索用户页
<img src="./screenshot/searchUser.jpg" width="375" height="812"/>

### 发布动态页
<img src="./screenshot/publishVideo.jpg" width="375" height="812"/>

### 粉丝列表页
<img src="./screenshot/fanlist.jpg" width="375" height="812"/>

### 关注列表页
<img src="./screenshot/followerlist.jpg" width="375" height="812"/>

### 联系人页
<img src="./screenshot/Contact.jpg" width="375" height="812"/>

### 私聊页
<img src="./screenshot/chatWith.jpg" width="375" height="812"/>

## 目录结构
```
.
├── public
├── server                                             (服务器在这里)
│   ├── controllers                                    (各个类别的controller)
│   ├── models                                         (sequelize模型)
│   ├── static
│   │   ├── assets
│   │   │   ├── avatar                                 (静态资源头像)
│   │   │   ├── css
│   │   │   ├── fonts
│   │   │   ├── img
│   │   │   ├── js
│   │   │   ├── videoCover                             (静态资源视频封面)
│   │   │   └── videoPath                              (静态资源视频)
│   └── utils                                          (服务器util)
├── src                                                (前端项目在这里)
│   ├── base                                           (基础组件)
│   ├── common
│   │   ├── fonts                                      (iconfont)
│   │   ├── js                                         (util/config)
│   │   └── stylus
│   ├── components                                     (逻辑组件)
│   ├── store                                          (vuex)
│   └── views                                          (页面)

```

## License
[MIT](./LICENSE)
