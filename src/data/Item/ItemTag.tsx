import Item from "./Item";

class ItemTag extends Realm.Object<ItemTag> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    name: string = 'default';
    color: string = '#000000';
    icon: string = 'jar';
    items: Realm.List<Item> = new Realm.List();

    static schema: Realm.ObjectSchema = {
        name: 'ItemTag',
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

export default ItemTag;
