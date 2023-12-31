/*
Republic of Ireland
Munster Technological University
Department of Computer Science

* Created by Dr. Paul Davern
* Updates:
- 20210319 - Comments and design.             # Jose Lo Huang
- 20210320 - Add the new product section.     # Jose Lo Huang
- 20210320 - Modify the newProduct endpoint.  # Jose Lo Huang

This code will provide the frontend functionalities and will interact with all the other services.
*/

// Modules required
const express = require("express")
var request      = require("request")
var bodyParser   = require("body-parser")
var cookieParser = require("cookie-parser")
var async        = require("async")
var http = require("http")

// Variables and constant declaration
var cookie_name = "logged_in"
var session1= {
    name: 'md.sid',
    secret: 'sooper secret',
    resave: false,
    saveUninitialized: true
}

/*
 * Public: errorHandler is a middleware that handles your errors
 *
 * Example:
 * var app = express();
 * app.use(helpers.errorHandler);
 */
const app = express()
var helpers = {};
helpers.errorHandler = function(err, req, res, next) {
    var ret = {
      message: err.message,
      error:   err
    };
    res.status(err.status || 500).send(ret);
};
helpers.mylogger = function(req, res, next) {
    console.log('body '+JSON.stringify(req.body));
    next();
};
helpers.sessionMiddleware = function(err, req, res, next) {
    if(!req.cookies.logged_in) {
        res.session.customerId = null;
    }
};

/* Responds with the given body and status 200 OK  */
helpers.respondSuccessBody = function(res, body) {
    helpers.respondStatusBody(res, 200, body);
}

/*
 * Public: responds with the given body and status
 *
 * res        - response object to use as output
 * statusCode - the HTTP status code to set to the response
 * body       - (string) the body to yield to the response
 */
helpers.respondStatusBody = function(res, statusCode, body) {
    res.writeHeader(statusCode);
    res.write(body);
    res.end();
}

helpers.respondStatusBodyJSON = function(res, statusCode, body) {
    res.writeHeader(statusCode);
    res.write(JSON.stringify(body));
    res.end();
}

/* Responds with the given statusCode */
helpers.respondStatus = function(res, statusCode) {
    res.writeHeader(statusCode);
    res.end();
}

/* Public: performs an HTTP GET request to the given URL
 *
 * url  - the URL where the external service can be reached out
 * res  - the response object where the external service's output will be yield
 * next - callback to be invoked in case of error. If there actually is an error
 *        this function will be called, passing the error object as an argument
 *
 * Examples:
 *
 * app.get("/users", function(req, res) {
 *   helpers.simpleHttpRequest("http://api.example.org/users", res, function(err) {
 *     res.send({ error: err });
 *     res.end();
 *   });
 * });
 */
helpers.simpleHttpRequest = function(url, res, next) {
    request.get(url, function(error, response, body) {
      if (error) return next(error);
      helpers.respondSuccessBody(res, body);
    }.bind({res: res}));
}

/* TODO: Add documentation */
helpers.getCustomerId = function(req, env) {
    // Check if logged in. Get customer Id
    var logged_in = req.cookies.logged_in;

    // TODO REMOVE THIS, SECURITY RISK
    if (env == "development" && req.query.custId != null) {
      return req.query.custId;
    }

    if (!logged_in) {
        if (!req.session.id) {
            throw new Error("User not logged in.");
        }
        // Use Session ID instead
        return req.session.id;
    }

    return req.session.customerId;

}

// Endpoints declaration - Hardcoded
endpoints={
    catalogueUrl:  "http://localhost:3002",
    newProductUrl:  "http://localhost:3002/newProduct", //MODIFIED!
    tagsUrl:       "http://localhost:8082/catalogue/tags",
    // catalogueUrl:  "http://localhost:8081",
    // tagsUrl:       "http://localhost:8081",
    cartsUrl:      "http://localhost:3003",
    ordersUrl:     "http://orders",
    customersUrl:  "http://localhost:8080/customers",
    addressUrl:    "http://localhost:8080/addresses",
    cardsUrl:      "http://localhost:8080/cards",
    loginUrl:      "http://localhost:3001/login",
    registerUrl:   "http://localhost:3001/register",
};

// Port Number Setup 
var PORT = process.env.port || 3000 
app.use(express.static("public"));
//app.use(session(session1));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helpers.errorHandler);
//app.use(helpers.sessionMiddleware);

// Session Setup
app.get("/", function(req, res){
    // req.session.key = value
	req.session.name = 'GeeksforGeeks'
	return res.send("Session Set")
})

// Get the list of available products
app.get("/getProducts",
    function (req, res, next) {
        // var x = endpoints.catalogueUrl+"/getProducts" ;//+ req.url.toString();
        console.log("getProducts ");
        var options = {
            host: "localhost",
            path: '/getProducts',
            port: 3002
        };
        callback = function(response) {
            var str = '';
            //another chunk of data has been received, so append it to `str`
            response.on('data', function (chunk) {
                str += chunk;
            });

            //the whole response has been received, so we just print it out here
            response.on('end', function () {
                console.log(str);
                res.end(str);
            });
        }
        http.request(options, callback).end();``
    }
);

// Add a new product
app.post("/newProduct",
    function(req, res, next) {
        /* ASSIGNMENT 01 - PART 03.B - START */
        var options = {
            uri: endpoints.newProductUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("Posting new Product: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error !== null ) {
                console.log("error "+JSON.stringify(error));
                return;
            }
            if (response.statusCode == 200 && body != null && body != "") {
                if (body.error) {
                    console.log("Error with log in: " + error);
                    res.status(500);
                    res.end();
                    return;
                }
                console.log(body);
                res.end();
                return;
            }
            console.log(response.statusCode);
        });
        /* ASSIGNMENT 01 - PART 03.B - END */
    }
);

// Show elements of the shopping cart
app.get("/cart",
    function (req, res, next) {
        console.log("Request received: " + req.url );//+ ", " + req.query.custId);
        //  var custId = helpers.getCustomerId(req, app.get("env"));
        // console.log("Customer ID: " + custId);
        request(endpoints.cartsUrl + "/cart",
            function (error, response, body) {
                if (error) {
                    return next(error);
                }
                res.writeHeader(response.statusCode);
                res.write(body);
                res.end();
            }
        );
    }
);

// Add new item to the shopping cart
app.post("/cart",
    function (req, res, next) {
        console.log("Attempting to add to cart: " + JSON.stringify(req.body));
        if (req.body.id == null) {
            next(new Error("Must pass id of item to add"), 400);
            return;
        }

        //var custId = helpers.getCustomerId(req, app.get("env"));
        var qty = req.body.qty;
        //console.log("custid "+custId);
        var options = {
            uri: endpoints.catalogueUrl + "/getProduct",
            method: 'GET',
            json: true,
            body: {id: req.body.id}
        };
        console.log("GET product: " + options.uri + " body: " + JSON.stringify(options.body));
        request(options,
            function (error, response, item) {
                console.log(item);
                console.log(" product id " + item.productID);
                var options1 = {
                    uri: endpoints.cartsUrl + "/add",
                    method: 'POST',
                    json: true,
                    body: {
                        // custId: custId,
                        productID: item.productID,
                        price: item.price,
                        quantity: qty,
                        image: item.image,
                        name: item.name
                    }
                };
                console.log("POST to carts: " + options1.uri + " body: " + JSON.stringify(options1.body));
                request(options1, function (error, response, body) {
                    if (error) {
                        // callback(error)
                        // return;
                    }
                    res.writeHeader(response.statusCode);
                    res.write("");
                    res.end();
                });
            }
        );
    }
);

// Delete item from the shopping cart
app.post("/delete",
    function (req, res, next) {
        // if (req.params.id == null) {
        //    return next(new Error("Must pass id of item to delete"), 400);
        // }
        console.log("Attempting to delete from cart: " + JSON.stringify(req.body));
        console.log("Delete item from cart: " + req.body.id);
        // if (req.body.id == null) {
        //      next(new Error("Must pass id of item to delete"), 400);
        //      return;
        //  }

        // var custId = helpers.getCustomerId(req, app.get("env"));
        // console.log("custid "+custId);
        var options = {
            uri: endpoints.cartsUrl + "/cart" + "/items/" + req.body.id.toString(),
            method: 'DELETE'
        };
        request(options, function (error, response, body) {
            if (error) {
                return next(error);
            }
            console.log('Item deleted with status: ' + response.statusCode);
            res.writeHeader(response.statusCode);
            res.write(body);
            res.end();
        });
    }
);

// Create Customer - TO BE USED FOR TESTING ONLY (for now)
app.post("/register",
    function(req, res, next) {
        var options = {
            uri: endpoints.registerUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("Posting Customer: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error !== null ) {
                console.log("error "+JSON.stringify(error));
                return;
            }
            if (response.statusCode == 200 && body != null && body != "") {
                if (body.error) {
                    console.log("Error with log in: " + error);
                    res.status(500);
                    res.end();
                    return;
                }
                console.log(body);
                /* var customerId = body.id;
                   console.log(customerId);
                   req.session.customerId = customerId;
                   console.log("set cookie" + customerId);
                   res.status(200);
                   res.cookie(cookie_name, req.session.id, {
                        maxAge: 3600000
                   }).send({id: customerId});
                   console.log("Sent cookies.");*/
                res.end();
                return;
            }
            console.log(response.statusCode);
        });
    }
);

// User login
app.post("/login",
    function(req, res, next) {
        var options = {
            uri: endpoints.loginUrl,
            method: 'POST',
            json: true,
            body: req.body
        };
        console.log("Posting Customer: " + JSON.stringify(req.body));
        request(options, function(error, response, body) {
            if (error !== null ) {
                console.log("error "+JSON.stringify(error));
                return;
            }
            if (response.statusCode == 200 && body != null && body != "") {
                //     body = JSON.parse(body);
                console.log('body '+JSON.stringify(body))
                if (body.error) {
                    console.log("Error with log in: " + body.error);
                    res.status(500);
                    res.end();
                    return;
                }
                console.log(body);
            /*   var customerId = body.id;
            console.log('cust id ' +customerId);
            req.session.customerId = customerId;
            console.log("set cookie" + customerId);
            res.status(200);
            res.cookie(cookie_name, req.session.id, {
                maxAge: 3600000
            });//.send({id: customerId});
            console.log("Sent cookies.");*/
                res.end("logged in as "+ req.body.name);
                return;
            }
            console.log(response.statusCode);
        });
    }
);

// Initialize the Server in port 3000
app.listen(PORT, function(error){ 
	if(error) throw error 
	console.log("Server created Successfully on PORT :", PORT) 
}) 





