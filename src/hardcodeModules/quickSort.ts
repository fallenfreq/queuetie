type Comparable = string | number | Date | boolean | bigint;

function sort<T extends Comparable>(array: T[], sortValue?: (item: T) => Comparable, reverse?: boolean): T[]
function sort<T>(array: T[], sortValue: (item: T) => Comparable, reverse?: boolean): T[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sort<T>(array: T[], sortValue: (item: T) => Comparable = (item: any):Comparable => item, reverse = false): T[] {
  const condition = (item:T, pivot:T) => reverse
    ? sortValue(item) > sortValue(pivot)
    : sortValue(item) < sortValue(pivot)

  if (!array[0]) return array
  const [pivot, ...rest] = array
  const [left, right] = rest
    .reduce((sorted:[T[], T[]], item:T) => {
      condition(item, pivot)
        ? sorted[0].push(item)
        : sorted[1].push(item)
      return sorted
    }, [[], []])
  return [
    ...sort(left, sortValue, reverse),
    pivot,
    ...sort(right, sortValue, reverse)
  ]
}

export default sort