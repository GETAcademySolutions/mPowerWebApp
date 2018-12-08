<template>
    <div class="container">
        <b-card class="g-box g-top">
            <h4 class="">Log in</h4>
            <p>Need a mPower account? <b-link router-link :to="{ name: 'Signup' }" style="color: green">Create account</b-link></p>
            <!-- <label for="email">Email:</label>
            <b-form-input id="email" v-model.trim="email" type="email"> </b-form-input>
            <label for="password">Password:</label>
            <b-form-input id="password" v-model.trim="password" type="password"> </b-form-input> -->

            <b-form class="g-top" @submit.prevent="login">
                <b-form-group id="email" label="" label-for="email">
                    <b-form-input id="email" type="email" v-model="email" required
                                placeholder="Email">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="password" label="" label-for="pwd">
                    <b-form-input id="pwd" type="password" v-model="password" required
                                placeholder="Password">
                    </b-form-input>
                </b-form-group>
            </b-form>
            <b-button class="g-top" @click="login()" variant="success" block>Log in</b-button>
            <p style="margin-top: 0.7em">
                <b-link @click="forgotUsername()" style="color: green">Forgot username?</b-link>
                <b-link @click="forgotPassword()" style="color: green">Forgot password?</b-link>
            </p>
        </b-card>
     </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'

export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            feedback: '',
            show: true
        }
    },
    methods: {
        reset() {
            console.log('reset..')
            this.feedback = null
        },
        login(){
            if (this.email && this.password) {
                this.feedback = null
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    console.log(user)
                    this.$router.push({ name: 'HomePage' })
                }).catch(error => {
                    this.feedback = error.message
                })
            } else {
                this.feedback = 'Please fill in both fields.'
            }
        },
        signup() {
            this.$router.push({ name: 'Signup' })
        }
    }
}
</script>

<style>
.g-top {
    margin-top: 2em;
}
.g-box {
    margin: auto;
    max-width: 50%;
    margin-top: 2em;
}
</style>
