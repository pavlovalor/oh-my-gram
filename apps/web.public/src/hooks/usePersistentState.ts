/* eslint-disable react-hooks/rules-of-hooks */
import dayjs from 'dayjs'
import * as React from 'react'


/** Emulates local or session storage that lives within runtime */
const virtualStorage = new class VirtualStorage implements Storage {
  private items = new Map<string, string>()

  getItem(key: string): string | null {
    return this.items.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.items.set(key, value)
  }

  removeItem(key: string): void {
    this.items.delete(key)
  }

  clear(): void {
    this.items.clear()
  }

  get length() {
    return this.items.size
  }

  key(): string | null {
    return null
  }
}

/** Allows to specify state persistence behavior */
export type PersistentStateOptions<
  $Base = {
    /** Defines human readable storage key. Useful in case of debugging */
    readonly storageKey?: string
  }
> = $Base | $Base & {
  /** Defines state version. Mismatched version will be removed */
  readonly version?: number
  /** Points in what storage save the state */
  readonly storage: Storage
}

/** Deserialized storage record */
export interface StorageRecord<$Data> {
  /** Indicates when the last record update occurred */
  updatedAt: string
  /** Used to avoid state mismatches */
  version: number
  /** Record content specification */
  state?: $Data
}

/**
 * Holds standard react state that is being backed up via specified storage.
 * Allows for state to live even if holding component had being unmounted.
 * Lifetime is specified by storage of choice. Default storage lives within runtime.
 * @param initialState if present, used as for state type inference
 * @param options allows for behavior specification
 * @param options.storageKey Defines human readable storage key. Useful in case of debugging
 * @param options.version Defines state version. Mismatched version will be removed. `options.storage' is required
 * @param options.storage Points in what storage save the state
 *
 * @example
 * ```ts
 * // Lives at runtime. Zero configuration
 * const [state_VS, setState_VS] = usePersistentState("I live when component isn't there")
 *
 * // Lives in Session storage
 * const [state_LS, setState_LS] = usePersistentState("I live a bit longer", {
 *   // Save state is Local Storage so it will persist as long a Local storage lives
 *   storage: window.sessionStorage,
 * })
 *
 * // Lives in Local storage + human readable key and versioning
 * const [state_SS, setState_SS] = usePersistentState("I live until I don't", {
 *   // Save state is Session Storage so it's going to live a long as there is a tab with origin opened
 *   storage: createSessionStorage(),
 *   // Defines human readable storage key. Useful in case of debugging
 *   storageKey: 'human-readable-storage-key',
 *   // Defines state version. Mismatched version will be removed
 *   version: 1.1,
 * })
 * ```
 */
export function usePersistentState<$State>(
  initialState?: $State,
  options: PersistentStateOptions = {},
) {
  const version = 'version' in options ? options.version ?? 0 : 0
  const storage = 'storage' in options ? options.storage : virtualStorage
  const recordId = options.storageKey ?? React.useId()
  const recordKey = `omg::state::${recordId}`

  /** Extracts(at leas tries to extract) data under a matching key */
  const extractedState = React.useMemo(() => {
    try {
      const serializedRecord = storage.getItem(recordKey)
      const record: StorageRecord<$State> = JSON.parse(serializedRecord as string)

      if (record?.version === version) return record.state
      else storage.removeItem(recordId)
    } catch (exception: unknown) { return }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [state, setState] = React.useState<$State>(extractedState ?? initialState!)

  /** Syncs storage record on state changes */
  React.useEffect(() => {
    const record: StorageRecord<$State> = {
      updatedAt: dayjs().toISOString(),
      version,
      state,
    }
    storage.setItem(recordKey, JSON.stringify(record))
  }, [recordId, storage, state, version, recordKey])

  return [state, setState] as const
}
