var cnvs, ctx;

var root;
var angle = 0;

function onload () {
	
	document.getElementById("angle").oninput = function () {
		angle = -this.value;
		redraw();
	};
	
	document.getElementById("separation").oninput = function () {
		separationDistanceAbsolute = this.value;
		redraw();
	};
	
	cnvs = document.getElementById("mainCanvas");
	ctx = cnvs.getContext("2d");
	
	root = makeTestCase();
	
	redraw();
	// console.log(root);
	
	
	// document.body.onkeypress = function () { rarara = !rarara; };
}

function isoRotationTransform () {
	
	// make (0, 0) be in the horizontal center
	ctx.translate(halfWidth, 0);
	
	var deformX = Math.cos(angle) * halfWidth;
	var deformY = Math.sin(angle) * halfWidth * 0.5;
	
	var scaleX = deformX / halfWidth;
	var skewY = deformY / halfWidth;
	
	ctx.scale(scaleX, 1);
	ctx.transform(1, skewY, 0, 1, 0, 0);
	
	// take (0, 0) back (a little less since now we scaled down) so content's center is in the horizontal center
	ctx.translate(-halfWidth, 0);
}

var halfWidth;

var separationDistanceAbsolute = 50;
var separationDistanceVisible = 0;
var separationTranslation = { "x": 0, "y": 0 };

function redraw () {
	
	// clear
	ctx.clearRect(0, 0, cnvs.width, cnvs.height);
	
	// transform: make content fit nicely and in the middle
	ctx.save();
	var contentSize = { "w": root.rect.w, "h": root.rect.h };
	halfWidth = contentSize.w / 2;
	var targetScale = 0.65;
	var rawScale = Math.min(cnvs.height / contentSize.h, cnvs.width / contentSize.w);
	var scale = targetScale * rawScale;
	var transX = (cnvs.width / scale - contentSize.w) / 2;
	var transY = (cnvs.height / scale - contentSize.h) / 2;
	ctx.scale(scale, scale);
	ctx.translate(transX, transY);
	
	
	// start make base
	ctx.save();
	ctx.translate(contentSize.w / 2, contentSize.h);
	ctx.scale(1, 0.5);
	
	var max = 8;
	for (var i = 0; i < max; i++) {
		var pepe = Math.sin(i * (Math.PI/2) / (max - 1));
		ctx.fillStyle = "rgb(255,"+Math.floor(pepe * 220)+","+Math.floor(pepe * 220)+")";
		ctx.beginPath();
		ctx.arc(0, 0, (1 - (0.8 / max) * i) * contentSize.w / 2, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	ctx.restore();
	// end make base
	
	
	separationDistanceVisible = Math.abs(Math.sin(angle)) * separationDistanceAbsolute;	
	separationTranslation.x = Math.abs(Math.sin(angle)) * separationDistanceVisible;
	separationTranslation.y = Math.abs(Math.cos(angle)) * separationDistanceVisible;
	
	
	var
		level = 0,
		oldStack = [],
		newStack = [root];
	
	while (newStack.length > 0) {
		
		oldStack = newStack;
		newStack = [];
		
		for (var i = 0; i < oldStack.length; i++) {
			oldStack[i].draw(level);
			newStack = newStack.concat(oldStack[i].children);
		}
		
		level++;

	}
	
	// root.draw();
	// root.children[0].draw(0, 0, 1);
	// root.children[1].draw(0, 0, 1);
	
	// restore from first transform (make content fit nicely and in the middle)
	ctx.restore();
	
}

function Rect (x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
}

function Node (parent) {
	this.parent = parent || null;
	this.rect = false;
	this.children = [];
	this.color = false;
	
	this.draw = function (level) {
		level = level || 0;
		var offset = this.offset();
		
		ctx.save();
		ctx.translate(level * separationTranslation.x, level * separationTranslation.y);
		isoRotationTransform();
		
		
		ctx.fillStyle = this.color+"";
		ctx.fillRect(offset.x, offset.y, this.rect.w, this.rect.h);
		ctx.strokeStyle = this.color.lighterBy(-0.25)+"";
		ctx.lineWidth = 1.5;
		ctx.strokeRect(offset.x, offset.y, this.rect.w, this.rect.h);
		
		for (var i = 0; i < this.children.length; i++) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
			ctx.fillRect(offset.x + this.children[i].rect.x, offset.y + this.children[i].rect.y, this.children[i].rect.w, this.children[i].rect.h);
		}
		
		
		ctx.restore();
		
		
		// for (var i = 0; i < this.children.length; i++) {
		// 	this.children[i].draw(offsetX, offsetY, level + 1);
		// }
		
	};
	
	this.offset = function () {
		var baseOffset = this.parent ? this.parent.offset() : { "x": 0, "y": 0 };
		baseOffset.x += this.rect.x;
		baseOffset.y += this.rect.y;
		return baseOffset;
	}
}

function Color (r, g, b, a) {
	if (a === undefined)
		a = 1;
	this.r = Math.min(Math.max(0, r), 1);
	this.g = Math.min(Math.max(0, g), 1);
	this.b = Math.min(Math.max(0, b), 1);
	this.a = Math.min(Math.max(0, a), 1);
	
	this.toString = function () {
		return "rgba("+
			Math.floor(this.r * 255)+","+
			Math.floor(this.g * 255)+","+
			Math.floor(this.b * 255)+","+
			this.a+")";
	};
	
	this.withAlpha = function (a) {
		return new Color(this.r, this.g, this.b, a);
	};
	
	this.lighterBy = function (k) {
		return new Color(this.r + k, this.g + k, this.b + k, this.a);
	};
}

function makeTestCase () {
	
	function makeNode (color, x, y, w, h, children) {
		var n = new Node();
		n.rect = new Rect(x, y, w, h);
		n.children = children;
		n.color = color;
		
		for (var i = 0; i < children.length; i++) {
			children[i].parent = n;
		}
		
		return n;
	}
	
	return makeNode(
		new Color(0, 1, 1),
		0, 0, 500, 500,
		[
			makeNode(
				new Color(1, 0, 0),
				10, 30, 300, 250,
				[
					makeNode(
						new Color(1, 1, 0),
						30, 10, 50, 120,
						[]
					),
					makeNode(
						new Color(0, 1, 0),
						85, 20, 120, 50,
						[]
					),
					makeNode(
						new Color(1, 0, 1),
						100, 100, 150, 130,
						[
							makeNode(
								new Color(0, 0, 1),
								40, 10, 40, 30,
								[]
							),
							makeNode(
								new Color(0, 1, 0),
								45, 50, 30, 70,
								[]
							)
						]
					)
				]
				
			),
			makeNode(
				new Color(0, 0, 1),
				115, 290, 360, 150,
				[
					makeNode(
						new Color(1, 0, 0),
						10, 10, 60, 80,
						[]
					),
					makeNode(
						new Color(0, 1, 0),
						95, 50, 230, 90,
						[
							makeNode(
								new Color(0, 1, 1),
								10, 10, 50, 60,
								[
								]
							),
							makeNode(
								new Color(1, 0, 1),
								110, 10, 30, 50,
								[
								]
							)
						]
					)
				]
			)
		]
	);
}

// var rarara = true;
// setInterval(function(){
// 	if (rarara) {
// 		angle -= 0.02;
// 		if (Math.abs(angle) >= Math.PI / 2)
// 			angle = 0;
// 	}
// 	redraw();
// },50);