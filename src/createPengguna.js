import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

// Dynamically add more fields to the 'maklumatAhliKeluarga' field for more family members
// Each family member should have a name, no kad pengenalan and hubungan field

// Get the elements from the DOM on page load
document.addEventListener('DOMContentLoaded', function () {

  const bilanganAhliKeluargaElement = document.getElementById('bilanganAhliKeluargaInput');

  bilanganAhliKeluargaElement.addEventListener('change', () => {

    // Dynamically add more fields to the 'maklumatAhliKeluarga' field for more family members
    // Each family member should have a name, no kad pengenalan and hubungan field

    let maklumatAhliKeluarga = document.getElementById('maklumatAhliKeluarga');

    maklumatAhliKeluarga.innerHTML = "";

    for (let i = 0; i < bilanganAhliKeluargaElement.value; i++) {

      let ahliKeluarga = document.createElement('div');
      ahliKeluarga.classList.add('ahliKeluarga');
      ahliKeluarga.classList.add('field');

      let namaAhliKeluarga = document.createElement('input');
      namaAhliKeluarga.setAttribute('type', 'text');
      namaAhliKeluarga.setAttribute('placeholder', 'Nama Ahli Keluarga ' + (i + 1));
      namaAhliKeluarga.setAttribute('id', 'namaAhliKeluarga' + i);
      namaAhliKeluarga.setAttribute('class', 'input')

      let noKadPengenalanAhliKeluarga = document.createElement('input');
      noKadPengenalanAhliKeluarga.setAttribute('type', 'text');
      noKadPengenalanAhliKeluarga.setAttribute('placeholder', 'No Kad Pengenalan Ahli Keluarga ' + (i + 1));
      noKadPengenalanAhliKeluarga.setAttribute('id', 'noKadPengenalanAhliKeluarga' + i);
      noKadPengenalanAhliKeluarga.setAttribute('class', 'input')

      let hubunganAhliKeluarga = document.createElement('input');
      hubunganAhliKeluarga.setAttribute('type', 'text');
      hubunganAhliKeluarga.setAttribute('placeholder', 'Hubungan Ahli Keluarga ' + (i + 1));
      hubunganAhliKeluarga.setAttribute('id', 'hubunganAhliKeluarga' + i);
      hubunganAhliKeluarga.setAttribute('class', 'input')

      ahliKeluarga.appendChild(namaAhliKeluarga);
      ahliKeluarga.appendChild(noKadPengenalanAhliKeluarga);
      ahliKeluarga.appendChild(hubunganAhliKeluarga);

      maklumatAhliKeluarga.appendChild(ahliKeluarga);
    }

  });


});




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

  let rekodImbuhan = []

  const bilanganAhliKeluargaElement = document.getElementById('bilanganAhliKeluargaInput');

  let ahliKeluargaLayak = []

  // Store all of the ahli keluarga information as objects in the 'ahliKeluargaLayak' array

  for (let i = 0; i < bilanganAhliKeluargaElement.value; i++) {

    let namaAhliKeluarga = document.getElementById('namaAhliKeluarga' + i).value
    let noKadPengenalanAhliKeluarga = document.getElementById('noKadPengenalanAhliKeluarga' + i).value
    let hubunganAhliKeluarga = document.getElementById('hubunganAhliKeluarga' + i).value

    let ahliKeluarga = {
      nama: namaAhliKeluarga,
      noKadPengenalan: noKadPengenalanAhliKeluarga,
      hubungan: hubunganAhliKeluarga
    }

    ahliKeluargaLayak.push(ahliKeluarga)
  }


  try {
    const penggunaData = {
      nama: nama,
      noKadPengenalan: noKadPengenalan,
      emel: emel,
      noGaji: noGaji,
      statusPerkahwinan: statusPerkahwinan,
      rekodImbuhan: rekodImbuhan,
      ahliKeluargaLayak: ahliKeluargaLayak,
      bilanganAhliKeluarga: document.getElementById('bilanganAhliKeluargaInput').value
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

