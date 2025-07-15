import { randomUUID, type UUID } from 'node:crypto'


export type NamespacedUuid<$Prefix extends string> = `${$Prefix}::${UUID}`

export function generateNamespacedUuid<$Prefix extends string>(prefix: $Prefix): NamespacedUuid<$Prefix> {
  return `${prefix}::${randomUUID()}`
}
