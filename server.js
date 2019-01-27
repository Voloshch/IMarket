const express=require('express');
const mysql=require('mysql');
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
const path = require('path');
const mime = require('mime');
const exphbs = require('express-handlebars');

const app=express();
app.use('/', express.static('views'));
app.use('/dostavka', express.static('views'));
app.use('/categories', express.static('views'));
app.use('/countries', express.static('views'));

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: 'hbs' }));
app.set('view engine', '.hbs');
app.use(cookieParser());

/*app.use('/check', bodyParser.urlencoded({
    extended: true
}));*/
app.use('/reg', bodyParser.urlencoded({
    extended: true
}));
app.use('/prod', bodyParser.urlencoded({
    extended: true
}));
app.use('/auth', bodyParser.urlencoded({
    extended: true
}));
app.use('/dostavka', bodyParser.urlencoded({
    extended: true
}));

app.use('/category', bodyParser.urlencoded({
    extended: true
}));
app.use('/manufacturer', bodyParser.urlencoded({
    extended: true
}));

app.use('/addorder', bodyParser.urlencoded({
    extended: true
}));

app.use('/country', bodyParser.urlencoded({
    extended: true
}));

app.use('/productss', bodyParser.urlencoded({
    extended: true
}));

app.use('/product', bodyParser.urlencoded({
    extended: true
}));
app.use('/kabinets', bodyParser.urlencoded({
    extended: true
}));

const db=mysql.createConnection({
    host: '127.0.0.1:3306',
    user: 'root',
    password: 'root',
    database: 'magazin'
})



db.connect((err)=>{
    if(err){
         throw err;
    }
    console.log("MySQL connection...");
})

app.listen('3001', () => {
    console.log('Server started at port 3001')
});

app.get('/test', function(req,res,next){
    res.render('test');
})
app.get('/testajax', function(req,res,next){
    var arr4 = [];
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM orders', function (err, ord, fields) {
                if (err) {
                    console.log('Error');
                } else {

                    //var f=0;
                    for (i = 0; i < prod.length; i++) {
                        var f = 0;
                        for (j = 0; j < ord.length; j++) {
                            if (ord[j].prod_id == prod[i].id) {
                                f = f + ord[j].quantity;
                            }
                        }
                        arr4.push({
                            name: prod[i].name,
                            kol: f
                        })
                    }
                    console.log(arr4);
                    res.send(arr4);
                }
            });
        }
    })
})

app.get('/testajaxx', function(req,res,next){
    var arr4 = [];
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM orders', function (err, ord, fields) {
                if (err) {
                    console.log('Error');
                } else {

                    //var f=0;
                    for (i = 0; i < prod.length; i++) {
                        var f = 0;
                        for (j = 0; j < ord.length; j++) {
                            if (ord[j].prod_id == prod[i].id) {
                                f = f + Number(ord[j].cost);
                            }
                        }
                        arr4.push({
                            name: prod[i].name,
                            kol: f
                        })
                    }
                    console.log(arr4);
                    res.send(arr4);
                }
            });
        }
    })
})

app.get('/updateprod/:id', function(req,res,next){
    const { id } = req.params;
    var arr4 = [],manuf,categ,man_name,cat_name;
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM manufacturer', function(err, man, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    db.query('SELECT * FROM category', function (err, cat, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            for (i = 0; i < prod.length; i++) {
                                if (String(prod[i].id) == String([id])) {
                                    manuf=prod[i].manuf_id;
                                    categ=prod[i].category_id;
                                    for(var j=0;j<man.length;j++){
                                        if(Number(man[j].id)==Number(manuf)){
                                            man_name=man[j].name;
                                            break;
                                        }
                                    }
                                    for(var k=0;k<cat.length;k++){
                                        if(Number(cat[k].id)==Number(categ)){
                                            cat_name=man[j].name;
                                            break;
                                        }
                                    }
                                    arr4.push({
                                        id:prod[i].id,
                                        name: prod[i].name,
                                        manuf_id: man_name,
                                        category_id:cat_name,
                                        cost:prod[i].cost,
                                        quantity: prod[i].quantity,
                                        url:prod[i].urll,
                                        opis:prod[i].opis
                                    })
                                }

                            }
                        }
                        console.log(arr4);
                        var msg="";
                        res.render('productss', {msg: msg, manuf: man, category:cat ,izm:arr4});
                    })
                }
            })
        }
    })
})

app.get('/deletecountry/:id', async (req, res) => {
    const { id } = req.params;
    var man_id,prod_id,flag=0,ordd=0,bass=0;
    db.query('DELETE FROM country WHERE id = ?', [id]);

    res.redirect('/countries');
});

app.get('/deletecategory/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM category WHERE ID = ?', [id]);
    //req.flash('success', 'Link Removed Successfully');
    res.redirect('/categories');
});

app.get('/deletemanuf/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM manufacturer WHERE ID = ?', [id]);
    res.redirect('/manufacturers');
});

app.get('/deleteprod/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM product WHERE ID = ?', [id]);
    //req.flash('success', 'Link Removed Successfully');
    res.redirect('/products');
});

app.get('/deleteprodbasket/:id', async (req, res) => {
    var cook = req.cookies.token;
    const {id} = req.params;
    db.query('SELECT * FROM user', function (err, user) {
        if (err) {
            console.log('Error');
        } else {
            for (var i = 1; i < user.length; i++) {
                if (String(user[i].email) == String(cook)) {
                    idd = user[i].id;
                    console.log("idd = " + idd)
                    break;
                }
            }
            db.query('SELECT * FROM basket', function (err, bask) {
                if (err) {
                    console.log('Error');
                } else {
                    for (var k = 0; k < bask.length; k++) {
                        if (String(bask[k].prod_id) == String([id]) && String(bask[k].user_id) == String(idd)) {
                            console.log("udalyaem element " + [id]);
                            db.query('DELETE FROM basket WHERE prod_id = ?', [id]);
                        }
                    }
                }
            })
        }
    })
    res.redirect('/katalog');
});

app.get('/deletefrombasket/:id', async (req, res) => {
    var cook = req.cookies.token;
    const {id} = req.params;
    db.query('SELECT * FROM user', function (err, user) {
        if (err) {
            console.log('Error');
        } else {
            for (var i = 1; i < user.length; i++) {
                if (String(user[i].email) == String(cook)) {
                    idd = user[i].id;
                    console.log("idd = " + idd)
                    break;
                }
            }
            db.query('SELECT * FROM basket', function (err, bask) {
                if (err) {
                    console.log('Error');
                } else {
                    for (var k = 0; k < bask.length; k++) {
                        if (String(bask[k].prod_id) == String([id]) && String(bask[k].user_id) == String(idd)) {
                            console.log("udalyaem element " + [id]);
                            db.query('DELETE FROM basket WHERE prod_id = ?', [id]);
                        }
                    }
                }
            })
        }
    })
    res.redirect('/kabinet');
});

app.get('/deleteuser/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM user WHERE ID = ?', [id]);
    //req.flash('success', 'Link Removed Successfully');
    res.redirect('/users');
});



app.get('/addtobasket/:id', async (req, res)=> {
    var cook = req.cookies.token;
    console.log("cook = "+cook);
    console.log(req.cookies.token);
    console.log(req.params);
    const {id} = req.params;
    console.log("!!!!!!!!!!!");
    console.log([id]);
    console.log(req.params);
    var idd,prod,flag=0;
    if (req.cookies.token) {
        console.log("hzhzhzhzhzhzhzhz");
        db.query('SELECT * FROM user', function (err, user) {
            if (err) {
                console.log('Error');
            } else {
                for (var i = 1; i < user.length; i++) {
                    if (String(user[i].email) == String(cook)) {
                        idd = user[i].id;
                        console.log("idd = "+idd)
                        break;
                    }
                }
                db.query('SELECT * FROM basket', function (err, bask) {
                    if (err) {
                        console.log('Error');
                    } else {
                        for (var k = 0; k < bask.length; k++) {
                            if (String(bask[k].prod_id) == String([id])&&String(bask[k].user_id)==String(idd)) {

                                flag = 1;
                                break;
                            }
                        }
                        if(flag==0) {
                            console.log("flag= "+flag);
                            db.query('SELECT * FROM product', function (err, pr) {
                                if (err) {
                                    console.log('Error');
                                } else {
                                    for (var j = 0; j < pr.length; j++) {
                                        if (String(pr[j].id) == String([id])) {
                                            prod = pr[j].cost;
                                            break;
                                        }
                                    }
                                    var pos = {
                                        prod_id: [id],
                                        user_id: idd,
                                        quantity: 1,
                                        cost: prod
                                    };
                                    let sql = 'INSERT INTO basket SET ?';
                                    db.query(sql, pos, (err, result) => {
                                        if (err)throw err;

                                        res.redirect('/katalog');

                                    });
                                }
                            })
                        }else {
                            console.log("flag= "+flag);
                            var msg="Такой товар уже в корзине";
                            res.render('msg', {msg:msg});
                        }




                    }

                })
            }
        });
    }else if(!req.cookies.token){
        console.log("okokokokokok");
        var msg="Войдите либо зарегистрируйтесь";
        res.render('msg', {msg:msg});
    }
});

app.get('/msg', function(req, res) {
    console.log(req.cookies);
    var msg="";
    res.render('msg', {msg:msg});
});


app.get('/katalog', function(req, res) {
    var msg = "";
    var arr = [];
    var cook = req.cookies.token;
    const {id} = req.params;
    var idd, prod, flag = 0;

        db.query('SELECT * FROM user', function (err, user) {
            if (err) {
                console.log('Error');
            } else {
                console.log(typeof user);
                for (var i = 1; i < user.length; i++) {
                    if (String(user[i].email) == String(cook)) {
                        idd = user[i].id;//id пользователя
                        break;
                    }
                }
                db.query('SELECT * FROM product', function (err, prod, fields) {
                    if (err) {
                        console.log('Error');
                    } else {
                        db.query('SELECT * FROM basket', function (err, bask) {
                            if (err) {
                                console.log('Error');
                            } else {
                                for (var j = 0; j < prod.length; j++) {
                                    var ff = 0;
                                    for (var k = 0; k < bask.length; k++) {
                                        //if (String(bask[k].prod_id)==String(idd)) {
                                        if (String(bask[k].prod_id) == String(prod[j].id) && bask[k].user_id == idd) {
                                            ff = 1;
                                            arr.push({
                                                id:prod[j].id,
                                                name: prod[j].name,
                                                cost:prod[j].cost,
                                                udalit: "1",
                                                dobavit: "",
                                                ulr: prod[j].urll
                                            })
                                        }


                                    }
                                    if (ff == 0&&cook) {
                                        arr.push({
                                            id:prod[j].id,
                                            name: prod[j].name,
                                            cost:prod[j].cost,
                                            udalit: "",
                                            dobavit: "1",
                                            ulr: prod[j].urll
                                        })
                                    }else if(ff == 0&&!cook){
                                        arr.push({
                                            id:prod[j].id,
                                            name: prod[j].name,
                                            cost:prod[j].cost,
                                            udalit: "",
                                            dobavit: "",
                                            ulr: prod[j].urll
                                        })
                                    }

                                }
                                console.log(arr);
                                res.render('katalog', {msg: msg, prod: arr});
                            }


                        })
                    }
                })
            }
        })



})
app.get('/prod/:id', async (req, res)=> {
    const {id} = req.params;
    var obj=[];
        db.query('SELECT * FROM product', function (err, prod) {
            if (err) {
                console.log('Error');
            } else {
                for(var i=0;i<prod.length;i++){
                    if(prod[i].id==[id]){
                        obj.push({
                            name:prod[i].name,
                            cost:prod[i].cost,
                            ulr:prod[i].urll,
                            opis:prod[i].opis
                        });
                        break;
                    }
                }
                res.render('prod',{obj:obj})
            }
            console.log(obj);
        })
})
app.get('/', function(req, res) {
    console.log(req.cookies);
    var msg = "";
    var arr = [];
    var cook = req.cookies.token;
    console.log(req.cookies.token);
    console.log(req.params);
    const {id} = req.params;
    console.log([id]);
    console.log(req.params);
    var idd, prod, flag = 0;

    db.query('SELECT * FROM user', function (err, user) {
        if (err) {
            console.log('Error');
        } else {
            for (var i = 1; i < user.length; i++) {
                if (String(user[i].email) == String(cook)) {
                    idd = user[i].id;//id пользователя
                    break;
                }
            }
            db.query('SELECT * FROM product', function (err, prod, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    db.query('SELECT * FROM basket', function (err, bask) {
                        if (err) {
                            console.log('Error');
                        } else {
                            for (var j = 0; j < prod.length; j++) {
                                var ff = 0;
                                for (var k = 0; k < bask.length; k++) {
                                    //if (String(bask[k].prod_id)==String(idd)) {
                                    if (String(bask[k].prod_id) == String(prod[j].id) && bask[k].user_id == idd) {
                                        ff = 1;
                                        arr.push({
                                            id:prod[j].id,
                                            name: prod[j].name,
                                            cost:prod[j].cost,
                                            udalit: "1",
                                            dobavit: "",
                                            ulr: prod[j].urll
                                        })
                                    }


                                }
                                if (ff == 0&&cook) {
                                    arr.push({
                                        id:prod[j].id,
                                        name: prod[j].name,
                                        cost:prod[j].cost,
                                        udalit: "",
                                        dobavit: "1",
                                        ulr: prod[j].urll
                                    })
                                }else if(ff == 0&&!cook){
                                    arr.push({
                                        id:prod[j].id,
                                        name: prod[j].name,
                                        cost:prod[j].cost,
                                        udalit: "",
                                        dobavit: "",
                                        ulr: prod[j].urll
                                    })
                                }

                            }
                            var msg=req.cookies.token;
                            res.render('index1', {msg: msg, prod: arr});
                        }


                    })
                }
            })
        }
    })

});


app.get('/registration', function(req, res) {
    var msg="";
    res.render('registration',{msg:msg});
});

app.get('/kabinet', function(req, res) {
    var cook = req.cookies.token;
    var idd;
    var arr=[],arr2=[];
    db.query('SELECT * FROM user', function (err, user) {
        if (err) {
            console.log('Error');
        } else {
            for (var k = 1; k < user.length; k++) {
                if (String(user[k].email) == String(cook)) {
                    idd = user[k].id;
                    break;
                }
            }
            db.query('SELECT * FROM basket', function (err, bask) {
                if (err) {
                    console.log('Error');
                } else {
                    db.query('SELECT * FROM product', function (err, prod) {
                        if (err) {
                            console.log('Error');
                        } else {
                            for (var i = 0; i < bask.length; i++) {
                                if (String(bask[i].user_id) == String(idd)) {
                                    for (var j = 0; j < prod.length; j++) {
                                        if (String(bask[i].prod_id) == String(prod[j].id)) {
                                            arr.push({
                                                id:prod[j].id,
                                                name: prod[j].name,
                                                cost: bask[i].cost
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        db.query('SELECT * FROM orders', function (err, ord) {
                            if (err) {
                                console.log('Пиздак');
                                console.log('Error');
                            } else {
                                for (var j = 0; j < ord.length; j++) {
                                    if (String(ord[j].user_id) == String(idd)) {
                                        //console.log("id polz = "+idd);
                                        for (var l = 0; l < prod.length; l++) {
                                            if (String(ord[j].prod_id) == String(prod[l].id)) {
                                                //console.log("id tovara = "+)
                                                arr2.push({
                                                    id:ord[j].id,
                                                    name: prod[l].name,
                                                    cost: ord[j].cost,
                                                    quantity: ord[j].quantity
                                                })
                                            }
                                        }
                                    }
                                }
                                res.render('kabinet', {arr: arr,arrr:arr2})
                            }
                        })
                    })
                }
            })
        }
    })
})

app.get('/authorization', function(req, res) {
    var msg="";
    res.render('author',{msg:msg});
});

app.get('/dostavka', function(req, res) {
    console.log(req.cookies);
    res.render('dostavka');
});

app.get('/users', function(req, res) {
    var arr=[];
    db.query('SELECT * FROM user', function(err, user, fields) {
        if (err) {
            console.log('Error');
        } else {
            for(var i=1;i<user.length;i++){
                if(String(user[i].role)!='ADMIN'){
                    arr.push({
                        id:user[i].id,
                        email:user[i].email,
                        name:user[i].name,
                        lastname:user[i].lastname,
                        phone:user[i].phone
                    })
                }
            }
            res.render('users', {user: arr});
        }
    })
});

app.get('/kontact', function(req, res) {
    console.log(req.cookies);
    res.render('kontact');
});

app.get('/manufacturers', function(req, res) {
    db.query('SELECT * FROM country', function(err, countr, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM manufacturer', function (err, manuf, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    let msg = "";
                    res.render('manufacturers', {msg: msg, posts: countr, manuf: manuf});
                }
            });
        }
    });
});

app.get('/categories', function(req, res) {
    db.query('SELECT * FROM category', function(err, posts, fields) {
        if (err) {
            console.log('Error');
        } else {
            let msg = "";
            res.render('categories', {msg: msg,posts:posts});
        }
    });
});

app.get('/countries', function(req, res) {
    db.query('SELECT * FROM country', function(err, posts, fields) {
        if (err) {
            console.log('Error');
        } else {
            let msg = "";
            res.render('countries', {msg: msg,posts:posts});
        }
    });
});

app.get('/orders', function(req, res) {
    var obj=[];
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM user', function (err, user, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    for(var i=1;i<user.length;i++){
                        obj.push({
                            id:user[i].id,
                            email:user[i].email
                        })
                    }
                    db.query('SELECT * FROM orders', function (err, ord, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            res.render('orders', {ord: ord,prod:prod,user:obj});
                        }
                    })
                }
            })
        }
    })
});

app.get('/deleteorder/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM orders WHERE ID = ?', [id]);
    //req.flash('success', 'Link Removed Successfully');
    res.redirect('/orders');
});
app.get('/deleteorderr/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM orders WHERE ID = ?', [id]);
    //req.flash('success', 'Link Removed Successfully');
    res.redirect('/kabinet');
});
app.get('/products', function(req, res) {
    db.query('SELECT * FROM category', function(err, category, fields) {
        if (err) {
            console.log('Error');
        } else {
            db.query('SELECT * FROM manufacturer', function (err, manufact, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    db.query('SELECT * FROM product', function (err, product, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            let msg = "";
                            res.render('products', {msg: msg, prod: product, manuf: manufact, category:category});
                        }
                    })
                }
            });
        }
    });
});


app.post('/product', function(req, res, next) {
    console.log(req.body);
    var name = req.body.prod;
    var manuf = req.body.manuf;
    var categ = req.body.categ;
    var cost = req.body.cost;
    var quant = req.body.quantity;
    var kart = req.body.kart;
    var area = req.body.area;
    var flag=0;
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<prod.length;i++){
                if(String(prod[i].name)===String(name)){
                    flag=1;
                    console.log("qwertyuiuytertyu");
                    break;
                }
            }
            if(flag==1){
                db.query('SELECT * FROM manufacturer', function(err, manufact, fields) {
                    if (err) {
                        console.log('Error');
                    } else {
                        db.query('SELECT * FROM category', function(err, category, fields) {
                            if (err) {
                                console.log('Error');
                            } else {
                                var msg = "Такой производитель уже есть";
                                res.render('products', {msg: msg, prod: prod, manuf: manufact, category:category});
                            }
                        })
                    }
                });
            }
            else if(flag==0){
                let post = {
                    name: name,
                    manuf_id: manuf,
                    category_id:categ,
                    cost:cost,
                    quantity:quant,
                    urll:kart,
                    opis:area
                };
                let sql = 'INSERT INTO product SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    console.log(result);
                    db.query('SELECT * FROM product', function(err, product, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            db.query('SELECT * FROM manufacturer', function(err, manufact, fields) {
                                if (err) {
                                    console.log('Error');
                                } else {
                                    db.query('SELECT * FROM category', function(err, category, fields) {
                                        if (err) {
                                            console.log('Error');
                                        } else {
                                            let msg = "";
                                            res.render('products', {msg: msg, prod: product, manuf: manufact, category:category});
                                        }
                                    })
                                }
                            });
                        }
                    });
                })
            }

        }
    });

    return;
});

app.post('/productss', function(req, res, next) {
    console.log("!!!!!!");
    console.log(req.body);
    console.log("!!!!!!");
    var name = req.body.prod;
    var manuf = req.body.manuf;
    var categ = req.body.categ;
    var cost = req.body.cost;
    var quant = req.body.quantity;
    var kart = req.body.kart;
    var area = req.body.area;
    var idd;
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<prod.length;i++){
                if(String(prod[i].name)===String(name)){
                    idd=prod[i].id;
                    break;
                }
            }
            db.query("UPDATE product SET name = ?, manuf_id=?, category_id=?, cost=?, quantity=?, urll=?, opis=? WHERE id = ?",[name, manuf, categ, cost, quant, kart, area,idd], function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
            });
            db.query('SELECT * FROM manufacturer', function(err, manufact, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    db.query('SELECT * FROM category', function (err, category, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            //let msg = "";
                            res.redirect('/products');
                        }
                    })
                }
            })
        }
    });
    return;
});

app.post('/manufacturer', function(req, res, next) {
    console.log(req.body);
    var nameCat = req.body.cat;
    var country = req.body.count;
    var flag=0;
    db.query('SELECT * FROM manufacturer', function(err, manuf, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<manuf.length;i++){
                if(String(manuf[i].name)===String(nameCat)){
                    flag=1;
                    console.log("qwertyuiuytertyu");
                    break;
                }
            }
            if(flag==1){
                db.query('SELECT * FROM country', function(err, countr, fields) {
                    if (err) {
                        console.log('Error');
                    } else {
                        var msg = "Такой производитель уже есть";
                        res.render('manufacturers', {msg: msg, posts: countr, manuf: manuf});
                    }
                });
            }
            else if(flag==0){
                let post = {
                    name: nameCat,
                    country_id: country
                };
                let sql = 'INSERT INTO manufacturer SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    console.log(result);
                    db.query('SELECT * FROM manufacturer', function(err, manuf, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            db.query('SELECT * FROM country', function(err, countr, fields) {
                                if (err) {
                                    console.log('Error');
                                } else {
                                    let msg = "";
                                    res.render('manufacturers', {msg: msg, posts: countr, manuf: manuf});
                                }
                            });
                        }
                    });
                });
            }

        }
    });

    return;
});


app.post('/category', function(req, res, next) {
    console.log(req.body);
    var nameCat = req.body.cat;
    var flag=0;
    db.query('SELECT * FROM category', function(err, rows, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<rows.length;i++){
                if(String(rows[i].name)===String(nameCat)){
                    flag=1;
                    console.log("qwertyuiuytertyu");
                    break;
                }
            }
            if(flag==1){
                var msg="Такая категория уже есть";
                res.render('categories',{msg: msg,posts:rows});
            }
            else if(flag==0){
                let post = {
                    name: nameCat
                };
                let sql = 'INSERT INTO category SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    console.log(result);
                    db.query('SELECT * FROM category', function(err, post, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            let msg = "";
                            res.render('categories', {msg: msg, posts: post});
                        }
                    });
                });
            }

        }
    });

    return;
});

app.post('/country', function(req, res, next) {
    //console.log(req.body);
    console.log(req.cookies);
    var nameCat = req.body.country;
    var flag=0;
    db.query('SELECT * FROM country', function(err, rows, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<rows.length;i++){
                if(String(rows[i].name)===String(nameCat)){
                    flag=1;
                    console.log("qwertyuiuytertyu");
                    break;
                }
            }
            if(flag==1){
                var msg="Такая категория уже есть";
                res.render('countries',{msg: msg,posts:rows});
            }
            else if(flag==0){
                let post = {
                    name: nameCat
                };
                let sql = 'INSERT INTO country SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    console.log(result);
                    db.query('SELECT * FROM country', function(err, post, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            let msg = "";
                            res.render('countries', {msg: msg, posts: post});
                        }
                    });
                });
            }

        }
    });

    return;
});


app.post('/kabinets/:id', function(req, res, next) {
    const { id } = req.params;
    var kol=Number(Object.values(req.body)[0]);
    var cook = req.cookies.token;
    var idd;
    var cost,sum,num,msg,kolvo,nov;
    console.log([id]);
    console.log(Object.values(req.body)[0]);
    db.query('SELECT * FROM user', function (err, user) {
        if (err) {
            console.log('Error');
        } else {
            for (var k = 1; k < user.length; k++) {
                if (String(user[k].email) == String(cook)) {
                    idd = user[k].id;
                    break;
                }
            }
            db.query('SELECT * FROM product', function(err, rows, fields) {
                if (err) {
                    console.log('Error');
                } else {
                    for(var i=0;i<rows.length;i++){
                        if(String(rows[i].id)==String([id])){
                            num=rows[i].id;
                            cost=rows[i].cost;
                            break;
                        }
                    }
                    sum=String(Number(cost)*Number(kol));

                    db.query('SELECT * FROM product', function(err, pro, fields) {
                        if (err) {
                            console.log('Error');
                        } else {
                            for(var k=0;k<pro.length;k++){
                                if(pro[k].id==num){
                                    kolvo=pro[k].quantity;
                                    break;
                                }
                            }

                            if (Number(kolvo) >= Number(kol)) {
                                console.log("Est");
                                let post = {
                                prod_id: num,
                                user_id: idd,
                                quantity: kol,
                                cost: sum
                            };
                            let sql = 'INSERT INTO orders SET ?';
                            db.query(sql, post, (err, result) => {
                                if (err)throw err;
                                msg="Товар успешно заказан";
                                res.render('zakaz',{msg:msg})
                            })
                                nov=Number(kolvo)-Number(kol);
                                db.query("UPDATE product SET quantity = ? WHERE id = ?",[nov,num], function (err, result) {
                                    if (err) throw err;
                                    console.log(result.affectedRows + " record(s) updated");
                                });
                        }
                        else {
                                console.log("Net")
                                msg="Такого количества товара нет на складе";
                                res.render('zakaz',{msg:msg})
                            }
                        }
                    })
                }
            })
        }
    })
    return;
})

app.post('/', function(req, res, next) {
    console.log("33333");
    console.log(req.cookies.token);
    console.log("333333");
    var msg="";
    res.render('index1', {msg:msg});
    return;
});

app.post('/reg', function(req, res, next) {
    var loginn = req.body.text1;
    var flag=0;
    db.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<rows.length;i++){
                if(rows[i].email===loginn){
                    flag=1;
                    console.log("qwertyuiuytertyu");
                    break;
                }
            }
            if(flag==1){
                var msg="Такая почта уже используется";
                res.render('registration',{msg:msg});
                 }
            else if(flag==0){
                var passwordd = req.body.text5;
                var name = req.body.text2;
                var lastname = req.body.text3;
                var phone_number = req.body.text4;
                var role = "USER";
                let post = {
                    email: loginn,
                    password: passwordd,
                    name: name,
                    lastname: lastname,
                    phone: phone_number,
                    role: role
                };
                let sql = 'INSERT INTO user SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    console.log(result);
                    //res.cookie('token', result.data.token);
                    res.cookie('token', loginn);
                    res.redirect('/');
                    //res.send('Posts 1 added...');
                })
            }

        }
    });

    return;
});

app.post('/auth', function(req, res, next) {
    var loginn = req.body.text1;
    var pas = req.body.text2;
    var flag=0;
    db.query('SELECT * FROM user', function(err, rows, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<rows.length;i++){

                if(rows[i].email==loginn){

                    if(String(rows[i].password)==String(pas)&&String(rows[i].role)==="USER"){console.log("qqqqqqqqqqqqqqqqqqq");flag=1; break;}
                    else if(String(rows[i].password)==String(pas)&&String(rows[i].role)==="ADMIN"){console.log("11111111");flag=2; break;}
                    //res.sendFile('C:/Users/home-pc/Desktop/Kursachik/views/registr.html');
                }

            }
            console.log(flag);
            if(flag==1){res.cookie('token', loginn);res.redirect('/');}
            else if(flag==2){res.render('admin_menu');}
            else {
                var msg = "Неверный логин или пароль";
                res.render('author', {msg: msg});
            }

        }
    });

    return;
});


app.post('/addorder', function(req, res, next) {
    var prodd = req.body.prodd;
    var email = req.body.email;
    var quant = req.body.quant;

    var ppp;
    var flag=0,price;
    db.query('SELECT * FROM product', function(err, prod, fields) {
        if (err) {
            console.log('Error');
        } else {
            console.log('re');
            for(var i=0;i<prod.length;i++){
                if(Number(prod[i].id)==Number(prodd)){
                    ppp=prod[i].cost;
                    console.log("KOL")
                    console.log(prod[i].quantity)
                    if(prod[i].quantity>quant){
                        console.log(prod[i].quantity)
                        console.log("NORM")
                        flag=1;
                    }
                    break;
                }
            }

            if(flag==0){
                var msg="Такого количества товара нет на складе";
                res.render('msgg', {msg: msg});
            }
            else if (flag==1){
                price=Number(ppp)*quant;
                let post = {
                    prod_id: prodd,
                    user_id: email,
                    quantity: quant,
                    cost: price
                };
                let sql = 'INSERT INTO orders SET ?';
                let query = db.query(sql, post, (err, result) => {
                    if (err)throw err;
                    res.redirect('/orders');
                    //res.send('Posts 1 added...');
                })
            }

        }
    });

    return;
});



