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
        "SELECT *, (product_sales - over_head_costs) AS total_profit FROM departments JOIN (SELECT department_name, sum(product_sales) AS product_sales FROM products GROUP BY products.department_name) AS totals ON totals.department_name = departments.department_name;",
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