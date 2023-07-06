// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth, signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAzlMJB0WkUFXUXaD-GszRKxJayUo8tZQo",
    authDomain: "e-medibalance.firebaseapp.com",
    projectId: "e-medibalance",
    storageBucket: "e-medibalance.appspot.com",
    messagingSenderId: "117392039951",
    appId: "1:117392039951:web:eee754ac35979a36af437a",
    measurementId: "G-PG5LK8VTP9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

document.addEventListener('DOMContentLoaded', function () {

    let programsContainer = document.getElementById('programsContainer')
    let welcomeText = document.getElementById('welcomeText')
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    let userName = document.getElementById('userName')

    return signInButton, signOutButton
});

getRedirectResult(getAuth())
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access Google APIs.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...

        welcomeText.textContent = "Selamat datang! Berjaya log masuk sebagai: " + result.user.displayName
        console.log("Sign in successful! Signed in as: " + result.user.displayName)

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });

auth.languageCode = 'en';

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in, you can access the user object
        console.log(user);

        userName.textContent = user.displayName;
        signInButton.style.display = "none"
        signOutButton.style.display = "block"
    } else {
        // User is signed out
        console.log("User is not logged in");
    }
});

document.body.onload = function () {

    signInButton.addEventListener('click', () => {
        console.log("Sign in process initiated!")
        signInWithRedirect(auth, provider);
    })



    signOutButton.addEventListener('click', () => {

        signOut(auth).then(() => {
            location.reload()
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });

    })
}