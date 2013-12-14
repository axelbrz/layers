root
	hola
		width = 100
	chau
		width = 100
		height = 100
		subChau
			left = 2 * super.left
			right = hola.right
			unaCagada # esto es una cagada
				pass
			boton1
				"""siguiente"""
			otroHijoDeSubChau
				unaAtributa = algo
		otroHijoDeChau
			unaAtributa = algo
				menuContainer
				
				pepe:slider(10,10)
					width = 123123
				
				super(6)
				
				pepe:button



function parseCode (code) {
	
	var lines = code.split("\n");
	
	var ancestors = [];
	var prevLevel = 0;
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		var currLevel = 0;
		while (line.length > 0 && line[0] == '\t') {
			line = line.substr(1);
			currLevel++;
		}
		line = line.trim();
		if (line == "") continue;
		
		var parent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : null;
		
		var sides = /([a-zA-Z]+)\s*(<=|>=|=)\s*(.*)/.exec(line);
		
		if (!sides) {
			var id = line;
			var layer = new Layer(id);
			if (parent) parent.addSubView(layer);
			acestors.push(layer);
			
		} else {
			var left = sides[1];
			var op = sides[2];
			var right = /(\d+\.?\d*)\s*\*\s*([a-zA-Z]+)\.([a-zA-Z]+)\s*\+\s*(\-?\d+\.?\d*)/.exec(sides[3]);
			var m = right[1], op = right[2], viewID = right[3], att = right[4], b = right[5];
			if (viewID == "super") viewID = parent.id;
			addConstraint(parent[left], op, views[viewID][att], m, b);
		}
		
		prevLevel = currLevel;
	}
	
	
}