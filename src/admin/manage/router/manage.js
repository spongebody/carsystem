import Vue from 'vue'
import Router from 'vue-router'

// 懒加载路由
const Manage = () => import('../views/Manage')
const Login = () => import('../views/Login')
// const Register = () => import('../views/Register')

Vue.use(Router)

let routerOpt = {
  mode: 'history',
  base: `/${buildConfig.publicPath}/manage`,
  routes: [
    {
      path: '/',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
    /*    {
      path: '/register',
      name: 'Register',
      component: Register
    } */
  ]
}

// 获取本地存储的异步路由
let routesList = localStorage.getItem('asyncRoute')
try {
  routesList = JSON.parse(routesList)
  if (!Array.isArray(routesList)) {
    routesList = []
  }
} catch (e) {
  routesList = []
}

routesList.forEach(function (item, index) {
  item.component = () => import(`../views/${item.componentPath}`)
})

routerOpt.routes = routerOpt.routes.concat(routesList)

let routers = new Router(routerOpt)

export default routers
