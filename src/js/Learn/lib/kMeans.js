
import {euclideanDistance as distance} from '../utils/distance';


class KMeansClustering {


	constructor(ds) {
		
		this.dataset= ds;
		this.clusters= [];
	}

	getBounds() {

		const bounds= this.dataset[0].data.map(() => ({}));

		this.dataset.forEach(
			point =>
				point.data.map((value, i) => {
					if(!('min' in bounds[i]) || bounds[i].min > value)
						bounds[i].min= value;
					if(!('max' in bounds[i]) || bounds[i].max < value)
						bounds[i].max= value;
				})
		);

		return bounds;
	}

	randomizeClusters(clusterCount) {

		// Get the bounds
		const bounds= this.getBounds();

		// Create `clusterCount` number of clusters
		this.clusters= Array(clusterCount).fill({}).map(() => ({
			point: bounds.map(dim => (Math.random()*(dim.max - dim.min + 1) + dim.min)),
			contains: []
		}));
	}


	gatherClusters() {

		this.dataset.forEach(point => {

			const cluster= this.getClosestCluster(point);

			cluster.contains.push(point);
		});
	}

	getClosestCluster(point) {

		let closestCluster= this.clusters[0];
		let closestDist= distance(point.data, this.clusters[0].point);

		this.clusters.forEach(cluster => {

			const dist= distance(point.data, cluster.point);

			if(closestDist > dist) {
				closestDist= dist;
				closestCluster= cluster;
			}
		});

		return closestCluster;
	}


	getClusterMean(points) {

		if(points.length === 0) return Array(this.dataset[0].data.length).fill(0);

		let sum= points[0].data;

		for(let i= 1; i< points.length; i++)
			sum= sum.map((d, j) => d + points[i].data[j]);

		return sum.map(s => s/points.length);
	}


	nextClusters() {

		this.clusters.forEach(cpoint => {

			const mean= this.getClusterMean(cpoint.contains);

			cpoint.point= mean;

			cpoint.contains= [];
		});

		this.gatherClusters();
	}
}

export default (config={}) => {

	if(!('clusters' in config))
		throw new Error('Need to specify the number of clusters for kMeans');

	return trainDS => {

		const kmeans= new KMeansClustering(trainDS);

		// Plot n random section points(N dimensional points)
		kmeans.randomizeClusters(config.clusters);

		let prevDist, errorFactor;

		do {

			prevDist= kmeans.clusters.map(p => p.point);

			kmeans.gatherClusters();

			kmeans.nextClusters();

			errorFactor= 
				kmeans.clusters
					.map((p, i) => distance(p.point, prevDist[i]))
					.reduce((total, dist) => total + dist, 0);

		} while(errorFactor >= 0.00001);

		return testPoint => {

			const closestCluster= kmeans.getClosestCluster({data:testPoint});

			let maxLabel= '_';
			const most= {};
			most[maxLabel]= 0;

			closestCluster.contains.map(p => {

				if(!(p.label in most))
					most[p.label]= 0;

				if((++most[p.label]) > most[maxLabel]) {
					maxLabel= p.label;
				}
			});

			// Some kind of output? Not sure what to do here
			return maxLabel;
		};
	};
};
