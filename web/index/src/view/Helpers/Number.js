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