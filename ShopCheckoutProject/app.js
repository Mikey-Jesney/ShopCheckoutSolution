
const readline = require('readline');

'use strict';

var itemlist = "";

var total = 0


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


console.log('Please add at least one pricing rule (name, price, discount price, discount quantity threshold)');

var pricesObjects = []


var CreatePrices = function () {
    rl.question('What is the name of the product? (A, B, C, D...): ', function (name) {
        const found = pricesObjects.some(el => el.name === name);
        if (found) {
            console.log("that name is already in use, please choose another!")
            CreatePrices();
        }
        rl.question('What is the price of a single unit?: ', function (price) {
            rl.question('What is the price of these items in bulk at the discount threshold? e.g: 3 for 150 = 150: ', function (discountPrice) {
                rl.question('What is the dicount quantity threshold? e.g: 3 for 150 = 3: ', function (discountThreshold) {
                    pricesObjects.push({ "name": name, "price": price, "discountPrice": discountPrice, "discountThreshold": discountThreshold })
                    console.log(pricesObjects);
                    rl.question('Have you finished entering prices? answer: y/n: ', function (exit) {
                        if (exit == "y") {
                            MakePurchases();
                        }
                        if (exit == "n") {
                            CreatePrices();
                        }
                    })
                })
            });
        });
    });
}

var MakePurchases = function () {
    rl.question('please type in your list of items to purchase in the format ABBCCCDDDD - order doesnt matter', function (items) {
        itemlist = items;
        Checkout(items);
    })
}


function Checkout(items) {

    console.log(items);

    var itemsarray = items.split("");

    var unique = itemsarray.filter(OnlyUnique);

    unique.forEach(CalculatePrice);

    console.log(total, " this is your total");

    rl.question('your total bill is above, press enter to close application', function (exit) {
        rl.close();
    })

}


function CalculatePrice(item) {

    let product = pricesObjects.find(product => product.name == item);

    var count = itemlist.split(item).length - 1;

    if (product.discountThreshold > 0 && product.discountPrice > 0 && count >= product.discountThreshold) {

        var discountedItemsTotal = Math.floor(count / product.discountThreshold) * product.discountPrice;
        var nonDiscountedItemsTotal = (count % product.discountThreshold) * product.price;

        total += discountedItemsTotal;

        total += nonDiscountedItemsTotal;

    } else {

        total += product.price * count;

    }
}


function OnlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


rl.on('close', function () {

    process.exit(0);

});

CreatePrices();