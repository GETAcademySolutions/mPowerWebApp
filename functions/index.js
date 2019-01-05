const functions = require('firebase-functions');
const admin = require('firebase-admin');
const urlBuilder = require('build-url');
const request = require('request-promise-native');
const axios = require('axios');
const crypto = require("crypto-browserify");
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

// exports.httpRequest = functions.https.onRequest((req, res) => {
//     res.send("Hello from Firebase!");
// });

// var generateSafaricomToken = function(consumerKey, consumerSecret, grantType) {
//     let token = '';

//     var options = {
//         method: 'get',
//         url: '/oauth/v1/generate?grant_type=client_credentials HTTP/1.1',
//         host: 'sandbox.safaricom.co.ke',
//         Authorization: 'Basic U1BMd0xkMnVBM29ub1BSWENKRjZiV3FXR3hOdkE4Qlo6NldPZ2hNQUdUdUVZS2pYMw==',
//         'Content-Type': 'application/json';
//     }
//     //demo purposes only
//     return token;
// }

// exports.getSafaricomToken = functions.https.onCall((data, context) => {
//     const consumer_key = "amSA8r3EkWWD4kd7bu6UkPHCOvGtkfiz";
//     const consumer_secret = "PYLbVnxqfmGG5O1l";
//     // const url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
//     const auth = Buffer.from(consumer_key + ":" + consumer_secret, 'base64').toString();
//     try {
//         var options = {
//             method: 'get',
//             url: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
//             headers: {
//                 "Authorization" : auth
//             }
//         }
//     }
//     catch (error) {
//         return {status: 'nok..4', error: error}
//     }
//     try {
//         return axios( {
//             method: 'get',
//             url: "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
//             headers: {
//                 "Authorization" : auth
//             }
//         })
//         .then((body) => {
//             //   {
//             //     "access_token": "hsHoclSD53UC3657NAD3d0qBE8cA",
//             //     "expires_in": "3599"
//             //   }
//             // return { status: 'ok', access_token: body.access_token, expires_in: body.expires_in }     
//             return { status: 'ok', result: body }     
//         })
//         .catch((error) => {
//             return {status: 'nok', error: error}
//         })
//     }
//     catch (error) {
//         return {status: 'nok..', error: error}
//     }
// })

exports.getSafaricomToken = functions.https.onCall((data, context) => {
    const consumer_key = "amSA8r3EkWWD4kd7bu6UkPHCOvGtkfiz"
    const consumer_secret = "PYLbVnxqfmGG5O1l"
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

