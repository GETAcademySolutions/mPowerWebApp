import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA-NxIhOuLHtkQUnk58iwcF43k1OVCflqI",
    authDomain: "mpower-c19fa.firebaseapp.com",
    databaseURL: "https://mpower-c19fa.firebaseio.com",
    projectId: "mpower-c19fa",
    storageBucket: "mpower-c19fa.appspot.com",
    messagingSenderId: "428555416050"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()
const apiKey = config.apiKey

export { db as default, apiKey }
