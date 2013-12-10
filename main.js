
/*
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
*/
function main() {
	//var layout = new Layout(800, 600);
	
	var hola = new Layer("hola").setColor("FF0000");
	var chau = new Layer("chau", "0000AA");
	root.addSubView(hola).addSubView(chau);
	/*const(
		[hola, {
			height: ["==", root.height, 0.25],
			height: ["==", root.height, 0.25],
		}]
	);*/
	
	addMapConstraintsTo(hola, {
		height: ["==", root.height, 0.25],
		width: ["==", root.width, 0.25],
		bottom: [">=", 0],
		top: [">=", 0],
		left: [">=", 0],
		right: [">=", 0]
	});
	addMapConstraintsTo(hola, {
		bottom: [">=", root.height, 0.5],
		left: [">=", chau.left, 1, 50]
	});
	addMapConstraintsTo(chau, {
		height: ["==", root.height, 0.25],
		width: ["==", root.width, 0.25],
		bottom: [">=", 0],
		top: [">=", 0],
		left: [">=", 0],
		right: [">=", 0],
	});
	addMapConstraintsTo(chau, {
		top: [">=", root.height, 0.5],
		left: [">=", chau.bottom]
	});
}
