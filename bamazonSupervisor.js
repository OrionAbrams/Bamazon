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
    connection.query("SELECT * FROM departments", function (err, res) {
        console.table(res)
        ask();
    });
}

function ask() {
    inquirer.prompt([
        {
            type: "list",
            name: "supervise",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (answer){
        switch (answer.supervise) {
            case "View Product Sales by Department":
              viewSales();
              break;
      
            case "Create New Department":
              createNew();
              break;
        }
    })
}

function viewSales(){
    connection.query(
        "SELECT departments.department_id, products.department_name, departments.department_name," +
        " departments.over_head_costs, SUM(products.product_sales) AS product_sales," +
        " SUM(products.product_sales) - departments.over_head_costs AS total_profit" +
        " FROM products" +
        " JOIN departments ON (products.department_name = departments.department_name)" +
        " GROUP BY departments.department_id ORDER BY total_profit DESC;",
         function (err, res) {
            console.table(res)
            ask();
        }
      );
}

function createNew(){
    inquirer.prompt([
        {
            name : "departmentName",
            message : "What department would you like to add?"
        },
        {
            name : "departmentCost",
            message : "What are the overhead costs?",
            validate: function (value) {
                if (!isNaN(value)) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var newdepartmentName = answer.departmentName
        var newdepartmentCost = parseFloat(answer.departmentCost).toFixed(2)
        connection.query(
            "INSERT INTO departments SET ?",
            {
              department_name: newdepartmentName,
              over_head_costs : newdepartmentCost
            },
            function(err, res) {
              console.log("department inserted!");
              displayStore();
            }
          );
    })
}