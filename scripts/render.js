import { handleSignupButton, handleLogoutButton, handleSigninButton } from "./auth.js";
import { homeNavBarPublicRender, homeBodyPublicRender, homeBodyPrivateRender, homeNavBarPrivateRender, userFormat } from "./home.js";
import { contactPageRender, simpleNavBar } from "./contact.js";
import { workPlaceRender, numberOfNetworks } from "./workSpace.js";

export const renderPage = function (user, page) {

    if (user) {
        allUsersInfo(user, page);
    } else {
        publicInfo();
    }
};
export const publicInfo = function () {
    // setup materialize components
    let modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    let items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    // signup
    const $signupForm = $("#signup-form");
    $signupForm.on("submit", handleSignupButton);

    // login
    const $loginForm = $('#login-form');
    $loginForm.on("submit", handleSigninButton);

    const $body = $("#body");
    $body.html(homeBodyPublicRender());
};

export const allUsersInfo = function (user, page) {

    // setup materialize components
    let modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);

    let items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    //log out
    const $logout = $("#logout");
    $logout.on("click", handleLogoutButton);

    //User account info
    renderAccountInfo(user);

    //Setting home page as default when rendering for first time
    if (page != -1) {
        setPage(page, user);
    }

    //Home page
    $("#homePage").click(() => {
        setPage(1, user);
    });

    //Contact page    
    $("#contactPage").click(() => {
        setPage(2, user);
    });

    //Work place page
    $("#workPlace").click(() => {
        setPage(3, user);
    });

};

export const setPage = function (page, user) {
    const $body = $("#body");
    const $root = $("#root");
    let networkCount = numberOfNetworks(user);

    switch (page) {
        //Home page
        case 1:
            $root.html(homeNavBarPrivateRender());
            $body.html(userFormat());
            homeBodyPrivateRender();
            allUsersInfo(user, -1);
            break;

        //Contact
        case 2:
            $root.html(simpleNavBar(networkCount));
            $body.html(contactPageRender());
            allUsersInfo(user, -1);
            break;

        //Work place
        case 3:
            $root.html(simpleNavBar(networkCount));
            workPlaceRender(user);
            allUsersInfo(user, -1);
            break;
    }
};

export const renderAccountInfo = function (user) {
    // account info
    const $accountDetails = $(".account-details");

    db.collection('users').doc(user.uid).get().then(doc => {
        const html = `
            <div class="card" id="userAcc">  
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">${user.email}</p>
                        </div>                        
                    </div>
                    <div class="media-content">
                            <p class="subtitle is-6"> ${doc.data().bio}</p>
                    </div>
                    <br>                    
                    <a href="#" id="editUser" data-id="${user.uid}" class="card-footer-item modal-trigger btn yellow darken-2 z-depth-0" data-target="modal-userEdit">Edit</a>
                </div>
            </div>

            <!-- EDIT MODAL -->
            <div class="modal" id="modal-userEdit" >
                <div class="modal-content">
                    <br>
                    <p class="subtitle is-4">Edit Account</p>
                    <form id="edit-userForm">                
                        <div class="input-field">
                            <input type="text" id="edit-name">
                            <label for="edit-name">Name</label>
                        </div>
                        <div class="input-field">
                            <input type="text" id="edit-bio">
                            <label for="edit-bio">Edit bio</label>
                        </div>
                        <br>
                        <div class="file has-name is-fullwidth">
                            <label class="file-label">
                                <input class="file-input" type="file" value="upload" id="pic">
                                <span class="file-cta">
                                    <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                    </span>
                                    <span class="file-label">
                                        Choose a pic…
                                    </span>
                                </span>
                                <span class="file-name">
                                </span>
                            </label>
                        </div>
                        <br>
                        <button id="saveUserButton" class="btn yellow darken-2 z-depth-0">Save</button>
                    </form>
                </div>
            </div>
        `;
        $accountDetails.html(html);
    }).then(() => {
        let modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
        let $editUserForm = $("#edit-userForm");

        // Save changes
        $editUserForm.submit(() => handleEditUserButton(event, user));
    });
};

export const handleEditUserButton = function (event, user) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form['edit-name'].value;
    const bio = form['edit-bio'].value;
    let picButton = form['pic'];

    //TO DO!!!
    //Uploading images
    // picButton.addEventListener('change', function (e) {
    //     console.log("here");
    //     let file = e.target.files[0];
    //     let storageRef = storage.ref('users/images/' + file.name);
    //     let task = storageRef.put(file).then(function(snapshot) {
    //     console.log('Uploaded a blob or file!');
    // });

    //     File name is 'space.jpg'
    // let name = storageRef.name;
    // });

    let userName;
    let userBio;

    db.collection('users').doc(user.uid).get().then(doc => {
        userName = doc.data().name;
        userBio = doc.data().bio;
    }).then(() => {
        db.collection('users').doc(user.uid).update({
            name: (name.length > 0) ? name : userName,
            bio: (bio.length > 0) ? bio : userBio,
        }).then(() => {
            renderAccountInfo(user);
        });
    });
};

export const loadPageIntoDOM = function () {

    const $root = $("#root");

    // listen for auth status changes
    auth.onAuthStateChanged(user => {
        //rendering page if user logged in
        if (user) {
            $root.html(homeNavBarPrivateRender());
            renderPage(user, 1);
        } else {
            //rendering page if user logged out
            $root.html(homeNavBarPublicRender());
            renderPage();
        }
    });

    //TO DO !!!!!!!
    // Nav bar sticky
    /*
    window.onscroll = function () { myFunction() };

    let navbar = $("#navBar");
    let sticky = navbar.offsetTop;

    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }
*/

};
/**
 * Use jQuery to execute the loadPageIntoDOM function after the page loads
 */
$(function () {
    loadPageIntoDOM();
});