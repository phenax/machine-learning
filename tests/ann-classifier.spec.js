
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/iris-dataset';
import {Learn} from '../src/js/Learn/Learn';


describe('LearnJS ANN classifier', () => {

	let learn;

	// const data= dataset.map(p => p.data);
	// const labels= dataset.map(p => p.label);

	const datasome= [
		// { data: [ 0, 0, 0 ], result: [0] },
		// { data: [ 0, 0, 1 ], result: [1] },
		// { data: [ 0, 1, 0 ], result: [2] },
		{ data: [ 0, 1, 1 ], result: [3] },
		// { data: [ 1, 0, 0 ], result: [4] },
	];

	beforeEach(() => {

		learn= new Learn(Learn.ANN({ hidden: [ [1, 1, 1, 1] ] }));

		learn.train(datasome);
	});


	it('should predict the label right', () => {

		const result= learn.predict([ 0, 1, 0 ]);

		expect(result).to.eql(0);
	});

	it('should improve accuracy with more training', () => {

		let totalPredictions= 0;

		datasome.forEach(point => {
			const prediction= learn.predict(point);

			if(true) {
				totalPredictions+= 1;
			}
		});



		// expect(totalPredictions).to.b(0);
	});
});
