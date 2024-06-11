type Comparable = string | number | Date | boolean | bigint;
declare function sort<T extends Comparable>(array: T[], sortValue?: (item: T) => Comparable, reverse?: boolean): T[];
declare function sort<T>(array: T[], sortValue: (item: T) => Comparable, reverse?: boolean): T[];
export default sort;
//# sourceMappingURL=quickSort.d.ts.map