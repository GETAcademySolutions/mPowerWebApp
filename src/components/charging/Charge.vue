<template>
    <div class="component">
        <b-card class="g-box" style="border: none">
            <div class="text-center">
                <h4>Charge</h4>
            </div>
            <b-card style="margin-top: 1em; margin-bottom: 1em; border-color: darkgrey"> 
                <div class="card-subtitle text-center">{{location.name}} ({{location.id}})</div>
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
            <b-button @click="startCharge()" block style="background: #00b656">Charge</b-button>
        </b-card>
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
    props: [],
    data() {
        return {
            deviceOptions: [
                { text: 'This phone', value: 'phone' },
                { text: 'Generic device', value: 'general' }
            ],
            device: 'phone',
            pluggedInOptions: [
                { text: 'Yes', value: 'yes' },
                { text: 'No', value: 'no' }
            ],
            pluggedIn: 'no',
            charge: null,
            reason: 'onStartCharge'
        }
    },
    computed: {
        location() {
            return this.$store.state.location
        }
    },
    methods: {
        startCharge() {
            this.charge.device = this.device
            this.charge.pluggedIn = this.pluggedIn == 'yes'
            this.$emit(this.reason, this.charge)
        }
    },
    created() {
        if (!this.charge) {
            this.charge = new Charging(0, firebase.auth().currentUser.uid)
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
