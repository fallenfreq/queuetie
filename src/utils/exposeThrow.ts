import { type AugmentedResponse } from '../response.js'

type ServerError = Error & AllErrorProps

type ErrorProps = {
  messages?: never,
  message?: never,
  status?: number,
  expose?: boolean,
  exit?: boolean,
  cause?: ServerError,
  handler?: (message:string) => unknown,
  [k:string]: unknown
}

type MsgProps = {
  messages?: string[],
  message?: string,
}

type ReplaceProps<Target, Source> = {
  [TargetKey in keyof Target]: TargetKey extends keyof Source
    ? Source[TargetKey] : Target[TargetKey]
}

type AllErrorProps = ReplaceProps<ErrorProps, MsgProps>

type ExposedThrow = {
  (status?:ErrorProps['status'], message?:MsgProps['message'], properties?:ErrorProps):never,
  (status?:ErrorProps['status'], messages?:MsgProps['messages'], properties?:ErrorProps):never,
  (status:ErrorProps['status'], error:Error, properties?:ErrorProps):never,
  (error:Error, properties?:ErrorProps):never
  (properties?:AllErrorProps):never,
}

const exposeThrow:ExposedThrow = function(
  this:AugmentedResponse,
  arg1?:ErrorProps['status'] | Error | Omit<ErrorProps, keyof MsgProps> & MsgProps,
  arg2?:MsgProps['message'] | MsgProps['messages'] | Error | ErrorProps,
  arg3?:ErrorProps
) {

  let { status, message, messages, error, props } = {
    // used to set types only
  } as AllErrorProps & { error?:Error, props?:AllErrorProps }
  
  if (typeof arg1 === 'number') status = arg1
  else if (arg1 instanceof Error) error = arg1
  else if (typeof arg1 === 'object') props = arg1

  if (typeof arg2 === 'string') message = arg2
  if (Array.isArray(arg2)) messages = arg2
  else if (arg2 instanceof Error) error = arg2
  else if (typeof arg2 === 'object') props = arg2

  if (arg3) props = arg3
  
  props ||= {}
  messages ||= props.messages
  message ||= props.message

  if (messages) {
    message = messages.map((message:string) =>
      message).join(', ')
  }

  const err:AllErrorProps = Object.assign(
    error || new Error(message),
    props
  )

  Error.captureStackTrace(err, this.throw)

  if (status) err.status = status
  if (messages) err.messages = messages
  err.expose = true
  throw err
}

export { exposeThrow, type ServerError }