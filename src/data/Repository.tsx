import Realm from 'realm';

export interface IRepository<T> {
    Find(item: T): Realm.Results<T>;
    FindOne(id: string): T | null;
    Create(item: any): Realm.BSON.ObjectId;
    Delete(item: T): boolean;
}
