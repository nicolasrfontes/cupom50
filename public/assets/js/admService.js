angular.module('admService', [])
    .factory('aService',['$http',function($http){
        return {
            salvarOferta: function(objeto){
                return $http.post('/salvarOferta', objeto);
            },
            buscarTodosUsuarios: function(){
                return $http.get('/todosUsuarios');
            },
            editarCompra: function(usuario){
                return $http.post('/editarCompraUsuario',usuario);
            }
        }
    }])