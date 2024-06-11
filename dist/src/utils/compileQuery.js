// need to explicitly return the value for the compiler to know if its ParamData or string
const setParameter = (data, key, nKey, value) => {
    !Array.isArray(data) ? data[key] = value : data[nKey] = value;
    return value;
};
const orSetParameter = (data, key, nKey, value) => {
    return !Array.isArray(data) ? data[key] ||= value : data[nKey] ||= value;
};
const getParameter = (data, key, nKey) => {
    return !Array.isArray(data) ? data[key] : data[nKey];
};
// multiple 0 keys would make position 0 at root be an array [['a', 'b', 'c']]
// keys 0, 1, 2 would set thoes positions in root ['a', 'b', 'c']
const compileQuery = (searchParams) => {
    let root = [];
    for (const [name, stringValue] of searchParams) {
        const numberValue = Number(stringValue);
        const value = isNaN(numberValue) ? stringValue : numberValue;
        const segs = name.split('.');
        let i = 0;
        let acc = root;
        let parentKey;
        let parent;
        for (const seg of segs) {
            const nSeg = Number(seg);
            const existingValue = getParameter(acc, seg, nSeg);
            // if there is a string key or if the
            // indexes are in the wrong order, it becomes an object
            if (Array.isArray(acc)
                && nSeg !== acc.length
                && !existingValue) {
                acc = Object.assign({}, acc);
                if (parent && parentKey) {
                    if (Array.isArray(parent))
                        parent[Number(parentKey)] = acc;
                    else
                        (parent)[parentKey] = acc;
                }
                else
                    root = acc;
            }
            // if you go to set a value and it's an array allready, push value
            // if it's a string, put it and the new val in an array together
            // if it's an object, im doing the same thing as for strings for now
            if (segs.length - 1 === i) {
                if (existingValue && Array.isArray(existingValue))
                    existingValue.push(value);
                else if (typeof existingValue === 'string' || typeof existingValue === 'number')
                    setParameter(acc, seg, nSeg, [existingValue, value]);
                else if (typeof existingValue === 'object')
                    setParameter(acc, seg, nSeg, [existingValue, value]);
                else
                    setParameter(acc, seg, nSeg, value);
            }
            else {
                // if string in existingValue, place into an array to continue traversing
                const existingValue = orSetParameter(acc, seg, nSeg, []);
                const nextAcc = typeof existingValue === 'string'
                    || typeof existingValue === 'number'
                    ? setParameter(acc, seg, nSeg, [existingValue])
                    : existingValue;
                // update vars for next seg
                parent = acc;
                parentKey = seg;
                acc = nextAcc;
            }
            i++;
        }
    }
    return Array.isArray(root) ? root[0] ? root : null : root;
};
export { compileQuery };
