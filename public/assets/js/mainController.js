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
    .controller('indexController',['$scope','$http','indexService',function($scope,$http,indexService){
        var cidade = localStorage.getItem('cidade');
        if ((cidade!=null)&&(cidade!=undefined)){
            $scope.cidadeAtual = 'Cidade: '+cidade;
        }
        $scope.buscarCidades = function(){
            indexService.retornarCidades()
                .success(function(retorno){
                    console.log(retorno);
                    $scope.listaCidades = retorno;
                    $scope.listaCidades.push('Ver Todas');
                })
        }
        $scope.buscarOfertas = function(){
            indexService.retornarOfertas()
                .success(function(retorno){
                    var cidade = localStorage.getItem('cidade');
                    if ((cidade==null)||(cidade==undefined)){
                        $scope.listaOfertas = retorno;
                    }else{
                        var listaOfertas = [];
                        retorno.forEach(function(item){
                            if (cidade==item.cidade){
                                listaOfertas.push(item);
                            }
                        })
                        $scope.listaOfertas = listaOfertas;
                    }
                })
        }
        $scope.cidadeFiltro = function(cidade){
            if (cidade=='Ver Todas'){
                localStorage.removeItem('cidade');
            }else{
                localStorage.setItem('cidade',cidade);
            }
            location.reload();
        }
    }]);