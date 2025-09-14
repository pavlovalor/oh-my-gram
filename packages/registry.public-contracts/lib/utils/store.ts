import { AnyFunction } from './types'


/** Configuration object for persisting the state */
export interface PersistenceConfig {
  /** The storage mechanism (e.g., localStorage or sessionStorage). */
  storage: Storage;
  /** The key used to store the state in the storage. */
  storageKey: string;
  /** The version of the persisted state. */
  version: number;
}

/**
 * Represents the structure of the state object stored in persistence.
 *
 * @template $State - The type of the state being persisted (object or null).
 */
interface StateObject<$State extends object | null> {
  /** The actual state data. */
  data: $State;
  /** The version of the persisted state. */
  version: number;
  /** The timestamp when the state was last updated. */
  updatedAt: number;
}


/**
 * The Store class manages a piece of state with the ability to subscribe to changes,
 * update the state, and optionally persist the state in storage.
 *
 * @template $State - The type of the state, which can be an object or null.
 */
export class Store<$State extends object | null> {
  private readonly listeners: Set<AnyFunction>
  private state: $State

  /**
   * Creates an instance of the Store class.
   *
   * @param initialState - The initial state to set in the store.
   * @param persistenceConfig - The optional configuration for persisting the state.
   *
   * @throws If the extracted state has an invalid version.
   */
  constructor(
    initialState: $State,
    private readonly persistenceConfig?: PersistenceConfig
  ) {
    const extractedState = this.extractState()
    const isValidExtractedState = (extractedState?.version && this.persistenceConfig?.version)
      && extractedState.version === this.persistenceConfig.version

    // If the extracted state is valid, use it; otherwise, fall back to the initial state.
    this.state = isValidExtractedState ? extractedState!.data : initialState
    this.listeners = new Set<AnyFunction>()
  }


  /**
   * Subscribes a listener function to state changes.
   *
   * @param listener - The listener function to be called when the state changes.
   * @returns A function to unsubscribe the listener.
   */
  public subscribe(listener: AnyFunction): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }


  /**
   * Unsubscribes a listener function from state changes.
   *
   * @param listener - The listener function to be removed from the subscription.
   */
  public unsubscribe(listener: AnyFunction): void {
    this.listeners.delete(listener)
  }


  /**
   * Gets the current state.
   *
   * @returns The current state of the store.
   */
  public getState(): $State {
    return this.state
  }


  /**
   * Sets the new state and notifies listeners. Optionally, saves the state to persistence.
   *
   * @param newState - The new state to be set.
   */
  public setState(newState: $State): void {
    this.state = newState
    this.notifyListeners()
    this.saveState()
  }


  /**
   * Saves the current state to persistent storage if persistence is enabled.
   * The state is stored as a JSON string.
   */
  private saveState(): void {
    if (!this.persistenceConfig) return
    this.persistenceConfig.storage.setItem(
      this.persistenceConfig.storageKey,
      JSON.stringify({
        data: this.state,
        updatedAt: Date.now(),
        version: this.persistenceConfig.version,
      } satisfies StateObject<$State>)
    )
  }


  /**
   * Extracts the stored state from persistence.
   *
   * @returns The extracted state or undefined if no state is found.
   */
  private extractState(): StateObject<$State> | undefined {
    if (!this.persistenceConfig) return
    const json = this.persistenceConfig.storage.getItem(this.persistenceConfig.storageKey)
    return json ? JSON.parse(json) : undefined
  }


  /**
   * Notifies all listeners of state changes.
   * This method calls each listener function in the listeners set.
   */
  private notifyListeners(): void {
    this.listeners.forEach(Function.prototype.call)
  }
}
