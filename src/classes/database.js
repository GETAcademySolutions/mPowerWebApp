import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
import {Charging, CloneCharging, ChargingTimer} from '@/classes/charging.js'

class Database {
    constructor() {
        console.log('database constructor');
    }

    getLocation(id) {
        db.collection('location').where('id', '==', id)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log('location', doc.data())
                return doc.data()
            })
        })
        .catch(error => {
            console.log('fetching user profile', error)
            throw new Error('Failed to get location, ' + error.message)
        })
    }
    getProfile() {
        let user = firebase.auth().currentUser
        console.log('getProfile enter', user);
        db.collection('users').where('user_id', '==', user.uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log('profile', doc.data())
                return doc.data()
            })
        })
        .catch(error=> {
            console.log('fetching user profile', error)
            throw new Error('Failed to get profile, ' + error.message)
        })
    }

    updateChargeTime(item) {
        db.collection("charges").doc(item.id).update({ time_left: item.time_left })
        .then(() => {
            console.log('stop_time updated', item.stop_time);
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
                console.log("charge successfuølly updated", id);
            }).catch(error => {
                console.error("update charge failed", id, error);
                throw new Error('Failed to update charge, ' + error.message)
            })
        }
    }

    claimCredit(uid, claim) {
        // charge the user account with 1 credit
        console.log('claimCredit')
        db.collection('users').where('user_id', '==', uid)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data()
                db.collection("users").doc(data.slug).update({ credits: data.credits - claim })
                console.log("credits successfuølly claimed", uid);
            })
        })
        .catch(error => {
            console.error("update credits failed", uid, error);
            throw new ErrorEvent('Failed to claim credit, ' + error.message)
        })
    }

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
            throw new Error('Failed to update database. ' + error)
        })
    }


    getCredits(userId) {
        db.collection('charges').where('user_id', '==', userId)
        //.where('timeLeft', '>', 0)
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let charge = new CloneCharging(doc.data())
                if (charge.time_left > 0) {
                    console.log('charging added', charge)
                    charge.id = doc.id
                    this.$store.state.charges.push(charge)
                    let timer = new ChargingTimer(charge)
                    .then((id) => {
                       console.log('charging finished', id)
                       this.updateCharge(id)
                    })
                    .catch((error) => {
                        console.error('updateCharge', error)
                    })
                }
            })
        })
        .catch(error=> {
            console.log('fetching user charges', error)
            //this.feedback = error.message
            throw new ErrorEvent('Failed to get your balance, ' + error.message)
        })

        // db.collection("charges").where("user_id", "==", "this.user.uid")
        // .onSnapshot((querySnapshot) => {
        //         querySnapshot.forEach((doc) => {
        //         let charging = new CloneCharging(doc.data())
        //         console.log('charging added', charging)
        //         if (charging.time_left > 0) {
        //             charging.id = doc.id
        //             this.charges.push(charging)

        //             let timer = new ChargingTimer(charging)
        //             .then((id) => {
        //                 console.log('charging finished', id)
        //             })
        //         }
        //     })
        //     console.log("Current chargings: ", this.charges.join(", "));
        // })
    }

    addCredits(id, credits) {
        console.log('addCredits', credits)
        const ref = db.collection('users').doc(id)
        ref.get()
        .then((doc) => {
            let data = doc.data()
            data.credits += credits
            ref.update({ credits: data.credits })
            console.log("credits successfuølly updated", id);
        }).catch(error => {
            console.error("update charge failed", id, error);
            //this.feedback = error.message
            throw new ErrorEvent('Failed to update charge, ' + error.message)
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
                    console.log('got from db', token)
                    return token
                } else {
                    // var getSafaricomToken = firebase.functions().httpsCallable('getSafaricomToken');
                    // getSafaricomToken()
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
                            console.log('db updated')
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
        console.log('isValid', time, now)
        return (time > now)
    }

    getToken() {
        console.log('mpesa get access token...')
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