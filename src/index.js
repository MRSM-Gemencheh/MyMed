// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth, signOut, OAuthProvider } from "firebase/auth";

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

const provider = new OAuthProvider('microsoft.com', '708855ff-2443-4a76-8e6b-766565c5928e');
const auth = getAuth();

provider.setCustomParameters({
    prompt: "login",
    tenant: "common",
  });

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
        // IdP data available in result.additionalUserInfo.profile.

        // Get the OAuth access token and ID Token
        const credential = OAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;

        // The signed-in user info.
        const user = result.user;

        console.log(user)

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
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

        // Redirect the user to the profile page

        let signInSuccessProgressBar = document.getElementById('signInSuccessProgressBar')
        let signInSuccessText = document.getElementById('signInSuccessText')

        signInSuccessProgressBar.style.display = "block"
        signInSuccessText.style.display = "block"

        setTimeout(function () {
            location.href = "./profile.html"
        }, 2000)

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