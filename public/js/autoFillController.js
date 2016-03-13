(function(){
	var app = angular.module('auto-fill',[]);
	
		app.controller('AutoFillController', function($scope,$http) {
		$scope.names = [];
		$scope.clients = [];
		$scope.projMgrs = [];
		$scope.soNums = [];
		
		var project = this;
		project.resource = [];
		$http.get('/resources/resNames').success(function(data){
			for(var i=0;i<data.length;i++){
				project.resource.push(data[i]);
				$scope.names[i] = project.resource[i].name;
			}
			$scope.loading = false;
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		
		$http.get('/resources/pmNames').success(function(data){
			for(var i=0;i<data.length;i++){
				project.resource.push(data[i]);
				$scope.projMgrs[i] = project.resource[i].projectManager;
			}
			$scope.loading = false;
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		$http.get('/resources/clientNames').success(function(data){
			for(var i=0;i<data.length;i++){
				project.resource.push(data[i]);
				$scope.clients[i] = project.resource[i].client;
			}
			$scope.loading = false;
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		$http.get('/resources/soNums').success(function(data){
			for(var i=0;i<data.length;i++){
				project.resource.push(data[i]);
				$scope.soNums[i] = project.resource[i].SO;
			}
			$scope.loading = false;
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		var _selected;
		
		$scope.selected = undefined;

	  // Any function returning a promise object can be used to load values asynchronously
		$scope.ngModelOptionsSelected = function(value) {
			//console.log('value:' + value);
			if (arguments.length) {
				//console.log('arguments leangth:' + value);
				_selected = value;
			} else {
				//console.log('inside else:' + _selected);
				return _selected;
			}
		};

		$scope.modelOptions = {
			debounce: {
				default: 500,
				blur: 250
			},
			getterSetter: true
		};
	});
})();