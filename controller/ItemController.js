import {getItems,  setItems} from "../db/DB.js";
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
        //load item codes in place order options
        getItems().map(i => {
            $('#itemCodes').append(`<option value=${i.code}>${i.code}</option>`);
        });
    }
    loadItemsTbl(){
        let tr = ``;
        getItems().map(item => {
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
        const itemExists = getItems().some((i) => i.code === itemCode);
        if (itemExists) {
            alert("Item Already exists");
            return;
        }
        const items = getItems();
        items.push(item);
        $('#item_code').val('');
        $('#item_description').val('');
        $('#item_price').val('');
        $('#item_qty').val('');
        setItems(items);
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
        const items = getItems();
        items.forEach((item) => {
            if (itemCode === item.code) {
                item.des = des;
                item.price = price;
                item.qty = qty;
                alert('item updated successfully');
            }
        });
        setItems(items);

        this.loadItemsTbl();
    }
    //click on item table row and load to the fields----------------------------------
    clickOnTableItemLoadFields(e){
        const itemCode = $(e.target).closest('tr').find('td').eq(0).text();
        console.log(itemCode)
        for (const item of getItems()) {
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
        setItems(getItems().filter((item) => item.code !== itemCode));
        this.loadItemsTbl();
    }
}
new ItemController();