(function(){
	var app = angular.module('svt',['ngAnimate', 'ui.bootstrap','auto-fill','bill-type','travel-type','app-type','resource-admin','app.filters','ui.filters']);
	
	//Cusotm Directive
	app.directive('dashBoard', function(){
		return{
			restrict:'E',
			templateURL:"dash-board.html"
		};
	});	
	
	//Schedule Request Controller
	app.controller('RequestController',function(){
		this.request = {};
		this.addRequest = function(resource){
			console.log('Inside add request');
			resource.push(this.request);
			this.request = {};
		};
	});
	
	//Navigation Controller
	app.controller('navController',function(){
		this.tab = 'dashboard';
		this.selectTab = function(navItem){
			if($('#SubMenu1').attr('class')!=undefined){
				if($('#SubMenu1').attr('class').length==0 && navItem.indexOf('modify')==-1 &&  navItem.indexOf('new')==-1){
					//console.log('Inside second if');
					$('#adminOptions').collapse("toggle");
				}
			}
			this.tab = navItem;
		};
		this.isSelected = function(checkTab){
			return this.tab === checkTab;
		}
	});
	
	//Resource Controller
	app.controller('resourceController',function($scope, $uibModal, $log, $http){
		//this.resource = project;
		var project = this;
		project.resource = [];
		$scope.filteredResource = [];
		$scope.loading = true;
		$http.get('/resources/schedule').success(function(data){
			for(var i=0;i<data.length;i++){
				//console.log(data.length);
				project.resource.push(data[i]);
				//console.log(project.resource[i].DATEEndDate);
			}
			$scope.loading = false;
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		$scope.resource = project.resource;
		$scope.orderByField = 'name';
		$scope.search = {name:'', projectManager:''};
		$scope.reverseSort = false;
		$scope.selectedRow = null;  // initialize our variable to null
		$scope.setClickedRow = function(clickedResource){  //function that sets the value of selectedRow to current index
			//console.log(clickedResource);
			$scope.selectedRow = clickedResource;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					selectedRow: function () {
						return $scope.selectedRow;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};

		this.selectRadio = function(radioItem){
			//console.log('Inside selectRadio: ' + radioItem);
			$scope.selectRadioItem = radioItem;
		}
		this.whatsChecked = function(selectedRadio){
			//console.log('Inside whatsChecked: ' + selectedRadio);
			return $scope.selectRadioItem === selectedRadio;
		}
	});
	
	angular.module('app.filters', []).filter('tableFilter', [function () {
		return function (resource, filteredResource) {
			$('#filter').on('mousedown',function($scope){
			  //console.log('Inside click filter:  ');
			  console.log('Inside tableFilter: ' + document.getElementById('filterLoading').style.display);
			  if(filteredResource.length==0){
				//console.log('Inside filtered Length =0: '  + $('#startDate').val().length);
				var startDate = new Date($('#startDate').val());
				startDate.setDate(startDate.getDate()-1);
				var endDate = new Date($('#endDate').val());
				endDate.setDate(endDate.getDate()-1);
				if(startDate!='Invalid Date' && $('#startDate').val().length==10 && $('#endDate').val().length==0){
					//$('#filterLoading').show();
					//console.log('startdate lenght greater than 0');
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].startDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(startDate.valueOf() < rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(startDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						else if($('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + startDate + resource.length);
							}
						}
						if(i== resource.length-1){
							//console.log('Inside i equal res length: ' + filteredResource.length);
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
				else if(endDate!='Invalid Date' && $('#startDate').val().length==0 && $('#endDate').val().length==10){
					//console.log('startdate lenght greater than 0');
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].endDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate'){
							if(endDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate'){
							if(endDate.valueOf() < rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate'){
							if(endDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						if(i== resource.length-1){
							//console.log('Inside i equal res length: ' + filteredResource.length);
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
				else if(endDate!='Invalid Date' && $('#startDate').val().length==10 && $('#endDate').val().length==10){
					//console.log('startdate lenght greater than 0');
					var findRow = false;
					for(var i=0;i<resource.length;i++){
						var rowDate = new Date(resource[i].endDate.split('T')[0]);
						rowDate.setHours(0,0,0,0);
						if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'beforeEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'afterEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'onEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							if(endDate.valueOf() === rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'betweenStartDate'){
							var startDate_2 = new Date($('#startDate_2').val());
							startDate_2.setDate(startDate_2.getDate()-1);
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf() && startDate_2.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'beforeStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() > rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'afterStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() < rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						else if($('input[name="optradioEnd"]:checked').val() == 'betweenEndDate' && $('input[name="optradioStart"]:checked').val() == 'onStartDate'){
							var endDate_2 = new Date($('#endDate_2').val());
							endDate_2.setDate(endDate_2.getDate()-1);
							if(endDate.valueOf() < rowDate.valueOf() && endDate_2.valueOf() > rowDate.valueOf() && startDate.valueOf() === rowDate.valueOf()){
								//console.log('Inside equal: ' + startDate + ' RowDate: ' + rowDate);
								//console.log(project.resource[i]);
								findRow = true;
								filteredResource.push(resource[i]);
							}
							else{
								console.log('Not equal: ' + endDate + resource.length);
							}
						}
						//$('#filterLoading').show();
						if(i== resource.length-1){
							//console.log('Inside i equal res length: ' + filteredResource.length);
							if(findRow==false){
								filteredResource.push({'name':'No Results','client':'No Results','SO':'No results','startDate':$('#startDate').val(),'endDate':$('#endDate').val(),'city':'No Results','state':'No Results','travel':'No Results','projectManager':'No Results'});
							}
						}
					}
				}
			  }
			  else if($('#startDate').val().length==0 && $('#endDate').val().length==0){
				//console.log('Isnide startDate is 0');
				for(var i=0; i<filteredResource.length; i++)
					filteredResource.pop();
				//console.log(filteredResource);
			  } 
		    });
			$('#reset').on('click',function(){
				$('#startDate').val("");
				$('#endDate').val("");
				//console.log('Inside reset click : ' );
				for(var i=0; i<filteredResource.length; i++)
					filteredResource.pop()
		    });
			setTimeout(function(){$('#filterLoading').hide()},1500);
			if(!angular.isUndefined(resource) && !angular.isUndefined(filteredResource) && filteredResource.length > 0) {
				//console.log('Displaying Filtered Resource: ' + filteredResource.length);
				return filteredResource;
			} else {
				//console.log('Displaying Complete Resource');
				return resource;
			}
		};
	}]);
	
	app.controller('dashboardController',function($scope, $uibModal, $log, $http){
		//console.log('Inside ')
		//this.resource = project;
		var project = this;
		project.resource = [];
		$scope.loading = true;
		$http.get('/resources/dashboard').success(function(data){
			for(var i=0;i<data.length;i++){
				//console.log(data.length);
				project.resource.push(data[i]);
				//console.log(project.resource[i].DATEEndDate);
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
		//var project = this;
		//project.resource = [];
		$scope.orderByField = 'name';
		$scope.reverseSort = false;
		$scope.selectedRow = null;  // initialize our variable to null
		$scope.setClickedRow = function(clickedResource){  //function that sets the value of selectedRow to current index
			//console.log(clickedResource);
			$scope.selectedRow = clickedResource;
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				resolve: {
					selectedRow: function () {
						return $scope.selectedRow;
					}
				}
			});
			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};
	});
	
	//Modal Controller
	app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, selectedRow) {
		$scope.selectedRow = selectedRow;
		$scope.selected = {
			selectedRow: $scope.selectedRow
		};
		$scope.ok = function () {
			$uibModalInstance.close($scope.selected.item);
		};
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
})();


$(document).ready(function() {
    $('.date')
		.datepicker({
            format: 'mm.dd.yyyy'
        });
	$('#filter').on('mouseover',function(){
		$('#filterLoading').show();
	});
});

$(document).ready(function() {
    $('input[name="daterange"]').daterangepicker();
});
			  
$('.parent').click(function() {
    var subMenu = $(this).siblings('ul');
    if ($(subMenu).hasClass('open')) {
        $(subMenu).fadeOut();
        $(subMenu).removeClass('open').addClass('closed');
    }
    else {
        $(subMenu).fadeIn();
        $(subMenu).removeClass('closed').addClass('open');
    }
});