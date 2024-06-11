/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import stream from 'stream';
type SetCacheItem = {
    <TKey, TData extends stream.Readable, IData extends Buffer[]>(this: Cache<TKey, TData, IData>, key: TKey, data: TData): Promise<CacheItem<TKey, IData>>;
    <TKey, TData extends string | Buffer, IData extends TData = TData>(this: Cache<TKey, TData, IData>, key: TKey, data: IData): Promise<CacheItem<TKey, IData>>;
    <TKey, TData, IData extends TData = TData>(this: Cache<TKey, TData, IData>, key: TKey, data: IData extends stream.Readable ? never : IData, bytes: number): Promise<CacheItem<TKey, IData>>;
};
declare const set: SetCacheItem;
declare const get: <TKey, TData, IData>(this: Cache<TKey, TData, IData>, key: TKey) => CacheItem<TKey, IData> | undefined;
declare const deleteCache: <TKey, TData, IData>(this: Cache<TKey, TData, IData>, key: TKey) => boolean;
declare const clean: <TKey, TData, IData>(this: Cache<TKey, TData, IData>) => Cache<TKey, TData, IData>;
type CacheItem<TKey, IData> = {
    key: TKey;
    dateStamp: Date;
    bytes: number;
    data: IData;
};
type CreateCacheArgs = {
    interval?: number;
    limit: number;
    freeUp?: number;
};
type Cache<TKey, TData, IData> = Required<CreateCacheArgs> & {
    bytes: number;
    indexed: TKey[];
    store: Map<TKey, CacheItem<TKey, IData>>;
    set: typeof set;
    get: typeof get;
    delete: typeof deleteCache;
    clean: typeof clean;
};
type CacheDefaultIData<TData> = TData extends stream.Readable ? Buffer[] : TData;
declare const createCache: <TKey extends unknown, TData, IData extends CacheDefaultIData<TData> = CacheDefaultIData<TData>>({ interval, limit, freeUp }: CreateCacheArgs) => Cache<TKey, TData, IData>;
export { createCache, type Cache };
//# sourceMappingURL=index.d.ts.map