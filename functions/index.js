const functions = require('firebase-functions');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');
const request = require('request-promise-native');
const axios = require('axios');
// const crypto = require("crypto-browserify");
// const ifunctions = require('./base64/btoaUTF8.min');
// Imports the Google Cloud client library
// const {PubSub} = require('@google-cloud/pubsub');

// Creates a client
// const pubsub = new PubSub();


admin.initializeApp();


exports.checkAlias = functions.https.onCall((data, context) => {
    try {
        const ref = admin.firestore().collection('users').doc(data.slug)
        return ref.get()
        .then((doc) => {
            return { unique: !doc.exists }
        })
        .catch((error) => {
            // throw new functions.https.HttpsError('failed to connect to database')
            return {error: error}
        })
    }
    catch (error) {
        return {error: error}
    }
})

exports.updateChargeTime = functions.https.onCall((data, context) => {
    db.collection("charges").doc(data.item.id).update({ time_left: data.item.time_left })
    .then(() => {
        console.log('stop_time updated', data.item.stop_time);
    })
    .catch((error) => {
        console.error("Error update time_left failed", error);
    })

})

exports.checkHttp = functions.https.onCall((data, context) => {
    try {
        // return request('http://www.google.com')
        // .then((resonse) => {
        //     // Process html...
        //     return { status: 'ok', data: response.body };
        // })
        // .catch((error) => {
        //     // Crawling failed...
        //     return {status: 'nok..', error: error}
        // });

        return axios.get('https://dog.ceo/api/breeds/list/all')
        .then(response => {
            return {result: response.data.message}
        })
        .catch(error => {
            return {error: error.message}
        })
    }
    catch (error) {
        return {error: error}
    }
})

// payments/mpesa:
// payments/transactions:
// Auto (Auto number)
// TransactionType (Varchar 40)
// TransID (Varchar 40)
// TransTime (Varchar 40)
// TransAmount double
// BusinessShortCode Varchar 15
// BillRefNumber (Varchar 40)
// InvoiceNumber (Varchar 40)
// ThirdPartyTransID (Varchar 40)
// MSISDN (Varchar 15)
// FirstName (Varchar 50)
// MiddleName (Varchar 50)
// LastName (Varchar 50)

var saveAccessToken = function(accessToken, expiresIn) {
    try {
        let expiresAt = Date.now() + expiresIn
        const ref = admin.firestore().collection('payment/mpesa/token')
        return ref.set( { access_token: accessToken, expires_in: expiresIn, expires_at: expiresAt })
        .then(() => {
            //
        })
        .catch((error) => {
            throw new functions.https.HttpsError('failed to update database')
        })
    }
    catch (error) {
        throw new functions.https.HttpsError('failed to update database')
    }

}

// ExpiryDate	
// Lipa Na Mpesa Online Shortcode:	174379
// Lipa Na Mpesa Online Passkey:
// bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
// Generated Initiator Security Credential:
// N/yXNOT4azUzEd+4h2vFYtDqvAejCgKaCsCYLuN0rU/Rii9leGi/7Fos6HEPA17SKso95CV9Om6tRuIIApeY6snvorQplXI4JkgHqLMz9w9z76gkTBsm8uQJrn52PlbhoIBsR+aChDLgBrQed7APwXBV3f/ZsGBixRgCOp/IlY/212ffIraks0A5K62YdcQypg86+hfG9hz9nU2kHzF/Yhvbapv+TNB4ObA5u8AdWWsIYS6iOEJgLTtUFObIA/9+euxiaZ7QX/GNfldRcNCgSG7+86mj9RsyYpeTJvrfGr7G7aIxpkvplCr98wSCWAWqzqFtscZCI3B4n9aA0arzBA==

exports.getSafaricomToken = functions.https.onCall((data, context) => {
    const consumer_key = functions.config().mpesa.consumerkey;
    const consumer_secret = functions.config().mpesa.consumersecret;
    const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    // const auth = Buffer.from("Basic " + consumer_key + ":" + consumer_secret, 'base64').toString()
    const auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
    var options = {
        url : url,
        headers : {
            'Authorization' : auth
        },
        json : true
    }
    try {
        return request(options)
        .then(function(response) {
            // return JSON.parse(response)
            return response  
        })
        .catch(function(error) {
            return {status: 'nok', error: error}
        })
    }
    catch (error) {
        return {status: 'nok..', error: error}
    }
})

const xx = function(access_token) {
    const header  =  {
        Authorization : "Bearer " + accesstoken,
        ContentType : "application/json"
    }

}

