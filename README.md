# Bamazon
Pseudo Amazon terminal app using mysql

Make the below table using a mysql query. The schema is below but u have to add some data to product_sales

| department_id | department_name | over_head_costs | product_sales | total_profit |
| ------------- | --------------- | --------------- | ------------- | ------------ |
| 01            | Electronics     | 10000           | 20000         | 10000        |
| 02            | Clothing        | 60000           | 100000        | 40000        |

5. The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.

Use the below as a schema: 

DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10, 4) DEFAULT 0 NOT NULL,
  stock_quantity INT(10) NOT NULL,
  product_sales DECIMAL(10, 4) DEFAULT 0 NOT NULL,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(45) NULL,
  over_head_costs VARCHAR(45) DEFAULT 0 NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Toaster', 'Kitchenware', '5', '15'), ('SPAM', 'Foods', '2', '7'), ('Sofa', 'Furniture', '500', '12'),
('Ant Farm', 'Hobbies', '250', '32'), ('Paintball Gun', 'Hobbies', '165', '17'), ('Sparklers', 'Hobbies', '2', '689'),
('Orange', 'Foods', '1', '77'), ('Blender', 'Kitchenware', '26', '100'), ('Incense', 'Romance', '3', '7000'),
('Amazingly Uncomfortable Bed', 'Furniture', '20', '72');