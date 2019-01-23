<template>
    <div>
        <b-navbar toggleable="md" style="padding-left: 2em; padding-right: 2em">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand router-link :to="{ name: 'HomePage' }" href="#" style="color: #00b656; font-style: italic">mPower</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                    <!-- <b-nav-item v-if="user" router-link :to="{ name: 'Charge' }">Charge</b-nav-item>
                    <b-nav-item v-if="user" router-link :to="{ name: 'PracticeCertificateView' }">Kiosk map</b-nav-item>
                    <b-nav-item v-if="user" href="#">How it works</b-nav-item>
                    <b-nav-item v-if="user" href="#">Pricing</b-nav-item> -->
                    <b-nav-item router-link :to="{ name: 'Charge' }">Charge</b-nav-item>
                    <b-nav-item router-link :to="{ name: 'Map' }">Kiosk map</b-nav-item>
                    <b-nav-item href="#">How it works</b-nav-item>
                    <b-nav-item href="#">Pricing</b-nav-item>
                    <b-dropdown-divider v-if="user" ></b-dropdown-divider>
                    <b-nav-item v-if="user" router-link :to="{ name: 'ProfileView' }">My Profile</b-nav-item>
                    <b-nav-item v-if="user" router-link :to="{ name: 'BuyCredit' }">Buy Credits</b-nav-item>
                    <b-nav-item v-if="user" router-link :to="{ name: 'History' }">History</b-nav-item>

                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-form>
                        <!-- <b-button v-if="!user" block size="sm" class="g-span" variant="success" router-link :to="{ name: 'Login' }">Log in</b-button>
                        <b-button v-if="!user" block size="sm" class="g-span" variant="success" router-link :to="{ name: 'Signup' }">Sign up</b-button> -->
                        <b-button v-if="!user" block size="sm" class="my-2 my-sm-0 g-span" variant="success" router-link :to="{ name: 'Login' }">Log in</b-button>
                        <b-button v-if="!user" block size="sm" class="my-2 my-sm-0 g-span" variant="success" router-link :to="{ name: 'Signup' }">Sign up</b-button>
                    </b-nav-form>
                    <b-nav-item v-if="user" @click="logout()">Log out</b-nav-item>

                    <!-- <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown> -->

                    <!-- <b-nav-item-dropdown v-if="user" right > 
                        <template slot="button-content">
                            <em>{{ this.user.email }}</em>
                        </template>
                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#" @click="logout()">Signout</b-dropdown-item>
                    </b-nav-item-dropdown> -->
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Navbar',
    data() {
        return {
            user: null,
            windowWidth: 0,
        }
    },
    computed: {
        isMobile() {
            // an assumption
            if ( screen.width <= 480 ) {
                return true
            }
            return false
        },
        isSmallScreen() {
            return this.windowWidth <= 480
        },
        isLoggedIn() {
            // console.log('isLoggedIn', this.user)
            return (this.user != null)
        }
    },
    methods: {
        logout: function () {
            console.log('logging out...')
            firebase.auth().signOut()
            .then(() => {
                this.$router.push({ name: 'StartPage' })
            })
        },
        showProfile: function () {
            console.log('show profile')
        }
    },
    created() {      
        firebase.auth().onAuthStateChanged((user) => {
            // console.log('onAuthStateChanged', user)
            this.user = user;
            if (!this.user) {
                this.$router.push({ name: 'StartPage' })
            }
        })
    }
}
</script>

<style>
.g-card {
    min-width: 360px;
    max-width: 500px;
    width: 50%;
    margin: auto;
}
.g-box {
    margin: auto;
    min-width: 360px;
    max-width: 480px;
}
.g--card {
    border: none;
    /* border-top: none;
    border-left: none;
    border-right: none; */
    margin: 0;
    padding: 0;
}
.g-mt {
    margin-top: 1em;
}
h1,h2,h3,h4,h5,h6,p {
    font-family:  Verdana, Geneva, Tahoma, sans-serif;
}
.g-top {
    margin-top: 2.5em;
}
a {
    color: rgb(0,161,181);
    font-weight: 400;
}
a:hover {
    color: rgb(0,161,181);
    font-weight: 400;
}
.g-link {
    color: rgb(0,161,181);
    font-weight: 400;
}
.g-link:hover {
    color: rgb(0,161,181);
    font-weight: 400;
}
.g-group {
    margin-top: 1em;
}
.g-span {
    margin-right: 1em;
    width: 5em;
}
.end-page {
    margin-bottom: 3em;
}
.g-bottom {
    margin-bottom: 2em;
}
.g-size {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
}
.g-box {
    margin: auto;
    min-width: 480px;
    max-width: 480px;
    margin-top: 2em;
}
</style>
