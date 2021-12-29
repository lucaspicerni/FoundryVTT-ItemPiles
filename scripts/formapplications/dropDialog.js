import CONSTANTS from "../constants.js";
import API from "../api.js";

export default class DropDialog extends FormApplication {

    static query(droppedItem, dropObjects){

        return new Promise(resolve => {
            new DropDialog(resolve, droppedItem, dropObjects).render(true);
        });

    }

    constructor(resolve, droppedItem, dropObjects) {
        super();
        this.resolve = resolve;
        this.droppedItem = droppedItem;
        this.dropObjects = dropObjects;
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: game.i18n.localize("ITEM-PILES.DropItem.Title"),
            classes: ["dialog"],
            template: `${CONSTANTS.PATH}templates/drop-dialog.html`,
            width: 430,
            height: "auto"
        });
    }

    async getData(options) {
        const data = super.getData(options);

        data.dropObjects = this.dropObjects;
        data.itemsAtLocation = this.dropObjects.length > 0;
        data.droppedItem = this.droppedItem;
        data.itemQuantity = getProperty(this.droppedItem, API.quantity_attribute) ?? 1;
        data.itemQuantityMoreThanOne = data.itemQuantity > 1;

        return data;
    }

    activateListeners(html){
        super.activateListeners(html);
        const slider = html.find("#rangeSlider");
        const input = html.find("#rangeValue")
        slider.on("input", function(){
            input.val($(this).val());
        })
        input.change(function(){
            slider.slider('value', $(this).val());
        })
    }

    async _updateObject(event, formData) {

        if(event.submitter.value === "cancel"){
            return this.resolve(false);
        }

        formData.action = event.submitter.value;

        return this.resolve(formData);

    }

    async close(options){
        await super.close(options);
        this.resolve(false);
    }

}
/*
dropType = await new Promise(resolve => {
    new Dialog({
        title: game.i18n.localize("ITEM-PILES.AddToPile.Title"),
        content: `<p>${game.i18n.localize("ITEM-PILES.AddToPile.Content")}</p>`,
        buttons: {
            addToPile: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("ITEM-PILES.AddToPile.AddToPile"),
                callback: () => {
                    resolve("addToPile")
                }
            },
            newPile: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("ITEM-PILES.AddToPile.NewPile"),
                callback: () => {
                    resolve("newPile")
                }
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("ITEM-PILES.AddToPile.Cancel"),
                callback: () => {
                    resolve(false)
                }
            },
        },
        default: "cancel",
        close: html => {
            resolve(false);
        }
    }).render(true);
});*/