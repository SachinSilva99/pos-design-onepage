import {getOrderDetails, getOrders} from "../db/DB.js";

export class OrderController {
    constructor() {
        $('select#orderId').change(this.loadOrders.bind(this));
        $(document).ready(this.loadOrdersIfAvailable.bind(this));

    }

    loadOrders(e) {
        const orderId = $(e.target).children("option:selected").val();
       // console.log(orderId);
        if (orderId) {
            const ods = getOrderDetails().filter(o => o._orderId === orderId);
            console.log(ods);
            const order = getOrders().find(o => o._id === orderId);

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
    loadOrdersIfAvailable(){
        console.log(getOrders());

        //load order ids
        getOrders().map(od => {
            $('#orderId').append(`<option value=${od._id}>${od._id}</option>`);
        });
    }
}

new OrderController();