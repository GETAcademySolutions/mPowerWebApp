<template>
    <div class="container">
        <b-card class="g-box" style="border: none">
            <div class="text-center" style="margin-top: 2em">
                <h4 v-if="user">Hi, {{ user.displayName  }}</h4>
                <p v-if="profile && checkCredits()">My Credits: {{ profile.credits }}</p>
                <p v-else>You don't have any credits. <b-link style="color: green">Load mPower account?</b-link></p>
            </div>

            <!-- list active charges -->
            <charging-list :charges="charges" :message="message"></charging-list>

            <error-feedback v-if="feedback" class="g-box" :message="feedback"></error-feedback>

            <charge-with-credits v-on:startChargeWithCredits="startChargeWithCredits()"></charge-with-credits>
            <charge-with-code v-on:startChargeWithCode="startChargeWithCode()"></charge-with-code>

            <div style="margin-bottom: 2em"></div>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ChargingList from '@/components/charging/ChargingList'
import ChargeWithCredits from '@/components/charging/ChargeWithCredits'
import ChargeWithCode from '@/components/charging/ChargeWithCode'
import {Charging, ChargingTimer} from '@/classes/charging.js'
import ErrorFeedback from '@/components/common/ErrorFeedback'
// import controller from '@/bluetooth/controller.js'

export default {
    name: 'HomePage',
    components: {
        ChargingList,
        ChargeWithCredits,
        ChargeWithCode,
        ErrorFeedback
    },
    data() {
        return {
            user: null,
            slug: null,
            profile: null,
            email: null,
            charges: [],
            message: null,
            feedback: null,
            fontsize: '40px'
        }
    },
    computed: {

    },
    methods: {
        checkCredits() {
            if (this.profile && this.profile.credits > 0)
                return true
            return false
        },
        onBleDisconnected(event) {
            console.log('Ble disconnected!!')
        },
        onBleNotification(event) {
            console.log('Ble notification!!')
        },
        connectToBluetooth() {
            if (!this.$controller.isConnected) {
                console.log("Start charging controller = ", this.$controller);
                let controllerName 
                this.$controller.connect()
                .then((name) => {
                    controllerName = name
                    console.log('Connected to mPower')
                    return true
                })
                .catch((error) => {
                    console.log('Connect failed', error)
                    alert(error)
                    return false
                })
            }
            return true
        },
        startChargeWithCredits() {
            console.log('startChargeWithCredits')
            if (this.profile.credits < 0) {
                //TODO: add timer to message
                this.feedback = "Sorry, no credits left in your account"
                return
            }
            if (this.connectToBluetooth()) {
                this.$router.push({name: 'Charge'})
            } else {
                //TODO: error; do not contineue
                this.$router.push({name: 'Charge'})
            }
        },
        startChargeWithCode() {
            console.log('startChargeWithCode')
        },
        removeCharging(id) {
            if (id) {
                db.collection('charges').doc(id).update({
                    stopTime: Date.now(), timeLeft: null
                })
                .then(() => {
                    console.log("charging successfuølly updated", id);
                }).catch(error => {
                    console.error("updating charge failed", id, error);
                    alert(error)
                })
            }
            let ix = this.charges.findIndex(e => e.id === id)
            if (~ix) {
                this.charges.splice(ix, 1)
            }
        },
        getCharges() {
            db.collection('charges').where('user_id', '==', this.user.uid)
            .where('timeLeft', '>', 0)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let charging = doc.data
                    charging.id = doc.id
                    this.charges.push(charging)
                    console.log('charging added', charging)

                    let timer = new ChargingTimer(c)
                    .then((id) => {
                        console.log('charging finished', id)
                        this.message = "Fully charged!"
                        //this.remooveCharging(id)
                    })
                })
            })
            .catch(error=> {
                console.log('fetching user charges', error)
                alert(error)
            })
        },
        simCharge() {
            let charging = new Charging(2, this.user.uid)
            let timer = new ChargingTimer(charging)
            .then((id) => {
                console.log('charging finished', id)
                this.message = "Fully charged!"
                //this.removeCharging(id)
            })
            this.charges.push(charging)
        },
        getProfile() {
            db.collection('users').where('user_id', '==', this.user.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.slug = doc.id
                    this.profile = doc.data()
                    this.email = this.user.email
                    console.log('profile', this.profile)
                })
            })
            .catch(error=> {
                console.log('fetching user profile', error)
                alert(error)
            })
        }

    },
    created() {
        this.user = firebase.auth(). currentUser
        console.log('HomePage', this.user)

        if (this.user) {
            this.getProfile()
            this.simCharge()
        }
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
    min-width: 400px;
    max-width: 480px;
    margin-top: 2em;
}
</style>
