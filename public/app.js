import { getEl, onclick, trySendLink, trySignIn } from './helper.js';
import { auth, store } from './firebase.js';
import { fakerRU as faker } from 'https://cdn.skypack.dev/@faker-js/faker';

const fAuth = auth.getAuth();
const fStore = store.getFirestore();

const isTryingToSignIn = (new URLSearchParams(window.location.search)).get('mode') === 'signIn';

if (isTryingToSignIn) {
    trySignIn();
}

const whenSignedOut = getEl('#whenSignedOut');
const whenSignedIn = getEl('#whenSignedIn');
const signInBtn = getEl('#signInBtn');
const signOutBtn = getEl('#signOutBtn');
const userDetails = getEl('#userDetails');
const emailInput = getEl('#email');

const createThing = getEl('#createThing');
const thingList = getEl('#thingList');

let thingsRef;
let unsubscribe;

// console.log(store);

auth.onAuthStateChanged(fAuth, (user) => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.email}</h3><p>You're signed in!</p>`;

        thingsRef = store.collection(fStore, 'things');

        onclick(createThing, () => {
            const randomThing = `${faker.hacker.adjective()} ${faker.hacker.noun()}`;

            store.addDoc(thingsRef, {
                uid: user.uid,
                name: randomThing,
                createdAt: store.serverTimestamp()
            });

            const q = store.query(
                thingsRef,
                store.where('uid', '==', user.uid),
                store.orderBy('createdAt', 'asc')
            );

            unsubscribe = store
                .onSnapshot(
                    q,
                    querySnapshot => {
                        const items = querySnapshot.docs.map(doc => {
                            return `<li>${doc.data().name}</li>`;
                        });

                        thingList.innerHTML = items.join('');
                    });
        });
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';

        unsubscribe && unsubscribe();
    }
});

emailInput.addEventListener('focus', function () { this.classList.remove('is-invalid') });

onclick(signInBtn, () => {
    const email = emailInput.value;

    if (!email) {
        alert('Please, provide email.');
        emailInput.classList.add('is-invalid');
        return;
    }

    trySendLink(email);
});

onclick(signOutBtn, () => {
    auth.signOut(fAuth)
        .then(() => {
            console.log('You\'re signed out successfully.');
        }).catch((error) => {
            console.error(error);
        });
});
