
import DigitRecognition from './DigitRecognition';

document.addEventListener('DOMContentLoaded', () => {

	const $canvas= document.querySelector('.js-canvas');
	const $trainBtn= document.querySelector('.js-train');
	const $guessBtn= document.querySelector('.js-guess');
	const $textField= document.querySelector('.js-input');
	const $output= document.querySelector('.js-output');
	const $clearBtn= document.querySelector('.js-clear');

	$canvas.width= 100;
	$canvas.height= 100;

	const dg= new DigitRecognition($canvas);

	const numberOfEach= 5;
	const images= ['one', 'two'];
	images.forEach(name => {
		for(let i= 0; i < numberOfEach; i++)
			dg.trainWithImage(name, `/dist/training/${name}_${i + 1}.png`);
	});

	$trainBtn.addEventListener('click', () => dg.train($textField.value));
	$clearBtn.addEventListener('click', () => dg.clearCanvas());
	$guessBtn.addEventListener('click', () => {

		$output.textContent= ' ';

		setTimeout(() => {
			const result= dg.classify();
			$output.textContent= result;
		}, 0);
	});
});
