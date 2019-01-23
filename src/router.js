import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'
Vue.use(Router)
let router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: ':id',
          component: Home
        }
      ]
    },
    {
      path: '/uploadVideo',
      name: 'uploadVideo',
      component: () => import('./views/UploadVideo.vue')
    },
    {
      path: '/followed',
      name: 'followed',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('./views/Followed.vue')
    },
    {
      name: 'message',
      path: '/message',
      component: () => import('./views/Message.vue'),
      children: [
        {
          path: 'fan',
          component: () => import('./views/MessageFan.vue')
        },
        {
          path: 'like',
          component: () => import('./views/MessageLike.vue')
        },
        {
          path: 'at',
          component: () => import('./views/MessageAt.vue')
        },
        {
          path: 'comment',
          component: () => import('./views/MessageComment.vue')
        }
      ]
    },
    {
      name: 'profile',
      path: '/profile/:id',
      component: () => import('./views/Me.vue'),
      redirect: '/profile/:id/video',
      children: [
        {
          name: 'profile/video',
          path: 'video',
          component: () => import('./views/video.vue')
        },
        {
          name: 'profile/videoDesc',
          path: 'videoAndDesc',
          component: () => import('./views/videoAndDesc.vue')
        },
        {
          name: 'profile/likes',
          path: 'likes',
          component: () => import('./views/likes.vue')
        }
      ]
    },
    {
      name: 'InterestList',
      path: '/InterestList/:id',
      component: () => import('./views/InterestList.vue')
    },
    {
      name: 'FanList',
      path: '/FanList/:id',
      component: () => import('./views/FanList.vue')
    },
    {
      path: '/contact',
      component: () => import('./views/Contact.vue')
    },
    {
      name: 'chatwith',
      path: '/ChatWith/:id',
      component: () => import('./views/ChatWith.vue')
    },
    {
      path: '/search/',
      component: () => import('./views/Search.vue'),
      redirect: '/search/video',
      children: [
        {
          name: 'search/video',
          path: 'video',
          component: () => import('./base/searchVideoList/searchVideoList.vue')
        },
        {
          name: 'search/user',
          path: 'user',
          component: () => import('./base/searchUserList/searchUserList.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (!store.state.isLogged && to.path !== '/home') {
    next({ path: '/home' })
  } else {
    next()
  }
})

export default router
