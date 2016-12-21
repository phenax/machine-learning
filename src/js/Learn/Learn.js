
export class Learn {

	static KNN(config={}) {

		const distance= (arr1, arr2) => {
			if(arr1.length !== arr2.length)
				throw new Error('The training dataset and the prediction dataset must have the same dimensions');

			return Math.sqrt(
				arr1
					.map((point, i) => Math.pow(point - arr2[i], 2))
					.reduce((sum, sqDiff) => sum + sqDiff, 0)
			);
		};

		return (training) => (point) => {

			config.k= config.k || Math.max(Math.floor(training.length/10), 4);

			let maxLabel= '_';

			const lblCount= {};
			lblCount[maxLabel]= 0;

			training
				.map( p => ({ label: p.label, distance: distance(p.data, point) }))
				.sort((p1, p2) => (p1.distance > p2.distance)? 1: -1)
				.slice(0, config.k)
				.map( p => p.label )
				.forEach( label => {

					if(!(label in lblCount))
						lblCount[label]= 0;

					if(lblCount[maxLabel] < (++lblCount[label]))
						maxLabel= label;
				});

			return maxLabel;
		};
	}

	constructor(fn) {
		
		this._algorithm= fn;
		this.trainingDataset= [];
	}

	get algorithm() {
		return this._algorithm(this.trainingDataset);
	}

	train(dataset) {

		if(dataset.constructor !== Array)
			return false;

		this.trainingDataset= this.trainingDataset.concat(dataset);

		return true;
	}

	classify(point) {
		return this.algorithm(point);
	}

}
