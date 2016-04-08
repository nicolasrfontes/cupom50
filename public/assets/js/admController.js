angular.module('admController', [])
    .controller('aController',['$scope','$http','aService', function($scope, $http, aService) {
        $scope.objetoOferta = {
            titulo:'',
            imagem:'',
            valorcupom:'',
            datafinal:'',
            descricao:'',
            infoLocal:'',
            img1:'',
            img2:'',
            img3:'',
            cidade:'',
            estado:''
        }
        $scope.salvarOferta = function(){
            document.getElementById('enviar').style.display = 'none';
            document.getElementById('enviando').style.display = 'block';
            aService.salvarOferta($scope.objetoOferta)
                .success(function(retorno){
                    document.getElementById('enviar').style.display = 'block';
                    document.getElementById('enviando').style.display = 'none';
                    $scope.respostaAnuncie = retorno.resposta;
                    if (retorno.status==1){
                        document.getElementById('respostaErro').style.display = 'block';
                    }else{
                        document.getElementById('respostaSucesso').style.display = 'block';
                    }
                })
        };
        $scope.buscarTodosUsuarios = function(){
            aService.buscarTodosUsuarios()
                .success(function(retorno){
                    $scope.usuarios = retorno;
                })
        }
        $scope.verComprasUsuario = function(usuario){
            localStorage.setItem('admUsuario',JSON.stringify(usuario));
            $scope.compras = usuario.compras;
        }
        $scope.editarCompra = function(compra){
            if (($scope.cupom!='')&&($scope.cupom!=undefined)) {
                compra.cupom = $scope.cupom;
            }
            if (($scope.status!='')&&($scope.status!=undefined)) {
                compra.status = $scope.status;
            }
            if (($scope.codigocompra!='')&($scope.codigocompra!=undefined)){
                compra.codigoCompra = $scope.codigocompra;
            }
            var usuario = JSON.parse(localStorage.getItem('admUsuario'));
            for(var i=0;i<usuario.compras.length;i++){
                if ((usuario.compras[i].idOferta==compra.idOferta)&&(usuario.compras[i].dataCompra==compra.dataCompra)&&(usuario.compras[i].valor==compra.valor)){
                    delete compra.$$hashKey;
                    usuario.compras[i] = compra;
                }
            }
            aService.editarCompra(usuario)
                .success(function(retorno){
                    if (retorno.status==1){
                        $scope.resposta = retorno.resposta;
                    }else{
                        location.reload();
                    }
                })
        }
    }])