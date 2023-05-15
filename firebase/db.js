import { firebase } from "@firebase/app"
import "@firebase/firestore"

const firebaseApp = firebase.initializeApp({
    apiKey: "oUYxakS97kUHnOwopW73kw7KeVtiXC5To2y4cizJ",
    authDomain: "mtg-commander-aaeaf.firebaseapp.com",
    databaseURL: "https://mtg-commander-aaeaf.firebaseio.com",
    projectId: "mtg-commander-aaeaf",
    storageBucket: "mtg-commander-aaeaf.appspot.com",
    messagingSenderId: "447477765016"
})

const db = firebaseApp.firestore()

const libraryRef = db.collection("library")
const messageRef = db.collection("messages")

export { libraryRef, messageRef, firebase }