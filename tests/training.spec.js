
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/dataset';
import {Learn} from '../src/js/Learn/Learn';

describe('LearnJS kNN classifier', () => {

	let learn;

	beforeEach(() => {

		learn= new Learn(Learn.kNN({
			k: 4
		}));
	});


	describe('Training', () => {

		it('should update the training dataset', () => {

			// Add the training dataset
			learn.train(dataset.train);

			expect(learn.trainingDataset).to.have.length(dataset.train.length);
		});

		it('should concat the new training set to the old one', () => {

			// Add the first half of the training dataset
			learn.train(dataset.train.slice(0, dataset.train.length/2));
			// Add the second half
			learn.train(dataset.train.slice(dataset.train.length/2, dataset.train.length));

			expect(learn.trainingDataset).to.have.length(dataset.train.length);
		});
	});


	describe('Classification', () => {

		let testData;

		beforeEach(() => {

			// Test node
			testData= dataset.test[0];

			learn.train(dataset.train);
		});

		it('should should provide a prediction', () => {

			const result= learn.classify(testData.data);

			expect(result).to.eql(testData.label);
		});

		it('should throw error when the dimensions are wrong', () => {

			// The point to classify has the wrong dimension
			expect(() => learn.classify([ 0 ])).to.throw(Error);
		});
	});
});

