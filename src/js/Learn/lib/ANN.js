
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
	}


	/**
	 * Sigmoid function
	 * 
	 * @param  {Number}  num
	 * @return {Number}
	 */
	sigmoid(num) {
		return 1/(1 + Math.exp(-num));
	}

	/**
	 * Generate a random number between two values
	 * 
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}      The random number
	 */
	random(min= 0, max= 10) {
		return Math.random()*(max - min + 1) + min - 1;
	}


	/**
	 * Create hidden layers based on a layout
	 * 
	 * @param  {Array} layout  An n-d array that presents nodes for hidden layers
	 */
	createHiddenLayers(layout, bias=0.3) {

		let layerSize= this.input._size[1];

		layout.forEach(_layer => {

			const layer= newMatrix(1, _layer.length);

			// const neuron= [];
			const weights= newMatrix(layerSize, _layer.length, () => {

				const number= this.random();

				// neuron.push({
				// 	_prevWt: number,
				// 	net: 0,
				// 	out: 0,
				// });

				return number;
			});

			print(weights);

			// this.neuronLayer.push(neuron);
			this.synapseMatrices.push(weights);
			this.hiddenMatrices.push(layer);

			layerSize= _layer.length;
		});

		this.synapseMatrices.push(
			newMatrix(layerSize, this.output._size[1], () => this.random())
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

		console.log('#################');


		// For each layer
		this.hiddenMatrices= this.hiddenMatrices.map((layer, i) => {

			// Matrix multiply currentLayer with layer
			let result= math.multiply(currentLayer, this.synapseMatrices[i]);

			// Apply sigmoid function to all nodes in the layer
			result= math.map(result, val => this.sigmoid(val));

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
	_propogate() {

		const prediction= this.predict();

		// Propogate backwards through the net and correct the weights
		this._backwardPropogation(prediction);
	}


	/**
	 * Move backwards in the network and correct the weights
	 * 
	 * @param  {Matrix} prediction
	 */
	_backwardPropogation(prediction) {

		print(this.input);
		print(this.output);
		print(prediction);

		// Square sum of difference of expected and predicted output(Cost)
		const cost= 0.5 * 
			math.sum(
				math.square(
					math.subtract(prediction, this.output)
				)._data
			);

		console.log('Cost: ', cost);


		// TODO: Figure out how to do back propogation

		let lastLayer= prediction;

		// Going backwards
		for(let i= this.hiddenMatrices.length - 1; i >= 0; i--) {

			const _layer= this.hiddenMatrices[i];

			// Find the error for each node
			// Adjust the weight according to it

		}

		// TODO: Replace this with the condition that says the cost is minimized
		if(!this.kkk) {
			this.kkk= true;
			this._propogate();
		}
	}
}

export default config => {

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

		return predict => {

			return 0;
		};
	};
};
