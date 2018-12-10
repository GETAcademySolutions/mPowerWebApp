<template>
    <div class="container component">
        <b-card class="g-box" style="border: none">
            <div v-if="!isPluggedIn" >
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
            </div>
           
            <charge-port v-else v-on:portNumberChanged="portNumberChanged"></charge-port>

            <b-button @click="charge()" block style="background: #00b656">Start charging</b-button>
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
import ChargePort from '@/components/charging/ChargePort'


export default {
    name: 'Charge',
    components: {
        ChargePort
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
            isPluggedIn: false,
            portNo: null,
            finishedAt: null,
            id: null
        }
    },
    methods: {
        portNumberChanged(portNo) {
            console.log('portNumberChanged', this.portNo)
            this.portNo = portNo
        },
        addToCharges(item) {
            db.collection("charges").add(item)
            .then((doc) => {
                this.id = doc.id
                console.log("charging added ", this.id);
            })
            .catch((error) => {
                console.error("Error adding keyvalues", error);
                this.feedback = error
                return false
            });
            return true
        },
        charge() {
            this.feedback = null
            if (this.pluggedIn === 'yes' && !this.portNo) {
                this.isPluggedIn = true
            } else {
                //await this.controller.turnOnOrOff(port, "01");
                //const result = await this.controller.readValue();
                if (!this.portNo)
                    this.portNo = 'ff'
                console.log('start charging', this.portNo)
                this.$controller.turnOnOrOff(this.portNo, "01")
                .then(() => {
                    // charge the user account with 1 credit
                    //chargeCredit()
                    let charging = new Charging(this.portNo)
                    this.finishedAt = charging.finishedAt
                    addToCharges(charging)
                    this.$emit('chargingStarted', charging)
                    this.showSuccess()
                })
                .catch((error) => {
                    this.feedback = error
                })
                this.$router.back()
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
</style>
