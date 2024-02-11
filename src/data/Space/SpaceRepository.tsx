import { useObject, useQuery, useRealm } from '@realm/react';
import { IRepository } from '../Repository';
import Realm from 'realm';
import { ITEM_OPERATIONS } from '../../constants';
import Space from './Space';
import { ObjectId } from 'bson';
import Item from '../Item/Item';

class SpaceRepository implements IRepository<Space> {
    readonly realm;
    constructor(realm: Realm) {
        this.realm = realm;
    }
    FindOne(id: string | Realm.BSON.ObjectId): Space | null {
        return this.realm.objectForPrimaryKey(Space, id);
    }
    Delete(item: Space): boolean {
        try {
            this.realm.write(() => {
                this.realm.delete(item);
            })
            return true;
        } catch (error) {
            return false;
        }
    }

    Find(): Realm.Results<Space> {
        return useQuery(Space, items => items);
    }

    Create({ name }: { name: string }): boolean {
        try {

            const newObjectId = new Realm.BSON.ObjectId();
            this.realm.write(() => {
                this.realm.create(Space.schema.name, {
                    _id: newObjectId,
                    name: name
                });
            })
            return true;
        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    UpdateOperationAdd(item: Item, space: string | Realm.BSON.ObjectId) {

    }

    UpdateOperationRemove(item: Item, space: string | Realm.BSON.ObjectId) {

    }
}

export default SpaceRepository;
