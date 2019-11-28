export const handleSignupButton = function (event) {

    event.preventDefault();
    const form = event.currentTarget;
    const name = form['signup-name'].value;
    const email = form['signup-email'].value;
    const password = form['signup-password'].value;

    // sign up the user & add firestore data
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            name: name,
            email: email,
            bio: form['signup-bio'].value,
            pic: "",
        });
    }).then(() => {
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        form.reset();
    }).catch(err => alert(err.message));
};

export const handleLogoutButton = function (event) {

    event.preventDefault();
    auth.signOut().then(() => {
    }).catch(err => alert(err));
};

export const handleSigninButton = function (event) {

    event.preventDefault();
    // get user info
    const form = event.currentTarget;
    const email = form['login-email'].value;
    const password = form['login-password'].value;

    // log the user in
    auth.signInWithEmailAndPassword(email, password).then((cred) => {
        // close the signup modal & reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        form.reset();
    }).catch(err => alert(err.message));
};

