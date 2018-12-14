DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10, 4) DEFAULT 0 NOT NULL,
  stock_quantity INT(10) NOT NULL,
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