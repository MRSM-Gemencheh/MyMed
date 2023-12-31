import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, query, getDocs, where } from "firebase/firestore";

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

        const userEmail = user.email;
        const usersCollectionRef = collection(db, "pengguna");
        const userQueryRef = query(usersCollectionRef, where("emel", "==", userEmail));

        getDocs(userQueryRef)
            .then((querySnapshot) => {

                // If queryRef isn't null, then set #hideMe display to 'block'
                if (!querySnapshot.empty) {
                    // If query has results, set the display of #hideMe to 'block'
                    const hideMeElement = document.getElementById('hideMe');
                    hideMeElement.style.display = 'block';

                    document.getElementById('pleaseRegister').style.display = "none"
                }

                querySnapshot.forEach((doc) => {

                    // Update profile information
                    const namaPengguna = document.getElementById("namaPengguna");
                    const noGaji = document.getElementById("noGaji");

                    namaPengguna.textContent = doc.data().nama;
                    noGaji.textContent = `No. Gaji: ${doc.data().noGaji}`;

                    const noKadPengenalan = document.getElementById('noKadPengenalan')
                    noKadPengenalan.textContent = `No. Kad Pengenalan: ${doc.data().noKadPengenalan}`

                    const ahliKeluargaLayak = document.getElementById('ahliKeluargaLayak')
                    ahliKeluargaLayak.innerHTML = "" // Empty the table first

                    // Check if user has family members

                    if (doc.data().ahliKeluargaLayak.length > 0) {
                        // The first table row should always be the user itself

                        let i = 1

                        const firstRow = document.createElement("tr");

                        firstRow.innerHTML = `
                            <td>${i++}</td>
                            <td>${doc.data().nama || "-"}</td>
                            <td>${doc.data().noKadPengenalan || "-"}</td>
                            <td>SENDIRI</td>
                        `;

                        ahliKeluargaLayak.appendChild(firstRow);


                        // Add a new table row for each family member

                        doc.data().ahliKeluargaLayak.forEach((ahli) => {
                            const row = document.createElement("tr");

                            row.innerHTML = `
                                <td>${i++}</td>
                                <td>${ahli.nama}</td>
                                <td>${ahli.noKadPengenalan}</td>
                                <td>${ahli.hubungan}</td>
                            `;
                            ahliKeluargaLayak.appendChild(row);
                        });
                    } else {
                        // If user has no family members, the table should contain the user itself

                        const row = document.createElement("tr");

                        row.innerHTML = `
                            <td>1</td>
                            <td>${doc.data().nama}</td>
                            <td>${doc.data().noKadPengenalan}</td>
                            <td>SENDIRI</td>
                        `;

                        ahliKeluargaLayak.appendChild(row);

                    }

                    // Calculate starting allowance 
                    const startingAllowance = doc.data().statusPerkahwinan === "bujang" ? 500 : 2000;
                    document.getElementById('kelayakanPeruntukan').textContent = `Kelayakan Peruntukan: RM ${startingAllowance.toFixed(2)}`
                    document.getElementById('bakiPeruntukanAwal').textContent = `Baki Peruntukan Pada Awal Tahun: RM ${startingAllowance.toFixed(2)}`
                    const totalSpending = doc.data().rekodImbuhan.reduce(
                        (total, rekod) => total + rekod.imbuhan,
                        0
                    );
                    let remainingAllowance = startingAllowance - totalSpending;

                    // Update allowance balance
                    const bakiElaun = document.getElementById("bakiElaun");
                    bakiElaun.textContent = `Baki Peruntukan Terkini: RM ${remainingAllowance.toFixed(2)}`;


                    // Update rekod imbuhan table
                    const rekodImbuhanTable = document.getElementById("rekodImbuhanTable");
                    rekodImbuhanTable.innerHTML = ""; // Clear existing table rows

                    remainingAllowance = remainingAllowance + totalSpending

                    doc.data().rekodImbuhan.forEach((rekod) => {
                        const row = document.createElement("tr");

                        const tarikh = new Date(rekod.tarikh);
                        const options = { day: "numeric", month: "long", year: "numeric" };
                        const formattedTarikh = tarikh.toLocaleDateString("ms-MY", options);

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

async function checkAdminStatus() {
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
                document.getElementById('adminButton').style.display = 'none'
            }
        })
        .catch((error) => {
            console.log("Error getting admin collection:", error);
        });
}