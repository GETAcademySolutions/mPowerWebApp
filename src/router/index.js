import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import HelloWorld from '@/components/HelloWorld'
import StartPage from '@/components/startpage/StartPage'
import Map from '@/components/map/Map'
import HomePage from '@/components/home/HomePage'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'

Vue.use(Router)

const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/hello',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/',
            name: 'StartPage',
            component: StartPage,
        },
        {
            path: '/map',
            name: 'Map',
            component: Map
        },
        {
            path: '/home',
            name: 'HomePage',
            component: HomePage,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
        }
    ]
})

router.replace({ path: '*', redirect: '/' })

// router guards
router.beforeEach((to, from, next) => {
    // console.log('beforeEach', to, from, next)
    // check to see if route has auth guard
    if (to.matched.some(rec => rec.meta.requiresAuth)) {
        // check auth state of user
        let user = firebase.auth().currentUser
        if (user) {
            // User is signed in. Proceed to route
            next()
        } else {
            // No user is signed in. Redirect to login
            next({
                name: 'StartPage'
            })
        }
    } else {
        // if route is not guarded by auth, proceed
        next()
    }
})

export default router
