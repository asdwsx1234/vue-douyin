import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router)

export default new Router({
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
          path: 'video',
          component: () => import('./views/video.vue')
        },
        {
          path: 'videoAndDesc',
          component: () => import('./views/videoAndDesc.vue')
        },
        {
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
    }
  ]
})
