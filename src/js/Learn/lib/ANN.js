
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

		if(derivative) {
			return this.activation(num)*(1 - this.activation(num));
		}

		return 1/(1 + Math.exp(-num));
	}

	activateMatrix(matrix, derivative) {
		return math.map(matrix, val => this.activation(val, derivative));
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

			const weights= newMatrix(layerSize, _layer.length, () => this.random());

			this.synapseMatrices.push(weights);
			this.hiddenMatrices.push(layer);

			layerSize= _layer.length;
		});

		const lastSynapse= 
			newMatrix(layerSize, this.output._size[1], () => this.random());

		this.synapseMatrices.push(lastSynapse);

		this.printSynapse();

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

		let currentLayer= (input)? math.matrix([input]): this.input;


		// For each layer
		this.hiddenMatrices= this.hiddenMatrices.map((layer, i) => {

			// Matrix multiply currentLayer with layer
			let result= math.multiply(currentLayer, this.synapseMatrices[i]);

			// Apply activation function to all nodes in the layer
			result= this.activateMatrix(result);

			// layer becomes currentLayer
			currentLayer= result;

			return result;
		});


		// Get the last weight layer(synapse)
		const lastSynapse= this.synapseMatrices[this.synapseMatrices.length - 1];

		// Get the last hidden layer
		const lastHiddenLayer= currentLayer;

		const prediction= math.multiply(lastHiddenLayer, lastSynapse);

		// Multiply the two and the result is the predicted output
		return this.activateMatrix(prediction);
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


	printSynapse() {
		this.synapseMatrices
			.map(a => math.map(a, b => Math.round(b*1000)/1000)._data)
			.forEach(a => {
				console.log(a);
			});
	}


	/**
	 * Propogate in the network
	 */
	_propogate(input) {

		let cost= 1;
		const MIN_COST= 0.1;

		for(let i= 0; cost >= MIN_COST && i< this.maxIterationCount; i++) {

			const prediction= this.predict(input);

			// Propogate backwards through the net and correct the weights
			cost= this._backwardPropogation(prediction);

			if(i%1000 === 0 || cost <= MIN_COST) {
				console.log('\n+ SYNAPSE +\n');
				this.printSynapse();
				console.log('Cost: ', cost);
				console.log('\n+ SYNAPSE +\n');
			}
		}

		console.log('------');
	}



	calculateDelta(layer, error) {

		const actLayer= this.activateMatrix(layer, true);

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

		// Update the synapse weights
		const updateWeights= (delta, i) => {
			this.synapseMatrices[i]= 
				math.add(math.transpose(delta), this.synapseMatrices[i]);
		};

		// Get the error(prevLayer and prevLayerExpected)
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
		// console.log('Prev');

		const delta= this.calculateDelta(this.input, getError());

		// print(this.input);
		// print(delta);
		// print(prevLayer);
		// print(prevLayerExpected);


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
