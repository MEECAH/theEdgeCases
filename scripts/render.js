import { handleSignupButton, handleLogoutButton, handleSigninButton, handlerCreateForm } from "./auth.js";
import { homeNavBarPublicRender, homeBodyPublicRender, numberOfNetworks, homeBodyPrivateRender, homeNavBarPrivateRender, contactPageRender } from "./home.js";

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

    setPage(page);

    //Home page
    // const $home = $("#homePage");
    // $home.on("click", setPage(1));

    //const $contact = $("#contactPage");

    // $contact.on("click", setPage(2));
    $("#contactPage").click(() => {
        setPage(2);
    });
    $("#homePage").click(() => {
        setPage(1);
    });

};


export const setPage = function (page) {
    const $body = $("#body");
    console.log($body);
    console.log(page);
    switch (page) {
        //Home page
        case 1:
            $body.html(homeBodyPrivateRender());

            // setting up guides from data base example
            const $guideList = $(".guides");

            //getting info from data base test and rendering results
            db.collection('guides').onSnapshot(snapshot => {
                $guideList.html(snapshot.docs.map(renderGuides));
            }, err => console.log(err.message));
            break;
        //Contact
        case 2:
            $body.html(contactPageRender());
            break;
    }
};


export const userPrivateInfo = function () {
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

export const renderGuides = function (doc) {
    console.log("Im here in render guides");

    if (doc.length < 1) {
        return ``;
    }
    const guide = doc.data();
    return `
    <div class="card">
    <div class="card-image">
      <figure class="image is-128x128">
        <img src="https://bulma.io/images/placeholders/128x128.png" alt="Placeholder image">
      </figure>
    </div>
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
          </figure>
        </div>
        <div class="media-content">
          <p class="title is-4">${guide.title}</p>
        </div>
      </div>
  
      <div class="content">
        ${guide.content}
        <br>
        <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
      </div>
    </div>
  </div>
    `;
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