import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, orderBy, getDocs, addDoc, where } from "firebase/firestore";

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

const db = getFirestore();

document.body.onload = function () {

    let signOutButton = document.getElementById('signOutButton')

    signOutButton.addEventListener('click', () => {

        signOut(auth).then(() => {
            location.reload()
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        });

    })
}

// ...

auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in
        console.log(user);
        userName.textContent = user.displayName;
        signOutButton.style.display = "block";

        // Check if user's email exists in 'admin' collection
        const adminCollectionRef = collection(db, 'admin');
        const queryRef = query(adminCollectionRef, where('emel', '==', user.email));

        getDocs(queryRef)
            .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                    console.log("User is an admin."); // User's email exists in 'admin' collection
                    // Perform actions for admin user
                } else {
                    console.log("User is not an admin."); // User's email doesn't exist in 'admin' collection
                    setTimeout(function() {
                        location.href = "./index.html"
                    }, 2000)
                }
            })
            .catch((error) => {
                console.log("Error getting admin collection:", error);
            });
    } else {
        // User is signed out
        console.log("User is not logged in");
        
        let signInRequiredProgressBar = document.getElementById('signInRequiredProgressBar');
        let signInRequiredText = document.getElementById('signInRequiredText');

        signInRequiredProgressBar.style.display = "block";
        signInRequiredText.style.display = "block";

        // Redirect user back to sign-in page
        setTimeout(function() {
            location.href = "./index.html"
        }, 2000)
    }
});

