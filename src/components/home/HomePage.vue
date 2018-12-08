<template>
    <div class="container">
        <div class="text-center" style="margin-top: 2em">
            <h4 v-if="user">Hi, {{ user.displayName  }}</h4>
            <p v-if="profile && checkCredits()">My Credits: {{ profile.credits }}</p>
            <p v-else>You don't have any credits. <b-link style="color: green">Load mPower account?</b-link></p>
        </div>

        <charge-list :charges="charges"></charge-list>
        
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

</style>
