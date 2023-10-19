/*
Republic of Ireland
Munster Technological University
Department of Computer Science

* Created by Dr. Paul Davern
* Updates:
- 20210319 - Comments and design.                                       # Jose Lo Huang
- 20210320 - Add the new product section.                               # Jose Lo Huang
- 20210321 - Add a section for first connection to avoid MySQL errors.  # Jose Lo Huang

This code will show all the available products or a specific product chosen by the user.
*/

// Modules required
var http = require('http'),
    fs = require('fs'),
    url = require('url');
var p = require('path');
var qs = require('querystring');
var mysql = require('mysql');

// Variables declaration
var root = __dirname;
var headers = [
    "Product Name", "Price", "Picture", "Buy Button"
];
var cart = [];
var theuser=null;
var theuserid =null;

// DB connection
var db = mysql.createConnection({
    host:     'localhost',
    user:     'root',
    password: 'password',
    database: 'shop'
});

// Server creation
var server = http.createServer(
    function (request, response) {
        var path = url.parse(request.url).pathname;
        var url1 = url.parse(request.url);
        //
        console.log("ENTER CATALOGUE!");
        console.log("REQUEST METHOD = "+request.method);
        var query = "SELECT * FROM products";
        db.query(
            query,
            [],
            function(err, rows) {
                if (err)
                    throw err;
                console.log(JSON.stringify(rows, null, 2));
                // Don't send response, it's just for first connect
                // response.end(JSON.stringify(rows));
                console.log("Products...");
            }
        );
        console.log("PATH = " + path);
        if (request.method == 'POST') {
            switch (path) {
                /* ASSIGNMENT 01 - PART 03.B - START */
                case "/newProduct":
                    console.log("Enter /newProduct section");
                    var body = '';
                    console.log("NEW PRODUCT ");
                    request.on('data', function (data) {
                        body += data;
                    });
                    request.on('end', function () {
                        var obj = JSON.parse(body);
                        console.log(JSON.stringify(obj, null, 2));
                        var query = "SELECT * FROM products where name='"+obj.name+"'";
                        response.writeHead(200, {
                            'Access-Control-Allow-Origin': '*'
                        });
                        db.query(
                            query,
                            [],
                            function(err, rows) {
                                if (err) {
                                    response.end("error");
                                    throw err;
                                }
                                // If the product already exists, then trigger an error
                                if (rows!=null && rows.length>0) {
                                    console.log("product name already in database");
                                    response.end('{"error": "2"}');
                                }
                                // If the product doesn't exists, then insert a new row with the data
                                else {
                                    query = "INSERT INTO products (name, quantity, price, image)"+
                                        "VALUES(?, ?, ?, ?)";
                                    db.query(
                                        query,
                                        [obj.name,obj.quantity,obj.price,obj.image],
                                        function(err, result) {
                                            if (err) {
                                                // 2 response is an sql error
                                                response.end('{"error": "3"}');
                                                throw err;
                                            }
                                            theproductid = result.insertId;
                                            var obj = {
                                                id: theproductid
                                            }
                                            response.end(JSON.stringify(obj));
                                        }
                                    );
                                }
                            }
                        );
                    });
                    console.log("Exit /newProduct section");
                    break;
                /* ASSIGNMENT 01 - PART 03.B - END */
            } //switch
        }
        // GET, ETC
        else {
            switch (path) {
                // If /getProducts, then show all the products from the DB table products
                case "/getProducts"    :
                    console.log("getProducts");
                    response.writeHead(200, {
                        'Content-Type': 'text/html',
                        'Access-Control-Allow-Origin': '*'
                    });
                    var query = "SELECT * FROM products ";
                    db.query(
                        query,
                        [],
                        function(err, rows) {
                            if (err)
                                throw err;
                            console.log(JSON.stringify(rows, null, 2));
                            // Format the DB output as JSON format
                            response.end(JSON.stringify(rows));
                            console.log("Products sent");
                        }
                    );
                    break;
                // If /getProduct, then show only the product chosen from the DB table products
                case "/getProduct"    :
                    console.log("getProduct");
                    // Check what product was requested, parse it and search the value on the DB
                    var body="";
                    request.on('data', function (data) {
                        body += data;
                    });
                    request.on('end', function () {
                        var product = JSON.parse(body);
                        response.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*'
                        });
                        console.log(JSON.stringify(product, null, 2));
                        var query = "SELECT * FROM products where productID="+ product.id;
                        db.query(
                            query,
                            [],
                            function(err, rows) {
                                if (err)
                                    throw err;
                                console.log(JSON.stringify(rows, null, 2));
                                // Format the DB output as JSON format
                                response.end(JSON.stringify(rows[0]));
                                console.log("Products sent");
                            }
                        );
                    });
                    break;
            }
        }
    }
);

// Initialize the Server in port 3002
console.log("App now running in port 3002");
server.listen(3002);





