import firebase from 'firebase'

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
}

firebase.initializeApp(config)

export const database = firebase.database()
export const firebaseAuth = firebase.auth