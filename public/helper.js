import { auth } from './firebase.js';

const fAuth = auth.getAuth();

function getEl(selector) {
    return document.querySelector(selector);
}

function onclick(elem, callback) {
    elem.addEventListener('click', (e) => {
        e.preventDefault();

        callback();
    });
}

const trySendLink = (email) => {
    // const host = 'http://localhost:5500';
    const host = 'https://fir-test-a178f.web.app';

    auth.sendSignInLinkToEmail(fAuth, email, {
        url: `${host}/index.html`,
        handleCodeInApp: true
    })
        .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', email);
            alert('Confirmation was sent to your email.');
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === 'auth/invalid-email') {
                alert('Email is invalid. Please provide a valid email.');
                const emailInput = getEl('#email');
                emailInput.classList.add('is-invalid');
            } else {
                console.error(errorCode, errorMessage);
            }

        });
}

const trySignIn = () => {
    if (auth.isSignInWithEmailLink(fAuth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please provide your email for confirmation');
        }
        auth.signInWithEmailLink(fAuth, email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                console.log('Compare 2 objects. ', auth.getAuth().currentUser === fAuth.currentUser);
                // You can access the new user via result.user
                // Additional user info profile not available via:
                // result.additionalUserInfo.profile == null
                // You can check if the user is new or existing:
                // result.additionalUserInfo.isNewUser
            })
            .catch((error) => {
                // Some error occurred, you can inspect the code: error.code
                // Common errors could be invalid email and invalid or expired OTPs.
                console.error(error);
            });
    } else {
        console.error('Wrong attempt to sign in.');
    }
}

export { getEl, onclick, trySendLink, trySignIn };