import Realm, {ObjectSchema} from 'realm';
import ItemUnit from './ItemUnit';
import ItemHistoryLine from './ItemHistoryLine';
import Space from '../Space/Space';

class Item extends Realm.Object<Item> {
    _id: Realm.BSON.ObjectId = new Realm.BSON.ObjectId();
    name!: string;
    units: Realm.Dictionary<number> = new Realm.Dictionary();
    history: Realm.List<ItemHistoryLine> = new Realm.List();
    imagePath: string = '';
    space?: Space;

    static generate(name: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
        };
    }

    static schema: ObjectSchema = {
        name: 'Item',
        properties: {
            _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
            name: 'string',
            units: 'double{}',
            history: 'ItemHistoryLine[]',
            imagePath: 'string',
            space: {
                type: 'linkingObjects',
                objectType: 'Space',
                property: 'items',
            },
            categories: {
                type: 'linkingObjects',
                objectType: 'ItemCategory',
                property: 'items',
            },
        },
        primaryKey: '_id',
    };
}

export default Item;
