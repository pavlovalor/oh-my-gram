declare global {
  export type MaybePromise<$Content> = Promise<$Content> | $Content
}

export {}