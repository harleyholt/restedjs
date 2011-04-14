var methods = ['get', 'post', 'put', 'delete'];
function rested(app, path, controller) {
	//TODO: this only works for string paths, will fail if a regex was used

	// setup the passthough if it exists
	if ( controller.passthrough ) {
		app.all(path, controller.passthrough);

		if ( /^.*\?$/(path) ) {
			path = path.substring(0, path.length - 1);
		}
		app.all(path+'/*', controller.passthrough);
	}

	for ( var i = 0; i < methods.length; i++ ) {
		if ( controller[methods[i]] ) {
			app[methods[i]]( 
				path,
				(function(method) { 
					return controller[method]; 
				})(methods[i])
			);
		}
	}
}

module.exports = rested;
