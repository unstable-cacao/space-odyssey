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