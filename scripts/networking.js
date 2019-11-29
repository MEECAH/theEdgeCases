// to import the "brain" library which is the easiest to use/understand library I have found:
// <script src="https://unpkg.com/brain.js@1.0.0-rc.3/browser.js"></script>

// to upload a file:
//<input type="file" id="input">


// borrowed helper function
export const getAccuracy = function(net, testData) {
    let hits = 0;
    testData.forEach((datapoint) => {
      const output = net.run(datapoint.input);
      const outputArray = [Math.round(output[0]), Math.round(output[1]), Math.round(output[2])];
      if (outputArray[0] === datapoint.output[0] && outputArray[1] === datapoint.output[1] && outputArray[2] === datapoint.output[2]) {
        hits += 1;
      }
    });
    return hits / testData.length;  
}

/* 
SETTINGS WE ARE GOING TO LET PEOPLE MESS WITH
activation: Sets the function for activation. 
hiddenLayers: Sets the number of hidden layers.
iterations: The number of runs before  the neural net and then stop training.
learningRate: The multiplier for the backpropagation changes.
WILL WRITE MORE ELABORATE EXPLANATIONS OF WHAT THESE ARE
*/
export const buildANetwork = async function (act, hidLay, iter, lrnRat, DATA) {

    const SPLIT = 99; // need to change to a formula that works with any data
    const trainData = DATA.slice(0, SPLIT);
    const testData = DATA.slice(SPLIT + 1);

    const network = new brain.NeuralNetwork({
        activation: act,  //Sets the function for activation
        hiddenLayers: [hidLay],  //Sets the number of hidden layers
        iterations: iter, //The number of runs before  the neural net and then stop training
        learningRate: lrnRat //The multiplier for the backpropagation changes
    });

    network.train(trainData);

    const accuracy = getAccuracy(network, testData);

    return {
        acc: accuracy,
        net: network,
        json: netToJson(network),
        data: DATA,
        settings: {
            activation: act,  
            hiddenLayers: [hidLay],  
            iterations: iter, 
            learningRate: lrnRat 
        }
    }
}

export const getNetFromJson = function (myJson) {
    const net = new brain.NeuralNetwork();
    return net.fromJSON(myJson);
}

export const netToJson = function (myNet) {
    return brain.myNet.toJSON();
}
