const cTable = require('console.table');
const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    ask();
});

function displayStore() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res)
        ask();
    });
}

function ask() {
    inquirer.prompt([
        {
            type: "list",
            name: "manage",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answer) {
        var choice = answer.manage
        if (choice === "View Products for Sale") {
            displayStore();
        }
        if (choice === "View Low Inventory") {
            viewLow();
        }
        if (choice === "Add to Inventory") {
            connection.query("SELECT * FROM products", function (err, res) {
                console.table(res) //couldn't get it to display quite correctly here because this runs at same time as the next prompt
            });
            addMore();
        }
        if (choice === "Add New Product") {
            addProduct();
        }
    })
}

function viewLow() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        console.table(res)
        ask();
    });
}
function addMore() {
    inquirer.prompt([
        {
            name: "whatAdd",
            message: "What is the ID of the item of which you would like to add quantity?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "howMuch",
            message: "How much stock would you like to add to the item?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var stockToAdd = answer.whatAdd
        var numberOfStock = answer.howMuch
        connection.query("SELECT * FROM products WHERE item_id=?", [stockToAdd], function (err, res) {
            var sumOfStock = parseFloat(res[0].stock_quantity) + parseFloat(numberOfStock)
            connection.query("UPDATE products SET stock_quantity=? WHERE item_id =?", [sumOfStock, stockToAdd], function (err, res) {
                console.log("item updated!")
                displayStore();
            })
        });
    })
}

function addProduct(){
    inquirer.prompt([
        {
            name : "productName",
            message : "What product would you like to add?"
        },
        {
            name : "productDept",
            message : "What department should this product go in?"
        },
        {
            name : "price",
            message : "How much does this product cost?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        },
        {
            name : "stock",
            message : "How many of this product are you adding to the store?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var newProductName = answer.productName
        var newProductDept = answer.productDept
        var newProductPrice = parseFloat(answer.price)
        var fixed = newProductPrice.toFixed(2);
        var newProductStock = parseFloat(answer.stock)
        connection.query(
            "INSERT INTO products SET ?",
            {
              product_name: newProductName,
              department_name : newProductDept,
              price : fixed,
              stock_quantity : newProductStock
            },
            function(err, res) {
              console.log("product inserted!");
              displayStore();
            }
          );
    })
}