
import kNN from './lib/kNN';

export class Learn {

	constructor(fn) {
		this._algorithm= fn;
		this.trainingDataset= [];
	}


	/**
	 * Train the algorithm
	 * 
	 * @param  {Array}  Training dataset
	 */
	train(dataset) {

		// Dataset has to be an array
		if(dataset.constructor !== Array)
			throw new Error('Training dataset has to be an array');

		// Concat the training dataset to the old one
		this.trainingDataset= this.trainingDataset.concat(dataset);
	}


	/**
	 * Classify a point with the help of the training dataset
	 * 
	 * @param  {Array}  point  Point to classify
	 * 
	 * @return {String}        Classified label
	 */
	classify(point) {

		// Dataset has to be an array
		if(point.constructor !== Array)
			throw new Error('The point to classify has to be an array');

		return this._algorithm(this.trainingDataset)(point);
	}

}

Learn.kNN= kNN;
