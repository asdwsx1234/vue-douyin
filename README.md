#低仿抖音短视频
------
临近毕业，选了*《微视频社交网站的开发》*这个题作为毕业设计，然后就照着**[抖音](https://www.douyin.com/)**打算用自己自学的知识（前端方向）来实现一遍。该项目基本使用JavaScript（ES6/7）开发，混入了Python写的爬虫来爬取**[梨视频](https://www.pearvideo.com/)**的短视频来丰满自己的数据库。

**注：本项目仅供学习交流使用，切勿用于商业用途，如有侵犯第三方版权问题及时联系我**

##前端技术栈
 - Axios
 - Vue2
 - Vuex
 - Vue Router
 - Vue CLI 3
 - Vue-socket.io
 - Stylus
##后端技术栈
 - koa2
 - sequelize
 - ioredis
 - socket.io

##项目运行
**注意：由于涉及大量的 ES6/7 等新属性，node 需要 6.0 以上版本**

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

##说明
>  如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ :grin:

##效果演示
[查看demo请戳这里](http://www.zhoubaba.club)（请用chrome手机模式预览）
**移动端扫描下方二维码**

<img src="" width="250" height="250"/>

##目标功能
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
 - [ ] 分享
 - [ ] 后台管理
##总结
>  不定时补充，就当写毕业论文了 :grin:

1、

## 部分截图
### 登录页
<img src="" width="250" height="250"/>
### 注册页
<img src="" width="250" height="250"/>
### 取回密码页
<img src="" width="250" height="250"/>
### 主页
<img src="" width="250" height="250"/>
### 动态页
<img src="" width="250" height="250"/>
### 消息页
<img src="" width="250" height="250"/>
### 粉丝消息页
<img src="" width="250" height="250"/>
### 赞消息页
<img src="" width="250" height="250"/>
### @我的消息页
<img src="" width="250" height="250"/>
### 评论消息页
<img src="" width="250" height="250"/>
### 个人资料页
<img src="" width="250" height="250"/>
### 修改个人资料页
<img src="" width="250" height="250"/>
### 搜索视频页
<img src="" width="250" height="250"/>
### 搜索用户页
<img src="" width="250" height="250"/>

###目录结构
```
.
├── README.md
├── babel.config.js
├── dump.rdb
├── package-lock.json
├── package.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   └── index.html
├── server
│   ├── Store.js
│   ├── app.js
│   ├── config.js
│   ├── controller.js
│   ├── controllers
│   │   ├── index.js
│   │   ├── test.js
│   │   ├── user.js
│   │   └── video.js
│   ├── db.js
│   ├── init-db.js
│   ├── model.js
│   ├── models
│   │   ├── AtUser.js
│   │   ├── CommentInfo.js
│   │   ├── LikeInfo.js
│   │   ├── PrivateLetter.js
│   │   ├── ShareInfo.js
│   │   ├── UserInfo.js
│   │   ├── UserRegister.js
│   │   ├── UserRelation.js
│   │   ├── VideoInfo.js
│   │   └── WatchInfo.js
│   ├── redis.js
│   ├── rest.js
│   ├── static
│   │   ├── assets
│   │   │   ├── avatar
│   │   │   │   ├── default.png
│   │   │   │   └── f5840d3a-f668-4da7-b24d-2d945bb9354d.png
│   │   │   ├── css
│   │   │   │   ├── app.fe807076.css
│   │   │   │   ├── chunk-16732778.6ee186fb.css
│   │   │   │   ├── chunk-17236c33.76901edf.css
│   │   │   │   ├── chunk-333c4bdf.401d13ca.css
│   │   │   │   ├── chunk-35139864.de4d88c1.css
│   │   │   │   ├── chunk-37724660.f3943024.css
│   │   │   │   ├── chunk-58b5b620.23bfe588.css
│   │   │   │   ├── chunk-5a336464.383681ce.css
│   │   │   │   ├── chunk-708d9602.740a589b.css
│   │   │   │   ├── chunk-826275ae.3b2bc3ae.css
│   │   │   │   ├── chunk-903230d8.9e903249.css
│   │   │   │   ├── chunk-9b041398.9b3b6e2f.css
│   │   │   │   ├── chunk-b8cebac4.3fdeae11.css
│   │   │   │   ├── chunk-ed831976.93a4b5ac.css
│   │   │   │   └── chunk-f23e4304.3c8d356e.css
│   │   │   ├── favicon.ico
│   │   │   ├── fonts
│   │   │   │   ├── iconfont.24db4a73.ttf
│   │   │   │   └── iconfont.c7ce54f8.eot
│   │   │   ├── img
│   │   │   │   ├── 1.a9b784ef.jpg
│   │   │   │   ├── iconfont.0b144f4b.svg
│   │   │   │   └── logo.82b9c7a5.png
│   │   │   ├── js
│   │   │   │   ├── app.5dbb627e.js
│   │   │   │   ├── chunk-16732778.147ace44.js
│   │   │   │   ├── chunk-17236c33.ad601b09.js
│   │   │   │   ├── chunk-333c4bdf.a7df8e6c.js
│   │   │   │   ├── chunk-35139864.9590e581.js
│   │   │   │   ├── chunk-37724660.8a3e7ee1.js
│   │   │   │   ├── chunk-58b5b620.a4c1b6f9.js
│   │   │   │   ├── chunk-5a336464.39aea61b.js
│   │   │   │   ├── chunk-708d9602.4ccd8cea.js
│   │   │   │   ├── chunk-826275ae.095b936f.js
│   │   │   │   ├── chunk-903230d8.8aaaed2d.js
│   │   │   │   ├── chunk-9b041398.05211648.js
│   │   │   │   ├── chunk-b8cebac4.57ed5304.js
│   │   │   │   ├── chunk-ed831976.2cbb4cee.js
│   │   │   │   ├── chunk-f23e4304.0d50caec.js
│   │   │   │   └── chunk-vendors.779f5ebc.js
│   │   │   ├── videoCover
│   │   │   └── videoPath
│   │   └── index.html
│   ├── staticFiles.js
│   └── utils
│       ├── backup.sql
│       ├── crawler.py
│       ├── nodemailer.js
│       └── utils.js
├── src
│   ├── App.vue
│   ├── base
│   │   ├── CodeInput
│   │   │   └── CodeInput.vue
│   │   ├── NoMore
│   │   │   └── NoMore.vue
│   │   ├── Tip
│   │   │   └── Tip.vue
│   │   ├── VideoItem
│   │   │   └── VideoItem.vue
│   │   ├── confirm
│   │   │   └── confirm.vue
│   │   ├── listview
│   │   │   └── listview.vue
│   │   ├── loading
│   │   │   └── loading.vue
│   │   ├── myList
│   │   │   └── myList.vue
│   │   ├── scroll
│   │   │   └── scroll.vue
│   │   ├── searchBar
│   │   │   └── searchBar.vue
│   │   ├── searchList
│   │   │   └── searchList.vue
│   │   ├── searchUserList
│   │   │   └── searchUserList.vue
│   │   ├── searchVideoList
│   │   │   └── searchVideoList.vue
│   │   └── swipeout
│   │       ├── index.js
│   │       ├── swipeout-button.vue
│   │       ├── swipeout-item.vue
│   │       └── swipeout.vue
│   ├── common
│   │   ├── fonts
│   │   │   ├── iconfont.eot
│   │   │   ├── iconfont.svg
│   │   │   ├── iconfont.ttf
│   │   │   └── iconfont.woff
│   │   ├── js
│   │   │   ├── config.js
│   │   │   ├── dom.js
│   │   │   ├── pinyin.js
│   │   │   └── util.js
│   │   └── stylus
│   │       ├── base.styl
│   │       ├── iconfont.styl
│   │       ├── index.styl
│   │       ├── reset.styl
│   │       └── variable.styl
│   ├── components
│   │   ├── AtList
│   │   │   └── AtList.vue
│   │   ├── AvatarCropper
│   │   │   └── AvatarCropper.vue
│   │   ├── CommentList
│   │   │   └── CommentList.vue
│   │   ├── FollowedList
│   │   │   └── FollowedList.vue
│   │   ├── HomeTab
│   │   │   └── HomeTab.vue
│   │   ├── Login
│   │   │   └── Login.vue
│   │   ├── MeTab
│   │   │   └── MeTab.vue
│   │   ├── ModifyInfomation
│   │   │   └── ModifyInfomation.vue
│   │   ├── MsgList
│   │   │   └── MsgList.vue
│   │   ├── MsgTab
│   │   │   └── MsgTab.vue
│   │   ├── MyHeader
│   │   │   └── MyHeader.vue
│   │   ├── MyVideo
│   │   │   └── MyVideo.vue
│   │   ├── PlayList
│   │   │   └── PlayList.vue
│   │   ├── Profile
│   │   │   ├── 1.jpg
│   │   │   └── Profile.vue
│   │   ├── Register
│   │   │   └── Register.vue
│   │   ├── RetrievePassword
│   │   │   └── RetrievePassword.vue
│   │   └── VideoList
│   │       └── VideoList.vue
│   ├── main.js
│   ├── router.js
│   ├── store
│   │   ├── actions.js
│   │   ├── getter.js
│   │   ├── index.js
│   │   ├── mutation-types.js
│   │   ├── mutations.js
│   │   └── state.js
│   └── views
│       ├── 1.jpg
│       ├── 2.jpg
│       ├── ChatWith.vue
│       ├── Contact.vue
│       ├── FanList.vue
│       ├── Followed.vue
│       ├── Home.vue
│       ├── InterestList.vue
│       ├── Me.vue
│       ├── Message.vue
│       ├── MessageAt.vue
│       ├── MessageComment.vue
│       ├── MessageFan.vue
│       ├── MessageLike.vue
│       ├── Search.vue
│       ├── UploadVideo.vue
│       ├── likes.vue
│       ├── video.vue
│       └── videoAndDesc.vue
└── vue.config.js

54 directories, 153 files
```
