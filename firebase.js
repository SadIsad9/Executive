import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// 📌 Konfigurasi Firebase (diperbaiki)
const firebaseConfig = {
    apiKey: "AIzaSyCTyb-YVzizOUj6eMV2GoywQ7P_SeIaS0A",
    authDomain: "executive1-f9c84.firebaseapp.com",
    databaseURL: "https://executive1-f9c84-default-rtdb.asia-southeast1.firebasedatabase.app", // ✅ Tambahkan databaseURL
    projectId: "executive1-f9c84",
    storageBucket: "executive1-f9c84.appspot.com", // ✅ Perbaiki dari "firebasestorage.app"
    messagingSenderId: "241468644770",
    appId: "1:241468644770:web:c3310ca1519c16b75026fb"
};

// 🔥 Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
console.log("✅ Firebase Connected");

// 📌 Generate Device ID (Sederhana, bisa diganti dengan UUID)
const deviceID = localStorage.getItem("deviceID") || `device-${Math.random().toString(36).substr(2, 9)}`;
localStorage.setItem("deviceID", deviceID);
console.log("📌 Device ID:", deviceID);

// 📌 Fungsi Login
window.loginUser = function () {
    const usernameInput = document.getElementById("username");
    if (!usernameInput) return;

    const username = usernameInput.value.trim();
    if (!username) {
        alert("⚠ Nama tidak boleh kosong!");
        return;
    }

    const userRef = ref(database, "users/" + username);
    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();
            if (userData.deviceID !== deviceID) {
                alert("❌ Username ini sudah digunakan di perangkat lain!");
                return;
            }
        }

        // Simpan data user dengan Device ID
        set(userRef, {
            name: username,
            deviceID: deviceID
        }).then(() => {
            localStorage.setItem("username", username);
            window.location.href = "home.html";
        }).catch((error) => {
            console.error("❌ Gagal menyimpan user:", error);
        });
    });
};

// 📌 Fungsi Logout
window.logout = function () {
    localStorage.removeItem("username");
    window.location.href = "index.html";
};

// 📌 Event Listener untuk Home Page
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username") || "Pengguna";

    const displayName = document.getElementById("displayName");
    if (displayName) displayName.textContent = username;

    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitComment);
    }

    loadComments(); // Panggil fungsi untuk menampilkan komentar
});

// 📌 Fungsi Kirim Komentar
window.submitComment = function () {
    const messageInput = document.getElementById("message");
    if (!messageInput) return;

    const message = messageInput.value.trim();
    const username = localStorage.getItem("username") || "Anonim";

    if (message === "") {
        alert("⚠ Komentar tidak boleh kosong!");
        return;
    }

    push(ref(database, "comments"), {
        name: username,
        message: message,
        timestamp: Date.now()
    }).then(() => {
        messageInput.value = ""; // Bersihkan input setelah komentar terkirim
    }).catch((error) => {
        console.error("❌ Gagal mengirim komentar:", error);
    });
};

// 📌 Load Komentar
function loadComments() {
    const commentRef = ref(database, "comments");
    onValue(commentRef, (snapshot) => {
        const commentList = document.getElementById("comment-list");
        if (!commentList) return;

        commentList.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            const commentElement = document.createElement("div");
            commentElement.classList.add("border", "p-2", "mb-2", "bg-white", "text-dark");
            commentElement.innerHTML = `<strong>${data.name}:</strong> ${data.message}`;
            commentList.prepend(commentElement);
        });
    });
}