import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
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

// Create a function to calculate the remaining balance
function calculateRemainingBalance(user) {
    const peruntukanAwal = user.statusPerkahwinan === 'bujang' ? 500 : 2000;
    const sortedRekodImbuhan = user.rekodImbuhan.sort((a, b) => {
        const dateA = new Date(a.tarikhImbuhan);
        const dateB = new Date(b.tarikhImbuhan);
        return dateB - dateA;
    });
    const latestImbuhan = sortedRekodImbuhan[0].tarikh;
    const totalSpending = sortedRekodImbuhan.reduce((total, imbuhan) => total + imbuhan, 0);
    return peruntukanAwal - totalSpending;
}

// Create a function to render the user data in the table
function renderUserData(data) {
    penggunaTable.innerHTML = ''; // Clear existing table data

    data.forEach((doc, index) => {
        const user = doc.data();

        const sortedRekodImbuhan = user.rekodImbuhan.sort((a, b) => {
            const dateA = new Date(a.tarikhImbuhan);
            const dateB = new Date(b.tarikhImbuhan);
            return dateB - dateA;
        });
        const latestImbuhan = sortedRekodImbuhan[0].tarikh;
        // Calculate starting allowance 
        const startingAllowance = user.statusPerkahwinan === "bujang" ? 500 : 2000;
        const totalSpending = doc.data().rekodImbuhan.reduce(
            (total, rekod) => total + rekod.imbuhan,
            0
        );
        let remainingAllowance = startingAllowance - totalSpending;

        const remainingBalance = calculateRemainingBalance(user);
        const row = document.createElement('tr');
        row.innerHTML = `
        <th>${index + 1}</th>
        <td>${user.nama}</td>
        <td>${latestImbuhan}</td>
        <td>RM ${remainingAllowance.toFixed(2)}</td>
        <td><a class="button is-link" href="kemaskiniPengguna.html?docid=${doc.id}"><span><i class="fa-solid fa-gear"></i></span><span class="ml-1">Kemaskini</span></a></td>
      `;
        penggunaTable.appendChild(row);
    });
}

// ...

// Load user data from Firestore and populate the table
const penggunaCollectionRef = collection(db, 'pengguna');
const userDataQuery = query(penggunaCollectionRef);

getDocs(userDataQuery)
    .then((querySnapshot) => {
        const userData = [];
        querySnapshot.forEach((doc) => {
            userData.push(doc);
        });
        renderUserData(userData);
    })
    .catch((error) => {
        console.log("Error getting user data:", error);
    });


