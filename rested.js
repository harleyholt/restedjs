var methods = ['get', 'post', 'put', 'delete'];

function authorize(handler, on_error, req, res, next) {
	if ( handler.authorize ) {
		if ( !handler.authorize(req) ) {
			return;
		}
	} 
	handler(req, res, next);
}

function rested(app, path, controller) {
	//TODO: this only works for string paths, will fail if a regex was used

	// setup the passthough if it exists -- all requests which partially
	// match the path will go through the passthrough so that it can
	// perform whatever work it wishes
	if ( controller.passthrough ) {
		var _path = path;
		if ( /^.*\?$/(_path) ) {
			_path = _path.substring(0, path.length - 1);
		}
		if ( /^.*\/$/(_path) ) {
			_path = _path.substring(0, path.length - 1);
		}
		app.all(_path+'/*', controller.passthrough);
	}

	for ( var i = 0; i < methods.length; i++ ) {
		if ( controller[methods[i]] ) {
			var args = []
			args.push(path);
			if ( controller.passthrough ) {
				args.push(controller.passthrough);
			}
			args.push(function(handler, on_error) {
				if ( !on_error ) {
					on_error = function() {}
				}
				return function(req, res, next) {
					authorize(handler, on_error, req, res, next);
				}
			}(controller[methods[i]]));
			app[methods[i]].apply(app, args);
		}
	}
}

module.exports = rested;
