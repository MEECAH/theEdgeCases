
let $editForm;

export const workPlaceRender = function (user) {
    let modals;
    const $body = $("#body");
    $body.html(renderCreateNetworksArea());
    const $networks = $("#neurons");

    //Loading existing networks to DOM
    db.collection('users').doc(user.uid).collection('networks').orderBy('title').onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            $networks.html(snapshot.docs.map(renderNetworksArea));
        });
        modals = document.querySelectorAll('.modal');
        M.Modal.init(modals);
        $editForm = $("#edit-form");
        let $box = $(".box");
        let networkId;

        // Edit
        $box.on("click", "#editNetwork", () => {
            networkId = $(event.target);
        });

        // Delete
        $box.on("click", "#deleteNetwork", () => {
            event.preventDefault();
            networkId = $(event.target);
            handleDeleteButton(user, networkId);
        });

        //Save
        $editForm.submit(() => handleSaveButton(event, user, networkId));

    }, err => console.log(err.message));

    // submit
    const $submit = $("#submit");
    $submit.click(() => handleSubmitButton(event, user));

    // clear
    const $clear = $("#clear");
    $clear.click(() => handleClearButton(event));
}

//Deleting networks from firestore
export const handleDeleteButton = function (user, network) {
    event.preventDefault();
    const networkId = network[0].getAttribute('data-id');
    db.collection('users').doc(user.uid).collection('networks').doc(networkId).delete();
};

//Editing saved network
export const handleSaveButton = function (event, user, network) {
    event.preventDefault();

    const form = event.currentTarget;
    const title = form['edit-title'].value;
    const description = form['edit-description'].value;
    const networkId = network[0].getAttribute('data-id');
    let userTitle;
    let userDescription;

    db.collection('users').doc(user.uid).collection('networks').doc(networkId).get().then(doc => {
        userTitle = doc.data().title;
        userDescription = doc.data().description;
    }).then(() => {
        db.collection('users').doc(user.uid).collection('networks').doc(networkId).update({
            title: (title.length > 0) ? title : userTitle,
            description: (description.length > 0) ? description : userDescription,
        });
    });
};

//Submitting new network
export const handleSubmitButton = function (event, user) {
    event.preventDefault();
    event.stopPropagation();

    const form = $("#network-form");
    const title = form[0]['title'].value;
    const description = form[0]['description'].value;

    db.collection('users').doc(user.uid).collection('networks').add({
        title: title,
        description: description
    }).then(() => {
        handleClearButton();
    }).catch(err => {
        alert(err.message);
    });
};

//Clearing form
export const handleClearButton = function (event) {
    if (event != null) {
        event.preventDefault();
    }
    const form = $("#network-form");
    form[0]['title'].value = "";
    document.getElementById("description").value = "";
};

//Loading content into DOM

export const renderCreateNetworksArea = function () {

    return `    
        <div class="columns">    
            <div id="neurons">
            </div>
        <div class="column">
            <div class="box">
                <form id="network-form">
                    <div class="field">
                        <label class="label">Title</label>
                        <div class="control">
                            <input id="title" class="input" type="text" placeholder="Enter title for your network" required/>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">To check</label>
                        <div class="control">
                            <input class="input" type="text" placeholder="Enter text" required/>
                        </div>
                    </div>                
          
                    <div class="field">
                        <label class="label">Subject</label>
                        <div class="control">
                             <div class="select">
                                <select>
                                    <option>Select dropdown</option>
                                    <option>With options</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label">Subject2</label>
                        <div class="control">
                            <div class="select">
                                <select>
                                    <option>Select dropdown</option>
                                    <option>With options</option>
                                </select>
                            </div>
                        </div>
                    </div>
          
                    <div class="field">
                        <label class="label">Short Description</label>
                        <div class="control">
                            <textarea id="description" class="textarea" placeholder="Textarea"></textarea>
                        </div>
                    </div>

                    <div class="file has-name is-fullwidth">
                        <label class="file-label">
                            <input class="file-input" type="file" name="resume">
                            <span class="file-cta">
                                <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                </span>
                                <span class="file-label">
                                    Choose a file…
                                </span>
                            </span>
                            <span class="file-name">
                                Screen Shot 2017-07-29 at 15.54.25.png
                            </span>
                        </label>
                    </div>
          
                    <div class="field">
                        <div class="control">
                            <label class="checkbox">
                                <input type="checkbox">
                                I agree to the <a href="#">terms and conditions</a>
                            </label>
                        </div>
                    </div>

                    <div class="field">
                        <div class="control">
                            <label class="radio">
                                <input type="radio" name="question">
                                Yes
                            </label>
                            <label class="radio">
                                <input type="radio" name="question">
                                No
                            </label>
                        </div>
                    </div>
          
                    <div class="field is-grouped">
                        <div class="control">
                            <button id="submit" class="button is-link" type="submit">Submit</button>
                        </div>
                        <div class="control">
                            <button id="clear" class="button is-link is-light" type="buttom">Clear</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
};

export const renderNetworksArea = function (network) {
    //console.log(network.id);    

    return `    
        <div class="column is-full">
            <div class="box">
                <div class="card" style="width: 400px">
                    <header class="card-header">
                        <p class="card-header-title">
                            ${network.data().title}
                        </p>
                        <a href="#" class="card-header-icon" aria-label="more options">
                            <span class="icon">
                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </a>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <i> ${network.data().description} </i>
                            <br>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" id="editNetwork" data-id="${network.id}" class="card-footer-item modal-trigger" data-target="modal-edit">Edit</a>
                        <a href="#" id="deleteNetwork" data-id="${network.id}" class="card-footer-item">Delete</a>
                    </footer>
                </div>
            </div>
        </div> 
        
        <!-- EDIT MODAL -->
        <div class="modal" id="modal-edit" >
            <div class="modal-content">
                <br>
                <p class="subtitle is-4">Edit Network</p>
                <br>
                <form id="edit-form">                
                    <div class="input-field">
                        <input type="text" id="edit-title">
                        <label for="edit-title">Title</label>
                    </div>
                    <div class="input-field">
                        <input type="text" id="edit-description">
                        <label for="edit-description">Description</label>
                    </div>
                    <button id="saveButton" class="btn yellow darken-2 z-depth-0">Save</button>
                </form>
            </div>
        </div>
    `;
};

//TO DO
//Calculating number of networks
export const numberOfNetworks = function (user) {
    let count = 0;
    return count;
};