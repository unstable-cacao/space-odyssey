namespace('Space.Actions', function (window) 
{
	var Action = window.Oyster.Action;
	
	var inherit		= window.Classy.inherit;
	var classify	= window.Classy.classify;
	
	
	function RootAction() { Action.call(this); classify(this); }
	inherit(RootAction, Action);


	RootAction.prototype.initialize = function ()
	{
		this._viewModule = this.modules('ViewModule');
	};
	
	RootAction.prototype.activate = function ()
	{
		console.log(123);
	};
	
	RootAction.prototype.refresh = function ()
	{
		
	};
	
	RootAction.prototype.update = function ()
	{
		
	};
	
	RootAction.prototype.execute = function ()
	{
		
	};
	
	RootAction.prototype.preDestroy = function ()
	{
		
	};
	
	RootAction.prototype.destroy = function ()
	{
		
	};
	
	
	this.RootAction = RootAction;
});