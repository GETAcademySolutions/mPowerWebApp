<template>
<div class="container text-center">
        <h4 class="g-top">Charge any <br>device on the go</h4>
        <br>
        <b-button variant="success" @click="signup()">Sign up</b-button>
        <br>
        <p class="g-sec">Got a code? <b-link class="g-link">Redeem One time Charging</b-link></p>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'StartPage',
    data() {
        return {
            user: null
        }
    },
    methods: {
        login() {
            this.$router.push({name: 'Login'})
        },
        signup() {
            this.$router.push({name: 'Signup'})
        }
    },
    mounted() {
        this.user = firebase.auth().currentUser
        if (this.user) {
            this.$router.push({ name: 'HomePage' })
        }
    }
}
</script>

<style>
.g-top {
    margin-top: 2em;
}
.g-link {
    color: #00b656;
    font-weight: 500;
}
.g-link:hover {
    color: #00b656;
    font-weight: 500;
}
.g-sec {
    margin-top: 1em;
}
</style>
