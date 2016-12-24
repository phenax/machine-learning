
import DigitRecognition from './DigitRecognition';

document.addEventListener('DOMContentLoaded', () => {

	const $canvas= document.querySelector('.js-canvas');
	const $trainBtn= document.querySelector('.js-train');
	const $guessBtn= document.querySelector('.js-guess');
	const $textField= document.querySelector('.js-input');
	const $output= document.querySelector('.js-output');

	const $clear= document.querySelector('.js-clear');

	const dg= new DigitRecognition($canvas);

	$trainBtn.addEventListener('click', () => dg.train($textField.value));
	$guessBtn.addEventListener('click', () => {
		$output.textContent= dg.classify();
	});
	$clear.addEventListener('click', () => dg.clearCanvas());
});
