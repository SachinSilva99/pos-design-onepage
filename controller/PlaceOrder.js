import {OrderDetail} from "../model/OrderDetail.js";


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
//Place Order page End------------------------------------------------------------------------
