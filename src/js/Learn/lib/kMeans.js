
import {euclideanDistance as distance} from '../utils/distance';


class KMeansClustering {


	constructor(ds) {
		
		this.dataset= ds;
		this.clusters= [];

		this.getClusterMean= this.getClusterMean.bind(this);
		this.getClusterMedian= this.getClusterMedian.bind(this);
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

	getClusterMedian(points) {

		const emptyArr= Array(this.dataset[0].data.length).fill(0);

		if(points.length === 0) return emptyArr;

		const sortedDS= points.sort((p1, p2) => {

			const sumSquare= data => data.reduce((a, b) => a + b*b, 0);

			return sumSquare(p1.data) - sumSquare(p2.data);
		});

		let median;

		const mid= Math.floor(sortedDS.length/2);

		if(sortedDS.length%2 == 1) {

			const emptyPoint= { data: emptyArr };

			median= this.getClusterMean([
				sortedDS[mid + 1] || emptyPoint,
				sortedDS[mid - 1] || emptyPoint
			]);
		} else {
			median= sortedDS[mid].data;
		}

		// console.log(median);

		return median;
	}

	nextClusters(getClusterCenter) {

		getClusterCenter= getClusterCenter || this.getClusterMean;

		this.clusters.forEach(cpoint => {

			const mean= getClusterCenter(cpoint.contains);

			cpoint.point= mean;

			cpoint.contains= [];
		});

		this.gatherClusters();
	}
}

export default (config={}) => {

	config.errorFactor= config.errorFactor || 5;

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

			kmeans.nextClusters(kmeans.getClusterMedian);

			errorFactor= 
				kmeans.clusters
					.map((p, i) => distance(p.point, prevDist[i]))
					.reduce((total, dist) => total + dist, 0);

		} while(errorFactor >= config.errorFactor);

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

			return {
				label: maxLabel,
				accuracy: 100*most[maxLabel]/closestCluster.contains.length
			};
		};
	};
};
