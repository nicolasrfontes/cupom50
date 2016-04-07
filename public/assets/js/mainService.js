angular.module('mainService', [])
    .factory('anuncieService',['$http',function($http){
        return {
            salvarAnuncio: function(objeto){
                return $http.post('/salvarAnuncio', objeto);
            }
        }
    }])
    .factory('ofertaService',['$http',function($http){
        return {
            retornarCidades: function(){
                return $http.get('/retornarCidades');
            },
            retornarOfertas: function(){
                return $http.get('/retornarOfertas');
            },
            finalizarCompra: function(compra){
                return $http.post('/finalizarCompra',compra);
            }
        }
    }])
    .factory('usuarioService',['$http',function($http){
        return{
            cadastrarUsuario: function(usuario){
                return $http.post('/cadastrarUsuario',usuario);
            },
            logarUsuario: function(usuario){
                return $http.post('/logarUsuario',usuario)
            },
            editarUsuario: function(usuario){
                return $http.post('/editarUsuario',usuario)
            }
        }
    }]);