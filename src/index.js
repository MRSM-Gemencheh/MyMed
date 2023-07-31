import { initializeApp } from "firebase/app";
import { signInWithRedirect, getRedirectResult, getAuth, signOut, OAuthProvider } from "firebase/auth";

// Our web app's Firebase configuration
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
const auth = getAuth();
const provider = new OAuthProvider('microsoft.com');

provider.setCustomParameters({
    prompt: "login",
    tenant: "common",
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

    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

    });

auth.onAuthStateChanged(function (user) {
    if (user) {

        userName.textContent = user.displayName;
        signInButton.style.display = "none"
        signOutButton.style.display = "block"

        signInSuccessStyleUpdates()

        // Redirect the user to the profile page
        setTimeout(function () {
            location.href = "./profile.html"
        }, 1000)

    } else {
        // User is signed out
        console.log("User is not logged in");
    }
});

// Get the elements from the DOM on page load
document.addEventListener('DOMContentLoaded', function () {

    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const programsContainer = document.getElementById('programsContainer');
    const userName = document.getElementById('userName');

    signInButton.addEventListener('click', () => {
        console.log("Sign in process initiated!")
        signInButton.className = signInButton.className + ' is-loading'
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

    return signInButton, signOutButton, programsContainer, userName
});

function signInSuccessStyleUpdates() {
    var progressBar = document.getElementById('signInSuccessProgressBar')
    if (progressBar) {
        progressBar.style.display = "block"
    }
    var successText = document.getElementById('signInSuccessText')
    if (successText) {
        successText.style.display = "block"
    }
}