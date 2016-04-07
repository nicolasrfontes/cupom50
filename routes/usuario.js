var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/cupom50", {native_parser: true});

exports.cadastrarUsuario = function (req, res) {
    var usuario = {
        nome: req.body.nome,
        email: req.body.email,
        sexo: req.body.sexo,
        cidade: req.body.cidade,
        estado: req.body.estado,
        senha: req.body.senha,
        compras: []
    }
    if ((usuario.nome == '') || (usuario.email == '') || (usuario.sexo == '') || (usuario.cidade == '') || (usuario.estado == '') || (usuario.senha == '')) {
        res.send({status: 1, resposta: 'Todos os campos são obrigatórios'});
    } else {
        if (usuario.senha.length > 6) {
            res.send({status: 1, resposta: 'Senha deve ter mínimo de 6 caracteres'});
        } else {
            if (usuario.senha != req.body.confirma) {
                res.send({status: 1, resposta: 'Confirme a senha corretamente'});
            } else {
                db.collection('usuario').findOne({'email': usuario.email}, function (err, buscaUsuario) {
                    if ((buscaUsuario == null) || (buscaUsuario == undefined)) {
                        db.collection('usuario').insert(usuario, function (err, usuarioCadastrado) {
                            var email = require("emailjs");
                            var server = email.server.connect({
                                user: "cupom50@gmail.com",/////colocar email cupom50
                                password: "nicolas165044",/////colocar senha cupom50
                                host: "smtp.gmail.com",
                                ssl: true
                            });
                            server.send({
                                from: "cupom50@gmail.com",
                                to: usuario.email,
                                subject: "Cadastro com Sucesso no Cupom50",
                                text: " Olá " + usuario.nome + "\n" +
                                " Seu cadastro foi feito com sucesso em nossa plataforma. \n" +
                                " A partir de agora fique ligados em todas promoções que lançaremos! Também te enviaremos por e-mail sempre que houver uma nova promoção em sua cidade! \n\n" +
                                " Cupom50 | Tudo por 50% de desconto"
                            }, function (err, message) {
                                res.send({
                                    status: 2,
                                    resposta: 'Cadastro feito com sucesso!',
                                    objeto: usuarioCadastrado.ops[0]
                                });
                            });
                        })
                    } else {
                        res.send({status: 1, resposta: 'E-mail já está cadastrado.'});
                    }
                })
            }
        }
    }
};

exports.logarUsuario = function (req, res) {
    if ((req.body.email == '') || (req.body.senha == '')) {
        res.send({status: 1, resposta: 'Há campos em branco'})
    } else {
        db.collection('usuario').findOne({'email': req.body.email, 'senha': req.body.senha}, function (err, usuario) {
            if ((usuario == null) || (usuario == undefined)) {
                res.send({status: 1, resposta: 'Email/Senha não encontrado!'});
            } else {
                delete usuario.senha;
                res.send({status: 2, objeto: usuario});
            }
        })
    }
};

exports.editarUsuario = function (req, res) {
    db.collection('usuario').findOne({'email': req.body.email}, function (err, usuario) {
        if ((usuario == null) || (usuario == undefined)) {
            res.send({status: 1, resposta: 'Este e-mail não está cadastrado'});
        } else {
            if (req.body.senhaAtual != '') {
                if (req.body.senhaAtual != usuario.senha) {
                    res.send({status: 1, resposta: 'Senha atual inválida'});
                } else {
                    if (req.body.novaSenha.length < 6) {
                        res.send({status: 1, resposta: 'Nova senha deve ter mínimo 6 caracteres'});
                    } else {
                        if (req.body.novaSenha != req.body.confirmaNovaSenha) {
                            res.send({status: 1, resposta: 'Confirme nova senha corretamente'});
                        } else {
                            if ((req.body.nome == '') || (req.body.sexo == '') || (req.body.cidade == '') || (req.body.estado == '')) {
                                res.send({status: 1, resposta: 'Todos os campos são obrigatórios'});
                            } else {
                                db.collection('usuario').update({'email': req.body.email}, {
                                    $set: {
                                        'nome': req.body.nome,
                                        'sexo': req.body.sexo,
                                        'cidade': req.body.cidade,
                                        'estado': req.body.estado,
                                        'senha': req.body.novaSenha
                                    }
                                }, function (err, usuarioEditado) {
                                    db.collection('usuario').findOne({'email': req.body.email}, function (err, usuarioEditado) {
                                        delete usuarioEditado.senha;
                                        res.send({status: 2, resposta: 'Dados editados', objeto: usuarioEditado});
                                    })
                                })
                            }
                        }
                    }
                }
            } else {
                if ((req.body.nome == '') || (req.body.sexo == '') || (req.body.cidade == '') || (req.body.estado == '')) {
                    res.send({status: 1, resposta: 'Todos os campos são obrigatórios'});
                } else {
                    db.collection('usuario').update({'email': req.body.email}, {
                        $set: {
                            'nome': req.body.nome,
                            'sexo': req.body.sexo,
                            'cidade': req.body.cidade,
                            'estado': req.body.estado
                        }
                    }, function (err, edicaoUsuario) {
                        db.collection('usuario').findOne({'email': req.body.email}, function (err, usuarioEditado) {
                            delete usuarioEditado.senha;
                            res.send({status: 2, resposta: 'Dados editados', objeto: usuarioEditado});
                        })
                    })
                }
            }
        }
    })
};

exports.finalizarCompra = function (req, res) {
    var pagseguro = require('pagseguro');
    var pag = new pagseguro({
        email: 'nicolas.rfontes@gmail.com',
        token: '594E47A96886469AB5452A7DD3695452',
        mode: 'sandbox'
    });

    pag.currency('BRL');
    pag.reference('12345');
    var valorFinal = req.body.valor.replace(',','.');
    var valorUnitario = parseFloat(valorFinal/req.body.quantidade).toFixed(2);
    pag.addItem({
        id: 1,
        description: req.body.oferta,
        amount: valorUnitario,
        quantity: req.body.quantidade
    });

    pag.buyer({
        name: 'José Comprador',
        email: 'c92147920332117434725@sandbox.pagseguro.com.br',
        phoneAreaCode: '51',
        phoneNumber: '12345678'
    });

    pag.setRedirectURL("http://localhost:3000/compraconcluida.html");////////////////URL de retorno para o usuário
    pag.setNotificationURL("http://localhost:3000/notificacao");

    pag.send(function(err, resposta) {
        if (err) {
            console.log(err);
        }
        var parseString = require('xml2js').parseString;
        console.log(resposta);
        var xml = resposta;
        parseString(xml, function (err, result) {
            console.log(result);
            var codigo = result.checkout.code[0];
            console.log(codigo);
            res.send({status:2,codigo:codigo});

        });
    });

    /*db.collection('usuario').findOne({'email':req.body.emailComprador}, function(err,usuario){
     if ((usuario==null)||(usuario==undefined)){
     res.send({status:1,resposta: 'Usuário não está logado!'});
     }else{
     var compra = {
     idOferta: req.body.idOferta,
     oferta: req.body.oferta,
     status: req.body.status,
     dataCompra: req.body.dataCompra,
     quantidade: req.body.quantidade,
     valor: req.body.valor
     }
     usuario.compras.push(compra);
     db.collection('usuario').update({'email':usuario.email},{$set:{'compras':usuario.compras}}, function(err,compraFeita){
     res.send({status:2,resposta: 'Compra efetuada com sucesso'});
     })
     }
     })*/
};

exports.notificacao = function(req,res){
    console.log(req);
    console.log(res);
    res.redirect('http://localhost:3000/index.html');
}