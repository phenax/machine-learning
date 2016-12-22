
import {euclideanDistance as distance} from '../utils/distance';

// k Nearest Neighbors classifier
export default (config={}) => {

	return (training) => (point) => {

		// 10% of training dataset length is the default value of k if its greater than 4
		config.k= config.k || Math.max(Math.floor(training.length/10), 4);

		// The label that the point most likely belongs to
		let maxLabel= '_';

		// A dictionary of the number of times a label occurs
		// Label: Count
		const labelCount= {};
		labelCount[maxLabel]= 0;

		// (impure)
		// Updates label count
		// TODO: Think of a pure implementation of this
		const getMaxLabel= label => {

			if(!(label in labelCount))
				labelCount[label]= 0;

			if(labelCount[maxLabel] < (++labelCount[label]))
				maxLabel= label;
		};

		// Can optimize this a lot but this looks way better than a stupid for loop
		training
			// Calculate the distance of all training elements from the new point
			.map( p => ({ label: p.label, distance: distance(p.data, point) }))
			// Sort it according to its distance(ascending)
			.sort((p1, p2) => (p1.distance > p2.distance)? 1: -1)
			// Select the first K elements
			.slice(0, config.k)
			// Need only the label now
			.map( p => p.label )
			// Updates the labelCount and gets the label that occured the most
			.forEach(getMaxLabel);

		return maxLabel;
	};
};
