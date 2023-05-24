import {items, setItems} from "../db/DB.js";
import {customers, setCustomers} from "../db/DB.js";
import {OrderItemTm} from "../model/tm/OrderItemTm.js";

let orderItems = [];
//Place Order page Start------------------------------------------------------------------------
$('select#customerIds').change(function () {
    const customerId = $(this).children("option:selected").val();
    for (const customer of customers) {
        if (customerId === customer.customerId) {
            $('#customer_id_p').val(customer.customerId);
            $('#customer_name_p').val(customer.name);
            $('#customer_address_p').val(customer.address);
            return;
        }
    }
});
$('select#itemCodes').change(function () {
    const itemCode = $(this).children("option:selected").val();
    for (const item of items) {
        if (itemCode === item.code) {
            $('#item_code_p').val(item.code);
            $('#item_description_p').val(item.des);
            $('#item_price_p').val(item.price);
            $('#item_qty_p').val(item.qty);
            return;
        }
    }
});
$('#place-order-tbl').on('click', 'button', (e) => {
    const buttonId = e.target.id;
    const qtyNeeded = $(e.target).closest('tr').find('td').eq(3).text();
    const itemCode = $(e.target).closest('tr').find('td').eq(0).text();
    orderItems.forEach(ot => {
        if (ot.code === itemCode) {
            if(buttonId === 'reduceQty'){
                if(ot.qty_need !==0){
                    ot.qty_need -= 1;
                }
            }else {
              ot.qty_need = parseInt(ot.qty_need) + 1;
            }
        }
    });
    loadOrderTbl();

    console.log(buttonId);
    console.log(qtyNeeded);
});

$('#add-item-to-cart').click(() => {
    const itemCode = $('#item_code_p').val();
    const item_des = $('#item_description_p').val();
    const itemPrice = $('#item_price_p').val();
    const itemQtyNeeded = $('#item_qty_need_p').val();
    const itemInTable = orderItems.some(ot => ot.code === itemCode);
    if (itemInTable) {
        orderItems.forEach(ot => {
            if (ot.code === itemCode) {
                ot.qty_need = parseInt(ot.qty_need) + parseInt(itemQtyNeeded);
                loadOrderTbl();
            }
        });
        return;
    }
    const orderItem = new OrderItemTm(itemCode, item_des, itemPrice, itemQtyNeeded);
    orderItems.push(orderItem);
    loadOrderTbl();
});

function loadOrderTbl() {
    let tr = ``;
    orderItems.map(ot => {
        tr += `
        <tr>
        <td>${ot.code}</td>
        <td>${ot.des}</td>
        <td>${ot.price}</td>
        <td>${ot.qty_need}</td>
        <td>
            <button id="reduceQty" class="btn btn-danger">-</button>
            <button id="increseQty" class="btn btn-success">+</button>
        </td>
        </tr>
        `
    });
    $('#place-order-tbl').html(tr);
}

//Place Order page End------------------------------------------------------------------------
