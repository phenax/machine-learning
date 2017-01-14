
import math from 'mathjs';


function newMatrix(row, col, fn) {

	const isFunction= typeof fn === 'function';

	let arr= Array(row).fill([]).map(() => Array(col).fill(isFunction? 0: fn));

	if(isFunction)
		arr= arr.map(a => a.map(fn));

	return math.matrix(arr);
}

function print(matrix) {
	console.log('\nSize: ', matrix._size[0], 'x', matrix._size[1]);
	console.log(matrix._data);
	console.log();
};


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
		return Math.random()*(max - min + 1) + min;
	}

	createHiddenLayers(layout) {

		let layerSize= this.input._size[1];

		layout.forEach(_layer => {

			const layer= newMatrix(_layer.length, 1);
			const weights= newMatrix(layerSize, _layer.length, () => this.random());

			print(weights);

			this.weightLayers.push(weights);
			this.hiddenLayers.push(layer);

			layerSize= _layer.length;
		});

		this.weightLayers.push(newMatrix(layerSize, this.output._size[1], () => this.random()));
	}

	predict() {

	}

	train(point, result) {

		this.input= math.matrix([ point ]);
		this.output= math.matrix([ result ]);

		let currentLayer= this.input;

		// For each layer
		this.hiddenLayers= this.hiddenLayers.map((layer, i) => {

			// Matrix multiply currentLayer with layer
			const result= math.multiply(currentLayer, this.weightLayers[i]);

			// layer becomes currentLayer
			currentLayer= layer;

			return result;
		});

		// Get the last weight
		// Multiply it with the last weight and the result is the predicted output
		// Calculate cost(error)
		// 
		// TODO: Figure out how to do back propogation

		// console.log('\n\nhidden');
		// print(this.hiddenLayers[0]);
		// console.log('\n\nweight');
		// print(this.weightLayers[0]);
	}
}

export default config => {

	return trainingSet => {

		const ann= new NeuralNetwork({
			input: trainingSet[0].data.length,
			output: 1,
		});

		ann.createHiddenLayers(config.hidden);

		trainingSet
			.forEach(point => {
				ann.train(point.data, point.result);
			});

		return predict => {

			return 0;
		};
	};
};
