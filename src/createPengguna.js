import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth, signOut } from "firebase/auth";
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

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in, you can access the user object
    console.log(user);

    userName.textContent = user.displayName;
    signOutButton.style.display = "block"
  } else {
    // User is signed out
    console.log("User is not logged in");

    // Redirect user back to sign in page

    let signInRequiredProgressBar = document.getElementById('signInRequiredProgressBar')
    let signInRequiredText = document.getElementById('signInRequiredText')

    signInRequiredProgressBar.style.display = "block"
    signInRequiredText.style.display = "block"

    setTimeout(function () {
      location.href = "./index.html"
    }, 2000)
  }
});

const db = getFirestore();

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nama = document.getElementById("nama").value;
  const noKadPengenalan = document.getElementById('noKadPengenalan').value
  const emel = document.getElementById("emel").value;
  const noGaji = document.getElementById("noGaji").value;
  const statusPerkahwinan = document.querySelector(
    'input[name="statusPerkahwinan"]:checked'
  ).value;

  let rekodImbuhan = [

  ]

  try {
    const penggunaData = {
      nama: nama,
      noKadPengenalan: noKadPengenalan,
      emel: emel,
      noGaji: noGaji,
      statusPerkahwinan: statusPerkahwinan,
      rekodImbuhan: rekodImbuhan
    };

    // Add new 'pengguna' document to the 'pengguna' collection
    const docRef = await addDoc(collection(db, "pengguna"), penggunaData);

    console.log("New pengguna document ID:", docRef.id);

    // Clear the form inputs
    registerForm.reset();

    setTimeout(function () {
      location.href = "./admin.html"
    }, 2000)

  } catch (error) {
    console.error("Error adding pengguna document:", error);
  }
});