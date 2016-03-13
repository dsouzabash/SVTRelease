(function(){
	var app = angular.module('travel-type',[]);
	
	app.controller('createTravelController',function(){
		this.createTravel = function(){
			//console.log(application);
			var createTravelCtrl = this;
			//console.log(createAppCtrl);
			travelTypes.push({
				travelTypeName:createTravelCtrl.travelType,
			});
			//console.log(application);
			createTravelCtrl.appName = createTravelCtrl.appVersion ='';
		};
	});
	
	app.controller('travelController',function($http){
		//this.travel = travelTypes;
		var travelType = this;
		travelType.travel = [];
		//$scope.loading = true;
		$http.get('/resources/travelType').success(function(data){
			for(var i=0;i<data.length;i++){
				travelType.travel.push(data[i]);
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
	});
})();