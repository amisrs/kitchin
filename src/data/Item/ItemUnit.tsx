class ItemUnit {
    quantity: number = 0;
    unitName: string = 'unit';
    unitNamePlural?: string = 'units';

    GetUnitString() {
        return `${this.quantity.toString()} ${this.quantity != 1 ? this.unitName : this.unitNamePlural}`
    }

    AddQuantity(amountToAdd: number) {
        this.quantity += amountToAdd;
    }

    SubtractQuantity(amountToSubtract: number) {
        this.quantity -= amountToSubtract;
        if (this.quantity <= 0) {
            // should handle here?
        }
    }
}

export default ItemUnit;