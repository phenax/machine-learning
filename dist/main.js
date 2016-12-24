/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _DigitRecognition = __webpack_require__(2);
	
	var _DigitRecognition2 = _interopRequireDefault(_DigitRecognition);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener('DOMContentLoaded', function () {
	
		var $canvas = document.querySelector('.js-canvas');
		var $trainBtn = document.querySelector('.js-train');
		var $guessBtn = document.querySelector('.js-guess');
		var $textField = document.querySelector('.js-input');
		var $output = document.querySelector('.js-output');
		var $clear = document.querySelector('.js-clear');
	
		$canvas.width = 100;
		$canvas.height = 100;
	
		var dg = new _DigitRecognition2.default($canvas);
	
		$trainBtn.addEventListener('click', function () {
			return dg.train($textField.value);
		});
		$guessBtn.addEventListener('click', function () {
			$output.textContent = dg.classify();
		});
		$clear.addEventListener('click', function () {
			return dg.clearCanvas();
		});
	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Learn = __webpack_require__(3);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var DigitRecognition = function () {
		function DigitRecognition(canvas) {
			_classCallCheck(this, DigitRecognition);
	
			this.$canvas = canvas;
	
			this.ctx = this.$canvas.getContext('2d');
	
			this.learn = new _Learn.Learn(_Learn.Learn.kNN({ k: 3 }));
	
			this._mouseDown = false;
			this._prevTouch = {};
	
			this.attachListeners();
		}
	
		_createClass(DigitRecognition, [{
			key: 'resizeHandler',
			value: function resizeHandler() {
				this._bound = this.$canvas.getBoundingClientRect();
			}
		}, {
			key: 'attachListeners',
			value: function attachListeners() {
				this.mouseDownHandler = this.mouseDownHandler.bind(this);
				this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
				this.mouseUpHandler = this.mouseUpHandler.bind(this);
				this.resizeHandler = this.resizeHandler.bind(this);
	
				this.resizeHandler();
				document.addEventListener('resize', this.resizeHandler);
	
				this.$canvas.addEventListener('mousedown', this.mouseDownHandler);
				this.$canvas.addEventListener('mouseup', this.mouseUpHandler);
				this.$canvas.addEventListener('mousemove', this.mouseMoveHandler);
				this.$canvas.addEventListener('touchstart', this.mouseDownHandler);
				this.$canvas.addEventListener('touchend', this.mouseUpHandler);
				this.$canvas.addEventListener('touchmove', this.mouseMoveHandler);
			}
		}, {
			key: '_normalizeTouch',
			value: function _normalizeTouch(e) {
	
				var p = {
					x: e.pageX || e.touches[0].pageX,
					y: e.pageY || e.touches[0].pageY
				};
	
				p.x = p.x - this._bound.left;
				p.y = p.y - this._bound.top;
	
				return p;
			}
		}, {
			key: 'mouseDownHandler',
			value: function mouseDownHandler(e) {
				e.preventDefault();
				this._mouseDown = true;
				this._prevTouch = this._normalizeTouch(e);
			}
		}, {
			key: 'mouseMoveHandler',
			value: function mouseMoveHandler(e) {
	
				if (this._mouseDown) {
					e.preventDefault();
	
					var p = this._normalizeTouch(e);
	
					if (p.x >= this.$canvas.width || p.x <= 0 || p.y >= this.$canvas.height || p.y <= 0) {
						this._mouseDown = false;
						return;
					}
	
					this.ctx.beginPath();
					this.ctx.moveTo(this._prevTouch.x, this._prevTouch.y);
					this.ctx.lineTo(p.x, p.y);
					this.ctx.stroke();
	
					this._prevTouch = p;
				}
			}
		}, {
			key: 'mouseUpHandler',
			value: function mouseUpHandler() {
				this._mouseDown = false;
			}
		}, {
			key: 'clearCanvas',
			value: function clearCanvas() {
				this.ctx.clearRect(0, 0, this._bound.width, this._bound.height);
			}
		}, {
			key: 'getImage',
			value: function getImage() {
	
				var image = this.ctx.getImageData(0, 0, this._bound.width, this._bound.height);
	
				var pixels = [];
	
				for (var i = 0; i < image.data.length; i += 4) {
					if (image.data[i + 3] === 255) pixels.push(1);else pixels.push(0);
				}
	
				return Object.assign({}, image, { data: pixels });
			}
		}, {
			key: 'train',
			value: function train(label) {
				var _getImage = this.getImage(),
				    data = _getImage.data;
	
				this.learn.train([{ label: label, data: data }]);
			}
		}, {
			key: 'classify',
			value: function classify() {
				var _getImage2 = this.getImage(),
				    data = _getImage2.data;
	
				return this.learn.classify(data);
			}
		}]);
	
		return DigitRecognition;
	}();
	
	exports.default = DigitRecognition;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Learn = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _kNN = __webpack_require__(4);
	
	var _kNN2 = _interopRequireDefault(_kNN);
	
	var _kMeans = __webpack_require__(6);
	
	var _kMeans2 = _interopRequireDefault(_kMeans);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Learn = exports.Learn = function () {
		function Learn(fn) {
			_classCallCheck(this, Learn);
	
			this._algorithm = fn;
			this.trainingDataset = [];
			this._preparedFn = function () {};
		}
	
		/**
	  * Train the algorithm
	  * 
	  * @param  {Array}  Training dataset
	  */
	
	
		_createClass(Learn, [{
			key: 'train',
			value: function train(dataset) {
	
				// Dataset has to be an array
				if (dataset.constructor !== Array) throw new Error('Training dataset has to be an array');
	
				// Concat the training dataset to the old one
				this.trainingDataset = this.trainingDataset.concat(dataset);
	
				// Train the algorithm
				this._preparedFn = this._algorithm(this.trainingDataset);
			}
	
			/**
	   * Classify a point with the help of the training dataset
	   * 
	   * @param  {Array}  point  Point to classify
	   * 
	   * @return {String}        Classified label
	   */
	
		}, {
			key: 'classify',
			value: function classify(point) {
	
				// Dataset has to be an array
				if (point.constructor !== Array) throw new Error('The point to classify has to be an array');
	
				return this._preparedFn(point);
			}
		}, {
			key: 'cluster',
			value: function cluster(point) {
	
				if (point.constructor !== Array) throw new Error('The point to classify has to be an array');
	
				return this._preparedFn(point);
			}
		}]);
	
		return Learn;
	}();
	
	Learn.kNN = _kNN2.default;
	Learn.kMeans = _kMeans2.default;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _distance = __webpack_require__(5);
	
	// k Nearest Neighbors classifier
	exports.default = function () {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	
		return function (training) {
			return function (point) {
	
				// 10% of training dataset length is the default value of k if its greater than 4
				config.k = config.k || Math.max(Math.floor(training.length / 10), 4);
	
				// The label that the point most likely belongs to
				var maxLabel = '_';
	
				// A dictionary of the number of times a label occurs
				// Label: Count
				var labelCount = {};
				labelCount[maxLabel] = 0;
	
				// (impure)
				// Updates label count
				// TODO: Think of a pure implementation of this
				var getMaxLabel = function getMaxLabel(label) {
	
					if (!(label in labelCount)) labelCount[label] = 0;
	
					if (labelCount[maxLabel] < ++labelCount[label]) maxLabel = label;
				};
	
				// Can optimize this a lot but this looks way better than a stupid for loop
				training
				// Calculate the distance of all training elements from the new point
				.map(function (p) {
					return { label: p.label, distance: (0, _distance.euclideanDistance)(p.data, point) };
				})
				// Sort it according to its distance(ascending)
				.sort(function (p1, p2) {
					return p1.distance > p2.distance ? 1 : -1;
				})
				// Select the first K elements
				.slice(0, config.k)
				// Need only the label now
				.map(function (p) {
					return p.label;
				})
				// Updates the labelCount and gets the label that occured the most
				.forEach(getMaxLabel);
	
				return maxLabel;
			};
		};
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.euclideanDistance = euclideanDistance;
	function euclideanDistance(arr1, arr2) {
	
		// Dimension mismatch error
		if (arr1.length !== arr2.length) throw new Error('Two vectors must have the same dimensions to calculate distance');
	
		// sqrt( square( x1 - x2 ) + square( y1 - y2 ) + ... )
		return Math.sqrt(arr1.map(function (point, i) {
			return Math.pow(point - arr2[i], 2);
		}).reduce(function (sum, sqDiff) {
			return sum + sqDiff;
		}, 0));
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _distance = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var KMeansClustering = function () {
		function KMeansClustering(ds) {
			_classCallCheck(this, KMeansClustering);
	
			this.dataset = ds;
			this.clusters = [];
	
			this.getClusterMean = this.getClusterMean.bind(this);
			this.getClusterMedian = this.getClusterMedian.bind(this);
		}
	
		_createClass(KMeansClustering, [{
			key: 'getBounds',
			value: function getBounds() {
	
				var bounds = this.dataset[0].data.map(function () {
					return {};
				});
	
				this.dataset.forEach(function (point) {
					return point.data.map(function (value, i) {
						if (!('min' in bounds[i]) || bounds[i].min > value) bounds[i].min = value;
						if (!('max' in bounds[i]) || bounds[i].max < value) bounds[i].max = value;
					});
				});
	
				return bounds;
			}
		}, {
			key: 'randomizeClusters',
			value: function randomizeClusters(clusterCount) {
	
				// Get the bounds
				var bounds = this.getBounds();
	
				// Create `clusterCount` number of clusters
				this.clusters = Array(clusterCount).fill({}).map(function () {
					return {
						point: bounds.map(function (dim) {
							return Math.random() * (dim.max - dim.min + 1) + dim.min;
						}),
						contains: []
					};
				});
			}
		}, {
			key: 'gatherClusters',
			value: function gatherClusters() {
				var _this = this;
	
				this.dataset.forEach(function (point) {
	
					var cluster = _this.getClosestCluster(point);
	
					cluster.contains.push(point);
				});
			}
		}, {
			key: 'getClosestCluster',
			value: function getClosestCluster(point) {
	
				var closestCluster = this.clusters[0];
				var closestDist = (0, _distance.euclideanDistance)(point.data, this.clusters[0].point);
	
				this.clusters.forEach(function (cluster) {
	
					var dist = (0, _distance.euclideanDistance)(point.data, cluster.point);
	
					if (closestDist > dist) {
						closestDist = dist;
						closestCluster = cluster;
					}
				});
	
				return closestCluster;
			}
		}, {
			key: 'getClusterMean',
			value: function getClusterMean(points) {
	
				if (points.length === 0) return Array(this.dataset[0].data.length).fill(0);
	
				var sum = points[0].data;
	
				var _loop = function _loop(i) {
					sum = sum.map(function (d, j) {
						return d + points[i].data[j];
					});
				};
	
				for (var i = 1; i < points.length; i++) {
					_loop(i);
				}return sum.map(function (s) {
					return s / points.length;
				});
			}
		}, {
			key: 'getClusterMedian',
			value: function getClusterMedian(points) {
	
				var emptyArr = Array(this.dataset[0].data.length).fill(0);
	
				if (points.length === 0) return emptyArr;
	
				var sortedDS = points.sort(function (p1, p2) {
	
					var sumSquare = function sumSquare(data) {
						return data.reduce(function (a, b) {
							return a + b * b;
						}, 0);
					};
	
					return sumSquare(p1.data) - sumSquare(p2.data);
				});
	
				var median = void 0;
	
				var mid = Math.floor(sortedDS.length / 2);
	
				if (sortedDS.length % 2 == 1) {
	
					var emptyPoint = { data: emptyArr };
	
					median = this.getClusterMean([sortedDS[mid + 1] || emptyPoint, sortedDS[mid - 1] || emptyPoint]);
				} else {
					median = sortedDS[mid].data;
				}
	
				// console.log(median);
	
				return median;
			}
		}, {
			key: 'nextClusters',
			value: function nextClusters(getClusterCenter) {
	
				getClusterCenter = getClusterCenter || this.getClusterMean;
	
				this.clusters.forEach(function (cpoint) {
	
					var mean = getClusterCenter(cpoint.contains);
	
					cpoint.point = mean;
	
					cpoint.contains = [];
				});
	
				this.gatherClusters();
			}
		}]);
	
		return KMeansClustering;
	}();
	
	// Think about the structure of the code again pls
	
	
	exports.default = function () {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	
	
		// The error factor for the cluster points
		config.errorFactor = config.errorFactor || 5;
	
		// The clustering type
		config.type = config.type || 'mean';
	
		// Need the number of clusters
		if (!('clusters' in config)) throw new Error('Need to specify the number of clusters for kMeans');
	
		// Trainin time
		return function (trainDS) {
	
			var kmeans = new KMeansClustering(trainDS);
	
			var getClusterCenter = void 0;
	
			switch (config.type) {
				case 'mean':
					getClusterCenter = kmeans.getClusterMean;
					break;
				case 'median':
					getClusterCenter = kmeans.getClusterMedian;
					break;
				default:
					throw new Error('Invalid clustering type');
			}
	
			// Plot n random section points(N dimensional points)
			kmeans.randomizeClusters(config.clusters);
	
			var prevDist = void 0,
			    errorFactor = void 0;
	
			do {
	
				// Cache the previous cluster points
				prevDist = kmeans.clusters.map(function (p) {
					return p.point;
				});
	
				// Gather all the points to the closest cluster
				kmeans.gatherClusters();
	
				// Calculate the next cluster position
				kmeans.nextClusters(getClusterCenter);
	
				// The error factor(i.e. sum of distances between 
				// old cluster point and the new cluster points)
				errorFactor = kmeans.clusters.map(function (p, i) {
					return (0, _distance.euclideanDistance)(p.point, prevDist[i]);
				}).reduce(function (total, dist) {
					return total + dist;
				}, 0);
			} while (errorFactor >= config.errorFactor);
	
			// Classification(Not clusterin right now)
			return function (testPoint) {
	
				// Get the cluster closest to the test point
				var closestCluster = kmeans.getClosestCluster({ data: testPoint });
	
				// Name of the most repeated label
				var maxLabel = '_';
				var most = {};
				most[maxLabel] = 0;
	
				closestCluster.contains.map(function (p) {
	
					if (!(p.label in most)) most[p.label] = 0;
	
					if (++most[p.label] > most[maxLabel]) {
						maxLabel = p.label;
					}
				});
	
				return {
					label: maxLabel,
					accuracy: 100 * most[maxLabel] / closestCluster.contains.length
				};
			};
		};
	};

/***/ }
/******/ ]);
//# sourceMappingURL=main.js.map