import { useObject, useQuery, useRealm } from '@realm/react';
import Item from './Item';
import { IRepository } from '../Repository';
import Realm from 'realm';
import ItemUnit from './ItemUnit';
import ItemHistoryLine from './ItemHistoryLine';
import { ITEM_OPERATIONS } from '../../constants';

class ItemRepository implements IRepository<Item> {
    readonly realm;
    constructor(realm: Realm) {
        this.realm = realm;
    }
    FindOne(id: string | Realm.BSON.ObjectId): Item | null {
        return useObject(Item, id);
    }
    UpdateOperationAdd(id: string | Realm.BSON.ObjectId, quantity: number, unitName: string): boolean {
        const item = useObject(Item, id);
        if (!item) {
            return false;
        }

        try {
            this.realm.write(() => {
                this.realm.create(ItemHistoryLine.schema.name, {
                    _id: new Realm.BSON.ObjectId(),
                    itemId: item._id,
                    quantity: quantity,
                    unit: unitName,
                    operation: ITEM_OPERATIONS.ADD,
                    date: new Date(),
                    parent: item
                });
            })
        } catch (error) {
            return false;
        }
        return true;
    }

    UpdateOperationRemove(id: string | Realm.BSON.ObjectId, quantity: number, unitName: string): boolean {
        const item = useObject(Item, id);
        if (!item) {
            return false;
        }

        try {
            this.realm.write(() => {
                this.realm.create(ItemHistoryLine.schema.name, {
                    _id: new Realm.BSON.ObjectId(),
                    itemId: item._id,
                    quantity: quantity,
                    unit: unitName,
                    operation: ITEM_OPERATIONS.REMOVE,
                    date: new Date(),
                    parent: item
                });
            })
        } catch (error) {
            return false;
        }
        return true;
    }

    Delete(item: Item): boolean {
        try {
            this.realm.write(() => {
                this.realm.delete(item);
            })
            return true;
        } catch (error) {
            return false;
        }
    }
    Find(): Realm.Results<Item> {
        return useQuery(Item, items => items);
    }
    Create({ name, units }: Partial<Item>): boolean {
        if (units) {
            try {
                this.realm.write(() => {
                    const result = this.realm.create(Item.schema.name, { name: name, units: Object.fromEntries(units) });
                    console.log(result)
                });
                return true;
            } catch (error) {
                console.log(error)
                return false;
            }

        } else {
            console.log(`no unit`);
            return false;
        }
    }
}

export default ItemRepository;
