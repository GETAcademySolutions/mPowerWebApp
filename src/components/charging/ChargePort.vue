<template>
    <div class="container component">
        <b-card class="g-box" style="border: none">
            <b-form @submit.prevent="charge">
                <div>
                    <h4>Enter port number</h4>
                    <p class="card-text" style="margin-top: 1em; margin-bottom: 1em">If you have already plugged in your device i a port, we need to know the port number.</p>
                </div> 
                <error-feedback v-if="feedback" class="" :message="feedback" style="margin-bottom: 1em"></error-feedback>
                <b-form-group id="email" label="" label-for="portno">
                    <b-form-input id="portno" type="number" @change="feedback = null" v-model="charge.port" required
                                placeholder="Port number">
                    </b-form-input>
                </b-form-group>
                <b-button @click="startCharge()" block style="background: #00b656">Connect</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import {mPowerBluetoothController, mPowerBluetoothControllerDummy} from "@/bluetooth/mPowerBluetoothController";
import ErrorFeedback from '@/components/common/ErrorFeedback'

export default {
    name: 'ChargePort',
    components: {
        ErrorFeedback
    },
    props: ['charge'],
    data() {
        return {
            feedback: null,
            reason: 'onStartChargePluggedIn'
        }
    },
    methods: {
        ok() {
            this.$emit(this.reason, this.charge.port)
        },
        startCharge() {
            // if (this.charge.port > 10) {
            //     this.feedback = 'Port number must be in the range 1 to 10'
            //     return
            // }
            this.$emit(this.reason, this.charge.port)
        }
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
