/**
 * Created by alexander.polyakov on 06.04.2018.
 */

importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.6.8/firebase-messaging.js');

const sender_id = '490539703531';

firebase.initializeApp({
    messagingSenderId: sender_id
});

// const messaging = firebase.messaging();

// var config = {
//     // apiKey: "AIzaSyA74SO-VItVKOC7turpAgEV7sc4w3iYoPc",
//     // authDomain: "web-push-test-7141d.firebaseapp.com",
//     // databaseURL: "https://web-push-test-7141d.firebaseio.com",
//     // projectId: "web-push-test-7141d",
//     // storageBucket: "web-push-test-7141d.appspot.com",
//     messagingSenderId: "490539703531"
// };
// firebase.initializeApp(config);

// const messaging = firebase.messaging();
//
// messaging.setBackgroundMessageHandler(function(payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     var notificationTitle = 'Background Message Title';
//     var notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };
//
//     return self.registration.showNotification(notificationTitle,
//         notificationOptions);
// });