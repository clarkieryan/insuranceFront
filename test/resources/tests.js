
/*
* Index controller tests
*/
describe('Controllers', function(){

	beforeEach(angular.mock.module('restangular', 'ngCookies') );

	    beforeEach(angular.mock.module('insuranceFront') ,     function(RestangularProvider) {

	RestangularProvider.setBaseUrl('http://localhost:3000/api/v1');
	RestangularProvider.setDefaultRequestParams({ access_token: '52ffb9f962d1e4e24df41369ba6e394c' });
	RestangularProvider.setRestangularFields({
		id: '_id.$oid'
	});
	RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
		if (operation === "getList") {
			var newResponse = response;
			return newResponse;
		}
		return response;
		});
	});

		beforeEach(inject(function($controller, _Restangular_, $rootScope, _$httpBackend_, $cookieStore){
			Restangular = _Restangular_ ;
			httpBackend = _$httpBackend_;
			scope = $rootScope.$new();
			cookieStore = $cookieStore;
			
		}));

		it('Should add a new customer and set a cookie with the users email (indexCtrl)', inject(function($controller){ 
			var indexCtrl = $controller('indexCtrl', { $scope: scope, Restangular: Restangular });
			scope.customer = {"title" : "Mr", "forename":"Ryan", "surname":"Clarke", "email":"wow@wow.com"};
			//Set the expected outocme
			expectedOutput = {"code" : "201", "description": "Created customer"};
			expectedOutput.customer = scope.customer;
			//Intercept the connection and post this back
			httpBackend.whenPOST("http://localhost:3000/api/v1/customers?access_token=52ffb9f962d1e4e24df41369ba6e394c").respond(expectedOutput);

			scope.save();
			scope.$digest();
			httpBackend.flush();

			expect(cookieStore.get('customer_email')).toBe(scope.customer.email);
		}));

		it('Should add a new customer details and set a variable true (stage2)', inject(function($controller) {
			var stage3Ctrl = $controller('stage3Ctrl', { $scope: scope, Restangular: Restangular });

			scope.quote_details = {"id":1,"customer_id":1,"vehicleReg":"BP53 WHJ","estimatedMileage":30000,"estimatedVehicleValue":30000,"parkingLocation":"Outside","policyExcess":300,"breakdownCover":false,"breakdownType":null,"windscreenCover":false,"windscreenExcess":0};
			
			expectedOutput = {"code" : "201", "description": "Created quote"};
			expectedOutput.quote = scope.quote_details;
			httpBackend.whenPOST("http://localhost:3000/api/v1/customers/quotes?access_token=52ffb9f962d1e4e24df41369ba6e394c").respond(expectedOutput);


			scope.save();
			scope.$digest();
			httpBackend.flush();
			expect(cookieStore.get('quote_id')).toBe(scope.quote_details.id);
		}));

	it('Should retieve a quote', inject(function($controller) {
		

		cookieStore.put('customer_email', "clarkie.ryan@gmail.com");
		cookieStore.put('quote_id', 1);

		expectedOutput  = {"customer":{"id":1,"title":"Mr","forename":"Ryan","surname":"Clarke","email":"clarkie.ryan@gmail.com","created_at":"2013-12-07T15:55:54.570Z","updated_at":"2013-12-07T15:55:54.570Z"},"customer_details":{"id":1,"customer_id":1,"dob":2013,"telNumber":0,"street":"1 Raveloe Drive","city":"Nuneaton","county":"Warwickshire","postCode":"CV11 4QP","licenceType":"provisional","licenceHeldSince":"2013-12-10","occupation":"Nurse","quotesStored":null,"incidents":null,"created_at":"2013-12-07T17:27:42.300Z","updated_at":"2013-12-07T17:28:24.318Z"},"body":{"id":1,"customer_id":1,"vehicleReg":"BP53 WHJ","estimatedMileage":30000,"estimatedVehicleValue":30000,"parkingLocation":"Outside","policyExcess":300,"breakdownCover":false,"breakdownType":null,"windscreenCover":false,"windscreenExcess":0,"premium":514,"created_at":"2013-12-07T17:06:45.435Z","updated_at":"2013-12-07T17:06:45.435Z"},"incidents":[]};


		var quoteCtrl = $controller('quoteCtrl', { $scope: scope, Restangular: Restangular, quote: expectedOutput });

		scope.$digest();
		//Test case
		expect(scope.quote).toBe(expectedOutput);

	}));
});
