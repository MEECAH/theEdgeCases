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

export const buildANetwork = async function (act, hidLay, nodesPerLay, iter, lrnRat, DATA, numRows, inputColNames, outputColName) {
    const SPLIT = Math.round(numRows * .66);
    console.log(iter)
    const trainData = DATA.slice(0, SPLIT);
    const testData = DATA.slice(SPLIT + 1);

    let myArr = []
    for (let i = hidLay; i > 0; i--) {
        myArr.push(nodesPerLay);
    }

    const network = new brain.NeuralNetwork({
        invalidTrainOptsShouldThrow: false,
        activation: act.toLowerCase(),  //Sets the function for activation
        hiddenLayers: myArr,  //Sets the number of hidden layers
        iterations: iter, //The number of runs before  the neural net and then stop training
        learningRate: lrnRat //The multiplier for the backpropagation changes
    });

    network.trainAsync(trainData);

    const accuracy = getAccuracy(network, testData);

    return {
        acc: accuracy,
        net: network,
        inputs: inputColNames,
        outputs: outputColName,

        data: DATA,
        settings: {
            activation: act,  
            hiddenLayers: myArr,  
            iterations: iter, 
            learningRate: lrnRat 
        }
    }
}

export const useNet = async function(net, inputArr) {
    let result = await net.run();
    return result;
    //return Math.round(net.run(inputArr));
}

export const getNetFromJson = function (myJson) {
    const net = new brain.NeuralNetwork();
    return net.fromJSON(myJson);
}

export const netToJson = function (myNet) {
    return brain.myNet.toJSON();
}

