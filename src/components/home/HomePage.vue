<template>
    <div class="container">
        <keep-alive>
        <div v-if="viewHome">
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
        </div>

        <div v-else-if="viewCharge">
            <charge v-on:onStartCharge="onStartCharge"></charge>
        </div>

        <div v-else-if="viewPluggedIn">
            <charge-port v-on:onStartChargePluggedIn="onStartChargePluggedIn" :charge="charge"></charge-port>
        </div>

        <div v-else-if="viewUnplugged">
            <charge-connect v-on:onSuccess="onSuccess" :port="port"></charge-connect>
        </div>

        <div v-else-if="viewSuccess">
            <success-dialog v-on:onSuccess="onSuccess" :charge="charge"></success-dialog>
        </div>
        </keep-alive>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import Charge from '@/components/charging/Charge'
import ChargingList from '@/components/charging/ChargingList'
import ChargeWithCredits from '@/components/charging/ChargeWithCredits'
import ChargeWithCode from '@/components/charging/ChargeWithCode'
import ChargePort from '@/components/charging/ChargePort'
import ChargeConnect from '@/components/charging/ChargeConnect'
import SuccessDialog from '@/components/charging/SuccessDialog'
import {Charging, CloneCharging, ChargingTimer} from '@/classes/charging.js'
import ErrorFeedback from '@/components/common/ErrorFeedback'

const VIEW_NONE = 0, VIEW_HOME = 1, VIEW_CHARGE = 2, VIEW_PLUGGED_IN = 3, VIEW_UNPLUGGED = 4, VIEW_SUCCESS = 5;
// Commands to mPower
const TURN_POWER_OFF = '00', TURN_POWER_ON = '01'
// Notifications from mPower
const ACK_MESSAGE = 0, NACK_MESSAGE = 1, PORT_CONNECTED = 2, PORT_DISCONNECTED = 3, POWER_ON = 4, POWER_OFF = 5, PORT_STATUS = 6
// Error codes in NACK_MESSAGE: 0xE2 - 0xE4
const ERROR_BASE = 0xE2, ERROR_MAX = 0xE4
const ERROR_MESSAGE = [ 'Illegal command', 'Illegal port number', 'Illegal port status', 'No available ports' ]
const ONE_CHARGE = 1


export default {
    name: 'HomePage',
    components: {
        ChargingList,
        ChargeWithCredits,
        ChargeWithCode,
        Charge,
        ChargeConnect,
        ChargePort,
        SuccessDialog,
        ErrorFeedback
    },
    data() {
        return {
            user: null,
            slug: null,
            email: null,
            currentView: VIEW_HOME,
            charge: null,
            feedback: null,
            fontsize: '40px'
        }
    },
    computed: {
        port() {
            return this.charge.port
        },
        charges() {
            return this.$store.state.charges
        },
        profile() {
            return this.$store.state.profile
        },
        location() {
            return this.$store.state.location
        },
        viewHome() {
            return this.currentView == VIEW_HOME;
        },
        viewCharge() {
            return this.currentView == VIEW_CHARGE;
        },
        viewUnplugged() {
            return this.currentView == VIEW_UNPLUGGED;
        },
        viewPluggedIn() {
            return this.currentView == VIEW_PLUGGED_IN;
        },
        viewSuccess() {
            return this.currentView == VIEW_SUCCESS;
        }
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
        getLocation(id) {
            if (!this.$store.state.location.id) {
                this.$store.state.location = this.$store.state.database.getLocation(id)
            }
        },
        turnPowerOn(port) {
            this.$store.state.controller.turnOnOrOff(port, TURN_POWER_ON)
            .then(() => {
                // Power turned on successfully
                // Waiting for ACK_MESSAGE/NACK_MESSAGE
            })
            .catch((error) => {
                // Failed to send command
                console.error('turnPowerOn failed', error)
            })
        },
        onBleDisconnected(event) {
            this.feedback = event
            this.$store.state.controller.reconnect(this.onBleDisconnected, this.onBleNotification)
            .then(() => {

            })
            .catch((error) => {
                this.feedback = error.message
                return false
            })
        },
        onBleNotification(event) {
            let value = event.target.value
            let a = [];
            for (let i = 0; i < value.byteLength; i++) {
                // a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
                a.push(value.getUint8(i));
            } 
            this.getLocation(a[0])
            switch (a[1]) {
            case ACK_MESSAGE:
                console.log('ACK')
                this.onChargeStarted(a[2])
                break;
            case NACK_MESSAGE:
                console.log('NACK')
                this.onError(a[2])
                break;
            case PORT_CONNECTED:
                console.log('CONNECTED port')
                this.onUsbConnected(a[2])
                break;
            case PORT_DISCONNECTED:
                console.log('DISCONNECTED port')
                this.onUsbDisconnected(a[2])
                break;
            case POWER_ON:
                console.log('POWER ON')
                this.onUsbPowerOn(a[2])
                break;
            case POWER_OFF:
                console.log('POWER OFF')
                this.onUsbPowerOff(a[2])
                break;
            case PORT_STATUS:
                console.log('PORT STATUS')
                this.onUsbPortStatus(a)
                break;
            default:
                console.log('UNKNOWN NITIFICATION')
                break;
            }
        },
        onSuccess(port) {
            this.$store.state.database.claimCredit(this.user.uid, ONE_CHARGE)
            this.$store.state.database.addToCharges(this.charge)

            this.currentView = VIEW_HOME
            this.getCharges()
        },
        onError(errorCode) {
            this.currentView = VIEW_HOME
            let emsg = ""
            if (errorCode >= ERROR_BASE && errorCode <= ERROR_MAX)
                emsg = ERROR_MESSAGE[errorCode - ERROR_BASE]
            this.feedback = "An error occured. " + emsg + "!"          
        },
        onStartCharge(data) {
            this.charge = data
            if (this.charge.pluggedIn) {
                this.currentView = VIEW_PLUGGED_IN
            } else {
                // unplugged - let the mPower station select a free USB port
                this.turnPowerOn(this.charge.port)
            }
        },
        onStartChargeUnplugged(port) {
        },
        onStartChargePluggedIn(port) {
            this.turnPowerOn(port)
        },
        onChargeStarted(port) {
            this.charge.port = port
            // if (this.charge.pluggedIn) {
            //     this.currentView = VIEW_SUCCESS
            // } else {
            //     this.currentView = VIEW_UNPLUGGED
            // }
            this.currentView = VIEW_SUCCESS
        },
        onUsbConnected(port) {

        },
        onUsbDisconnected(port) {

        },
        onUsbPowerOn(port) {

        },
        onUsbPowerOff(port) {

        },
        onUsbPortStatus(status) {

        },
        connectToBluetooth() {
            let controllerName 
            this.$store.state.controller.connect(this.onBleDisconnected, this.onBleNotification)
            .then((name) => {
                controllerName = name
                // this.$router.push({name: 'Charge', params: {port: 0xff}})
                this.currentView = VIEW_CHARGE
            })
            .catch((error) => {
                // alert(error)
                this.feedback = error.message
            })
        },
        startChargeWithCredits() {
            this.feedback = null
            if (this.profile.credits == 0) {
                //TODO: add timer to 
                this.feedback = "Oh! You don't have any credits left. Load your mPower account."
                return
            }
            if (!this.$store.state.location.id) {
                this.$store.state.location.id = 0
                this.$store.state.location.name = 'mPower Station'
            }
            if (!this.$store.state.controller.isConnected) {
                this.connectToBluetooth()
            } else {
                // this.$router.push({name: 'Charge', params: {port: 0xff}})
                this.currentView = VIEW_CHARGE
            }
        },
        startChargeWithCode() {

        },
        stopCharging(id) {
            this.feedback = null
            let ix = this.charges.findIndex(e => e.id === id)
            if (~ix) {
                this.charges.splice(ix, 1)
            }
        },
        updateCharging(id) {
            if (id) {
                db.collection('charges').doc(id).update({
                    stop_time: Date.now(), time_left: 0
                })
                .then(() => {
                }).catch(error => {
                    this.feedback = error.message
                })
            }
        },
        getCharges() {  
            this.$store.state.charges = []
            db.collection('charges').where('user_id', '==', this.user.uid)
            // .where('time_left', '>', 0)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    let charging = new CloneCharging(doc.data())
                    if (charging.time_left > 0) {
                        charging.id = doc.id
                        // if (!charging in this.charges)
                            this.charges.push(charging)
                        let timer = new ChargingTimer(charging, this.$store.state.database)
                        .then((id) => {
                           this.updateCharging(id)
                        })
                        .catch((error) => {
                            console.error('Get charges failed', error)
                        })
                    }
                })
            })
            .catch(error=> {
                console.error('Get  charges failed', error)
                this.feedback = error.message
            })
        },
        getProfile() {
            db.collection('users').where('user_id', '==', this.user.uid)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.slug = doc.id
                    this.$store.state.profile = doc.data()
                    this.email = this.user.email
                })
            })
            .catch(error=> {
                console.error('Fetching user profile failed', error)
                alert(error)
            })
        }

    },
    created() {
        this.user = firebase.auth(). currentUser
        this.getProfile()
        this.getCharges()
    }
}
</script>

<style>

</style>
