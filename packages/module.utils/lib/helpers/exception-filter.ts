/**
 * Returns a `.catch()` handler that only intercepts errors which are instances
 * of one of the given exception classes, delegates them to your `handler`,
 * and re-throws everything else.
 *
 * @param types    An array of Error subclasses to catch (e.g. [MyError, OtherError])
 * @param handler  A function that takes the caught exception and either
 *                 returns a value (to recover) or throws a new exception.
 *
 * @example
 * await somePromise()
 *   .catch(
 *     filterException(
 *       [EmailTakenException, PhoneNumberTakenException],
 *       err => { throw new BadRequestException(err.message) }
 *     )
 *   )
 */
export function filterException<
  C extends readonly(new (...args: any[]) => any)[],
  R = unknown,
>(
  types: readonly [...C],
  handler: (err: InstanceType<C[number]>) => R
): (error: unknown) => R {
  return (error: unknown): R => {
    if (types.some(Type => error instanceof Type)) {
      console.log('here <--------------')
      // `C[number]` is the union of all constructors in the tuple C
      // InstanceType<C[number]> is the union of all their instance types
      return handler(error as InstanceType<C[number]>)
    }
    throw error
  }
}
