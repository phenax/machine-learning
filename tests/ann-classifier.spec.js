
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/iris-dataset';
import {Learn} from '../src/js/Learn/Learn';


describe('LearnJS ANN classifier', () => {

	let learn;

	// const data= dataset.map(p => p.data);
	// const labels= dataset.map(p => p.label);

	beforeEach(() => {

		const datasome= [
			{ data: [ 0, 0, 0 ], result: [0] },
			{ data: [ 0, 0, 1 ], result: [1] },
			{ data: [ 0, 1, 0 ], result: [2] },
			{ data: [ 0, 1, 1 ], result: [3] },
			{ data: [ 1, 0, 0 ], result: [4] },
		];

		learn= new Learn(Learn.ANN({
			hidden: [ [1, 1, 1, 1] ]
		}));

		learn.train(datasome);
	});


	it('should do something', () => {

		const result= learn.predict([ 0, 1, 0 ]);

		console.log(result, learn.predict([ 1, 0, 1 ]))

		expect(result).to.eql(0);
	});
});
