import {Customer} from "../model/Customer.js";
import {Item} from "../model/Item.js";
import {OrderDetail} from "../model/OrderDetail.js";
import {Order} from "../model/Order.js";

let items = [];
let customers = [];
let orderDetails = [];
let orders = [];
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

    //getting order details
    let tempOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (tempOrderDetails !== null) {
        orderDetails = tempOrderDetails.map(od => {
            new OrderDetail(od._orderId, od._itemCode, od._itemDes, od._qty, od._itemPrice);
        });
    }
    //getting orders
    let tempOrders = JSON.parse(localStorage.getItem('orders'));
    if (tempOrders !== null) {
        orders = tempOrders.map(od => {
            new Order(od._id, od._date, od._customer);
        });
    }
});

function setItems(newItems) {
    let tempItems = JSON.parse(localStorage.getItem('items'));
    if (tempItems !== null) {
        items = tempItems.map(i => new Item(i._code, i._des, i._price, i._qty));
    }
    items.push(newItems);
}


function setCustomers(newCustomers) {
    customers = newCustomers;
}

function setOrderDetails(newOrderDetails) {
    let tempOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (tempOrderDetails !== null) {
        orderDetails = tempOrderDetails.map(od => new OrderDetail(od._orderId, od._itemCode, od._itemDes, od._qty, od._itemPrice));
    }
    newOrderDetails.forEach(od => orderDetails.push(
        new OrderDetail(od._orderId, od._itemCode, od._itemDes, od._qty, od._itemPrice))
    );
    console.log(orderDetails);
    localStorage.setItem("orderDetails", JSON.stringify(orderDetails));
}


function setOrders(newOrder) {
    let tempOrders = JSON.parse(localStorage.getItem('orders'));
    if (tempOrders !== null) {
        orders = tempOrders.map(o => new Order(o._id, o._date, o._customer));
    }
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

}

export {orders, orderDetails, items, customers, setItems, setCustomers, setOrderDetails, setOrders};