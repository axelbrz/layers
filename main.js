function example1() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.width, "==", 300);
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.top, "==", 20);
	addConstraint(hola.right, "==", 30);
	// Bottom y Left los calcula
}

function example2() { // Deberia verse igual que example1() pero hacia arriba
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.left, "==", 120);
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.bottom, "==", 80);
	addConstraint(hola.right, "==", 30);
	// Width y Top los calcula
}

function example3() {
	var hola = new Layer("hola", "FF0000");
	root.addSubView(hola);
	
	addConstraint(hola.height, "==", 500);
	addConstraint(hola.top, "==", 20);
	addConstraint(hola.right, "==", 90);
	addConstraint(hola.right, "==", hola.left, 3, 18); // Left assignment
}

function example4() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	root.addSubView(hola);
	hola.addSubView(chau);
	
	addConstraint(hola.bottom, "==", 30); // Asignaciones en cadena
	addConstraint(hola.top, "==", hola.bottom);
	addConstraint(hola.right, "==", hola.top);
	addConstraint(hola.left, "==", hola.right);
	
	addConstraint(chau.height, "==", 30); // Faltan datos para chau
	addConstraint(chau.top, "==", 10);
	addConstraint(chau.right, "==", 10);
}

function example5() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", randomColor());
	views.root.addSubView(hola);
	views.hola.addSubView(chau);
	
	addConstraint(hola.top, "==", 0); // Cuarto superior izquierdo
	addConstraint(hola.left, "==", 0);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.height, "==", root.height, 0.5);
	
	addConstraint(chau.bottom, "==", 0); // Cuarto inferior derecho
	addConstraint(chau.right, "==", 0);
	addConstraint(chau.width, "==", hola.width, 0.5);
	addConstraint(chau.height, "==", hola.height, 0.5);
}

function example6() {
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.top, "==", hola.bottom); // Centrado verticalmente
	addConstraint(hola.left, "==", hola.right); // Centrado horizontalmente
}

function example7() {
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.top, "==", hola.bottom);
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.25);
	addConstraint(hola.left, "==", root.centerX); // centerX
}

function example8() {
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	views.root.addSubView(hola);
	views.root.addSubView(chau);
	
	addConstraint(hola.left, "==", hola.right);
	addConstraint(hola.width, "==", root.width, 0.9);
	addConstraint(hola.height, "==", root.height, 0.25);
	addConstraint(hola.top, "==", root.centerY); // centerY
	
	addConstraint(chau.left, "==", chau.right);
	addConstraint(chau.width, "==", root.width, 0.9);
	addConstraint(chau.height, "==", root.height, 0.25);
	addConstraint(chau.bottom, "==", root.centerY); // centerY
}

function example9() { // Igual que example8 pero con mas garra (ver Constraints), y otro layer extra
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	var pepe = new Layer("pepe", "00AA00");
	
	views.root.addSubView(hola);
	views.root.addSubView(chau);
	views.root.addSubView(pepe);
	
	addConstraint(hola.left, "==", hola.right);
	addConstraint(chau.left, "==", chau.right);
	
	addConstraint(hola.width, "==", root.width, 0.9);
	addConstraint(chau.width, "==", hola.width);
	
	addConstraint(chau.top, "==", hola.bottom);
	addConstraint(chau.bottom, "==", hola.top);
	
	addConstraint(hola.height, "==", root.height, 0.25);
	addConstraint(hola.top, "==", root.centerY);
	
	addConstraint(pepe.centerX, "==", root.centerX); // Usando solo centerX/Y y height y width
	addConstraint(pepe.centerY, "==", root.centerY);
	
	addConstraint(pepe.height, "==", 50);
	addConstraint(pepe.width, "==", 50);
}

function example10() { // Leading y Trailing
	var hola = new Layer("hola", "FF0000");
	views.root.addSubView(hola);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.top, "==", hola.bottom);
	addConstraint(hola.leading, "==", 50);
	addConstraint(hola.trailing, "==", 200);
}

function example11() { // baseline
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	
	root.addSubView(hola);
	root.addSubView(chau);
	
	addConstraint(hola.height, "==", root.height, 0.5);
	addConstraint(hola.width, "==", root.width, 0.5);
	addConstraint(hola.left, "==", hola.right);
	addConstraint(hola.top, "==", hola.bottom);
	
	addConstraint(chau.width, "==", 50);
	addConstraint(chau.height, "==", 50);
	addConstraint(chau.centerX, "==", hola.centerX);
	addConstraint(chau.baseline, "==", hola.baseline);
}

function example12() { // Inecuaciones
	var hola = new Layer("hola", "FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola);
	root.addSubView(chau);
	addConstraint(hola.height, "==", root.height, 0.25);
	addConstraint(hola.width, "==", root.width, 0.25);
	addConstraint(chau.height, "==", root.height, 0.25);
	addConstraint(chau.width, "==", root.width, 0.25);
	addConstraint(chau.bottom, ">=", 0);
	addConstraint(chau.top, ">=", 0);
	addConstraint(chau.left, ">=", 0);
	addConstraint(chau.right, ">=", 0);
	addConstraint(hola.bottom, ">=", 0);
	addConstraint(hola.top, ">=", 0);
	addConstraint(hola.left, ">=", 0);
	addConstraint(hola.right, ">=", 0);
	addConstraint(hola.bottom, ">=", root.height, 0.5);
	addConstraint(chau.top, ">=", root.height, 0.5);
	addConstraint(hola.left, ">=", chau.left, 1, 50);
	addConstraint(chau.left, ">=", chau.bottom);
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

function main() {
	example12();
	solver.addEditVar(root.width).addEditVar(root.height).beginEdit();
	setInterval("move();", 50);
	
}
