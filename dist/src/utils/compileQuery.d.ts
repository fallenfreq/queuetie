type ParamDataObject = {
    [key: string | number]: undefined | string | number | ParamData | (string | number | ParamData)[];
};
type ParamDataArray = (string | number | ParamData)[];
type ParamData = ParamDataObject | ParamDataArray;
declare const compileQuery: (searchParams: URLSearchParams) => ParamDataArray | null;
export { compileQuery, type ParamDataObject };
//# sourceMappingURL=compileQuery.d.ts.map