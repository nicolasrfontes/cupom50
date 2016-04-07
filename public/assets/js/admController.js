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
        }
    }])