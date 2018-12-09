<template>
    <div class="container">
        <div class="text-center" style="margin-top: 2em">
            <h4 v-if="user">Hi, {{ user.displayName  }}</h4>
            <p v-if="profile && checkCredits()">My Credits: {{ profile.credits }}</p>
            <p v-else>You don't have any credits. <b-link style="color: green">Load mPower account?</b-link></p>
        </div>

        <!-- list active charges -->
        <charge-list :charges="charges"></charge-list>

        <b-card class="g-card" style="background: #00b656; margin-top: 1em; border-radius: 8px">
            <h5 class="card-title" style="color: white">Charge with credits</h5>
            <p class="card-title" style="color: white">Sign up and load your mPower account. Unlock a charger at eny time with your mobile phone</p>
            <b-button block variant="outline-success" style="margin-top: 1.5em; color: white; border-color: white">Charge with credits</b-button>
        </b-card>
        
        <b-card class="g-card" style="margin-top: 1em; border-radius: 8px">
            <h5 class="card-title">Charge with code</h5>
            <p class="card-title">Pay for charging at one of the mPower stations and get a one time charging code.</p>
            <b-button block variant="outline-secondary" style="margin-top: 1.5em">Charge with code</b-button>
        </b-card>
        <div style="margin-bottom: 2em"></div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import ChargeList from '@/components/charge/ChargeList'
import Charge from '@/components/classes/charge.js'

export default {
    name: 'HomePage',
    components: {
        ChargeList
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
        simCharge() {
            let c = new Charge(2)
            this.charges.push(c)
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
