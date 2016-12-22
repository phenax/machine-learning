
export function euclideanDistance(arr1, arr2) {

	// Dimension mismatch error
	if(arr1.length !== arr2.length)
		throw new Error('Two vectors must have the same dimensions to calculate distance');

	// sqrt( square( x1 - x2 ) + square( y1 - y2 ) + ... )
	return Math.sqrt(
		arr1
			.map((point, i) => Math.pow(point - arr2[i], 2))
			.reduce((sum, sqDiff) => sum + sqDiff, 0)
	);
}
