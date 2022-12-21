import  firebase from 'firebase'
export default async ( { Vue}) => {
  const firebaseConfig = {
    apiKey: "AIzaSyB1XOt_kXmdWnUzMeVhyWEMc673N190cAA",
    authDomain: "misland-73175.firebaseapp.com",
    projectId: "misland-73175",
    storageBucket: "misland-73175.appspot.com",
    messagingSenderId: "527409777869",
    appId: "1:527409777869:web:b23e6d58f9f19c6c1ded84"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}