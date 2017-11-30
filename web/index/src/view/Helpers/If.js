Handlebars.registerHelper('ifValue', function (conditional, options) 
{
	if (options.hash.value === conditional)
	{
		return options.fn(this);
	}
	
	return options.inverse(this);
});

Handlebars.registerHelper('ifAll', function () 
{
	var args 	= [].slice.apply(arguments);
	var opts 	= args.pop();
	var fn 		= opts.fn;
	
	for (var i = 0; i < args.length; ++i)
	{
		if (args[i])
		{
			continue;
		}

		fn = opts.inverse;
		break;
	}
	return fn(this);
});

Handlebars.registerHelper('ifAny', function () 
{
	var args = [].slice.apply(arguments);
	var opts = args.pop();
	
	for (var i = 0; i < args.length; ++i)
	{
		if (args[i])
		{
			return opts.fn(this);
		}
	}
	
	return opts.inverse(this);
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) 
{	
	switch (operator) 
	{
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '!==':
			return (v1 !== v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
});

Handlebars.registerHelper('ifInArray', function (elem, list, options)
{
	if (list.indexOf(elem) > -1) 
	{
		return options.fn(this);
	}

	return options.inverse(this);
});


Handlebars.registerHelper('unlessValue', function (conditional, options) 
{
	if (options.hash.value !== conditional) 
	{
		return options.fn(this);
	}
	
	return options.inverse(this);
});

Handlebars.registerHelper('ifDateIn', function (date, days, options)
{
	if (moment.utc(date).isBefore(moment().add(days, 'days'))) 
	{
		return options.fn(this);
	}

	return options.inverse(this);
});

Handlebars.registerHelper('ifDatePast', function (conditional, options) 
{
	if (moment.utc(conditional).isBefore((new Date()))) 
	{
		return options.fn(this);
	}
	
	return options.inverse(this);
});