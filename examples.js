function example1() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.width, "==", 300);
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.top, "==", root.top, 1, 20);
	addConstraint(hola.right, "==", root.right, 1, -30);
	// Bottom y Left los calcula
}

function example2() { // Deberia verse igual que example1() pero hacia arriba
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.left, "==", root.left, 1, 120);
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.bottom, "==", root.bottom, 1, -80);
	addConstraint(hola.right, "==", root.right, 1, -30);
	// Width y Top los calcula
}

function example3() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.top, "==", root.top, 1, 20);
	addConstraint(hola.right, "==", root.right, 1, -90);
	addConstraint(hola.left, "==", root.left, 3, 18); // Left assignment
}

function example4() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	root.addSubView(hola.addSubView(chau));
	
	addConstraint(hola.bottom, "==", root.bottom, 1, -30);
	addConstraint(hola.top, "==", root.top, 1, 30);
	addConstraint(hola.right, "==", root.right, 1, -30);
	addConstraint(hola.left, "==", root.left, 1, 30);
	
	addConstraint(chau.height, "==", 30); // Faltan datos para chau
	addConstraint(chau.top, "==", hola.top, 1, 10);
	addConstraint(chau.right, "==", hola.right, 1, -10);
}

function example5() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	root.addSubView(hola.addSubView(chau));
	
	addConstraint(hola.top, "==", root.top); // Cuarto superior izquierdo
	addConstraint(hola.left, "==", root.left);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.height, "==", root.height, 0.5);
	
	addConstraint(chau.bottom, "==", hola.bottom); // Cuarto inferior derecho
	addConstraint(chau.right, "==", hola.right);
	addConstraint(chau.width, "==", hola.width, 0.5);
	addConstraint(chau.height, "==", hola.height, 0.5);
}

function example6() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.centerY, "==", root.centerY); // Centrado verticalmente
	addConstraint(hola.centerX, "==", root.centerX); // Centrado horizontalmente
}

function example7() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.centerY, "==", root.centerY);
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.25);
	addConstraint(hola.left, "==", root.centerX); // centerX
}

function example8() { // Using addConstraints
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola).addSubView(chau);
	
	addConstraints([
		[hola.centerX, "==", root.centerX],
		[chau.centerX, "==", hola.centerX],
		[hola.width, "==", root.width, 0.9],
		[chau.width, "==", hola.width],
		[chau.top, "==", root.centerY], // centerY
		[chau.height, "==", hola.height],
		[hola.height, "==", root.height, 0.25],
		[hola.bottom, "==", root.centerY] // centerY
	]);
}

function example9() { // Igual que example8 pero con mas garra (ver Constraints), y otro layer extra
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	var pepe = new Layer("pepe", "00AA00");
	root.addSubView(hola).addSubView(chau).addSubView(pepe);
	
	addConstraint(hola.centerX, "==", root.centerX);
	addConstraint(chau.centerX, "==", hola.centerX);
	
	addConstraint(hola.width, "==", root.width, 0.9);
	addConstraint(chau.width, "==", hola.width);
	
	addConstraint(chau.top, "==", root.centerY);
	addConstraint(chau.height, "==", hola.height);
	
	addConstraint(hola.height, "==", root.height, 0.25);
	addConstraint(hola.bottom, "==", root.centerY);
	
	addConstraint(pepe.centerX, "==", root.centerX); // Usando solo centerX/Y y height y width
	addConstraint(pepe.centerY, "==", root.centerY);
	addConstraint(pepe.height, "==", 50);
	addConstraint(pepe.width, "==", 50);
}

function example10() { // Leading y Trailing / TODO: Pensar mejor margenes
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.centerY, "==", root.centerY);
	addConstraint(hola.leading, "==", root.leading, 1, 50);
	addConstraint(hola.trailing, "==", root.trailing, 1, -200);
}

function example11() { // baseline
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola).addSubView(chau);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.centerX, "==", root.centerX);
	addConstraint(hola.centerY, "==", root.centerY);
	
	addConstraint(chau.width, "==", 50);
	addConstraint(chau.height, "==", 50);
	addConstraint(chau.centerX, "==", hola.centerX);
	addConstraint(chau.baseline, "==", hola.baseline);
}

function example12() { // Inecuaciones
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola).addSubView(chau);
	
	addConstraint(hola.height, "==", root.height, 0.25);
	addConstraint(hola.width, "==", root.width, 0.25);
	addConstraint(chau.height, "==", root.height, 0.25);
	addConstraint(chau.width, "==", root.width, 0.25);
	addConstraint(chau.bottom, "<=", root.bottom);
	addConstraint(chau.top, ">=", 0);
	addConstraint(chau.left, ">=", 0);
	addConstraint(chau.right, "<=", root.right);
	addConstraint(hola.bottom, "<=", root.bottom);
	addConstraint(hola.top, ">=", 0);
	addConstraint(hola.left, ">=", 0);
	addConstraint(hola.right, "<=", root.right);
	addConstraint(hola.bottom, "<=", root.centerY);
	addConstraint(chau.top, ">=", root.centerY);
	addConstraint(hola.left, ">=", chau.left, 1, 50);
	addConstraint(chau.left, ">=", chau.top); // pensar distancia bottom a bottom (cómo usarla)
}

function example13() { // Same as example11 but using addMapConstraintsTo
	var hola = new Layer("hola").setBackgroundColor("FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola).addSubView(chau);
	
	addMapConstraintsTo(hola, {
		height: ["==", root.height, 0.5],
		width: ["==", root.width, 0.5],
		centerX: ["==", root.centerX],
		centerY: ["==", root.centerY]
	});
	addMapConstraintsTo(chau, {	
		width: ["==", 50],
		height: ["==", 50],
		centerX: ["==", hola.centerX],
		baseline: ["==", hola.baseline]
	});
}

var lastTime = new Date().getTime();

var ang = 0, rad = 100;
function move() {
	var curTime = new Date().getTime();
	var difTime = (curTime - lastTime) / 1000;
	lastTime = curTime;
	
	ang += (2*Math.PI/2) * difTime; // Una vuelta cada dos segundos
	
	var h = 500 + Math.sin(ang)*rad;
	var w = 500 + Math.cos(ang)*rad;
	root.div.css("width", w+"px").css("height", h+"px");
	solver.suggestValue(root.width, w).suggestValue(root.height, h).resolve();
	drawAll();
	setTimeout("move();", 50);
}

function main() {
	
	var funcName = "example9";
	if ("example" in window.params) {
		var funcNameMaybe = "example"+window.params.example;
		if (funcNameMaybe in window)
			funcName = funcNameMaybe;
		else {
			var maxExample = 1;
			while ("example"+maxExample in window)
				maxExample++;
			alert("wrong example number :)\n\nchoose between 1 and "+(maxExample - 1)+" please.");
		}
			
	}
	
	window[funcName]();
	solver.addEditVar(root.width).addEditVar(root.height).beginEdit();
	move();
	
}
