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

function getTextContentSize(text, fontStyle, fontSize) {
	var textNode = $('<span style="display: none; font-family: '+fontStyle+'; font-size: '+fontSize+';">'+text+'</span>');
	textNode.appendTo("body");
	var size = { width: textNode.width(), height: textNode.height() };
	textNode.detach();
	return size;
}

function getTextBaseline(text, fontStyle, fontSize) {
	// Not hidden because the position has to be deduced
	var container = $('<span style="position: absolute; font-family: '+fontStyle+'; font-size: '+fontSize+';">A</span>')
	var smallA = $('<span style="vertical-align: baseline; font-size: 0px;">B</span>')
	container.append(smallA);
	container.appendTo('body');
	var relativeBaseline = smallA.position().top + 1; // [a, b] == [a, b+1)
	container.detach();
	return relativeBaseline;
}


//=================================================================
// VIEWS
//=================================================================

var Layer = function(id, color, text) {
	if (typeof id === 'string' && (id in views)) return null; // Invalid: duplicated ID // Check if it exists in all views (DOM+not already added)? Or check when it's added
	
	this.id = id;
	this.parent = null;
	this.children = [];
	this.atts = new LayerAttributes(id);
	
	this.contentSizeConstraints = { width : null, height : null };
	this.intrinsicConstraints = {};
	
	for (att in this.atts) this[att] = this.atts[att];
	
	views[id] = this;
	
	if (id == "root") {
		this.div = $("#root");
		
	} else if (typeof id !== undefined) {
		var textContent = this.text || ('<span class="id">' + id + '</span>'); // When finished, remove the span
		this.div = $('<div id="'+id+'" class="view">' + textContent + '</div>');
	} else {
		this.div = $('<div class="view"></div>');
	}
	if (color) this.setBackgroundColor(color);
	
	if (id == "root") {
		this.atts.height = parseInt(this.div.css("height")); // Don't use this.height
		this.atts.width = parseInt(this.div.css("width")); // Don't use this.width
		
		solver.addStay(this.top, c.Strength.medium);
		solver.addStay(this.left, c.Strength.medium);
		solver.addStay(this.height, c.Strength.medium);
		solver.addStay(this.width, c.Strength.medium);
	}
	
	this.setText(text); // Be sure this is called first
	this.setFontStyle("Arial");
	this.setFontSize("20px");
	
	this._addViewConstraints(solver);
	
	console.log("New view: " + this.id);
};
Layer.prototype = {
	setBackgroundColor: function(hexColor) {
		this.div.css("background-color", "#"+hexColor);
		this.div.children(".id").css("color", getContrastYIQ(hexColor));
		return this;
	},
	
	setTextColor: function(hexColor) {
		this.div.css("color", "#"+hexColor);
		return this;
	},
	
	_adjustContentSize: function() {
		// TODO: think about root
		if (this.text !== "" && !this.text) return;
		if (this.contentSizeConstraints.width) solver.removeConstraint(this.contentSizeConstraints.width);
		if (this.contentSizeConstraints.height) solver.removeConstraint(this.contentSizeConstraints.height);
		
		var size = getTextContentSize(this.text, this.fontStyle, this.fontSize);
		this.contentSizeConstraints.width = new c.Equation(new c.Expression(this.atts.width), new c.Expression(size.width), c.Strength.weak);
		this.contentSizeConstraints.height = new c.Equation(new c.Expression(this.atts.height), new c.Expression(size.height), c.Strength.weak);
		solver.addConstraint(this.contentSizeConstraints.width);
		solver.addConstraint(this.contentSizeConstraints.height);
		
		solver.removeConstraint(this.intrinsicConstraints.baseline)
		var top = new c.Expression(this.top);
		var relativeBaseline = getTextBaseline(this.text, this.fontStyle, this.fontSize);
		relativeBaseline = new c.Expression(relativeBaseline);
		this.intrinsicConstraints.baseline = new c.Equation(new c.Expression(this.baseline), top.plus(relativeBaseline), c.Strength.medium);
		solver.addConstraint(this.intrinsicConstraints.baseline); // TODO: SEE TEXTS
	},
	
	setText: function(text) {
		// TODO: think about root
		this.text = text;
		if (text !== "" && !text) return;
		this.div.html(text); // TODO: Check if it's better to do this in draw
		this._adjustContentSize();
		return this;
	},
	
	setFontStyle: function(fontStyle) {
		this.fontStyle = fontStyle || "Arial"; // TODO: Pensar fontInherit en ON para heredar hacia abajo fontStyle y fontSize
		this.div.css("font-family", this.fontStyle);  // TODO: Check if it's better to do this in draw
		this._adjustContentSize();
		return this;
	},
	
	setFontSize: function(fontSize) {
		this.fontSize = fontSize || "20px";
		this.div.css("font-size", this.fontSize);  // TODO: Check if it's better to do this in draw
		this._adjustContentSize();
		return this;
	},

	_addViewConstraints: function(solver) { // Change name to _addIntrinsicConstraints
		// CenterX Constraint
		var wdt = new c.Expression(this.width);
		var lft = new c.Expression(this.left);
		var cnX = new c.Expression(this.centerX);
		this.intrinsicConstraints.centerX = new c.Equation(wdt.divide(2).plus(lft), cnX, c.Strength.medium); // width/2 + left = centerX
		
		// CenterY Constraint
		var hgt = new c.Expression(this.height);
		var top = new c.Expression(this.top);
		var cnY = new c.Expression(this.centerY);
		this.intrinsicConstraints.centerY = new c.Equation(hgt.divide(2).plus(top), cnY, c.Strength.medium); // height/2 + top = centerY
		
		// Leading and Trialing Constraints
		var rgt = new c.Expression(this.right);
		var ldn = new c.Expression(this.leading);
		var trl = new c.Expression(this.trailing);
		this.intrinsicConstraints.leading = new c.Equation(ldn, lft, c.Strength.medium); // TODO: SEE LANGUAGE
		this.intrinsicConstraints.trailing = new c.Equation(trl, rgt, c.Strength.medium); // TODO: SEE LANGUAGE
		
		// Baseline constraint
		var btm = new c.Expression(this.bottom);
		var bln = new c.Expression(this.baseline);
		this.intrinsicConstraints.baseline = new c.Equation(btm, bln, c.Strength.medium); // TODO: SEE TEXTS
		
		// Right and Bottom
		this.intrinsicConstraints.right = new c.Equation(lft.plus(wdt), rgt, c.Strength.medium); // left + width = right
		this.intrinsicConstraints.bottom = new c.Equation(top.plus(hgt), btm, c.Strength.medium); // top + height = bottom
		
		for (key in this.intrinsicConstraints) {
			solver.addConstraint(this.intrinsicConstraints[key]);
		}
	},

	addSubView: function(subView) {
		if (subView.id == "root") return null; // Invalid assignation of root as a subView
		if (subView.parent == this.id) return false; // This parent-child relation already exists
		if (subView.parent !== null) return null; // Invalid: Another parent-child relation exists
		
		subView.parent = this;
		this.children.push(subView);
		this.div.append(subView.div.detach());
		
		console.log(this.id + " added " + subView.id);
		return this;
	},
	
	draw: function(offsetX, offsetY) {
		if (this.id == "root") return;
		var atts = ["top", "left", /*"right", "bottom",*/ "height", "width"];
		$(this.div).css("top", (this["top"].value + offsetY) + "px");
		$(this.div).css("left", (this["left"].value + offsetX) + "px");
		$(this.div).css("width", this["width"].value + "px");
		$(this.div).css("height", this["height"].value + "px");
		
	},
	
	toString2: function() {
		var s = "";
		if (typeof this.id != 'undefined') s += " - " + this.id + ": ";
		for (a in this.atts) if (a.charAt(0) != '_' && a != "toString") {
			s += a + ":" + this.atts[a].value.toFixed(2) + ", ";
		}
		return s;
	}
};

function drawAll(view, offsetX, offsetY) {
	if (typeof view === 'undefined') {
		view = root;
		offsetX = 0;
		offsetY = 0;
	}
	view.draw(offsetX, offsetY);
	for (var i = 0; i < view.children.length; i++) drawAll(view.children[i], offsetX-view.left.value, offsetY-view.top.value);
}

function showViewLog(view) {
	if (typeof view === 'undefined') view = root;
	console.log(view.toString2());
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


// Possible calls
// at1 [op] b
// at1 [op] at2
// at1 [op] at2 * m
// at1 [op] at2 * m + b
// falta priority
function addConstraint(at1, op, p1, p2, p3, priotity) {
	if (['==','>=','<='].indexOf(op) < 0) throw "Operator must be ==, <= or >=";
	var at2 = null, m = 1, b = 0;
	if (typeof p1 === 'number') b = p1; else at2 = p1;
	if (typeof p2 !== 'undefined') m = p2;
	if (typeof p3 !== 'undefined') b = p3;
	var left = new c.Expression(at1), right = new c.Expression(b);
	if (at2 !== null) right = c.plus(right, (new c.Expression(at2)).times(m));
	// TODO: hacer en cassowary.js un plus como times
	
	var constraint;
	if (op == '==') constraint = new c.Equation(left, right, c.Strength.medium);
	else if (op == '<=')  constraint = new c.Inequality(left, c.LEQ, right, c.Strength.medium);
	else constraint = new c.Inequality(left, c.GEQ, right, c.Strength.medium);
	solver.addConstraint(constraint);
	return constraint;
	
	//var cn = { id1: id1, at1: at1, op: op, id2: id2, at2: at2, m: m, b: b }
	//console.log("Constraint added: " + constraintString(cn));
}

function addMapConstraintsTo(view, cs) {
	for (cn in cs) addConstraint(view[cn], cs[cn][0], cs[cn][1], cs[cn][2], cs[cn][3]);
}

function addConstraints(cs) {
	for (var i = 0; i < cs.length; i++) addConstraint(cs[i][0], cs[i][1], cs[i][2], cs[i][3], cs[i][4]);
}


//=================================================================
// INITIAL CODE
//=================================================================

var waitToDraw = false;
var views = {};
var root = null;
var solver = new c.SimplexSolver();
$(document).ready(function() {
	root = new Layer("root");
	views["root"] = root;
	/*
	solver.addEditVar(root.width).addEditVar(root.height).beginEdit();
	root.div.get(0).addEventListener('DOMAttrModified', function(e) {
	if (this.id !== 'root') return;
		solver.suggestValue(root.width, parseInt($(this).css("width")))
			   .suggestValue(root.height, parseInt($(this).css("height")))
			   .resolve();
		// solver.endEdit(); // Never?

		drawAll();
	}, false);
	*/
	main();
	
	if (!waitToDraw)
		mainDone();
	
});

function mainDone () {
	if (!("solverLog" in window.params) || window.params.solverLog != "false") {
		console.log(solver.getInternalInfo());
		console.log("Solution:"); showViewLog();
	}
	drawAll();
	
	// TO KNOW (chain)
	// solver.addEditVar(var1).addEditVar(var2).beginEdit();
	// solver.suggestValue(var1, val1).suggestValue(var2, val2).resolve(); // esto ya las cambia
	// solver.endEdit(); // esto dice que si o si no vas a editar mas
}
