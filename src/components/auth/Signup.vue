<template>
    <div class="signup g-frame container">
        <b-card>
            <h3>Create an account</h3>
            <p class="g-group">
                Allready have an account? <router-link :to="{ name: 'Login' }" style="color: rgb(0,161,181)">Log in</router-link>
            </p>
            <b-form  @submit.prevent="signup">
                <b-form-group>
                    <!-- <label for="alias">Username</label> -->
                    <b-form-input id="username" type="text" @change="feedback = null" placeholder="Username" v-model="username" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="email">Email</label> -->
                    <b-form-input id="email" type="email"  @change="feedback = null" placeholder="Email" v-model="email" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="phone">Mobile phone</label> -->
                    <b-form-input id="phone" type="tel"  @change="feedback = null" placeholder="Mobile phone" v-model="phone" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="password"Passord</label> -->
                    <b-form-input id="password"  type="password" @change="feedback = null" placeholder="Password" v-model="password" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="confirmPassword"Confirm password</label> -->
                    <b-form-input id="confirmPassword"  type="password" @change="feedback = null" placeholder="Confirm password" v-model="confirmPassword" required></b-form-input>
                </b-form-group>
                <b-form-group class="g-m2">
                    <b-button class="" variant="success" block @click="signup()">Sign up</b-button>
                    <!-- <b-btn v-b-modal.consent class="g-span" variant="info">Registrer</b-btn> -->
                </b-form-group>
            </b-form>
            <p>By clicking the button, you agree to<br>
                <b-link v-b-modal.consent>mPowers Policy & terms of Use</b-link>
            </p>
            <!-- <p-check color="info" v-model="accepted">Jeg godtar KOMPIS sine<b-link>Vilkår for Personvern</b-link></p-check> -->

            <p v-if="feedback" class="" style="margin-top: 1em; color: red">{{ feedback }}</p>
        </b-card>

        <keep-alive>
            <b-modal id="consent" ref="agree" size="lg" hide-footer title="Vilkår for Personvern">
                <div>
                    <pdf v-for="i in numPages" :key="i" :src="src" :page="i" style="display: inline-block; width: 100%">
                        <hr>
                    </pdf>
                </div>
                <hr>
                <!-- <b-btn class="mt-3 float-right" variant="secondary" @click="agree()" style="margin-left: 1em">Jeg godtar</b-btn> -->
                <!-- <b-btn class="mt-3 float-right" variant="outline-secondary" @click="reject()">Jeg godtar ikke</b-btn> -->
            </b-modal>
        </keep-alive>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import slugify from 'slugify'
import pdf from 'vue-pdf'

var loadingTask = pdf.createLoadingTask('./static/Personvern_KOMPIS.pdf');

export default {
    components: {
        pdf
    },
    name: 'Signup',
    data() {
        return {
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            src: loadingTask,
            numPages: 0,
            agreed: true,
            feedback: ''
        }
    },
    methods: {
        reset() {
            Object.assign(this.$data, this.$options.data.call(this));
            this.feedback = null
        },
        agree() {
            this.$refs.agree.show()
            this.agreed = false
        },
        reject() {
            console.log('reject')
            this.$refs.agree.hide()
            this.numPages = 2;
        },
        fieldsOk() {
            if (!this.username || !this.email || !this.phone || !this.password) {
                this.feedback = 'Please fill in all fields'
                return false
            }
            if (this.password !== this.confirmPassword) {
                this.feedback = "The passwords does not match. Try agian."
                return false
            } 
            return true
        },
        signup() {
            console.log('signup...')
            if (!this.fieldsOk())
                return
            this.feedback = null
            let slug = slugify(this.username, { replacement: '-', remove: /[$*_+~.()'"!\-:@]/g, lower: true })

            let user = null;
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            .then(cred => {
                user = cred.user
                db.collection('users').add({
                    username: this.username,
                    alias: slug,
                    phone: this.phone,
                    user_id: user.uid,
                    timestamp: Date.now()
                })
                .then(() => {
                    console.log('signup ok')
                    this.$router.push({ name: 'HomePage' })
                })
                .catch(error => {
                    this.feedback = error.message
                })
            })
        }
    },
    mounted() {
        this.loadingTask = pdf.createLoadingTask('./static/PolicyAndTermsOfUse.pdf')
        this.src = this.loadingTask
        this.src.then(pdf => {
            this.numPages = pdf.numPages
        })
    }
}
</script>

<style scoped>
.g-frame {
    margin-top: 2em;
    min-width: 400px;
    max-width: 480px;
    height: 480px;
    align-self: center; 
}
.g-m2 {
    margin-top: 1.5em;
}
.g-span {
    margin-left: 1em;
}
</style>
