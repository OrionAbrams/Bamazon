const cTable = require('console.table');
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayStore();
});

function displayStore() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res)
        ask();
    });
}

var chosenID
var numberWanted
var price

function ask() {
    inquirer.prompt([
        {
            name: "productId",
            message: "What is the ID of the product would you like to buy?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        chosenID = answer.productId
        howMany();
    })
}

function howMany() {
    inquirer.prompt([
        {
            name: "numberOfProducts",
            message: "How many do you want?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        numberWanted = answer.numberOfProducts
        connection.query("SELECT * FROM products WHERE item_id=?", [chosenID], function (err, res) {
            if (numberWanted > res[0].stock_quantity) {
                console.log("Insufficient quantity!")
                ask();
            }
            else {
                price = numberWanted * res[0].price + res[0].product_sales
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: res[0].stock_quantity - numberWanted,
                            product_sales : price
                        },
                        {
                            item_id: chosenID
                        }
                    ],
                    function (err, res) {
                        console.log("Product Quantity Updated!");
                        askToContinue();

                    }
                );
            }
        });
    })
}


function askToContinue() {
    console.log(`That cost ya $${price}`)
    inquirer.prompt([
        {
            name: "continue",
            message: "Would you like something else?",
            type: "confirm"
        }
    ]).then(function (response) {
        if (response.continue) {
            displayStore()
        }
        else {
            console.log("\nHave a good week!\n")
            process.exit()
        }
    })
}