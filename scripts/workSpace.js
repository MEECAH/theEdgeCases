
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


    // what is an epoc?
    $("#epc_label").click(() => toggleModal(event, '#epc_modal', true));
    // what are hidden layers?
    $("#hid_label").click(() => toggleModal(event, '#hid_modal', true));
    // what is an activation function?
    $("#atv_label").click(() => toggleModal(event, '#atv_modal', true));
    // what is learning rate?
    $("#lrn_label").click(() => toggleModal(event, '#lrn_modal', true));

    // delete em
    $("#del_epc_modal").click(() => toggleModal(event, '#epc_modal', false));
    $("#del_hid_modal").click(() => toggleModal(event, '#hid_modal', false));
    $("#del_atv_modal").click(() => toggleModal(event, '#atv_modal', false));
    $("#del_lrn_modal").click(() => toggleModal(event, '#lrn_modal', false));

}

// toggle a modal
export const toggleModal = function (event, modalID, turnOn) {
    event.preventDefault;
    if (turnOn){
        document.getElementById(modalID).className += " is-active";
    } else {
        document.getElementById(modalID).className = "modal";
    }
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
                        <label class="label" id="lrn_label" >Learning Rate</label>
                        <div class="control">
                            <div class="select">
                                <div class="control">
                                    <input class="input" type="number" step=".01" min="0" max="1" placeholder=".05" required/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="#lrn_modal" class="modal">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                        <header class="modal-card-head">
                            <button id="del_lrn_modal" class="delete" aria-label="close"></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="content">
                            <h1>What is learning rate?</h1>
                            <p>A network’s learning rate is how much that neural network changes each time it trains. A higher learning rate could make a network train faster but it may not be as accurate/precise. .5 is a good learning rate for most networks.</p>
                            </div>
                        </section>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" id="epc_label">Epocs</label>
                        <div class="control">
                            <input class="input" type="number" placeholder="30" required/>
                        </div>
                    </div>                
                    <div id="#epc_modal" class="modal">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                        <header class="modal-card-head">
                            <button id="del_epc_modal" class="delete" aria-label="close"></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="content">
                            <h1>What is an epoc?</h1>
                            <p>The number of epochs is the number of times that a neural network trains on a given data set. More epochs could lead to greater accuracy but will it will take a longer amount of time to train the neural network. 30 is a good number of epochs for training most neural networks.</p>
                            </div>
                        </section>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" id="hid_label">Hidden Layers</label>
                        <div class="control">
                            <input class="input" type="number" placeholder="4" required/>
                        </div>
                    </div>                
                    <div id="#hid_modal" class="modal">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                        <header class="modal-card-head">
                            <button id="del_hid_modal" class="delete" aria-label="close"></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="content">
                            <h1>What are hidden layers?</h1>
                            <p>The number of hidden layers is the number of layers of neurons in a network between the input and the output. More layers could lead to greater accuracy but will it will take a longer amount of time to train the neural network. Four layers is usually plenty but feel free to experiment!</p>
                            </div>
                        </section>
                        </div>
                    </div>

                    <div class="field">
                        <label class="label" id="atv_label" >Activation Function</label>
                        <div class="control">
                            <div class="select">
                                <select id="activation_function">
                                    <option>Sigmoid</option>
                                    <option>Tanh</option>
                                    <option>Relu</option>
                                    <option>Leaky Relu</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div id="#atv_modal" class="modal">
                        <div class="modal-background"></div>
                        <div class="modal-card">
                        <header class="modal-card-head">
                            <button id="del_atv_modal" class="delete" aria-label="close"></button>
                        </header>
                        <section class="modal-card-body">
                            <div class="content">
                            <h1>What is an activation function?</h1>
                            <p>Each neuron has something called an activation function. An activation function looks at an input value given to Neuron A and decides whether Neuron A should activate- and by how much.</p>

                            <img src="img/Activation Function Pics/Step.png" alt="Smiley face" style="height:100; width:100">

                            <p>The simplest activation function is called a “step” function (pictured above). If the value is given to Neuron A meets a certain criteria (for example, if value is >= 5) than Neuron A fires at 100%. Otherwise, Neuron A does not fire at all. The problem with this activation function is that it does not allow for nuance. Two blue pixels, for example, might not be the same shade of blue. A step activation function could tell you that a pixel was blue but a different activation function could better capture just how blue.</p>
                            <p>This website allows for the use of four common activation functions that solve this problem:  Sigmoid, Tanh, Relu and Leaky Relu. Activation functions should be chosen based on whether the shape of the function approximates that of the problem you are trying to solve. However, if you don’t enjoy math, guess and check is also a great strategy.</p>
                            <p>HINT: For binary classification using a neural network (what this website does), Sigmoid and Tanh will likely work the best as they approximate the shape of the binary “step” function.</p>
                            
                            <h2>Sigmoid Function:</h2>
                            <img src="img/Activation Function Pics/Sigmoid.png" alt="Smiley face" style="height:80; width:80">

                            <h2>Tanh Function:</h2>
                            <img src="img/Activation Function Pics/Tanh.jpg" alt="Smiley face" style="height:80; width:80">

                            <h2>Relu Function:</h2>
                            <img src="img/Activation Function Pics/Relu.png" alt="Smiley face" style="height:80; width:80">

                            <h2>Leaky Relu Function:</h2>
                            <img src="img/Activation Function Pics/Leaky Relu.jpg" alt="Smiley face" style="height:80; width:80">

                            </div>
                        </section>
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
