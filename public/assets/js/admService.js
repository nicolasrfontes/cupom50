angular.module('admService', [])
    .factory('aService',['$http',function($http){
        return {
            salvarOferta: function(objeto){
                return $http.post('/salvarOferta', objeto);
            }
        }
    }])