import * as firebase from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js'

// Add Firebase products that you want to use
import * as auth from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js'
import * as store from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js'

import { FIREBASE_CONFIG } from './env.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: FIREBASE_CONFIG.apiKey,
    authDomain: "fir-test-a178f.firebaseapp.com",
    projectId: "fir-test-a178f",
    storageBucket: "fir-test-a178f.appspot.com",
    messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
    appId: FIREBASE_CONFIG.appId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export { firebase, auth, store }