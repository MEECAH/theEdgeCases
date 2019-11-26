export const homeNavBarPublicRender = function () {

    let numberOfNetworks = 0;

    return `
    <!-- NAVBAR -->
    <nav class=" z-depth-0 white lighten-4" id="navBar">
        <div id="networks" class="content is-family-sans-serif has-text-weight-medium has-text-white">
            <p>We have trainned ${numberOfNetworks} networks!!</p>
        </div>
        <div class="nav-wrapper container">
            <a href="#" class="brand-logo">
                <img src="img/logo.png" style="width: 50px; height: 50px; margin-top: 5px;">
            </a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li class="logged-out">
                    <a href="#" class="grey-text modal-trigger" data-target="modal-login">Login</a>
                </li>
                <li class="logged-out">
                    <a href="#" class="grey-text modal-trigger" data-target="modal-signup">Sign up</a>
                </li>
            </ul>
        </div>
    </nav>  
    <!-- SIGN UP MODAL -->
    <div id="modal-signup" class="modal">
        <div class="modal-content">
            <h4>Sign up</h4><br />
            <form id="signup-form">                
                <div class="input-field">
                    <input type="text" id="signup-name" required />
                    <label for="signup-name">Name</label>
                </div>
                <div class="input-field">
                    <input type="email" id="signup-email" required />
                    <label for="signup-email">Email address</label>
                </div>
                <div class="input-field">
                    <input type="password" id="signup-password" required />
                    <label for="signup-password">Choose password</label>
                </div>
                <div class="input-field">
                    <input type="text" id="signup-bio" required />
                    <label for="signup-bio">One Line Bio</label>
                </div>
                <button id="signupButton" class="btn yellow darken-2 z-depth-0">Sign up</button>
            </form>
        </div>
    </div>
  
    <!-- LOGIN MODAL -->
    <div id="modal-login" class="modal">
        <div class="modal-content">
            <h4>Login</h4><br />
            <form id="login-form">
                <div class="input-field">
                    <input type="email" id="login-email" required />
                    <label for="login-email">Email address</label>
                </div>
                <div class="input-field">
                    <input type="password" id="login-password" required />
                    <label for="login-password">Your password</label>
                </div>
                <button class="btn yellow darken-2 z-depth-0">Login</button>
            </form>
        </div>
    </div>    
`;

};

export const homeBodyPublicRender = function () {

    return `
    <div class="card">
        <div class="content has-text-centered">
            <figure class="image">
                <img src="img/laptop1.jpg" alt="Placeholder image" style="width: 500px; height: 300px; margin-top: 50px">
            </figure>
        </div>
        <div class="card-content">
            <div class="content has-text-centered is-family-sans-serif has-text-weight-medium has-text-grey-dark is-size-3">
                Harness the power of machine learning for your application needs. 
                Just configure the kind of network you want, we will do the rest.
                <br>
            </div>            
        </div>
    </div>
    `;
};

//TO DO
export const numberOfNetworks = function () {

};

export const homeNavBarPrivateRender = function () {

    return `    
    <!-- NAVBAR -->
    <nav class=" z-depth-0 white lighten-4" id="navBar">
        <div class="nav-wrapper container">
            <a href="#" class="brand-logo">
                <img src="img/logo.png" style="width: 50px; height: 50px; margin-top: 5px;">
            </a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li class="logged-in">
                    <a href="#" id="homePage" class="grey-text">Home</a>
                </li>                
                <li class="logged-in">
                    <a href="#" class="grey-text modal-trigger" data-target="modal-account">Account</a>
                </li>
                <li class="logged-in">
                    <a href="#" id="workPlace" class="grey-text">Work Place</a>
                </li>
                <li class="logged-in">
                    <a href="#" id="contactPage" class="grey-text">Contact Us</a>
                </li>
                <li class="logged-in">
                    <a href="#" class="grey-text" id="logout">Logout</a>
                </li>
            </ul>
            <div class="search-container">
                <form action="/action_page.php">
                    <input type="text" placeholder="Search.." name="search">
                </form>
            </div>
        </div>
    </nav>  

    <!-- ACCOUNT MODAL -->
    <div id="modal-account" class="modal">
        <div class="modal-content center-align">
            <h4>Account details</h4><br />
            <div class="account-details"></div>
        </div>
    </div>
  
    <!-- CREATE GUIDE MODAL -->
    <div id="modal-create" class="modal">
        <div class="modal-content">
            <h4>Create Guide</h4><br />
            <form id="create-form">
                <div class="input-field">
                    <input type="text" id="title" required>
                    <label for="title">Guide Title</label>
                </div>
                <div class="input-field">
                    <textarea id="content" class="materialize-textarea" required></textarea>
                    <label for="content">Guide Content</label>
                </div>
                <button class="btn yellow darken-2 z-depth-0">Create</button>
            </form>
        </div>
    </div>    
`;
}

export const homeBodyPrivateRender = function () {
    const $usersList = $(".users");

    db.collection('users').onSnapshot(snapshot => {
        $usersList.html(snapshot.docs.map(renderUsers));
    }, err => console.log(err.message));

};

export const userFormat = function () {

    return `
        <!-- USER LIST -->
        <div class="container" style="margin-top: 40px;">
            <ul class="collapsible z-depth-0 users" style="border: none;">
            </ul>
        </div>
    `;
};

export const renderUsers = function (doc) {

    if (doc.length < 1) {
        return ``;
    }
    const user = doc.data();
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
          <p class="title is-4">${user.name}</p>
          <p class="title is-6">${user.email}</p>
        </div>
      </div>
  
      <div class="content">
        ${user.bio}
        <br>
      </div>
    </div>
  </div>  
    `;
};

