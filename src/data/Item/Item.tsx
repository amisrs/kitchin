import Realm, { ObjectSchema } from 'realm';
import ItemUnit from './ItemUnit';

class Item extends Realm.Object<Item> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    name!: string;
    units: Map<string, number> = new Map();
    

    static generate(name: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name
        }
    }

    static schema: ObjectSchema = {
        name: 'Item',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            name: 'string',
            units: 'double{}',
        },
        primaryKey: '_id',
    };
}

export default Item;
