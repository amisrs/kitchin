import { useObject, useQuery, useRealm } from '@realm/react';
import Item from './Item';
import { IRepository } from '../Repository';
import Realm from 'realm';
import ItemUnit from './ItemUnit';
import ItemHistoryLine from './ItemHistoryLine';
import { ITEM_OPERATIONS } from '../../constants';
import Space from '../Space/Space';

class ItemRepository implements IRepository<Item> {
    readonly realm;
    constructor(realm: Realm) {
        this.realm = realm;
    }
    FindOne(id: string | Realm.BSON.ObjectId): Item | null {
        return this.realm.objectForPrimaryKey(Item, id);
    }
    UpdateOperationAdd(id: string | Realm.BSON.ObjectId, quantity: number, unitName: string): boolean {
        const item = this.realm.objectForPrimaryKey(Item, id);
        if (!item) {
            return false;
        }

        try {
            this.realm.write(() => {
                if (!item.units) {
                    item.units = new Realm.Dictionary();
                }
                item.units.set(unitName, item.units[unitName] + quantity);
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
        const item = this.realm.objectForPrimaryKey(Item, id);
        if (!item || !item.units) {
            return false;
        }
        try {
            this.realm.write(() => {
                if (Array.from(item.units.keys()).includes(unitName)) {
                    item.units.set(unitName, item.units[unitName] - quantity);
                } else {
                    console.log("Unit not found")
                    return false;
                }
                const newHistory = this.realm.create(ItemHistoryLine.schema.name, {
                    _id: new Realm.BSON.ObjectId(),
                    quantity: quantity,
                    unit: unitName,
                    operation: ITEM_OPERATIONS.REMOVE,
                    date: new Date(),
                    parent: item
                }) as ItemHistoryLine;

                item.history.push(newHistory)
            })
        } catch (error) {
            console.log(error)
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
    Create({ name, units, space }: { name: string, units: Map<string, number>, space?: string | Realm.BSON.ObjectId | null}): boolean {
        if (units) {
            const unit = units.entries().next().value;

            try {

                const newObjectId = new Realm.BSON.ObjectId();
                const newUnits = {
                    [unit[0]]: unit[1]
                }
                let targetSpace: Space | null = null;
                if (space) {
                    targetSpace = this.realm.objectForPrimaryKey(Space, Realm.BSON.ObjectID.createFromHexString(space.toString()));
                }
                this.realm.write(() => {
                    this.realm.create(Item.schema.name, {
                        _id: newObjectId,
                        name: name,
                        units: newUnits,
                        history: [],
                        ...(targetSpace && { space: targetSpace })
                    });

                    const result = this.realm.objectForPrimaryKey(Item, newObjectId);
                    if (!result) {
                        throw Error("Item not found");
                    }

                    if (targetSpace) {
                        targetSpace.items.push(result);
                    }

                    const historyId = new Realm.BSON.ObjectId();
                    this.realm.create(ItemHistoryLine.schema.name, {
                        _id: historyId,
                        quantity: unit[1],
                        unit: unit[0],
                        operation: ITEM_OPERATIONS.ADD,
                        date: new Date(),
                        parent: result
                    });
                    const historyResult = this.realm.objectForPrimaryKey(ItemHistoryLine, historyId);
                    if (!historyResult) {
                        throw Error("Item not found");
                    }

                    result.history.push(historyResult)
                })
                return true;
            } catch (error) {
                console.log(error)
                throw error;
            }

        } else {
            console.log(`no unit`);
            return false;
        }
    }
}

export default ItemRepository;
