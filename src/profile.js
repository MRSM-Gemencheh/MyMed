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

const db = getFirestore();


auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in, you can access the user object
        console.log(user);


        const userEmail = user.email;
        const usersCollectionRef = collection(db, "pengguna");
        const queryRef = query(usersCollectionRef, where("emel", "==", userEmail));

        getDocs(queryRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("User document:", doc.data());

                    // Update profile information
                    const namaPengguna = document.getElementById("namaPengguna");
                    const noGajiDanJawatan = document.getElementById("noGajiDanJawatan");
                    const gambarPengguna = document.getElementById("gambarPengguna");

                    namaPengguna.textContent = doc.data().nama;
                    noGajiDanJawatan.textContent = `No. Gaji: ${doc.data().noGaji} | ${doc.data().jawatan}`;
                    gambarPengguna.src = user.photoURL;

                    // Starting allowance is RM 500 if 'statusPerkahwinan' is false, and RM 2000 otherwise
                    // To get the amount for bakiElaun, subtract the starting allowance with the total spending in 'rekodKlinik' 

                    // Calculate allowance balance
                    const startingAllowance = doc.data().statusPerkahwinan ? 2000 : 500;
                    const totalSpending = doc.data().rekodKlinik.reduce(
                        (total, rekod) => total + rekod.jumlah,
                        0
                    );
                    const remainingAllowance = startingAllowance - totalSpending;

                    // Update allowance balance
                    const bakiElaun = document.getElementById("bakiElaun");
                    bakiElaun.textContent = `Baki Elaun Panel: RM ${remainingAllowance.toFixed(2)}`;

                    // Update allowance records table
                    const rekodElaunTable = document.getElementById("rekodElaunTable");
                    rekodElaunTable.innerHTML = ""; // Clear existing table rows

                    let i = 0

                    doc.data().rekodKlinik.forEach((rekod) => {
                        const row = document.createElement("tr");
                        
                        const tarikh = new Date(rekod.tarikh.seconds * 1000);
                        const options = { day: "numeric", month: "long", year: "numeric" };
                        const formattedTarikh = tarikh.toLocaleDateString("ms-MY", options);
                        
                        row.innerHTML = `
                            <th>${++i}</th>
                            <td>${formattedTarikh}</td>
                            <td>${rekod.lokasi}</td>
                            <td>${rekod.jumlah}</td>
                        `;
                        
                        rekodElaunTable.appendChild(row);
                    });
                });
            })
            .catch((error) => {
                console.log("Error getting user document:", error);
            });

        userName.textContent = user.displayName;
        signInButton.style.display = "none"
        signOutButton.style.display = "block"
    } else {
        // User is signed out
        console.log("User is not logged in");
    }
});
