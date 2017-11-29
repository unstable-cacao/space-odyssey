namespace('Space', function (window)
{
    var RootAction 			= window.Space.Actions.RootAction;
    var DashboardAction		= window.Space.Actions.DashboardAction;

    var SetupRoutes			= window.Space.Config.Routes.Setup;
    var ErrorRoutes			= window.Space.Config.Routes.Error;

    var TestAction			= window.Space.Actions.TestAction;


    this.Routes =
        {
            _:
                {
                    action: RootAction
                },
            Dashboard:
                {
                    $:
                        {
                            path: '/',
                            action: DashboardAction
                        }
                },
            Test:
                {
                    $:
                        {
                            path: 'test',
                            action: TestAction
                        }
                },
            Error:			ErrorRoutes,
            Setup: 			SetupRoutes
        };
});