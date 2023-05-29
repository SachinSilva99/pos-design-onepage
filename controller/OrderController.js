import {OrderDetail} from "../model/OrderDetail.js";
import {orderDetails, setOrderDetails, setOrders} from "../db/DB.js";
import {orders} from "../db/DB.js";
import {Order} from "../model/Order.js";

export class OrderController {
    constructor() {
        $('select#orderId').change(this.loadOrders.bind(this));
    }

    loadOrders(e) {

        //getting orders
        let tempOrders = JSON.parse(localStorage.getItem('orders'));
        if (tempOrders !== null) {
            setOrders(tempOrders);
        }
        let tempOrderDetails = JSON.parse(localStorage.getItem('orderDetails'));
        if (tempOrderDetails !== null) {
            localStorage.setItem("orderDetails", JSON.stringify(tempOrderDetails));
        }

        const orderId = $(e.target).children("option:selected").val();
        console.log(orderId);
        console.log(tempOrderDetails);
        if(orderId){
            const ods = tempOrderDetails.filter(o => o._orderId === orderId);
            console.log(ods);
            const order = tempOrders.find(o => o._id === orderId);

            let tr = ``;
            ods.forEach(od => {
                tr += `
                <tr>
                    <td>${od._orderId}</td>
                    <td>${od._itemDes}</td>
                    <td>${od._itemPrice}</td>
                    <td>${od._qty}</td>
                    <td>${order._date}</td>
                </tr>
            `;
            });
            $('#ordersTbody').html(tr);
        }

    }
}

new OrderController();