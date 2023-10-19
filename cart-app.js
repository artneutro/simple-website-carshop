/*
Republic of Ireland
Munster Technological University
Department of Computer Science

* Created by Dr. Paul Davern
* Updates:
- 20210319 - Comments and design.                                         # Jose Lo Huang
- 20210320 - Modify the add to cart section to combine repeated items.    # Jose Lo Huang
- 20210320 - Fix the delete to cart section.                              # Jose Lo Huang

This code will manage all the functions related with the user shopping cart
*/

// Modules required
var express = require("express")
    , morgan = require("morgan")
    , path = require("path")
    , bodyParser = require("body-parser")
    , app = express();

// Configuring the express module = https://expressjs.com/
app.use(morgan('combined'));
app.use(morgan("dev", {}));
app.use(bodyParser.json());

// Variables declaration
var cart = [];

// Add an item to the shopping cart in the backend
app.post("/add",
    function (req, res, next) {
        /* ASSIGNMENT 01 - PART 04.A - START */
        // Get the request body and declare the variables
        var obj = req.body;
        var max = 0;
        var ind = 0;
        console.log("add ");
        console.log("Attempting to add to cart: " + JSON.stringify(obj));

        // Check if the cart already has the item
        var is_in_cart = false;
        for (ind = 0; ind < cart.length; ind++) {
            // Case the item is already in the cart
            if (obj.productID == (cart[ind]).productID) {
                is_in_cart = true;
                console.log("FOUND");
                (cart[ind]).quantity = String(parseInt((cart[ind]).quantity)
                                                    + parseInt(obj.quantity));
                break;
            }
        }

        // If the item isn't in the cart
        if (!is_in_cart) {

            console.log("NOT FOUND");

            // Find the max ID inside the cart
            for (ind = 0; ind < cart.length; ind++)
                if (max < cart[ind].cartid)
                    max = cart[ind].cartid;

            var cartid = max + 1;
            // Prepare the data to insert
            var data = {
                "cartid": cartid,
                "productID": obj.productID,
                "name": obj.name,
                "price": obj.price,
                "image": obj.image,
                "quantity": obj.quantity
            };
            // Insert the new item in cart
            cart.push(data);
        }

        // Return to main
        res.status(201);
        res.send("");
        /* ASSIGNMENT 01 - PART 04.A - END */
    }
);

// Delete an item from the shopping cart in the backend
app.delete("/cart/items/:id",
    function (req, res, next) {
        var body = '';
        console.log("Delete item from cart: for custId " + req.url + ' ' + req.params.id.toString());
        console.log("delete ");

        /* ASSIGNMENT 01 - PART 04.C - START */
        var obj = req.body;
        var max = 0;
        var ind = 0;

        for (ind = 0; ind < cart.length; ind++) {
            // If is the item, then delete it.
            if (req.params.id.toString() == (cart[ind]).cartid) {
                console.log("FOUND");
                cart.splice(ind,1)
                break;
            }
        }

        /* ASSIGNMENT 01 - PART 04.C - END */

        res.send("");
    }
);

// Get the list of items in the shopping cart
app.get("/cart",
    function (req, res, next) {
        // var custId = req.params.custId;
        // console.log("getCart" + custId);
        // console.log('custID ' + custId);
        console.log(JSON.stringify(cart, null, 2));
        res.send(JSON.stringify(cart));
        console.log("cart sent");
    }
);

// Initialize the Server in port 3003
var server = app.listen(process.env.PORT || 3003,
    function () {
        var port = server.address().port;
        console.log("App now running in %s mode on port %d", app.get("env"), port);
    }
);







