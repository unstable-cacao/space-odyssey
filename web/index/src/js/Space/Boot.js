namespace('Space', function (window)
{
    var TreeActionsModule	= window.Oyster.Modules.Routing.TreeActionsModule;
    var Application			= window.Oyster.Application;

    var Path 				= window.Space.Path;
    var Routes 				= window.Space.Routes;
    var Params 				= window.Space.Config.Routes.Params;
    var IdParams 			= window.Space.Config.Routes.IdParams;

    var HistoryJsNavigationModule = window.Space.Modules.Navigation.HistoryJsNavigationModule;

    var ViewModule 				= window.Space.Modules.View.ViewModule;
    var LayoutModule 			= window.Space.Modules.View.LayoutModule;
    var MetaTitleModule 		= window.Space.Modules.View.MetaTitleModule;
    var MenuIndicatorModule 	= window.Space.Modules.View.MenuIndicatorModule;
    var MyProfileMenuModule 	= window.Space.Modules.View.MyProfileMenuModule;
    var TipModule				= window.Space.Modules.View.TipModule;
    var ToastModule				= window.Space.Modules.View.ToastModule;
    var VideoModule				= window.Space.Modules.View.VideoModule;
    var PreventDefaultModule 	= window.Space.Modules.View.PreventDefaultModule;
    var MobileMenuModule 		= window.Space.Modules.View.MobileMenuModule;

    var ConsoleInitializeModule = window.Space.Modules.View.ConsoleInitializeModule;

    var MediaWidgetModule	= window.Space.Modules.MediaWidget.MediaWidgetModule;

    var AjaxModule 			= window.Space.Modules.Ajax.AjaxModule;
    var WebsocketModule		= window.Space.Modules.Websocket.WebsocketModule;
    var ObjectsModule		= window.Space.Modules.Data.ObjectsModule;
    var InboxModule			= window.Space.Modules.Inbox.InboxModule;
    var AssignmentModule	= window.Space.Modules.Assignments.AssignmentModule;

    var LicenseModule		= window.Space.Modules.Authority.LicenseModule;
    var UserTeamsModule		= window.Space.Modules.Authority.UserTeamsModule;
    var PermissionsModule	= window.Space.Modules.Authority.PermissionsModule;

    var ProfileModule			= window.Space.Modules.Data.ProfileModule;
    var UserStoreModule			= window.Space.Modules.Data.UserStoreModule;
    var UsersStateModule		= window.Space.Modules.Data.UsersStateModule;
    var UserAccountsModule		= window.Space.Modules.Data.UserAccountsModule;
    var UserAccountStateModule	= window.Space.Modules.Data.UserAccountStateModule;
    var KeepAliveModule			= window.Space.Modules.Data.KeepAliveModule;

    var MixpanelModule 			= window.Space.Modules.Mixpanel.MixpanelModule;


    var RefreshHandler	= window.Space.Modules.Ajax.Decorators.RefreshHandler;


    /**
     * @param {TreeActionsModule} routing
     */
    function setupRoutes(routing)
    {
        routing.setupPredefinedParams(Params);
        routing.setupPredefinedParams(IdParams);

        Path.set(routing.setupRoutes(Routes));
    }


    /**
     * @param {Application} app
     * @param {TreeActionsModule} routing
     */
    function setupApplication(app, routing)
    {
        setupRoutes(routing);
        app.run();
    }


    /**
     * @return {AjaxModule}
     */
    function getAjaxModule()
    {
        var module = new AjaxModule();

        module.addDecorator([
            new RefreshHandler()
        ]);

        return module;
    }


    var Boot = {

        _defaultModules:
            [
                [
                    TreeActionsModule,
                    HistoryJsNavigationModule
                ],
                [
                    ViewModule,
                    LayoutModule,
                    MetaTitleModule,
                    MenuIndicatorModule,
                    MyProfileMenuModule,
                    TipModule,
                    ToastModule,
                    VideoModule,
                    PreventDefaultModule,
                    ConsoleInitializeModule,
                    MediaWidgetModule,
                    MobileMenuModule
                ],
                [
                    LicenseModule,
                    UserTeamsModule,
                    PermissionsModule,
                    UserAccountStateModule,
                    UsersStateModule,
                    UserStoreModule,
                    InboxModule,
                    AssignmentModule,
                    ProfileModule,
                    UserAccountsModule,
                    getAjaxModule(),
                    WebsocketModule,
                    ObjectsModule,
                    KeepAliveModule
                ],
                [
                    MixpanelModule
                ]
            ],

        launch: function ()
        {
            window.Space.App = Application.create(Boot._defaultModules, setupApplication);
            return window.Space.App;
        }
    };


    this.Boot = Boot;
});