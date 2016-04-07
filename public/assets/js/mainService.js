angular.module('mainService', [])
    .factory('anuncieService',['$http',function($http){
        return {
            salvarAnuncio: function(objeto){
                return $http.post('/salvarAnuncio', objeto);
            }
        }
    }])
    .factory('indexService',['$http',function($http){
        return {
            retornarCidades: function(){
                return $http.get('/retornarCidades');
            },
            retornarOfertas: function(){
                return $http.get('/retornarOfertas');
            }
        }
    }])