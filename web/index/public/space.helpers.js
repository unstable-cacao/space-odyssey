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
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) 
{
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});
Handlebars.registerHelper('percFormat', function (value, total)
{
	var num;

	if (typeof value !== 'number' || typeof total !== 'number' || total === 0) 
	{
		return '0%';
	}

	num = Math.floor((value / total) * 100);

	return num + '%';
});

Handlebars.registerHelper('niceNumber', function (num)
{
	num = parseInt(num);

	var minified, devided;

	if (isNaN(num) || num < 0)
	{
		return '-';
	}

	if (num < 1000)
	{
		return num.toString();
	}

	if (num < 100000)
	{
		devided = num / 1000;
		minified = (Math.floor(10 * devided) / 10).toFixed(1); // To prevent from rounding
		return minified + 'K';
	}

	if (num < 1000000)
	{
		devided = num / 1000;
		minified = (Math.floor(devided)).toFixed(0); // To prevent from rounding
		return minified + 'K';
	}

	if (num < 10000000)
	{
		devided = num / 1000000;
		minified = (Math.floor(100 * devided) / 100).toFixed(2); // To prevent from rounding
		return minified + 'M';
	}

	devided = num / 1000000;
	minified = (Math.floor(10 * devided) / 10).toFixed(1); // To prevent from rounding
	
	var niced = minified + 'M';
	
	return new Handlebars.SafeString(niced);
});

Handlebars.registerHelper('inc', function (value, options)
{
    return parseInt(value) + 1;
});

Handlebars.registerHelper('toFixed', function (value, fixed)
{
	var intResult = parseInt(value);
	var floatResult = parseFloat(value).toFixed(fixed);
	
	if (floatResult > intResult || floatResult < intResult)
	{
		return floatResult;
	}
	else
	{
		return intResult;
	}
});
Handlebars.registerHelper('numberFormat', function (x)
{
	x = x || 0;
	
	var parts = x.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	return parts.join(".");
});

Handlebars.registerHelper('currency', function (sum) 
{
	sum = is.string(sum) ? Number(sum).valueOf() : sum;
	
	return new Handlebars.SafeString('$' + window.Oktopost.Old.Base.Utils.numberWithCommas(sum.toFixed(2)));
});

Handlebars.registerHelper('toLowerCase', function (str)
{
	return str.toLowerCase();
});


/**
 * @deprecated Use Credential->DisplayName instead
 */
Handlebars.registerHelper('nameFormat', function (str) 
{
	if (str.match(/\((Company|Page)\)$/)) 
	{
		str = str.substring(0, str.indexOf(" ("));
	}
	else if (str.indexOf("'s") > 0) 
	{
		str = str.substring(0, str.lastIndexOf("'"));
	}
	
	return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('shorten', function (str, count, cutWordInMiddle)
{
	cutWordInMiddle = (typeof cutWordInMiddle !== 'boolean' ? false : cutWordInMiddle);

	var text = $.shorten(decodeURIComponent(str.replace(/%/g, '%25')), count, cutWordInMiddle, ' &hellip;');
	return new Handlebars.SafeString(text[0]);
});

Handlebars.registerHelper('camelCaseToDash', function (str)
{
	str = str === null ? '' : str;
	
	return new Handlebars.SafeString(window.Oktopost.Old.Base.Utils.camelCaseToDash(str));
});

Handlebars.registerHelper('fileSize', function (size)
{
	var fileSizeKb = parseInt(size) / 1000;

	if (fileSizeKb >= 1000) 
	{
		return (fileSizeKb / 1000).toFixed(1) + ' MB';
	}

	if (fileSizeKb < 1) 
	{
		return size + ' Bytes';
	}
	
	return fileSizeKb.toFixed(1) + ' KB';
});

Handlebars.registerHelper('drawBar', function (sizeRel, colorRel, suffix)
{
	var bar 	= $('<span>').addClass('bar');
	var color 	= false;
	var width 	= (sizeRel > 0 ? sizeRel : 1);

	if (typeof colorRel === 'number')
	{
		if (colorRel < 10) {
			color = 'red';
		} 
		else if (colorRel < 60)
		{
			color = 'orange';
		} 
		else
		{
			color = '#81C10B';
		}
	}

	bar.css({
		width: width + suffix
	});

	if (color !== false)
	{
		bar.css('background-color', color);
	}

	return new Handlebars.SafeString($('<p>').html(bar).html());
});

/**
 * Get translated string. Accepts additional arguments in a key/value series
 * @example {{t 'hello' 'var', 'world'}}
 * @param {string} key
 * @return {string}
 */
Handlebars.registerHelper('t', function (key)
{
	var i = 0;
	var options = {};

	for (i = 1; i < arguments.length; i++)
	{
	    options[arguments[i]] = arguments[i + 1];
	    i = i + 1;
	}

	return window.I18n.t(key, options);
});

Handlebars.registerHelper('capitalize', function (str)
{
	var capitalized = str.charAt(0).toUpperCase() + str.slice(1);
	return new Handlebars.SafeString(capitalized);
});

Handlebars.registerHelper('formatWordByType', function (word, type)
{
	return window.Oktopost.Old.Base.Utils.formatWordByType(word, type);
});


Handlebars.registerHelper('profilesFormat', function (profiles)
{
	var output 	= window.Handlebars.helpers.nameFormat(profiles[0].Name);
	var count 	= profiles.length;

	if (count > 1) 
	{
		output += ' (+' + (count - 1) + ' more)';
	}

	return new Handlebars.SafeString(output);
});

Handlebars.registerHelper('encodeURIComponent', function (value)
{
	return encodeURIComponent(value);
});

Handlebars.registerHelper('safeString', function (str)
{
	return new Handlebars.SafeString(str);
});

Handlebars.registerHelper('stripTags', function (str)
{
	return $('<p/>').html(str).text().trim();
});

Handlebars.registerHelper('substr', function (str, start, end)
{
	if (end > 0)
	{
		return new Handlebars.SafeString(str.substr(start, end));
	}

	return new Handlebars.SafeString(str.substr(start));
});

Handlebars.registerHelper('formatEngagement', function (num)
{
	var span = $('<span/>'),
		rounded = 0;

	if (num < 100) {
		return new Handlebars.SafeString(span.text(num).prop('outerHTML'));
	}
	
	if (num < 1000) {
		rounded = Math.floor(num / 100) * 100;
		return new Handlebars.SafeString(span.text(rounded + '+').prop('outerHTML'));
	}

	rounded = Math.floor(num / 1000);

	return new Handlebars.SafeString(span.addClass('hot').text(rounded + 'K').prop('outerHTML'));
});

Handlebars.registerHelper('linkify', function (str, network)
{
	var result;
	
	var params = {
		targetBlank: false,
		urlClass: 'ext-link'
	};
	
	if (network === window.OkCore.Network.TWITTER)
	{
		params.usernameIncludeSymbol = true;
		params.hashtagClass = 'ext-link';
		params.usernameClass = 'ext-link';
		result = twttr.txt.autoLink(str, params);
	}
	else
	{
		result = twttr.txt.autoLinkUrlsCustom(str, params);
	}
	
	return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('join', function ()
{
	var args = [];
	var delimiter;

	obj.forEach(arguments, function (arg) 
	{
		if (is.string(arg))
		{
			args.push(arg);
		}
	});
	
	delimiter = args[0];
	
	return args.join(args.shift()).trim();
});
Handlebars.__switch_stack__ = [];

Handlebars.registerHelper('switch', function (value, options)
{
	Handlebars.__switch_stack__.push({
		switch_match: false,
		switch_value: value
	});
	var html = options.fn(this);
	Handlebars.__switch_stack__.pop();
	return html;
});

Handlebars.registerHelper('case', function (value, options)
{
	var args       = Array.from(arguments);
	var options    = args.pop();
	var caseValues = args;
	var stack      = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];
	
	if (stack.switch_match || caseValues.indexOf(stack.switch_value) === -1)
	{
		return '';
	}
	else
	{
		stack.switch_match = true;
		return options.fn(this);
	}
});

Handlebars.registerHelper('default', function (options)
{
	var stack = Handlebars.__switch_stack__[Handlebars.__switch_stack__.length - 1];
	if (!stack.switch_match)
	{
		return options.fn(this);
	}
});