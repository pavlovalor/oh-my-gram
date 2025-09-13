import { cssAbsoluteUnits, cssRelativeUnits, cssViewportUnits, cssTemporalUnits } from './constants'

export {}

declare global {
  type Nullable<$Type> = null | $Type
  type Optional<$Type> = null | undefined | $Type

  type UnionToIntersection<$Union>
    = ($Union extends any ? (x: $Union) => void : never) extends ((x: infer $Intersection) => void)
    ? $Intersection
    : never

  /** Matches simple callable function */
  type Callable<$Parameters = any[], $Return = any>
    = (...args: $Parameters) => $Return

  type PartiallyNullable<$Target> = {
    [$Key in keyof $Target]?: $Target[$Key] | null
  }

  /** Creates union of all possible keys of a data structure */
  type PathsOf<$Target extends object, $Delimiter = '.'> = {
    [$Key in keyof $Target & (string | number)]: $Target[$Key] extends object
      ? `${$Key}` | `${$Key}${$Delimiter}${PathsOf<$Target[$Key]>}`
      : `${$Key}`
  }[keyof $Target & (string | number)]

  type CSSAbsoluteUnits = typeof cssAbsoluteUnits[number]
  type CSSRelativeUnits = typeof cssRelativeUnits[number]
  type CSSViewportUnits = typeof cssViewportUnits[number]
  type CSSTemporalUnits = typeof cssTemporalUnits[number]
  type CSSUnits = CSSAbsoluteUnits | CSSRelativeUnits | CSSViewportUnits | CSSTemporalUnits

  type CSSRGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`
  type CSSRGBColor = `rgb(${number}, ${number}, ${number})`
  type CSSHLSColor = `hsl(${number}deg ${number}% ${number}%)`
  type CSSHLSAColor = `hsla(${number}deg ${number}% ${number}% / ${number}%)`
  type CSSHWBColor = `hwb(${number}deg ${number}% ${number}% / ${number}%)`
  type CSSHexColor = `#${string}`
  type CSSColor = CSSHexColor | CSSHWBColor | CSSHLSAColor | CSSHLSColor | CSSRGBAColor | CSSRGBColor

  type CSSMediaDisplay = 'media' | 'print' | 'all'
  type CSSMediaOrientation = 'portrait' | 'landscape'
  type CSSMediaColorScheme = 'light' | 'dark'

  /**
   * Describes any CSS value that has units assigned to it(except for 0-zero)
   * @example You can limit units usage by puting in generic with allowed units:
   *
   * ````typescript
   *  type SamplePixelValue = CSSValueWithUnits<'px'>
   *  type SampleAbsoluteValue = CSSValueWithUnits<CSSAbsoluteUnits>
   *
   *  // Works
   *  const pixels: SamplePixelValue = '13px'
   *  const millimeters: SampleAbsoluteValue = '100mm'
   *  // Fails
   *  const embeddedValue: SamplePixelValue = '42em'
   *  const relativeValue: SampleAbsoluteValue = '100%'
   * ````
   */
  type CSSValueWithUnits<$Unit extends CSSUnits = CSSUnits> = `${number}${$Unit}` | `0`

  type Repeating<$String extends string, $Delimiter extends string = ','>
    = $String | `${$String}, ${Repeating<$String, $Delimiter>}`

  type CSSVarFunction = `var(--${string})`
  type CSSCalcFunction = `calc(${string})`
  type CSSMinFunction = `min(${string})`
  type CSSMaxFunction = `max(${string})`
  type CSSRadialGradientFunction = `radial-gradient(${string})`
  type CSSConicGradientFunction = `conic-gradient(${string})`
  type CSSLinearGradientFunction = `linear-gradient(${string})`
  type CSSGradientFunction = CSSLinearGradientFunction | CSSConicGradientFunction | CSSRadialGradientFunction

  type CSSColorValue = CSSColor | CSSGradientFunction


  /**
   * Maps every possible value of untyped JSON
   */
  type JSONStructure =
    | string
    | number
    | boolean
    | null
    | undefined
    | { [x: string]: JSONStructure }
    | Array<JSONStructure>


  /**
   * Converts string types to parsed versions described in generics
   * @example Converting string to number/boolean
   * ````typescript
   * const foo = '42' as const
   * const bar = 'true' as const
   *
   * // Works
   * type SampleParseNum = ParseFromString<number, typeof foo> // type: 42
   * type SampleParseBool = ParseFromString<boolean, typeof bar> // type: true
   *
   * // Fails
   * type SampleMismatchNum = ParseFromString<boolean, typeof foo> // type: never
   * ````
   */
  type ParseFromString<$Type extends boolean | number | bigint, $Target>
    = $Target extends `${infer $Match extends $Type}` ? $Match : never


  /**
   *
   */
  interface MediaFileDeclaration {
    /** Base location of storage containing target resource */
    host: string
    /** Local storage file path */
    path: string
    /**
     * HTTP IANA media type
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
     */
    mime: string
    /** Additional resource meta information */
    meta?: Record<string, string>
  }

  interface String {
    replaceAt(index: number, value: string): string;
  }
}
