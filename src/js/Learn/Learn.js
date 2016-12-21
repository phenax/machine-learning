
export class Learn {

	static KNN() {
		return () => {

		};
	}

	constructor(fn) {
		
		this._algorithm= fn;
		this.trainingDataset= [];
	}

	train(dataset) {

		if(dataset.constructor !== Array)
			return false;

		this.trainingDataset= this.trainingDataset.concat(dataset);

		return true;
	}



}
