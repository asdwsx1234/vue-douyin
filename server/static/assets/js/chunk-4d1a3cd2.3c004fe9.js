(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4d1a3cd2"],{9793:function(t,e,r){},b8fa:function(t,e,r){"use strict";r.r(e);var c=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"contact-wrap"},[r("my-header",{attrs:{title:"选择联系人",hasBack:!0,goBack:t.goBack}}),r("list-view",{attrs:{data:t.groups,list:t.list},on:{select:t.chooseUser}})],1)},a=[],n=(r("8e6e"),r("456d"),r("bd86")),o=(r("55dd"),r("4917"),r("ac6a"),r("4980")),i=r("2f22"),s=r("2f62"),u=r("d217");function f(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(t);e&&(c=c.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,c)}return r}function p(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?f(Object(r),!0).forEach((function(e){Object(n["a"])(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var l={created:function(){var t=this;this.$axios.get("/api/user/".concat(this.loginInfo.userId,"/getContact")).then((function(e){t.list=e.data.data,t.groups=t._normalizeContact(e.data.data)}))},data:function(){return{groups:[],list:[]}},methods:{goBack:function(){this.$router.push("/message")},chooseUser:function(t){this.$router.push("/profile/".concat(t.userId))},_normalizeContact:function(t){var e={character:{title:"#",items:[]}};t.forEach((function(t,r){var c=Object(u["b"])(t.userNickname).toUpperCase();c.match(/[a-zA-Z]/)?e[c]||(e[c]={title:c,items:[]}):c="character",e[c].items.push(t)}));var r=[],c=[];for(var a in e){var n=e[a];n.title.match(/[a-zA-Z]/)?c.push(n):"#"===n.title&&r.push(n)}return c.sort((function(t,e){return t.title.charCodeAt(0)-e.title.charCodeAt(0)})),c=[{title:"#search"}].concat(c),c.concat(r)}},computed:p({},Object(s["c"])(["loginInfo"])),components:{MyHeader:o["a"],ListView:i["a"]}},h=l,d=(r("fdff"),r("2877")),b=Object(d["a"])(h,c,a,!1,null,"0c905043",null);e["default"]=b.exports},fdff:function(t,e,r){"use strict";var c=r("9793"),a=r.n(c);a.a}}]);