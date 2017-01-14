
import kNN from './lib/kNN';
import kMeans from './lib/kMeans';
import ANN from './lib/ANN';

export class Learn {

	constructor(fn) {
		this._algorithm= fn;
		this.trainingDataset= [];
		this._preparedFn= () => {};
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

		// Train the algorithm
		this._preparedFn= this._algorithm(this.trainingDataset);
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

		return this._preparedFn(point);
	}

	predict(point) {
		return this._preparedFn(point);
	}


	cluster(point) {

		if(point.constructor !== Array)
			throw new Error('The point to classify has to be an array');

		return this._preparedFn(point);
	}
}

Learn.kNN= kNN;
Learn.kMeans= kMeans;
Learn.ANN= ANN;
