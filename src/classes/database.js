import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import {Charging, CloneCharging, ChargingTimer} from '@/classes/charging.js'

class Database {
    constructor() {
        // console.log('database constructor');
    }

    getLocation(id) {
        db.collection('location').where('id', '==', id)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                return doc.data()
            })
        })
        .catch(error => {
            throw new Error('Failed to get location, ' + error.message)
        })
    }
    getProfile() {
        db.collection('users').where('user_id', '==', firebase.auth().currentUser.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                return doc.data()
            })
        })
        .catch(error=> {
            throw new Error('Failed to get profile, ' + error.message)
        })
    }

    updateChargeTime(item) {
        db.collection("charges").doc(item.id).update({ time_left: item.time_left })
        .then(() => {

        })
        .catch((error) => {
            console.error("Error update time_left failed", error);
        })

    }

    updateCharge(id) {
        if (id) {
            console.log('updateCharge')
            db.collection('charges').doc(id).update({
                stop_time: Date.now(), time_left: 0
            })
            .then(() => {

            }).catch(error => {
                throw new Error('Failed to update charge, ' + error.message)
            })
        }
    }

    claimCredit(uid, claim) {
        db.collection('users').where('user_id', '==', uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data()
                db.collection("users").doc(data.slug).update({ credits: data.credits - claim })
            })
        })
        .catch(error => {
            throw new Error('Failed to claim credit, ' + error.message)
        })
    }

    addToCharges(item) {
        db.collection("charges").add({
            port: item.port, device: item.device, id: null, user_id: item.user_id, battery_level: item.battery_level,
            start_time: item.start_time, time_left: item.time_left, finished_at: item.finished_at})
        .then((doc) => {
            this.id = doc.id
        })
        .catch((error) => {
            throw new Error('Failed to update database. ' + error)
        })
    }


    getCharges(userId) {
        db.collection('charges').where('user_id', '==', userId)
        //.where('timeLeft', '>', 0)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let charge = new CloneCharging(doc.data())
                if (charge.time_left > 0) {
                    charge.id = doc.id
                    this.$store.state.charges.push(charge)
                    let timer = new ChargingTimer(charge)
                    .then((id) => {
                       this.updateCharge(id)
                    })
                    .catch((error) => {
                        console.error('updateCharge', error)
                    })
                }
            })
        })
        .catch(error=> {
            throw new Error('Failed to get your balance, ' + error.message)
        })
    }

    addCredits(id, credits) {
        const ref = db.collection('users').doc(id)
        ref.get()
        .then((doc) => {
            let data = doc.data()
            data.credits += credits
            ref.update({ credits: data.credits })
        }).catch(error => {
            throw new Error('Failed to update credits, ' + error.message)
        })
    }

    getAccessToken() {
        try {
            let token = null
            const ref = db.collection('payment').doc('mpesa')
            return ref.get()
            .then(doc => {
                token = doc.data()
                if (token && this.isValid(token.expires_at)) {
                    return token
                } else {
                    // var getSafaricomToken = firebase.functions().httpsCallable('getSafaricomToken');
                    return this.getToken()
                    .then((data) => {
                        // Read result of the Cloud Function.
                        let expiresAt = null
                        try {
                        let secs = parseInt(data.expires_in, 10) - 10 // 10 secs margin
                        expiresAt = moment().add(secs, 'seconds').unix()
                        console.log('mpesa access token', data.access_token, data.expires_in, secs, expiresAt)
                        } catch(error) {
                            console.log(error)
                            return token
                        }
                        ref.set({ access_token: data.access_token, expires_at: expiresAt })
                        .then(() => {
                            return token
                        })
                        .catch((error) => {
                            // throw new functions.https.HttpsError('failed to update database')
                            console.error('ERROR', error)
                            return token
                        })
                    })
                    .catch(error => {
                        console.error('ERROR get access token', error)
                        return token
                    });
                }
            })
            .catch((error) => {
                // throw new functions.https.HttpsError('failed to update database')
                console.error('ERROR', error)
                return token
            })
        }
        catch (error) {
            // throw new functions.https.HttpsError('failed to update database')
            console.error('EXCEPTION', error)
        }
    }    

    isValid(time) {
        let now =  moment().unix()
        return (time > now)
    }

    getToken() {
        return new Promise((resolve, reject) => {
            var getSafaricomToken = firebase.functions().httpsCallable('getSafaricomToken');
            getSafaricomToken()
            .then((result) => {
                console.log('access_token', result.data.access_token )
                resolve (result.data)
            })
            .catch(error => {
                console.error('ERROR get access token')
                reject (error)
            });
        })
    }
}

export { Database }