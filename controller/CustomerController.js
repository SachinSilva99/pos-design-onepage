
//customers page start---------------------------------------------------------------
import {Customer} from "../model/Customer.js";
import {customers, setCustomers} from "../db/DB.js";


$(document).ready(function () {

    //loading customers if available
    let tempCustomers = JSON.parse(localStorage.getItem('customers'));
    console.log(tempCustomers);
    if (tempCustomers !== null) {
        console.log(tempCustomers);
        setCustomers(tempCustomers.map(c => new Customer(c._customerId, c._name, c._address)));
        loadCustomersTbl();
    }

    //load customer ids in place order options
    customers.map(c => {
        $('#customerIds').append(`<option value=${c.customerId}>${c.customerId}</option>`);
    });

});
$('#add_customer').click((e) => {
    e.preventDefault();
    const customerId = $('#customer_id').val();
    const customerName = $('#customer_name').val();
    const customerAddress = $('#customer_address').val();
    const customer = new Customer(customerId, customerName, customerAddress);
    const customerExists = customers.some((c) => c.customerId === customerId);
    if (customerExists) {
        alert("Customer Already exists");
        return;
    }
    customers.push(customer);
    $('#customer_id').val("");
    $('#customer_name').val("");
    $('#customer_address').val("");
    localStorage.setItem("customers", JSON.stringify(customers));
    alert(customer.customerId + " Added Successfully");
    loadCustomersTbl();
});
//update customer-------------------------------------------------------------
$('#update_customer').click((e) => {
    e.preventDefault();
    const customerId = $('#customer_id').val();
    const customerName = $('#customer_name').val();
    const customerAddress = $('#customer_address').val();
    customers.forEach((customer) => {
        if (customerId === customer.customerId) {
            customer.name = customerName;
            customer.address = customerAddress;
            alert('customer updated successfully');
        }
    });
    localStorage.setItem("customers", JSON.stringify(customers));
    loadCustomersTbl();

});

//click on customer table row and load to the fields----------------------------------
$('#customerTbl').on('click', 'tr', (e) => {
    const customerId = $(e.target).closest('tr').find('th').eq(0).text();

    for (const customer of customers) {
        if (customerId === customer.customerId) {
            $('#customer_id').val(customer.customerId);
            $('#customer_name').val(customer.name);
            $('#customer_address').val(customer.address);
            return;
        }
    }
});

function loadCustomersTbl() {
    let tempCustomers = JSON.parse(localStorage.getItem('customers'));
    if (tempCustomers !== null) {
        setCustomers(tempCustomers.map(c => new Customer(c._customerId, c._name, c._address)));
    }
    let tr = ``;
    customers.map(customer => {
        tr += `
            <tr>
              <th scope="row">${customer.customerId}</th>
            <td>${customer.name}</td>
            <td>${customer.address}</td>
            <td>
                <button class="customer_delete btn btn-danger">Delete</button>
            </td>
            </tr>
        `;
    });
    $('#customerTbl').html(tr);
}
$("#customerTbl").on("click", ".customer_delete", (e) => {
    const customerId = $(e.target).closest("tr").find("th").eq(0).text();
    console.log(customerId);
    deleteCustomer(customerId);
});
function deleteCustomer(customerId) {
    setCustomers( customers.filter((customer) => customer.customerId !== customerId));
    localStorage.setItem("customers", JSON.stringify(customers));
    loadCustomersTbl();
}

//Customers page end------------------------------------------------------------------------