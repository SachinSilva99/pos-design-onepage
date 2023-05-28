//customers page start---------------------------------------------------------------
import {Customer} from "../model/Customer.js";
import {customers, setCustomers} from "../db/DB.js";

export class CustomerController {
    constructor() {
        $('#add_customer').click(this.addCustomer.bind(this));
        $('#update_customer').click(this.updateCustomer.bind(this));
        $('#delete').click(this.updateCustomer.bind(this));
        $(document).ready(this.loadCustomersIfAvailable.bind(this));
        $('#customerTbl').on('click', 'tr', this.clickTableLoadFields.bind(this));
        $("#customerTbl").on("click", ".customer_delete",this.deleteCustomer.bind(this));
    }

    loadCustomersTbl(){

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
    addCustomer(e){
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
        this.loadCustomersTbl();
    }
    updateCustomer(e){
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
        this.loadCustomersTbl();
    }
    loadCustomersIfAvailable() {

        //loading customers if available
        let tempCustomers = JSON.parse(localStorage.getItem('customers'));
        console.log(tempCustomers);
        if (tempCustomers !== null) {
            console.log(tempCustomers);
            setCustomers(tempCustomers.map(c => new Customer(c._customerId, c._name, c._address)));
            this.loadCustomersTbl();
        }

        //load customer ids in place order options
        customers.map(c => {
            $('#customerIds').append(`<option value=${c.customerId}>${c.customerId}</option>`);
        });
    }
    clickTableLoadFields(e){
        const customerId = $(e.target).closest('tr').find('th').eq(0).text();

        for (const customer of customers) {
            if (customerId === customer.customerId) {
                $('#customer_id').val(customer.customerId);
                $('#customer_name').val(customer.name);
                $('#customer_address').val(customer.address);
                return;
            }
        }
    }
    deleteCustomer(e){
        const customerId = $(e.target).closest("tr").find("th").eq(0).text();
        console.log(customerId);
        setCustomers(customers.filter((customer) => customer.customerId !== customerId));
        localStorage.setItem("customers", JSON.stringify(customers));
        this.loadCustomersTbl();
    }
}
new CustomerController();