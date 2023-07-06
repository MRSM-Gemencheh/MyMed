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


initializeApp(firebaseConfig);
const db = getFirestore();

const recordForm = document.getElementById("recordForm");
recordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const tarikh = document.getElementById("tarikh").value;
    const jumlah = document.getElementById("jumlah").value;
    const lokasi = document.getElementById("lokasi").value;

    try {
        const recordData = {
            tarikh: tarikh,
            jumlah: parseFloat(jumlah),
            lokasi: lokasi
        };

        // Add new record document to the 'rekodElaun' collection
        db.collection("rekodElaun").add(recordData)
            .then((docRef) => {
                console.log("New record document ID:", docRef.id);
                // Clear the form inputs
                recordForm.reset();
            })
            .catch((error) => {
                console.error("Error adding record document:", error);
            });
    } catch (error) {
        console.error("Error adding record document:", error);
    }
});

// Function to fetch the list of teachers from the 'pengguna' collection
async function fetchTeachers() {
    try {
        // Fetch all documents from the 'pengguna' collection
        const querySnapshot = await getDocs(collection(db, "pengguna"));

        // Get the 'teacher' select element
        const teacherSelect = document.getElementById("teacher");

        // Clear existing options
        teacherSelect.innerHTML = "";

        // Create and add the default option
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        defaultOption.textContent = "Select teacher";
        teacherSelect.appendChild(defaultOption);

        // Loop through the documents and create options for each teacher
        querySnapshot.forEach((doc) => {
            const teacher = doc.data().nama;

            // Create option element
            const option = document.createElement("option");
            option.value = teacher;
            option.textContent = teacher;

            // Add option to the select element
            teacherSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching teachers:", error);
    }
}

// Fetch teachers when the page is loaded
window.addEventListener("DOMContentLoaded", fetchTeachers);