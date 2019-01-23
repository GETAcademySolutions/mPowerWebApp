<template>
    <div class="container g-top g-box">
        <b-card>
            <h4>Create an account</h4>
            <p class="">
                Already have an account? <router-link :to="{ name: 'Login' }" style="color: #00b656">Log in</router-link>
            </p>
            <error-feedback v-if="feedback" :message="feedback"></error-feedback>
            <b-form class="g-top" @submit.prevent="signup">
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
                    <b-form-input id="phone" type="tel"  @change="feedback = null" placeholder="Mobile phone" v-model="data.phoneNumber" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="password"Passord</label> -->
                    <b-form-input id="password"  type="password" @change="feedback = null" placeholder="Password" v-model="password" required></b-form-input>
                </b-form-group>
                <b-form-group>
                    <!-- <label for="confirmPassword"Confirm password</label> -->
                    <b-form-input id="confirmPassword"  type="password" @change="feedback = null" placeholder="Confirm password" v-model="confirmPassword" required></b-form-input>
                </b-form-group>
                <b-form-group class="g-top">
                    <b-button class="" variant="success" block @click="signup()">Sign up</b-button>
                    <!-- <b-btn v-b-modal.consent class="g-span" variant="info">Registrer</b-btn> -->
                </b-form-group>
            </b-form>
            <p>By clicking the button, you agree to<br>
                <b-link v-b-modal.consent style="color: #00b656">mPowers Policy & terms of Use</b-link>
            </p>
        </b-card>

        <keep-alive>
            <b-modal id="consent" ref="agree" size="lg" hide-footer title="Ploicy & terms of Use">
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
import ErrorFeedback from '@/components/common/ErrorFeedback'

var loadingTask = pdf.createLoadingTask('./static/PolicyAndTermsOfUse.pdf');

export default {
    components: {
        ErrorFeedback,
        pdf
    },
    name: 'Signup',
    data() {
        return {
            data: {
                slug: null,
                phoneNumber: null,
                credits: 0,
                user_id: null,
                timestamp: null
            },
            username: null,
            email: null,
            password: null,
            confirmPassword: null,
            src: loadingTask,
            numPages: 0,
            agreed: true,
            feedback: null
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
            if (!this.username || !this.email || !this.data.phoneNumber || !this.password) {
                this.feedback = 'Please fill in all fields'
                return false
            }
            if (this.password !== this.confirmPassword) {
                this.feedback = "The passwords do not match. Try agian."
                return false
            } 
            return true
        },
        validateEmail(email) {
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        signup() {
            console.log('signup...')
            if (!this.fieldsOk())
                return
            this.feedback = null
            this.data.slug = slugify(this.username, { replacement: '-', remove: /[$*_+~.()'"!\-:@]/g, lower: true })

            let user = null;

            // firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
            // .then(cred => {
            //     user = cred.user
            //     db.collection('users').add({
            //         username: this.username,
            //         alias: slug,
            //         phone: this.phone,
            //         user_id: user.uid,
            //         timestamp: Date.now()
            //     })
            //     .then(() => {
            //         console.log('signup ok')
            //         this.$router.push({ name: 'HomePage' })
            //     })
            //     .catch(error => {
            //         this.feedback = error.message
            //     })
            // })

            if (this.validateEmail(this.email)) {
                console.log('a valid email address')
            } else {
                console.log('an invalid email address')
            }
            let ref = db.collection('users').doc(this.data.slug)
            ref.get()
            .then(doc => {
                if (doc.exists) {
                    this.feedback = 'This username is already in use. Pick another.'
                } else {
                    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(cred => {
                        user = cred.user
                        this.data.user_id = user.uid
                        this.data.email = user.email
                        this.data.timestamp = Date.now()
                        return ref.set(this.data)
                    }).then(() => {
                        firebase.auth().currentUser.updateProfile({displayName: this.username, phoneNumber: this.data.phoneNumber})
                        .then(() => {
                            console.log('signup ok')
                            this.$router.push({ name: 'HomePage' })
                        })  
                        .catch(error => {
                            this.feedback = error.message
                        })
                    })
                    .catch(error => {
                        this.feedback = error.message
                    })
                }
            })
            .catch(error => {
                this.feedback = error.message
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
.g-top {
    margin-top: 2em;
}
.g-box {
    margin: auto;
    min-width: 380px;
    max-width: 50%;
    margin-top: 2em;
}
.g-span {
    margin-left: 1em;
}
</style>
