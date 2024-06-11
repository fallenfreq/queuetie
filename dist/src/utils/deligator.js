// class OriginalClass {
//   method1(arg1: number) {
//     // implementation
//   }
function route(path) {
    if (path.includes('?'))
        return createDelegator([obj1, obj2, delegator1], ['method1', 'method2', 'route']);
    else
        return this;
}
function createDelegator(objects, keys) {
    const delegator = {};
    const nestedMultiRouteLeafs = [];
    for (const key of keys) {
        const originalMethod = objects[0][key];
        if (typeof originalMethod === 'function') {
            delegator[key] = function (...args) {
                for (const obj of objects) {
                    const method = obj[key];
                    const result = method.apply(obj, args);
                    if (key === 'route') {
                        nestedMultiRouteLeafs.push(result);
                    }
                }
                return nestedMultiRouteLeafs.length
                    ? createDelegator(nestedMultiRouteLeafs, keys)
                    : this;
            };
        }
    }
    return delegator;
}
const obj = {
    route: route,
    method1: (arg1) => { },
    method2: (arg1, arg2) => 10,
    val: true
};
const obj1 = {
    route: route,
    method1: (arg1) => { },
    method2: (arg1, arg2) => 10,
    val: true
};
const obj2 = {
    route: route,
    method1: (arg1) => { },
    method2: (arg1, arg2) => 10,
    val: true
};
const delegator1 = obj.route('10?').route('10');
const delegator2 = createDelegator([obj1, obj2, delegator1], ['method1', 'method2', 'route']);
const result1 = delegator2.method1(42);
const result2 = delegator2.method2('hello', true);
delegator2.route('10').route('1?0').route('string');
export {};
