import { initializeApp } from 'firebase'
const app = initializeApp({
    apiKey: "AIzaSyAnoacqkBvMAbLEp5mvh_-BsNo-lC6GW5Q",
    authDomain: "hompimpa-4cf7a.firebaseapp.com",
    databaseURL: "https://hompimpa-4cf7a.firebaseio.com",
    projectId: "hompimpa-4cf7a",
    storageBucket: "",
    messagingSenderId: "73767699978"
  })

const db = app.database()
const roomRef = db.ref('rooms')

export { roomRef }