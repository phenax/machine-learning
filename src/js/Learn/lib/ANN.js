
import math from 'mathjs';



/**
 * Create a new matrix
 * 
 * @param  {Number}   row
 * @param  {Number}   col
 * @param  {Function|Number|null} fn   Filler(Fill the new matrix)
 * 
 * @return {Matrix}
 */
function newMatrix(row, col, fn) {

	const isFunction= typeof fn === 'function';

	let arr= Array(row).fill([]).map(() => Array(col).fill(isFunction? 0: fn || 0));

	if(isFunction)
		arr= arr.map(a => a.map(fn));

	return math.matrix(arr);
}

/**
 * Print a matrix(for debugging)
 * 
 * @param  {Matrix} matrix
 */
function print(matrix) {
	console.log('\nSize: ', matrix._size[0], 'x', matrix._size[1]);
	console.log(matrix._data);
	console.log();
}



/**
 * Neural network class
 */
class NeuralNetwork {

	constructor(props) {
		
		this.input= newMatrix(1, props.input);
		this.output= newMatrix(1, props.output);

		this.synapseMatrices= [];
		this.hiddenMatrices= [];

		this.neuronLayer= [];

		// Random number seed
		this.randomNumberSeed= 1;

		// Number of iteration
		this.maxIterationCount= 10001;
	}


	/**
	 * Generate a random number between two values
	 * 
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}      The random number
	 */
	random(min= 0, max= 1) {

		let random;

		if(this.randomNumberSeed !== false) {
			const x = Math.sin(this.randomNumberSeed++) * 10000;
			random= x - Math.floor(x);
		} else {
			random= Math.random();
		}


		return random*(max - min + 1) + min - 1;
	}


	/**
	 * activation function
	 * 
	 * @param  {Number}   num
	 * @param  {Boolean}  derivative
	 * 
	 * @return {Number}
	 */
	activation(num, derivative=false) {

		if(derivative)
			return num*(num - 1);

		return 1/(1 + Math.exp(-num));
	}


	/**
	 * Create hidden layers based on a layout
	 * 
	 * @param  {Array} layout  An n-d array that presents nodes for hidden layers
	 */
	createHiddenLayers(layout) {

		let layerSize= this.input._size[1];

		console.log('--------- INITIAL WEIGHTS ----------');

		layout.forEach(_layer => {

			const layer= newMatrix(1, _layer.length);

			const weights= newMatrix(layerSize, _layer.length, () => {
				const number= this.random();
				return number;
			});

			print(weights);

			this.synapseMatrices.push(weights);
			this.hiddenMatrices.push(layer);

			layerSize= _layer.length;
		});

		const lastSynapse= newMatrix(layerSize, this.output._size[1], () => this.random());

		this.synapseMatrices.push(lastSynapse);

		print(lastSynapse);

		console.log('--------- END INITIAL WEIGHTS ----------');
	}


	/**
	 * Predict the result for the network based on the weights
	 *
	 * @param  {Matrix}  input
	 * 
	 * @return {Matrix}
	 */
	predict(input) {

		let currentLayer= math.matrix([input]);


		// For each layer
		this.hiddenMatrices= this.hiddenMatrices.map((layer, i) => {

			// Matrix multiply currentLayer with layer
			let result= math.multiply(currentLayer, this.synapseMatrices[i]);

			// Apply activation function to all nodes in the layer
			result= math.map(result, val => this.activation(val));

			// layer becomes currentLayer
			currentLayer= result;

			return result;
		});


		// Get the last weight layer(synapse)
		const lastSynapse= this.synapseMatrices[this.synapseMatrices.length - 1];

		// Get the last hidden layer
		const lastHiddenLayer= currentLayer;

		const result= math.multiply(lastHiddenLayer, lastSynapse);

		// Multiply the two and the result is the predicted output
		this._prediction= math.map(result, val => this.activation(val));

		return this._prediction;
	}


	/**
	 * Train the neural network with a point
	 * 
	 * @param  {Array} point   The input point
	 * @param  {Array} result  The desired result
	 */
	train(point, result) {

		this.input= math.matrix([ point ]);
		this.output= math.matrix([ result ]);

		this._propogate(point);	
	}


	/**
	 * Propogate in the network
	 */
	_propogate(input) {
		console.log('------');

		let cost= 1;

		for(let i= 0; cost >= 0.005 && i< this.maxIterationCount; i++) {

			const prediction= this.predict(input);

			// Propogate backwards through the net and correct the weights
			cost= this._backwardPropogation(prediction);

			if(i%1000 === 0 || cost <= 0.005) {
				console.log('Cost: ', cost);
			}
		}
	}

	calculateDelta(layer, error) {

		const actLayer= math.map(layer, val => this.activation(val, true));

		return math.multiply(error, actLayer);
	}


	/**
	 * Move backwards in the network and correct the weights
	 * 
	 * @param  {Matrix} prediction
	 *
	 * @return {Number}
	 */
	_backwardPropogation(prediction) {

		let prevLayer= prediction;
		let prevLayerExpected= this.output;

		const updateWeights= (delta, i) => {
			// Update the synapse weights
			this.synapseMatrices[i]= 
				math.add(math.transpose(delta), this.synapseMatrices[i]);
		};

		const getError= () => 
			math.transpose(math.subtract(prevLayer, prevLayerExpected));


		// Going backwards
		for(let i= this.hiddenMatrices.length - 1; i >= 0; i--) {

			const delta= this.calculateDelta(this.hiddenMatrices[i], getError());

			// Update the synapse weights
			updateWeights(delta, i + 1);

			prevLayerExpected= 
				math.multiply(prevLayer, 
					math.transpose(this.synapseMatrices[i + 1]));
			prevLayer= this.hiddenMatrices[i];
		}


		const delta= this.calculateDelta(this.input, getError());

		// Update the synapse weights
		updateWeights(delta, 0);

		// Get cost from error matrix
		const getCost= errorMatr => 0.5 * math.sum(math.square(errorMatr)._data);

		// Return the prediction cost
		return getCost(math.subtract(prediction, this.output));
	}
}





export default config => {

	// Training
	return trainingSet => {

		const ann= new NeuralNetwork({
			input: trainingSet[0].data.length,
			output: trainingSet[0].result.length,
		});

		ann.createHiddenLayers(config.hidden);

		console.log('--------------------------');

		trainingSet
			.forEach(point => {
				ann.train(point.data, point.result);
			});

		console.log('\n\n\n-------------------------');

		// Prediction
		return point => {

			console.log('++ RESULT:', 
				point, 
				ann.predict(point).map(val => Math.round(val*100000)/100000)._data,
			'++');

			return 0;
		};
	};
};
