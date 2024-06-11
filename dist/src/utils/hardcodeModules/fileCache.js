import stream from 'stream';
// The index functions are used to efficiently remove the
// least accessed cache items first during clean without having
// to check date stamps
const removeIndex = (cache, key) => {
    const { indexed } = cache;
    const curIndex = indexed.indexOf(key);
    return indexed.splice(curIndex, 1)[0];
};
// moves index to the back
const updateIndex = (cache, key) => {
    const removedIndex = removeIndex(cache, key);
    if (!removedIndex)
        throw Error('No index to remove');
    cache.indexed.push(removedIndex);
};
const updateBytes = (cache, key) => {
    const cacheItem = cache.store.get(key);
    if (!cacheItem)
        throw Error('Item is missing from cache');
    const curBytes = cacheItem.bytes;
    return cache.bytes -= curBytes;
};
const handleStreamData = (data, cacheItem, cache, resolve) => {
    data.on('data', (chunk) => {
        cacheItem.bytes += chunk.length;
        cacheItem.data.push(chunk);
    });
    data.on('end', () => {
        cache.bytes += cacheItem.bytes;
        resolve(undefined);
    });
};
const createCacheItem = (key, bytes, data) => ({
    key,
    bytes: bytes,
    data,
    dateStamp: new Date
});
// I can't get typescript to infer the correct param type with data being 
// either TData | IData depending on the overload used
// I am testing values at runtime, casting and leaving comments in the body
const set = async function set(key, data, bytes) {
    if (this.store.has(key)) {
        updateIndex(this, key);
        updateBytes(this, key);
    }
    else
        this.indexed.push(key);
    let cacheItem;
    if (bytes) { // if bytes, data must be IData
        cacheItem = createCacheItem(key, bytes, data);
        this.bytes += bytes;
    }
    else if (data instanceof stream.Readable)
        await new Promise((resolve) => {
            cacheItem = createCacheItem(key, 0, Array());
            // if data is instanceof stream.Readable, then data is TData
            // TData is stream.Readable and IData is Buffer[]
            handleStreamData(data, cacheItem, this, resolve);
        });
    else {
        cacheItem = createCacheItem(key, data instanceof Buffer
            ? Buffer.byteLength(data)
            : typeof data === 'string'
                ? data.length
                : 0, data); // if data is Buffer or string, data must be IData
        if (cacheItem.bytes === 0)
            throw Error('Could not calculate length of ' + cacheItem.data);
        this.bytes += cacheItem.bytes;
    }
    if (!cacheItem)
        throw Error('Cache iteam was not created');
    this.store.set(key, cacheItem);
    return cacheItem;
};
const get = function (key) {
    const result = this.store.get(key);
    if (result)
        updateIndex(this, key);
    return result;
};
const deleteCache = function (key) {
    const result = this.store.delete(key);
    if (result)
        removeIndex(this, key);
    return result;
};
const clean = function () {
    const { limit, indexed, store, freeUp } = this;
    if (this.bytes < limit)
        return this;
    const targetSize = limit - freeUp;
    while (this.bytes > targetSize) {
        const key = indexed[0];
        if (!key)
            throw Error('There should be a key if there are bytes');
        const value = this.get(key);
        if (!value)
            throw Error('There should be a value if there is a key and bytes');
        this.bytes -= value.bytes;
        store.delete(key);
    }
    return this;
};
const createCache = ({ interval = (1000 * 60 * 60 * 24), limit, freeUp = 0 }) => {
    const cache = {
        interval,
        limit,
        freeUp,
        bytes: 0,
        indexed: Array(),
        store: new Map(),
        delete: deleteCache,
        set,
        get,
        clean
    };
    // check cache once a day and remove oldest entries
    // until there is at least "freeUp" amount of space available
    setInterval(cache.clean, interval);
    return cache;
};
export { createCache };
// // testing
// import * as crypto from 'crypto'
// import { createReadStream } from 'fs'
// import { fileURLToPath } from "url"
// const myStreamCache = createCache<string, stream.Readable>({limit: 60})
// const myCache = createCache<string, Buffer, Buffer>({limit: 40, freeUp: 10})
// // @ts-expect-error
// createCache<string, Buffer, string>({limit: 40, freeUp: 10})
// // @ts-expect-error
// createCache<string, stream.Readable, stream.Readable>({limit:10})
// const readstream = createReadStream(fileURLToPath(import.meta.url))
// const bufferArrayProm = myStreamCache.set('stream1', readstream)
// const bufferArray = myStreamCache.get('stream1')
// const data = bufferArray?.data!
// // i'd propbably make a seperate function in the future for a set that handled streams
// // instead of having to cast one of the params due to overloads, however
// // I have got this working in a typesafe way
// // @ts-expect-error
// storeStreamCache.set('test', readstream)
// // @ts-expect-error
// storeStreamCache.set('test', readstream, 10)
// console.log({
//   bufferArrayProm,
//   bufferArray
// })
// myCache.set('one', crypto.randomBytes(5))
// console.log(myCache)
// myCache.set('10', crypto.randomBytes(10))
// console.log(myCache)
// myCache.set('two', crypto.randomBytes(10))
// console.log(myCache)
// myCache.set('three', crypto.randomBytes(10))
// console.log(myCache)
// myCache.set('four', crypto.randomBytes(10))
// console.log(myCache)
// console.log('running clean fn')
// myCache.clean()
// // clean will run if the limit is reached. If limit is 40
// // and theres only 40 bytes in there, and freeUp is 0 then nothing happens
// console.log(myCache.get('two'),'one')
