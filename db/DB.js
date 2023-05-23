import {Customer} from "../model/Customer.js";
import {Item} from "../model/Item.js";

let items = [];
let customers = [];
$(document).ready(function () {

    //loading customers if available
    let tempCustomers = JSON.parse(localStorage.getItem('customers'));
    let tempItems = JSON.parse(localStorage.getItem('items'));
    if (tempCustomers !== null) {
        customers = tempCustomers.map(c => new Customer(c._customerId, c._name, c._address));
    }
    if (tempItems !== null) {
        items = tempItems.map(i => new Item(i._code, i._des, i._price, i._qty));
    }
});
function setItems(newItems) {
    items = newItems;
}

function setCustomers(newCustomers) {
    customers = newCustomers;
}
export { items, customers, setItems,setCustomers };