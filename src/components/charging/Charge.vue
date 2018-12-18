<template>
    <div class="container component">
        <b-card class="g-box" style="border: none">
            <div class="text-center">
                <h4>Charge</h4>
            </div>
            <b-card style="margin-top: 1em; margin-bottom: 1em; border-color: darkgrey"> 
                <div class="card-subtitle">Jambo Kiosk (11)</div>
            </b-card>
            <div>
                <b-form-group label="Select device">
                    <b-form-radio-group v-model="device" :options="deviceOptions"
                                        name="device" stacked>
                    </b-form-radio-group>
                </b-form-group>
                <b-form-group label="Have you already plugged in a device?">
                    <b-form-radio-group v-model="pluggedIn" :options="pluggedInOptions"
                                        name="pluggedIn" stacked>
                    </b-form-radio-group>
                </b-form-group>
            </div>
            <b-button @click="charge()" block style="background: #00b656">Charge</b-button>
        </b-card>

        <!-- popup dialog -->
        <b-modal ref="chargingOk" hide-footer title="Success!">
            <b-media tag="li" class="my-4">
                <b-img slot="aside" rounded="circle" blank width="50px" height="50px" blank-color="#777" alt="img" class="m-1" />
                <p>Your device is now charing. Fully charged at {{ finishedAt | formatTime }}.</p>
            </b-media>
        </b-modal>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import mPowerBluetoothController from "@/bluetooth/mPowerBluetoothController";
import mPowerBluetoothControllerDummy from "@/bluetooth/mPowerBluetoothController";
import {Charging, ChargingTimer} from '@/classes/charging.js'


export default {
    name: 'Charge',
    components: {

    },
    data() {
        return {
            user: null,
            deviceOptions: [
                { text: 'This phone', value: 'phone' },
                { text: 'General access', value: 'general' }
            ],
            device: 'phone',
            pluggedInOptions: [
                { text: 'Yes', value: 'yes' },
                { text: 'No', value: 'no' }
            ],
            pluggedIn: 'no',
            portNo: null,
            finishedAt: null,
            id: null
        }
    },
    methods: {
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
            this.feedback = null
            if (this.pluggedIn === 'yes') {
                this.$router.push({ name: 'ChargePort' })
            } else {
                this.$controller.turnOnOrOff('ff', "01")
                .then((port) => {
                    console.log('turnOnOrOff', port)
                    this.portNo = port
                    this.chargeCredit()
                    let charging = new Charging(port, this.user.uid)
                    this.finishedAt = charging.finished_at
                    console.log('charging', charging)
                    this.addToCharges(charging)
                    console.log('Charge -> ChargeConnect')
                    this.$router.push({ name: 'ChargeConnect', params: { port: port }})
                })
                .catch((error) => {
                    console.log('charge error', error)
                    this.feedback = error.message
                })
            }
        },
        showSuccess() {
            this.$refs.chargingOk.show()
        },
        hideSuccess () {
            this.$refs.chargingStatus.hide()
        }
    },
    created() {
        this.user = firebase.auth().currentUser
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
    max-width: 400px;
    margin-top: 2em;
}
.g-circle {
    width: 40px;
    height: 40px;
    border-color: #00b656;
    border-width: 10px;
}
</style>
