<template>
    <div class="container">
        <keep-alive>

        <b-card class="g-box" style="border: none">
            <div class="text-center">
                <h4 v-if="user">Hi, {{ user.displayName  }}</h4>
                <p v-if="profile && checkCredits()">My Credits: {{ profile.credits }}</p>
                <p v-else>You don't have any credits. <b-link style="color: #00b656">Load mPower account?</b-link></p>
            </div>

            <!-- list active charges -->
            <charging-list v-on:stopCharging="stopCharging" :charges="charges" :message="feedback"></charging-list>

            <error-feedback v-if="feedback" v-on:closeErrorFeedback="closeErrorFeedback" class="g-box" :message="feedback"></error-feedback>

            <charge-with-credits v-on:startChargeWithCredits="startChargeWithCredits()"></charge-with-credits>
            <charge-with-code v-on:startChargeWithCode="startChargeWithCode()"></charge-with-code>

            <div style="margin-bottom: 2em"></div>
        </b-card>
        </keep-alive>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ChargingList from '@/components/charging/ChargingList'
import ChargeWithCredits from '@/components/charging/ChargeWithCredits'
import ChargeWithCode from '@/components/charging/ChargeWithCode'
import {Charging, CloneCharging, ChargingTimer} from '@/classes/charging.js'
import ErrorFeedback from '@/components/common/ErrorFeedback'

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
            feedback: null,
            fontsize: '40px'
        }
    },
    computed: {

    },
    methods: {
        closeErrorFeedback() {
            this.feedback = null
        },
        checkCredits() {
            if (this.profile && this.profile.credits > 0)
                return true
            return false
        },
        onBleDisconnected(event) {
            console.log('Ble disconnected!!')
            this.feedback = event
            this.$controller.reconnect(this.onBleDisconnected, this.onBleNotification)
            .then(() => {
                console.log('ble reconnected')
            })
            .catch((error) => {
                console.log('reconnect to mPower station failed', error)
                this.feedback = error.message
                return false
            })
        },
        onBleNotification(event) {
            console.log('Ble notification!!')
            let value = event.target.value
            let a = [];
            for (let i = 0; i < value.byteLength; i++) {
              a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
            //   console.log('a[' + i + ']='+ a[i])
            } 
            console.log('> ' + a.join(' '));
        },
        connectToBluetooth() {
            console.log("Start charging controller = ", this.$controller);
            let controllerName 
            this.$controller.connect(this.onBleDisconnected, this.onBleNotification)
            .then((name) => {
                controllerName = name
                console.log('Connected to mPower station')
                this.$router.push({name: 'Charge'})
            })
            .catch((error) => {
                console.log('Connect to mPower station failed', error)
                // alert(error)
                this.feedback = error.message
            })
        },
        startChargeWithCredits() {
            console.log('startChargeWithCredits')
            this.feedback = null
            if (this.profile.credits == 0) {
                //TODO: add timer to 
                this.feedback = "Oh! You don't have any credits left. Load your mPower account."
                return
            }
            if (!this.$controller.isConnected) {
                this.connectToBluetooth()
            } else {
                this.$router.push({name: 'Charge'})
            }
        },
        startChargeWithCode() {
            console.log('startChargeWithCode')
            this.feedback = null
        },
        stopCharging(id) {
            console.log('stopCharging')
            this.feedback = null
            let ix = this.charges.findIndex(e => e.id === id)
            if (~ix) {
                this.charges.splice(ix, 1)
            }
        },
        updateCharging(id) {
            if (id) {
                console.log('updateCharging')
                db.collection('charges').doc(id).update({
                    stop_time: Date.now(), time_left: 0
                })
                .then(() => {
                    console.log("charging successfuølly updated", id);
                }).catch(error => {
                    console.error("updating charge failed", id, error);
                    this.feedback = error.message
                })
            }
        },
        getCharges() {  
            //this.charges = []
            db.collection('charges').where('user_id', '==', this.user.uid)
            //.where('timeLeft', '>', 0)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let charging = new CloneCharging(doc.data())
                    if (charging.time_left > 0) {
                        console.log('charging added', charging)
                        charging.id = doc.id
                        this.charges.push(charging)
                        let timer = new ChargingTimer(charging)
                        .then((id) => {
                           console.log('charging finished', id)
                           this.updateCharging(id)
                        })
                        .catch((error) => {
                            console.log('Feil', error)
                        })
                    }
                })
            })
            .catch(error=> {
                console.log('fetching user charges', error)
                this.feedback = error.message
            })

            // db.collection("charges").where("user_id", "==", "this.user.uid")
            // .onSnapshot((querySnapshot) => {
            //         querySnapshot.forEach((doc) => {
            //         let charging = new CloneCharging(doc.data())
            //         console.log('charging added', charging)
            //         if (charging.time_left > 0) {
            //             charging.id = doc.id
            //             this.charges.push(charging)

            //             let timer = new ChargingTimer(charging)
            //             .then((id) => {
            //                 console.log('charging finished', id)
            //             })
            //         }
            //     })
            //     console.log("Current chargings: ", this.charges.join(", "));
            // })
        },
        simCharge(port) {
            let charging = new Charging(port, this.user.uid)
            let timer = new ChargingTimer(charging)
            .then((id) => {
                console.log('charging finished', id)
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
            this.getCharges()
            // /this.simCharge(2)
            // /this.simCharge(3)
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
    min-width: 360px;
    max-width: 480px;
}
</style>
