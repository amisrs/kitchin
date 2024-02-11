import Realm from 'realm';

export interface IRepository<T> {
    Find(item: T): Realm.Results<T>;
    FindOne(id: string): T | null;
    Create(item: any): boolean;
    Delete(item: T): boolean;
}
