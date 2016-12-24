
import {Learn} from './Learn/Learn';

export default class DigitRecognition {

	constructor(canvas) {

		this.$canvas= canvas;

		this.ctx= this.$canvas.getContext('2d');

		this.learn= new Learn(Learn.kNN({ k: 3 }));

		this._mouseDown= false;
		this._prevTouch= {};

		this.attachListeners();
	}

	resizeHandler() {
		this._bound= this.$canvas.getBoundingClientRect();
	}

	attachListeners() {
		this.mouseDownHandler= this.mouseDownHandler.bind(this);
		this.mouseMoveHandler= this.mouseMoveHandler.bind(this);
		this.mouseUpHandler= this.mouseUpHandler.bind(this);
		this.resizeHandler= this.resizeHandler.bind(this);

		this.resizeHandler();
		document.addEventListener('resize', this.resizeHandler);


		this.$canvas.addEventListener('mousedown', this.mouseDownHandler);
		this.$canvas.addEventListener('mouseup', this.mouseUpHandler);
		this.$canvas.addEventListener('mousemove', this.mouseMoveHandler);
		this.$canvas.addEventListener('touchstart', this.mouseDownHandler);
		this.$canvas.addEventListener('touchend', this.mouseUpHandler);
		this.$canvas.addEventListener('touchmove', this.mouseMoveHandler);
	}

	
	_normalizeTouch(e) {

		const p= {
			x: e.pageX || e.touches[0].pageX,
			y: e.pageY || e.touches[0].pageY
		};

		p.x= p.x - this._bound.left;
		p.y= p.y - this._bound.top;

		return p;
	}

	mouseDownHandler(e) {
		e.preventDefault();
		this._mouseDown= true;
		this._prevTouch= this._normalizeTouch(e);
	}

	mouseMoveHandler(e) {

		if(this._mouseDown) {
			e.preventDefault();

			const p= this._normalizeTouch(e);

			if( p.x >= this.$canvas.width ||
				p.x <= 0 ||
				p.y >= this.$canvas.height ||
				p.y <= 0
			) {
				this._mouseDown= false;
				return;
			}

			this.ctx.beginPath();
			this.ctx.moveTo(this._prevTouch.x, this._prevTouch.y);
			this.ctx.lineTo(p.x, p.y);
			this.ctx.stroke();

			this._prevTouch= p;
		}
	}

	mouseUpHandler() {
		this._mouseDown= false;
	}

	clearCanvas() {
		this.ctx.clearRect(0, 0, this._bound.width, this._bound.height);
	}

	getImage() {

		let image= this.ctx.getImageData(0, 0, this._bound.width, this._bound.height);

		const pixels= [];

		for(let i= 0; i < image.data.length; i+= 4) {
			if(image.data[i + 3] === 255)
				pixels.push(1);
			else
				pixels.push(0);
		}

		return Object.assign({}, image, { data: pixels });
	}

	train(label) {

		const {data}= this.getImage();

		this.learn.train([{ label, data }]);
	}

	classify() {

		const {data}= this.getImage();

		return this.learn.classify(data);
	}
}
