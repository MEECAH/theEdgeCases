import { handleSignupButton, handleLogoutButton, handleSigninButton, handlerCreateForm } from "./auth.js";
import { homeNavBarPublicRender, homeBodyPublicRender, numberOfNetworks, homeBodyPrivateRender, homeNavBarPrivateRender, userFormat } from "./home.js";
import { contactPageRender, simpleNavBar } from "./contact.js";
import { workPlaceRender } from "./workSpace.js";

export const renderPage = function (user, page) {

    if (user) {
        allUsersInfo(user, page);
        //Check for user id and display user private info
        // userPrivateInfo(user);
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
    const $accountDetails = $(".account-details");
    renderAccountInfo($accountDetails, user);

    //creating new guides and storing them in the data base
    const $createForm = $("#create-form");
    $createForm.on("submit", handlerCreateForm);

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
            $root.html(simpleNavBar());
            $body.html(contactPageRender());
            allUsersInfo(user, -1);
            break;

        //Work place
        case 3:
            $root.html(simpleNavBar());
            workPlaceRender(user);
            allUsersInfo(user, -1);
            break;
    }
};

export const renderAccountInfo = function ($accountDetails, user) {
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
        const html = `
            <div class="card">  
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
                    <div class="content"> ${doc.data().bio}
                    </div>
                </div>
            </div>
        `;
        $accountDetails.html(html);
    });
};

export const loadPageIntoDOM = async function () {

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