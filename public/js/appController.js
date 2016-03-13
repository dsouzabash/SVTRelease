(function(){
	var app = angular.module('app-type',[]);

	//Create App Controller
	app.controller('createAppController',function(){
		this.createApp = function(){
			//console.log(application);
			var createAppCtrl = this;
			//console.log(createAppCtrl);
			application.push({
				appName:createAppCtrl.appName,
				appVersion:createAppCtrl.appVersion
			});
			console.log(application);
			createAppCtrl.appName = createAppCtrl.appVersion ='';
		};
	});
	
	app.controller('appController',function($scope, $http){
		//this.appList = application;
		var application = this;
		application.appList = [];
		//$scope.loading = true;
		$http.get('/resources/appln').success(function(data){
			for(var i=0;i<data.length;i++){
				application.appList.push(data[i]);
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
	});
})();