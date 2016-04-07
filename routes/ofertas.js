var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/cupom50", {native_parser: true});

exports.retornarCidades = function(req,res){
    db.collection('oferta').find().toArray(function(err,ofertas){
        var cidades = [];
        ofertas.forEach(function(item){
            if (cidades.length==0){
                cidades.push(item.cidade);
            }
            var tem = '';
            for(var i=0;i<cidades.length;i++){
                if (cidades[i]==item.cidade){
                    tem = 'ok';
                }
            }
            if (tem==''){
                cidades.push(item.cidade);
            }
        })
        res.send(cidades);
    })
};

exports.retornarOfertas = function(req,res){
    db.collection('oferta').find().toArray(function(err,ofertas){
        res.send(ofertas);
    })
}