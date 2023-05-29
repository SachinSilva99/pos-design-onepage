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
        $("#customerTbl").on("click", ".customer_delete", this.deleteCustomer.bind(this));
        $('.fields').on('keyup', this.validateCustomerDetails.bind(this));
        this.allFiledsValidated = false;
        this.customerIdElement = $('#customer_id');
        this.customerNameElement = $('#customer_name');
        this.customerAddressElement = $('#customer_address');
    }

    loadCustomersTbl() {

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

    addCustomer(e) {
        e.preventDefault();

        if (!this.allFiledsValidated) {
            $('#msg').text('Check the invalid fields!!!');
            $('#alertInfo').text('Warning');
            $('#alertModal').modal('show');
            return;
        }
        const customer = new Customer(
            this.customerIdElement.val(),
            this.customerNameElement.val(),
            this.customerAddressElement.val()
        );
        const customerExists = customers.some((c) => c.customerId === this.customerIdElement.val());
        if (customerExists) {
            alert("Customer Already exists");
            return;
        }
        customers.push(customer);
        this.customerIdElement.val('');
        this.customerNameElement.val('');
        this.customerAddressElement.val('');
        localStorage.setItem("customers", JSON.stringify(customers));
        $('#msg').text('Customer Added Successfully');
        $('#alertInfo').text('Success');
        $('#alertModal').modal('show');
        this.loadCustomersTbl();
    }

    updateCustomer(e) {
        e.preventDefault();
        const customerId = this.customerIdElement.val();
        const customerName = this.customerNameElement.val();
        const customerAddress = this.customerAddressElement.val();
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

    clickTableLoadFields(e) {
        const customerId = $(e.target).closest('tr').find('th').eq(0).text();

        for (const customer of customers) {
            if (customerId === customer.customerId) {
                this.customerIdElement.val(customer.customerId);
                this.customerNameElement.val(customer.name);
                this.customerAddressElement.val(customer.address);
                return;
            }
        }
    }

    deleteCustomer(e) {
        const customerId = $(e.target).closest("tr").find("th").eq(0).text();
        console.log(customerId);
        setCustomers(customers.filter((customer) => customer.customerId !== customerId));
        localStorage.setItem("customers", JSON.stringify(customers));
        $('#msg').text('Customer Deleted Successfully');
        $('#alertInfo').text('Success');
        $('#alertModal').modal('show');
        this.loadCustomersTbl();
    }

    validateCustomerDetails() {
        const customerId = this.customerIdElement.val();
        const customerName = this.customerNameElement.val();
        const customerAddress = this.customerAddressElement.val();
        const cIdReg = /^C\d{4}$/;
        const cNameReg = /^[A-Za-z\s'-]+$/;
        const cAddressReg = /^[0-9A-Za-z\s',.-]+$/;
        $('.fields').css('border', 'none');
        if (!cIdReg.test(customerId)) {
            this.customerIdElement.css('border', '3px solid crimson');
            this.allFiledsValidated = false;
        } else if (!cNameReg.test(customerName)) {
            this.customerNameElement.css('border', '3px solid crimson');
            this.allFiledsValidated = false;
        } else if (!cAddressReg.test(customerAddress)) {
            this.customerAddressElement.css('border', '3px solid crimson');
            this.allFiledsValidated = false;
        } else {
            this.allFiledsValidated = true;
        }
    }
}

new CustomerController();