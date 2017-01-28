
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
		this.iterationCount= 3001;
	}

	randomNumber() {
		const x = Math.sin(this.randomNumberSeed++) * 10000;
		return x - Math.floor(x);
	}

	/**
	 * Generate a random number between two values
	 * 
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}      The random number
	 */
	random(min= 0, max= 10) {
		return this.randomNumber()*(max - min + 1) + min - 1;
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
	createHiddenLayers(layout, bias) {

		let layerSize= this.input._size[1];

		layout.forEach(_layer => {

			const layer= newMatrix(1, _layer.length);

			const weights= newMatrix(layerSize, _layer.length, () => {
				const number= this.random(0, 10);
				return number;
			});

			console.log('INITIAL WEIGHTS ->');
			print(weights);

			this.synapseMatrices.push(weights);
			this.hiddenMatrices.push(layer);

			layerSize= _layer.length;
		});

		this.synapseMatrices.push(
			newMatrix(layerSize, this.output._size[1], () => this.random(0, 10))
		);
	}


	/**
	 * Predict the result for the network based on the weights
	 *
	 * @param  {Matrix}  input
	 * 
	 * @return {Matrix}
	 */
	predict(input) {

		let currentLayer= input || this.input;


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

		// Multiply the two and the result is the predicted output
		this._prediction= math.multiply(lastHiddenLayer, lastSynapse);

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

		this._propogate();	
	}


	/**
	 * Propogate in the network
	 */
	_propogate(iteration=0) {

		const prediction= this.predict();

		// Propogate backwards through the net and correct the weights
		this._backwardPropogation(prediction, iteration);
	}


	/**
	 * Move backwards in the network and correct the weights
	 * 
	 * @param  {Matrix} prediction
	 */
	_backwardPropogation(prediction, iteration) {

		let lastLayer= prediction;

		// Going backwards
		for(let i= this.hiddenMatrices.length - 1; i >= 0; i--) {

			const errorMatr= math.subtract(lastLayer, this.output);

			if(iteration%100 === 0) {
				// Square sum of difference of expected and predicted output(Cost)
				const cost= 0.5 * math.sum(math.square(errorMatr)._data);
				console.log('Cost: ', cost);
			}

			const _layer= this.hiddenMatrices[i];

			const sigm= math.map(_layer, val => this.activation(val, true));

			const delta= math.multiply(errorMatr, sigm);

			this.synapseMatrices[i + 1]= 
				math.add(math.transpose(delta), this.synapseMatrices[i + 1]);

			lastLayer= _layer;
		}

		// TODO: Replace this with the condition that says the cost is minimized
		if(iteration <= this.iterationCount) {
			this._propogate(iteration + 1);
		}
	}
}





export default config => {

	// Training
	return trainingSet => {

		const ann= new NeuralNetwork({
			input: trainingSet[0].data.length,
			output: 1,
		});

		ann.createHiddenLayers(config.hidden);

		console.log('--------------------------');

		trainingSet
			.forEach(point => {
				ann.train(point.data, point.result);
			});


		// Prediction
		return point => {

			point= math.matrix(point);

			console.log('\n++++++ RESULT:\n', ann.predict(point)._data, '\n++++++\n');

			return 0;
		};
	};
};
