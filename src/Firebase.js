import firebase from 'firebase'

const firebaseConfig = {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    apiKey: "AIzaSyAkw7O6zDJWjAlVdPbxKOAcMKfP34uYnM4",
    authDomain: "instagram-clone-327f0.firebaseapp.com",
    projectId: "instagram-clone-327f0",
    storageBucket: "instagram-clone-327f0.appspot.com",
    messagingSenderId: "908205776256",
    appId: "1:908205776256:web:2acd4f1542b3f3ad43b565",
    measurementId: "G-7SVYKLK2DY"
}

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

export { db, auth, storage }