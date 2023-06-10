//customers page start---------------------------------------------------------------
import {Customer} from "../model/Customer.js";
import {getCustomers, setCustomers} from "../db/DB.js";

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
        $('#customerSearchField').on('keyup', this.searchCustomers.bind(this));
    }

    searchCustomers() {
        const searchField = $('#customerSearchField').val();
        const matchedCustomers = getCustomers().filter(
            c => c.customerId.includes(searchField) || c.name.includes(searchField)
        );
        let tr = ``;
        matchedCustomers.map(customer => {
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

    loadCustomersTbl() {
        let tr = ``;
        getCustomers().map(customer => {
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
        const customerExists = getCustomers().some((c)=> c.customerId === this.customerIdElement.val());
        if (customerExists) {
            alert("Customer Already exists");
            return;
        }
        const customers = getCustomers();
        customers.push(customer);
        this.customerIdElement.val('');
        this.customerNameElement.val('');
        this.customerAddressElement.val('');
        setCustomers(customers);
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
        const customers = getCustomers();
        customers.forEach((customer) => {
            if (customerId === customer.customerId) {
                customer.name = customerName;
                customer.address = customerAddress;
                alert('customer updated successfully');
            }
        });
        setCustomers(customers);
        this.loadCustomersTbl();
    }

    loadCustomersIfAvailable() {

        //loading customers if available
        getCustomers();
        this.loadCustomersTbl();

        //load customer ids in place order options
        getCustomers().map(c => {
            $('#customerIds').append(`<option value=${c.customerId}>${c.customerId}</option>`);
        });
    }

    clickTableLoadFields(e) {
        const customerId = $(e.target).closest('tr').find('th').eq(0).text();

        for (const customer of getCustomers()) {
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
        setCustomers(getCustomers().filter((customer) => customer.customerId !== customerId));
        $('#msg').text('Customer Deleted Successfully');
        $('#alertInfo').text('Success');
        $('#alertModal').modal('show');
        this.loadCustomersTbl();
    }

    validateCustomerDetails() {
        const customerId = this.customerIdElement.val();
        const customerName = this.customerNameElement.val();
        const customerAddress = this.customerAddressElement.val();
        const cIdReg = /^C00\d+$/;
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