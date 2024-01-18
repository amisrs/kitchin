import { useObject, useQuery, useRealm } from '@realm/react';
import Item from './Item';
import { IRepository } from '../Repository';
import Realm from 'realm';
import ItemUnit from './ItemUnit';

class ItemRepository implements IRepository<Item> {
    readonly realm;
    constructor(realm: Realm) {
        this.realm = realm;
    }
    FindOne(id: string | Realm.BSON.ObjectId): Item | null {
        return useObject(Item, id);
    }
    Update(id: string, item: Item): boolean {
        throw new Error('Method not implemented.');
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
