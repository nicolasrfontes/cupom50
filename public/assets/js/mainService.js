angular.module('mainService', [])
    .factory('anuncieService',['$http',function($http){
        return {
            salvarAnuncio: function(objeto){
                return $http.post('/salvarAnuncio', objeto);
            }
        }
    }])