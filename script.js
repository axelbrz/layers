// Pensar luego constraintsWithVisualFormat:options:metrics:views:
// hacer grupos de objetos? (clases) y hacer constraints sobre clases?

function include(source) { $.ajax({ async: false, url: source, dataType: "script" }); }
var CASSOWARY_SCRIPTS = [ // Keep this order
	"c.js", "HashTable.js", "HashSet.js", "Error.js", "SymbolicWeight.js", "Strength.js", "Variable.js",
	"Point.js", "Expression.js", "Constraint.js", "EditInfo.js", "Tableau.js", "SimplexSolver.js", "Timer.js", "parser/parser.js", "parser/api.js"
];
for (var i = 0; i < CASSOWARY_SCRIPTS.length; i++)
	include("cassowary/" + CASSOWARY_SCRIPTS[i]);


var LayerAttributes = function(id) {
	var atts = { top: 0, right: 0, left: 0, bottom: 0, width: 0, height: 0, centerX: 0, centerY: 0, leading: 0, trailing: 0, baseline: 0 };
	for (att in atts) {
		var varAtt = { value: atts[att] };
		if (typeof id !== 'undefined') varAtt.name = id+'.'+att; // name is just for debugging, it's not necessary. Use 'A' instead of '.' if it's an error when parsing
		this[att] = new c.Variable(varAtt);
	}
};
LayerAttributes.prototype = {
	get baseline() { return this._baseline; },set baseline(baseline) { if (baseline instanceof c.Variable) this._baseline = baseline; else this._baseline.value = baseline; },
	get bottom() { return this._bottom; },set bottom(bottom) { if (bottom instanceof c.Variable) this._bottom = bottom; else this._bottom.value = bottom; },
	get centerX() { return this._centerX; },set centerX(centerX) { if (centerX instanceof c.Variable) this._centerX = centerX; else this._centerX.value = centerX; },
	get centerY() { return this._centerY; },set centerY(centerY) { if (centerY instanceof c.Variable) this._centerY = centerY; else this._centerY.value = centerY; },
	get height() { return this._height; },set height(height) { if (height instanceof c.Variable) this._height = height; else this._height.value = height; },
	get leading() { return this._leading; },set leading(leading) { if (leading instanceof c.Variable) this._leading = leading; else this._leading.value = leading; },
	get left() { return this._left; },set left(left) { if (left instanceof c.Variable) this._left = left; else this._left.value = left; },
	get right() { return this._right; },set right(right) { if (right instanceof c.Variable) this._right = right; else this._right.value = right; },
	get top() { return this._top; },set top(top) { if (top instanceof c.Variable) this._top = top; else this._top.value = top; },
	get trailing() { return this._trailing; },set trailing(trailing) { if (trailing instanceof c.Variable) this._trailing = trailing; else this._trailing.value = trailing; },
	get width() { return this._width; },set width(width) { if (width instanceof c.Variable) this._width = width; else this._width.value = width; },
	toString: function() { return ""; }
};



function parseConstraint(c) {
	var re = /^([1-9]*)([a-z]*)$/;
	var result = re.exec("876aaasdv");
	if (result === null) return null;
	
	var obj1 = result[1];
	var att1 = result[2];
	var op = result[2];
	var obj1 = result[1];
	var att1 = result[2];
	var scal = result[2];
	var scal = result[2];
	
	alert(result);
	alert(result.index);
}


function randomID () {
	var id;
	do {
		id = "";
		for (var i = 0; i < 6; i++)
			id += String.fromCharCode(Math.floor(Math.random() * 26)+97);
	} while((id in views) || id == "root");
	return id;
}

function randomColor() {
	var c = Math.floor(Math.random() * 256*256*256).toString(16);
	while (c.length < 6) c = "0" + c;
	return c;
}

// http://24ways.org/2010/calculating-color-contrast/
function getContrastYIQ(hexcolor){
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}


//=================================================================
// DEBUG
//=================================================================

function log(msg, error, clearFirst) {
	if (error) msg = '<b style="color: red;">'+msg+'</b>';
	if (clearFirst) $("#debugWindow").html(msg);
	else $("#debugWindow").append("<br/>"+msg);
}


//=================================================================
// VIEWS
//=================================================================

var Layer = function(id, color) {
	if (typeof id === 'string' && (id in views)) return null; // Invalid: duplicated ID // Check if it exists in all views (DOM+not already added)? Or check when it's added
	
	this.id = id;
	this.parent = null;
	this.children = [];
	this.atts = new LayerAttributes(id);
	for (att in this.atts) this[att] = this.atts[att];
	
	views[id] = this;
	
	if (id == "root") {
		this.div = $("#root");
	} else if (typeof id !== undefined) {
		this.div = $('<div id="'+id+'" class="view"><span class="id">'+id+'</span></div>'); // When finished, remove the span
	} else {
		this.div = $('<div class="view"></div>');
	}
	if (typeof color !== 'undefined') this.setColor(color);
	
	if (id == "root") {
		this.atts.height = parseInt(this.div.css("height")); // Don't use this.height
		this.atts.width = parseInt(this.div.css("width")); // Don't use this.width
		
		solver.addStay(this.top);
		solver.addStay(this.left);
		solver.addStay(this.right);
		solver.addStay(this.bottom);
		solver.addStay(this.height);
		solver.addStay(this.width);
	}
	
	this._addViewConstraints(solver);
	
	log("New view: " + this.id);
};
Layer.prototype = {
	setColor: function(hexColor) {
		this.div.css("background-color", "#"+hexColor);
		this.div.children(".id").css("color", getContrastYIQ(hexColor));
		return this;
	},

	_addViewConstraints: function(solver) {
		// CenterX Constraint
		var wdt = new c.Expression(this.width);
		var lft = new c.Expression(this.left);
		var cnX = new c.Expression(this.centerX);
		solver.addConstraint(new c.Equation(wdt.divide(2).plus(lft), cnX)); // width/2 + left = centerX
		
		// CenterY Constraint
		var hgt = new c.Expression(this.height);
		var top = new c.Expression(this.top);
		var cnY = new c.Expression(this.centerY);
		solver.addConstraint(new c.Equation(hgt.divide(2).plus(top), cnY)); // height/2 + top = centerY
		
		// Leading and Trialing Constraints
		var rgt = new c.Expression(this.right);
		var ldn = new c.Expression(this.leading);
		var trl = new c.Expression(this.trailing);
		solver.addConstraint(new c.Equation(ldn, lft)); // TODO: SEE LANGUAGE
		solver.addConstraint(new c.Equation(trl, rgt)); // TODO: SEE LANGUAGE
		
		// Baseline constraint
		var btm = new c.Expression(this.bottom);
		var bln = new c.Expression(this.baseline);
		solver.addConstraint(new c.Equation(btm, bln)); // TODO: SEE TEXTS
	},

	_addParentChildContraints: function(solver, child) {
		var lft = new c.Expression(child.left);
		var top = new c.Expression(child.top);
		var wdt = new c.Expression(child.width);
		var hgt = new c.Expression(child.height);
		var rgh = new c.Expression(child.right);
		var btm = new c.Expression(child.bottom);
		var pwdt = new c.Expression(this.width);
		var phgt = new c.Expression(this.height);
		solver.addConstraint(new c.Equation(lft.plus(wdt).plus(rgh), pwdt)); // left+width+right = p.width
		solver.addConstraint(new c.Equation(top.plus(hgt).plus(btm), phgt)); // top+height+bottom = p.height
	},

	addSubView: function(subView) {
		if (subView.id == "root") return null; // Invalid assignation of root as a subView
		if (subView.parent == this.id) return false; // This parent-child relation already exists
		if (subView.parent !== null) return null; // Invalid: Another parent-child relation exists
		
		this._addParentChildContraints(solver, subView);
		
		subView.parent = this;
		this.children.push(subView);
		this.div.append(subView.div.detach());
		
		log(this.id + " added " + subView.id);
	},
	
	draw: function() {
		if (this.id == "root") return;
		var atts = ["top", "left", "right", "bottom", "height", "width"];
		for (var i = 0; i < atts.length; i++) {
			$(this.div).css(atts[i], this.atts[atts[i]].value + "px"); // Consider using this.div
		}
	},
	
	toString2: function() {
		var s = "";
		if (typeof this.id != 'undefined') s += " - " + this.id + ": ";
		for (a in this.atts) if (a.charAt(0) != '_' && a != "toString") {
			s += a + ":" + this.atts[a].value + ", ";
		}
		return s;
	}
};

function drawAll(view) {
	if (typeof view === 'undefined') view = root;
	view.draw();
	for (var i = 0; i < view.children.length; i++) drawAll(view.children[i]);
}

function showViewLog(view) {
	if (typeof view === 'undefined') view = root;
	log(view.toString2());
	for (var i = 0; i < view.children.length; i++) showViewLog(view.children[i]);
}

//=================================================================
// CONSTRAINS
//=================================================================

function constraintString(c) {
	var rightSide = (c.id2 !== null ? c.id2+"."+c.at2+(c.m!=1?" * "+(c.m<0?"(":"")+c.m+(c.m<0?")":""):"") : "");
	rightSide += (c.b != 0 ? (rightSide!=""?" + ":"")+c.b : "");
	if (rightSide == "") rightSide = "0";
	return c.id1 + "." + c.at1 + " " + c.op + " " + rightSide;
}

// id1.at1 [op] id2.at * m + b  -------- with priority
function addConstraint(at1, op, at2, m, b, priotity) {
	if (['==','>=','<='].indexOf(op) < 0) return false;
	
	var left = new c.Expression(at1), right = new c.Expression(b);
	if (at2 !== null) right = c.plus(right, (new c.Expression(at2)).times(m));
	// TODO: hacer en cassowary.js un plus como times
	
	if (op == '==') solver.addConstraint(new c.Equation(left, right));
	else if (op == '<=') solver.addConstraint(new c.Inequality(left, c.LEQ, right));
	else if (op == '>=') solver.addConstraint(new c.Inequality(left, c.GEQ, right));
	
	//var cn = { id1: id1, at1: at1, op: op, id2: id2, at2: at2, m: m, b: b }
	//log("Constraint added: " + constraintString(cn));
}


//=================================================================
// INIT
//=================================================================
var views = {};
var root = null;

$(document).ready(function() {
	log("Script loaded<br/>", false, true);
	root = new Layer("root");
	views["root"] = root;
});

//=================================================================
// CODE
//=================================================================



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



var solver = new c.SimplexSolver();
var scriptFinished = false;
$(document).ready(function() {
	setTimeout('if (scriptFinished) log("<br/>Script done", false); else log("<br/>Script failed", true); ', 1);
	
	example12();
	
	log("");
	log("Solution");
	showViewLog();
	
	document.getElementById("solver-info").innerHTML = "<pre>" + solver.getInternalInfo() + "</pre>";
	
	drawAll();
	
	// TO KNOW
	// this.solver.addEditVar(var1).addEditVar(var2).beginEdit();
	// this.solver.suggestValue(var1, val1).suggestValue(var2, val2).resolve(); // esto ya las cambia
	// this.solver.endEdit(); // esto dice que si o si no vas a editar mas
	
	scriptFinished = true;
});
