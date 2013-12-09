// Pensar luego constraintsWithVisualFormat:options:metrics:views:
// hacer grupos de objetos? (clases) y hacer constraints sobre clases?


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
	return { id: _id, parent: null, children: [], atts: {
		top: null, left: null, bottom: null, right: null, width: null, height: null
		// pendientes: baseline, centerX, centerY, leading, notAnAttribute, trailing
	} };
}

function loadRootAttributes() {
	views["root"].atts.top = 0;
	views["root"].atts.left = 0;
	views["root"].atts.right = 0;
	views["root"].atts.bottom = 0;
	views["root"].atts.height = parseInt($("#root").css("height"));
	views["root"].atts.width = parseInt($("#root").css("width"));
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

function createView(viewID) {
	if (typeof viewID === 'undefined') viewID = randomID();
	else if (viewID in views) return null; // Invalid: duplicated ID
	$("#hidden").append('<div id="'+viewID+'" class="view"><span class="id">'+viewID+'</span></div>');
	
	setViewColor(viewID, randomColor());
	views[viewID] = buildNewView(viewID);
	log("View created: " + viewID);
	return viewID;
}

function addSubView(superViewID, subViewID) {
	if (subViewID == "root") return null; // Invalid assignation of root as a subView
	if (!(superViewID in views) || !(subViewID in views)) return null; // Invalid IDs
	if (views[subViewID].parent == superViewID) return false; // This parent-child relation already exists
	if (views[subViewID].parent !== null) return null; // Invalid: Another parent-child relation exists
	views[subViewID].parent = superViewID;
	views[superViewID].children.push(subViewID);
	$("#"+superViewID).append($("#"+subViewID).detach());
	log("View " + subViewID + " added to " + superViewID);
}


function drawAll() {
	for (id in views) if (id != "root") {
		for (att in views[id].atts) {
			var value = views[id].atts[att];
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
	if (op != '=') return false; // Por ahora solo soporta '='
	if (id2 !== null && (!(id2 in views) || !(at2 in views[id2].atts))) return false;
	if (!(at1 in views[id1].atts)) return false;
	if (m == 0 || id2 === null) { m = 0; id2 = null; at2 = null; }
	
	var c = { id1: id1, at1: at1, op: op, id2: id2, at2: at2, m: m, b: b }
	constraints.push(c);
	
	log("Constraint added: " + constraintString(c));
	return constraints.length - 1; // index
}

function solveEquation(id, at, m, b) {
	if (id == null || m == 0) return b;
	if (views[id].atts[at] === null) return null;
	return views[id].atts[at] * m + b;
}

// Faltaria tryToSolve en simultaneo: width = X; left = right*m+b

function tryToSolveUsingParent(id, att) {
	var parentID = views[id].parent;
	if (parentID !== null) {
		var parent = views[parentID];
		if (att == "left" && parent.atts.width !== null && views[id].atts.width !== null && views[id].atts.right !== null) {
			views[id].atts[att] = parent.atts.width - views[id].atts.width - views[id].atts.right; return true;
		}
		if (att == "right" && parent.atts.width !== null && views[id].atts.width !== null && views[id].atts.left !== null) {
			views[id].atts[att] = parent.atts.width - views[id].atts.width - views[id].atts.left; return true;
		}
		if (att == "width" && parent.atts.width !== null && views[id].atts.left !== null && views[id].atts.right !== null) {
			views[id].atts[att] = parent.atts.width - views[id].atts.left - views[id].atts.right; return true;
		}
		if (att == "top" && parent.atts.height !== null && views[id].atts.height !== null && views[id].atts.bottom !== null) {
			views[id].atts[att] = parent.atts.height - views[id].atts.height - views[id].atts.bottom; return true;
		}
		if (att == "bottom" && parent.atts.height !== null && views[id].atts.height !== null && views[id].atts.top !== null) {
			views[id].atts[att] = parent.atts.height - views[id].atts.height - views[id].atts.top; return true;
		}
		if (att == "height" && parent.atts.height !== null && views[id].atts.top !== null && views[id].atts.bottom !== null) {
			views[id].atts[att] = parent.atts.height - views[id].atts.top - views[id].atts.bottom; return true;
		}
	}
	return false;
}

function tryToSolveUsingChildren(id, att) {
	if (att == "width") {
		for (var i = 0; i < views[id].children.length; i++) {
			var child = views[views[id].children[i]];
			if (att == "width" && child.atts.left !== null && child.atts.right !== null && child.atts.width !== null) {
				views[id].atts[att] = child.atts.left + child.atts.right + child.atts.width;  return true;
			}
		}
	} else if (att == "height") {
		for (var i = 0; i < views[id].children.length; i++) {
			var child = views[views[id].children[i]];
			if (att == "height" && child.atts.top !== null && child.atts.bottom !== null && child.atts.height !== null) {
				views[id].atts[att] = child.atts.top + child.atts.bottom + child.atts.height;  return true;
			}
		}
	}
	return false;
}

function tryToSolveUsingConstraints(id, att) {
	for (var i = 0; i < constraints.length; i++) {
		var c = constraints[i];
		if (c.id1 == id && c.at1 == att) {
			var value = solveEquation(c.id2, c.at2, c.m, c.b)
			views[id].atts[att] = value;
			if (value !== null) return true;
		
		} else if (c.id2 == id && c.at2 == att && c.m != 0) { // Igual se agregan con m != 0 si c.id2 !== null, pero por las dudas...
			// x = y*m + b <==> (x-b)/m = y <==> x*(1/m) + (-b/m) = y
			var value = solveEquation(c.id1, c.at1, 1.0/c.m, -c.b/c.m);
			views[id].atts[att] = value;
			if (value !== null) return true;
		}
	}
	return false;
}

function tryToSolve(id, att) {
	// Check views[id].atts[att] === null
	if (tryToSolveUsingParent(id, att)) return true;
	if (tryToSolveUsingChildren(id, att)) return true;
	if (tryToSolveUsingConstraints(id, att)) return true;
	return false;
}

function solveConstraints() {
	var solved = false, possible = true;
	while (possible && !solved) {
		solved = true;
		var solvedAny = false;
		// Se podria preguntar solo por cuatro. Ejemplo: top, left, width, height
		// pero hay que programar más (relación entre atributos)
		for (id in views) for (att in views[id].atts) {
			if (views[id].atts[att] === null) {
				if (!tryToSolve(id, att)) solved = false;
				else solvedAny = true;
			}
		}
		if (!solvedAny) possible = false;
	}
	return possible;
}

function logConstraints() {
	for (id in views) {
		var s = " - " + id + ": ";
		for (a in views[id].atts) {
			var b = (views[id].atts[a] === null);
			s += a + ":" + (b?'<b style="color: red;">':"") + views[id].atts[a] + (b?"</b>":"") + ", ";
		}
		log(s);
	}
}

//=================================================================
// INIT
//=================================================================
var views = { "root": buildNewView("root") };
var constraints = [];

$(document).ready(function() {
	log("Script loaded<br/>", false, true);
	loadRootAttributes();
});

//=================================================================
// CODE
//=================================================================


function example1() {
	addSubView("root", setViewColor(createView("hola"), "FF0000"));
	addConstraint("hola", "width", "=", null, null, 0, 300);
	addConstraint("hola", "height", "=", null, null, 0, 500);
	addConstraint("hola", "top", "=", null, null, 0, 20);
	addConstraint("hola", "right", "=", null, null, 0, 30);
	// Bottom y Left los calcula
}

function example2() { // Deberia verse igual que example1()
	addSubView("root", setViewColor(createView("hola"), "FF0000"));
	addConstraint("hola", "left", "=", null, null, 0, 120);
	addConstraint("hola", "height", "=", null, null, 0, 500);
	addConstraint("hola", "bottom", "=", null, null, 0, 80);
	addConstraint("hola", "right", "=", null, null, 0, 30);
	// Width y Top los calcula
}

function example3() {
	addSubView("root", setViewColor(createView("hola"), "FF0000"));
	addConstraint("hola", "height", "=", null, null, 0, 500);
	addConstraint("hola", "top", "=", null, null, 0, 20);
	addConstraint("hola", "right", "=", null, null, 0, 90);
	addConstraint("hola", "right", "=", "hola", "left", 3, 18); // Left assignment
}

function example4() {
	addSubView("root", setViewColor(createView("hola"), "FF0000"));
	addSubView("hola", createView("chau"));
	
	addConstraint("hola", "bottom", "=", null, null, 0, 30); // Asignaciones en cadena
	addConstraint("hola", "top", "=", "hola", "bottom", 1, 0);
	addConstraint("hola", "right", "=", "hola", "top", 1, 0);
	addConstraint("hola", "left", "=", "hola", "right", 1, 0);
	
	addConstraint("chau", "height", "=", null, null, 0, 10); // Pero faltan datos para chau
	addConstraint("chau", "top", "=", null, null, 0, 10);
	addConstraint("chau", "right", "=", null, null, 0, 10);
}

function example5() {
	addSubView("root", setViewColor(createView("hola"), "0000FF"));
	addSubView("hola", createView("chau"));
	
	addConstraint("hola", "top", "=", null, null, 0, 0); // Cuarto superior izquierdo
	addConstraint("hola", "left", "=", null, null, 0, 0);
	addConstraint("hola", "width", "=", "root", "width", 0.5, 0);
	addConstraint("hola", "height", "=", "root", "height", 0.5, 0);
	
	addConstraint("chau", "bottom", "=", null, null, 0, 0); // Cuarto inferior derecho
	addConstraint("chau", "right", "=", null, null, 0, 0);
	addConstraint("chau", "width", "=", "hola", "width", 0.5, 0);
	addConstraint("chau", "height", "=", "hola", "height", 0.5, 0);
}

function example6() {
	addSubView("root", setViewColor(createView("hola"), "FF0000"));
	
	addConstraint("hola", "top", "=", null, null, 0, 0);
	addConstraint("hola", "height", "=", "root", "height", 0.5, 0);
	addConstraint("hola", "width", "=", "root", "width", 0.5, 0);
	addConstraint("hola", "left", "=", "hola", "right", 1, 0);
}

var scriptFinished = false;
$(document).ready(function() {
	setTimeout('if (scriptFinished) log("<br/>Script done", false); else log("<br/>Script failed", true); ', 1);
	
	example6();
	
	var solved = solveConstraints();
	
	log("");
	log(solved ? "Constraints solved (Contradictions were not checked)" : "Constraints not solved (Not enough information)", !solved);
	log("");
	if (solved) log("Solution:"); else log("Maximal solution");
	logConstraints();
	
	drawAll();
	
	scriptFinished = true;
});
