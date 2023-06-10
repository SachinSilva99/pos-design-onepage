import {Customer} from "../model/Customer.js";
import {Item} from "../model/Item.js";
import {OrderDetail} from "../model/OrderDetail.js";
import {Order} from "../model/Order.js";

let items = [];
let customers = [];
let orderDetails = [];
let orders = [];
$(document).ready(function () {
    getOrders();
    getOrderDetails();
    getCustomers();
    getItems();
});

function setItems(newItems) {
    items = newItems;
    localStorage.setItem("items", JSON.stringify(items));
}

function getItems() {
    let tempItems = JSON.parse(localStorage.getItem('items'));
    if (tempItems !== null) {
        items = tempItems.map(i => new Item(i._code, i._des, i._price, i._qty));
    }
    return items;
}


function setCustomers(newCustomers) {
    customers = newCustomers;
    localStorage.setItem("customers", JSON.stringify(customers));
}

function getCustomers() {
    let tempCustomers = JSON.parse(localStorage.getItem('customers'));
    if (tempCustomers !== null) {
        customers = tempCustomers.map(c => new Customer(c._customerId, c._name, c._address));
    }
    return customers;
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

function getOrderDetails() {
    let tempOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
    if (tempOrderDetails !== null) {
        orderDetails = tempOrderDetails.map(od => new OrderDetail(od._orderId, od._itemCode, od._itemDes, od._qty, od._itemPrice));
    }
    return orderDetails;
}

function setOrders(newOrder) {
    let tempOrders = JSON.parse(localStorage.getItem('orders'));
    if (tempOrders !== null) {
        orders = tempOrders.map(o => new Order(o._id, o._date, o._customer));
    }
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
}

function getOrders() {
    let tempOrders = JSON.parse(localStorage.getItem('orders'));
    if (tempOrders !== null) {
        orders = tempOrders.map(o => new Order(o._id, o._date, o._customer));
    }
    return orders;
}

export {
    orders,
    orderDetails,
    getOrders,
    setItems,
    setCustomers,
    setOrderDetails,
    getOrderDetails,
    setOrders,
    getCustomers,
    getItems
};