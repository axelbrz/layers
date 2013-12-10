function example1() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.width, "==", null, 0, 300);
	addConstraint(hola.height, "==", null, 0, 500);
	addConstraint(hola.top, "==", null, 0, 20);
	addConstraint(hola.right, "==", null, 0, 30);
	// Bottom y Left los calcula
}

function example2() { // Deberia verse igual que example1()
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.left, "==", null, 0, 120);
	addConstraint(hola.height, "==", null, 0, 500);
	addConstraint(hola.bottom, "==", null, 0, 80);
	addConstraint(hola.right, "==", null, 0, 30);
	// Width y Top los calcula
}

function example3() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.height, "==", null, 0, 500);
	addConstraint(hola.top, "==", null, 0, 20);
	addConstraint(hola.right, "==", null, 0, 90);
	addConstraint(hola.right, "==", hola.left, 3, 18); // Left assignment
}

function example4() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	root.addSubView(hola);
	hola.addSubView(chau);
	
	addConstraint(hola.bottom, "==", null, 0, 30); // Asignaciones en cadena
	addConstraint(hola.top, "==", hola.bottom, 1, 0);
	addConstraint(hola.right, "==", hola.top, 1, 0);
	addConstraint(hola.left, "==", hola.right, 1, 0);
	
	addConstraint(chau.height, "==", null, 0, 30); // Faltan datos para chau
	addConstraint(chau.top, "==", null, 0, 10);
	addConstraint(chau.right, "==", null, 0, 10);
}

function example5() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	views.root.addSubView(hola);
	views.hola.addSubView(chau);
	
	addConstraint(hola.top, "==", null, 0, 0); // Cuarto superior izquierdo
	addConstraint(hola.left, "==", null, 0, 0);
	addConstraint(hola.width, "==", root.width, 0.5, 0);
	addConstraint(hola.height, "==", root.height, 0.5, 0);
	
	addConstraint(chau.bottom, "==", null, 0, 0); // Cuarto inferior derecho
	addConstraint(chau.right, "==", null, 0, 0);
	addConstraint(chau.width, "==", hola.width, 0.5, 0);
	addConstraint(chau.height, "==", hola.height, 0.5, 0);
}

function example6() {
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5, 0);
	addConstraint(hola.width, "==", root.width, 0.5, 0);
	addConstraint(hola.top, "==", hola.bottom, 1, 0); // Centrado verticalmente
	addConstraint(hola.left, "==", hola.right, 1, 0); // Centrado horizontalmente
}

function example7() {
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.top, "==", hola.bottom, 1, 0);
	addConstraint(hola.height, "==", root.height, 0.5, 0);
	addConstraint(hola.width, "==", root.width, 0.25, 0);
	addConstraint(hola.left, "==", root.centerX, 1, 0); // centerX
}

function example8() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	views.root.addSubView(hola);
	views.root.addSubView(chau);
	
	addConstraint(hola.left, "==", hola.right, 1, 0);
	addConstraint(hola.width, "==", root.width, 0.9, 0);
	addConstraint(hola.height, "==", root.height, 0.25, 0);
	addConstraint(hola.top, "==", root.centerY, 1, 0); // centerY
	
	addConstraint(chau.left, "==", chau.right, 1, 0);
	addConstraint(chau.width, "==", root.width, 0.9, 0);
	addConstraint(chau.height, "==", root.height, 0.25, 0);
	addConstraint(chau.bottom, "==", root.centerY, 1, 0); // centerY
}

function example9() { // Igual que example8 pero con mas garra (ver Constraints), y otro layer extra
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	var pepe = new Layer("pepe", "00AA00");
	
	views.root.addSubView(hola);
	views.root.addSubView(chau);
	views.root.addSubView(pepe);
	
	addConstraint(hola.left, "==", hola.right, 1, 0);
	addConstraint(chau.left, "==", chau.right, 1, 0);
	
	addConstraint(hola.width, "==", root.width, 0.9, 0);
	addConstraint(chau.width, "==", hola.width, 1, 0);
	
	addConstraint(chau.top, "==", hola.bottom, 1, 0);
	addConstraint(chau.bottom, "==", hola.top, 1, 0);
	
	addConstraint(hola.height, "==", root.height, 0.25, 0);
	addConstraint(hola.top, "==", root.centerY, 1, 0);
	
	addConstraint(pepe.centerX, "==", root.centerX, 1, 0); // Usando solo centerX/Y y height y width
	addConstraint(pepe.centerY, "==", root.centerY, 1, 0);
	
	addConstraint(pepe.height, "==", null, 0, 50);
	addConstraint(pepe.width, "==", null, 0, 50);
}

function example10() { // Leading y Trailing
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5, 0);
	addConstraint(hola.top, "==", hola.bottom, 1, 0);
	addConstraint(hola.leading, "==", null, 0, 50);
	addConstraint(hola.trailing, "==", null, 0, 200);
}

function example11() { // baseline
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	
	root.addSubView(hola);
	root.addSubView(chau);
	
	addConstraint(hola.height, "==", root.height, 0.5, 0);
	addConstraint(hola.width, "==", root.width, 0.5, 0);
	addConstraint(hola.left, "==", hola.right, 1, 0);
	addConstraint(hola.top, "==", hola.bottom, 1, 0);
	
	addConstraint(chau.width, "==", null, 0, 50);
	addConstraint(chau.height, "==", null, 0, 50);
	addConstraint(chau.centerX, "==", hola.centerX, 1, 0);
	addConstraint(chau.baseline, "==", hola.baseline, 1, 0);
}

function example12() { // Inecuaciones
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola);
	root.addSubView(chau);
	addConstraint(hola.height, "==", root.height, 0.25, 0);
	addConstraint(hola.width, "==", root.width, 0.25, 0);
	addConstraint(chau.height, "==", root.height, 0.25, 0);
	addConstraint(chau.width, "==", root.width, 0.25, 0);
	addConstraint(chau.bottom, ">=", 0, 0, 0);
	addConstraint(chau.top, ">=", 0, 0, 0);
	addConstraint(chau.left, ">=", 0, 0, 0);
	addConstraint(chau.right, ">=", 0, 0, 0);
	addConstraint(hola.bottom, ">=", 0, 0, 0);
	addConstraint(hola.top, ">=", 0, 0, 0);
	addConstraint(hola.left, ">=", 0, 0, 0);
	addConstraint(hola.right, ">=", 0, 0, 0);
	addConstraint(hola.bottom, ">=", root.height, 0.5, 0);
	addConstraint(chau.top, ">=", root.height, 0.5, 0);
	addConstraint(hola.left, ">=", chau.left, 1, 50);
	addConstraint(chau.left, ">=", chau.bottom, 1, 0);
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
}

function run() {
	example9();
	solver.addEditVar(root.width).addEditVar(root.height).beginEdit();
	setInterval("move();", 50);
	
}
