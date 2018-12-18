<template>
    <div class="container">
        <b-card v-if="!success" class="g-box" style="border: none">
            <b-form @submit.prevent="charge">
                <div>
                    <h4>Enter port number</h4>
                    <p class="card-text" style="margin-top: 1em; margin-bottom: 1em">If you have already plugged in your device i a port, we need to know the port number.</p>
                </div>
                <error-feedback v-if="feedback" class="" :message="feedback" style="margin-bottom: 1em"></error-feedback>
                <b-form-group id="email" label="" label-for="port">
                    <b-form-input id="port" type="number" @change="feedback = null" v-model="port" required
                                placeholder="Port number">
                    </b-form-input>
                </b-form-group>
                <b-button @click="charge()" block style="background: #00b656">Connect</b-button>
            </b-form>
        </b-card>

        <b-card v-else class="g-box" style="border: none">
            <b-alert :show="dismissCountDown" dismissible @dismissed="ok()" @dismiss-count-down="countDownChanged" variant="success">
            <h4 class="alert-heading">Success!</h4>
            <p>
                Your device is now charging. Fully chared at {{ finishedAt | formatTime }}
            </p>
            <!-- <hr> -->
            <p class="mb-0">
                
            </p>
            </b-alert>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import {mPowerBluetoothController, mPowerBluetoothControllerDummy} from "@/bluetooth/mPowerBluetoothController";
import {Charging, ChargingTimer} from '@/classes/charging.js'
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'ChargePort',
    components: {
        ErrorFeedback
    },
    data() {
        return {
            user: null,
            port: null,
            finishedAt: null,
            feedback: null,
            success: false,
            id: null,
            dismissSecs: 5,
            dismissCount: 0,
            dismissCountDown: 0
        }
    },
    methods: {
        ok() {
            console.log('ok')
            this.$router.push({ name: 'HomePage'})
        },
        countDownChanged (dismissCountDown) {
            console.log('countDownChanged', this.dismissSecs)
            this.dismissCount++
            if (this.dismissCount == this.dismissSecs) {
                this.$router.push({ name: 'HomePage'})
            }
            this.dismissCountDown = dismissCountDown
        },
        addToCharges(item) {
            console.log('addToCharges')
            db.collection("charges").add({
                port: item.port, device: item.device, id: null, user_id: item.user_id, battery_level: item.battery_level,
                start_time: item.start_time, time_left: item.time_left, finished_at: item.finished_at})
            .then((doc) => {
                this.id = doc.id
                console.log("charging added ", this.id);
            })
            .catch((error) => {
                console.error("Error adding keyvalues", error);
                this.feedback = error
            })
        },
        chargeCredit() {
            // charge the user account with 1 credit
            console.log('chargeCredit')
        },
        charge() {
            if (this.port > 10) {
                this.feedback = 'Port number must be in the range 1 to 10'
                return
            }
            this.$controller.turnOnOrOff(this.port, "01")
            .then((port) => {
                console.log('turnOnOrOff', port)
                this.chargeCredit()
                let charging = new Charging(this.port, this.user.uid)
                this.finishedAt = charging.finished_at
                console.log('charging', charging)
                this.addToCharges(charging)
                this.success = true
                this.dismissCountDown = this.dismissSecs
                // this.$router.push({ name: 'ChargeConnect', params: { port: port }})
            })
            .catch((error) => {
                console.log('charge error', error)
                this.feedback = error.message + ' (error code: ' + error.errorCode + ')' 
            })
        }
    },
    created() {
        this.user = firebase.auth().currentUser
    }
}
</script>

<style>
.g-box {
    margin: auto;
    min-width: 350px;
    max-width: 400px;
    margin-top: 2em;
}
</style>
