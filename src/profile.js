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
        // User is signed in, you can access the user object
        console.log(user);

        const accessToken = user.accessToken
        const userEmail = user.email;
        const usersCollectionRef = collection(db, "pengguna");
        const queryRef = query(usersCollectionRef, where("emel", "==", userEmail));

        getDocs(queryRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("User document:", doc.data());

                    // Update profile information
                    const namaPengguna = document.getElementById("namaPengguna");
                    const noGaji = document.getElementById("noGaji");

                    namaPengguna.textContent = doc.data().nama;
                    noGaji.textContent = `No. Gaji: ${doc.data().noGaji}`;

                    // peruntukanAwal is RM 500 if 'statusPerkahwinan' is 'bujang', and RM 2000 otherwise
                    // To get the amount for baki RM, subtract the starting allowance with the total spending in 'rekodKlinik' 

                    // Calculate starting allowance 
                    const startingAllowance = doc.data().statusPerkahwinan === "bujang" ? 500 : 2000;
                    const totalSpending = doc.data().rekodImbuhan.reduce(
                        (total, rekod) => total + rekod.imbuhan,
                        0
                    );
                    let remainingAllowance = startingAllowance - totalSpending;

                    // Update allowance balance
                    const bakiElaun = document.getElementById("bakiElaun");
                    bakiElaun.textContent = `Baki Peruntukan Terkini: RM ${remainingAllowance.toFixed(2)}`;

                    // Update allowance records table
                    const rekodImbuhanTable = document.getElementById("rekodImbuhanTable");
                    rekodImbuhanTable.innerHTML = ""; // Clear existing table rows

                    doc.data().rekodImbuhan.forEach((rekod) => {
                        const row = document.createElement("tr");

                        const tarikh = new Date(rekod.tarikh);
                        const options = { day: "numeric", month: "long", year: "numeric" };
                        const formattedTarikh = tarikh.toLocaleDateString("ms-MY", options);


                        // ChatGPT: Implement the automatic calculation of remaining allowance per each record here

                        // Calculate remaining allowance for each record
                        const remainingAllowancePerRecord = remainingAllowance - rekod.imbuhan;

                        // Update remaining allowance for the next record
                        remainingAllowance = remainingAllowancePerRecord;

                        row.innerHTML = `
                            <td>${formattedTarikh}</td>
                            <td>${rekod.namaPenerima}</td>
                            <td>${rekod.panelKlinik}</td>
                            <td>${rekod.noResit}</td>
                            <td>${'RM ' + rekod.imbuhan.toFixed(2)}</td>
                            <td>${'RM ' + remainingAllowance.toFixed(2)}</td>
                        `;

                        rekodImbuhanTable.appendChild(row);
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting user document:", error);
            });

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








