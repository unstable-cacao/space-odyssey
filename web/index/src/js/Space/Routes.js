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