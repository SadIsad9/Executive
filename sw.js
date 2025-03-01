self.addEventListener("install", event => {
    console.log("🛠️ Service Worker terinstal!");
    self.skipWaiting();
});

self.addEventListener("activate", event => {
    console.log("✅ Service Worker aktif!");
});

self.addEventListener("push", event => {
    const options = {
        body: "Notifikasi dari Service Worker aktif!",
        icon: "Assets/icon.png"
    };
    event.waitUntil(
        self.registration.showNotification("🔥 Notifikasi Aktif!", options)
    );
});
