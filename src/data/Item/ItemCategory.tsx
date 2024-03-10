import Item from "./Item";

class ItemCategory extends Realm.Object<ItemCategory> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    name: string = 'default';
    color: string = '#000000';
    icon: string = 'jar';
    items: Realm.List<Item> = new Realm.List();

    static schema: Realm.ObjectSchema = {
        name: 'ItemCategory',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            name: 'string',
            color: 'string',
            icon: 'string',
            items: 'Item[]',
        },
        primaryKey: '_id',
    }
}

export default ItemCategory;
