
/* eslint-disable */

import {expect} from 'chai';

import dataset from '../src/iris-dataset';
import {Learn} from '../src/js/Learn/Learn';
import {nodeClock} from '../src/js/Learn/utils/clock';


describe('LearnJS kMeans classifier', () => {

	let learn;

	beforeEach(() => {

		learn= new Learn(Learn.kMeans({
			clusters: 3
		}));

		learn.train(dataset.train);
	});

	const calculateAccuracy= (callback) => {

		// Number of right predictions
		let rightPredictions= 0;

		// Iterate over all the test data
		dataset.test.forEach(point => {

			const label= learn.classify(point.data);

			if(label === point.label) {
				rightPredictions++;
				if(callback) callback(point);
			}
		});

		return rightPredictions;
	};

	const printAccuracy= (count) => {
		console.log(
			'        Prediction accuracy: ',
			Math.round(100000*100*count/dataset.test.length)/100000,
			'%'
		);
	};


	describe('Clustering', () => {

		it('should predict the correct label', () => {

			const label= learn.cluster(dataset.test[0].data);

			expect(label).to.eql(dataset.test[0].label);
		});

		it('should predict atleast 50% of the test set right', () => {

			// Minimum right predictions to pass the test
			const minimumRightPredictions= dataset.test.length*50/100;

			const rightPredictions= calculateAccuracy();

			printAccuracy(rightPredictions);

			// Prediction accuracy should be greater than 80%
			expect(rightPredictions).to.be.above(minimumRightPredictions);
		});

		// it('should improve accuracy after training with the correct results', () => {

		// 	const rightResults= [];

		// 	const previousAcc= calculateAccuracy(point => rightResults.push(point));

		// 	learn.train(rightResults);

		// 	const currentAcc= calculateAccuracy();

		// 	printAccuracy(currentAcc);

		// 	expect(previousAcc < currentAcc).to.be.true;
		// });
	});

});