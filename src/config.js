import * as firebase from 'firebase';
import '@firebase/auth'
import '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAFFKN2B79-78ULPk42azXgy94ZnQLPtBI",
    authDomain: "batch-5-note-app.firebaseapp.com",
    projectId: "batch-5-note-app",
    storageBucket: "batch-5-note-app.appspot.com",
    messagingSenderId: "514762676666",
    appId: "1:514762676666:web:368bc48091255217eb6583"
};

// it maintains the call one time
if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }