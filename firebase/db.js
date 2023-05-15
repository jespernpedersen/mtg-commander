import { firebase } from "@firebase/app"
import "@firebase/firestore"

const firebaseApp = firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
})

const db = firebaseApp.firestore()

const libraryRef = db.collection("library")
const messageRef = db.collection("messages")

export { libraryRef, messageRef, firebase }