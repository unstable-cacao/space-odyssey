(function ()
{
	var module = {};
	
	(function (module)
	{
		'use strict';


/**
 * @class Namespace
 * @param {*=} root
 */
function Namespace(root)
{
	this._root = root || {};
}


/**
 * @return {*}
 * @private
 */
Namespace.prototype._getContainer = function ()
{
	if (typeof window !== 'undefined')
	{
		return window;
	}
	
	return {};
};

/**
 * @param {{}} namespace
 * @param {Array<string>} path
 * @return {{}}
 * @private
 */
Namespace.prototype._create = function (namespace, path)
{
	for (var i = 0; i < path.length; i++)
	{
		var name = path[i];
		namespace[name] = {};
		namespace = namespace[name];
	}
	
	return namespace;
};

/**
 * @param {string} namespace
 * @param {function(Object, Array<string>)} onUndefined
 * @return {{}}
 */
Namespace.prototype._walk = function (namespace, onUndefined)
{
	var name;
	var path	= namespace.split('.');
	var current = this._root;
	
	for (var i = 0; i < path.length; i++)
	{
		name = path[i];

		if (typeof current[name] === 'undefined')
		{
			return onUndefined(current, path.splice(i));
		}

		current = current[name];
	}
	
	return current;
};


/**
 * @return {{}}
 */
Namespace.prototype.root = function ()
{
	return this._root;
};

/**
 * @param {string} namespace
 * @return {{}}
 */
Namespace.prototype.get = function (namespace)
{
	if (typeof namespace === 'undefined' || namespace === '')
	{
		return this._root;
	}
	
	return this._walk(namespace, this._create.bind(this));
};

/**
 * @param {string} namespace
 * @param {function()=} scope
 */
Namespace.prototype.namespace = function (namespace, scope)
{
	var namespaceObject = this.get(namespace);
	
	if (scope)
	{ 
		scope.call(namespaceObject, this._root);
	}
	
	return namespaceObject;
};

/**
 * @param {string} namespace
 * @return {boolean}
 */
Namespace.prototype.isSet = function (namespace)
{
	if (typeof namespace === 'undefined' || namespace === '')
	{
		return true;
	}
	
	return (this._walk(namespace, function() { return false; }) !== false);
};

/**
 * @return {function(string, function()=)} Returns the namespace method binded to this object. 
 */
Namespace.prototype.getCreator = function()
{
	return this.namespace.bind(this);
};


module.exports = Namespace;
	})(module);
	
	var ns = new module.exports(window);
	window.namespace = (ns.getCreator());
})();
namespace('Classy', function() 
{
	/**
	 * @class Classy.Enum
	 * @alias Enum
	 * 
	 * @property {function(): Array<string>} getAllKeys
	 * @property {function(): Array<string>} getAllValues
	 * @property {function(string): boolean} hasKey
	 * @property {function(string): boolean} hasValue
	 * @property {function(): number} count
	 * @property {function(function(string, string))} forEach
	 */
	
	
	/**
	 * @template T
	 * 
	 * @param {T} target
	 * @return {T}
	 */
	this.Enum = function (target)
	{
		var keys		= [];
		var values		= [];
		var map			= {};
		var mapValues	= {};
		var count		= 0;
		
		
		for (var key in target)
		{
			if (target.hasOwnProperty(key) && !(target[key] instanceof Object))
			{
				keys.push(key);
				map[key] = true;
				
				values.push(target[key]);
				mapValues[target[key]] = true;
				
				count++;
			}
		}
		
		
		//noinspection JSUndefinedPropertyAssignment
		target.getAllKeys = function () { return keys.concat(); };
		
		//noinspection JSUndefinedPropertyAssignment
		target.getAllValues = function () { return values.concat(); };
		
		//noinspection JSUndefinedPropertyAssignment
		target.hasKey = function(key) { return typeof map[key] !== 'undefined'; };
		
		//noinspection JSUndefinedPropertyAssignment
		target.hasValue = function(val) { return typeof mapValues[val] !== 'undefined'; };
		
		//noinspection JSUndefinedPropertyAssignment
		target.count = function() { return count; };
		
		//noinspection JSUndefinedPropertyAssignment
		target.forEach = function(callback)
		{
			for (var i = 0; i < count; i++)
			{
				if (callback(keys[i], values[i]) === false)
				{
					break;
				}
			}
		};
		
		
		return target;
	};
});
namespace('Classy', function()
{
	/**
	 * @class Classy.Singleton
	 * @alias Singleton
	 * 
	 * @template T
	 * 
	 * @param {T} target
	 * @return {{instance: function(): T}}
	 */
	this.Singleton = function Singleton(target)
	{
		var container = function()
		{
			throw 'Can not create instance of singleton';
		};
		
		container.prototype = target.prototype;
		
		container.__instance__ = null;
		container.instance = function()
		{
			if (container.__instance__ === null)
			{
				//noinspection JSValidateTypes
				container.__instance__ = new target();
			}
			
			return container.__instance__;
		};
		
		return container;
	};
});
namespace('Oyster.Actions', function (root)
{
	/**
	 * @class {Oyster.Actions.ActionChainLink}
	 * @alias {ActionChainLink}
	 * 
	 * @property {ActionChainLink}	_child
	 * @property {ActionChainLink}	_parent
	 * @property {Application}		_app
	 * @property {Oyster.Action}	_action
	 * @property {boolean}			_isMounted
	 * 
	 * @param {Action} action
	 * @constructor
	 */
	function ActionChainLink(action)
	{
		this._child		= null;
		this._parent	= null;
		this._app		= null;
		this._action	= action;
		this._isMounted	= false;
		
		action.setChainLink(this);
	}
	
	
	/**
	 * @returns {Action}
	 */
	ActionChainLink.prototype.action = function ()
	{
		return this._action;
	};
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	ActionChainLink.prototype.child = function ()
	{
		return this._child;
	};
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	ActionChainLink.prototype.parent = function ()
	{
		return this._parent;
	};
	
	/**
	 * @returns {Oyster.Action|null}
	 */
	ActionChainLink.prototype.childAction = function ()
	{
		return (this._child === null ? null : this._child.action());
	};
	
	/**
	 * @returns {Action|null}
	 */
	ActionChainLink.prototype.parentAction = function ()
	{
		return (this._parent === null ? null : this._parent.action());
	};
	
	/**
	 * @returns {boolean}
	 */
	ActionChainLink.prototype.hasChild = function ()
	{
		return (this._child !== null);
	};
	
	/**
	 * @returns {boolean}
	 */
	ActionChainLink.prototype.hasParent = function ()
	{
		return (this._parent !== null);
	};
	
	/**
	 * @returns {boolean}
	 */
	ActionChainLink.prototype.isMounted = function ()
	{
		return this._isMounted;
	};
	
	/**
	 * @returns {Application}
	 */
	ActionChainLink.prototype.app = function ()
	{
		return this._app;
	};
	
	
	/**
	 * @param {ActionChainLink} link
	 */
	ActionChainLink.unmount = function (link)
	{
		link._child = null;
		link._parent = null;
		link._isMounted = false;
	};
	
	/**
	 * @param {ActionChainLink} link
	 * @param {ActionChainLink} child
	 * @param {ActionChainLink} parent
	 */
	ActionChainLink.updateRelations = function (link, child, parent)
	{
		link._child = child;
		link._parent = parent;
		link._isMounted = true;
	};
	
	/**
	 * @param {ActionChainLink} link
	 * @param {Application} app
	 */
	ActionChainLink.setApp = function (link, app)
	{
		link._app = app;
	};
	
	
	this.ActionChainLink = ActionChainLink;
});
namespace('Oyster.Routing', function (root)
{
	/**
	 * @name {Oyster.Routing.ActionRoute}
	 * @alias ActionRoute
	 * 
	 * @property {SeaRoute.Route.Route} _route
	 * @property {[[string]]}			_params
	 * @property {[callback]}			_actions
	 * 
	 * @constructor
	 */
	function ActionRoute()
	{
		this._actions	= null;
		this._params	= null;
		this._route		= null;
	}
	
	
	/**
	 * @param {[]} actions
	 * @param {[]} params
	 */
	ActionRoute.prototype.setActions = function (actions, params)
	{
		this._actions	= actions.concat();
		this._params	= params.concat();
	};
	
	/**
	 * @param {SeaRoute.Route.Route} route
	 */
	ActionRoute.prototype.setRoute = function (route)
	{
		this._route = route;
	};
	
	/**
	 * @return {SeaRoute.Route.Route}
	 */
	ActionRoute.prototype.route = function ()
	{
		return this._route;
	};
	
	/**
	 * @return {[callback]}
	 */
	ActionRoute.prototype.actions = function ()
	{
		return this._actions.concat();
	};
	
	/**
	 * @return {[string]}
	 */
	ActionRoute.prototype.params = function ()
	{
		return this._params.concat();
	};
	
	
	this.ActionRoute = ActionRoute;
});
namespace('Plankton', function() 
{
	var ARRAY_INDEX_REGEX = /^0$|^[1-9]\d*$/;
	var ARRAY_INDEX_MAX_VALUE = 4294967294;
	
	
	/**
	 * @class Plankton.is
	 * @alias is
	 * 
	 * @param subject
	 * @return {boolean}
	 */
	var is = function (subject)
	{
		return is.true(subject);
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.array = function (subject)
	{
		return Object.prototype.toString.call(subject) === '[object Array]';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.array.empty = function (subject)
	{
		return is.array(subject) && subject.length === 0;
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.array.notEmpty = function (subject)
	{
		return is.array(subject) && subject.length > 0;
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.object = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object Object]';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.object.empty = function (subject)
	{
		return is.object(subject) && Object.keys(subject).length === 0;
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.object.notEmpty = function (subject)
	{
		return is.object(subject) && Object.keys(subject).length > 0;
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.objectLiteral = function(subject)
	{
		if (!is.object(subject))
		{
			return false;
		}
		
		return is.undefined(subject.constructor) || subject.constructor === Object;
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.string = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object String]';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.string.empty = function(subject)
	{
		return is.string(subject) && subject.length === 0;
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.string.notEmpty = function(subject)
	{
		return is.string(subject) && subject.length > 0;
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.numeric = function(subject)
	{
		return is.number(subject) && !is.infinite(subject) && !isNaN(subject);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.numeric.int = function(subject)
	{
		return is.numeric(subject) && (subject % 1 === 0);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.numeric.float = function(subject)
	{
		return is.numeric(subject) && (subject % 1 !== 0);
	};
	
	/**
	 * @param {*} subject
	 * @return {boolean}
	 */
	is.numeric.odd = function(subject)
	{
		return is.numeric.int(subject) && (subject % 2 !== 0);
	};
	
	/**
	 * @param {*} subject
	 * @return {boolean}
	 */
	is.numeric.even = function(subject)
	{
		return is.numeric.int(subject) && (subject % 2 === 0);
	};
	
	
	/**
	 * @param {*} subject
	 * @return {boolean}
	 */
	is.collection = function(subject)
	{
		return (is.objectLiteral(subject) || is.array(subject) || is.string(subject));
	};
	
	/**
	 * @param {*} subject
	 * @return {boolean}
	 */
	is.collection.empty = function(subject)
	{
		if (is.array(subject))
		{
			return is.array.empty(subject);
		}
		else if (is.objectLiteral(subject))
		{
			return is.object.empty(subject);
		}
		else if (is.string(subject))
		{
			return is.string.empty(subject)
		}
		
		return false;
	};
	
	/**
	 * @param {*} subject
	 * @return {boolean}
	 */
	is.collection.notEmpty = function(subject)
	{
		if (is.array(subject))
		{
			return !is.array.empty(subject);
		}
		else if (is.object(subject))
		{
			return !is.object.empty(subject);
		}
		else if (is.string(subject))
		{
			return !is.string.empty(subject)
		}
		
		return false;
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.number = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object Number]';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.bool = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object Boolean]';
	};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.defined = function(subject)
	{
		return typeof subject !== 'undefined';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.undefined = function(subject)
	{
		return typeof subject === 'undefined';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.function = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object Function]';
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.NaN = function(subject)
	{
		return Object.prototype.toString.call(subject) === '[object Number]' && isNaN(subject);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.infinite = function(subject)
	{
		return Number.POSITIVE_INFINITY === subject || Number.NEGATIVE_INFINITY === subject;
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.null = function(subject)
	{
		return subject === null;
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.jsObject = function(subject)
	{
		return subject instanceof Object || (!is.null(subject) && typeof subject === 'object');
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.jsPrimitive = function(subject)
	{
		return !is.jsObject(subject);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.empty = function(subject)
	{
		if (is.collection(subject))
		{
			return is.collection.empty(subject);
		}
		
		throw new Error('Subject is not Array, Object or String');
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.json = function(subject)
	{
		if (!is.string(subject))
		{
			return false;
		}
		
		try
		{
			JSON.parse(subject);
			return true;
		}
		catch (e)
		{
			return false;
		}
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.false = function(subject)
	{
		return subject === false || 
			subject === 0 || 
			subject === null || 
			is.undefined(subject) || 
			is.collection.empty(subject) || 
			is.NaN(subject);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.true = function(subject)
	{
		return !is.false(subject);
	};
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	is.index = function(subject)
	{
		return ARRAY_INDEX_REGEX.test(subject) && subject <= ARRAY_INDEX_MAX_VALUE;
	};
	
	
	this.is = is;
});
namespace('Classy', function(root)
{
	var is = root.Plankton.is;
	
	
	function getProto(target)
	{
		if (typeof Object.getPrototypeOf === 'function')
			return Object.getPrototypeOf(target);
		
		if (typeof target.constructor !== 'undefined' && target.constructor.prototype !== 'undefined')
			return target.constructor.prototype;
		
		if (typeof target.__proto__ !== 'undefined')
			return target.__proto__;
		
		return {};
	}
	
	
	/**
	 * @name Classy.classify
	 * 
	 * @param {*} object
	 * @param {function()=} init
	 */
	this.classify = function classify(object, init)
	{
		var proto = getProto(object);
		
		for (var key in proto)
		{
			if (typeof proto[key] === 'function')
			{
				object[key] = proto[key].bind(object);
			}
		}
		
		if (typeof init !== 'undefined')
		{
			init.call(object);
		}
		
		return object;
	};
});
namespace('Oyster.Modules', function (root)
{
	var Enum = root.Classy.Enum;
	

	/**
	 * @name {Oyster.Modules.OysterModules}
	 * @alias OysterModules
	 */
	var OysterModules = {
		NavigationModule: 	'Oyster.NavigationModule',
		RoutingModule:		'Oyster.RoutingModule'
	};
	
	
	this.OysterModules = Enum(OysterModules);
});
namespace('Plankton', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	
	/**
	 * @class Plankton.array
	 * @alias array
	 * 
	 * @param {*} subject
	 * @return {Array}
	 */
	var array = function(subject) {
		if (is.undefined(subject)) {
			return [];
		}
		
		return (is.array(subject) ? subject : [subject]);
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(*)} callback
	 * @param {*=} scope
	 */
	array.forEach = function(subject, callback, scope) {
		array.forEach.key(subject, function(key) {
			return callback.call(scope, subject[key]);
		});
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(*)} callback
	 * @param {*=} scope
	 */
	array.forEach.value = array.forEach;
	
	/**
	 * @param {Array} subject
	 * @param {function(Number)} callback
	 * @param {*=} scope
	 */
	array.forEach.key = function(subject, callback, scope) {
		for (var key in subject) {
			if (!is.index(key)) {
				continue;
			}
			
			if (callback.call(scope, parseInt(key)) === false) {
				break;
			}
		}
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(Number *)} callback
	 * @param {*=} scope
	 */
	array.forEach.pair = function(subject, callback, scope) {
		array.forEach.key(subject, function(key) {
			return callback.call(scope, key, subject[key]);
		});
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(Array)} callback
	 * @param {*=} scope
	 */
	array.forEach.item = function(subject, callback, scope) {
		array.forEach.pair(subject, function(key, value) {
			var obj = {};
			obj[key] = value;
			return callback.call(scope, obj);
		});
	};
	
	
	/**
	 * @param {Array} subject
	 * @return {*}
	 */
	array.last = function (subject) {
		if (subject.length === 0) {
			return undefined;
		}
		
		return subject[subject.length - 1];
	};
	
	/**
	 * @param {Array} subject
	 * @return {Number|undefined}
	 */
	array.last.key = function (subject) {
		if (subject.length === 0) {
			return undefined;
		}
		
		return subject.length - 1;
	};
	
	/**
	 * @param {Array} subject
	 * @return {*}
	 */
	array.last.value = array.last;
	
	
	/**
	 * @param {Array} subject
	 * @return {*}
	 */
	array.first = function (subject) {
		var first = undefined;
		
		array.forEach.value(subject, function(value) {
			first = value;
			return false;
		});
		
		return first;
	};
	
	/**
	 * @param {Array} subject
	 * @return {Number|undefined}
	 */
	array.first.key = function (subject) {
		var first = undefined;
		
		array.forEach.key(subject, function(value) {
			first = value;
			return false;
		});
		
		return first;
	};
	
	/**
	 * @param {Array} subject
	 * @return {*}
	 */
	array.first.value = array.first;
	
	
	/**
	 * @param {Array} subject
	 * @returns {Number}
	 */
	array.count = function (subject) {
		var count = 0;
		array.forEach(subject, function() { count++; });
		return count;
	};
	
	/**
	 * @param {Array} subject
	 * @returns {bool}
	 */
	array.isNormalized = function (subject) {
		return subject.length === 0 || array.last.key(subject) === (array.count(subject) - 1);
	};
	
	/**
	 * @param {Array} subject
	 * @returns {Array}
	 */
	array.normalize = function (subject) {
		var arr = [];
		
		array.forEach(subject, function(value) {
			arr.push(value);
		});
		
		return arr;
	};
	
	/**
	 * @param {Array} subject
	 * @return {*}
	 */
	array.unique = function (subject)
	{
		return subject.filter(function(value, index, array)
		{
			return array.indexOf(value) === index;
		});
	};
	
	
	this.array = array;
});
namespace('Plankton', function (root)
{
	'use strict';
	
	
	var is = root.Plankton.is;
	
	
	/**
	 * @class Plankton.func
	 * @alias func
	 * 
	 * @param {*} subject
	 * @return {function}
	 */
	var func = function (subject)
	{
		return (is.function(subject) ? 
			subject :
			function () { return subject });
	};
	
	/**
	 * @param {Function} callback
	 * @returns {Function}
	 */
	func.async = function (callback)
	{
		return function ()
		{
			return Promise
				.resolve(arguments)
				.then(
					function (args)
					{
						return func(callback).apply(null, args);
					});
		};
	};
	
	/**
	 * @param {Function} callback
	 * @return {Promise}
	 */
	func.async.do = function (callback)
	{
		return (func.async(callback))();
	};
	
	/**
	 * @param {Function} callback
	 * @param {function(*)|undefined} errorHandler
	 * @return {Function}
	 */
	func.safe = function (callback, errorHandler)
	{
		return function ()
		{
			try 
			{
				callback.apply(null, arguments);
			}
			catch (error) 
			{
				if (is.function(errorHandler))
				{
					errorHandler(error);
				}
			}
		};
	};
	
	/**
	 * @param {Function} callback
	 * @return {Function}
	 */
	func.silent = function (callback)
	{
		return func.safe(callback);
	};
	
	/**
	 * @param {Function} callback
	 * @return {Function}
	 */
	func.cached = function (callback)
	{
		var isCalled = false;
		var result;
		
		return function ()
		{
			if (isCalled)
			{
				return result;
			}
			
			isCalled = true;
			result = callback.apply(null, arguments);
			
			return result;
		};
	};
	
	/**
	 * @param {Function} callback
	 * @param {Number} ms
	 * @return {Function}
	 */
	func.postponed = function (callback, ms)
	{
		return function () 
		{
			var args = arguments;
			
			return new Promise(
				function (resolve)
				{
					setTimeout(
						function ()
						{
							resolve(callback.apply(null, args));
						},
						ms);
				}
			);
		};
	};
	
	/**
	 * @param {*} value
	 * @param {function} callback
	 */
	func.returns = function (value, callback)
	{
		return function ()
		{
			callback.apply(null, arguments);
			return value;
		}
	};
	
	/**
	 * @param {function} callback
	 */
	func.returns.true = function (callback)
	{
		return func.returns(true, callback);
	};
	
	/**
	 * @param {function} callback
	 */
	func.returns.false = function (callback)
	{
		return func.returns(false, callback);
	};
	
	
	this.func = func;
});
namespace('Plankton', function (root)
{
	var is = root.Plankton.is;
	
	
	/**
	 * @class Plankton.obj
	 * @alias obj
	 */
	var obj = {};
	
	
	/**
	 * @param {Object} subject
	 * @return {Object}
	 */
	obj.copy = function (subject)
	{
		var res = {};
		obj.forEach.pair(subject, function (key, val) { res[key] = val; });
		return res;
	};
	
	/**
	 * @param {Object} subject
	 * @return {Object}
	 */
	obj.mix = function (subject)
	{
		for (var i = 1; i < arguments.length; i++)
		{
			obj.forEach.pair(arguments[i], function (key, val) { subject[key] = val; });
		}
		
		return subject;
	};
	
	/**
	 * @return {Object}
	 */
	obj.merge = function ()
	{
		var res = {};
		
		for (var i = 0; i < arguments.length; i++)
		{
			obj.forEach.pair(arguments[i], function (key, val) { res[key] = val; });
		}
		
		return res;
	};
	
	/**
	 * @param {string|number} key
	 * @param {*} value
	 * @returns {Object}
	 */
	obj.combine = function (key, value)
	{
		var res = {};
		res[key] = value;
		return res;
	};
	
	/**
	 * @param subject
	 * @returns {*|undefined}
	 */
	obj.any = function (subject)
	{
		var key = obj.any.key(subject);
		return (is.defined(key) ? subject[key] : undefined);
	};
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.value = obj.any;
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.key = function (subject)
	{
		var keys = obj.keys(subject);
		return keys.length > 0 ? keys[0] : undefined;
	};
	
	/**
	 * @param {Object} subject
	 * @return {*|undefined}
	 */
	obj.any.item = function (subject)
	{
		var key = obj.any.key(subject);
		var res = undefined;
		
		if (is.defined(key))
		{
			res = obj.combine(key, subject[key]);
		}
		
		return res;
	};
	
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach = function (subject, callback, scope)
	{
		obj.forEach.key(subject, function (key) 
		{
			return callback.call(scope, subject[key]);
		});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 */
	obj.forEach.value = obj.forEach;
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.key = function (subject, callback, scope)
	{
		for (var key in subject)
		{
			if (!subject.hasOwnProperty(key))
			{
				continue;
			}
			
			if (callback.call(scope, key) === false)
			{
				break;
			}
		}
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.pair = function (subject, callback, scope)
	{
		obj.forEach.key(subject, function (key)
		{
			return callback.call(scope, key, subject[key]);
		});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*)} callback
	 * @param {*=} scope
	 */
	obj.forEach.item = function (subject, callback, scope)
	{
		obj.forEach.pair(subject, function (key, value)
		{
			return callback.call(scope, obj.combine(key, value));
		});
	};
	
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter = function (subject, callback, scope)
	{
		return obj.filter.pair(subject, function (key, value)
		{
			return callback.call(scope, value);
		})
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.value = obj.filter;
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.key = function (subject, callback, scope) {
		return obj.filter.pair(
			subject, 
			function (key)
			{
				return callback.call(scope, key);
			});
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): bool|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.pair = function (subject, callback, scope)
	{
		var filtered = {};
		
		obj.forEach.pair(
			subject, 
			function (key, value)
			{
				var res = callback.call(scope, key, value);
				
				if (is.null(res))
				{
					return false;
				}
				else if (res === true)
				{
					filtered[key] = value;
				}
			});
		
		return filtered;
	};
	
	/**
	 * @param {Object} subject
	 * @param {function (*): boolean|null|number} callback
	 * @param {*=} scope
	 * @returns {Object}
	 */
	obj.filter.item = function (subject, callback, scope)
	{
		return obj.filter.pair(
			subject, 
			function (key, value)
			{
				return callback.call(scope, obj.combine(key, value));
			});
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.values = function (subject)
	{
		return obj
			.keys(subject)
			.reduce(
				function (result, key)
				{
					result.push(subject[key]);
					return result;
				}, 
				[]);
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.keys = function (subject)
	{
		return Object.keys(subject);
	};
	
	/**
	 * @param {Object} subject
	 * @returns {Array}
	 */
	obj.count = function (subject)
	{
		return obj.keys(subject).length;
	};
	
	
	this.obj = obj;
});
namespace('SeaRoute.Route', function(root)
{
	var is = root.Plankton.is;
	
	
	/**
	 * @class SeaRoute.Route.Part
	 * 
	 * @param {string}	text
	 * 
	 * @property {string} _text
	 * @property {SeaRoute.ParamType.Param} _param
	 */
	var Part = function(text)
	{
		this._text		= text;
		this._param		= null;
	};
	
	
	/**
	 * @return {string}
	 */
	Part.prototype.text = function ()
	{
		return this._text;
	};

	/**
	 * @return {boolean}
	 */
	Part.prototype.isConst = function ()
	{
		return is.null(this._param);
	};

	/**
	 * @param {SeaRoute.ParamType.Param} param
	 */
	Part.prototype.setParam = function (param)
	{
		this._param = param;
		return this;
	};

	/**
	 * @return {SeaRoute.ParamType.Param}
	 */
	Part.prototype.getParam = function ()
	{
		return this._param;
	};

	/**
	 * @return {string}
	 */
	Part.prototype.getParamName = function ()
	{
		return this._param.name();
	};

	/**
	 * @return {boolean}
	 */
	Part.prototype.isOptional = function ()
	{
		if (this.isConst())
			return false;
		
		return this._param.isOptional();
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	Part.prototype.validate = function (data)
	{
		if (this.isConst())
		{
			return (data === this._text);
		}
		else
		{
			return this._param.validate(data);
		}
	};
	
	/**
	 * @param {*} param
	 * @return {string}
	 */
	Part.prototype.encode = function (param)
	{
		if (this.isConst())
		{
			return this._text;
		}
		else
		{
			return this._param.encode(param);
		}
	};
	
	/**
	 * @param {string} data
	 * @param {*} params
	 */
	Part.prototype.extract = function (data, params)
	{
		if (!this.isConst())
		{
			params[this._param.name()] = this._param.extract(data);
		}
	};
	
	
	this.Part = Part;
});
namespace('Classy', function(root)
{
	var obj = root.Plankton.obj;
	
	
	/**
	 * @param {*} target
	 * @param {*} parent
	 * @param {boolean=true} withStatic
	 */
	function inherit(target, parent, withStatic)
	{
		target.prototype = Object.create(parent.prototype);
		target.prototype.constructor = target;
		
		if (withStatic !== false)
			obj.mix(target, parent);
	}
	
	
	this.inherit = inherit;
});
namespace('Duct', function (root)
{
	var classify = root.Classy.classify;
	
	
	/**
	 * @template T
	 * 
	 * @constructor
	 * @class Duct.Listener
	 * 
	 * @param {Event<T>} event
	 * 
	 * @property {Event<T>} _event
	 */
	function Listener(event)
	{
		this._event = event;
		
		classify(this);
	}
	
	
	/**
	 * @template T
	 * @param {T|*} target
	 * @param {T=} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.add = function (target, callback)
	{
		this._event.add(target, callback);
		return this;
	};
	
	/**
	 * @template T
	 * @param {T|*} target
	 * @param {T=} callback
	 * @return {Listener<T>}
	 */
	Listener.prototype.remove = function (target, callback)
	{
		this._event.remove(target, callback);
		return this;
	};
	
	
	this.Listener = Listener;
});
namespace('Oyster.Modules.Utils', function (root)
{
	var classify = root.Classy.classify;

	
	/**
	 * @name {Oyster.Modules.Utils.ModuleController}
	 * @alias {ModuleController}
	 * 
	 * @property {ModuleManager}	_manager
	 * @property {string}			_name
	 * @property {boolean}			_isLoaded
	 * 
	 * @param {Application} app
	 * @param {string} name
	 * 
	 * @constructor
	 */
	function ModuleController(app, name)
	{
		classify(this);
		
		this._name		= name;
		this._app		= app;
		this._manager	= app.modules();
		this._isLoaded	= false;
	}


	/**
	 * @param {boolean} isLoaded
	 */
	ModuleController.prototype.setIsLoaded = function (isLoaded)
	{
		this._isLoaded = isLoaded;
	};

	/**
	 * @returns {string}
	 */
	ModuleController.prototype.name = function ()
	{
		return this._name;
	};
	
	/**
	 * @return {ModuleManager}
	 */
	ModuleController.prototype.manager = function ()
	{
		return this._manager;
	};
	
	/**
	 * @return {Application}
	 */
	ModuleController.prototype.app = function ()
	{
		return this._app;
	};
	
	ModuleController.prototype.unload = function ()
	{
		if (this._isLoaded)
		{
			this._manager.remove(this._name);
		}
	};
	
	/**
	 * @returns {boolean}
	 */
	ModuleController.prototype.isLoaded = function ()
	{
		return this._isLoaded;
	};
	
	
	this.ModuleController = ModuleController;
});
namespace('Plankton', function (container) {
	'use strict';


	var is		= container.Plankton.is;
	var func	= container.Plankton.func;
	var array	= container.Plankton.array;


	/**
	 * @class Plankton.as
	 * @alias as
	 */
	var as = {};
	
	
	/**
	 * @param {*} subject
	 * @returns {boolean}
	 */
	as.bool = function(subject) {
		return is.true(subject);
	};
		
	/**
	 * @param subject
	 * @returns {*}
	 */
	as.array = array;
	
	/**
	 * @param subject
	 * @return {*}
	 */
	as.func = func;
	
	/**
	 * @param {Function} callback
	 * @returns {Function}
	 */
	as.async = func.async;
	
	
	this.as = as;
});
namespace('Plankton', function (root) 
{
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var array	= root.Plankton.array;
	
	
	function getForEachForSubject(subject)
	{
		if (is.array(subject))
		{
			return array.forEach;
		}
		else if (is.jsObject(subject))
		{
			return obj.forEach;
		}
		else
		{
			throw Error('Subject must be Array or Object');
		}
	}
	
	
	/**
	 * @class Plankton.foreach
	 * @alias foreach
	 * 
	 * @param {Array|Object} subject
	 * @param {function(*)} callback
	 * @param {*=} scope
	 */
	var foreach = function (subject, callback, scope)
	{
		var method = getForEachForSubject(subject);
		method.value(subject, callback, scope);
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(*)} callback
	 * @param {*=} scope
	 */
	foreach.value = foreach;
	
	/**
	 * @param {Array} subject
	 * @param {function(Number)} callback
	 * @param {*=} scope
	 */
	foreach.key = function (subject, callback, scope)
	{
		var method = getForEachForSubject(subject);
		method.key(subject, callback, scope);
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(Number *)} callback
	 * @param {*=} scope
	 */
	foreach.pair = function(subject, callback, scope)
	{
		var method = getForEachForSubject(subject);
		method.pair(subject, callback, scope);
	};
	
	/**
	 * @param {Array} subject
	 * @param {function(Array)} callback
	 * @param {*=} scope
	 */
	foreach.item = function(subject, callback, scope)
	{
		var method = getForEachForSubject(subject);
		method.item(subject, callback, scope);
	};
	
	
	this.foreach = foreach;
});
namespace('Plankton', function(root)
{
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var array	= root.Plankton.array;
	
	
	/**
	 * @class Plankton.url
	 * @alias url
	 */
	var url = {};


	/**
	 * @param {string|*} path
	 * @param {{}=} params
	 * @returns {string}
	 */
	url.encode = function (path, params)
	{
		var queryParams	= {};
		var link		= path.toString();
		var encodedLink	= '';
		var addSlash	= false;
		var queryParts	= [];
		
		obj.forEach.pair(params, function (key, value)
		{
			if (is.bool(value))
			{
				params[key] = (value ? '1' : '0');
			}
		});
		
		obj.forEach.pair(params, function (key, value)
		{
			if (link.indexOf('{' + key + '}') === -1)
			{
				queryParams[key] = value;
				return;
			}
			
			link = link.replace(new RegExp('{' + key + '}', 'g'), value.toString());
		});
		
		array.forEach(link.split('/'), function (part)
		{
			if (addSlash)
			{
				encodedLink += '/';
			}
			else
				{
				addSlash = true;
			}
			
			encodedLink += encodeURIComponent(part);
		});
		
		if (!is(queryParams))
		{
			return encodedLink;
		}
		
		obj.forEach.pair(queryParams, function (key, value)
		{
			queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
		});
		
		return encodedLink + '?' + queryParts.join('&');
	};

	/**
	 * @param {string} url
	 * @returns {{ uri: string, path: string[], params: {} }}
	 */
	url.decode = function (url)
	{
		var data	= url.split('?');
		var path	= [];
		var params	= {};
		var uri		= data[0];
		
		
		if (data.length === 1)
		{
			data = [ data[0], '' ];
		}
		else if (data.length > 2)
		{
			data = [ data[0], data.splice(1).join('?') ];
		}
		
		array.forEach(data[0].split('/'), function (pathPart)
		{
			if (pathPart.length !== 0)
			{
				path.push(decodeURIComponent(pathPart));
			}
		});
		
		array.forEach(data[1].split('&'), function (queryExpression)
		{
			var query	= queryExpression.split('=');
			var key		= decodeURIComponent(query[0]);
			var value;
			
			if (key.length === 0)
			{
				return;	
			}
			else if (query.length === 1)
			{
				value = '';
			}
			else if (query.length > 2)
			{
				value = decodeURIComponent(query.splice(1).join('='));
			}
			else
			{
				value = decodeURIComponent(query[1]);
			}
			
			params[key] = value;
		});
		
		return {
			uri:	uri,
			path:	path,
			params:	params
		};
	};
	
	
	this.url = url;
});
namespace('SeaRoute.ParamType', function(root) 
{
	var is = root.Plankton.is;
	var classify = root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * 
	 * @property {string}	_name
	 * @property {boolean}	_isOptional
	 * @property {boolean}	_isAutoFillURL
	 * @property {*}		_defaultValue
	 */
	var Param = function(name)
	{
		this._name			= name;
		this._isOptional	= false;
		this._isAutoFillURL	= false;
		this._defaultValue	= undefined;
		
		classify(this);
	};
	

	/**
	 * @return {string}
	 */
	Param.prototype.name = function ()
	{
		return this._name;
	};

	/**
	 * @return {*}
	 */
	Param.prototype.defaultValue = function ()
	{
		return this._isOptional ? this._defaultValue : undefined;
	};

	/**
	 * @return {boolean}
	 */
	Param.prototype.hasDefaultValue = function()
	{
		return this._isOptional && is.defined(this._defaultValue);
	};
	
	/**
	 * @return {boolean}
	 */
	Param.prototype.isOptional = function ()
	{
		return this._isOptional;
	};

	/**
	 * @return {boolean}
	 */
	Param.prototype.isAutoFillURL = function ()
	{
		return this.hasDefaultValue() && this._isAutoFillURL;
	};
	
	
	/**
	 * @param {*} value
	 * @return {SeaRoute.ParamType.Param}
	 */
	Param.prototype.setDefaultValue = function (value)
	{
		this._isOptional = true;
		this._defaultValue = value;
		return this;
	};
	
	/**
	 * @param {boolean} isOptional
	 * @return {SeaRoute.ParamType.Param}
	 */
	Param.prototype.setIsOptional = function (isOptional)
	{
		this._isOptional = isOptional;
		return this;
	};
	
	/**
	 * @param {boolean} isAutoFillURL
	 * @return {SeaRoute.ParamType.Param}
	 */
	Param.prototype.setIsAutoFillURL = function (isAutoFillURL)
	{
		this._isAutoFillURL = isAutoFillURL;
		return this;
	};
	
	
	/**
	 * @return {boolean}
	 */
	Param.prototype.validate = function ()
	{
		return true;
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	Param.prototype.encode = function (data)
	{
		return data.toString();
	};
	
	/**
	 * @param {string} data
	 * @return {*}
	 */
	Param.prototype.extract = function (data)
	{
		return data;
	};
	
	
	this.Param = Param;
});
namespace('Duct.Debug', function (root)
{
	var foreach = root.Plankton.foreach;
	
	
	var DEFAULT_FILTER = /.*/;
	
	
	/**
	 * @param {Event} event
	 * @param {Array} params
	 */
	var DEFAULT_LOGGER = function (event, params)
	{ 
		console.groupCollapsed('Event %c' + event.name(), 'color: green');
		
		foreach(params, function (value)
		{
			console.log(value);
		});
		
		console.groupEnd();
	};
	
	
	/**
	 * @param {RegExp=} filter
	 * @constructor
	 */
	var EventDebug = function (filter)
	{
		/**
		 * @type {RegExp}
		 * @private
		 */
		this._filter = filter || DEFAULT_FILTER;
	
		/**
		 * @type {boolean}
		 * @private
		 */
		this._log = false;
	
		/**
		 * @private
		 */
		this._logger = DEFAULT_LOGGER;
	};
	
	
	EventDebug.prototype.log = function ()
	{
		this._log = true;
	};
	
	/**
	 * @param {RegExp} filter
	 */
	EventDebug.prototype.filter = function (filter)
	{
		this._filter = filter;
	};
	
	/**
	 * @param {string} data
	 */
	EventDebug.prototype.filterStartsWith = function (data)
	{
		this._filter = new RegExp('^' + data + '.*$');
	};
	
	EventDebug.prototype.reset = function ()
	{
		this._filter = DEFAULT_FILTER;
		this._log = false;
	};
	
	/**
	 * @param {function} logger
	 */
	EventDebug.prototype.setLogger = function(logger)
	{
		this._logger = logger;
	};
	
	/**
	 * @param {Event} event
	 * @param {Array} args
	 */
	EventDebug.prototype.onTrigger = function(event, args) 
	{
		if (!this._log || !this._filter.test(event.name()))
		{
			return;
		}
		
		this._logger(event, args)
	};
	
	
	this.EventDebug = EventDebug;
});
namespace('Duct.LT', function (root)
{
	var func = root.Plankton.func;
	var foreach = root.Plankton.foreach;
	var classify = root.Classy.classify;
	
	
	/**
	 * @class {Duct.LT.DeadListener}
	 * @alias {DeadListener}
	 * 
	 * @param {array=} params
	 * @constructor
	 */
	function DeadListener(params)
	{
		this._params	= params || [];
		this._callbacks = [];
		
		classify(this);
	}
	
	
	DeadListener.prototype._invoke = function ()
	{
		var callbacks = this._callbacks;
		var params = this._params;
		
		this._callbacks = [];
		
		foreach (callbacks, function (callback)
		{
			callback = func.silent(callback);
			callback.apply(null, params);
		});
	};
	
	DeadListener.prototype._invokeAsync = function () 
	{
		func.async.do(this._invoke);
	};
	
	DeadListener.prototype.add = function (callback)
	{
		this._callbacks.push(callback);
		this._invokeAsync();
		return this;
	};
	
	DeadListener.prototype.remove = function (callback)
	{
		var index = this._callbacks.indexOf(callback);
		
		if (index !== -1)
			this._callbacks.splice(index, 1);
			
		return this;
	};
	
	
	this.DeadListener = DeadListener;
});
namespace('Duct.LT', function (root)
{
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	var classify	= root.Classy.classify;


	/**
	 * @class {Duct.LT.LifeBind}
	 * @alias {LifeBind}
	 * 
	 * @constructor
	 */
	function LifeBind()
	{
		this._original	= [];
		this._boundData	= [];
		this._isAlive	= true;
		
		classify(this);
	}
	
	
	LifeBind.prototype._invokeUnbind = function (onDestroy, original, bound)
	{
		delete bound.__DUCT_ORIGINAL_CALLBACK__;
		onDestroy(original, bound);
	};	
	
	LifeBind.prototype._invokeUnbinds = function (original, boundData)
	{
		foreach(boundData, function (item) 
			{
				this._invokeUnbind(item[0], original, item[1]);
			},
			this);
	};
	
	LifeBind.prototype._createCallback = function (callback)
	{
		var self = this;
		var selfUnbound = false;
		
		return function ()
		{
			if (!self._isAlive)
				return;
			else if (selfUnbound)
				return;
			
			var result = callback.apply(this, arguments);
			
			if (result === false)
			{
				selfUnbound = true;
				self.unbind(callback);
			}
			else if (result === null)
			{
				self.kill();
			}
		};
	};
	
	LifeBind.prototype._add = function (onDestroy, callback, bound)
	{
		var index = this._original.indexOf(callback);
		
		if (index === -1)
		{
			this._original.push(callback);
			this._boundData.push([ [ onDestroy, bound ] ]);
		}
		else
		{
			this._boundData[index].push([ onDestroy, bound ]);
		}
	};


	/**
	 * @param {function} callback
	 * @param {function(Function, Function)=} onDestroy
	 */
	LifeBind.prototype.bindToLife = function (callback, onDestroy)
	{
		onDestroy = onDestroy || function() {};
		
		var self = this;
		var boundCallback = this._createCallback(callback);
		
		boundCallback.__DUCT_ORIGINAL_CALLBACK__ = callback;
		
		if (!this._isAlive)
		{
			func.async.do(function ()
			{
				self._invokeUnbind(onDestroy, callback, boundCallback);
			});
		}
		else
		{
			this._add(onDestroy, callback, boundCallback);
		}
		
		return boundCallback;
	};

	/**
	 * @param {function} callback
	 */
	LifeBind.prototype.unbind = function (callback)
	{
		if (is.function(callback.__DUCT_ORIGINAL_CALLBACK__))
		{
			this.unbind(callback.__DUCT_ORIGINAL_CALLBACK__);
			return;
		}
		
		var boundData;
		var index = this._original.indexOf(callback);
		
		if (index === -1) return;
		
		boundData = (this._boundData.splice(index, 1))[0];
		
		this._original.splice(index, 1);
		this._invokeUnbinds(callback, boundData)
	};
	
	LifeBind.prototype.clear = function ()
	{
		var original	= this._original;
		var boundData 	= this._boundData;
		var count		= boundData.length;
		
		this._original	= [];
		this._boundData	= [];
		
		for (var i = 0; i < count; i++)
		{
			this._invokeUnbinds(original[i], boundData[i]);
		}
	};
	
	LifeBind.prototype.kill = function ()
	{
		if (!this._isAlive) return;
		
		this._isAlive = false;
		this.clear();
	};

	/**
	 * @return {boolean}
	 */
	LifeBind.prototype.isAlive = function ()
	{
		return this._isAlive;
	};

	/**
	 * @return {boolean}
	 */
	LifeBind.prototype.isDead = function ()
	{
		return !this._isAlive;
	};
	
	
	this.LifeBind = LifeBind;
});
namespace('Duct', function (root)
{
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	
	
	/**
	 * @name {Duct.Trigger}
	 * @alias {Trigger}
	 */
	var Trigger = {
		
		asyncHandle: function (callbacks, args, next)
		{
			foreach(callbacks, function(callback)
			{
				func.async.do(function() 
				{
					next([callback], args);
				});
			});
		},
		
		asyncTrigger: function (callbacks, args, next)
		{
			func.async.do(function() 
			{
				next(callbacks, args);
			});
		}
	};
	
	
	this.Trigger = Trigger;
});
namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var func	= root.Plankton.func;
	var array	= root.Plankton.array;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @name {Oyster.Actions.ActionChainLoader}
	 * @alias {ActionChainLoader}
	 */
	var ActionChainLoader = {
		
		/**
		 * @param {Error} error
		 * @param {string} method
		 * @param {string} name
		 * @private
		 */
		_errorHandler: function (error, method, name)
		{
			console.error('Error thrown while invoking "' + method + '" on action ' + name, error);
		},
		
		/**
		 * 
		 * @param action
		 * @param {string} method
		 * @param {[]|*} params
		 * @private
		 */
		_invokeMethod: function (action, method, params)
		{
			var name;
			
			if (!is(action[method]))
				return;
			
			try
			{
				action[method].apply(action, array(params));
			}
			catch (e) 
			{
				if (is.function(action.name))
					name = action.name();
				else if (is.function(action.constructor.name))
					name = action.constructor.name();
				else
					name = '[unknown]';
				
				ActionChainLoader._errorHandler(e, method, name);
			}
		},
		
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 * @private
		 */
		invokePreDestroy: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'preDestroy', [params, prevParams]);
				
				var events = item.action().events();
				events.triggerDestroy();
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 * @private
		 */
		invokeRefresh: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'refresh', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeUpdate: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'update', [params, prevParams]);
				ActionChainLoader._invokeMethod(item.action(), 'execute', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeInitialize: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'initialize', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} actions
		 * @param {*} params
		 * @param {*} prevParams
		 */
		invokeActivate: function (actions, params, prevParams)
		{
			foreach(actions, function (item)
			{
				ActionChainLoader._invokeMethod(item.action(), 'activate', [params, prevParams]);
				ActionChainLoader._invokeMethod(item.action(), 'execute', [params, prevParams]);
			});
		},
		
		/**
		 * @param {[ActionChainLink]} on
		 * @param {*} params
		 * @param {*} prevParams
		 * @return {Promise}
		 * @private
		 */
		invokeDestroy: function (on, params, prevParams)
		{
			return func.async.do(function ()
			{
				foreach(on, function (item)
				{
					ActionChainLoader._invokeMethod(item.action(), 'destroy', [params, prevParams]);
				});
			});
		}
	};
	
	
	this.ActionChainLoader = ActionChainLoader;
});
namespace('Oyster.Modules.Utils', function (root)
{
	var foreach		= root.Plankton.foreach;
	var classify	= root.Classy.classify;


	/**
	 * @class Oyster.Modules.Utils.LoadSequence
	 * @alias LoadSequence
	 * 
	 * @param {callback} onLoadCallback
	 * @param {callback} onUnloadCallback
	 * 
	 * @constructor
	 */
	function LoadSequence(onLoadCallback, onUnloadCallback)
	{
		classify(this);
		
		this._onLoadCallback	= onLoadCallback;
		this._onUnloadCallback	= onUnloadCallback;
	}

	/**
	 * @param {string} method
	 * @param {Module} module
	 * @param {Error} error
	 * @private
	 */
	LoadSequence.prototype._handleException = function (method, module, error)
	{
		console.error('Failed to invoke method ' + method + ' on module', module, error);
	};

	/**
	 * @param {Module[]} set
	 * @param {string} method
	 * @private
	 */
	LoadSequence.prototype._invoke = function (set, method)
	{
		foreach(set, function (module)
		{
			try 
			{
				module[method]();
			}
			catch (error)
			{
				this._handleException(method, module, error);
			}
		}, this);
	};

	/**
	 * @param {Module[]} set
	 * @param {boolean} flag
	 * @private
	 */
	LoadSequence.prototype._setIsLoaded = function (set, flag)
	{
		foreach(set, function (module) { module.control().setIsLoaded(flag); });
	};

	/**
	 * @param {Module[]} modules
	 * @private
	 */
	LoadSequence.prototype._destroyLT = function (modules)
	{
		foreach(modules, function (module) { module.LT().kill(); });
	};

	/**
	 * @param {Module[]} toLoad
	 * @param {Module[]} toUnload
	 */
	LoadSequence.prototype.execute = function(toLoad, toUnload)
	{
		this._invoke(toLoad, 'initialize');
		
		this._invoke(toUnload, 'preUnload');
		this._setIsLoaded(toUnload, false);
		this._destroyLT(toUnload, false);
		this._invoke(toUnload, 'onUnload');
		
		foreach(toUnload, function (module) { this._onUnloadCallback(module); }, this);
		this._invoke(toUnload, 'postUnload');
		foreach(toLoad, function (module) { this._onLoadCallback(module); }, this);
		
		this._invoke(toLoad, 'preLoad');
		this._setIsLoaded(toLoad, true);
		this._invoke(toLoad, 'onLoad');
		this._invoke(toLoad, 'postLoad');
		
		this._invoke(toUnload, 'destroy');
	};
	
	
	this.LoadSequence = LoadSequence;
});
namespace('SeaRoute.ParamType', function(root)
{
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.FlagParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var FlagParam = function(name)
	{
		Param.call(this, name);
	};
	
	
	FlagParam.prototype = Object.create(Param.prototype);
	FlagParam.prototype.constructor = FlagParam;

	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	FlagParam.prototype.validate = function (data)
	{
		return data === this.name();
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.isOptional = function ()
	{
		return true;
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.defaultValue = function ()
	{
		return false;
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.hasDefaultValue = function ()
	{
		return true;
	};
	
	/**
	 * @return {string}
	 */
	FlagParam.prototype.encode = function ()
	{
		return this.name();
	};
	
	/**
	 * @return {boolean}
	 */
	FlagParam.prototype.extract = function ()
	{
		return true;
	};
	
	
	this.FlagParam = FlagParam;
});
namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.IntParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * @param {number|undefined} min
	 * @param {number|undefined} max
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var IntParam = function(name, min, max)
	{
		Param.call(this, name);
		
		this._min = is.number(min) ? min : Number.MIN_VALUE;
		this._max = is.number(max) ? max : Number.MAX_VALUE;
	};
	
	
	IntParam.prototype = Object.create(Param.prototype);
	IntParam.prototype.constructor = IntParam;

	/**
	 * @param {Number} min
	 * @return {SeaRoute.ParamType.IntParam}
	 */
	IntParam.prototype.setMin = function (min)
	{
		this._min = min;
		return this;
	};

	/**
	 * @param {Number} max
	 * @return {SeaRoute.ParamType.IntParam}
	 */
	IntParam.prototype.setMax = function (max)
	{
		this._max = max;
		return this;
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	IntParam.prototype.validate = function (data)
	{
		var value = parseFloat(data);
		
		if (is.NaN(value))
		{
			return false;
		}
		
		return (value >= this._min && value <= this._max);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	IntParam.prototype.encode = function (data)
	{
		if (!is.number(data))
		{
			data = parseFloat(data.toString());
			
			if (is.NaN(data)) {
				throw new Error("Invalid parameter provided for " + this.name());
			}
		}
		
		return Math.round(data).toString();
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	IntParam.prototype.extract = function (data)
	{
		return Math.round(parseFloat(data));
	};
	
	
	this.IntParam = IntParam;
});
namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.JsonParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string}	name
	 * 
	 * @property {RegExp} _regex
	 */
	var JsonParam = function(name)
	{
		Param.call(this, name);
	};
	
	
	JsonParam.prototype = Object.create(Param.prototype);
	JsonParam.prototype.constructor = JsonParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	JsonParam.prototype.validate = function (data)
	{
		return is.json(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	JsonParam.prototype.encode = function (data)
	{
		return JSON.stringify(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	JsonParam.prototype.extract = function (data)
	{
		return JSON.parse(data);
	};
	
	
	this.JsonParam = JsonParam;
});
namespace('SeaRoute.ParamType', function(root)
{
	var is		= root.Plankton.is;
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.NumberParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string} name
	 * @param {number|undefined} min
	 * @param {number|undefined} max
	 * 
	 * @property {number} _min
	 * @property {number} _max
	 */
	var NumberParam = function(name, min, max)
	{
		Param.call(this, name);
		
		this._min = is.number(min) ? min : Number.MIN_VALUE;
		this._max = is.number(max) ? max : Number.MAX_VALUE;
	};
	
	
	NumberParam.prototype = Object.create(Param.prototype);
	NumberParam.prototype.constructor = NumberParam;

	/**
	 * @param {Number} min
	 * @return {SeaRoute.ParamType.NumberParam}
	 */
	NumberParam.prototype.setMin = function (min)
	{
		this._min = min;
		return this;
	};

	/**
	 * @param {Number} max
	 * @return {SeaRoute.ParamType.NumberParam}
	 */
	NumberParam.prototype.setMax = function (max)
	{
		this._max = max;
		return this;
	};
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	NumberParam.prototype.validate = function (data)
	{
		var value = parseFloat(data);
		return (!is.NaN(value) && value >= this._min && value <= this._max);
	};
	
	/**
	 * @param {*} data
	 * @return {string}
	 */
	NumberParam.prototype.encode = function (data)
	{
		if (!is.number(data))
		{
			data = parseFloat(data.toString());
			
			if (is.NaN(data))
				throw new Error('Invalid parameter provided for ' + this.name());
		}
		
		return data.toString();
	};
	
	/**
	 * @param {string} data
	 * @return {Number}
	 */
	NumberParam.prototype.extract = function (data)
	{
		return parseFloat(data);
	};
	
	
	this.NumberParam = NumberParam;
});
namespace('SeaRoute.ParamType', function(root) {
	'use strict';
	
	
	var Param	= root.SeaRoute.ParamType.Param;
	var is		= root.Plankton.is;
	
	
	/**
	 * @class SeaRoute.ParamType.OneOfParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string}		name
	 * @param {string[]}	of
	 * 
	 * @property {string[]} _of
	 */
	var OneOfParam = function(name, of) {
		Param.call(this, name);
		
		this._of = of;
	};
	
	
	OneOfParam.prototype = Object.create(Param.prototype);
	OneOfParam.prototype.constructor = OneOfParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	OneOfParam.prototype.validate = function (data) {
		return this._of.indexOf(data) !== -1;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	OneOfParam.prototype.encode = function (data) {
		return data;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	OneOfParam.prototype.extract = function (data) {
		data = is.defined(data) ? data.toString() : '';
		
		if (!this.validate(data)) {
			throw '"' + data + '" is not of an expected value: ' + this._of.join(', ');
		}
		
		return data;
	};
	
	
	this.OneOfParam = OneOfParam;
});
namespace('SeaRoute.ParamType', function(root)
{
	var Param = root.SeaRoute.ParamType.Param;
	
	var is	= root.Plankton.is;
	var obj	= root.Plankton.obj;
	
	
	/**
	 * @class SeaRoute.ParamType.PredefinedParamDecorator
	 * 
	 * @param {string} name
	 * @param {SeaRoute.ParamType.Param} param
	 * 
	 * @property {string} _name
	 * @property {SeaRoute.ParamType.Param} _original
	 */
	var PredefinedParamDecorator = function(name, param)
	{
		Param.call(this, name);
		
		
		this.setDefaultValue(param.defaultValue());
		this.setIsAutoFillURL(param.isAutoFillURL());
		this.setIsOptional(param.isOptional());
		
		
		this.validate	= param.validate;
		this.extract	= param.extract;
		this.encode		= param.encode;
	};
	
	
	PredefinedParamDecorator.prototype = Object.create(Param.prototype);
	PredefinedParamDecorator.prototype.constructor = PredefinedParamDecorator;
	
	
	this.PredefinedParamDecorator = PredefinedParamDecorator;
});
namespace('SeaRoute.ParamType', function(root)
{
	var Param	= root.SeaRoute.ParamType.Param;
	
	
	/**
	 * @class SeaRoute.ParamType.RegexParam
	 * @extends SeaRoute.ParamType.Param
	 * 
	 * @param {string}	name
	 * @param {RegExp}	regex
	 * 
	 * @property {RegExp} _regex
	 */
	var RegexParam = function(name, regex)
	{
		Param.call(this, name);
		
		this._regex = regex;
	};
	
	
	RegexParam.prototype = Object.create(Param.prototype);
	RegexParam.prototype.constructor = RegexParam;
	
	
	/**
	 * @param {string} data
	 * @return {boolean}
	 */
	RegexParam.prototype.validate = function (data)
	{
		return this._regex.test(data);
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.encode = function (data)
	{
		data = data.toString();
		
		if (!this._regex.test(data)) {
			throw new Error('Pass variable doesn\'t match regex: ' + this._regex.toString());
		}
		
		return data;
	};
	
	/**
	 * @param {string} data
	 * @return {string}
	 */
	RegexParam.prototype.extract = function (data)
	{
		return data;
	};
	
	
	this.RegexParam = RegexParam;
});
namespace('SeaRoute.Route', function(root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Path
	 * 
	 * @param {string} path
	 * 
	 * @property {string} _path
	 * @property {SeaRoute.Route.Part[]} _parts
	 */
	var Path = function (path)
	{
		this._path = path;
		this._parts = [];
	};
	
	
	/**
	 * @param {SeaRoute.Route.Part} part
	 * @param {string} pathPart
	 * @return {boolean}
	 * @private
	 */
	Path.prototype._matchPart = function (part, pathPart)
	{
		if (!is(pathPart))
		{
			return part.isOptional();
		}
		
		return part.validate(pathPart);
	};
	
	
	/**
	 * @return {string}
	 */
	Path.prototype.text = function ()
	{
		return this._path;
	};
	
	/**
	 * @return {SeaRoute.Route.Part[]}
	 */
	Path.prototype.parts = function ()
	{
		return this._parts;
	};
	
	/**
	 * @param {SeaRoute.Route.Part|SeaRoute.Route.Part[]} part
	 * @return {SeaRoute.Route.Path}
	 */
	Path.prototype.addPart = function (part)
	{
		this._parts.push(part);
		return this;
	};
	
	/**
	 * @return {Number}
	 */
	Path.prototype.partsCount = function ()
	{
		return this._parts.length;
	};
	
	
	/**
	 * @param {string[]} rawPath
	 * @return {boolean}
	 */
	Path.prototype.isMatching = function (rawPath)
	{
		var length = this.partsCount();
		
		if (rawPath.length > length) {
			return false;
		}
		
		for (var index = 0; index < length; index++) {
			if (!this._matchPart(this._parts[index], rawPath[index])) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * @param {*} params
	 * @return {string}
	 */
	Path.prototype.encode = function (params)
	{
		var rawPath = [];
		var optional = [];
		var length = this.partsCount();
		var canHaveMoreParams = true;
		
		for (var index = 0; index < length; index++)
		{
			var value		= undefined;
			var part		= this._parts[index];
			var paramObj	= part.getParam();
			
			if (part.isConst())
			{
				value = part.text();
			}
			// If part is a parameter and there is passed parameter for the url, encode it.
			else if (is.defined(params[part.getParamName()]))
			{
				value = part.encode(params[part.getParamName()]);
			}
			// If the parameter is AutoFill, always add it's value.
			else if (paramObj.isAutoFillURL())
			{
				value = part.encode(paramObj.defaultValue());
			}
			// If the parameter has a default value (means it also optional) add it's value only if more 
			// parameters later in the chain are passed.
			else if (paramObj.hasDefaultValue())
			{
				optional.push(encodeURIComponent(part.encode(paramObj.defaultValue())));
			}
			// If the parameter is optional but was not provided and default value is not set: 
			// No more parameters can be added to the path.
			else if (paramObj.isOptional())
			{
				canHaveMoreParams = false;	
			}
			// Else, the parameter is required.
			else
			{
				throw new Error('Parameter ' + paramObj.name() + ' is required for the path ' + this._path);
			}
			
			if (is(value))
			{
				if (!canHaveMoreParams)
				{
					throw new Error('Optional parameter must be set if ' + paramObj.name() + ' is provided. ' + 
						'Set ' + paramObj.name() + ' or provide a default value for it');
				}
				
				if (is(optional))
				{
					rawPath = rawPath.concat(optional);
					optional = [];
				}
				
				rawPath.push(encodeURIComponent(value));
			}
		}
		
		return '/' + rawPath.join('/');
	};
	
	/**
	 * @param {string[]} rawPath
	 * @return {*}
	 */
	Path.prototype.extract = function (rawPath)
	{
		var params = {};
		var length = this.partsCount();
		var part;
		var param;
		
		for (var index = 0; index < length; index++)
		{
			part = this._parts[index];
			param = part.getParam();
			
		 	if (is.defined(rawPath[index]))
			{
				part.extract(rawPath[index], params);
			}
			else if (param.hasDefaultValue())
			{
				params[param.name()] = param.defaultValue();
			}
		}
		
		return params;
	};
	
	/**
	 * @return {[string]}
	 */
	Path.prototype.paramNames = function ()
	{
		var res = [];
		
		foreach(this._parts, function (part) 
		{
			if (!part.isConst())
			{
				res.push(part.getParamName());
			}
		});
		
		return res;
	};
	
	
	this.Path = Path;
});
namespace('SeaRoute.Route', function(root)
{
	var is		= root.Plankton.is;
	var as		= root.Plankton.as;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Query
	 * 
	 * @property {SeaRoute.ParamType.Param[]} 	_params
	 * @property {boolean}						_isStrict
	 */
	var Query = function ()
	{
		this._params = [];
		this._isStrict = false;
	};
	
	
	/**
	 * @param {*} query
	 * @param {SeaRoute.ParamType.Param} param
	 * @param {*} data
	 * @return {*}
	 */
	Query.prototype._queryToParam = function (query, param, data)
	{
		if (!is(query[param.name()]))
		{
			if (param.hasDefaultValue())
			{
				data[param.name()] = param.defaultValue();
			}
			else if (!param.isOptional())
			{
				throw 'Missing query parameter ' + param.name();
			}
		} 
		else
		{
			data[param.name()] = param.extract(query[param.name()]);
		}
	};
	
	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype._queryToParams = function (query)
	{
		var data = {};
		var self = this;
		
		foreach(this._params, function (param)
		{
			self._queryToParam(query, param, data);
		});
		
		return data;
	};
	
	/**
	 * @param {*} values
	 * @param {SeaRoute.ParamType.Param} param
	 * @param {*} data
	 * @return {*}
	 */
	Query.prototype._paramToQuery = function (values, param, data)
	{
		if (!is(values[param.name()]))
		{
			if (param.isAutoFillURL())
			{
				data[param.name()] = param.encode(param.defaultValue());
			}
			else if (!param.isOptional())
			{
				throw 'Value of parameter ' + param.name() + ' not passed';
			}
		}
		else
		{
			data[param.name()] = param.encode(values[param.name()]);
		}
	};
	
	/**
	 * @param {*} values
	 * @return {*}
	 */
	Query.prototype._paramsToQuery = function (values)
	{
		var data = {};
		var self = this;
		
		foreach(this._params, function (param)
		{
			self._paramToQuery(values, param, data);
		});
		
		return data;
	};
	
	
	/**
	 * @return {boolean}
	 */
	Query.prototype.isEmpty = function ()
	{
		return !is(this._params);
	};
	
	/**
	 * @return {Number}
	 */
	Query.prototype.count = function ()
	{
		return this._params.length;
	};
	
	/**
	 * @return {SeaRoute.Route.Query}
	 */
	Query.prototype.setStrict = function ()
	{
		this._isStrict = true;
		return this;
	};
	
	/**
	 * @param {SeaRoute.ParamType.Param[]|SeaRoute.ParamType.Param} params
	 * @return {SeaRoute.Route.Query}
	 */
	Query.prototype.add = function (params)
	{
		params = as.array(params);
		this._params = this._params.concat(params);
		return this;
	};
	
	
	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype.parseQuery = function (query)
	{
		var data = this._queryToParams(query);
		
		if (!this._isStrict)
		{
			foreach.pair(query, function(name, value)
			{
				if (!data.hasOwnProperty(name))
				{
					data[name] = value;
				}
			});
		}
		
		return data;
	};
	
	/**
	 * @param {*} query
	 * @return {*}
	 */
	Query.prototype.parseParameters = function (query)
	{
		var data = this._paramsToQuery(query);
		
		if (this._isStrict)
		{
			foreach.key(query, function(name)
			{
				if (!data.hasOwnProperty(name))
				{
					throw 'Parameter named ' + name + ' is not defined';
				}
			});
		}
		
		return data;
	};
	
	/**
	 * @return {[string]}
	 */
	Query.prototype.paramNames = function () 
	{
		var res = [];
		
		foreach(this._params, function (param)
		{
			res.push(param.name());
		});
		
		return res;
	};
	
	
	this.Query = Query;
});
namespace('SeaRoute.Route.Utils', function(root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Utils.MapCursor
	 * 
	 * @property {function([], *): []|undefined} addRoute
	 * @property {function([]): *|undefined} getCompareElement
	 * @property {function([]): Number|undefined} getCompareElementIndex
	 * 
	 * @param {SeaRoute.Route.Route} route
	 */
	var MapCursor = function (route)
	{
		var self = this;
		
		this.route		= route;
		this.rawParts	= [];
		this.index		= 0;
		this.EOP		= false;
		this.current	= false;
		
		
		foreach(
			route.path().parts(),
			
			/**
			 * @param {SeaRoute.Route.Part} part
			 */
			function (part)
			{
				if (!part.isConst())
				{
					return false;
				}
				
				self.rawParts.push(part.text());
			}
		);
		
		
		this.EOP		= this.rawParts.length === 0;
		this.current	= is(this.rawParts) ? this.rawParts[0] : false;
	};
	
	
	MapCursor.prototype.forward = function ()
	{
		this.goto(this.index + 1);
	};
	
	MapCursor.prototype.back = function ()
	{
		this.goto(this.index - 1);
	};
	
	MapCursor.prototype.goto = function (index)
	{
		if (this.rawParts.length < index)
		{
			return false;
		}
		
		this.index		= index;
		this.EOP		= (this.index === this.rawParts.length);
		this.current	= (this.EOP ? false : this.rawParts[this.index]);
		
		return true;
	};


	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {SeaRoute.Route.Utils.MapCursor}
	 */
	MapCursor.createAppendCursor = function (route)
	{
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[arr.length - 1]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.push(element); return arr; };
		
		return cursor;
	};

	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {SeaRoute.Route.Utils.MapCursor}
	 */
	MapCursor.createPrependCursor = function (route)
	{
		var cursor = new MapCursor(route);
		
		cursor.getCompareElement = function (arr) { return arr[0]; };
		cursor.getCompareElementIndex = function (arr) { return arr.length - 1; };
		cursor.addRoute = function (arr, element) { arr.unshift(element); return arr; };
		
		return cursor;
	};
	
	
	this.MapCursor = MapCursor;
});
namespace('SeaRoute.Route.Utils', function(root) {
	'use strict';
	
	
	var url		= root.Plankton.url;
	

	/**
	 * @class SeaRoute.Route.Utils.MatchCursor
	 * 
	 * @param {string} query
	 */
	var MatchCursor = function(query) {
		var urlData = url.decode(query);
		
		this.rawParts	= urlData.path;
		this.rawQuery	= urlData.params;
		this.index		= 0;
		this.EOP		= (this.rawParts.length === 0);
		this.current	= (!this.EOP ? this.rawParts[0] : false);
	};
	
	
	MatchCursor.prototype.forward = function () {
		this.index++;
		
		this.EOP		= (this.index === this.rawParts.length);
		this.current	= (this.EOP ? false : this.rawParts[this.index]);
	};
	
	MatchCursor.prototype.back = function () {
		this.index--;
		
		this.EOP		= false;
		this.current	= this.rawParts[this.index];
	};
	
	
	this.MatchCursor = MatchCursor;
});
namespace('Duct.LT', function (root)
{
	var array	= root.Plankton.array;
	var foreach	= root.Plankton.foreach;
	
	var Singleton	= root.Classy.Singleton;
	var classify	= root.Classy.classify;
	
	var LifeBind	= root.Duct.LT.LifeBind;
	
	
	/**
	 * @class {Duct.LT.LifeBindFactory}
	 * @alias {LifeBindFactory}
	 * 
	 * @property {function(): LifeBindFactory} instance
	 * 
	 * @constructor
	 */
	function LifeBindFactory()
	{
		this._builders = [];
		
		classify(this);
	}
	
	
	LifeBindFactory.prototype.addBuilder = function (builder)
	{
		this._builders = this._builders.concat(array(builder));
	};
	
	/**
	 * @param {*} element
	 * @return {LifeBind}
	 */
	LifeBindFactory.prototype.get = function (element)
	{
		if (element instanceof LifeBind)
			return element;
		
		var result = undefined;
		
		foreach (this._builders, function (builder) 
		{
			result = builder(element);
			
			if (result instanceof LifeBind)
				return false;
		});
		
		if (!(result instanceof LifeBind))
		{
			throw new Error('Could not convert object to LifeBind type');
		}
		
		return result;
	};
	
	
	this.LifeBindFactory = Singleton(LifeBindFactory);
});
namespace('Oyster.Actions', function (root)
{
	var is		= root.Plankton.is;
	var obj		= root.Plankton.obj;
	var foreach	= root.Plankton.foreach;
	
	var ActionChainLink		= root.Oyster.Actions.ActionChainLink;
	var ActionChainLoader	= root.Oyster.Actions.ActionChainLoader;
	
	
	/**
	 * @class {Oyster.Actions.ActionChain}
	 * @alias {ActionChain}
	 * 
	 * @property {TreeActionsModule}	_module
	 * @property {Navigator}			_navigator
	 * @property {[ActionChainLink]}	_chain
	 * @property {ActionRoute}			_route
	 * @property {*}					_params
	 * 
	 * @param {TreeActionsModule} module
	 * 
	 * @constructor
	 */
	function ActionChain(module)
	{
		this._module	= module;
		this._navigator	= module.navigator();
		this._chain		= [];
		this._params	= {};
		this._route		= null;
	}
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findModified = function (actionRoute, target)
	{
		var prevActionConstructor = (this._route ? this._route.actions() : []);
		var currActionConstructor = actionRoute.actions();
		var maxIndex = Math.min(prevActionConstructor.length, currActionConstructor.length);
		
		target.modified = [];
		
		for (var index = 0 ; index < maxIndex; index++)
		{
			if (prevActionConstructor[index] !== currActionConstructor[index]) break;
			
			target.modified.push(this._chain[index]);
		}
	};
	
	/**
	 * @param {{}} target
	 * @param {*} params
	 * @private
	 */
	ActionChain.prototype._findUnmodified = function (target, params)
	{
		var foundIndex;
		var checked = {};
		var found = false;
		var paramNames = (this._route ? this._route.params() : []);
		
		for (foundIndex = 0; foundIndex < target.modified.length; foundIndex++)
		{
			foreach(paramNames[foundIndex], function (paramName) 
			{
				if (is(checked[paramName]))
				{
					return true;
				}
				else if (this._params[paramName] === params[paramName])
				{
					checked[paramName] = true;
				}
				else 
				{
					found = true;
					return false;
				}
			}, this);
			
			if (found) break;
		}
		
		if (foundIndex === 0)
			target.unmodified = [];
		else
			target.unmodified = target.modified.splice(0, foundIndex);
	};
	
	/**
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findUnmounted = function (target)
	{
		var length = target.modified.length + target.unmodified.length;
		
		target.unmount = this._chain.slice(
			length, 
			this._chain.length
		);
	};
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {{}} target
	 * @private
	 */
	ActionChain.prototype._findMounted = function (actionRoute, target)
	{
		var length = target.modified.length + target.unmodified.length;
		var creators = actionRoute.actions();
		
		target.mount = [];
		
		for (var index = length; index < creators.length; index++)
		{
			var action = new creators[index]();
			var chainLink = new ActionChainLink(action); 
			
			action.setNavigator(this._navigator);
			target.mount.push(chainLink);
		}
	};
	
	/**
	 * @param {{}} target
	 * @param {*} params
	 * @param {ActionRoute} route
	 * @private
	 */
	ActionChain.prototype._updateChainState = function (target, params, route)
	{
		this._chain		= [].concat(target.unmodified, target.modified, target.mount);
		this._params	= params;
		this._route		= route;
		
		var index = 0;
		var last = this._chain.length - 1;
		
		foreach(this._chain,
			/**
			 * @param {ActionChainLink} item
			 */
			function (item) 
			{
				ActionChainLink.updateRelations(
					item,
					(index === last ? null : this._chain[index + 1]),
					(index === 0 ? null : this._chain[index - 1])
				);
				
				ActionChainLink.setApp(item, this._module.app());
				
				item.action().setParams(params);
				
				index++;
			},
			this);
	};
	
	/**
	 * @param {{ unmount: [ActionChainLink] }} target
	 * @private
	 */
	ActionChain.prototype._unmount = function (target)
	{
		foreach(target, function (item) { ActionChainLink.unmount(item); });
	};
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	ActionChain.prototype._buildChangesObject = function (actionRoute, params)
	{
		var target = {};
		
		this._findModified(actionRoute, target);
		this._findUnmodified(target, params);
		this._findUnmounted(target);
		this._findMounted(actionRoute, target);
		
		return target;
	};
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	ActionChain.prototype.update = function (actionRoute, params)
	{
		var target = this._buildChangesObject(actionRoute, params);
		var prevParams = obj.copy(this._params); 
		
		ActionChainLoader.invokePreDestroy(target.unmount, params, this._params);
		
		this._unmount(target.unmount);
		this._updateChainState(target, params, actionRoute);
		
		ActionChainLoader.invokeInitialize(target.mount, this._params, prevParams);
		ActionChainLoader.invokeRefresh(target.unmodified, this._params, prevParams);
		ActionChainLoader.invokeUpdate(target.modified, this._params, prevParams);
		ActionChainLoader.invokeActivate(target.mount, this._params, prevParams);
		
		ActionChainLoader.invokeDestroy(target.unmount, this._params, prevParams);
	};
	
	
	/**
	 * @return {Array.<ActionChainLink>|null}
	 */
	ActionChain.prototype.chain = function ()
	{
		return this._chain;
	};
	
	/**
	 * @return {ActionRoute|null}
	 */
	ActionChain.prototype.route = function ()
	{
		return this._route;
	};
	
	/**
	 * @return {*}
	 */
	ActionChain.prototype.params = function ()
	{
		return this._params;
	};
	
	
	this.ActionChain = ActionChain;
});
namespace('Oyster.Modules.Utils', function (root)
{
	var classify	= root.Classy.classify;
	
	var is			= root.Plankton.is;	
	var obj			= root.Plankton.obj;
	var func		= root.Plankton.func;
	var array		= root.Plankton.array;
	var foreach		= root.Plankton.foreach;
	
	var LoadSequence = root.Oyster.Modules.Utils.LoadSequence;


	/**
	 * @name {Oyster.Modules.Utils.Loader}
	 * @alias {Loader}
	 * 
	 * @param {callback} onLoad
	 * @param {callback} onUnload
	 * @param {callback=} onComplete
	 * 
	 * @constructor
	 */
	function Loader(onLoad, onUnload, onComplete)
	{
		classify(this);
		
		this._pendingLoad		= [];
		this._pendingUnload		= [];
		this._onComplete		= onComplete || function() {};
		
		this._seq		= new LoadSequence(onLoad, onUnload);
		this._isRunning	= false;
	}
	
	
	Loader.prototype._loop = function ()
	{
		var toLoad		= this._pendingLoad.shift();
		var toUnload	= this._pendingUnload.shift();
		
		if (is(toLoad) || is(toUnload))
		{
			this._seq.execute(obj.values(toLoad), obj.values(toUnload));
		}
		
		this._postLoop();
	};
	
	Loader.prototype._postLoop = function ()
	{
		this._isRunning = false;
		this._schedule();
		
		if (!this._isRunning)
			this._onComplete();
	};
	
	Loader.prototype._schedule = function ()
	{
		if (this._isRunning)
			return;
		
		if (this._pendingLoad.length === 0 && this._pendingUnload.length === 0)
			return;
		
		this._isRunning = true;
		func.async.do(func.safe(this._loop, function (error) { console.error('Error in load loop', error); }));
	};
	
	/**
	 * @param {[]} target
	 * @param {Module[]|Module} module
	 * @private
	 */
	Loader.prototype._append = function (target, module)
	{
		if (is.array(module))
		{
			(target === this._pendingLoad ? this.load(module) : this.unload(module));
			return;
		}
		
		var container		= array.last(target);
		var toLoadContainer	= array.last(this._pendingLoad);
		
		var name = module.control().name();
			
		if (is(toLoadContainer[name]))
		{
			throw new Error('Module named ' + name + ' is already scheduled for load');
		}
		
		container[name] = module;
	};


	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.load = function (module)
	{
		this._pendingLoad.push({});
		this._pendingUnload.push({});
		
		foreach(array(module), function (item) { this._append(this._pendingLoad, item); }, this);
		
		this._schedule();
	};

	/**
	 * @param {Module|Module[]} module
	 */
	Loader.prototype.unload = function (module)
	{
		this._pendingLoad.push({});
		this._pendingUnload.push({});
		
		foreach(array(module), function (item) { this._append(this._pendingUnload, item); }, this);
		
		this._schedule();
	};
	
	/**
	 * @return {boolean}
	 */
	Loader.prototype.isLoading = function ()
	{
		return this._isRunning;
	};
	
	
	this.Loader = Loader;
});
namespace('SeaRoute.ParamType', function(root)
{
	var RegexParam	= root.SeaRoute.ParamType.RegexParam;
	
	
	/**
	 * @class SeaRoute.ParamType.WildcardParam
	 * @extends SeaRoute.ParamType.RegexParam
	 * 
	 * @param {string} name
	 * @param {string} expression
	 */
	var WildcardParam = function(name, expression)
	{
		RegexParam.call(this, name, new RegExp('^' + expression.replace('*', '.*') + '$'));
	};
	
	
	WildcardParam.prototype = Object.create(RegexParam.prototype);
	WildcardParam.prototype.constructor = WildcardParam;
	
	
	this.WildcardParam = WildcardParam;
});
namespace('SeaRoute.Parsers', function(root)
{
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	var FlagParam	= root.SeaRoute.ParamType.FlagParam;
	
	
	/**
	 * @name SeaRoute.Parsers.PathParser
	 */
	var PathParser = {
		
		/**
		 * @param {string} name
		 * @param {string|RegExp|string[]} value
		 * @param {{}} config
		 * @private
		 */
		_setParam: function (name, value, config)
		{
			if (is.undefined(config[name]))
			{
				config[name] = value;
				return;
			} 
			
			var param = config[name]; 
				
			if (is.string(param) || 
				param instanceof RegExp || 
				is.array(param) || 
				is.defined(config[name].value) || 
				is.defined(config[name].type))
			{
				throw new Error('Can not define parameter type both in Path ' + 
					'and in config. For parameter "' + name + '"');
			} 
			else
			{
				config[name].value = value;
			}
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}} config
		 * @private
		 */
		_simpleParam: function (name, config)
		{
			if (is.undefined(config[name]))
			{
				config[name] = {};
			}
		},

		/**
		 * @param {string} name
		 * @param {{}} config
		 * @private
		 */
		_flagParameter: function (name, config)
		{
			config[name] = new FlagParam(name);
		},

		/**
		 * @param {string} name
		 * @param {string} regex
		 * @param {{}} config
		 * @private
		 */
		_regexParam: function (name, regex, config)
		{
			var lastIndex = regex.lastIndexOf('/');
			
			if (lastIndex <= 1)
			{
				throw new Error('Invalid regex expresion: "' + regex + '"');
			}
			
			var exp = regex.substr(1, lastIndex - 1);
			var flags = regex.substr(lastIndex + 1);
			
			this._setParam(name, new RegExp(exp, flags), config);
		},

		/**
		 * @param {string} name
		 * @param {string} valuesString
		 * @param {{}} config
		 * @private
		 */
		_arrayParam: function (name, valuesString, config)
		{
			if (valuesString[valuesString.length - 1] !== ')')
			{
				throw new Error('Invalid array config for parameter named "' + name + '"');
			}
			
			this._setParam(name, valuesString.substr(1, valuesString.length - 2).split('|'), config);
		},

		/**
		 * @param {string} name
		 * @param {string} predefined
		 * @param {{}} config
		 * @param {{}} predefinedCollection
		 * @private
		 */
		_predefinedParam: function (name, predefined, config, predefinedCollection)
		{
			if (predefined[predefined.length - 1] !== ']')
			{
				throw new Error('Invalid array config for parameter named "' + name + '"');
			}
			
			predefined = predefined.substr(1, predefined.length - 2);
			
			if (is.undefined(predefinedCollection[predefined]))
			{
				throw new Error('There is no predefined parameter named "' + predefined + '"');
			}
			
			this._setParam(name, predefinedCollection[predefined], config);
		},
		
		/**
		 * @param {string} path
		 * @return {string[]}
		 * @private
		 */
		_getParameterParts: function (path)
		{
			var params = [];
			var offset = 0;
			var firstIndex;
			var lastIndex;
			
			while (offset < path.length)
			{
				firstIndex	= path.indexOf('{', offset);
				lastIndex	= path.indexOf('}', offset);
				
				if (firstIndex === -1 || lastIndex === -1)
					break;
				
				params.push(path.substr(firstIndex + 1, lastIndex - firstIndex - 1));
				offset = lastIndex + 1;
			}
			
			return params;
		},

		/**
		 * @param {string} param
		 * @param {{}} config
		 * @param {{}} preDefinedParams
		 * @private
		 */
		_parseParam: function (param, config, preDefinedParams)
		{
			var pipelineIndex = param.indexOf('|');
			var name;
			var value;
			
			if (param[0] === '?')
			{
				if (param.length === 1)
					throw new Error('Parameter name not provided');	
				
				this._flagParameter(param.substr(1), config);
				return;
			}
			
			// Simple parameter
			if (pipelineIndex === -1)
			{
				this._simpleParam(param, config);
				return;
			}
			else if (pipelineIndex === param.length - 1 && pipelineIndex > 0)
			{
				this._simpleParam(param.substr(0, param.length - 1), config);
				return;
			}
			
			name = param.substr(0, pipelineIndex);
			value = param.substr(pipelineIndex + 1);
			
			if (name.length === 0)
			{
				throw new Error('Parameter name not provided');		
			}
			// Regex
			else if (value[0] === '/')
			{
				this._regexParam(name, value, config);
			}
			// Array selection
			else if (value[0] === '(')
			{
				this._arrayParam(name, value, config);
			}
			// Predefined param
			else if (value[0] === '[')
			{
				this._predefinedParam(name, value, config, preDefinedParams);
			}
			// Wildcard
			else
			{
				this._setParam(name, value, config);
			}
		},
		
		
		/**
		 * @param {string} path
		 * @param {{}} config
		 * @param {{}} preDefinedParams
		 */
		parse: function (path, config, preDefinedParams)
		{
			var pathParams = this._getParameterParts(path);
			
			array.forEach(pathParams, function (param)
			{
				PathParser._parseParam(param, config, preDefinedParams);
			});
		}
	};
	
	
	this.PathParser = classify(PathParser);
});
namespace('SeaRoute.Route', function(root)
{
	var Query	= root.SeaRoute.Route.Query;
	
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @class SeaRoute.Route.Route
	 * 
	 * @param {SeaRoute.Route.Path} path
	 * @param {function(*)} handler
	 * 
	 * @property {SeaRoute.Route.Path}	_path
	 * @property {SeaRoute.Route.Query}	_query
	 * @property {function(*)}			_handler
	 */
	var Route = function (path, handler)
	{
		this._query		= new Query();
		this._path		= path;
		this._handler	= handler;
	};
	
	
	/**
	 * @return {SeaRoute.Route.Path}
	 */
	Route.prototype.path = function ()
	{
		return this._path;
	};
	
	/**
	 * @return {string}
	 */
	Route.prototype.pathText = function ()
	{
		return this._path.text();
	};
	
	/**
	 * @param {SeaRoute.ParamType.Param[]|SeaRoute.ParamType.Param} params
	 * @return {SeaRoute.Route.Route}
	 */
	Route.prototype.addQueryParam = function (params)
	{
		this._query.add(params);
		return this;
	};
	
	/**
	 * @return {boolean}
	 */
	Route.prototype.hasQueryParams = function ()
	{ 
		return !this._query.isEmpty();
	};
	
	
	/**
	 * @param {string[]} rawPath
	 * @return {boolean}
	 */
	Route.prototype.isMatching = function (rawPath)
	{
		return this._path.isMatching(rawPath);
	};
	
	/**
	 * @param {string[]} rawPath
	 * @param {*} rawQuery
	 */
	Route.prototype.handle = function (rawPath, rawQuery)
	{
		var params = this._path.extract(rawPath);
		var queryParams = this._query.parseQuery(rawQuery);
		
		foreach.pair(queryParams, function(name, value)
		{
			if (!params.hasOwnProperty(name))
			{
				params[name] = value;
			}
		});
		
		this._handler(params);
	};
	
	/**
	 * @param {*} params
	 * @return {string}
	 */
	Route.prototype.buildPath = function (params) {
		var path		= this._path.encode(params);
		var query		= this._query.parseParameters(params);
		var queryParts	= [];
		
		if (is(query))
		{
			foreach.pair(query, function (name, value)
			{ 
				queryParts.push(name + '=' + encodeURIComponent(value))
			});
			
			path += '?' + queryParts.join('&');
		}
		
		return path;
	};
	
	/**
	 * @return {[string]}
	 */
	Route.prototype.paramNames = function ()
	{
		return this._path.paramNames().concat(this._query.paramNames());
	};
	
	
	this.Route = Route;
});
namespace('Duct', function (root)
{
	var Trigger			= root.Duct.Trigger;
	var Listener		= root.Duct.Listener;
	var EventDebug		= root.Duct.Debug.EventDebug;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var foreach		= root.Plankton.foreach;
	
	var classify	= root.Classy.classify;
	
	
	/**
	 * @template T
	 * 
	 * @constructor
	 * @class Duct.Event
	 * 
	 * @property {Array<T>} _callbacks
	 * @property {string} _name
	 * @property {function(err)} _errorHandler
	 * 
	 * @param {string=} name
	 * @param {EventDebug=} debug
	 */
	function Event(name, debug)
	{
		classify(this);
		
		this._callbacks	= [];
		this._name		= name || '';
		this._debug		= debug || Event.DEFAULT_DEBUG;
		this._trigger	= this._defaultTrigger;
		this._listener	= new Listener(this);
		
		this._errorHandler = function(err)
		{
			console.error('Error when executing event ' + this._name, err);
		};
	}
	
	
	/**
	 * 
	 * @param {array} callbacks
	 * @param {array} callbackArgs
	 * @private
	 */
	Event.prototype._defaultTrigger = function (callbacks, callbackArgs)
	{
		foreach(callbacks, 
			function(callback)
			{
				this._triggerCallback(callback, callbackArgs);
			}, 
			this);
	};
	
	/**
	 * @param {Function} callback
	 * @param {Array} callbackArgs
	 * @private
	 */
	Event.prototype._triggerCallback = function (callback, callbackArgs)
	{
		if (this._callbacks === null) return;
		
		var wrappedCallback = func.safe(callback, this._errorHandler); 
		wrappedCallback.apply(null, callbackArgs);
	};
	
	/**
	 * @param {callback} original
	 * @param {callback} bound
	 * @private
	 */
	Event.prototype._onUnbindLT = function (original, bound)
	{
		this.remove(bound);
	};
	
	
	/**
	 * @returns {string}
	 */
	Event.prototype.name = function ()
	{
		return this._name;
	};
	
	/**
	 * @param {function(err)} handler
	 */
	Event.prototype.setErrorHandler = function (handler)
	{
		this._errorHandler = handler;
	};
	
	Event.prototype.clear = function ()
	{
		if (this._callbacks !== null)
			this._callbacks = [];
	};
	
	/**
	 * @template T
	 * @param {T|*} item
	 * @param {T=undefined} callback
	 * @return {Event}
	 */
	Event.prototype.add = function (item, callback)
	{
		if (this._callbacks === null) return this;
		
		if (is.function(callback))
		{
			var lt = LifeBindFactory.instance().get(item);
			var bound = lt.bindToLife(callback, this._onUnbindLT);
			this._callbacks.push(bound);
		}
		else 
		{
			this._callbacks.push(item);
		}
		
		return this;
	};
	
	/**
	 * @template T
	 * @param {T|*} item
	 * @param {T=undefined} callback
	 * @return {Event}
	 */
	Event.prototype.remove = function (item, callback)
	{
		if (this._callbacks === null) return this;
		
		if (is.function(callback))
		{
			LifeBindFactory.instance().get(item).unbind(callback);
			return this;
		}
		
		var index = this._callbacks.indexOf(item);
		
		if (index >= 0)
		{
			this._callbacks.splice(index, 1);
		}
		
		return this;
	};
	
	/**
	 * @returns {Number}
	 */
	Event.prototype.count = function ()
	{
		return this._callbacks.length;
	};
	
	/**
	 * @template T
	 * @type T
	 */
	Event.prototype.trigger = function()
	{
		if (this._callbacks === null) return this;
		
		var callbackArgs = [].slice.apply(arguments);
		
		this._debug.onTrigger(this, callbackArgs);
		this._trigger(this._callbacks.concat(), callbackArgs);
	};
	
	/**
	 * @param {Function} triggerCallback
	 */
	Event.prototype.addTrigger = function (triggerCallback)
	{
		var next = this._trigger;
		this._trigger = function (callbacks, args) { triggerCallback(callbacks, args, next); };
	};
	
	/**
	 * @param {boolean=false} triggerOnly If true, only the trigger called asynchonisuly, but all of the handlers,
	 * called one after another.
	 */
	Event.prototype.async = function (triggerOnly)
	{
		if (triggerOnly === true)
			this.addTrigger(Trigger.asyncTrigger);
		else
			this.addTrigger(Trigger.asyncHandle);
	};
	
	/**
	 * @return {boolean}
	 */
	Event.prototype.isDestroyed = function ()
	{
		return this._callbacks === null;
	};
	
	Event.prototype.destroy = function ()
	{
		this._callbacks = null;
	};
	
	/**
	 * @template T
	 * @param {T|*=} item
	 * @param {T=undefined} callback
	 * @return {Listener}
	 */
	Event.prototype.listener = function(item, callback)
	{
		if (is(item))
			this._listener.add(item, callback);
		
		return this._listener;
	};
	
	
	Event.DEFAULT_DEBUG = new EventDebug();
	
	
	this.Event = Event;
});
namespace('Oyster.Routing', function (root)
{
	var is		= root.Plankton.is;
	var func	= root.Plankton.func;
	
	var Route		= root.SeaRoute.Route.Route;
	var ActionRoute	= root.Oyster.Routing.ActionRoute;
	
	
	/**
	 * @name {Oyster.Routing.Navigator}
	 * @alias {Navigator}
	 * 
	 * @property {SeaRoute.Router} _router
	 * @property {function} _navigationOrder
	 * 
	 * @param {SeaRoute.Router} router
	 * 
	 * @constructor
	 */
	function Navigator(router)
	{
		this._router = router;
		this._navigationOrder = null;	
	}
	
	
	Navigator.prototype._getRouterTarget = function (target)
	{
		if (is.string(target) || target instanceof Route)
		{
			return target;
		}
		else if (target instanceof ActionRoute)
		{
			return target.route();
		}
		else if (is.object(target) && is(target['$']) && target['$'] instanceof ActionRoute)
		{
			return target['$'].route();
		}
		else 
		{
			console.error('Invalid target: ', target);
			throw Error('Invalid target supplied');
		}
	};
	
	/**
	 * @param {*} target
	 * @param {{}} params
	 * @private
	 */
	Navigator.prototype._goto = function (target, params)
	{
		target = this._getRouterTarget(target);
		this._router.navigate(target, params);
	};
	
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 * @return {Promise}
	 */
	Navigator.prototype.goto = function (target, params)
	{
		this._navigationOrder = (function() { this._goto(target, params); }).bind(this);
		
		return func.async.do((function () 
			{
				if (this._navigationOrder === null) return;
				
				var order = this._navigationOrder;
				this._navigationOrder = null;
				
				order();
			})
			.bind(this));
	};
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 * @return {string}
	 */
	Navigator.prototype.link = function (target, params)
	{
		target = this._getRouterTarget(target);
		return this._router.link(target, params);
	};
	
	
	this.Navigator = Navigator;
});
namespace('SeaRoute.Parsers', function(root)
{
	var Param			= root.SeaRoute.ParamType.Param;
	var IntParam		= root.SeaRoute.ParamType.IntParam;
	var NumberParam		= root.SeaRoute.ParamType.NumberParam;
	var OneOfParam		= root.SeaRoute.ParamType.OneOfParam;
	var RegexParam		= root.SeaRoute.ParamType.RegexParam;
	var JsonParam		= root.SeaRoute.ParamType.JsonParam;
	var WildcardParam	= root.SeaRoute.ParamType.WildcardParam;
	
	var PredefinedParamDecorator	= root.SeaRoute.ParamType.PredefinedParamDecorator;
	
	
	var is			= root.Plankton.is;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.Parsers.ParamParser
	 */
	var ParamParser = {
		FLAGS:
		{
			DEFAULT_VALUE:	'def',
			AUTO_FILL:		'fill',
			OPTIONAL:		'optional',
			VALUE:			'value',
			TYPE:			'type'
		},
		
		TYPES:
		{
			INT:		'int',
			ARRAY:		'array',
			REGEX:		'regex',
			JSON:		'json',
			WILDCARD:	'wildcard'
		},
		
		CREATORS:
		{
			'num': 			'_createNumberParam',
			'number':		'_createNumberParam',
			
			'enum': 		'_createOneOfParam',
			'array': 		'_createOneOfParam',
			
			'int': 			'_createIntParam',
			'regex': 		'_createRegexParam',
			'json': 		'_createJsonParam',
			
			'wild': 		'_createWildcardParam',
			'wildcard': 	'_createWildcardParam',
		},
		
		
		_setMinMax: function (param, config)
		{
			if (is.defined(config.min) && is.number(config.min))
				param.setMin(config.min);
			
			if (is.defined(config.max) && is.number(config.max))
				param.setMax(config.max);
			
			return param;
		},
		
		
		_createNumberParam: function (name, config)
		{
			var param = new NumberParam(name);
			return ParamParser._setMinMax(param, config);
		},
		
		_createIntParam: function (name, config)
		{
			var param = new IntParam(name);
			return ParamParser._setMinMax(param, config);
		},
		
		_createOneOfParam: function (name, config)
		{
			if (!is.array.notEmpty(config.values))
			{
				throw new Error('The config "values" is required for param of type "array" and must be an Array of strings'); 
			}
			
			return new OneOfParam(name, config.values);
		},
		
		_createRegexParam: function (name, config)
		{
			if (is.undefined(config.regex) || !(config.regex instanceof RegExp))
			{
				throw new Error('The config "regex" is required for param of type "regex" and must be a RegExp object'); 
			}
			
			return new RegexParam(name, config.regex);
		},
		
		_createJsonParam: function (name)
		{
			return new JsonParam(name);
		},
		
		_createWildcardParam: function (name, config)
		{
			if (!is.string(config.exp))
			{
				throw new Error('The config "exp" is required for param of type "wildcard" and must be a string'); 
			}
			
			return new WildcardParam(name, config.exp);
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} config
		 * @return {SeaRoute.ParamType.Param}
		 * @private
		 */
		_createByType: function (name, config)
		{
			if (!is.defined(config[this.FLAGS.TYPE]))
			{
				return new Param(name);
			}
			
			var type = config[this.FLAGS.TYPE];
			
			if (is.undefined(this.CREATORS[type]))
			{
				throw 'Invalid type ' + type;
			}
			
			return (this[this.CREATORS[type]])(name, config);
		},

		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} config
		 * @return {SeaRoute.ParamType.Param}
		 * @private
		 */
		_createParam: function (name, config)
		{
			if (is.array(config))
			{
				return new OneOfParam(name, config);
			}
			else if (is.string(config))
			{
				return new RegexParam(name, new RegExp(config.replace('*', '.*')));
			}
			else if (config instanceof Param)
			{
				return new PredefinedParamDecorator(name, config);
			}
			else if (config instanceof RegExp)
			{
				return new RegexParam(name, config);
			}
			else if (!is.object(config))
			{
				throw new Error('Unexpected route config for ' + name + ', got ' + JSON.stringify(config));
			}
			else if (is.defined(config[this.FLAGS.VALUE]))
			{
				return this._createParam(name, config[this.FLAGS.VALUE]);
			}
			else
			{
				return this._createByType(name, config);
			}
		},
		
		/**
		 * @param {SeaRoute.ParamType.Param} prm
		 * @param {object} config
		 * @private
		 */
		_setGenericConfig: function (prm, config) {
			
			// Set default value
			if (is.defined(config[this.FLAGS.DEFAULT_VALUE]))
			{
				prm.setDefaultValue(config[this.FLAGS.DEFAULT_VALUE]);
			}
			
			// Set optional flag.
			if (is.defined(config[this.FLAGS.OPTIONAL]))
			{
				prm.setIsOptional(is(config[this.FLAGS.OPTIONAL]));
			}
			
			// Set auto fill flag.
			if (is.defined(config[this.FLAGS.AUTO_FILL]))
			{
				if (!prm.hasDefaultValue())
				{
					throw new Error(
						'Default value must be provided for a url with the "' + this.FLAGS.AUTO_FILL + '" flag');
				}
				
				prm.setIsAutoFillURL(is(config[this.FLAGS.AUTO_FILL]));
			}
		},
		
		
		/**
		 * @param {string} name
		 * @param {{}|[]|string|RegExp|SeaRoute.ParamType.Param} object
		 * @return {SeaRoute.ParamType.Param}
		 */
		parse: function (name, object)
		{
			var param = this._createParam(name, object);
			
			if (is.object(object) && !(object instanceof Param))
			{
				this._setGenericConfig(param, object);
			}
			
			
			return param;
		}
	};
	
	
	this.ParamParser = classify(ParamParser);
});
namespace('SeaRoute.Route.Utils', function(root) {
	'use strict';
	
	
	var is = root.Plankton.is;
	
	var Route		= root.SeaRoute.Route.Route;
	var MapCursor	= root.SeaRoute.Route.Utils.MapCursor;
	
	
	/**
	 * @name SeaRoute.Route.Utils.Mapper
	 */
	var Mapper = {
		
		/**
		 * @param {*} element
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithElement: function (element, cursor) {
			if (element instanceof Route) {
				return Mapper.mergeWithRoute(element, cursor);
			} else if (is.array(element)) {
				return Mapper.mergeWithArray(element, cursor);
			} else if (cursor.EOP) {
				return false;
			} else if (is.object(element)) {
				return Mapper.mergeWithMap(element, cursor);
			} else {
				throw 'Unexpected object ' + element.toString()
			}
		},
		
		/** 
		 * @param {SeaRoute.Route.Route} route
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 * @return {null|*}
		 */
		mergeWithRoute: function (route, cursor) {
			var targetCursor = new MapCursor(route);
			
			var chain;
			var chainTip;
			var result		= false;
			var currentKey	= '';
			var index		= cursor.index;
			
			if (!targetCursor.goto(cursor.index) || targetCursor.EOP) {
				return false;
			}
			
			while (targetCursor.current === cursor.current && !targetCursor.EOP && !cursor.EOP) {
				if (result === false) {
					result = {};
					chain = result;
				} else {
					chain[currentKey] = {};
					chain = chain[currentKey];
					currentKey = targetCursor.current; 
				}
				
				currentKey = targetCursor.current; 
				
				targetCursor.forward();
				cursor.forward();
			}
			
			if (targetCursor.EOP || cursor.EOP) {
				chainTip = [ route ];
				chainTip = cursor.addRoute(chainTip, cursor.route);
			} else {
				chainTip = {};
				chainTip[targetCursor.current] = route;
				chainTip[cursor.current] = cursor.route;
			}
			
			if (result !== false) {
				chain[currentKey] = chainTip;
			} else {
				result = chainTip;
			}
			
			cursor.goto(index);
			
			return (result || chainTip);
		},

		/**
		 * @param {*} map
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 */
		mergeWithMap: function (map, cursor) {
			if (!is(map[cursor.current])) {
				map[cursor.current] = cursor.route;
			} else {
				var element = map[cursor.current];
				var mergeResult;
				
				cursor.forward();
				mergeResult = Mapper.mergeWithElement(element, cursor);
				cursor.back();
				
				if (mergeResult === false) {
					mergeResult = cursor.addRoute([element], cursor.route);
				}
				
				map[cursor.current] = mergeResult;
			}
			
			return map;
		},


		/**
		 * @param {[]} set
		 * @param {SeaRoute.Route.Utils.MapCursor} cursor
		 */
		mergeWithArray: function (set, cursor) {
			var element = cursor.getCompareElement(set);
			var mergeResult = Mapper.mergeWithElement(element, cursor);
			
			if (mergeResult === false) {
				cursor.addRoute(set, cursor.route);
			} else if (mergeResult !== element) {
				set[cursor.getCompareElementIndex(set)] = mergeResult;
			}
			
			return set;
		}
	};
	
	
	this.Mapper = Mapper;
});
namespace('SeaRoute.Route.Utils', function(root) {
	'use strict';
	
	
	var is		= root.Plankton.is;
	var array	= root.Plankton.array;
	
	var Route	= root.SeaRoute.Route.Route;
	
	
	/**
	 * @name SeaRoute.Route.Utils.PathMatcher
	 */
	var PathMatcher = {

		/**
		 * @param {*} element
		 * @param {SeaRoute.Route.Utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchElement: function (element, cursor) {
			if (element instanceof Route) {
				return PathMatcher.matchRoute(element, cursor);
			} else if (is.array(element)) {
				return PathMatcher.matchArray(element, cursor);
			} else if (is.object(element)) {
				return PathMatcher.matchMap(element, cursor);
			} else {
				throw 'Unexpected element: ' + element.toString();
			}
		},
		
		/**
		 * @param {SeaRoute.Route.Route} route
		 * @param {SeaRoute.Route.Utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchRoute: function (route, cursor) {
			if (route.isMatching(cursor.rawParts)) {
				route.handle(cursor.rawParts, cursor.rawQuery);
				return true;
			}
			
			return false;
		},
		
		/**
		 * @param {[]} set
		 * @param {SeaRoute.Route.Utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchArray: function (set, cursor) {
			var result = false;
			
			array.forEach(set, function (value) {
				if (PathMatcher.matchElement(value, cursor)) {
					result = true;
					return false;
				}
			});
			
			return result;
		},
		
		/**
		 * @param {{}} map
		 * @param {SeaRoute.Route.Utils.MatchCursor} cursor
		 * @return {boolean}
		 */
		matchMap: function (map, cursor) {
			if (cursor.EOP) {
				return false;
			} else if (!is.defined(map[cursor.current])) {
				return false;
			}
			
			var element = map[cursor.current];
			
			cursor.forward();
			
			if (PathMatcher.matchElement(element, cursor)) {
				return true;
			}
			
			cursor.back();
			
			return false;
		}
	};
	
	
	this.PathMatcher = PathMatcher;
});
namespace('Duct', function (root)
{
	var inherit		= root.Classy.inherit;
	var classify	= root.Classy.classify;
	var func		= root.Plankton.func;
	
	var Event			= root.Duct.Event; 
	var Listener		= root.Duct.Listener;
	var DeadListener	= root.Duct.LT.DeadListener;
	var LifeBind		= root.Duct.LT.LifeBind;
	
	
	function LifeTime(name)
	{
		LifeBind.call(this);
		
		this._name		= name || 'Lifetime';
		this._onKill 	= this._createEvent();
		
		classify(this);
	}
	
	
	inherit(LifeTime, LifeBind);
	
	
	LifeTime.prototype._createEvent = function ()
	{
		return new Event('Destroy ' + this._name + ' Event');
	};
	
	LifeTime.prototype._invokeOnKill = function ()
	{
		var event = this._onKill;
		
		this._onKill = this._createEvent();
		event.trigger(this);
	};
	

	/**
	 * @param {function(LifeTime)=} callback
	 * @return {Duct.Listener}
	 */
	LifeTime.prototype.onKill = function (callback)
	{
		var listener;
		
		if (this.isDead())
		{
			listener = new DeadListener([this]);
		}
		else	
		{
			listener = new Listener(this._onKill);
		}
		
		if (callback)
			listener.add(callback);
		
		return listener;
	};
	
	LifeTime.prototype.clear = function ()
	{
		this._invokeOnKill();
		LifeBind.prototype.clear.call(this);
	};
	
	LifeTime.prototype.kill = function ()
	{
		if (this.isDead()) return;
		
		this._invokeOnKill();
		
		LifeBind.prototype.kill.call(this);
	};
	
	
	this.LifeTime = LifeTime;
});
namespace('Oyster.Modules.Routing.TreeActions', function (root)
{
	var classify 	= root.Classy.classify;
	
	var Event		= root.Duct.Event; 
	var Listener	= root.Duct.Listener;
	
	
	/**
	 * @class {Oyster.Modules.Routing.TreeActions.ActionEvents}
	 * @alias {ActionEvents}
	 * 
	 * @constructor
	 */
	function ActionEvents()
	{
		this._onDestroy = new Event('Action onDestroy Event');
		
		classify(this);
	}
	
	
	/**
	 * @param {Event} event
	 * @param {*|function=} callback
	 * @param {function=} item
	 * @return {Duct.Listener|*}
	 * @private
	 */
	ActionEvents.prototype._getListener = function (event, callback, item)
	{
		var listener = new Listener(event);
		
		if (callback) listener.add(callback, item);
		
		return listener;
	};
	
	
	/**
	 * @param {*|function=} callback
	 * @param {function=} item
	 * @return {Duct.Listener|*}
	 */
	ActionEvents.prototype.onDestroy = function (callback, item)
	{
		return this._getListener(this._onDestroy, callback, item);
	};
	
	
	ActionEvents.prototype.triggerDestroy = function () 
	{
		this._onDestroy.trigger();
		this._onDestroy.destroy();
	};
	
	
	this.ActionEvents = ActionEvents;
});
namespace('SeaRoute', function (root)
{
	var ParamParser = root.SeaRoute.Parsers.ParamParser;
	
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	
	/**
	 * @name SeaRoute.Route.Routes
	 */
	var Params = {

		/**
		 * @param {{}} data
		 * @return {{SeaRoute.param.Param}}
		 */
		create: function (data)
		{
			var result = {};
			var name;
				
			foreach.pair(data, function (key, value)
			{
				name = (is.string(value.name) ? value.name : key);
				result[key] = ParamParser.parse(name, value);
			});
			
			return result;
		}
	};
	
	
	this.Params = Params;
});
namespace('SeaRoute.Parsers', function(root, SeaRoute) {
	'use strict';
	
	
	var Path		= root.SeaRoute.Route.Path;
	var Part		= root.SeaRoute.Route.Part;
	var Route		= root.SeaRoute.Route.Route;
	var PathParser	= root.SeaRoute.Parsers.PathParser;
	var ParamParser	= root.SeaRoute.Parsers.ParamParser;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @name SeaRoute.Parsers.RouteParser
	 */
	var RouteParser = {
		/**
		 * @param {{}} config
		 * @param {{}} predefined
		 * @private
		 */
		_extractPathParams: function (config, predefined) {
			PathParser.parse(config.path, config.params, predefined);
		},
		
		/**
		 * @param {{}} config
		 * @return {{}}
		 * @private
		 */
		_parseParameters: function (config) {
			obj.forEach.pair(config.params, function (key, value) {
				config.params[key] = ParamParser.parse(key, value);
			});
		},
		
		/**
		 * @param {{}} config
		 * @return {SeaRoute.Route.Path}
		 * @private
		 */
		_createPath: function (config) {
			var path = new Path(config.path);
			var str = config.path.toString();
			var part;
			var name;
			var paramName;
			var index;
			var pipelineIndex;
			

			while (str.length > 0) {
				if (str[0] === '/') {
					str = str.substr(1);
				
				// Create parameter
				} else if (str[0] === '{') {
					pipelineIndex 	= str.indexOf('|');
					index			= str.indexOf('}');
					name			= str.substr(0, index + 1);
					
					if (pipelineIndex >= 0 && pipelineIndex < index)
					{
						paramName = str.substr(1, pipelineIndex - 1);
					}
					else if (index !== -1)
					{
						paramName = str.substr(1, index - 1);
					}
					else
					{
						throw new Error('Invalid path defined: ' + config.path.toString());
					}
					
					if (paramName[0] === '?') 
					{
						paramName = paramName.substr(1);	
					}
					
					part = new Part(name);
					part.setParam(config.params[paramName]);
					path.addPart(part);
					
					str = str.substr(index + 1);
				
				// Last const parameter
				} else if (str.indexOf('/') === -1) {
					path.addPart(new Part(str));
					break;
					
				// Const parameter
				} else {
					index	= str.indexOf('/');
					name	= str.substr(0, index);
					str		= str.substr(index + 1);
				
					path.addPart(new Part(name));
				}
			}
			
			return path;
		},
		
		/**
		 * @param {SeaRoute.Route.Path} path
		 * @param {{}} config
		 * @private
		 */
		_createRoute: function (path, config) {
			var route = new Route(path, config.callback);
			var allParams = {}; 
			
			obj.forEach.key(config.params, function (key) {
				allParams[key] = true;
			});
			
			array.forEach(path.parts(),
				/**
				 * @param {SeaRoute.Route.Part} part
				 */
				function (part) {
					if (!part.isConst()) {
						delete allParams[part.getParamName()];
					}
				});
			
			obj.forEach.key(allParams, function (paramName) {
				route.addQueryParam(config.params[paramName]);
			});
			
			return route;
		},
		
		/**
		 * @param {*} config
		 * @private
		 */
		_validate: function (config) {
			if (!is.string(config.path)) {
				throw 'Path not set for route';
			} else if (config.path === '' || config.path[0] !== '/') {
				config.path = '/' + config.path; 
			}
			
			if (!is.function(config.callback)) {
				throw 'Callback not set for route';
			}
			
			if (!is.object(config.params)) {
				config.params = {};
			}
		},
		
		
		/**
		 * @param {{}} config
		 * @param {{}} predefined
		 * @return {SeaRoute.Route.Route}
		 */
		parse: function (config, predefined) {
			var route;
			var path;
			
			this._validate(config);
			this._extractPathParams(config, predefined);
			this._parseParameters(config);
			path = this._createPath(config);
			route = this._createRoute(path, config);
			
			return route;
		}
	};
	
	
	this.RouteParser = classify(RouteParser);
});
namespace('Oyster', function (root)
{
	var obj			= root.Plankton.obj;
	var classify	= root.Classy.classify;
	
	var LifeTime		= root.Duct.LifeTime;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var ActionEvents = root.Oyster.Modules.Routing.TreeActions.ActionEvents;


	/**
	 * @class Oyster.Action
	 * @alias Action
	 * 
	 * @property {ActionChainLink|null} _chainLink
	 * @property {Navigator|null}		_navigator
	 * @property {{}|null}				_params
	 * 
	 * @param {Navigator=}			navigator
	 * @param {ActionChainLink=}	chainLink
	 * @constructor
	 */
	function Action(navigator, chainLink)
	{
		var self = classify(this);
		
		this._chainLink = chainLink || null;
		this._navigator	= navigator || null;
		this._params	= null;
		this._events	= new ActionEvents();
		this._lt		= new LifeTime();
		
		this._events.onDestroy(function () 
		{
			self._lt.kill();
		});
	}
	
	
	/**
	 * @returns {ActionChainLink|null}
	 */
	Action.prototype.chain = function ()
	{
		return this._chainLink;
	};
	
	/**
	 * @returns {boolean}
	 */
	Action.prototype.isMounted = function ()
	{
		return this._chainLink.isMounted();
	};
	
	/**
	 * @returns {Application}
	 */
	Action.prototype.app = function ()
	{
		return this._chainLink.app();
	};
	
	/**
	 * @returns {ActionEvents}
	 */
	Action.prototype.events = function ()
	{
		return this._events;
	};
	
	/**
	 * @returns {LifeTime|LifeBind}
	 */
	Action.prototype.LT = function ()
	{
		return this._lt;
	};
	
	/**
	 * @param {string=} name
	 * @return {ModuleManager|*}
	 */
	Action.prototype.modules = function (name)
	{
		var app = this._chainLink.app();
		return (app ? app.modules(name) : null);
	};
	
	/**
	 * @return {{}|null}
	 */
	Action.prototype.params = function ()
	{
		return obj.copy(this._params);
	};
	
	/**
	 * @param {{}} params
	 */
	Action.prototype.setParams = function (params)
	{
		this._params = params;
	};
	
	/**
	 * @param {*} target
	 * @param {{}=} params
	 */
	Action.prototype.navigate = function (target, params)
	{
		this._navigator.goto(target, params);
	};
	
	/** 
	 * @param {*} target
	 * @param {{}=} params
	 * @return {string}
	 */
	Action.prototype.linkTo = function (target, params)
	{
		return this._navigator.link(target, params);
	};
	
	/**
	 * @param {ActionChainLink} chainLink
	 */
	Action.prototype.setChainLink = function (chainLink)
	{
		this._chainLink = chainLink;
	};
	
	/**
	 * @param {Navigator} navigator
	 */
	Action.prototype.setNavigator = function (navigator)
	{
		this._navigator = navigator;
	};
	
	
	Action.lifeTimeBuilder = function (item)
	{
		return item instanceof Action ? 
			item.LT() : 
			null;
	};
	
	
	LifeBindFactory.instance().addBuilder(Action.lifeTimeBuilder);
	
	
	this.Action = Action;
});
namespace('Oyster', function (root)
{
	var LifeTime		= root.Duct.LifeTime;
	var LifeBindFactory	= root.Duct.LT.LifeBindFactory;
	
	var classify = root.Classy.classify;


	/**
	 * @class {Oyster.Module}
	 * @alias {Module}
	 * 
	 * @property {ModuleController} _controller
	 * 
	 * @constructor
	 */
	function Module()
	{
		classify(this);
		
		this._controller 	= null;
		this._lt			= new LifeTime();
	}
	
	
	/**
	 * @param {ModuleController} controller
	 */
	Module.prototype.setController = function (controller)
	{
		this._controller = controller;
	};

	/**
	 * @returns {ModuleController}
	 */
	Module.prototype.control = function ()
	{
		return this._controller;
	};
	
	/**
	 * @return {LifeTime}
	 */
	Module.prototype.LT = function ()
	{
		return this._lt;
	};
	
	/**
	 * @return {ModuleManager}
	 */
	Module.prototype.manager = function ()
	{
		return this._controller.manager();
	};
	
	/**
	 * @return {Application}
	 */
	Module.prototype.app = function ()
	{
		return this._controller.app();
	};
	
	
	Module.prototype.initialize = function () {};
	
	Module.prototype.preLoad = function () {};
	Module.prototype.onLoad = function () {};
	Module.prototype.postLoad = function () {};
	
	Module.prototype.preUnload = function () {};
	Module.prototype.onUnload = function () {};
	Module.prototype.postUnload = function () {};
	
	Module.prototype.destroy = function () {};
	
	
	Module.lifeTimeBuilder = function (item)
	{
		return item instanceof Module ? 
			item.LT() : 
			null;
	};
	
	
	LifeBindFactory.instance().addBuilder(Module.lifeTimeBuilder);
	
	
	this.Module = Module;
});
namespace('SeaRoute', function(root)
{
	var Params		= root.SeaRoute.Params;
	var Route		= root.SeaRoute.Route.Route;
	var Param		= root.SeaRoute.ParamType.Param;
	var RouteParser = root.SeaRoute.Parsers.RouteParser;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var array		= root.Plankton.array;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.RoutesBuilder
	 * 
	 * @param {{}=} predefinedParams
	 * 
	 * @property {{}} _predefinedParams
	 */
	var RoutesBuilder =  function (predefinedParams)
	{
		classify(this);
		
		this._predefinedParams = predefinedParams || {};
	};
	

	/**
	 * @param {string} name
	 * @param {SeaRoute.ParamType.Param} param
	 * @private
	 */
	RoutesBuilder.prototype._addParam = function (name, param)
	{
		if (is.defined(this._predefinedParams[name]))
			throw new Error('Parameter with name "' + param.name() + '" is already defined!');
		
		if (!(param instanceof Param))
		{
			param = Params.create({p: param}).p;
		}
		
		this._predefinedParams[name] = param;
	};


	/**
	 * @param {[]} data
	 * @return {[]}
	 * @private
	 */
	RoutesBuilder.prototype._handleArray = function (data)
	{
		var result = [];
		var self = this;
		
		array.forEach(data, function (item)
		{
			result.push(self.create(item));
		});
		
		return result;
	};

	/**
	 * @param {string} path
	 * @param {*} b
	 * @param {*} c
	 * @return {Route}
	 * @private
	 */
	RoutesBuilder.prototype._handleSingleRouteFromParams = function (path, b, c)
	{
		var obj = { path: path };
		
		if (is.function(b))
		{
			obj.callback = b;
		}
		else if (is.function(c))
		{
			obj.callback = c;
		}
		else if (!is.object(b) || !is.function(b.callback))
		{
			throw new Error('Callback must be set!');
		}
		else
		{
			if (is.defined(b.params))
			{
				obj.params = b.params;
			}
			
			obj.callback = b.callback;
		}
		
		return this.create(obj);
	};

	/**
	 * 
	 * @param {{}} data
	 * @param {function} callback
	 * @return {{Route}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromObjectAndCallback = function (data, callback)
	{
		if (!is.string(data.path))
			throw new Error('Path must be set!');
		
		return this.create({
			path:		data.path,
			params:		data.params || {},
			callback:	callback
		});
	};
	
	/**
	 * 
	 * @param {{}} data
	 * @return {{}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromMap = function (data)
	{
		var result = {};
		var self = this;
		
		obj.forEach.pair(data, function (key, value)
		{
			if (is.function(value.callback) && !is.string(value.path))
			{
				value.path = key;
			}
			
			result[key] = self.create(value);
		});
		
		return result;
	};

	/**
	 * @param {*} data
	 * @param {function=} b
	 * @return {Route[]|{Route}}
	 * @private
	 */
	RoutesBuilder.prototype._handleFromObject = function (data, b)
	{
		if (is.function(b))
		{
			return this._handleFromObjectAndCallback(data, b);
		}
		else if (is.function(data.callback))
		{
			return RouteParser.parse(data, this._predefinedParams);
		}
		else
		{
			return this._handleFromMap(data);
		}
	};


	/**
	 * @param {string|{}|[]} a
	 * @param {*=} b
	 * @param {*=} c
	 * @return {[Route]|{Route}|Route}
	 */
	RoutesBuilder.prototype.create = function (a, b, c)
	{
		// Single route.
		if (a instanceof Route)
		{
			return a;
		}
		// Array of elements.
		else if (is.array(a))
		{
			return this._handleArray(a);
		}
		// First parameter is path.
		else if (is.string(a))
		{
			return this._handleSingleRouteFromParams(a, b, c);
		}
		// First parameter is object.
		else if (is.object(a))
		{
			return this._handleFromObject(a, b);
		}
		// Else it's an error
		else
		{
			throw new Error('Unexpected parameter passed!');
		}
	};

	/**
	 * @param {SeaRoute.ParamType.Param|{SeaRoute.ParamType.Param}} params
	 */
	RoutesBuilder.prototype.addParams = function (params)
	{
		if (params instanceof Param)
		{
			this._addParam(params.name(), params);
		}
		else
		{
			obj.forEach.pair(params, function (key, param)
			{
				this._addParam(key, param);
			}, this);
		}
	};
	
	
	this.RoutesBuilder = RoutesBuilder;
}); 
namespace('Oyster.Modules', function (root)
{
	var inherit = root.Classy.inherit;
	
	var Module			= root.Oyster.Module;
	var OysterModules	= root.Oyster.Modules.OysterModules;
	

	/**
	 * @name {Oyster.Modules.BaseNavigationModule}
	 * @alias {BaseNavigationModule}
	 * 
	 * @extends {Oyster.Module}
	 */
	function BaseNavigationModule()
	{
		
	}
	
	
	inherit(BaseNavigationModule, Module);
	
	
	BaseNavigationModule.prototype.navigate = function (url) {};
	BaseNavigationModule.prototype.handleMiss = function (url) {};
	
	
	BaseNavigationModule.moduleName = function () { return OysterModules.NavigationModule; };
	BaseNavigationModule.prototype.moduleName = BaseNavigationModule.moduleName;
	
	
	this.BaseNavigationModule = BaseNavigationModule;
});
namespace('Oyster.Modules', function (root)
{
	var inherit = root.Classy.inherit;
	
	var Module			= root.Oyster.Module;
	var OysterModules	= root.Oyster.Modules.OysterModules;
	

	/**
	 * @name {Oyster.Modules.BaseRoutingModule}
	 * @alias {BaseRoutingModule}
	 * 
	 * @extends {Oyster.Module}
	 */
	function BaseRoutingModule()
	{
		
	}
	
	
	inherit(BaseRoutingModule, Module);
	
	
	BaseRoutingModule.prototype.handleURL = function (url) {};
	
	/**
	 * @param {*} params
	 */
	BaseRoutingModule.prototype.setupPredefinedParams = function (params) {};
	
	/**
	 * @param {*} config
	 */
	BaseRoutingModule.prototype.setupRoutes = function (config) {};
	
	
	BaseRoutingModule.moduleName = function () { return OysterModules.RoutingModule; };
	BaseRoutingModule.prototype.moduleName = BaseRoutingModule.moduleName;
	
	
	this.BaseRoutingModule = BaseRoutingModule;
});
namespace('Oyster.Modules.Utils', function (root)
{
	var is		= root.Plankton.is;
	var foreach	= root.Plankton.foreach;
	
	var Module				= root.Oyster.Module;
	var ModuleController	= root.Oyster.Modules.Utils.ModuleController;
	

	/**
	 * @name {Oyster.Modules.Utils.ModuleBuilder}
	 * @alias {ModuleBuilder}
	 */
	var ModuleBuilder = {

		/**
		 * @param {*} a
		 * @param {*=} b
		 * @returns {string}
		 * @private
		 */
		_extractName: function (a, b)
		{
			var name;
			
			if (is.string(a))
			{
				return a;
			}
			
			if (is(a['moduleName']))
			{
				if (is.string(a['moduleName']))
				{
					return a['moduleName'];
				}
				else if (is.function(a['moduleName']))
				{
					name = a['moduleName']();
					
					if (is.string(name))
					{
						return name;
					}
				}
			}
			else if (is(a.constructor) && is(a.constructor.moduleName))
			{
				if (is.string(a.constructor.moduleName))
				{
					return a.constructor.moduleName;
				}
				else if (is.function(a.constructor.moduleName))
				{
					name = a.constructor.moduleName();
					
					if (is.string(name))
					{
						return name;
					}
				}
			}
			
			if (is(b))
			{
				try 
				{
					return ModuleBuilder._extractName(b);
				}
				catch (e)
				{
					throw new Error('Could not determine name for module ' + a + ' with definition ' + b);
				}
			}
			
			throw new Error('Could not determine name for module ' + a);
		},
		
		/**
		 * @param {Application} app
		 * @param {string|Module|function|{}|[]} main
		 * @param {string|Module|function=} extra
		 * 
		 * @returns {Module|[]}
		 */
		get: function (app, main, extra)
		{
			var module = null;
			var name;
			
			if (is.array(main))
			{
				module = [];
				
				foreach(main, function (item) 
				{
					module = module.concat(ModuleBuilder.get(app, item));
				});
			}
			else if (is.string(main))
			{
				if (is.function(extra))
				{
					module = new extra();
				}
				else if (extra instanceof Module)
				{
					module = extra;
				}
				else
				{
					throw new Error('Unexpected type passed');
				}
				
				module.setController(new ModuleController(app, main));
			}
			else if (is.function(main))
			{
				module = new main();
				
				name = ModuleBuilder._extractName(module, main);
				module.setController(new ModuleController(app, name));
			}
			else if (main instanceof Module)
			{
				module = main;
				
				name = ModuleBuilder._extractName(module);
				module.setController(new ModuleController(app, name));
			}
			else if (is.object(main))
			{
				module = [];
				
				foreach.pair(main, function (name, item) 
				{
					module.push(ModuleBuilder.get(app, name, item));
				});
			}
			
			if (!is(module))
			{
				throw new Error('Unexpected type passed');
			}
			
			return module;
		}
	};
	
	
	this.ModuleBuilder = ModuleBuilder;
});
namespace('Oyster.Routing', function (root)
{
	var obj				= root.Plankton.obj;
	var foreach			= root.Plankton.foreach;
	
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var ActionRoute		= root.Oyster.Routing.ActionRoute;
	
	
	/**
	 * @name {Oyster.Routing.ParsingCursor}
	 * @alias ParsingCursor
	 * 
	 * 
	 * @property {[callback]}	_actions
	 * @property {[string]}		_pathParts
	 * @property {[{}]}			_paramsConfig
	 * 
	 * @property {TreeActionsModule}	_manager
	 * @property {SeaRoute.RoutesBuilder}	_builder
	 * 
	 * @param {TreeActionsModule}		manager
	 * @param {SeaRoute.RoutesBuilder=}	builder
	 * @constructor
	 */
	function ParsingCursor(manager, builder)
	{
		this._builder	= builder || (new RoutesBuilder()); 
		this._manager	= manager;
		
		this._actions		= [];
		this._paramNames	= [];
		this._pathParts		= [];
		this._paramsConfig	= [];
	}
	
	
	/**
	 * @param {SeaRoute.Route.Route} route
	 * @return {ActionRoute}
	 * @private
	 */
	ParsingCursor.prototype._createActionRoute = function (route) 
	{
		var actionRoute = new ActionRoute();
		var actions = [];
		
		foreach (this._actions, function (item)
		{
			if (item !== null) actions.push(item);
		});
		
		actionRoute.setActions(actions, this._paramNames.concat());
		actionRoute.setRoute(route);
		
		return actionRoute;
	};
	
	/**
	 * @return {string}
	 */
	ParsingCursor.prototype._getPath = function ()
	{
		var path = '';
		
		foreach(this._pathParts, function (item)
		{
			if (item.length === 0 || item === '/')
				return;
			
			if (item[0] === '/')
				item = item.slice(1);
			
			if (item[item.length - 1] === '/')
				item = item.slice(0, item.length - 1);
				
			path += '/' + item;
		});
		
		return (path.length > 0 ? path : '/');
	};
	
	/**
	 * @return {{}}
	 */
	ParsingCursor.prototype._getParams = function ()
	{
		var res = {};
		
		foreach(this._paramsConfig, function (item)
		{
			obj.mix(res, item);
		});
		
		return res;
	};
	
	
	/**
	 * @param {{action: *, path: *, ...}} config
	 * @param {boolean=false} isPartial
	 * @return {ActionRoute}
	 */
	ParsingCursor.prototype.parseRouteConfig = function (config, isPartial)
	{
		isPartial = isPartial || false;
		
		var route;
		var action;
		var manager = this._manager;
		var routeConfig = obj.copy(config);
		
		// Push action and path.
		this._actions.push(routeConfig.action || null);
		this._pathParts.push(routeConfig.path || '');
		this._paramsConfig.push(routeConfig.params || {});
		
		// Setup the config that will be passed to the routes builder
		delete(routeConfig.action);
		
		routeConfig.path		= this._getPath();
		routeConfig.params		= this._getParams();
		routeConfig.callback	= function (params) { manager.handle(action, params); };
		
		// Create the route and push it to the top of the stack. This will extract the route parameters.
		route = this._builder.create(routeConfig);
		this._paramNames.push(route.paramNames());
		
		if (!isPartial)
			this._manager.router().appendRoutes(route);
		
		// Set the variable 'action' so that it's used in the callback.
		action = this._createActionRoute(route);
		return action;
	};
	
	ParsingCursor.prototype.pop = function ()
	{
		this._actions.pop();
		this._paramNames.pop();
		this._paramsConfig.pop();
		this._pathParts.pop();
	};
	
	
	this.ParsingCursor = ParsingCursor;
});
namespace('SeaRoute', function(root)
{
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	var Route			= root.SeaRoute.Route.Route;
	var Mapper			= root.SeaRoute.Route.Utils.Mapper;
	var MapCursor		= root.SeaRoute.Route.Utils.MapCursor;
	var PathMatcher		= root.SeaRoute.Route.Utils.PathMatcher;
	var MatchCursor		= root.SeaRoute.Route.Utils.MatchCursor;
	
	var is			= root.Plankton.is;
	var obj			= root.Plankton.obj;
	var url			= root.Plankton.url;
	var classify	= root.Classy.classify;
	
	
	/**
	 * @class SeaRoute.Router
	 * 
	 * @param {function(string)}	navigateCallback
	 * @param {function(string)=}	missHandler
	 * 
	 * @property {SeaRoute.RoutesBuilder}	_builder
	 * @property {function(string)}			_navigate
	 * @property {function(string)}			_onMiss
	 * @property {[]}						_map
	 */
	var Router =  function (navigateCallback, missHandler) {
		this._map		= [];
		this._builder	= new RoutesBuilder();
		this._navigate	= navigateCallback;
		this._onMiss	= missHandler || Router._defaultOnMiss;
		
		classify(this);
	};
	

	/**
	 * @param {*|SeaRoute.Route.Route} routes
	 * @param {*} cursorCreator
	 * @private
	 */
	Router.prototype._addRoutes = function (routes, cursorCreator) {
		var self = this;
		
		if (routes instanceof Route) {
			if (this._map.length === 0) {
				this._map.push(routes);
			} else {
				Mapper.mergeWithArray(this._map, cursorCreator(routes));
			}
		} else {
			obj.forEach(routes, function (item) {
				self._addRoutes(item, cursorCreator);
			});
		}
	};


	/**
	 * @param {{}} params
	 * @return {SeaRoute.Router}
	 */
	Router.prototype.addParams = function (params) {
		this._builder.addParams(params);
		return this;
	};
	
	Router.prototype.appendRoutes = function (routes) {
		routes = this._builder.create(routes);
		this._addRoutes(routes, MapCursor.createAppendCursor);
	};

	/**
	 * @param {SeaRoute.Route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.link = function (target, params) {
		params = params || {};
		
		if (is.string(target)) {
			return url.encode(target, params);
		} else if (target instanceof Route) {
			return target.buildPath(params);
		} else {
			throw new Error('Target must be Route or string!');
		}
	};
	
	/**
	 * @param {SeaRoute.Route.Route|string} target
	 * @param {{}=} params
	 */
	Router.prototype.navigate = function (target, params) {
		this._navigate(this.link(target, params));
	};

	/**
	 * @param {string} url
	 */
	Router.prototype.handle = function (url) {
		if (!PathMatcher.matchArray(this._map, new MatchCursor(url))) {
			this._onMiss(url);
		}
	};
	
	
	/**
	 * @param {string} url
	 * @private
	 */
	Router._defaultOnMiss = function (url) {
		throw new Error('There is no route matching ' + url.toString() + ' url');
	};
	
	
	this.Router = Router;
}); 
namespace('Space.Actions', function (window) 
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function RootAction() { Action.call(this); classify(this); }
	inherit(RootAction, Action);


	RootAction.prototype.initialize = function ()
	{
		this._viewModule = this.modules('ViewModule');
	};
	
	RootAction.prototype.activate = function ()
	{
		console.log(123);
	};
	
	RootAction.prototype.refresh = function ()
	{
		
	};
	
	RootAction.prototype.update = function ()
	{
		
	};
	
	RootAction.prototype.execute = function ()
	{
		
	};
	
	RootAction.prototype.preDestroy = function ()
	{
		
	};
	
	RootAction.prototype.destroy = function ()
	{
		
	};
	
	
	this.RootAction = RootAction;
});
namespace('Space.Modules', function (window) 
{
	var Module		= window.Oyster.Module;
	
	var inherit     = window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	function ViewModule() { classify(this); }
	
	
	inherit(ViewModule, Module);
	ViewModule.moduleName = 'ViewModule';
	

	ViewModule.prototype.getTemplate = function (templateDir, templateName)
	{
		return window.Handlebars['template'][templateDir][templateName];
	};
	
	ViewModule.prototype.getPartialTemplate = function (partialName)
	{
		return window.Handlebars['partials'][partialName];
	};

	ViewModule.prototype.getTemplateFunction = function (templateDir, templateName)
	{
		return this.getTemplate(templateDir, templateName).hbs;
	};
	
	ViewModule.prototype.get = function (templateDir, templateName, params)
	{
		var options = params || {};

		return this.getTemplate(templateDir, templateName).hbs(options);
	};
	
	ViewModule.prototype.getPartial = function (partialName, params)
	{
		var options = params || {};
		
		return this.getPartialTemplate(partialName)(options);
	};

	ViewModule.prototype.render = function ($container, templateDir, templateName, params)
	{
		$container.empty().append(this.get(templateDir, templateName, params));
	};

	ViewModule.prototype.prepend = function ($container, templateDir, templateName, params)
	{
		$container.prepend(this.get(templateDir, templateName, params));
	};

	ViewModule.prototype.append = function ($container, templateDir, templateName, params)
	{
		$container.append(this.get(templateDir, templateName, params));
	};
	
	
	
	this.ViewModule = ViewModule;
});
namespace('Oyster', function (root)
{
	var classify 	= root.Classy.classify;
	
	var is			= root.Plankton.is;
	var func		= root.Plankton.func;
	var array		= root.Plankton.array;
	var foreach		= root.Plankton.foreach;
	
	var Loader			= root.Oyster.Modules.Utils.Loader;
	var ModuleBuilder	= root.Oyster.Modules.Utils.ModuleBuilder;
	
	
	/**
	 * @class {Oyster.ModuleManager}
	 * @alias {ModuleManager}
	 * 
	 * @param {Application} app
	 * 
	 * @property {Application}	_app
	 * @property {Loader}		_loader
	 * @property {*}			_modules
	 * 
	 * @constructor
	 */
	function ModuleManager(app)
	{
		classify(this);
		
		this._app		= app;
		this._modules	= {};
		this._loader	= new Loader(this._register, this._deRegister, this._invokeOnComplete);
		
		this._onCompleteCallbacks = [];
	}
	
	/**
	 * @param {*} element
	 * @return {string}
	 * @private
	 */
	ModuleManager.prototype._extractName = function (element)
	{
		if (is.string(element)) return element;
		else if (is.string(element.moduleName)) return element.moduleName;
		else if (is.function(element.moduleName)) return element.moduleName();
		else return element.toString();
	};
	
	/**
	 * @param {Module} module
	 * @private
	 */
	ModuleManager.prototype._register = function (module)
	{
		var name = module.control().name();
		
		if (is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is already registered!');
		
		this._modules[name] = module;
	};
	
	/**
	 * @param {Module} module
	 * @private
	 */
	ModuleManager.prototype._deRegister = function (module)
	{
		var name = module.control().name();
		
		if (!is(this._modules[name]))
			throw new Error('Module with the name ' + name + ' is not registered!');
		
		delete this._modules[name];
	};
	
	ModuleManager.prototype._invokeOnComplete = function ()
	{
		var callbacks = this._onCompleteCallbacks.concat();
		
		this._onCompleteCallbacks = [];
		
		foreach(callbacks, function (callback) { callback(); });
	};
	
	
	/**
	 * @param {Module|string} module
	 * @returns {ModuleManager}
	 */
	ModuleManager.prototype.remove = function (module)
	{
		if (is.string(module))
		{
			if (!is(this._modules[module]))
			{
				throw new Error('Module with the name ' + module + ' is not registered!');
			}
			
			module = this._modules[module];
		}
		
		this._loader.unload(module);
		return this;
	};

	/**
	 * @param {string|Module|function|{}|[]} target
	 * @param {string|Module|function=} extra
	 */
	ModuleManager.prototype.add = function (target, extra)
	{
		target = ModuleBuilder.get(this._app, target, extra);
		target = array(target);
		
		this._loader.load(target);
	};

	/**
	 * @param {string} name
	 * @returns {Module|null}
	 */
	ModuleManager.prototype.get = function (name) 
	{
		return this._modules[this._extractName(name)] || null;
	};

	/**
	 * @param {string} name
	 * @returns {boolean}
	 */
	ModuleManager.prototype.has = function (name) 
	{
		return is(this._modules[this._extractName(name)]);
	};
	
	/**
	 * @param {function} callback
	 */
	ModuleManager.prototype.onLoaded = function (callback)
	{
		this._onCompleteCallbacks.push(callback);
		
		if (!this._loader.isLoading())
		{
			func.async.do(this._invokeOnComplete);
		}
	};
	
	
	this.ModuleManager = ModuleManager;
});
namespace('Oyster.Routing', function (root)
{
	var is			= root.Plankton.is;
	var foreach		= root.Plankton.foreach;
	
	var ParsingCursor	= root.Oyster.Routing.ParsingCursor;
	
	
	/**
	 * @name {Oyster.Routing.RoutingConfigParser}
	 * @alias {RoutingConfigParser}
	 */
	var RoutingConfigParser = {
		
		/**
		 * @param {ParsingCursor} cursor
		 * @param {*} config
		 * @param {*} object
		 * @return {boolean}
		 * @private
		 */
		_tryExtractRoute: function (cursor, config, object)
		{
			if (is(config['$']) && is.function(config['$'].action))
			{
				object['$'] = cursor.parseRouteConfig(config['$']);
				delete config['$'];
				return true;
			}
			else if (is(config['route']) && is.function(config['route'].action))
			{
				object['$'] = cursor.parseRouteConfig(config['route']);
				delete config['route'];
				return true;
			}
			else if (is(config['_']) && is.function(config['_'].action))
			{
				object['$'] = cursor.parseRouteConfig(config['_'], true);
				delete config['_'];
				return true;
			}
			
			return false;
		},
		
		/**
		 * @param {ParsingCursor} cursor
		 * @param {*} config
		 * @param {*} object
		 * @private
		 */
		_parse: function (cursor, config, object)
		{
			var found = RoutingConfigParser._tryExtractRoute(cursor, config, object);
			
			foreach.pair (config, function (name, value) 
			{
				object[name] = {};
				RoutingConfigParser._parse(cursor, value, object[name]);
			});
			
			if (found) cursor.pop();
		},
		
		
		/**
		 * @param {TreeActionsModule} manager
		 * @param {*} config
		 * @param {RoutesBuilder=} builder
		 */
		parse: function (manager, config, builder)
		{
			var object	= {};
			var cursor	= new ParsingCursor(manager, builder);
			
			RoutingConfigParser._parse(cursor, config, object);
			
			return object;
		}
	};
	
	
	this.RoutingConfigParser = RoutingConfigParser;
});
namespace('Space.Modules', function (window)
{
    var OysterModules			= window.Oyster.Modules.OysterModules;
    var BaseNavigationModule	= window.Oyster.Modules.BaseNavigationModule;
    
	var classify	= window.Classy.classify;
	var inherit     = window.Classy.inherit;


    /**
     * @class {Space.Modules.HistoryJsNavigationModule}
     * @alias {HistoryJsNavigationModule}
     *
     * @extends {BaseNavigationModule}
     */
    function HistoryJsNavigationModule() { classify(this); }


    inherit(HistoryJsNavigationModule, BaseNavigationModule);
    HistoryJsNavigationModule.moduleName = BaseNavigationModule.moduleName;


    HistoryJsNavigationModule.prototype._bindEvents = function ()
    {
        var navigate 	= this.navigate;
        var handleURL 	= this._routing.handleURL;

        $(window).on('popstate', function (e)
        {
            handleURL(window.location.pathname + window.location.search);
        });

        $(document).on('click', 'sp-link', function (e)
        {
            e.preventDefault();
            navigate($(this).attr('href'));
        });
    };


    HistoryJsNavigationModule.prototype.preLoad = function ()
    {
        /** @var {BaseRoutingModule} */
        this._routing = this.manager().get(OysterModules.RoutingModule);
        this._bindEvents();
    };


    HistoryJsNavigationModule.prototype.navigate = function (url)
    {
        history.pushState(null, null, url);
        this._routing.handleURL(url);
    };

    HistoryJsNavigationModule.prototype.goto = function (path, params)
    {
        var url = path;

        if (is.object(params) && is.object.notEmpty(params))
        {
            url += '?' + $.param(params);
        }

        this.navigate(url);
    };

    HistoryJsNavigationModule.prototype.handleMiss = function (url)
    {
        console.error('Could not handle URL: ' + url);
        this.goto('/');
    };


    this.HistoryJsNavigationModule = HistoryJsNavigationModule;
});
namespace('Space', function (window)
{
    var RootAction 			= window.Space.Actions.RootAction;
    

    this.Routes = {
		$:
		{
			path:	'/',
			action: RootAction
		}
	};
});
namespace('Oyster', function (root)
{
	var is = root.Plankton.is;
	var classify = root.Classy.classify;
	
	var ModuleManager = root.Oyster.ModuleManager;
	var OysterModules = root.Oyster.Modules.OysterModules;


	/**
	 * @class {Oyster.Application}
	 * @alias {Application}
	 * 
	 * @property {ModuleController} _controller
	 * 
	 * @constructor
	 */
	function Application()
	{
		classify(this);
		
		this._modules = new ModuleManager(this);
	}
	
	
	/**
	 * @param {string|*=} config
	 * @return {ModuleManager|Application|null|Module|*}
	 */
	Application.prototype.modules = function (config)
	{
		if (!is(config)) return this._modules;
		else if (is.string(config)) return this._modules.get(config);
		else if (is.function(config))
		{
			if (is.string(config.moduleName)) return this._modules.get(config.moduleName);
			else if (is.function(config.moduleName)) return this._modules.get(config.moduleName());
		}
		
		this._modules.add(config);
		return this;
	};
	
	/**
	 * Start the application. Should be called after modules and routes configured.
	 */
	Application.prototype.run = function ()
	{
		this._modules.onLoaded((function ()
			{
				/** @var {BaseRoutingModule} */
				var actionsModule = this.modules(OysterModules.RoutingModule);
				actionsModule.handleURL(window.location.pathname + window.location.search);
			})
			.bind(this));
	};
	
	
	/**
	 * Navigation and Routing modules must be passed to this function.
	 * @param {Module|[Module]} modules
	 * @param {function(Application, BaseRoutingModule)} callback
	 * @return {Application}
	 */
	Application.create = function (modules, callback)
	{
		var app = new Application();
		
		app.modules(modules);
		app.modules().onLoaded(
			function ()
			{
				/** @var {BaseRoutingModule} actionsModule */
				var actionsModule = app.modules(OysterModules.RoutingModule);
				callback(app, actionsModule);
			}
		);
		
		return app;
	};
	
	
	this.Application = Application;
});
namespace('Oyster.Modules.Routing', function (root)
{
	var func	= root.Plankton.func;
	
	var classify	= root.Classy.classify;
	var inherit		= root.Classy.inherit;
	
	var Router			= root.SeaRoute.Router;
	var RoutesBuilder	= root.SeaRoute.RoutesBuilder;
	
	var ActionChain			= root.Oyster.Actions.ActionChain;
	var Navigator			= root.Oyster.Routing.Navigator;
	var RoutingConfigParser	= root.Oyster.Routing.RoutingConfigParser;
	var BaseRoutingModule	= root.Oyster.Modules.BaseRoutingModule;
	var OysterModules		= root.Oyster.Modules.OysterModules;
	

	/**
	 * @class {Oyster.Modules.Routing.TreeActionsModule}
	 * @alias {TreeActionsModule}
	 * 
	 * @property {ActionChain}		_chain
	 * @property {SeaRoute.Router}	_router
	 * 
	 * @extends {BaseRoutingModule}
	 * 
	 * @constructor
	 */
	function TreeActionsModule()
	{
		classify(this);
		
		this._builder	= null;
		this._router	= null;
		this._navigator	= null;
		this._chain		= null;
	}
	
	
	inherit(TreeActionsModule, BaseRoutingModule);
	TreeActionsModule.moduleName = BaseRoutingModule.moduleName;
	
	
	TreeActionsModule.prototype.preLoad = function ()
	{
		/** @var {BaseNavigationModule} navModule */
		var navModule = this.manager().get(OysterModules.NavigationModule);
		
		this._builder	= new RoutesBuilder();
		this._router	= new Router(navModule.navigate.bind(navModule), navModule.handleMiss.bind(navModule));
		this._navigator	= new Navigator(this._router);
		this._chain		= new ActionChain(this);
	};
	
	
	/**
	 * @param {string} url
	 */
	TreeActionsModule.prototype.handleURL = function (url)
	{
		(func.async(this._router.handle(url)))();
	};
	
	
	/**
	 * @param {ActionRoute} actionRoute
	 * @param {*} params
	 */
	TreeActionsModule.prototype.handle = function (actionRoute, params)
	{
		this._chain.update(actionRoute, params);
	};
	
	/**
	 * @param {*} params
	 */
	TreeActionsModule.prototype.setupPredefinedParams = function (params)
	{
		this._builder.addParams(params);
	};
	
	/**
	 * @param {*} config
	 */
	TreeActionsModule.prototype.setupRoutes = function (config)
	{
		return RoutingConfigParser.parse(this, config, this._builder);
	};
	
	
	/**
	 * @return {Navigator}
	 */
	TreeActionsModule.prototype.navigator = function ()
	{
		return this._navigator;
	};
	
	/**
	 * @return {SeaRoute.Router}
	 */
	TreeActionsModule.prototype.router = function ()
	{
		return this._router;
	};
	
	
	this.TreeActionsModule = TreeActionsModule;
});
namespace('Space', function (window)
{
	var TreeActionsModule	= window.Oyster.Modules.Routing.TreeActionsModule;
	var Application			= window.Oyster.Application;
	
	var Routes = window.Space.Routes;

	var ViewModule 					= window.Space.Modules.ViewModule;
	var HistoryJsNavigationModule	= window.Space.Modules.HistoryJsNavigationModule;
	

	/**
	 * @param {Application} app
	 * @param {TreeActionsModule} routing
	 */
	function setupApplication(app, routing)
	{
		routing.setupRoutes(Routes);
		app.run();
	}


	var Boot = {

		_defaultModules:
		[
			TreeActionsModule,
			HistoryJsNavigationModule,
			ViewModule
		],
		launch: function ()
		{
			window.Space.App = Application.create(Boot._defaultModules, setupApplication);
			return window.Space.App;
		}
	};
	
	this.Boot = Boot;
});