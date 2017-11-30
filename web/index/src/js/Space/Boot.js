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