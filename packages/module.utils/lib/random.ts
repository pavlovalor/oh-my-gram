/**
 * Used for an array random item extraction
 * @param array any collection of elements
 * @returns a tuple of random index and corresponding value
 */
export function randomArrayItem<$Array extends readonly unknown[]>(array: $Array) {
  const index: keyof $Array = Math.floor(Math.random() * array.length)
  const value: $Array[number] = array[index]

  return [index, value] as const
}

/**
  * Extracts random items from an array.
  * @param array any collection of elements
  * @param count number of items to extract
 *
 */
export function randomArrayItems<$Array extends readonly unknown[]>(array: $Array, count: number): $Array {
  const indexes = new Set<number>()
  while (indexes.size < count) {
    indexes.add(Math.floor(Math.random() * array.length))
  }
  return Array.from(indexes).map(index => array[index]) as unknown as $Array
}

/**
 * Generates a random integer between min and max
 * @param min minimum value
 * @param max maximum value
 */
export function randomInt(min: number = 0, max: number = 100) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
