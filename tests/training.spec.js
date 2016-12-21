
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/dataset';
import {Learn} from '../src/js/Learn/Learn';

describe('Learn library', () => {

	let learn;

	beforeEach(() => {

		learn= new Learn(Learn.KNN());
	});

	describe('API Config', () => {

	});

	describe('Training', () => {

		it('should update the training dataset', () => {

			learn.train(dataset.train);

			expect(learn.trainingDataset).to.have.length(dataset.train.length);
		});

		it('should concat the new training set to the old one', () => {

			learn.train(dataset.train.slice(0, dataset.train.length/2));
			learn.train(dataset.train.slice(dataset.train.length/2, dataset.train.length));

			expect(learn.trainingDataset).to.have.length(dataset.train.length);
		});
	});

	describe('Testing', () => {

		beforeEach(() => {

			learn.train(dataset.train);
		});

		it('should should provide a prediction', () => {

			// learn.classify();

		});
	});
});

