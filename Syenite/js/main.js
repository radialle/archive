var defaultImage = 'img/default.jpg';

var canvas, ctx, originalImageData, select, main;

function init() {
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	select = document.querySelector('#effect');
	main = document.querySelector('#main');
	loadImage(defaultImage);

	window.addEventListener('resize', updateCanvasPosition);

	document.body.addEventListener('dragover', function(e) {
		e.preventDefault();
	});
	document.body.addEventListener('drop', function(e) {
		e.preventDefault();
		loadImageFromFile(e.dataTransfer.files[0]);
	});

	document.querySelector("#file-input").addEventListener('change', openFile);
}

function openFile(e) {
	loadImageFromFile(e.target.files[0]);
}

function updateSaveButton() {
	var dataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
	document.querySelector('a.save').href = dataURL;
}

function loadImageFromFile(file) {
	if(!file.type.match(/image.*/)) {
		alert('Not an image file!');
		return;
	}
	var reader = new FileReader();
	reader.onload = function(e) {
		loadImage(e.target.result);
	}
	reader.readAsDataURL(file);
}

function loadImage(url) {
	select.value = 'none';
	var image = new Image();
	image.onload = function() {
		setCanvasSize(image.width, image.height);
		ctx.drawImage(image, 0, 0);
		originalImageData = ctx.getImageData(0, 0, image.width, image.height);
		updateSaveButton();
	}
	image.src = url;
}

function setCanvasSize(w, h) {
	canvas.setAttribute('width', w);
	canvas.setAttribute('height', h);
	updateCanvasPosition();
}

function updateCanvasPosition() {
	var h = canvas.getAttribute('height');
	var w = canvas.getAttribute('width');
	if (h > main.clientHeight) {
		canvas.style.top = '0';
		canvas.style.marginTop = '0';
	}
	else {
		canvas.style.top = '50%';
		canvas.style.marginTop = (-Math.round(h/2)) + 'px';
	}
	canvas.style.marginLeft = (-Math.round(w/2)) + 'px';
}

function applyEffect() {

	var name = select.value;

	var imageData = ctx.createImageData(originalImageData);
	imageData.data.set(originalImageData.data);
	var data = imageData.data;

	if (name == 'none') {
		ctx.putImageData(imageData, 0, 0);
		return;
	}
	else if (name == 'redChannelDisplacement') {
		data = channelDisplacement(data, 0, 64);
	}
	else if (name == 'greenChannelDisplacement') {
		data = channelDisplacement(data, 1, 65);
	}
	else if (name == 'blueChannelDisplacement') {
		data = channelDisplacement(data, 2, 66);
	}
	else if (name == 'copyGreenToRed') {
		data = channelDisplacement(data, 0, 1);
	}
	else if (name == 'copyBlueToRed') {
		data = channelDisplacement(data, 0, 2);
	}
	else if (name == 'copyRedToGreen') {
		data = channelDisplacement(data, 1, 0);
	}
	else if (name == 'copyBlueToGreen') {
		data = channelDisplacement(data, 1, 2);
	}
	else if (name == 'copyRedToBlue') {
		data = channelDisplacement(data, 2, 0);
	}
	else if (name == 'copyGreenToBlue') {
		data = channelDisplacement(data, 2, 1);
	}
	else if (name == 'removeRedChannel') {
		data = removeChannel(data, 0);
	}
	else if (name == 'removeGreenChannel') {
		data = removeChannel(data, 1);
	}
	else if (name == 'removeBlueChannel') {
		data = removeChannel(data, 2);
	}
	else if (name == 'redChannelOnly') {
		data = channelOnly(data, 0);
	}
	else if (name == 'greenChannelOnly') {
		data = channelOnly(data, 1);
	}
	else if (name == 'blueChannelOnly') {
		data = channelOnly(data, 2);
	}
	else if (name == 'redToAlpha') {
		data = channelToAlpha(data, 0);
	}
	else if (name == 'greenToAlpha') {
		data = channelToAlpha(data, 1);
	}
	else if (name == 'blueToAlpha') {
		data = channelToAlpha(data, 2);
	}
	else if (name == 'grayscale') {
		data = grayscale(data);
	}

	imageData.data = data;
	ctx.putImageData(imageData, 0, 0);
	updateSaveButton();
}

function channelDisplacement(data, a, b) {
	for (var i = 0, n = data.length; i < n; i += 4) {
		data[i+a] = data[i+b];
	}
	return data;
} 

function removeChannel(data, channel) {
	for (var i = 0, n = data.length; i < n; i += 4) {
		data[i+channel] = 0;
	}
	return data;
}

function channelOnly(data, channel) {
	var copy;
	for (var i = 0, n = data.length; i < n; i += 4) {
		copy = data[i+channel];
		data[i] = 0;
		data[i+1] = 0;
		data[i+2] = 0;
		data[i+channel] = copy;
	}
	return data;
}

function channelToAlpha(data, channel) {
	for (var i = 0, n = data.length; i < n; i += 4) {
		data[i+3] = data[i+channel];
		data[i] = 0;
		data[i+1] = 0;
		data[i+2] = 0;
	}
	return data;
}

function grayscale(data) {
	for (var i = 0, n = data.length; i < n; i += 4) {
		var val = Math.round((data[i] + data[i+1] + data[i+2]) / 3);
		data[i] = val;
		data[i+1] = val;
		data[i+2] = val;
	}
	return data;
}