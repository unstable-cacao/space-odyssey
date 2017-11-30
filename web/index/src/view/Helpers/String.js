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