import Realm from 'realm';

export interface IRepository<T> {
    Find(item: T): Realm.Results<T>;
    FindOne(id: string): T | null;

    Create(item: Partial<T>): boolean;
    Update(id: string, item: T): boolean;
    Delete(item: T): boolean;
}
