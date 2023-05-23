import {Item} from "../model/Item.js";

let items = [];
$(document).ready(function () {

    //loading items if available
    let tempItems = JSON.parse(localStorage.getItem('items'));
    if (tempItems !== null) {
        items = tempItems.map(i => new Item(i._code, i._des, i._price, i._qty));
        loadItemsTbl();
    }
    //load item codes in place order options
    items.map(i => {
        $('#itemCodes').append(`<option value=${i.code}>${i.code}</option>`);
    });

});

//Items page start------------------------------------------------------------------------

//add item-------------------------------------------------------------
$('#addItem').click((e) => {
    e.preventDefault();
    const itemCode = $('#item_code').val();
    const des = $('#item_description').val();
    const price = $('#item_price').val();
    const qty = $('#item_qty').val();
    const item = new Item(itemCode, des, price, qty);
    const itemExists = items.some((i) => i.code === itemCode);
    if (itemExists) {
        alert("Item Already exists");
        return;
    }
    items.push(item);
    $('#item_code').val('');
    $('#item_description').val('');
    $('#item_price').val('');
    $('#item_qty').val('');
    localStorage.setItem("items", JSON.stringify(items));
    alert(item.code + " Added Successfully");
    loadItemsTbl();
});

//update item-------------------------------------------------------------
$('#itemUpdate').click((e) => {
    e.preventDefault();
    const itemCode = $('#item_code').val();
    const des = $('#item_description').val();
    const price = $('#item_price').val();
    const qty = $('#item_qty').val();
    items.forEach((item) => {
        if (itemCode === item.code) {
            item.des = des;
            item.price = price;
            item.qty = qty;
            alert('item updated successfully');
        }
    });
    localStorage.setItem("items", JSON.stringify(items));
    loadItemsTbl();
});

function loadItemsTbl() {
    let tr = ``;
    items.map(item => {
        tr += `
            <tr >
                <td>${item.code}</td>
                <td>${item.des}</td>
                <td>${item.price}</td>
                <td>${item.qty}</td>
                <td>
                    <button class="item_delete btn btn-danger">Delete</button>
                </td>
            </tr>
        `;
    });
    $('#itemTbl').html(tr);
}

//click on item table row and load to the fields----------------------------------
$('#itemTbl').on('click', 'tr', (e) => {
    const itemCode = $(e.target).closest('tr').find('td').eq(0).text();
    console.log(itemCode)
    for (const item of items) {
        if (itemCode === item.code) {
            $('#item_code').val(item.code);
            $('#item_description').val(item.des);
            $('#item_price').val(item.price);
            $('#item_qty').val(item.qty);
            return;
        }
    }
    // console.log($(e.target).find('td').eq(0).text());
});



$("#itemTbl").on("click", ".item_delete", (e) => {
    const itemCode = $(e.target).closest("tr").find("td").eq(0).text();
    console.log(itemCode);
    deleteCustomer(itemCode);
});
function deleteCustomer(customerId) {
    items = items.filter((item) => item.code !== customerId);
    localStorage.setItem("items", JSON.stringify(items));
    loadItemsTbl();
}
//Items page end--------------------------------------------------------------------------------
/*

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
//Place Order page End------------------------------------------------------------------------*/
