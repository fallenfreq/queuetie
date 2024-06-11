// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sort(array, sortValue = (item) => item, reverse = false) {
    const condition = (item, pivot) => reverse
        ? sortValue(item) > sortValue(pivot)
        : sortValue(item) < sortValue(pivot);
    if (!array[0])
        return array;
    const [pivot, ...rest] = array;
    const [left, right] = rest
        .reduce((sorted, item) => {
        condition(item, pivot)
            ? sorted[0].push(item)
            : sorted[1].push(item);
        return sorted;
    }, [[], []]);
    return [
        ...sort(left, sortValue, reverse),
        pivot,
        ...sort(right, sortValue, reverse)
    ];
}
export default sort;
