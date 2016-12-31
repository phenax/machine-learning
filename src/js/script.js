
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

	const _digitR= new DigitRecognition($canvas);

	const numberOfEach= 5;
	const images= ['one', 'two'];
	images.forEach(name => {
		for(let i= 0; i < numberOfEach; i++)
			_digitR.trainWithImage(name, `/dist/training/${name}_${i + 1}.png`);
	});

	$trainBtn.addEventListener('click', () => _digitR.train($textField.value));
	$clearBtn.addEventListener('click', () => _digitR.clearCanvas());
	$guessBtn.addEventListener('click', () => {

		$output.textContent= ' ';

		$output.textContent= _digitR.classify();
	});
});
