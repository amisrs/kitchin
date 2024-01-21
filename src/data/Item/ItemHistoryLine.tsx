import Realm, { ObjectSchema } from 'realm';
import ItemUnit from './ItemUnit';
import { ITEM_OPERATIONS } from '../../constants';

class ItemHistoryLine extends Realm.Object<ItemHistoryLine> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    itemId: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    quantity: number = 0;
    unit: string = 'unit';
    date: Date = new Date();
    operation: ITEM_OPERATIONS = ITEM_OPERATIONS.ADD;
    
    static schema: ObjectSchema = {
        name: 'ItemHistoryLine',
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            itemId: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            quantity: 'double',
            unit: 'string',
            date: 'date',
            operation: 'string',
            parent: {
                type: 'linkingObjects',
                objectType: 'Item',
                property: 'history'
            }
        },
        primaryKey: '_id',
    };
}

export default ItemHistoryLine;
