angular.module('mainController', [])
    .controller('anuncieController',['$scope','$http','anuncieService', function($scope, $http, anuncieService) {
        $scope.objetoAnuncie = {
            nome:'',
            email:'',
            telefone:'',
            empresa:'',
            segmento:'',
            site:'',
            endereco:'',
            cidade:'',
            estado:'',
            oferta:''
        }
        $scope.anunciar = function(){
            document.getElementById('enviar').style.display = 'none';
            document.getElementById('enviando').style.display = 'block';
            anuncieService.salvarAnuncio($scope.objetoAnuncie)
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