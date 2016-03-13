(function(){
	var app = angular.module('resource-admin',[]);

	//Create App Controller
	app.controller('createResController',function(){
		this.createApp = function(){
			//console.log(application);
			var createResCtrl = this;
			//console.log(createAppCtrl);
			resource.push({
				resName:createResCtrl.appName,
				resVersion:createResCtrl.appVersion
			});
			//console.log(resource);
			createResCtrl.resName = createResCtrl.resType ='';
		};
	});
	
	app.controller('resourceAdminController',function($scope, $http){
		//this.appList = application;
		var resource = this;
		resource.resList = [];
		//$scope.loading = true;
		$http.get('/resources/resNames').success(function(data){
			for(var i=0;i<data.length;i++){
				resource.resList.push({'resName':data[i].name,'resType':'SE'});
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		$http.get('/resources/pmNames').success(function(data){
			for(var i=0;i<data.length;i++){
				resource.resList.push({'resName':data[i].projectManager,'resType':'PM'});
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		//console.log(resource.resList);
	});
})();