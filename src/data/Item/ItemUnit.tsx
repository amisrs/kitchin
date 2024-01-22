class ItemUnit {
    quantity: number = 0;
    unitName: string = 'unit';
    unitNamePlural?: string = 'units';

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