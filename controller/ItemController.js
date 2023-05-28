import {items,  setItems} from "../db/DB.js";
import {Item} from "../model/Item.js";
export class ItemController{
    constructor() {
        $(document).ready(this.loadingItemsIfAvailable.bind(this));
        $('#addItem').click(this.addItem.bind(this));
        $('#itemUpdate').click(this.updateItem.bind(this));
        $('#itemTbl').on('click', 'tr',this.clickOnTableItemLoadFields.bind(this));
        $("#itemTbl").on("click", ".item_delete",this.deleteItem.bind(this));
    }
    loadingItemsIfAvailable(){
        //loading items if available
        let tempItems = JSON.parse(localStorage.getItem('items'));
        if (tempItems !== null) {
            setItems(tempItems.map(i => new Item(i._code, i._des, i._price, i._qty)));
            this.loadItemsTbl();
        }
        //load item codes in place order options
        items.map(i => {
            $('#itemCodes').append(`<option value=${i.code}>${i.code}</option>`);
        });
    }
    loadItemsTbl(){
        let tempItems = JSON.parse(localStorage.getItem('items'));
        if (tempItems !== null) {
            setItems(tempItems.map(i => new Item(i._code, i._des, i._price,i._qty)));
        }
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
    //add item-------------------------------------------------------------
    addItem(e){

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
        this.loadItemsTbl();
    }
    //update item-------------------------------------------------------------
    updateItem(e){
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
        this.loadItemsTbl();
    }
    //click on item table row and load to the fields----------------------------------
    clickOnTableItemLoadFields(e){
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
    }
    //delete item
    deleteItem(e){
        const itemCode = $(e.target).closest("tr").find("td").eq(0).text();
        console.log(itemCode);
        setItems(items.filter((item) => item.code !== itemCode));
        localStorage.setItem("items", JSON.stringify(items));
        this.loadItemsTbl();
    }
}
new ItemController();