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