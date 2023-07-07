import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, query, orderBy, getDocs, addDoc, where, get, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAzlMJB0WkUFXUXaD-GszRKxJayUo8tZQo",
    authDomain: "e-medibalance.firebaseapp.com",
    projectId: "e-medibalance",
    storageBucket: "e-medibalance.appspot.com",
    messagingSenderId: "117392039951",
    appId: "1:117392039951:web:eee754ac35979a36af437a",
    measurementId: "G-PG5LK8VTP9"
};

initializeApp(firebaseConfig);

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

const recordForm = document.getElementById("recordForm");

recordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const namaPenerima = document.getElementById("senaraiPengguna").value;
    const tarikh = document.getElementById("tarikh").value;
    const noResit = document.getElementById("noResit").value;
    const imbuhan = document.getElementById("imbuhan").value;
    const panelKlinik = document.getElementById("panelKlinik").value;

    try {
        const recordData = {
            tarikh: tarikh,
            namaPenerima: namaPenerima,
            noResit: noResit,
            imbuhan: parseFloat(imbuhan),
            panelKlinik: panelKlinik
        };

        // Retrieve the pengguna document based on the selected namaPenerima
        const penggunaQuerySnapshot = await getDocs(
            query(collection(db, "pengguna"), where("nama", "==", namaPenerima))
        );

        if (!penggunaQuerySnapshot.empty) {
            const penggunaDoc = penggunaQuerySnapshot.docs[0];

            // Get the existing rekodImbuhan field
            const existingRekodImbuhan = penggunaDoc.data().rekodImbuhan || [];

            // Create an array to hold the existing rekodImbuhan and the new recordData
            const updatedRekodImbuhan = [...existingRekodImbuhan, recordData];

            // Update the rekodImbuhan field with the updated array

            // Use setDoc to update the required field instead of updateDoc

            await setDoc(penggunaDoc.ref, { rekodImbuhan: updatedRekodImbuhan }, { merge: true });

            console.log("Record data appended successfully.");
        } else {
            console.log("Pengguna not found.");
        }

    } catch (error) {
        console.error("Error appending record data:", error);
    }
});

// Function to fetch the list of teachers from the 'pengguna' collection
async function fetchPengguna() {
    try {
        // Fetch all documents from the 'pengguna' collection
        const querySnapshot = await getDocs(collection(db, "pengguna"));

        // Get the 'teacher' select element
        const teacherSelect = document.getElementById("senaraiPengguna");

        // Clear existing options
        teacherSelect.innerHTML = "";

        // Create and add the default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Pilih Nama";
        teacherSelect.appendChild(defaultOption);

        // Loop through the documents and create options for each teacher
        querySnapshot.forEach((doc) => {
            const namaPengguna = doc.data().nama;

            // Create option element
            const option = document.createElement("option");
            option.value = namaPengguna;
            option.textContent = namaPengguna;

            // Add option to the select element
            teacherSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
}

// Fetch teachers when the page is loaded
window.addEventListener("DOMContentLoaded", fetchPengguna);