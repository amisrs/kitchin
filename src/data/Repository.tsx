import Realm from 'realm';

export interface IRepository<T> {
    Find(item: T): Realm.Results<T>;
    FindOne(id: string): T | null;
    UpdateOperationAdd(id: string | Realm.BSON.ObjectId, quantity: number, unitName: string): boolean;
    UpdateOperationRemove(id: string | Realm.BSON.ObjectId, quantity: number, unitName: string): boolean;

    Create(item: any): boolean;
    Delete(item: T): boolean;
}
