(function(){
	var app = angular.module('bill-type',[]);
	
	app.controller('createBillController',function(){
		this.createBill = function(){
			//console.log(application);
			var createBillCtrl = this;
			//console.log(createAppCtrl);
			billType.push({
				billTypeName:createBillCtrl.billType,
				billRate:createBillCtrl.billRate,
			});
			//console.log(application);
			createBillCtrl.appName = createBillCtrl.appVersion ='';
		};
	});
	
	app.controller('billTypeController',function($http){
		//this.bill = billType;
		var billType = this;
		billType.bill = [];
		//$scope.loading = true;
		$http.get('/resources/billType').success(function(data){
			for(var i=0;i<data.length;i++){
				billType.bill.push(data[i]);
			}
		}).error(function(data) {
            console.log('Error: ' + data);
        });
	});
})();