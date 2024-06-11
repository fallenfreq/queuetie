type JsonSerializable =
  | null
  | boolean
  | number
  | string
  | JsonSerializable[]
  | {[key: string]: JsonSerializable };


export type {
  JsonSerializable,
}