
/*
* Index Controller
* This controller renders the intial page
*/

function indexCtrl($scope, $location, Restangular, $cookieStore) {
  $scope.save = function() {
     if (!$scope.quoteForm.$valid) return false;
    Restangular.all('customers').post($scope.customer).then(function(response) {
        if(response.code == "201"){
            $cookieStore.put('customer_id', response.customer.id);
            $cookieStore.put('customer_email', response.customer.email);
            $location.path('/stage2');
        } else {
            //TODO Add in validation for non-unique emails
            alert("Validation error");
        }
    }, function(response){
        console.log("Error with status code" + response.status);
        if(response.status == "422"){
            alert("The email address has already been taken");
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
        if (!$scope.quoteForm.$valid) return false;
        Restangular.one('customers', $cookieStore.get('customer_id')).all('customer_details').post($scope.customer_details).then(function(customer_details) {
            $location.path('/stage3');
        }, function(response){
        console.log("Error with status code" + response.code);
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
         if (!$scope.quoteForm.$valid) return false;
        Restangular.one('customers', $cookieStore.get('customer_id')).all('quotes').post($scope.quote_details).then(function(quote_details) {
          if(quote_details.code == "201"){
                $cookieStore.put('quote_id', quote_details.quote.id);
                $location.path('/stage4');
            } else {
                alert("Server error");
            }
        }, function(response){
        console.log("Error with status code" + response.code);
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
    }, function(response){
        console.log("Error with status code" + response.code);
    });
   }
}

/*
* Quote Controller
* This controller outputs a quote with all the relevant data installed
*/
function quoteCtrl($scope, quote, $location, Restangular, $cookieStore, $route) {
    //TODO Need to render error if the quote is not found.
    $scope.quote = quote;
    //Don't work out view logic if the quote could not be found
    if(quote.show){
        //Let's add in some plurlisation and ability to view incidents
        $scope.claimText = ($scope.quote.incidents.length > 1 || $scope.quote.incidents.length == 0) ? "Incidents" : "Incident";
        //Some custom formatting for boolean values
        $scope.quote.body.breakdownCover = ($scope.quote.body.breakdownCover == true) ? "Yes" : "No";
        $scope.quote.body.windscreenCover = ($scope.quote.body.windscreenCover == true) ? "Yes" : "No";
    }
}

/*
* Quote Resolver
* This resolver ensures all the relevant data is resolved before the view is populated.
*/
quoteCtrl.resolve = {
    
//  TODO Need to add in validation from the emailz as well
    quote: function($q, Restangular, $cookieStore, $route){
        //Check to see if I'm pulling in a quote from the search or a users generated quote, and then set the appropriate variables.
        var id = ($route.current.params.id == undefined) ? $cookieStore.get('quote_id') : $route.current.params.id;
        var email = ($route.current.params.email == undefined) ? $cookieStore.get('customer_email') : $route.current.params.email;
        
        var deferred = $q.defer();
        //Get all the quote details and return those to the view
        Restangular.one('quote', email).one(id).get().then(function(quote){
            quote.show = (quote.customer != null && quote.body != null) ? true : false;
            deferred.resolve(quote);
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
        location = location.split("/");
        if (location[1] == path ) {
          return "active"
        } else {
          return ""
        }
   }
}
