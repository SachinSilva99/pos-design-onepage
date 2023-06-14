import {getItems, getOrders, setCustomers, setOrderDetails, setOrders} from "../db/DB.js";
import {getCustomers} from "../db/DB.js";
import {OrderItemTm} from "../model/tm/OrderItemTm.js";
import {OrderDetail} from "../model/OrderDetail.js";
import {Order} from "../model/Order.js";
import {Customer} from "../model/Customer.js";

export class PlaceOrder {
    constructor() {
        this.orderItems = [];
        //$('.nav-link').click(this.loadCustomerItems.bind(this));
        $('#orderIdLabel').text(this.getLastOrderId.bind(this));
        $('select#customerIds').change(this.customerSelectOnChange.bind(this));
        $('select#itemCodes').change(this.itemSelectOnChange.bind(this));
        $('#place-order-tbl').on('click', 'button', this.optionButtonClick.bind(this));
        $('#add-item-to-cart').click(this.addItemToCart.bind(this));
        $('#place-orderbtn').click(this.placeOrderBtnOnClick.bind(this));
    }

    customerSelectOnChange(e) {
        const customerId = $(e.target).children("option:selected").val();
        console.log('customer id', customerId);
        for (const customer of getCustomers()) {
            if (customerId === customer.customerId) {
                $('#customer_id_p').val(customer.customerId);
                $('#customer_name_p').val(customer.name);
                $('#customer_address_p').val(customer.address);
                return;
            }
        }
    }

    itemSelectOnChange(e) {
        const itemCode = $(e.target).children("option:selected").val();
        for (const item of getItems()) {
            if (itemCode === item.code) {
                $('#item_code_p').val(item.code);
                $('#item_description_p').val(item.des);
                $('#item_price_p').val(item.price);
                $('#item_qty_p').val(item.qty);
                return;
            }
        }
    }

    optionButtonClick() {
        const buttonId = e.target.id;
        const itemCode = $(e.target).closest('tr').find('td').eq(0).text();
        this.orderItems.forEach(ot => {
            if (ot.code === itemCode) {
                let total = parseFloat($('.total').text());
                if (buttonId === 'reduceQty') {
                    if (ot.qty_need !== 0) {
                        ot.qty_need -= 1;
                        total -= parseFloat(ot.price);
                        $('.total').text(total);
                    }
                } else {
                    ot.qty_need = parseInt(ot.qty_need) + 1;
                    total += parseFloat(ot.price);
                    $('.total').text(total);
                }
            }
        });
        this.loadOrderTbl();
    }

    loadOrderTbl() {
        let tr = ``;
        this.orderItems.map(ot => {
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
            </tr>`;
        });
        $('#place-order-tbl').html(tr);
    }

    addItemToCart() {
        const itemCode = $('#item_code_p').val();
        const item_des = $('#item_description_p').val();
        const itemPrice = $('#item_price_p').val();
        const itemQtyNeeded = $('#item_qty_need_p').val();
        const qty = $('#item_qty_p').val();
        let total = parseFloat($('.total').text());
        total += parseInt(itemPrice) * parseInt(itemQtyNeeded);
        $('.total').text(total);
        const itemInTable = this.orderItems.some(ot => ot.code === itemCode);
        if (itemInTable) {
            this.orderItems.forEach(ot => {
                if (ot.code === itemCode) {
                    console.log(ot.qty_need + itemQtyNeeded);
                    if (ot.qty_need <= itemQtyNeeded || qty < (parseInt(ot.qty_need) + parseInt(itemQtyNeeded))) {
                        $('#msg').text("QTY need cannot exceed qty");
                        $('#alertInfo').text('Error : ');
                        $('#alertModal').modal('show');
                        return;
                    } else {
                        ot.qty_need = parseInt(ot.qty_need) + parseInt(itemQtyNeeded);
                        this.loadOrderTbl();
                    }
                }
            });
            return;
        }
        const orderItem = new OrderItemTm(itemCode, item_des, itemPrice, itemQtyNeeded);
        this.orderItems.push(orderItem);
        this.loadOrderTbl();
    }

    placeOrderBtnOnClick() {
        const total = $('.total').text();
        const orderId = $('.order-id').text();
        if ($('#cash').val() === '') {
            $('#msg').text("Cash cannot be empty");
            $('#alertInfo').text('Success');
            $('#alertModal').modal('show');
            return;
        }
        const cash = parseFloat($('#cash').val());
        if ($('#customer_id_p').val().length === 0 ||
            $('#customer_name_p').val().length === 0 ||
            $('#customer_address_p').val().length === 0) {
            $('#msg').text("Customer cannot be empty");
            $('#alertInfo').text('Success');
            $('#alertModal').modal('show');
            return;
        }
        if (this.orderItems.length === 0) {
            $('#msg').text("Please add some items");
            $('#alertInfo').text('Success');
            $('#alertModal').modal('show');
            return;
        }
        if (cash.length === 0) {
            $('#msg').text('Please input the cash amount');
            $('#alertInfo').text('Success');
            $('#alertModal').modal('show');
            return;
        }
        if (cash < total) {
            $('#msg').text("Cash isn't enough");
            $('#alertInfo').text('Success');
            $('#alertModal').modal('show');
            return;
        }
        setOrderDetails(this.orderItems.map(ot => new OrderDetail(orderId, ot.code, ot.des, ot.qty_need, ot.price)));
        const customerId = $('#customer_id_p').val();
        let customer = getCustomers().find(cust => cust.customerId === customerId);
        if (customer === undefined) {
            const customers = getCustomers();
            customer = new Customer(
                $('#customer_id_p').val(),
                $('#customer_name_p').val(),
                $('#customer_address_p').val());
            customers.push(customer);
            setCustomers(customers);
        }
        setOrders(new Order(orderId, new Date(), customer));
        this.orderItems = [];
        this.loadOrderTbl();
        const balance = cash - total;
        $('#msg').text(`Order Placed Successfully Customer Balance is  ${balance}`);
        $('#alertInfo').text('Success');
        $('#alertModal').modal('show');
        const currentOrderId = $('#orderIdLabel').text();
        let nextOrderId = this.generateOrderId(currentOrderId);
        $('#orderIdLabel').text(nextOrderId);
        this.clearFields();

    }

    clearFields() {
        $('#item_code_p').val('');
        $('#item_description_p').val('');
        $('#item_price_p').val('');
        $('#item_qty_need_p').val('');
        $('#customer_id_p').val('');
        $('#customer_name_p').val('');
        $('#customer_address_p').val('');
        $('#itemCodes').val('');
        $('#customerIds').val('');
        $('.total').text('0');
        $('.order-id').text('D001');
        $('#cash').val('');
    }

    generateOrderId(currentOrderId) {
        const currentNumber = parseInt(currentOrderId.slice(1));
        const nextNumber = currentNumber + 1;
        return `D${nextNumber.toString().padStart(4, '0')}`;
    }

    getLastOrderId() {
        if (getOrders().length === 0) return 'D001';
        let orderId = getOrders().slice(-1)[0].id;
        return this.generateOrderId(orderId);

    }
}

new PlaceOrder();


//Place Order page End------------------------------------------------------------------------
