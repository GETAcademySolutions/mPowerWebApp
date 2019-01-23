<template>
    <div class="container">
        <b-card class="g-box g-top">
            <h4 class="">Log in</h4>
            <p>Need a mPower account? <b-link router-link :to="{ name: 'Signup' }" style="color: #00b656">Create account</b-link></p>
            <error-feedback v-if="feedback" :message="feedback"></error-feedback>
            <b-form class="g-top" @submit.prevent="login">
                <b-form-group id="email" label="" label-for="email">
                    <b-form-input id="email" type="email" @change="feedback=null" v-model="email" required
                                placeholder="Email">
                    </b-form-input>
                </b-form-group>
                <b-form-group id="password" label="" label-for="pwd">
                    <b-form-input id="pwd" type="password" @change="feedback=null" v-model="password" required
                                placeholder="Password">
                    </b-form-input>
                </b-form-group>
            </b-form>
            <b-button class="g-top" @click="login()" variant="success" block>Log in</b-button>
            <p style="margin-top: 0.7em">
                <b-link @click="forgotUsername()" style="color: #00b656">Forgot username?</b-link>
                <b-link @click="forgotPassword()" style="color: #00b656">Forgot password?</b-link>
            </p>
        </b-card>
     </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'Login',
    components: {
        ErrorFeedback
    },
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
    min-width: 350px;
    max-width: 50%;
    margin-top: 2em;
}
</style>
