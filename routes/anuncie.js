var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/cupom50", {native_parser: true});

exports.anunciarOferta = function(req,res){
    var objetoAnuncio = {
        nome: req.body.nome,
        email: req.body.email,
        telefone:req.body.telefone,
        empresa:req.body.empresa,
        segmento:req.body.segmento,
        site:req.body.site,
        endereco:req.body.endereco,
        cidade:req.body.cidade,
        estado:req.body.estado,
        oferta:req.body.oferta
    }
    if ((objetoAnuncio.nome=='')||(objetoAnuncio.email=='')||
        (objetoAnuncio.telefone=='')||(objetoAnuncio.empresa=='')||
        (objetoAnuncio.segmento=='')||(objetoAnuncio.endereco=='')||
        (objetoAnuncio.cidade=='')||(objetoAnuncio.estado=='')||
        (objetoAnuncio.oferta=='')){
        res.send({status:1,resposta:'Há campos obrigatórios em branco'});
    }else{
        db.collection('anuncio').insert(objetoAnuncio, function(err,objeto){
            var email   = require("emailjs");
            var server  = email.server.connect({
                user:    "nicolas.rfontes@gmail.com",
                password:"",/////colocar senha
                host:    "smtp.gmail.com",
                ssl:     true
            });
            server.send({
                from:    "nicolas.rfontes@gmail.com",
                to:      'nicolas.rfontes@gmail.com',
                subject: "Cupom50 - Novo Anuncio de Oferta",
                text: "Nome: "+objetoAnuncio.nome+" | Email: "+objetoAnuncio.email+" | Empresa: "+objetoAnuncio.empresa+" | Oferta: "+objetoAnuncio.oferta
            }, function(err, message) {
                res.send({status:2,resposta:'Seu anuncio foi salvo. Em breve entraremos em contato'});
            });
        })
    }
};

exports.salvarOferta = function(req,res){
    db.collection('oferta').insert(req.body, function(err,objeto){
        res.send({status:2,resposta:'Oferta anunciada com sucesso!'});
    })
}