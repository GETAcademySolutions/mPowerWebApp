import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBu_pEPCOPZOYFUjaLhrZFtG6WosQVkNNQ",
    authDomain: "mpower-45ade.firebaseapp.com",
    databaseURL: "https://mpower-45ade.firebaseio.com",
    projectId: "mpower-45ade",
    storageBucket: "",
    messagingSenderId: "797177883443"
};

const firebaseApp = firebase.initializeApp(config);

firebaseApp.firestore().settings({ timestampsInSnapshots: true })
const db = firebaseApp.firestore()
const apiKey = config.apiKey

export { db as default, apiKey }
