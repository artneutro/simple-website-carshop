/*
Republic of Ireland
Munster Technological University
Department of Computer Science

* Created by Dr. Paul Davern
* Updates:
- 20210319 - Comments and design.  # Jose Lo Huang

This code will create the database and DB objects for the shop website.
*/

-- Drop DB
DROP DATABASE IF EXISTS shop;

-- Create DB
CREATE DATABASE IF NOT EXISTS shop;
use shop;

-- Create tables and insert some test data
-- Table shop.products
CREATE TABLE IF NOT EXISTS products (
productID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
name         VARCHAR(30)   NOT NULL DEFAULT '',
quantity     INT UNSIGNED  NOT NULL DEFAULT 0,
price        DECIMAL(7,2)  NOT NULL DEFAULT 99999.99,
image        VARCHAR(30)   NOT NULL DEFAULT '',
PRIMARY KEY  (productID)
);
INSERT INTO products (name, quantity, price, image)
VALUES ('Car 1', 10000, 0.48,'car1.jpeg'),
       ('Car 2', 8000, 0.49,'car2.jpeg'),
       ('Car 5', 100, 0.22,'car4.jpeg'),
       ('Car 6', 80, 0.33,'car3.jpeg');
-- Table shop.Customer
CREATE TABLE Customer (
customerID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
name VARCHAR(40) NOT NULL,
password VARCHAR(40) NOT NULL,
address VARCHAR(60),
PRIMARY KEY  (customerID)
);
INSERT INTO Customer (name, password, address)
VALUES ('joe', 'joe', 'cork'),
       ('mary', 'mary', 'dublin'),
       ('joey', 'joey', 'london'),
       ('fred', 'fred', 'dublin');
-- Table shop.Orders
CREATE TABLE Orders (
orderID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
customerID INT UNSIGNED  NOT NULL,
saledate VARCHAR(40) NOT NULL,
PRIMARY KEY  (orderID)
);
-- Table shop.OrderDetails
CREATE TABLE OrderDetails (
orderdetailsID INT UNSIGNED  NOT NULL AUTO_INCREMENT,
orderID INT UNSIGNED  NOT NULL,
productID INT UNSIGNED  NOT NULL,
quantity INT UNSIGNED  NOT NULL,
PRIMARY KEY  (orderdetailsID)
);





