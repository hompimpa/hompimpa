import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Room from './views/Room.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/room',
      name: 'room',
      component: Room
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
