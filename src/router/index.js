import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import StartPage from '@/components/startpage/StartPage'
import Map from '@/components/map/Map'
import Login from '@/components/auth/Login'
import Signup from '@/components/auth/Signup'
import HomePage from '@/components/home/HomePage'
import BuyCredit from '@/components/credits/BuyCredit'
import Charge from '@/components/charging/Charge'
import ChargePort from '@/components/charging/ChargePort'
import ChargeConnect from '@/components/charging/ChargeConnect'
import History from '@/components/log/History'
import Profile from '@/components/Profile/Profile'
import ProfileView from '@/components/Profile/ProfileView'

Vue.use(Router)

const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
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
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/signup',
            name: 'Signup',
            component: Signup
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
            path: '/credits',
            name: 'BuyCredit',
            component: BuyCredit,
            props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/charge',
            name: 'Charge',
            component: Charge,
            // props: true
        },
        {
            path: '/chargeport',
            name: 'ChargePort',
            component: ChargePort,
            // props: true
        },
        {
            path: '/chargeconnect',
            name: 'ChargeConnect',
            component: ChargeConnect,
            // props: true
        },
        {
            path: '/history',
            name: 'History',
            component: History,
            // props: true
        },
        {
            path: '/profileedit',
            name: 'Profile',
            component: Profile,
            // props: true,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/profile',
            name: 'ProfileView',
            component: ProfileView,
            // props: true,
            meta: {
                requiresAuth: true
            }
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
