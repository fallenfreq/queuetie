type ServerError = Error & AllErrorProps;
type ErrorProps = {
    messages?: never;
    message?: never;
    status?: number;
    expose?: boolean;
    exit?: boolean;
    cause?: ServerError;
    handler?: (message: string) => unknown;
    [k: string]: unknown;
};
type MsgProps = {
    messages?: string[];
    message?: string;
};
type ReplaceProps<Target, Source> = {
    [TargetKey in keyof Target]: TargetKey extends keyof Source ? Source[TargetKey] : Target[TargetKey];
};
type AllErrorProps = ReplaceProps<ErrorProps, MsgProps>;
type ExposedThrow = {
    (status?: ErrorProps['status'], message?: MsgProps['message'], properties?: ErrorProps): never;
    (status?: ErrorProps['status'], messages?: MsgProps['messages'], properties?: ErrorProps): never;
    (status: ErrorProps['status'], error: Error, properties?: ErrorProps): never;
    (error: Error, properties?: ErrorProps): never;
    (properties?: AllErrorProps): never;
};
declare const exposeThrow: ExposedThrow;
export { exposeThrow, type ServerError };
//# sourceMappingURL=exposeThrow.d.ts.map