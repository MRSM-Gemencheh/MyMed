import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, query, getDocs, where, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

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

      // Calculate starting allowance 
      const startingAllowance = userData.statusPerkahwinan === "bujang" ? 500 : 2000;

      let remainingAllowance = startingAllowance

      // Update allowance records table
      const rekodImbuhanTable = document.getElementById("rekodImbuhanTable");
      rekodImbuhanTable.innerHTML = ""; // Clear existing table rows


      userData.rekodImbuhan.forEach((rekod) => {
        const row = document.createElement("tr");

        const tarikh = new Date(rekod.tarikh);
        const options = { day: "numeric", month: "long", year: "numeric" };
        const formattedTarikh = tarikh.toLocaleDateString("ms-MY", options);

        // Calculate remaining allowance for each record
        const remainingAllowancePerRecord = remainingAllowance - rekod.imbuhan;

        // Update remaining allowance for the next record
        remainingAllowance = remainingAllowancePerRecord;

        let index = 1

        row.innerHTML = `
              <td>${index++}</td>
              <td>${formattedTarikh}</td>
              <td>${rekod.namaPenerima}</td>
              <td>${rekod.panelKlinik}</td>
              <td>${rekod.noResit}</td>
              <td>${'RM ' + rekod.imbuhan.toFixed(2)}</td>
              <td>${'RM ' + remainingAllowance.toFixed(2)}</td>
              <td><button class="button is-danger" id="padamRekodButton">Padam Rekod</button></td>
          `;

        rekodImbuhanTable.appendChild(row);

        // Handle delete button click

      });
      const padamRekodButton = document.getElementById('padamRekodButton');

      padamRekodButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Confirm action with alert
        if (confirm('Adakah anda pasti untuk memadam rekod ini?')) {

          // If item is the last item in the array, reset the array
          let rekodImbuhan = userData.rekodImbuhan

          if (rekodImbuhan.length == 1) {
            rekodImbuhan = []
          }

          // Find the correct item in array based on the the value in the first data cell of the row

          rekodImbuhan.splice(0, 1)


          // Update the document with the new values

          setDoc(penggunaDocRef, {
            rekodImbuhan: rekodImbuhan
            // Update other fields as needed
          }, { merge: true })
            .then(() => {
              console.log('Document successfully deleted');
              // Redirect or perform other actions upon successful delete
            })
            .catch((error) => {
              console.log('Error deleting document:', error);
            });
        }

        setTimeout(function () {
          location.reload()
        }, 2000)

      })

      const hantarAhliButton = document.getElementById('hantarAhliButton')

      hantarAhliButton.addEventListener('click', (event) => {

        // Get the values from the form

        const namaAhliKeluargaBaru = document.getElementById('namaAhliKeluargaBaru').value;
        const noKadPengenalanAhliKeluargaBaru = document.getElementById('noKadPengenalanAhliKeluargaBaru').value;
        const hubunganAhliKeluargaBaru = document.getElementById('hubunganAhliKeluargaBaru').value;

        // Get the existing array of ahliKeluarga from Firestore

        let ahliKeluargaLayak = userData.ahliKeluargaLayak

        // Add the new ahliKeluarga to the array

        ahliKeluargaLayak.push({
          nama: namaAhliKeluargaBaru,
          noKadPengenalan: noKadPengenalanAhliKeluargaBaru,
          hubungan: hubunganAhliKeluargaBaru
        })

        // Update the document with the new values

        setDoc(penggunaDocRef, {
          ahliKeluargaLayak: ahliKeluargaLayak,
          bilanganAhliKeluarga: userData.bilanganAhliKeluarga + 1
          // Update other fields as needed
        }, { merge: true })
          .then(() => {
            console.log('Document successfully updated');
            setTimeout(function () {
              location.reload()
            }, 2000)
            // Redirect or perform other actions upon successful update
          })
          .catch((error) => {
            console.log('Error updating document:', error);
          });



      })

      const ahliKeluargaLayakTable = document.getElementById("ahliKeluargaLayakTable");

      ahliKeluargaLayakTable.innerHTML = ""; // Clear existing table rows

      let index2 = 1

      userData.ahliKeluargaLayak.forEach((ahliKeluarga) => {
        const row = document.createElement("tr");

        row.innerHTML = `
              <td>${index2++}</td>
              <td>${ahliKeluarga.nama}</td>
              <td>${ahliKeluarga.noKadPengenalan}</td>
              <td>${ahliKeluarga.hubungan}</td>
              <td><button class="button is-danger" data-id="padamAhliKeluargaButton" data-index="${index2}">Padam Ahli Keluarga</button></td>
          `;
        ahliKeluargaLayakTable.appendChild(row);

        
        
      });
      // Handle delete button click

      // Select all buttons with the data-id 'padamAhliKeluargaButton'

      const padamAhliKeluargaButton = document.querySelector('[data-id="padamAhliKeluargaButton"]');

      padamAhliKeluargaButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Confirm action with alert
        if (confirm('Adakah anda pasti untuk memadam ahli keluarga ini?')) {

          // If item is the last item in the array, reset the array
          let ahliKeluargaLayak = userData.ahliKeluargaLayak

          if (ahliKeluargaLayak.length == 1) {
            ahliKeluargaLayak = []
          }

          // Find the correct item in array based on the data-index2 of the clicked button

          ahliKeluargaLayak.splice(0, 1)

          // Update the document with the new values

          setDoc(penggunaDocRef, {
            ahliKeluargaLayak: ahliKeluargaLayak

            // Update other fields as needed
          }, { merge: true })
            .then(() => {
              console.log('Document successfully deleted');

              setTimeout(function () {
                location.reload()
              }, 2000)
              // Redirect or perform other actions upon successful delete
            })
            .catch((error) => {
              console.log('Error deleting document:', error);
            });
        }



      })


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

