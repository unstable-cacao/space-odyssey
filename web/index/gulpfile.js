



function getDependencies()
{
	return require('oktopost-namespace').getDependencies(
		__dirname,
		function () {},
		function (root)
		{
			var load = [
				root.Space.App
			];
		});
}