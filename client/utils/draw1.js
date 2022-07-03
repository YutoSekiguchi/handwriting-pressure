import Paper from "paper";

const draw1 = () => {
  // let myPath = new Paper.Path();

  // Paper.view.onMouseDown = (event) => {
  //   myPath.strokeColor = "black";
  //   myPath.strokeWidth = 3;
  // };

  // Paper.view.onMouseDrag = (event) => {
  //   myPath.add(event.point);
  // };

  // Paper.view.draw();
  var path = new Paper.Path();

Paper.view.onMouseDown = (event) => {
	// If we produced a path before, deselect it:
	if (path) {
		path.selected = false;
	}

	// Create a new path and set its stroke color to black:
	path.segments = [event.point]
	path.strokeColor = 'black'
	path.strokeCap = 'round'
	path.strokeWidth = 2
		// Select the path, so we can see its segment points:
	path.fullySelected = true
}

// While the user drags the mouse, points are added to the path
// at the position of the mouse:
Paper.view.onMouseDrag = (event) => {
	path.add(event.point);

	// Update the content of the text item to show how many
	// segments it has:
	if (path) {
		path.selected = false;
	}
	
	
}

// When the mouse is released, we simplify the path:
Paper.view.onMouseUp = (event) => {
	var segmentCount = path.segments.length;

	// When the mouse is released, simplify it:
	path.simplify(20);

	// Select the path, so we can see its segments:
	path.fullySelected = true;

	var newSegmentCount = path.segments.length;
	var difference = segmentCount - newSegmentCount;
	var percentage = 100 - Math.round(newSegmentCount / segmentCount * 100);
	
	if (path) {
		path.selected = false;
	}
}
};

export default draw1;