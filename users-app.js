/*
Republic of Ireland
Munster Technological University
Department of Computer Science

* Created by Dr. Paul Davern
* Updates:
- 20210319 - Comments and design.          # Jose Lo Huang

This code will manage all the functions related with users such as login and registration.
*/

// Modules required
var http = require('http'),
    url = require('url');
var mysql = require('mysql');

// Variables declaration
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
        console.log("path: "+path);
        console.log("url: "+url1);
        if (request.method == 'POST') {
            switch (path) {
                // If the user wants to login
                case "/login":
                    var body = '';
                    console.log("user Login ");
                    request.on('data', function (data) {
                        body += data;
                    });
                    request.on('end', function () {
                        var obj = JSON.parse(body);
                        console.log(JSON.stringify(obj, null, 2));
                        var query = "SELECT * FROM Customer where name='"+obj.name+"'";
                        response.writeHead(200, {
                            'Access-Control-Allow-Origin': '*'
                        });
                        // Check if the user exists on DB and the privileges provided
                        db.query(
                            query,
                            [],
                            function(err, rows) {
                                if (err) {
                                    response.end('{"error": "1"}');
                                    throw err;
                                }
                                if (rows!=null && rows.length>0) {
                                    console.log(" user in database" );
                                    theuserid = rows[0].customerID;
                                    var obj = {
                                        id: theuserid
                                    }
                                    response.end(JSON.stringify(obj));
                                }
                                else {
                                    response.end('{"error": "1"}');
                                    console.log(" user not in database");
                                }
                            }
                        );
                    });
                    break;
                // If this is a new user, then register and create a new row on the DB table "Customer"
                case "/register":
                    var body = '';
                    console.log("user Register ");
                    request.on('data', function (data) {
                        body += data;
                    });
                    request.on('end', function () {
                        var obj = JSON.parse(body);
                        console.log(JSON.stringify(obj, null, 2));
                        var query = "SELECT * FROM Customer where name='"+obj.name+"'";
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
                                // If the user already exists, then trigger an error
                                if (rows!=null && rows.length>0) {
                                    console.log(" user already in database");
                                    response.end('{"error": "2"}');
                                }
                                // If the user doesn't exists, then insert a new row with the data
                                else {
                                    query = "INSERT INTO Customer (name, password, address)"
                                        + "VALUES(?, ?, ?)";
                                    db.query(
                                        query,
                                        [obj.name,obj.password,obj.address],
                                        function(err, result) {
                                            if (err) {
                                                // 2 response is an sql error
                                                response.end('{"error": "3"}');
                                                throw err;
                                            }
                                            theuserid = result.insertId;
                                            var obj = {
                                                id: theuserid
                                            }
                                            response.end(JSON.stringify(obj));
                                        }
                                    );
                                }
                            }
                        );
                    });
                    break;
            } //switch
        }
    }
);

// Initialize the Server in port 3001
console.log("App now running in port 3001");
server.listen(3001);









