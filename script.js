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
	for (att in atts) this[att] = new c.Variable({ name: id+'AA'+att, value: atts[att] }); // AA is just for debugging, the name is not necessary
}
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

function buildNewView(_id) {
	return { id: _id, parent: null, children: [], atts: new LayerAttributes(_id) };
}

function loadRootAttributes() {
	views["root"].atts.height = parseInt($("#root").css("height"));
	views["root"].atts.width = parseInt($("#root").css("width"));
	
	solver.addStay(views["root"].atts.top);
	solver.addStay(views["root"].atts.left);
	solver.addStay(views["root"].atts.right);
	solver.addStay(views["root"].atts.bottom);
	solver.addStay(views["root"].atts.height);
	solver.addStay(views["root"].atts.width);
	
	addViewConstraints(solver, "root");
}

function randomID () {
	var id;
	do {
		id = "";
		for (var i = 0; i < 6; i++)
			id += String.fromCharCode(Math.floor(Math.random() * 26)+97);
	} while(id in views);
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

function setViewColor(viewID, hexColor) {
	$("#"+viewID).css("background-color", "#"+hexColor);
	$("#"+viewID + " .id").css("color", getContrastYIQ(hexColor));
	return viewID;
}

function addViewConstraints(solver, viewID) {
	// CenterX Constraint
	var wdt = new c.Expression(views[viewID].atts.width);
	var lft = new c.Expression(views[viewID].atts.left);
	var cnX = new c.Expression(views[viewID].atts.centerX);
	solver.addConstraint(new c.Equation(wdt.divide(2).plus(lft), cnX)); // width/2 + left = centerX
	
	// CenterY Constraint
	var hgt = new c.Expression(views[viewID].atts.height);
    var top = new c.Expression(views[viewID].atts.top);
    var cnY = new c.Expression(views[viewID].atts.centerY);
	solver.addConstraint(new c.Equation(hgt.divide(2).plus(top), cnY)); // height/2 + top = centerY
	
	// Leading and Trialing Constraints
	var rgt = new c.Expression(views[viewID].atts.right);
    var ldn = new c.Expression(views[viewID].atts.leading);
    var trl = new c.Expression(views[viewID].atts.trailing);
	solver.addConstraint(new c.Equation(ldn, lft)); // TODO: SEE LANGUAGE
	solver.addConstraint(new c.Equation(trl, rgt)); // TODO: SEE LANGUAGE
	
	// Baseline constraint
	var btm = new c.Expression(views[viewID].atts.bottom);
	var bln = new c.Expression(views[viewID].atts.baseline);
	solver.addConstraint(new c.Equation(btm, bln)); // TODO: SEE TEXTS
}

function createView(viewID, color) {
	if (typeof viewID === 'undefined') viewID = randomID();
	else if (viewID in views) return null; // Invalid: duplicated ID
	
	$("#hidden").append('<div id="'+viewID+'" class="view"><span class="id">'+viewID+'</span></div>');
	
	if (typeof color !== 'undefined') setViewColor(viewID, color);
	
	views[viewID] = buildNewView(viewID);
	
	addViewConstraints(solver, viewID);
	
	log("View created: " + viewID);
	return viewID;
}

function addParentChildContraints(solver, pid, cid) {
	var lft = new c.Expression(views[cid].atts.left);
    var top = new c.Expression(views[cid].atts.top);
    var wdt = new c.Expression(views[cid].atts.width);
    var hgt = new c.Expression(views[cid].atts.height);
    var rgh = new c.Expression(views[cid].atts.right);
    var btm = new c.Expression(views[cid].atts.bottom);
    var pwdt = new c.Expression(views[pid].atts.width);
    var phgt = new c.Expression(views[pid].atts.height);
    solver.addConstraint(new c.Equation(lft.plus(wdt).plus(rgh), pwdt)); // left+width+right = p.width
    solver.addConstraint(new c.Equation(top.plus(hgt).plus(btm), phgt)); // top+height+bottom = p.height
}

function addSubView(superViewID, subViewID) {
	if (subViewID == "root") return null; // Invalid assignation of root as a subView
	if (!(superViewID in views) || !(subViewID in views)) return null; // Invalid IDs
	if (views[subViewID].parent == superViewID) return false; // This parent-child relation already exists
	if (views[subViewID].parent !== null) return null; // Invalid: Another parent-child relation exists
	
	addParentChildContraints(solver, superViewID, subViewID);
	
	views[subViewID].parent = superViewID;
	views[superViewID].children.push(subViewID);
	$("#"+superViewID).append($("#"+subViewID).detach());
	log("View " + subViewID + " added to " + superViewID);
}


function drawAll() {
	var atts = ["top", "left", "right", "bottom", "height", "width"];
	for (id in views) if (id != "root") {
		for (var i = 0; i < atts.length; i++) {
			var att = atts[i];
			var value = views[id].atts[att].value;
			if (value !== null) $("#"+id).css(att, value + "px");
		}
	}
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
function addConstraint(id1, at1, op, id2, at2, m, b, priotity) {
	if (['==','>=','<='].indexOf(op) < 0) return false;
	if (id2 !== null && (!(id2 in views) || !(at2 in views[id2].atts))) return false;
	if (!(at1 in views[id1].atts)) return false;
	if (m == 0 || id2 === null) { m = 0; id2 = null; at2 = null; }
	
	var id1at = new c.Expression(views[id1].atts[at1]), right;
	if (id2 !== null) {
		var id2at = new c.Expression(views[id2].atts[at2]);
		right = c.plus(id2at.times(m), b); // TODO: hacer en cassowary.js un plus como times
	} else {
		right = new c.Expression(b);
	}
	//alert(new c.Equation(id1at, right));
	solver.addConstraint(new c.Equation(id1at, right));
	
	var cn = { id1: id1, at1: at1, op: op, id2: id2, at2: at2, m: m, b: b }
	log("Constraint added: " + constraintString(cn));
}


function logViews() {
	for (id in views) {
		var s = " - " + id + ": ";
		for (a in views[id].atts) {
			s += a + ":" + views[id].atts[a].value + ", ";
		}
		log(s);
	}
}

//=================================================================
// INIT
//=================================================================
var views = { "root": buildNewView("root") };

$(document).ready(function() {
	log("Script loaded<br/>", false, true);
	loadRootAttributes();
});

//=================================================================
// CODE
//=================================================================



function example1() {
	addSubView("root", createView("hola", "FF0000"));
	addConstraint("hola", "width", "==", null, null, 0, 300);
	addConstraint("hola", "height", "==", null, null, 0, 500);
	addConstraint("hola", "top", "==", null, null, 0, 20);
	addConstraint("hola", "right", "==", null, null, 0, 30);
	// Bottom y Left los calcula
}

function example2() { // Deberia verse igual que example1()
	addSubView("root", createView("hola", "FF0000"));
	addConstraint("hola", "left", "==", null, null, 0, 120);
	addConstraint("hola", "height", "==", null, null, 0, 500);
	addConstraint("hola", "bottom", "==", null, null, 0, 80);
	addConstraint("hola", "right", "==", null, null, 0, 30);
	// Width y Top los calcula
}

function example3() {
	addSubView("root", createView("hola", "FF0000"));
	addConstraint("hola", "height", "==", null, null, 0, 500);
	addConstraint("hola", "top", "==", null, null, 0, 20);
	addConstraint("hola", "right", "==", null, null, 0, 90);
	addConstraint("hola", "right", "==", "hola", "left", 3, 18); // Left assignment
}

function example4() {
	addSubView("root", createView("hola", "FF0000"));
	addSubView("hola", createView("chau", randomColor()));
	
	addConstraint("hola", "bottom", "==", null, null, 0, 30); // Asignaciones en cadena
	addConstraint("hola", "top", "==", "hola", "bottom", 1, 0);
	addConstraint("hola", "right", "==", "hola", "top", 1, 0);
	addConstraint("hola", "left", "==", "hola", "right", 1, 0);
	
	addConstraint("chau", "height", "==", null, null, 0, 10); // Pero faltan datos para chau
	addConstraint("chau", "top", "==", null, null, 0, 10);
	addConstraint("chau", "right", "==", null, null, 0, 10);
}

function example5() {
	addSubView("root", createView("hola", "0000FF"));
	addSubView("hola", createView("chau", randomColor()));
	
	addConstraint("hola", "top", "==", null, null, 0, 0); // Cuarto superior izquierdo
	addConstraint("hola", "left", "==", null, null, 0, 0);
	addConstraint("hola", "width", "==", "root", "width", 0.5, 0);
	addConstraint("hola", "height", "==", "root", "height", 0.5, 0);
	
	addConstraint("chau", "bottom", "==", null, null, 0, 0); // Cuarto inferior derecho
	addConstraint("chau", "right", "==", null, null, 0, 0);
	addConstraint("chau", "width", "==", "hola", "width", 0.5, 0);
	addConstraint("chau", "height", "==", "hola", "height", 0.5, 0);
}

function example6() {
	addSubView("root", createView("hola", "FF0000"));
	
	addConstraint("hola", "top", "==", null, null, 0, 0);
	addConstraint("hola", "height", "==", "root", "height", 0.5, 0);
	addConstraint("hola", "width", "==", "root", "width", 0.5, 0);
	addConstraint("hola", "left", "==", "hola", "right", 1, 0);
}

function example7() {
	addSubView("root", createView("hola", "FF0000"));
	
	addConstraint("hola", "top", "==", "hola", "bottom", 1, 0);
	addConstraint("hola", "height", "==", "root", "height", 0.5, 0);
	addConstraint("hola", "width", "==", "root", "width", 0.25, 0);
	addConstraint("hola", "left", "==", "root", "centerX", 1, 0); // centerX
}

function example8() {
	addSubView("root", createView("hola", "FF0000"));
	addSubView("root", createView("chau", "0000AA"));
	
	addConstraint("hola", "left", "==", "hola", "right", 1, 0);
	addConstraint("hola", "width", "==", "root", "width", 0.9, 0);
	addConstraint("hola", "height", "==", "root", "height", 0.25, 0);
	addConstraint("hola", "top", "==", "root", "centerY", 1, 0); // centerY
	
	addConstraint("chau", "left", "==", "chau", "right", 1, 0);
	addConstraint("chau", "width", "==", "root", "width", 0.9, 0);
	addConstraint("chau", "height", "==", "root", "height", 0.25, 0);
	addConstraint("chau", "bottom", "==", "root", "centerY", 1, 0); // centerY
}

function example9() { // Igual que example8 pero con mas garra (ver Constraints), y otro layer extra
	addSubView("root", createView("hola", "FF0000"));
	addSubView("root", createView("chau", "0000AA"));
	addSubView("root", createView("pepe", "00AA00"));
	
	addConstraint("hola", "left", "==", "hola", "right", 1, 0);
	addConstraint("chau", "left", "==", "chau", "right", 1, 0);
	
	addConstraint("hola", "width", "==", "root", "width", 0.9, 0);
	addConstraint("chau", "width", "==", "hola", "width", 1, 0);
	
	addConstraint("chau", "top", "==", "hola", "bottom", 1, 0);
	addConstraint("chau", "bottom", "==", "hola", "top", 1, 0);
	
	addConstraint("hola", "height", "==", "root", "height", 0.25, 0);
	addConstraint("hola", "top", "==", "root", "centerY", 1, 0);
	
	addConstraint("pepe", "centerX", "==", "root", "centerX", 1, 0); // Usando solo centerX/Y y height y width
	addConstraint("pepe", "centerY", "==", "root", "centerY", 1, 0);
	
	addConstraint("pepe", "height", "==", null, null, 0, 50);
	addConstraint("pepe", "width", "==", null, null, 0, 50);
}

function example10() { // Leading y Trailing
	addSubView("root", createView("hola", "FF0000"));
	
	addConstraint("hola", "height", "==", "root", "height", 0.5, 0);
	addConstraint("hola", "top", "==", "hola", "bottom", 1, 0);
	addConstraint("hola", "leading", "==", null, null, 0, 50);
	addConstraint("hola", "trailing", "==", null, null, 0, 200);
}

function example11() { // baseline
	addSubView("root", createView("hola", "FF0000"));
	addSubView("root", createView("chau", "0000AA"));
	
	addConstraint("hola", "height", "==", "root", "height", 0.5, 0);
	addConstraint("hola", "width", "==", "root", "width", 0.5, 0);
	addConstraint("hola", "left", "==", "hola", "right", 1, 0);
	addConstraint("hola", "top", "==", "hola", "bottom", 1, 0);
	
	addConstraint("chau", "width", "==", null, null, 0, 50);
	addConstraint("chau", "height", "==", null, null, 0, 50);
	addConstraint("chau", "centerX", "==", "hola", "centerX", 1, 0);
	addConstraint("chau", "baseline", "==", "hola", "baseline", 1, 0);
}


var solver = new c.SimplexSolver();
var scriptFinished = false;
$(document).ready(function() {
	setTimeout('if (scriptFinished) log("<br/>Script done", false); else log("<br/>Script failed", true); ', 1);
	
	example11();
	
	log("");
	log("Solution");
	logViews();
	
	document.getElementById("solver-info").innerHTML = "<pre>" + solver.getInternalInfo() + "</pre>";
	
	drawAll();
	
	// TO KNOW
	// this.solver.addEditVar(var1).addEditVar(var2).beginEdit();
    // this.solver.suggestValue(var1, val1).suggestValue(var2, val2).resolve(); // esto ya las cambia
    // this.solver.endEdit(); // esto dice que si o si no vas a editar mas
    
	scriptFinished = true;
});
