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
    .controller('ofertaController',['$scope','$http','ofertaService',function($scope,$http,ofertaService){
        var cidade = localStorage.getItem('cidade');
        if ((cidade!=null)&&(cidade!=undefined)){
            $scope.cidadeAtual = 'Cidade: '+cidade;
        }
        $scope.buscarCidades = function(){
            ofertaService.retornarCidades()
                .success(function(retorno){
                    console.log(retorno);
                    $scope.listaCidades = retorno.sort();
                    $scope.listaCidades.push('Ver Todas');
                })
        }
        $scope.buscarOfertas = function(){
            ofertaService.retornarOfertas()
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
        $scope.verDetalhesOferta = function(oferta){
            localStorage.setItem('oferta',JSON.stringify(oferta));
            location.href = 'detalhesoferta.html';
        }
        $scope.buscarOferta = function(){
            $scope.oferta = JSON.parse(localStorage.getItem('oferta'));
            $scope.quantidade = 1;
            $scope.oferta.valorcupom = $scope.oferta.valorcupom.replace(',','.');
            var valor = parseFloat($scope.oferta.valorcupom).toFixed(2);
            $scope.valorTotal = parseFloat($scope.quantidade*valor).toFixed(2).replace('.',',');
        }
        $scope.botaoComprar = function(){
            var usuario = JSON.parse(localStorage.getItem('usuario'));
            if ((usuario==undefined)||(usuario==null)){
                location.href = 'entrar.html';
            }else{
                location.href = 'finalizarcompra.html';
            }
        }
        $scope.mudarQuantidade = function(sinal){
            if (sinal=='menos'){
                if ($scope.quantidade!=1){
                    $scope.quantidade = $scope.quantidade-1;
                    $scope.oferta.valorcupom = $scope.oferta.valorcupom.replace(',','.');
                    var valor = parseFloat($scope.oferta.valorcupom).toFixed(2);
                    $scope.valorTotal = parseFloat($scope.quantidade*valor).toFixed(2).replace('.',',');
                }
            }else{
                $scope.quantidade = $scope.quantidade+1;
                $scope.oferta.valorcupom = $scope.oferta.valorcupom.replace(',','.');
                var valor = parseFloat($scope.oferta.valorcupom).toFixed(2);
                $scope.valorTotal = parseFloat($scope.quantidade*valor).toFixed(2).replace('.',',');
            }
        }
        $scope.finalizarCompra = function(){
            document.getElementById('enviar').style.display = 'none';
            document.getElementById('enviando').style.display = 'block';
            var dia = new Date().getDate();
            var mes = new Date().getMonth()+1;
            var ano = new Date().getFullYear();
            if (dia<=9){dia='0'+dia}
            if (mes<=9){mes='0'+mes}
            var data = dia+'/'+mes+'/'+ano;
            var compra = {
                idOferta: $scope.oferta._id,
                oferta: $scope.oferta.titulo,
                status: 'Aguardando Pagamento',
                dataCompra: data,
                quantidade: $scope.quantidade,
                valor: $scope.valorTotal,
                emailComprador: $scope.usuario.email,
                codigoCompra:'',
                cupom:''
            }
            ofertaService.finalizarCompra(compra)
                .success(function(retorno){
                    $scope.resposta = retorno.resposta;
                    if (retorno.status==1){
                        document.getElementById('erro').style.display = 'block';
                    }else{
                        location.href = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code='+retorno.codigo;
                    }
                    document.getElementById('enviar').style.display = 'block';
                    document.getElementById('enviando').style.display = 'none';
                })
        }
    }])
    .controller('usuarioController',['$scope','$http','usuarioService',function($scope,$http,usuarioService){
        $scope.usuario = {
            nome:'',
            email:'',
            sexo:'',
            cidade:'',
            estado:'',
            senha:'',
            confirma:''
        }
        $scope.cadastrarUsuario = function(){
            document.getElementById('enviar').style.display = 'none';
            document.getElementById('enviando').style.display = 'block';
            usuarioService.cadastrarUsuario($scope.usuario)
                .success(function(retorno){
                    document.getElementById('enviar').style.display = 'block';
                    document.getElementById('enviando').style.display = 'none';
                    $scope.respostaCadastro = retorno.resposta;
                    if (retorno.status==1){
                        document.getElementById('respostaErro').style.display = 'block';
                    }else{
                        localStorage.setItem('usuario', JSON.stringify(retorno.objeto));
                        var oferta = JSON.parse(localStorage.getItem('oferta'));
                        if ((oferta==null)||(oferta==undefined)){
                            location.href = 'painel.html';
                        }else{
                            location.href = 'finalizarcompra.html';
                        }
                    }
                })
        }
        $scope.validarUsuario = function(){
            var usuario = JSON.parse(localStorage.getItem('usuario'));
            if ((usuario==null)||(usuario==undefined)){
                location.href = 'entrar.html';
            }
        }
        $scope.verificarUsuarioLogado = function(){
            var usuario = JSON.parse(localStorage.getItem('usuario'));
            if ((usuario==null)||(usuario==undefined)){
                document.getElementById('nomeUsuario').style.display = 'none';
                document.getElementById('linkSair').style.display = 'none';
                document.getElementById('botaoEntrar').style.display = 'block';
            }else{
                document.getElementById('nomeUsuario').style.display = 'block';
                document.getElementById('linkSair').style.display = 'block';
                document.getElementById('botaoEntrar').style.display = 'none';
                $scope.nomeUsuario = usuario.nome;
                $scope.usuario = usuario;
            }
        }
        $scope.deslogarUsuario = function(){
            localStorage.removeItem('usuario');
            location.reload();
        }
        $scope.retirarOferta = function(){
            localStorage.removeItem('oferta');
        }
        $scope.logarUsuario = function(){
            document.getElementById('enviarLogin').style.display = 'none';
            document.getElementById('enviandoLogin').style.display = 'block';
            var novoUsuario = {
                email: $scope.email,
                senha: $scope.senha
            }
            usuarioService.logarUsuario(novoUsuario)
                .success(function(retorno){
                    document.getElementById('enviarLogin').style.display = 'block';
                    document.getElementById('enviandoLogin').style.display = 'none';
                    if (retorno.status==1){
                        $scope.respostaLogin = retorno.resposta;
                        document.getElementById('respostaErroLogin').style.display = 'block';
                    }else{
                        localStorage.setItem('usuario', JSON.stringify(retorno.objeto));
                        var oferta = JSON.parse(localStorage.getItem('oferta'));
                        if ((oferta==null)||(oferta==undefined)){
                            location.href = 'painel.html';
                        }else{
                            location.href = 'finalizarcompra.html';
                        }
                    }
                })
        }
        $scope.mudarDivPainel = function(div){
            document.getElementById('minhascompras').style.display = 'none';
            document.getElementById('meusdados').style.display = 'none';
            document.getElementById(div).style.display = 'block';
        }
        $scope.editarUsuario = function(){
            document.getElementById('enviar').style.display = 'none';
            document.getElementById('enviando').style.display = 'block';
            $scope.edicaoUsuario = $scope.usuario;
            if ($scope.senhaAtual==undefined){$scope.senhaAtual=''}
            if ($scope.novaSenha==undefined){$scope.novaSenha=''}
            if ($scope.confirmaNovaSenha==undefined){$scope.confirmaNovaSenha=''}
            $scope.edicaoUsuario['senhaAtual'] = $scope.senhaAtual;
            $scope.edicaoUsuario['novaSenha'] = $scope.novaSenha;
            $scope.edicaoUsuario['confirmaNovaSenha'] = $scope.confirmaNovaSenha;
            usuarioService.editarUsuario($scope.edicaoUsuario)
                .success(function(retorno){
                    document.getElementById('enviar').style.display = 'block';
                    document.getElementById('enviando').style.display = 'none';
                    $scope.respostaCadastro = retorno.resposta;
                    if (retorno.status==1){
                        document.getElementById('respostaErro').style.display = 'block';
                        document.getElementById('respostaSucesso').style.display = 'none';
                    }else{
                        document.getElementById('respostaErro').style.display = 'none';
                        $scope.usuario = retorno.objeto;
                        $scope.nomeUsuario = retorno.objeto.nome;
                        localStorage.setItem('usuario',JSON.stringify(retorno.objeto));
                        document.getElementById('respostaSucesso').style.display = 'block';
                    }
                })
        }
    }])

;