
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/iris-dataset';
import {Learn} from '../src/js/Learn/Learn';
import {nodeClock} from '../src/js/Learn/utils/clock';


describe('LearnJS kNN classifier', () => {

	let learn;

	beforeEach(() => {

		learn= new Learn(Learn.kMeans({
			clusters: 3
		}));

		learn.train(dataset.train);

		learn.cluster(dataset.test[0].data);
	});


	describe('Clustering', () => {

		it('should be fine', () => {

		});
	});

});