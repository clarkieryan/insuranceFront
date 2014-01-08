//Allow the use of cookie module
angular.module('insuranceFront', ['restangular', 'ngCookies', 'ngRoute']).
  config(function($routeProvider, RestangularProvider) {
    $routeProvider
      .when('/', {
        controller:indexCtrl, templateUrl:'index.html'})
      .when('/stage2', {
        controller:stage2Ctrl, templateUrl:'stage2.html'})
      .when('/stage3', {
        controller:stage3Ctrl, templateUrl:'stage3.html'})
      .when('/stage4', { 
        controller:stage4Ctrl, templateUrl:'stage4.html'})
        //Question mark makes the id an optional route
      .when('/quote/:email?/:id?', {
        controller: quoteCtrl, 
        templateUrl:'quote.html',
        resolve: quoteCtrl.resolve
      });
      
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