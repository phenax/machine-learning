
import math from 'mathjs';


function newMatrix(row, col, fn) {

	const isFunction= typeof fn === 'function';

	let arr= Array(row).fill([]).map(() => Array(col).fill(isFunction? 0: fn || 0));

	if(isFunction)
		arr= arr.map(a => a.map(fn));

	return math.matrix(arr);
}

function print(matrix) {
	console.log('\nSize: ', matrix._size[0], 'x', matrix._size[1]);
	console.log(matrix._data);
	console.log();
}


class NeuralNetwork {

	constructor(props) {
		
		this.input= newMatrix(1, props.input);
		this.output= newMatrix(1, props.output);

		this.weightLayers= [];
		this.hiddenLayers= [];
	}

	sigmoid(num) {
		return 1/(1 + Math.exp(-num));
	}

	random(min= 0, max= 10) {
		return Math.random()*(max - min + 1) + min - 1;
	}

	createHiddenLayers(layout) {

		let layerSize= this.input._size[1];

		layout.forEach(_layer => {

			const layer= newMatrix(1, _layer.length);
			const weights= newMatrix(layerSize, _layer.length, () => this.random());

			print(weights);

			this.weightLayers.push(weights);
			this.hiddenLayers.push(layer);

			layerSize= _layer.length;
		});

		this.weightLayers.push(
			newMatrix(layerSize, this.output._size[1], () => this.random())
		);
	}

	predict() {

		let currentLayer= this.input;

		console.log('#################');


		// For each layer
		this.hiddenLayers= this.hiddenLayers.map((layer, i) => {

			// Matrix multiply currentLayer with layer
			let result= math.multiply(currentLayer, this.weightLayers[i]);

			// Apply sigmoid function to all nodes in the layer
			result= math.map(result, val => this.sigmoid(val));

			// layer becomes currentLayer
			currentLayer= result;

			return result;
		});


		// Get the last weight layer(synapse)
		const lastSynapse= this.weightLayers[this.weightLayers.length - 1];

		// Get the last hidden layer
		const lastHiddenLayer= currentLayer;

		// Multiply the two and the result is the predicted output
		this._prediction= math.multiply(lastHiddenLayer, lastSynapse);

		return this._prediction;
	}

	train(point, result) {

		this.input= math.matrix([ point ]);
		this.output= math.matrix([ result ]);

		this._propogate();	
	}

	_propogate() {

		const prediction= this.predict();

		// Propogate backwards through the net and correct the weights
		this._backwardPropogation(prediction);
	}

	_backwardPropogation(prediction) {

		print(this.input);
		print(this.output);
		print(prediction);

		// Square sum of difference of expected and predicted output(Cost)
		const cost= 
			math.sum(
				math.square(
					math.subtract(prediction, this.output)
				)._data
			);

		console.log('Cost: ', cost);

		// TODO: Figure out how to do back propogation

		// Going backwards
		for(let i= this.hiddenLayers.length - 1; i >= 0; i--) {

			const _layer= this.hiddenLayers[i];



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
