
export const workPlaceRender = async function (user) {
    const $body = $("#body");
    $body.html(renderCreateNetworksArea());
    const $networks = $("#neurons");
    db.collection('users').onSnapshot(snapshot => {
        $networks.html(snapshot.docs.map(renderNetworksArea));
    }, err => console.log(err.message));
};

export const getUserInfo = async function (user) {
    let docs;
    db.collection('users').doc(user.uid).get().then(doc => {
        docs = doc.data();
        return docs;
    });

};

export const renderCreateNetworksArea = function () {

    return `
    
    <div class="columns">
            <div id="neurons">
            </div>
        <div class="column">
            <div class="box">
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Enter title for your network">
                    </div>
                </div>

                <div class="field">
                    <label class="label">To check</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Enter text">
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
                    <textarea class="textarea" placeholder="Textarea"></textarea>
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
                    <button class="button is-link">Submit</button>
                </div>
                <div class="control">
                    <button class="button is-link is-light">Clear</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;
};

export const renderNetworksArea = function (network) {

    //console.log(network.data().name + i);  

    return `    
        <div class="column is-full">
            <div class="box">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            ${network.data().name}
                        </p>
                        <a href="#" class="card-header-icon" aria-label="more options">
                            <span class="icon">
                                <i class="fas fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </a>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <i> Shit about the network .... ${network.data().bio} </i>
                            <br>
                        </div>
                    </div>
                    <footer class="card-footer">
                        <a href="#" id="editNetwork" class="card-footer-item">Edit</a>
                        <a href="#" id="deleteNetwork" class="card-footer-item">Delete</a>
                    </footer>
                </div>
            </div>
        </div>        
    `;
};