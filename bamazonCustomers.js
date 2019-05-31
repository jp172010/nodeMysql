var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",  
    port: 3306,  
    user: "root",  
    password: "f92ct6ec6jwwr",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {

    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;
        console.table(results);
    
        inquirer
            .prompt([
                {
                    name: "id",
                    type: "input",
                    message: "What is the ID # of the item you would like to purchase?"
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to purchase?"
                }
            ])
            .then(function(answer){
                var chosenItem;

                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === parseInt(answer.id)) {
                    chosenItem = results[i];
                    console.log(chosenItem);
                    }
                }

                    if(chosenItem.Stock_quantity < parseInt(answer.units)){
                        console.log("Insufficient quantity");
                        start();
                    }else{
                        connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                            {
                                Stock_quantity: chosenItem.Stock_quantity - parseInt(answer.units)
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                            ],
                            function(error) {
                            if (error) throw error;
                            console.log("Your purchase was successful! You total cost was $" + parseInt(answer.units) * chosenItem.Price);
                            }
                        );
                    }
            });
    });
}