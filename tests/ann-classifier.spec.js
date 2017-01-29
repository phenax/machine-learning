
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/iris-dataset';
import {Learn} from '../src/js/Learn/Learn';


describe('LearnJS ANN classifier', () => {

	let learn;

	// const data= dataset.map(p => p.data);
	// const labels= dataset.map(p => p.label);

	const datasome= [
		{ data: [ 0, 0 ], result: [ 0, 0 ] },
		{ data: [ 0, 1 ], result: [ 0, 0 ] },
		{ data: [ 1, 0 ], result: [ 0, 0 ] },
		{ data: [ 1, 1 ], result: [ 1, 1 ] },
	];

	beforeEach(function() {

		// Increase timeout because traing is always slow
		this.timeout(20000);

		learn= new Learn(Learn.ANN({ hidden: [ [1, 1, 1, 1] ] }));
		learn.iterationCount= 5001;

		learn.train(datasome);

	});


	it('should predict the label right', () => {

		const result= learn.predict([ 1, 0 ]);

		expect(result).to.eql(0);
	});

	// it('should improve accuracy with more training', () => {

	// 	let totalPredictions= 0;

	// 	datasome.forEach(point => {

	// 		const prediction= learn.predict(point.data);

	// 		if(true) {
	// 			totalPredictions+= 1;
	// 		}
	// 	});



	// 	expect(totalPredictions).to.eql(0);
	// });
});
