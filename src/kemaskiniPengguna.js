import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, orderBy, getDocs, addDoc, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

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

auth.onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in
    console.log(user);

    userName.textContent = user.displayName;
    signOutButton.style.display = "block";

    // This is a crude implementation to disallow users from accessing the admin panel
    // Users may be able to disable this part of the script and gets full admin access to create new documents

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
          setTimeout(function () {
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
    setTimeout(function () {
      location.href = "./index.html"
    }, 2000)
  }
});


// Get the docid parameter from the URL
const urlParams = new URLSearchParams(window.location.search);
const docid = urlParams.get('docid');

// Use the docid as needed
console.log(docid); // Example: Print the docid to the console

// Reference the 'pengguna' document using the docid
const penggunaDocRef = doc(db, 'pengguna', docid);

// Fetch the document data
getDoc(penggunaDocRef)
  .then((docSnapshot) => {
    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();
      console.log(userData); // Example: Print the fetched document data to the console

      // Prefill the form fields with the document data
      document.getElementById('namaPenggunaInput').value = userData.nama;
      document.getElementById('noKadPengenalanInput').value = userData.noKadPengenalan;
      document.getElementById('noGajiInput').value = userData.noGaji;
      document.getElementById('emelMicrosoftInput').value = userData.emel;
      if (userData.statusPerkahwinan == 'berkahwin') {
        document.getElementById('berkahwin').checked = true;
      } else if (userData.statusPerkahwinan == 'bujang') {
        document.getElementById('bujang').checked = true;
      }
      // Add code to calculate and prefill the 'bakiRMInput' field based on the document data

    } else {
      console.log('Document does not exist');
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error);
  });

// Handle form submission
const updateUserForm = document.getElementById('updateUserForm');

updateUserForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Retrieve the updated form values
  const namaPengguna = document.getElementById('namaPenggunaInput').value;
  const noKadPengenalan = document.getElementById('noKadPengenalanInput').value;
  const noGaji = document.getElementById('noGajiInput').value;
  const emelMicrosoft = document.getElementById('emelMicrosoftInput').value;
  const statusPerkahwinan = document.querySelector('input[name="statusPerkahwinan"]:checked').value;

  // Retrieve other updated form values as needed

  // Update the document with the new values
  setDoc(penggunaDocRef, {
    nama: namaPengguna,
    noKadPengenalan: noKadPengenalan,
    noGaji: noGaji,
    emel: emelMicrosoft,
    statusPerkahwinan: statusPerkahwinan
    // Update other fields as needed
  }, { merge: true })
    .then(() => {
      console.log('Document successfully updated');
      // Redirect or perform other actions upon successful update
    })
    .catch((error) => {
      console.log('Error updating document:', error);
    });

  setTimeout(function () {
    location.href = "./admin.html"
  }, 2000)
});

const deleteButton = document.getElementById('padamButton');

deleteButton.addEventListener('click', (event) => {
  event.preventDefault();

  // Confirm action with alert
  if (confirm('Adakah anda pasti untuk memadam pengguna ini?')) {
    // Delete the document
    deleteDoc(penggunaDocRef)
      .then(() => {
        console.log('Document successfully deleted');
        // Redirect or perform other actions upon successful delete
      })
      .catch((error) => {
        console.log('Error deleting document:', error);
      });
  }

  setTimeout(function () {
    location.href = "./admin.html"
  }, 2000)

}
);