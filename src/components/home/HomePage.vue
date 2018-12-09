<template>
    <div class="container">
        <div class="text-center" style="margin-top: 2em">
            <h4 v-if="user">Hi, {{ user.displayName  }}</h4>
            <p v-if="profile && checkCredits()">My Credits: {{ profile.credits }}</p>
            <p v-else>You don't have any credits. <b-link style="color: green">Load mPower account?</b-link></p>
        </div>

        <!-- list active charges -->
        <charging-list :charges="charges"></charging-list>

        <charge-with-credits v-on:startChargeWithCredits="startChargeWithCredits()"></charge-with-credits>
        <charge-with-code v-on:startChargeWithCode="startChargeWithCode()"></charge-with-code>

        <div style="margin-bottom: 2em"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ChargingList from '@/components/charging/ChargingList'
import ChargeWithCredits from '@/components/charging/ChargeWithCredits'
import ChargeWithCode from '@/components/charging/ChargeWithCode'
import {Charging, ChargingTimer} from '@/components/classes/charging.js'

export default {
    name: 'HomePage',
    components: {
        ChargingList,
        ChargeWithCredits,
        ChargeWithCode
    },
    data() {
        return {
            user: null,
            slug: null,
            profile: null,
            email: null,
            charges: []
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
        startChargeWithCredits() {
            colsole.log('startChargeWithCredits')
        },
        startChargeWithCode() {
            colsole.log('startChargeWithCode')
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
                        //remove charging element
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
                //remove charging element
            })
            this.charges.push(charging)
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
.button-button_border: {
    border-color: white;
}
</style>
