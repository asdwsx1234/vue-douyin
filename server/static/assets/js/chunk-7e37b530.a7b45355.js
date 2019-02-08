(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7e37b530"],{"0b40":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"right"}},[i("div",{staticClass:"upload-video-wrap"},[i("tip",{ref:"tip"}),i("confirm",{ref:"confirm",attrs:{text:"是否发布动态"},on:{confirm:e.confirm,cancel:e.cancel}}),i("my-header",{attrs:{title:"发布动态",hasBack:!0,goBack:e.goBack}}),i("div",{staticClass:"content"},[i("div",{staticClass:"video-wrap"},[i("video",{ref:"video",staticClass:"video",attrs:{src:"","x5-playsinline":"",playsinline:"","webkit-playsinline":"",preload:"auto"},on:{click:e.playHandler}}),i("p",{directives:[{name:"show",rawName:"v-show",value:!e.videoUrl,expression:"!videoUrl"}],staticClass:"video-guide"},[e._v("点击上传或者在下方输入url,推荐使用url")]),i("input",{directives:[{name:"show",rawName:"v-show",value:!e.videoUrl,expression:"!videoUrl"}],staticClass:"video-input",attrs:{type:"file",id:"file",accept:"video/*"},on:{change:e.change}})]),i("div",{staticClass:"content-item"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.videoUrl,expression:"videoUrl"}],staticClass:"input",attrs:{placeholder:"请输入视频链接（如本地上传可不填）",type:"text"},domProps:{value:e.videoUrl},on:{blur:e.inputBlur,input:function(t){t.target.composing||(e.videoUrl=t.target.value)}}})]),i("div",{directives:[{name:"show",rawName:"v-show",value:!e.isLocalVideoFile,expression:"!isLocalVideoFile"}],staticClass:"content-item"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.coverUrl,expression:"coverUrl"}],staticClass:"input",attrs:{placeholder:"请输入封面链接（如本地上传默认第一帧）",type:"text"},domProps:{value:e.coverUrl},on:{blur:e.inputBlur,input:function(t){t.target.composing||(e.coverUrl=t.target.value)}}})]),i("div",{staticClass:"content-item"},[i("textarea",{directives:[{name:"model",rawName:"v-model",value:e.videoDesc,expression:"videoDesc"}],staticClass:"input",attrs:{placeholder:"请输入视频描述",rows:"10",cols:"30"},domProps:{value:e.videoDesc},on:{blur:e.inputBlur,input:function(t){t.target.composing||(e.videoDesc=t.target.value)}}})]),i("div",{staticClass:"content-item"},[i("div",{staticClass:"btn",on:{click:e.preview}},[e._v("预览")]),i("div",{staticClass:"btn",on:{click:e.upload}},[e._v("发布")])])])],1)])},o=[],a=(i("96cf"),i("1da1")),n=(i("f559"),i("be94")),r=i("4980"),c=i("1a93"),l=i("41ea"),d=i("8b55"),v=i("2f62"),u={activated:function(){this.$refs.video.src="",this.videoUrl="",this.videoDesc="",this.coverUrl=""},data:function(){return{videoUrl:"",videoDesc:"",coverUrl:""}},computed:Object(n["a"])({isLocalVideoFile:function(){return!!this.videoUrl.startsWith("blob:")}},Object(v["c"])(["loginInfo"])),methods:{setSrcAndCaptureImage:function(){var e=this,t=this.$refs.video;function i(){if(t.play(),e.isLocalVideoFile){var s=1,o=document.createElement("canvas");o.width=t.videoWidth*s,o.height=t.videoHeight*s,o.getContext("2d").drawImage(t,0,0,o.width,o.height),e.coverUrl=o.toDataURL("image/png"),t.removeEventListener("loadeddata",i)}}t.src=this.videoUrl,t.addEventListener("loadeddata",i)},change:function(e){var t=e.target.files||e.dataTransfer.files;t.length&&(this.realVideo=t[0],this.videoUrl=this.getObjectURL(this.realVideo),this.setSrcAndCaptureImage())},getObjectURL:function(e){var t=null;return void 0!==window.createObjectURL?t=window.createObjectURL(e):void 0!==window.URL?t=window.URL.createObjectURL(e):void 0!==window.webkitURL&&(t=window.webkitURL.createObjectURL(e)),t},playHandler:function(){if(this.isLocalVideoFile||d["h"].test(this.videoUrl)){var e=this.$refs.video;e.src!==this.videoUrl&&(e.src=this.videoUrl),e.paused?e.play():e.pause()}},goBack:function(){this.$router.back()},preview:function(){this.isLocalVideoFile||d["h"].test(this.videoUrl)?this.setSrcAndCaptureImage():this.$refs.tip.show("请输入有效url")},upload:function(){this.isLocalVideoFile||d["h"].test(this.videoUrl)&&d["f"].test(this.coverUrl)?this.videoDesc.trim()&&this.videoDesc.length<200?this.$refs.confirm.show():this.$refs.tip.show("请输入有效描述"):this.$refs.tip.show("请输入有效url")},confirm:function(){var e=Object(a["a"])(regeneratorRuntime.mark(function e(){var t,i,s,o,a,n,r,c;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!this.isLocalVideoFile){e.next=19;break}return t=new FormData,t.append("videoPath",this.realVideo),e.next=5,this.$axios.post("/api/user/uploadFile",t);case 5:if(i=e.sent,200!==i.status){e.next=17;break}return s=i.data.filename,o=s.substr(0,s.indexOf(".")),e.next=11,this.$axios.post("/api/user/".concat(this.loginInfo.userId,"/uploadVideoCover"),{videoId:o,videoCover:this.coverUrl});case 11:if(a=e.sent,200!==a.status){e.next=17;break}return e.next=15,this.$axios.post("/api/user/".concat(this.loginInfo.userId,"/publishVideo"),{videoId:o,videoCover:"".concat(l["a"],"/assets/videoCover/").concat(o,".jpg"),videoPath:"".concat(l["a"],"/assets/videoPath/").concat(o,".").concat(s.substr(s.indexOf(".")+1)),videoDesc:this.videoDesc});case 15:n=e.sent,200===n.status?(this.$socket.emit("publishVideo",{fromUserId:this.loginInfo.userId}),this.$router.push("/profile/me/video")):this.$refs.tip.show("发布失败");case 17:e.next=24;break;case 19:return r={videoId:void 0,videoCover:this.coverUrl,videoPath:this.videoUrl,videoDesc:this.videoDesc},e.next=22,this.$axios.post("/api/user/".concat(this.loginInfo.userId,"/publishVideo"),r);case 22:c=e.sent,200===c.status?(this.$socket.emit("publishVideo",{fromUserId:this.loginInfo.userId}),this.$router.push("/profile/me/video")):this.$refs.tip.show("发布失败");case 24:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),cancel:function(){},inputBlur:function(){window.scroll(0,0)}},components:{MyHeader:r["a"],Confirm:c["a"]}},h=u,p=(i("0c6b"),i("2877")),f=Object(p["a"])(h,s,o,!1,null,"c4a00d30",null);f.options.__file="UploadVideo.vue";t["default"]=f.exports},"0c6b":function(e,t,i){"use strict";var s=i("85a3"),o=i.n(s);o.a},"1a93":function(e,t,i){"use strict";var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("transition",{attrs:{name:"confirm-fade"}},[i("div",{directives:[{name:"show",rawName:"v-show",value:e.showFlag,expression:"showFlag"}],staticClass:"confirm",on:{click:function(e){e.stopPropagation()}}},[i("div",{staticClass:"confirm-wrapper"},[i("div",{staticClass:"confirm-content"},[i("p",{staticClass:"text"},[e._v(e._s(e.text))]),i("div",{staticClass:"operate"},[i("div",{staticClass:"operate-btn left",on:{click:e.cancel}},[e._v(e._s(e.cancelBtnText))]),i("div",{staticClass:"operate-btn",on:{click:e.confirm}},[e._v(e._s(e.confirmBtnText))])])])])])])},o=[],a={props:{text:{type:String,default:""},confirmBtnText:{type:String,default:"确定"},cancelBtnText:{type:String,default:"取消"}},data:function(){return{showFlag:!1}},methods:{show:function(){this.showFlag=!0},hide:function(){this.showFlag=!1},cancel:function(){this.hide(),this.$emit("cancel")},confirm:function(){this.hide(),this.$emit("confirm")}}},n=a,r=(i("4a16"),i("2877")),c=Object(r["a"])(n,s,o,!1,null,"74f52f4c",null);c.options.__file="confirm.vue";t["a"]=c.exports},"4a16":function(e,t,i){"use strict";var s=i("a1cb"),o=i.n(s);o.a},"85a3":function(e,t,i){},a1cb:function(e,t,i){},f559:function(e,t,i){"use strict";var s=i("5ca1"),o=i("9def"),a=i("d2c8"),n="startsWith",r=""[n];s(s.P+s.F*i("5147")(n),"String",{startsWith:function(e){var t=a(this,e,n),i=o(Math.min(arguments.length>1?arguments[1]:void 0,t.length)),s=String(e);return r?r.call(t,s,i):t.slice(i,i+s.length)===s}})}}]);