export class Customer{
    constructor(customerId, name, address) {
        this._customerId = customerId;
        this._name = name;
        this._address = address;
    }

    get customerId() {
        return this._customerId;
    }

    set customerId(value) {
        this._customerId = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get address() {
        return this._address;
    }

    set address(value) {
        this._address = value;
    }
}