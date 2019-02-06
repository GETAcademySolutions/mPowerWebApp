<template>
    <div class="g-top container">
        <!-- <md-button class="g-pic md-fab md-fab-bottom-right md-fixed" @click="edit()"><md-icon>edit</md-icon></md-button> -->
        <h1 v-if="profile && profile.firstname">{{ profile.firstname }} {{ profile.surname }}
            <md-button class="md-fab md-mini float-right" @click="edit()"><md-icon>edit</md-icon></md-button>
        </h1>
        <h1 v-else>[Your name]
            <md-button class="md-fab md-mini float-right" @click="edit()"><md-icon>edit</md-icon></md-button>
        </h1>
        <ul class="g-sec list-unstyled">
            <b-media tag="li">
                <b-img class="g-size" slot="aside" rounded="circle" :src="profile.picture" @click="show()" alt="img" />
                <upload-media v-on:addedPicture="addedPicture" :profile="profile" :uid="user_id"> </upload-media>
            </b-media>
        </ul>
        <div class="g-sec g-end row">
            <div class="col">
                <h3 text-secondary>Contact information</h3>
                <div class="row">
                    <div class="g-group col-6">
                        <label><strong>Firstname</strong></label>
                        <p class="g-indent">{{ profile.firstname }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Surname</strong></label>
                        <p class="g-indent">{{ profile.surname }}</p>
                    </div>
                    <div class="g-group col-12">
                        <label><strong>Street adresse</strong></label>
                        <p class="g-indent">{{ profile.address }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Postal code</strong></label>
                        <p class="g-indent">{{ profile.postal_code }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>City</strong></label>
                        <p class="g-indent">{{ profile.city }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Mobile number</strong></label>
                        <p class="g-indent">{{ profile.phoneNumber }}</p>
                    </div>
                    <div class="g-group col-6">
                        <label><strong>Email</strong></label>
                        <p class="g-indent">{{ email }}</p>
                    </div>
                </div>
            </div>
            <div class="g-end col">
                <h3>...</h3>
                <div class="row">
                    <div class="g-group col-6">
                        <label><strong>User name</strong></label>
                        <p class="g-indent">{{ profile.slug }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import functions from 'firebase/functions'
import slugify from 'slugify'
import UploadMedia from '@/components/common/UploadMedia'

export default {
    components: {
        UploadMedia
    },
    props: ['uid'],
    data() {
        return {
            user: null,
            profile: {
                picture: null,
                alias: null,
                firstname: null,
                surname: null,
                address: null,
                postal_code: null,
                city: null,
                mobile: null,
                timestamp: null
            },
            email: null,
            slug: null
        }
    },
    methods: {
        edit() {
            this.$router.push({ name: 'Profile', params: {uid: this.user.uid} })
        },
        show() {
            
        },
        profileUpdated() {
            this.getProfile()
        },
        addedPicture(file) {
            this.profile.picture = file.url 
            db.collection('users').doc(this.slug)
            .set({picture: file.url}, {merge: true})
            .then(() => {

})
            .catch(error=> {
                alert(error)
            })
        },
        getProfile(id) {
            db.collection('users').where('user_id', '==', id)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.slug = doc.id
                    this.profile = doc.data()
                    this.email = this.user.email
                })
            })
            .catch(error => {
                alert(error)
            })
            
        }
    },
    created() {
        if (this.$user)
            this.user = this.$user
        if (!this.user)
            this.user = firebase.auth().currentUser
        if (this.user) {
            this.user_id = this.user.uid
            this.getProfile(this.user_id)
        }
    }
}
</script>

<style>

</style>

