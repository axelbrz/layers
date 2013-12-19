function parseLineFuncComponents (str) {
	
	// al the possible ways we can receive a linear func
	var combinations = [
		"m * x + b",
		"x * m + b",
		"b + m * x",
		"b + x * m",
		"b + x",
		"x + b",
		"m * x",
		"x * m",
		"x",
		"b"
	];

	var componentREs = {
		"m": /(\-?(?:\d*\.\d+|\d+))/.source, // number
		"b": /(\-?(?:\d*\.\d+|\d+))/.source, // number
		"x": /(\-?[a-zA-Z]\w*(?:\.[a-zA-Z]\w*)?)/.source, // attrib OR view.attrib
		"+": /(\+|\-)/.source, // + OR -
		"*": /(\*)/.source, // *
		" ": /(\s*)/.source // any amount of space
	}
	
	// to return
	var ret = {
		"m": 1,
		"b": 0,
		"x": false
	};
	
	str = str.trim();

	
	for (var i = 0; i < combinations.length; i++) {
		var comb = combinations[i].split("");
		
		// make regexp for this combination
		var re = "";
		for (var j = 0; j < comb.length; j++)
			re += componentREs[comb[j]];
		re = new RegExp(re);
		
		var results = re.exec(str);
		
		// see if this was the correct combination
		if (!results)
			continue;
		
		var componentNames = ["m", "b", "x", "+"];
		for (var j = 0; j < componentNames.length; j++) {
			var componentName = componentNames[j];
			
			// do we have this component in our combination?
			var idx = combinations[i].indexOf(componentName);
			if (idx >= 0) {
				if (componentName == "+") {
					// if we have a minus sign, see what needs to be multiplied by -1
					if (results[idx + 1] == "-")
						ret[comb[idx + 2] == "b" ? "b" : "m"] *= -1;
				} else {
					// if it's a normal component (m, x or b) put it in our return dict
					ret[componentName] = results[idx + 1];
				}
			}
		}
		
		// parsed successfully
		
		ret.m *= 1; ret.b *= 1; // cast to number :)
		
		if (ret.x[0] == "-") {
			ret.m *= -1;
			ret.x = ret.x.slice(1);
		}
		
		return ret;
	}
	
	return false;
}

function parseCode (code) {
	
	var reIndentation = /^\t*/; // matches tabs in the beginning of a line
	var reProperty = /^([a-zA-Z]+)\s*:\s*([^\s].*)$/; // matches a property and it's value in an expression like "bgColor: aabbcc"
	var reConstraint = /^([a-zA-Z][a-zA-Z0-9]*)\s*(<=|>=|=)\s*([^\s].*)$/; // matches left side, comparison operator and right side of a constraint
	var reViewName = /^([a-zA-Z_][a-zA-Z0-9_\-]*)$/; // to check if string is a proper name (no start with numbers, no weird chars)
	
	var lines = code.split("\n");
	var viewStack = [root];
	
	for (var i = 0; i < lines.length; i++) {
		
		try {
		
			var line = lines[i];
			var lineLevel = line.match(reIndentation)[0].length;
			var commentStart = line.indexOf("#");
			if (commentStart >= 0)
				line = line.substr(0, commentStart);
			line = line.trim();

			if (line.length == 0)
				continue;
			
			if (lineLevel == 0 && line == "root")
				continue;
		
			if (viewStack.length < lineLevel)
				throw "looks like there are too many tabs";
			
			if (lineLevel == 0)
				throw "are you trying to add a view/constraint/property to the super of root???";
		
			viewStack.length = lineLevel;
		
			var currentView = viewStack[viewStack.length - 1];
		
			var results;
		
			if (results = line.match(reConstraint)) {
				// we have a constraint in our hands
			
				var attribute = results[1];
				var operator = results[2];
				
				if (operator == "=")
					operator = "=="; // TODO: change elsewhere in code to always use "="
			
				if (!(attribute in currentView))
					throw "unknown attribute: '"+attribute+"'";
			
				var rightSide = parseLineFuncComponents(results[3]);
			
				if (!rightSide)
					throw "can't parse right side of constraint";
				
				if (rightSide.x) {
					rightSide.x = rightSide.x.split(".");
					if (rightSide.x.length == 1) {
				
						rightSide.view = currentView;
						rightSide.attribute = rightSide.x[0];
				
						if (!(rightSide.attribute in currentView))
							throw "unknown attribute: '"+rightSide.attribute+"'";
					
					} else if (rightSide.x.length == 2) {
				
						var otherViewName = rightSide.x[0]
						rightSide.attribute = rightSide.x[1];

						if (otherViewName == "super") {
						
							if (currentView.parent)
								rightSide.view = currentView.parent;
							else
								throw "using super on a view without parent";
							
						} else {
						
							if (!(otherViewName in window.views))
								throw "unknown view: '"+otherViewName+"'";
						
							rightSide.view = window.views[otherViewName];
						}
					
						if (!(rightSide.attribute in rightSide.view))
							throw "unknown attribute: '"+rightSide.attribute+"'";
				
					} else {
						throw "can't parse right side of constraint";
					}
					
					addConstraint(currentView[attribute], operator, rightSide.view[rightSide.attribute], rightSide.m, rightSide.b);
					
				} else {
					
					// the constraint is of type A = B
					
					addConstraint(currentView[attribute], operator, rightSide.b);
					
				}
					
				
			
			} else if (results = line.match(reProperty)) {
				// we have a property (like bgColor)
			
				if (results[1] == "bgColor") {
					currentView.setColor(results[2]);
				} else {
					throw "we only know bgColor right now, duuuude!";
				}
		
			} else if (reViewName.test(line)) {
				// we have a new view to add
				
				if (line != "root") {
					var subView = new Layer(line);
					currentView.addSubView(subView);
					viewStack.push(subView);
				}
			
			
			} else {
				throw "I don't understand what this is supposed to be";
			}
		
		
		} catch (ex) {
			throw "[PARSER] "+ex+" (line "+(i + 1)+")";
		}
	}
}


function main () {
	exampleNo = ("example" in window.params) ? window.params.example : 13;
	$.get("example lpps/example"+exampleNo+".lpp", function (data) {
		parseCode(data);
		mainDone();
	}, "text").fail(function () {
		alert("Can't find example"+exampleNo+".lpp!");
	});
}
