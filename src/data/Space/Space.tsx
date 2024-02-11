import Realm, { ObjectSchema } from 'realm';
import Item from '../Item/Item';

class Space extends Realm.Object<Space> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    name!: string;
    items: Realm.List<Item> = new Realm.List();

    static generate(name: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name
        }
    }

    static schema: ObjectSchema = {
        name: 'Space',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            name: 'string',
            items: 'Item[]'
        },
        primaryKey: '_id',
    };
}

export default Space;
