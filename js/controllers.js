
/*
* Index Controller
* This controller renders the intial page
*/

function indexCtrl($scope, $location, Restangular, $cookieStore) {
  $scope.save = function() {
    Restangular.all('customers').post($scope.customer).then(function(response) {
        if(response.code == "201"){
            $cookieStore.put('customer_id', response.customer.id);
            $location.path('/stage2');
        } else {
            alert("Server error");
        }
    });
  }
}

/*
* Stage 2 Controller
* This controller allows you to attribute the customer details to a customer
*/

function stage2Ctrl($scope, $location, Restangular, $cookieStore) {
    //TODO Grab this from API
    $scope.occupations = new Array("Student", "Nurse", "Teacher");

    $scope.save = function() {
        Restangular.one('customers', $cookieStore.get('customer_id')).all('customer_details').post($scope.customer_details).then(function(customer_details) {
            $location.path('/stage3');
        });
    }
}

/*
* Stage 3 Controller
* This controller attributes a quote details to a customer
*/

function stage3Ctrl($scope, $location, Restangular, $cookieStore) {
    //TODO - Grab this from API
    $scope.breakdownTypes = new Array("European", "UK Only", "Wolrdwide");

    $scope.save = function() {
        console.log($scope.quote_details);
        Restangular.one('customers', $cookieStore.get('customer_id')).all('quotes').post($scope.quote_details).then(function(quote_details) {
          if(quote_details.code == "201"){
                $cookieStore.put('quote_id', quote_details.quote.id);
                $location.path('/stage4');
            } else {
                alert("Server error");
            }
        });
    }

}

/*
* Stage 4 Controller
* This controller allows you to atrribute incidents to a quote
*/

function stage4Ctrl($scope, $location, Restangular, $cookieStore) {
    $scope.incidents = [];

    $scope.addIncident = function(){
        $scope.incidents.push({});
    }

    $scope.removeIncident = function(index){
        $scope.incidents.splice(index, 1);
    }

   $scope.save = function() {
   $scope.incident = [];
   $scope.incident.incident = $scope.incidents;
Restangular.one('customers',$cookieStore.get('customer_id')).one('quotes',$cookieStore.get('quote_id')).all('incidents').post($scope.incident).then(function(incidents) {
        //Redirect to the end quote
        $location.path('/quote');
    });
   }
}

/*
* Quote Controller
* This controller outputs a quote with all the relevant data installed
*/
function quoteCtrl($scope, quote, $location, Restangular, $cookieStore, $route) {
    $scope.quote = quote;
    //Let's add in some plurlisation and ability to view incidents
    $scope.claimText = ($scope.quote.incidents.length > 1 || $scope.quote.incidents.length == 0) ? "Incidents" : "Incident";
    //Some custom formatting for boolean values
    $scope.quote.body.breakdownCover = ($scope.quote.body.breakdownCover == true) ? "Yes" : "No";
    $scope.quote.body.windscreenCover = ($scope.quote.body.windscreenCover == true) ? "Yes" : "No";


}

/*
* Quote Resolver
* This resolver ensures all the relevant data is resolved before the view is populated.
*/
quoteCtrl.resolve = {

    quote: function($q, Restangular, $cookieStore, $route){
        var id = ($route.current.params.id == undefined) ? $cookieStore.get('quote_id') : $route.current.params.id;
        var quote = {};
        var deferred = $q.defer();
        Restangular.one('quote', id).get().then(function(response){
            quote.body = response;
            Restangular.one('quote', id).all('incidents').getList().then(function(incidents){
                quote.incidents = incidents;
            });
            quote.customer = Restangular.one('customers', response.customer_id).get().then(function(customer){
                quote.customer = customer;
                quote.customer_details = Restangular.one('customers', customer.id).one('customer_details').get().then(function(customer_details){
                    quote.customer_details = customer_details;
                    console.log(quote);
                    deferred.resolve(quote)
                });
            });
        });
        return deferred.promise;
    }
};

/*
* Side link controller
*/
function linkCtrl($scope, $location) {
   $scope.getClass = function(path) {
        var location = $location.path();
        if (location == path ) {
          return "active"
        } else {
          return ""
        }
   }
}
