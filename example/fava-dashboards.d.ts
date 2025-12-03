
declare module "fava-dashboards" {
  import { DataGridProps } from '@mui/x-data-grid';
  import { ECElementEvent } from 'echarts';
  import { EChartsOption } from 'echarts';
  import { GridValidRowModel } from '@mui/x-data-grid';
  import { JSX } from 'react/jsx-runtime';
  import { ReactElement } from 'react';
  import { SankeyLink } from 'd3-sankey';
  import { SankeyNode } from 'd3-sankey';
  
  interface Account {
      meta: Record<string, string | number>;
  }
  
  export interface Amount {
      number: number;
      currency: string;
  }
  
  interface BasePanel {
      title?: string;
      width?: string;
      height?: string;
      link?: string;
      variables?: VariableDefinition[];
  }
  
  interface BaseVariableDefinition<T> {
      name: string;
      label?: string;
      display?: "select" | "toggle";
      options: (params: VariablesParams) => MaybePromise<T[]>;
  }
  
  interface Commodity {
      currency: string;
      meta: Record<string, string | number>;
  }
  
  export interface Config {
      dashboards: Dashboard[];
  }
  
  export interface Cost {
      number: number;
      currency: string;
      date: string;
  }
  
  export type D3SankeyLink = SankeyLink<SankeyNodeProperties, SankeyLinkProperties>;
  
  export type D3SankeyNode = SankeyNode<SankeyNodeProperties, SankeyLinkProperties>;
  
  function D3SankeyPanel({ spec }: PanelProps<SankeySpec>): JSX.Element;
  
  export interface Dashboard {
      name: string;
      variables?: VariableDefinition[];
      panels: Panel[];
  }
  
  export function defineConfig(config: Config): Config;
  
  function EChartsPanel({ spec }: PanelProps<EChartsSpec>): JSX.Element;
  
  export interface EChartsSpec extends EChartsOption {
      onClick?: (params: ECElementEvent) => void;
      onDblClick?: (params: ECElementEvent) => void;
  }
  
  function HtmlPanel({ spec }: PanelProps<string>): JSX.Element;
  
  export type Inventory = Record<string, number>;
  
  export type Ledger = LedgerData & LedgerApi;
  
  interface LedgerApi {
      query<T = any>(bql: string): Promise<QueryResult<T>>;
      urlFor(url: string): string;
  }
  
  interface LedgerData {
      /** start date of the current date filter, or first transaction date of the ledger */
      dateFirst: string;
      /** end date of the current date filter, or last transaction date of the ledger */
      dateLast: string;
      /** start date of the current date filter, or undefined if no date filter is set */
      filterFirst?: string;
      /** end date of the current date filter, or undefined if no date filter is set */
      filterLast?: string;
      /** configured operating currencies of the ledger */
      operatingCurrencies: string[];
      /** shortcut for the first configured operating currency of the ledger */
      ccy: string;
      /** declared accounts of the ledger */
      accounts: Record<string, Account>;
      /** declared commodities of the ledger */
      commodities: Record<string, Commodity>;
  }
  
  type MaybePromise<T> = T | Promise<T>;
  
  export type Panel = BasePanel & {
      [T in PanelKind]: {
          kind: T;
          spec: (params: SpecParams) => MaybePromise<PanelSpecOf<T>>;
      };
  }[PanelKind];
  
  type PanelKind = keyof PanelRegistry;
  
  interface PanelProps<T> {
      spec: T;
  }
  
  type PanelRegistry = typeof panelRegistry;
  
  const panelRegistry: {
      readonly html: typeof HtmlPanel;
      readonly echarts: typeof EChartsPanel;
      readonly d3_sankey: typeof D3SankeyPanel;
      readonly table: typeof TablePanel;
      readonly react: typeof ReactPanel;
  };
  
  type PanelSpecOf<T extends PanelKind> = Parameters<PanelRegistry[T]>[0]["spec"];
  
  export interface Position {
      units: Amount;
      cost?: Cost;
  }
  
  export type QueryResult<T> = T[];
  
  function ReactPanel(_props: PanelProps<ReactElement>): JSX.Element;
  
  interface SankeyLinkProperties {
      uid?: string;
  }
  
  interface SankeyNodeProperties {
      name: string;
      label?: string;
  }
  
  interface SankeySpec {
      align?: "left" | "right" | "center" | "justify";
      fontSize?: number;
      fontColor?: string;
      edgeColor?: "none" | "path" | "input";
      valueFormatter?: (value: number) => string;
      onClick?: (event: Event, d: SankeyNode<SankeyNodeProperties, SankeyLinkProperties>) => void;
      data: {
          nodes: D3SankeyNode[];
          links: D3SankeyLink[];
      };
  }
  
  type SpecParams = {
      panel: Panel;
      ledger: Ledger;
      variables: VariablesContents;
  };
  
  function TablePanel({ spec }: PanelProps<TableSpec>): JSX.Element;
  
  export type TableSpec<R extends GridValidRowModel = any> = DataGridProps<R>;
  
  export type VariableDefinition<T = VariableType> = BaseVariableDefinition<T> & ({
      multiple?: false;
      default?: T;
  } | {
      multiple: true;
      default?: T[];
  });
  
  export type VariablesContents = Record<string, any>;
  
  export type VariablesParams = {
      ledger: Ledger;
      variables: VariablesContents;
  };
  
  type VariableType = string | number;
  
  export { }
  
}

declare module "echarts" {
  interface GradientObject {
      id?: number;
      type: string;
      colorStops: GradientColorStop[];
      global?: boolean;
  }
  interface GradientColorStop {
      offset: number;
      color: string;
  }
  class Gradient {
      id?: number;
      type: string;
      colorStops: GradientColorStop[];
      global: boolean;
      constructor(colorStops: GradientColorStop[]);
      addColorStop(offset: number, color: string): void;
  }
  
  interface RadialGradientObject extends GradientObject {
      type: 'radial';
      x: number;
      y: number;
      r: number;
  }
  class RadialGradient extends Gradient {
      type: 'radial';
      x: number;
      y: number;
      r: number;
      constructor(x: number, y: number, r: number, colorStops?: GradientColorStop[], globalCoord?: boolean);
  }
  
  interface LinearGradientObject extends GradientObject {
      type: 'linear';
      x: number;
      y: number;
      x2: number;
      y2: number;
  }
  class LinearGradient extends Gradient {
      type: 'linear';
      x: number;
      y: number;
      x2: number;
      y2: number;
      constructor(x: number, y: number, x2: number, y2: number, colorStops?: GradientColorStop[], globalCoord?: boolean);
  }
  
  type Dictionary<T> = {
      [key: string]: T;
  };
  type ArrayLike$1<T> = {
      [key: number]: T;
      length: number;
  };
  type NullUndefined = null | undefined;
  type ImageLike = HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;
  type TextVerticalAlign = 'top' | 'middle' | 'bottom';
  type TextAlign = 'left' | 'center' | 'right';
  type FontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  type FontStyle = 'normal' | 'italic' | 'oblique';
  type BuiltinTextPosition = 'left' | 'right' | 'top' | 'bottom' | 'inside' | 'insideLeft' | 'insideRight' | 'insideTop' | 'insideBottom' | 'insideTopLeft' | 'insideTopRight' | 'insideBottomLeft' | 'insideBottomRight';
  type ZREventProperties = {
      zrX: number;
      zrY: number;
      zrDelta: number;
      zrEventControl: 'no_globalout' | 'only_globalout';
      zrByTouch: boolean;
  };
  type ZRRawMouseEvent = MouseEvent & ZREventProperties;
  type ZRRawTouchEvent = TouchEvent & ZREventProperties;
  type ZRRawPointerEvent = TouchEvent & ZREventProperties;
  type ZRRawEvent = ZRRawMouseEvent | ZRRawTouchEvent | ZRRawPointerEvent;
  type ElementEventName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseover' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu' | 'drag' | 'dragstart' | 'dragend' | 'dragenter' | 'dragleave' | 'dragover' | 'drop' | 'globalout';
  type ElementEventNameWithOn = 'onclick' | 'ondblclick' | 'onmousewheel' | 'onmouseout' | 'onmouseup' | 'onmousedown' | 'onmousemove' | 'oncontextmenu' | 'ondrag' | 'ondragstart' | 'ondragend' | 'ondragenter' | 'ondragleave' | 'ondragover' | 'ondrop';
  type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
  type FunctionPropertyNames<T> = {
      [K in keyof T]: T[K] extends Function ? K : never;
  }[keyof T];
  type MapToType<T extends Dictionary<any>, S> = {
      [P in keyof T]: T[P] extends Dictionary<any> ? MapToType<T[P], S> : S;
  };
  type KeyOfDistributive<T> = T extends unknown ? keyof T : never;
  type WithThisType<Func extends (...args: any) => any, This> = (this: This, ...args: Parameters<Func>) => ReturnType<Func>;
  
  type SVGVNodeAttrs = Record<string, string | number | undefined | boolean>;
  interface SVGVNode {
      tag: string;
      attrs: SVGVNodeAttrs;
      children?: SVGVNode[];
      text?: string;
      elm?: Node;
      key: string;
  }
  
  type ImagePatternRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
  interface PatternObjectBase {
      id?: number;
      type?: 'pattern';
      x?: number;
      y?: number;
      rotation?: number;
      scaleX?: number;
      scaleY?: number;
  }
  interface ImagePatternObject extends PatternObjectBase {
      image: ImageLike | string;
      repeat?: ImagePatternRepeat;
      imageWidth?: number;
      imageHeight?: number;
  }
  interface SVGPatternObject extends PatternObjectBase {
      svgElement?: SVGVNode;
      svgWidth?: number;
      svgHeight?: number;
  }
  type PatternObject = ImagePatternObject | SVGPatternObject;
  
  const nativeSlice: (start?: number, end?: number) => any[];
  function guid(): number;
  function logError(...args: any[]): void;
  function clone<T extends any>(source: T): T;
  function merge<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S, overwrite?: boolean): T & S;
  function merge<T extends any, S extends any>(target: T, source: S, overwrite?: boolean): T | S;
  function mergeAll(targetAndSources: any[], overwrite?: boolean): any;
  function extend<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S): T & S;
  function defaults<T extends Dictionary<any>, S extends Dictionary<any>>(target: T, source: S, overlay?: boolean): T & S;
  const createCanvas: () => HTMLCanvasElement;
  function indexOf<T>(array: T[] | readonly T[] | ArrayLike$1<T>, value: T): number;
  function inherits(clazz: Function, baseClazz: Function): void;
  function mixin<T, S>(target: T | Function, source: S | Function, override?: boolean): void;
  function isArrayLike(data: any): data is ArrayLike$1<any>;
  function each<I extends Dictionary<any> | any[] | readonly any[] | ArrayLike$1<any>, Context>(arr: I, cb: (this: Context, value: I extends (infer T)[] | readonly (infer T)[] | ArrayLike$1<infer T> ? T : I extends Dictionary<any> ? I extends Record<infer K, infer T> ? T : unknown : unknown, index?: I extends any[] | readonly any[] | ArrayLike$1<any> ? number : keyof I & string, arr?: I) => void, context?: Context): void;
  function map<T, R, Context>(arr: readonly T[], cb: (this: Context, val: T, index?: number, arr?: readonly T[]) => R, context?: Context): R[];
  function reduce<T, S, Context>(arr: readonly T[], cb: (this: Context, previousValue: S, currentValue: T, currentIndex?: number, arr?: readonly T[]) => S, memo?: S, context?: Context): S;
  function filter<T, Context>(arr: readonly T[], cb: (this: Context, value: T, index: number, arr: readonly T[]) => boolean, context?: Context): T[];
  function find<T, Context>(arr: readonly T[], cb: (this: Context, value: T, index?: number, arr?: readonly T[]) => boolean, context?: Context): T;
  function keys<T extends object>(obj: T): (KeyOfDistributive<T> & string)[];
  type Bind1<F, Ctx> = F extends (this: Ctx, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Bind2<F, Ctx, T1> = F extends (this: Ctx, a: T1, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Bind3<F, Ctx, T1, T2> = F extends (this: Ctx, a: T1, b: T2, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Bind4<F, Ctx, T1, T2, T3> = F extends (this: Ctx, a: T1, b: T2, c: T3, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Bind5<F, Ctx, T1, T2, T3, T4> = F extends (this: Ctx, a: T1, b: T2, c: T3, d: T4, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type BindFunc<Ctx> = (this: Ctx, ...arg: any[]) => any;
  interface FunctionBind {
      <F extends BindFunc<Ctx>, Ctx>(func: F, ctx: Ctx): Bind1<F, Ctx>;
      <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0]>(func: F, ctx: Ctx, a: T1): Bind2<F, Ctx, T1>;
      <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1]>(func: F, ctx: Ctx, a: T1, b: T2): Bind3<F, Ctx, T1, T2>;
      <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2]>(func: F, ctx: Ctx, a: T1, b: T2, c: T3): Bind4<F, Ctx, T1, T2, T3>;
      <F extends BindFunc<Ctx>, Ctx, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2], T4 extends Parameters<F>[3]>(func: F, ctx: Ctx, a: T1, b: T2, c: T3, d: T4): Bind5<F, Ctx, T1, T2, T3, T4>;
  }
  const bind: FunctionBind;
  type Curry1<F, T1> = F extends (a: T1, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Curry2<F, T1, T2> = F extends (a: T1, b: T2, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Curry3<F, T1, T2, T3> = F extends (a: T1, b: T2, c: T3, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type Curry4<F, T1, T2, T3, T4> = F extends (a: T1, b: T2, c: T3, d: T4, ...args: infer A) => infer R ? (...args: A) => R : unknown;
  type CurryFunc = (...arg: any[]) => any;
  function curry<F extends CurryFunc, T1 extends Parameters<F>[0]>(func: F, a: T1): Curry1<F, T1>;
  function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1]>(func: F, a: T1, b: T2): Curry2<F, T1, T2>;
  function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2]>(func: F, a: T1, b: T2, c: T3): Curry3<F, T1, T2, T3>;
  function curry<F extends CurryFunc, T1 extends Parameters<F>[0], T2 extends Parameters<F>[1], T3 extends Parameters<F>[2], T4 extends Parameters<F>[3]>(func: F, a: T1, b: T2, c: T3, d: T4): Curry4<F, T1, T2, T3, T4>;
  
  function isArray(value: any): value is any[];
  function isFunction(value: any): value is Function;
  function isString(value: any): value is string;
  function isStringSafe(value: any): value is string;
  function isNumber(value: any): value is number;
  function isObject<T = unknown>(value: T): value is (object & T);
  function isBuiltInObject(value: any): boolean;
  function isTypedArray(value: any): boolean;
  function isDom(value: any): value is HTMLElement;
  function isGradientObject(value: any): value is GradientObject;
  function isImagePatternObject(value: any): value is ImagePatternObject;
  function isRegExp(value: unknown): value is RegExp;
  function eqNaN(value: any): boolean;
  function retrieve<T>(...args: T[]): T;
  function retrieve2<T, R>(value0: T, value1: R): T | R;
  function retrieve3<T, R, W>(value0: T, value1: R, value2: W): T | R | W;
  type SliceParams = Parameters<typeof nativeSlice>;
  function slice<T>(arr: ArrayLike$1<T>, ...args: SliceParams): T[];
  function normalizeCssArray(val: number | number[]): number[];
  function assert(condition: any, message?: string): void;
  function trim(str: string): string;
  function setAsPrimitive(obj: any): void;
  function isPrimitive(obj: any): boolean;
  interface MapInterface<T, KEY extends string | number = string | number> {
      delete(key: KEY): boolean;
      has(key: KEY): boolean;
      get(key: KEY): T | undefined;
      set(key: KEY, value: T): this;
      keys(): KEY[];
      forEach(callback: (value: T, key: KEY) => void): void;
  }
  class HashMap<T, KEY extends string | number = string | number> {
      data: MapInterface<T, KEY>;
      constructor(obj?: HashMap<T, KEY> | {
          [key in KEY]?: T;
      } | KEY[]);
      hasKey(key: KEY): boolean;
      get(key: KEY): T;
      set(key: KEY, value: T): T;
      each<Context>(cb: (this: Context, value?: T, key?: KEY) => void, context?: Context): void;
      keys(): KEY[];
      removeKey(key: KEY): void;
  }
  function createHashMap<T, KEY extends string | number = string | number>(obj?: HashMap<T, KEY> | {
      [key in KEY]?: T;
  } | KEY[]): HashMap<T, KEY>;
  function concatArray<T, R>(a: ArrayLike$1<T>, b: ArrayLike$1<R>): ArrayLike$1<T | R>;
  function createObject<T>(proto?: object, properties?: T): T;
  function disableUserSelect(dom: HTMLElement): void;
  function hasOwn(own: object, prop: string): boolean;
  function noop(): void;
  const RADIAN_TO_DEGREE: number;
  const EPSILON: number;
  
  const util_d_curry: typeof curry;
  const util_d_guid: typeof guid;
  const util_d_logError: typeof logError;
  const util_d_clone: typeof clone;
  const util_d_merge: typeof merge;
  const util_d_mergeAll: typeof mergeAll;
  const util_d_extend: typeof extend;
  const util_d_defaults: typeof defaults;
  const util_d_createCanvas: typeof createCanvas;
  const util_d_indexOf: typeof indexOf;
  const util_d_inherits: typeof inherits;
  const util_d_mixin: typeof mixin;
  const util_d_isArrayLike: typeof isArrayLike;
  const util_d_each: typeof each;
  const util_d_map: typeof map;
  const util_d_reduce: typeof reduce;
  const util_d_filter: typeof filter;
  const util_d_find: typeof find;
  const util_d_keys: typeof keys;
  type util_d_Bind1<F, Ctx> = Bind1<F, Ctx>;
  type util_d_Bind2<F, Ctx, T1> = Bind2<F, Ctx, T1>;
  type util_d_Bind3<F, Ctx, T1, T2> = Bind3<F, Ctx, T1, T2>;
  type util_d_Bind4<F, Ctx, T1, T2, T3> = Bind4<F, Ctx, T1, T2, T3>;
  type util_d_Bind5<F, Ctx, T1, T2, T3, T4> = Bind5<F, Ctx, T1, T2, T3, T4>;
  const util_d_bind: typeof bind;
  type util_d_Curry1<F, T1> = Curry1<F, T1>;
  type util_d_Curry2<F, T1, T2> = Curry2<F, T1, T2>;
  type util_d_Curry3<F, T1, T2, T3> = Curry3<F, T1, T2, T3>;
  type util_d_Curry4<F, T1, T2, T3, T4> = Curry4<F, T1, T2, T3, T4>;
  const util_d_isArray: typeof isArray;
  const util_d_isFunction: typeof isFunction;
  const util_d_isString: typeof isString;
  const util_d_isStringSafe: typeof isStringSafe;
  const util_d_isNumber: typeof isNumber;
  const util_d_isObject: typeof isObject;
  const util_d_isBuiltInObject: typeof isBuiltInObject;
  const util_d_isTypedArray: typeof isTypedArray;
  const util_d_isDom: typeof isDom;
  const util_d_isGradientObject: typeof isGradientObject;
  const util_d_isImagePatternObject: typeof isImagePatternObject;
  const util_d_isRegExp: typeof isRegExp;
  const util_d_eqNaN: typeof eqNaN;
  const util_d_retrieve: typeof retrieve;
  const util_d_retrieve2: typeof retrieve2;
  const util_d_retrieve3: typeof retrieve3;
  const util_d_slice: typeof slice;
  const util_d_normalizeCssArray: typeof normalizeCssArray;
  const util_d_assert: typeof assert;
  const util_d_trim: typeof trim;
  const util_d_setAsPrimitive: typeof setAsPrimitive;
  const util_d_isPrimitive: typeof isPrimitive;
  type util_d_HashMap<T, KEY extends string | number = string | number> = HashMap<T, KEY>;
  const util_d_HashMap: typeof HashMap;
  const util_d_createHashMap: typeof createHashMap;
  const util_d_concatArray: typeof concatArray;
  const util_d_createObject: typeof createObject;
  const util_d_disableUserSelect: typeof disableUserSelect;
  const util_d_hasOwn: typeof hasOwn;
  const util_d_noop: typeof noop;
  const util_d_RADIAN_TO_DEGREE: typeof RADIAN_TO_DEGREE;
  const util_d_EPSILON: typeof EPSILON;
  namespace util_d {
    export {
      util_d_curry as curry,
      util_d_guid as guid,
      util_d_logError as logError,
      util_d_clone as clone,
      util_d_merge as merge,
      util_d_mergeAll as mergeAll,
      util_d_extend as extend,
      util_d_defaults as defaults,
      util_d_createCanvas as createCanvas,
      util_d_indexOf as indexOf,
      util_d_inherits as inherits,
      util_d_mixin as mixin,
      util_d_isArrayLike as isArrayLike,
      util_d_each as each,
      util_d_map as map,
      util_d_reduce as reduce,
      util_d_filter as filter,
      util_d_find as find,
      util_d_keys as keys,
      util_d_Bind1 as Bind1,
      util_d_Bind2 as Bind2,
      util_d_Bind3 as Bind3,
      util_d_Bind4 as Bind4,
      util_d_Bind5 as Bind5,
      util_d_bind as bind,
      util_d_Curry1 as Curry1,
      util_d_Curry2 as Curry2,
      util_d_Curry3 as Curry3,
      util_d_Curry4 as Curry4,
      util_d_isArray as isArray,
      util_d_isFunction as isFunction,
      util_d_isString as isString,
      util_d_isStringSafe as isStringSafe,
      util_d_isNumber as isNumber,
      util_d_isObject as isObject,
      util_d_isBuiltInObject as isBuiltInObject,
      util_d_isTypedArray as isTypedArray,
      util_d_isDom as isDom,
      util_d_isGradientObject as isGradientObject,
      util_d_isImagePatternObject as isImagePatternObject,
      util_d_isRegExp as isRegExp,
      util_d_eqNaN as eqNaN,
      util_d_retrieve as retrieve,
      util_d_retrieve2 as retrieve2,
      util_d_retrieve3 as retrieve3,
      util_d_slice as slice,
      util_d_normalizeCssArray as normalizeCssArray,
      util_d_assert as assert,
      util_d_trim as trim,
      util_d_setAsPrimitive as setAsPrimitive,
      util_d_isPrimitive as isPrimitive,
      util_d_HashMap as HashMap,
      util_d_createHashMap as createHashMap,
      util_d_concatArray as concatArray,
      util_d_createObject as createObject,
      util_d_disableUserSelect as disableUserSelect,
      util_d_hasOwn as hasOwn,
      util_d_noop as noop,
      util_d_RADIAN_TO_DEGREE as RADIAN_TO_DEGREE,
      util_d_EPSILON as EPSILON,
    };
  }
  
  type EventCallbackSingleParam<EvtParam = any> = EvtParam extends any ? (params: EvtParam) => boolean | void : never;
  type EventCallback<EvtParams = any[]> = EvtParams extends any[] ? (...args: EvtParams) => boolean | void : never;
  type EventQuery = string | Object;
  type CbThis<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
  type DefaultEventDefinition = Dictionary<EventCallback<any[]>>;
  interface EventProcessor<EvtDef = DefaultEventDefinition> {
      normalizeQuery?: (query: EventQuery) => EventQuery;
      filter?: (eventType: keyof EvtDef, query: EventQuery) => boolean;
      afterTrigger?: (eventType: keyof EvtDef) => void;
  }
  class Eventful<EvtDef extends DefaultEventDefinition = DefaultEventDefinition> {
      private _$handlers;
      protected _$eventProcessor: EventProcessor<EvtDef>;
      constructor(eventProcessors?: EventProcessor<EvtDef>);
      on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, handler: WithThisType<EvtDef[EvtNm], CbThis<Ctx, this>>, context?: Ctx): this;
      on<Ctx, EvtNm extends keyof EvtDef>(event: EvtNm, query: EventQuery, handler: WithThisType<EvtDef[EvtNm], CbThis<Ctx, this>>, context?: Ctx): this;
      isSilent(eventName: keyof EvtDef): boolean;
      off(eventType?: keyof EvtDef, handler?: Function): this;
      trigger<EvtNm extends keyof EvtDef>(eventType: EvtNm, ...args: Parameters<EvtDef[EvtNm]>): this;
      triggerWithContext(type: keyof EvtDef, ...args: any[]): this;
  }
  
  type VectorArray = number[];
  function create(x?: number, y?: number): VectorArray;
  function copy<T extends VectorArray>(out: T, v: VectorArray): T;
  function clone$1(v: VectorArray): VectorArray;
  function set<T extends VectorArray>(out: T, a: number, b: number): T;
  function add<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  function scaleAndAdd<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray, a: number): T;
  function sub<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  function len(v: VectorArray): number;
  const length: typeof len;
  function lenSquare(v: VectorArray): number;
  const lengthSquare: typeof lenSquare;
  function mul<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  function div<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  function dot(v1: VectorArray, v2: VectorArray): number;
  function scale<T extends VectorArray>(out: T, v: VectorArray, s: number): T;
  function normalize<T extends VectorArray>(out: T, v: VectorArray): T;
  function distance(v1: VectorArray, v2: VectorArray): number;
  const dist: typeof distance;
  function distanceSquare(v1: VectorArray, v2: VectorArray): number;
  const distSquare: typeof distanceSquare;
  function negate<T extends VectorArray>(out: T, v: VectorArray): T;
  function lerp<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray, t: number): T;
  function applyTransform<T extends VectorArray>(out: T, v: VectorArray, m: MatrixArray): T;
  function min<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  function max<T extends VectorArray>(out: T, v1: VectorArray, v2: VectorArray): T;
  
  type vector_d_VectorArray = VectorArray;
  const vector_d_create: typeof create;
  const vector_d_copy: typeof copy;
  const vector_d_set: typeof set;
  const vector_d_add: typeof add;
  const vector_d_scaleAndAdd: typeof scaleAndAdd;
  const vector_d_sub: typeof sub;
  const vector_d_len: typeof len;
  const vector_d_length: typeof length;
  const vector_d_lenSquare: typeof lenSquare;
  const vector_d_lengthSquare: typeof lengthSquare;
  const vector_d_mul: typeof mul;
  const vector_d_div: typeof div;
  const vector_d_dot: typeof dot;
  const vector_d_scale: typeof scale;
  const vector_d_normalize: typeof normalize;
  const vector_d_distance: typeof distance;
  const vector_d_dist: typeof dist;
  const vector_d_distanceSquare: typeof distanceSquare;
  const vector_d_distSquare: typeof distSquare;
  const vector_d_negate: typeof negate;
  const vector_d_lerp: typeof lerp;
  const vector_d_applyTransform: typeof applyTransform;
  const vector_d_min: typeof min;
  const vector_d_max: typeof max;
  namespace vector_d {
    export {
      vector_d_VectorArray as VectorArray,
      vector_d_create as create,
      vector_d_copy as copy,
      clone$1 as clone,
      vector_d_set as set,
      vector_d_add as add,
      vector_d_scaleAndAdd as scaleAndAdd,
      vector_d_sub as sub,
      vector_d_len as len,
      vector_d_length as length,
      vector_d_lenSquare as lenSquare,
      vector_d_lengthSquare as lengthSquare,
      vector_d_mul as mul,
      vector_d_div as div,
      vector_d_dot as dot,
      vector_d_scale as scale,
      vector_d_normalize as normalize,
      vector_d_distance as distance,
      vector_d_dist as dist,
      vector_d_distanceSquare as distanceSquare,
      vector_d_distSquare as distSquare,
      vector_d_negate as negate,
      vector_d_lerp as lerp,
      vector_d_applyTransform as applyTransform,
      vector_d_min as min,
      vector_d_max as max,
    };
  }
  
  type MatrixArray = number[];
  function create$1(): MatrixArray;
  function identity(out: MatrixArray): MatrixArray;
  function copy$1(out: MatrixArray, m: MatrixArray): MatrixArray;
  function mul$1(out: MatrixArray, m1: MatrixArray, m2: MatrixArray): MatrixArray;
  function translate(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray;
  function rotate(out: MatrixArray, a: MatrixArray, rad: number, pivot?: VectorArray): MatrixArray;
  function scale$1(out: MatrixArray, a: MatrixArray, v: VectorArray): MatrixArray;
  function invert(out: MatrixArray, a: MatrixArray): MatrixArray | null;
  function clone$2(a: MatrixArray): MatrixArray;
  
  type matrix_d_MatrixArray = MatrixArray;
  const matrix_d_identity: typeof identity;
  const matrix_d_translate: typeof translate;
  const matrix_d_rotate: typeof rotate;
  const matrix_d_invert: typeof invert;
  namespace matrix_d {
    export {
      matrix_d_MatrixArray as MatrixArray,
      create$1 as create,
      matrix_d_identity as identity,
      copy$1 as copy,
      mul$1 as mul,
      matrix_d_translate as translate,
      matrix_d_rotate as rotate,
      scale$1 as scale,
      matrix_d_invert as invert,
      clone$2 as clone,
    };
  }
  
  interface PointLike {
      x: number;
      y: number;
  }
  class Point {
      x: number;
      y: number;
      constructor(x?: number, y?: number);
      copy(other: PointLike): this;
      clone(): Point;
      set(x: number, y: number): this;
      equal(other: PointLike): boolean;
      add(other: PointLike): this;
      scale(scalar: number): void;
      scaleAndAdd(other: PointLike, scalar: number): void;
      sub(other: PointLike): this;
      dot(other: PointLike): number;
      len(): number;
      lenSquare(): number;
      normalize(): this;
      distance(other: PointLike): number;
      distanceSquare(other: Point): number;
      negate(): this;
      transform(m: MatrixArray): this;
      toArray(out: number[]): number[];
      fromArray(input: number[]): void;
      static set(p: PointLike, x: number, y: number): void;
      static copy(p: PointLike, p2: PointLike): void;
      static len(p: PointLike): number;
      static lenSquare(p: PointLike): number;
      static dot(p0: PointLike, p1: PointLike): number;
      static add(out: PointLike, p0: PointLike, p1: PointLike): void;
      static sub(out: PointLike, p0: PointLike, p1: PointLike): void;
      static scale(out: PointLike, p0: PointLike, scalar: number): void;
      static scaleAndAdd(out: PointLike, p0: PointLike, p1: PointLike, scalar: number): void;
      static lerp(out: PointLike, p0: PointLike, p1: PointLike, t: number): void;
  }
  
  class BoundingRect {
      x: number;
      y: number;
      width: number;
      height: number;
      constructor(x: number, y: number, width: number, height: number);
      static set<TTarget extends RectLike>(target: TTarget, x: number, y: number, width: number, height: number): TTarget;
      union(other: BoundingRect): void;
      applyTransform(m: MatrixArray): void;
      calculateTransform(b: RectLike): MatrixArray;
      intersect(b: RectLike, mtv?: PointLike, opt?: BoundingRectIntersectOpt): boolean;
      static intersect(a: RectLike, b: RectLike, mtv?: PointLike, opt?: BoundingRectIntersectOpt): boolean;
      static contain(rect: RectLike, x: number, y: number): boolean;
      contain(x: number, y: number): boolean;
      clone(): BoundingRect;
      copy(other: RectLike): void;
      plain(): RectLike;
      isFinite(): boolean;
      isZero(): boolean;
      static create(rect: RectLike): BoundingRect;
      static copy<TTarget extends RectLike>(target: TTarget, source: RectLike): TTarget;
      static applyTransform(target: RectLike, source: RectLike, m: MatrixArray): void;
  }
  type RectLike = {
      x: number;
      y: number;
      width: number;
      height: number;
  };
  interface BoundingRectIntersectOpt {
      direction?: number;
      bidirectional?: boolean;
      touchThreshold?: number;
      outIntersectRect?: RectLike;
      clamp?: boolean;
  }
  
  interface ExtendedCanvasRenderingContext2D extends CanvasRenderingContext2D {
      dpr?: number;
  }
  class PathProxy {
      dpr: number;
      data: number[] | Float32Array;
      private _version;
      private _saveData;
      private _pendingPtX;
      private _pendingPtY;
      private _pendingPtDist;
      private _ctx;
      private _xi;
      private _yi;
      private _x0;
      private _y0;
      private _len;
      private _pathSegLen;
      private _pathLen;
      private _ux;
      private _uy;
      static CMD: {
          M: number;
          L: number;
          C: number;
          Q: number;
          A: number;
          Z: number;
          R: number;
      };
      constructor(notSaveData?: boolean);
      increaseVersion(): void;
      getVersion(): number;
      setScale(sx: number, sy: number, segmentIgnoreThreshold?: number): void;
      setDPR(dpr: number): void;
      setContext(ctx: ExtendedCanvasRenderingContext2D): void;
      getContext(): ExtendedCanvasRenderingContext2D;
      beginPath(): this;
      reset(): void;
      moveTo(x: number, y: number): this;
      lineTo(x: number, y: number): this;
      bezierCurveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): this;
      quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): this;
      arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise?: boolean): this;
      arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;
      rect(x: number, y: number, w: number, h: number): this;
      closePath(): this;
      fill(ctx: CanvasRenderingContext2D): void;
      stroke(ctx: CanvasRenderingContext2D): void;
      len(): number;
      setData(data: Float32Array | number[]): void;
      appendPath(path: PathProxy | PathProxy[]): void;
      addData(cmd: number, a?: number, b?: number, c?: number, d?: number, e?: number, f?: number, g?: number, h?: number): void;
      private _drawPendingPt;
      private _expandData;
      toStatic(): void;
      getBoundingRect(): BoundingRect;
      private _calculateLength;
      rebuildPath(ctx: PathRebuilder, percent: number): void;
      clone(): PathProxy;
      canSave(): boolean;
      private static initDefaultProps;
  }
  interface PathRebuilder {
      moveTo(x: number, y: number): void;
      lineTo(x: number, y: number): void;
      bezierCurveTo(x: number, y: number, x2: number, y2: number, x3: number, y3: number): void;
      quadraticCurveTo(x: number, y: number, x2: number, y2: number): void;
      arc(cx: number, cy: number, r: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
      ellipse(cx: number, cy: number, radiusX: number, radiusY: number, rotation: number, startAngle: number, endAngle: number, anticlockwise: boolean): void;
      rect(x: number, y: number, width: number, height: number): void;
      closePath(): void;
  }
  
  type easingFunc = (percent: number) => number;
  type AnimationEasing = keyof typeof easingFuncs | easingFunc;
  const easingFuncs: {
      linear(k: number): number;
      quadraticIn(k: number): number;
      quadraticOut(k: number): number;
      quadraticInOut(k: number): number;
      cubicIn(k: number): number;
      cubicOut(k: number): number;
      cubicInOut(k: number): number;
      quarticIn(k: number): number;
      quarticOut(k: number): number;
      quarticInOut(k: number): number;
      quinticIn(k: number): number;
      quinticOut(k: number): number;
      quinticInOut(k: number): number;
      sinusoidalIn(k: number): number;
      sinusoidalOut(k: number): number;
      sinusoidalInOut(k: number): number;
      exponentialIn(k: number): number;
      exponentialOut(k: number): number;
      exponentialInOut(k: number): number;
      circularIn(k: number): number;
      circularOut(k: number): number;
      circularInOut(k: number): number;
      elasticIn(k: number): number;
      elasticOut(k: number): number;
      elasticInOut(k: number): number;
      backIn(k: number): number;
      backOut(k: number): number;
      backInOut(k: number): number;
      bounceIn(k: number): number;
      bounceOut(k: number): number;
      bounceInOut(k: number): number;
  };
  
  interface Stage {
      update?: () => void;
  }
  interface AnimationOption {
      stage?: Stage;
  }
  class Animation extends Eventful {
      stage: Stage;
      private _head;
      private _tail;
      private _running;
      private _time;
      private _pausedTime;
      private _pauseStart;
      private _paused;
      constructor(opts?: AnimationOption);
      addClip(clip: Clip): void;
      addAnimator(animator: Animator<any>): void;
      removeClip(clip: Clip): void;
      removeAnimator(animator: Animator<any>): void;
      update(notTriggerFrameAndStageUpdate?: boolean): void;
      _startLoop(): void;
      start(): void;
      stop(): void;
      pause(): void;
      resume(): void;
      clear(): void;
      isFinished(): boolean;
      animate<T>(target: T, options: {
          loop?: boolean;
      }): Animator<T>;
  }
  
  type OnframeCallback = (percent: number) => void;
  type ondestroyCallback = () => void;
  type onrestartCallback = () => void;
  interface ClipProps {
      life?: number;
      delay?: number;
      loop?: boolean;
      easing?: AnimationEasing;
      onframe?: OnframeCallback;
      ondestroy?: ondestroyCallback;
      onrestart?: onrestartCallback;
  }
  class Clip {
      private _life;
      private _delay;
      private _inited;
      private _startTime;
      private _pausedTime;
      private _paused;
      animation: Animation;
      loop: boolean;
      easing: AnimationEasing;
      easingFunc: (p: number) => number;
      next: Clip;
      prev: Clip;
      onframe: OnframeCallback;
      ondestroy: ondestroyCallback;
      onrestart: onrestartCallback;
      constructor(opts: ClipProps);
      step(globalTime: number, deltaTime: number): boolean;
      pause(): void;
      resume(): void;
      setEasing(easing: AnimationEasing): void;
  }
  
  type ValueType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
  type Keyframe = {
      time: number;
      value: unknown;
      percent: number;
      rawValue: unknown;
      easing?: AnimationEasing;
      easingFunc?: (percent: number) => number;
      additiveValue?: unknown;
  };
  class Track {
      keyframes: Keyframe[];
      propName: string;
      valType: ValueType;
      discrete: boolean;
      _invalid: boolean;
      private _finished;
      private _needsSort;
      private _additiveTrack;
      private _additiveValue;
      private _lastFr;
      private _lastFrP;
      constructor(propName: string);
      isFinished(): boolean;
      setFinished(): void;
      needsAnimate(): boolean;
      getAdditiveTrack(): Track;
      addKeyframe(time: number, rawValue: unknown, easing?: AnimationEasing): Keyframe;
      prepare(maxTime: number, additiveTrack?: Track): void;
      step(target: any, percent: number): void;
      private _addToTarget;
  }
  type DoneCallback = () => void;
  type AbortCallback = () => void;
  type OnframeCallback$1<T> = (target: T, percent: number) => void;
  class Animator<T> {
      animation?: Animation;
      targetName?: string;
      scope?: string;
      __fromStateTransition?: string;
      private _tracks;
      private _trackKeys;
      private _target;
      private _loop;
      private _delay;
      private _maxTime;
      private _force;
      private _paused;
      private _started;
      private _allowDiscrete;
      private _additiveAnimators;
      private _doneCbs;
      private _onframeCbs;
      private _abortedCbs;
      private _clip;
      constructor(target: T, loop: boolean, allowDiscreteAnimation?: boolean, additiveTo?: Animator<any>[]);
      getMaxTime(): number;
      getDelay(): number;
      getLoop(): boolean;
      getTarget(): T;
      changeTarget(target: T): void;
      when(time: number, props: Dictionary<any>, easing?: AnimationEasing): this;
      whenWithKeys(time: number, props: Dictionary<any>, propNames: string[], easing?: AnimationEasing): this;
      pause(): void;
      resume(): void;
      isPaused(): boolean;
      duration(duration: number): this;
      private _doneCallback;
      private _abortedCallback;
      private _setTracksFinished;
      private _getAdditiveTrack;
      start(easing?: AnimationEasing): this;
      stop(forwardToLast?: boolean): void;
      delay(time: number): this;
      during(cb: OnframeCallback$1<T>): this;
      done(cb: DoneCallback): this;
      aborted(cb: AbortCallback): this;
      getClip(): Clip;
      getTrack(propName: string): Track;
      getTracks(): Track[];
      stopTracks(propNames: string[], forwardToLast?: boolean): boolean;
      saveTo(target: T, trackKeys?: readonly string[], firstOrLast?: boolean): void;
      __changeFinalValue(finalProps: Dictionary<any>, trackKeys?: readonly string[]): void;
  }
  
  interface PathStyleProps extends CommonStyleProps {
      fill?: string | PatternObject | LinearGradientObject | RadialGradientObject;
      stroke?: string | PatternObject | LinearGradientObject | RadialGradientObject;
      decal?: PatternObject;
      strokePercent?: number;
      strokeNoScale?: boolean;
      fillOpacity?: number;
      strokeOpacity?: number;
      lineDash?: false | number[] | 'solid' | 'dashed' | 'dotted';
      lineDashOffset?: number;
      lineWidth?: number;
      lineCap?: CanvasLineCap;
      lineJoin?: CanvasLineJoin;
      miterLimit?: number;
      strokeFirst?: boolean;
  }
  interface PathProps extends DisplayableProps {
      strokeContainThreshold?: number;
      segmentIgnoreThreshold?: number;
      subPixelOptimize?: boolean;
      style?: PathStyleProps;
      shape?: Dictionary<any>;
      autoBatch?: boolean;
      __value?: (string | number)[] | (string | number);
      buildPath?: (ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBatch?: boolean) => void;
  }
  type PathKey = keyof PathProps;
  type PathPropertyType = PropType<PathProps, PathKey>;
  type PathStatePropNames = DisplayableStatePropNames | 'shape';
  type PathState = Pick<PathProps, PathStatePropNames> & {
      hoverLayer?: boolean;
  };
  interface Path<Props extends PathProps = PathProps> {
      animate(key?: '', loop?: boolean): Animator<this>;
      animate(key: 'style', loop?: boolean): Animator<this['style']>;
      animate(key: 'shape', loop?: boolean): Animator<this['shape']>;
      getState(stateName: string): PathState;
      ensureState(stateName: string): PathState;
      states: Dictionary<PathState>;
      stateProxy: (stateName: string) => PathState;
  }
  class Path<Props extends PathProps = PathProps> extends Displayable<Props> {
      path: PathProxy;
      strokeContainThreshold: number;
      segmentIgnoreThreshold: number;
      subPixelOptimize: boolean;
      style: PathStyleProps;
      autoBatch: boolean;
      private _rectStroke;
      protected _normalState: PathState;
      protected _decalEl: Path;
      shape: Dictionary<any>;
      constructor(opts?: Props);
      update(): void;
      getDecalElement(): Path<PathProps>;
      protected _init(props?: Props): void;
      protected getDefaultStyle(): Props['style'];
      protected getDefaultShape(): {};
      protected canBeInsideText(): boolean;
      protected getInsideTextFill(): "#333" | "#ccc" | "#eee";
      protected getInsideTextStroke(textFill?: string): string;
      buildPath(ctx: PathProxy | CanvasRenderingContext2D, shapeCfg: Dictionary<any>, inBatch?: boolean): void;
      pathUpdated(): void;
      getUpdatedPathProxy(inBatch?: boolean): PathProxy;
      createPathProxy(): void;
      hasStroke(): boolean;
      hasFill(): boolean;
      getBoundingRect(): BoundingRect;
      contain(x: number, y: number): boolean;
      dirtyShape(): void;
      dirty(): void;
      animateShape(loop: boolean): Animator<this["shape"]>;
      updateDuringAnimation(targetKey: string): void;
      attrKV(key: PathKey, value: PathPropertyType): void;
      setShape(obj: Props['shape']): this;
      setShape<T extends keyof Props['shape']>(obj: T, value: Props['shape'][T]): this;
      shapeChanged(): boolean;
      createStyle(obj?: Props['style']): Props["style"];
      protected _innerSaveToNormal(toState: PathState): void;
      protected _applyStateObj(stateName: string, state: PathState, normalState: PathState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
      protected _mergeStates(states: PathState[]): PathState;
      getAnimationStyleProps(): MapToType<PathProps, boolean>;
      isZeroArea(): boolean;
      static extend<Shape extends Dictionary<any>>(defaultProps: {
          type?: string;
          shape?: Shape;
          style?: PathStyleProps;
          beforeBrush?: Displayable['beforeBrush'];
          afterBrush?: Displayable['afterBrush'];
          getBoundingRect?: Displayable['getBoundingRect'];
          calculateTextPosition?: Element['calculateTextPosition'];
          buildPath(this: Path, ctx: CanvasRenderingContext2D | PathProxy, shape: Shape, inBatch?: boolean): void;
          init?(this: Path, opts: PathProps): void;
      }): {
          new (opts?: PathProps & {
              shape: Shape;
          }): Path;
      };
      protected static initDefaultProps: void;
  }
  
  class Transformable {
      parent: Transformable;
      x: number;
      y: number;
      scaleX: number;
      scaleY: number;
      skewX: number;
      skewY: number;
      rotation: number;
      anchorX: number;
      anchorY: number;
      originX: number;
      originY: number;
      globalScaleRatio: number;
      transform: MatrixArray;
      invTransform: MatrixArray;
      getLocalTransform(m?: MatrixArray): MatrixArray;
      setPosition(arr: number[]): void;
      setScale(arr: number[]): void;
      setSkew(arr: number[]): void;
      setOrigin(arr: number[]): void;
      needLocalTransform(): boolean;
      updateTransform(): void;
      private _resolveGlobalScaleRatio;
      getComputedTransform(): MatrixArray;
      setLocalTransform(m: VectorArray): void;
      decomposeTransform(): void;
      getGlobalScale(out?: VectorArray): VectorArray;
      transformCoordToLocal(x: number, y: number): number[];
      transformCoordToGlobal(x: number, y: number): number[];
      getLineScale(): number;
      copyTransform(source: Transformable): void;
      static getLocalTransform(target: Transformable, m?: MatrixArray): MatrixArray;
      private static initDefaultProps;
  }
  const TRANSFORMABLE_PROPS: readonly ["x", "y", "originX", "originY", "anchorX", "anchorY", "rotation", "scaleX", "scaleY", "skewX", "skewY"];
  type TransformProp = (typeof TRANSFORMABLE_PROPS)[number];
  
  interface TSpanStyleProps extends PathStyleProps {
      x?: number;
      y?: number;
      text?: string;
      font?: string;
      fontSize?: number;
      fontWeight?: FontWeight;
      fontStyle?: FontStyle;
      fontFamily?: string;
      textAlign?: CanvasTextAlign;
      textBaseline?: CanvasTextBaseline;
  }
  interface TSpanProps extends DisplayableProps {
      style?: TSpanStyleProps;
  }
  class TSpan extends Displayable<TSpanProps> {
      style: TSpanStyleProps;
      hasStroke(): boolean;
      hasFill(): boolean;
      createStyle(obj?: TSpanStyleProps): TSpanStyleProps;
      setBoundingRect(rect: BoundingRect): void;
      getBoundingRect(): BoundingRect;
      protected static initDefaultProps: void;
  }
  
  interface ImageStyleProps extends CommonStyleProps {
      image?: string | ImageLike;
      x?: number;
      y?: number;
      width?: number;
      height?: number;
      sx?: number;
      sy?: number;
      sWidth?: number;
      sHeight?: number;
  }
  interface ImageProps extends DisplayableProps {
      style?: ImageStyleProps;
      onload?: (image: ImageLike) => void;
  }
  class ZRImage extends Displayable<ImageProps> {
      style: ImageStyleProps;
      __image: ImageLike;
      __imageSrc: string;
      onload: (image: ImageLike) => void;
      createStyle(obj?: ImageStyleProps): ImageStyleProps;
      private _getSize;
      getWidth(): number;
      getHeight(): number;
      getAnimationStyleProps(): MapToType<ImageProps, boolean>;
      getBoundingRect(): BoundingRect;
  }
  
  class RectShape {
      r?: number | number[];
      x: number;
      y: number;
      width: number;
      height: number;
  }
  interface RectProps extends PathProps {
      shape?: Partial<RectShape>;
  }
  class Rect extends Path<RectProps> {
      shape: RectShape;
      constructor(opts?: RectProps);
      getDefaultShape(): RectShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: RectShape): void;
      isZeroArea(): boolean;
  }
  
  interface GroupProps extends ElementProps {
  }
  class Group extends Element<GroupProps> {
      readonly isGroup = true;
      private _children;
      constructor(opts?: GroupProps);
      childrenRef(): Element<ElementProps>[];
      children(): Element<ElementProps>[];
      childAt(idx: number): Element;
      childOfName(name: string): Element;
      childCount(): number;
      add(child: Element): Group;
      addBefore(child: Element, nextSibling: Element): this;
      replace(oldChild: Element, newChild: Element): this;
      replaceAt(child: Element, index: number): this;
      _doAdd(child: Element): void;
      remove(child: Element): this;
      removeAll(): this;
      eachChild<Context>(cb: (this: Context, el: Element, index?: number) => void, context?: Context): this;
      traverse<T>(cb: (this: T, el: Element) => boolean | void, context?: T): this;
      addSelfToZr(zr: ZRenderType): void;
      removeSelfFromZr(zr: ZRenderType): void;
      getBoundingRect(includeChildren?: Element[]): BoundingRect;
  }
  interface GroupLike extends Element {
      childrenRef(): Element[];
  }
  
  interface TextStylePropsPart {
      text?: string;
      fill?: string;
      stroke?: string;
      strokeNoScale?: boolean;
      opacity?: number;
      fillOpacity?: number;
      strokeOpacity?: number;
      lineWidth?: number;
      lineDash?: false | number[];
      lineDashOffset?: number;
      borderDash?: false | number[];
      borderDashOffset?: number;
      font?: string;
      textFont?: string;
      fontStyle?: FontStyle;
      fontWeight?: FontWeight;
      fontFamily?: string;
      fontSize?: number | string;
      align?: TextAlign;
      verticalAlign?: TextVerticalAlign;
      lineHeight?: number;
      width?: number | string;
      height?: number;
      tag?: string;
      textShadowColor?: string;
      textShadowBlur?: number;
      textShadowOffsetX?: number;
      textShadowOffsetY?: number;
      backgroundColor?: string | {
          image: ImageLike | string;
      };
      padding?: number | number[];
      margin?: number | number[];
      borderColor?: string;
      borderWidth?: number;
      borderRadius?: number | number[];
      shadowColor?: string;
      shadowBlur?: number;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
  }
  interface TextStyleProps extends TextStylePropsPart {
      text?: string;
      x?: number;
      y?: number;
      width?: number;
      rich?: Dictionary<TextStylePropsPart>;
      overflow?: 'break' | 'breakAll' | 'truncate' | 'none';
      lineOverflow?: 'truncate';
      ellipsis?: string;
      placeholder?: string;
      truncateMinChar?: number;
  }
  interface TextProps extends DisplayableProps {
      style?: TextStyleProps;
      zlevel?: number;
      z?: number;
      z2?: number;
      culling?: boolean;
      cursor?: string;
  }
  type TextState = Pick<TextProps, DisplayableStatePropNames> & ElementCommonState;
  type DefaultTextStyle = Pick<TextStyleProps, 'fill' | 'stroke' | 'align' | 'verticalAlign'> & {
      autoStroke?: boolean;
      overflowRect?: BoundingRect | NullUndefined;
  };
  interface ZRText {
      animate(key?: '', loop?: boolean): Animator<this>;
      animate(key: 'style', loop?: boolean): Animator<this['style']>;
      getState(stateName: string): TextState;
      ensureState(stateName: string): TextState;
      states: Dictionary<TextState>;
      stateProxy: (stateName: string) => TextState;
  }
  class ZRText extends Displayable<TextProps> implements GroupLike {
      type: string;
      style: TextStyleProps;
      overlap: 'hidden' | 'show' | 'blur';
      innerTransformable: Transformable;
      isTruncated: boolean;
      private _children;
      private _childCursor;
      private _defaultStyle;
      constructor(opts?: TextProps);
      childrenRef(): (ZRImage | Rect | TSpan)[];
      update(): void;
      updateTransform(): void;
      getLocalTransform(m?: MatrixArray): MatrixArray;
      getComputedTransform(): MatrixArray;
      private _updateSubTexts;
      addSelfToZr(zr: ZRenderType): void;
      removeSelfFromZr(zr: ZRenderType): void;
      getBoundingRect(): BoundingRect;
      setDefaultTextStyle(defaultTextStyle: DefaultTextStyle): void;
      setTextContent(textContent: never): void;
      protected _mergeStyle(targetStyle: TextStyleProps, sourceStyle: TextStyleProps): TextStyleProps;
      private _mergeRich;
      getAnimationStyleProps(): MapToType<TextProps, boolean>;
      private _getOrCreateChild;
      private _updatePlainTexts;
      private _updateRichTexts;
      private _placeToken;
      private _renderBackground;
      static makeFont(style: TextStylePropsPart): string;
  }
  
  interface TextPositionCalculationResult {
      x: number;
      y: number;
      align: TextAlign;
      verticalAlign: TextVerticalAlign;
  }
  
  class PolylineShape {
      points: VectorArray[];
      percent?: number;
      smooth?: number;
      smoothConstraint?: VectorArray[];
  }
  interface PolylineProps extends PathProps {
      shape?: Partial<PolylineShape>;
  }
  class Polyline extends Path<PolylineProps> {
      shape: PolylineShape;
      constructor(opts?: PolylineProps);
      getDefaultStyle(): {
          stroke: string;
          fill: string;
      };
      getDefaultShape(): PolylineShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: PolylineShape): void;
  }
  
  interface ElementAnimateConfig {
      duration?: number;
      delay?: number;
      easing?: AnimationEasing;
      during?: (percent: number) => void;
      done?: Function;
      aborted?: Function;
      scope?: string;
      force?: boolean;
      additive?: boolean;
      setToFinal?: boolean;
  }
  interface ElementTextConfig {
      position?: BuiltinTextPosition | (number | string)[];
      rotation?: number;
      layoutRect?: RectLike;
      offset?: number[];
      origin?: (number | string)[] | 'center';
      distance?: number;
      local?: boolean;
      insideFill?: string;
      insideStroke?: string;
      outsideFill?: string;
      outsideStroke?: string;
      inside?: boolean;
      autoOverflowArea?: boolean;
  }
  interface ElementTextGuideLineConfig {
      anchor?: Point;
      showAbove?: boolean;
      candidates?: ('left' | 'top' | 'right' | 'bottom')[];
  }
  interface ElementEvent {
      type: ElementEventName;
      event: ZRRawEvent;
      target: Element;
      topTarget: Element;
      cancelBubble: boolean;
      offsetX: number;
      offsetY: number;
      gestureEvent: string;
      pinchX: number;
      pinchY: number;
      pinchScale: number;
      wheelDelta: number;
      zrByTouch: boolean;
      which: number;
      stop: (this: ElementEvent) => void;
  }
  type ElementEventCallback<Ctx, Impl> = (this: CbThis$1<Ctx, Impl>, e: ElementEvent) => boolean | void;
  type CbThis$1<Ctx, Impl> = unknown extends Ctx ? Impl : Ctx;
  interface ElementEventHandlerProps {
      onclick: ElementEventCallback<unknown, unknown>;
      ondblclick: ElementEventCallback<unknown, unknown>;
      onmouseover: ElementEventCallback<unknown, unknown>;
      onmouseout: ElementEventCallback<unknown, unknown>;
      onmousemove: ElementEventCallback<unknown, unknown>;
      onmousewheel: ElementEventCallback<unknown, unknown>;
      onmousedown: ElementEventCallback<unknown, unknown>;
      onmouseup: ElementEventCallback<unknown, unknown>;
      oncontextmenu: ElementEventCallback<unknown, unknown>;
      ondrag: ElementEventCallback<unknown, unknown>;
      ondragstart: ElementEventCallback<unknown, unknown>;
      ondragend: ElementEventCallback<unknown, unknown>;
      ondragenter: ElementEventCallback<unknown, unknown>;
      ondragleave: ElementEventCallback<unknown, unknown>;
      ondragover: ElementEventCallback<unknown, unknown>;
      ondrop: ElementEventCallback<unknown, unknown>;
  }
  interface ElementProps extends Partial<ElementEventHandlerProps>, Partial<Pick<Transformable, TransformProp>> {
      name?: string;
      ignore?: boolean;
      isGroup?: boolean;
      draggable?: boolean | 'horizontal' | 'vertical';
      silent?: boolean;
      ignoreHostSilent?: boolean;
      ignoreClip?: boolean;
      globalScaleRatio?: number;
      textConfig?: ElementTextConfig;
      textContent?: ZRText;
      clipPath?: Path;
      drift?: Element['drift'];
      extra?: Dictionary<unknown>;
      anid?: string;
  }
  const PRIMARY_STATES_KEYS: ["x" | "y" | "originX" | "originY" | "anchorX" | "anchorY" | "rotation" | "scaleX" | "scaleY" | "skewX" | "skewY", "ignore"];
  type ElementStatePropNames = (typeof PRIMARY_STATES_KEYS)[number] | 'textConfig';
  type ElementState = Pick<ElementProps, ElementStatePropNames> & ElementCommonState;
  type ElementCommonState = {
      hoverLayer?: boolean;
  };
  type ElementCalculateTextPosition = (out: TextPositionCalculationResult, style: ElementTextConfig, rect: RectLike) => TextPositionCalculationResult;
  interface Element<Props extends ElementProps = ElementProps> extends Transformable, Eventful<{
      [key in ElementEventName]: (e: ElementEvent) => void | boolean;
  } & {
      [key in string]: (...args: any) => void | boolean;
  }>, ElementEventHandlerProps {
  }
  class Element<Props extends ElementProps = ElementProps> {
      id: number;
      type: string;
      name: string;
      ignore: boolean;
      silent: boolean;
      ignoreHostSilent: boolean;
      isGroup: boolean;
      draggable: boolean | 'horizontal' | 'vertical';
      dragging: boolean;
      parent: Group;
      animators: Animator<any>[];
      ignoreClip: boolean;
      __hostTarget: Element;
      __zr: ZRenderType;
      __dirty: number;
      __isRendered: boolean;
      __inHover: boolean;
      __clipPaths?: Path[];
      private _clipPath?;
      private _textContent?;
      private _textGuide?;
      textConfig?: ElementTextConfig;
      textGuideLineConfig?: ElementTextGuideLineConfig;
      anid: string;
      extra: Dictionary<unknown>;
      currentStates?: string[];
      prevStates?: string[];
      states: Dictionary<ElementState>;
      stateTransition: ElementAnimateConfig;
      stateProxy?: (stateName: string, targetStates?: string[]) => ElementState;
      protected _normalState: ElementState;
      private _innerTextDefaultStyle;
      constructor(props?: Props);
      protected _init(props?: Props): void;
      drift(dx: number, dy: number, e?: ElementEvent): void;
      beforeUpdate(): void;
      afterUpdate(): void;
      update(): void;
      updateInnerText(forceUpdate?: boolean): void;
      protected canBeInsideText(): boolean;
      protected getInsideTextFill(): string | undefined;
      protected getInsideTextStroke(textFill: string): string | undefined;
      protected getOutsideFill(): string | undefined;
      protected getOutsideStroke(textFill: string): string;
      traverse<Context>(cb: (this: Context, el: Element<Props>) => void, context?: Context): void;
      protected attrKV(key: string, value: unknown): void;
      hide(): void;
      show(): void;
      attr(keyOrObj: Props): this;
      attr<T extends keyof Props>(keyOrObj: T, value: Props[T]): this;
      saveCurrentToNormalState(toState: ElementState): void;
      protected _innerSaveToNormal(toState: ElementState): void;
      protected _savePrimaryToNormal(toState: Dictionary<any>, normalState: Dictionary<any>, primaryKeys: readonly string[]): void;
      hasState(): boolean;
      getState(name: string): ElementState;
      ensureState(name: string): ElementState;
      clearStates(noAnimation?: boolean): void;
      useState(stateName: string, keepCurrentStates?: boolean, noAnimation?: boolean, forceUseHoverLayer?: boolean): ElementState;
      useStates(states: string[], noAnimation?: boolean, forceUseHoverLayer?: boolean): void;
      isSilent(): boolean;
      private _updateAnimationTargets;
      removeState(state: string): void;
      replaceState(oldState: string, newState: string, forceAdd: boolean): void;
      toggleState(state: string, enable: boolean): void;
      protected _mergeStates(states: ElementState[]): ElementState;
      protected _applyStateObj(stateName: string, state: ElementState, normalState: ElementState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
      private _attachComponent;
      private _detachComponent;
      getClipPath(): Path<PathProps>;
      setClipPath(clipPath: Path): void;
      removeClipPath(): void;
      getTextContent(): ZRText;
      setTextContent(textEl: ZRText): void;
      setTextConfig(cfg: ElementTextConfig): void;
      removeTextConfig(): void;
      removeTextContent(): void;
      getTextGuideLine(): Polyline;
      setTextGuideLine(guideLine: Polyline): void;
      removeTextGuideLine(): void;
      markRedraw(): void;
      dirty(): void;
      private _toggleHoverLayerFlag;
      addSelfToZr(zr: ZRenderType): void;
      removeSelfFromZr(zr: ZRenderType): void;
      animate(key?: string, loop?: boolean, allowDiscreteAnimation?: boolean): Animator<any>;
      addAnimator(animator: Animator<any>, key: string): void;
      updateDuringAnimation(key: string): void;
      stopAnimation(scope?: string, forwardToLast?: boolean): this;
      animateTo(target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
      animateFrom(target: Props, cfg: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
      protected _transitionState(stateName: string, target: Props, cfg?: ElementAnimateConfig, animationProps?: MapToType<Props, boolean>): void;
      getBoundingRect(): BoundingRect;
      getPaintRect(): BoundingRect;
      calculateTextPosition: ElementCalculateTextPosition;
      protected static initDefaultProps: void;
  }
  
  interface CommonStyleProps {
      shadowBlur?: number;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
      shadowColor?: string;
      opacity?: number;
      blend?: string;
  }
  interface DisplayableProps extends ElementProps {
      style?: Dictionary<any>;
      zlevel?: number;
      z?: number;
      z2?: number;
      culling?: boolean;
      cursor?: string;
      rectHover?: boolean;
      progressive?: boolean;
      incremental?: boolean;
      ignoreCoarsePointer?: boolean;
      batch?: boolean;
      invisible?: boolean;
  }
  type DisplayableKey = keyof DisplayableProps;
  type DisplayablePropertyType = PropType<DisplayableProps, DisplayableKey>;
  type DisplayableStatePropNames = ElementStatePropNames | 'style' | 'z' | 'z2' | 'invisible';
  type DisplayableState = Pick<DisplayableProps, DisplayableStatePropNames> & ElementCommonState;
  interface Displayable<Props extends DisplayableProps = DisplayableProps> {
      animate(key?: '', loop?: boolean): Animator<this>;
      animate(key: 'style', loop?: boolean): Animator<this['style']>;
      getState(stateName: string): DisplayableState;
      ensureState(stateName: string): DisplayableState;
      states: Dictionary<DisplayableState>;
      stateProxy: (stateName: string) => DisplayableState;
  }
  class Displayable<Props extends DisplayableProps = DisplayableProps> extends Element<Props> {
      invisible: boolean;
      z: number;
      z2: number;
      zlevel: number;
      culling: boolean;
      cursor: string;
      rectHover: boolean;
      incremental: boolean;
      ignoreCoarsePointer?: boolean;
      style: Dictionary<any>;
      protected _normalState: DisplayableState;
      protected _rect: BoundingRect;
      protected _paintRect: BoundingRect;
      protected _prevPaintRect: BoundingRect;
      dirtyRectTolerance: number;
      useHoverLayer?: boolean;
      __hoverStyle?: CommonStyleProps;
      __clipPaths?: Path[];
      __canvasFillGradient: CanvasGradient;
      __canvasStrokeGradient: CanvasGradient;
      __canvasFillPattern: CanvasPattern;
      __canvasStrokePattern: CanvasPattern;
      __svgEl: SVGElement;
      constructor(props?: Props);
      protected _init(props?: Props): void;
      beforeBrush(): void;
      afterBrush(): void;
      innerBeforeBrush(): void;
      innerAfterBrush(): void;
      shouldBePainted(viewWidth: number, viewHeight: number, considerClipPath: boolean, considerAncestors: boolean): boolean;
      contain(x: number, y: number): boolean;
      traverse<Context>(cb: (this: Context, el: this) => void, context?: Context): void;
      rectContain(x: number, y: number): boolean;
      getPaintRect(): BoundingRect;
      setPrevPaintRect(paintRect: BoundingRect): void;
      getPrevPaintRect(): BoundingRect;
      animateStyle(loop: boolean): Animator<this["style"]>;
      updateDuringAnimation(targetKey: string): void;
      attrKV(key: DisplayableKey, value: DisplayablePropertyType): void;
      setStyle(obj: Props['style']): this;
      setStyle<T extends keyof Props['style']>(obj: T, value: Props['style'][T]): this;
      dirtyStyle(notRedraw?: boolean): void;
      dirty(): void;
      styleChanged(): boolean;
      styleUpdated(): void;
      createStyle(obj?: Props['style']): Props["style"];
      useStyle(obj: Props['style']): void;
      isStyleObject(obj: Props['style']): any;
      protected _innerSaveToNormal(toState: DisplayableState): void;
      protected _applyStateObj(stateName: string, state: DisplayableState, normalState: DisplayableState, keepCurrentStates: boolean, transition: boolean, animationCfg: ElementAnimateConfig): void;
      protected _mergeStates(states: DisplayableState[]): DisplayableState;
      protected _mergeStyle(targetStyle: CommonStyleProps, sourceStyle: CommonStyleProps): CommonStyleProps;
      getAnimationStyleProps(): MapToType<DisplayableProps, boolean>;
      protected static initDefaultProps: void;
  }
  
  interface PainterBase {
      type: string;
      root?: HTMLElement;
      ssrOnly?: boolean;
      resize(width?: number | string, height?: number | string): void;
      refresh(): void;
      clear(): void;
      renderToString?(): string;
      getType: () => string;
      getWidth(): number;
      getHeight(): number;
      dispose(): void;
      getViewportRoot: () => HTMLElement;
      getViewportRootOffset: () => {
          offsetLeft: number;
          offsetTop: number;
      };
      refreshHover(): void;
      configLayer(zlevel: number, config: Dictionary<any>): void;
      setBackgroundColor(backgroundColor: string | GradientObject | PatternObject): void;
  }
  
  interface HandlerProxyInterface extends Eventful {
      handler: Handler;
      dispose: () => void;
      setCursor: (cursorStyle?: string) => void;
  }
  
  function shapeCompareFunc(a: Displayable, b: Displayable): number;
  class Storage {
      private _roots;
      private _displayList;
      private _displayListLen;
      traverse<T>(cb: (this: T, el: Element) => void, context?: T): void;
      getDisplayList(update?: boolean, includeIgnore?: boolean): Displayable[];
      updateDisplayList(includeIgnore?: boolean): void;
      private _updateAndAddDisplayable;
      addRoot(el: Element): void;
      delRoot(el: Element | Element[]): void;
      delAllRoots(): void;
      getRoots(): Element<ElementProps>[];
      dispose(): void;
      displayableSortFunc: typeof shapeCompareFunc;
  }
  
  class HoveredResult {
      x: number;
      y: number;
      target: Displayable;
      topTarget: Displayable;
      constructor(x?: number, y?: number);
  }
  type HandlerName = 'click' | 'dblclick' | 'mousewheel' | 'mouseout' | 'mouseup' | 'mousedown' | 'mousemove' | 'contextmenu';
  class Handler extends Eventful {
      storage: Storage;
      painter: PainterBase;
      painterRoot: HTMLElement;
      proxy: HandlerProxyInterface;
      private _hovered;
      private _gestureMgr;
      private _draggingMgr;
      private _pointerSize;
      _downEl: Element;
      _upEl: Element;
      _downPoint: [number, number];
      constructor(storage: Storage, painter: PainterBase, proxy: HandlerProxyInterface, painterRoot: HTMLElement, pointerSize: number);
      setHandlerProxy(proxy: HandlerProxyInterface): void;
      mousemove(event: ZRRawEvent): void;
      mouseout(event: ZRRawEvent): void;
      resize(): void;
      dispatch(eventName: HandlerName, eventArgs?: any): void;
      dispose(): void;
      setCursorStyle(cursorStyle: string): void;
      dispatchToElement(targetInfo: {
          target?: Element;
          topTarget?: Element;
      }, eventName: ElementEventName, event: ZRRawEvent): void;
      findHover(x: number, y: number, exclude?: Displayable): HoveredResult;
      processGesture(event: ZRRawEvent, stage?: 'start' | 'end' | 'change'): void;
      click: (event: ZRRawEvent) => void;
      mousedown: (event: ZRRawEvent) => void;
      mouseup: (event: ZRRawEvent) => void;
      mousewheel: (event: ZRRawEvent) => void;
      dblclick: (event: ZRRawEvent) => void;
      contextmenu: (event: ZRRawEvent) => void;
  }
  
  interface LayerConfig {
      clearColor?: string | GradientObject | ImagePatternObject;
      motionBlur?: boolean;
      lastFrameAlpha?: number;
  }
  
  /*!
  * ZRender, a high performance 2d drawing library.
  *
  * Copyright (c) 2013, Baidu Inc.
  * All rights reserved.
  *
  * LICENSE
  * https://github.com/ecomfe/zrender/blob/master/LICENSE.txt
  */
  
  type PainterBaseCtor = {
      new (dom: HTMLElement, storage: Storage, ...args: any[]): PainterBase;
  };
  class ZRender {
      dom?: HTMLElement;
      id: number;
      storage: Storage;
      painter: PainterBase;
      handler: Handler;
      animation: Animation;
      private _sleepAfterStill;
      private _stillFrameAccum;
      private _needsRefresh;
      private _needsRefreshHover;
      private _disposed;
      private _darkMode;
      private _backgroundColor;
      constructor(id: number, dom?: HTMLElement, opts?: ZRenderInitOpt);
      add(el: Element): void;
      remove(el: Element): void;
      configLayer(zLevel: number, config: LayerConfig): void;
      setBackgroundColor(backgroundColor: string | GradientObject | PatternObject): void;
      getBackgroundColor(): string | GradientObject | PatternObject;
      setDarkMode(darkMode: boolean): void;
      isDarkMode(): boolean;
      refreshImmediately(fromInside?: boolean): void;
      refresh(): void;
      flush(): void;
      private _flush;
      setSleepAfterStill(stillFramesCount: number): void;
      wakeUp(): void;
      refreshHover(): void;
      refreshHoverImmediately(): void;
      resize(opts?: {
          width?: number | string;
          height?: number | string;
      }): void;
      clearAnimation(): void;
      getWidth(): number | undefined;
      getHeight(): number | undefined;
      setCursorStyle(cursorStyle: string): void;
      findHover(x: number, y: number): {
          target: Displayable;
          topTarget: Displayable;
      } | undefined;
      on<Ctx>(eventName: ElementEventName, eventHandler: ElementEventCallback<Ctx, ZRenderType>, context?: Ctx): this;
      on<Ctx>(eventName: string, eventHandler: WithThisType<EventCallback<any[]>, unknown extends Ctx ? ZRenderType : Ctx>, context?: Ctx): this;
      off(eventName?: string, eventHandler?: EventCallback): void;
      trigger(eventName: string, event?: unknown): void;
      clear(): void;
      dispose(): void;
  }
  interface ZRenderInitOpt {
      renderer?: string;
      devicePixelRatio?: number;
      width?: number | string;
      height?: number | string;
      useDirtyRect?: boolean;
      useCoarsePointer?: 'auto' | boolean;
      pointerSize?: number;
      ssr?: boolean;
  }
  function init(dom?: HTMLElement | null, opts?: ZRenderInitOpt): ZRender;
  function dispose(zr: ZRender): void;
  function disposeAll(): void;
  function getInstance(id: number): ZRender;
  function registerPainter(name: string, Ctor: PainterBaseCtor): void;
  type ElementSSRData = HashMap<unknown>;
  type ElementSSRDataGetter<T> = (el: Element) => HashMap<T>;
  function getElementSSRData(el: Element): ElementSSRData;
  function registerSSRDataGetter<T>(getter: ElementSSRDataGetter<T>): void;
  const version = "6.0.0";
  interface ZRenderType extends ZRender {
  }
  
  type zrender_d_ZRenderInitOpt = ZRenderInitOpt;
  const zrender_d_init: typeof init;
  const zrender_d_dispose: typeof dispose;
  const zrender_d_disposeAll: typeof disposeAll;
  const zrender_d_getInstance: typeof getInstance;
  const zrender_d_registerPainter: typeof registerPainter;
  type zrender_d_ElementSSRData = ElementSSRData;
  type zrender_d_ElementSSRDataGetter<T> = ElementSSRDataGetter<T>;
  const zrender_d_getElementSSRData: typeof getElementSSRData;
  const zrender_d_registerSSRDataGetter: typeof registerSSRDataGetter;
  const zrender_d_version: typeof version;
  type zrender_d_ZRenderType = ZRenderType;
  namespace zrender_d {
    export {
      zrender_d_ZRenderInitOpt as ZRenderInitOpt,
      zrender_d_init as init,
      zrender_d_dispose as dispose,
      zrender_d_disposeAll as disposeAll,
      zrender_d_getInstance as getInstance,
      zrender_d_registerPainter as registerPainter,
      zrender_d_ElementSSRData as ElementSSRData,
      zrender_d_ElementSSRDataGetter as ElementSSRDataGetter,
      zrender_d_getElementSSRData as getElementSSRData,
      zrender_d_registerSSRDataGetter as registerSSRDataGetter,
      zrender_d_version as version,
      zrender_d_ZRenderType as ZRenderType,
    };
  }
  
  function encodeHTML(source: string): string;
  
  interface InnerTruncateOption {
      maxIteration?: number;
      minChar?: number;
      placeholder?: string;
      maxIterations?: number;
  }
  function truncateText(text: string, containerWidth: number, font: string, ellipsis?: string, options?: InnerTruncateOption): string;
  
  type SVGPathOption = Omit<PathProps, 'shape' | 'buildPath'>;
  class SVGPath extends Path {
      applyTransform(m: MatrixArray): void;
  }
  function extendFromString(str: string, defaultOpts?: SVGPathOption): typeof SVGPath;
  function mergePath(pathEls: Path[], opts: PathProps): Path<PathProps>;
  
  class CircleShape {
      cx: number;
      cy: number;
      r: number;
  }
  interface CircleProps extends PathProps {
      shape?: Partial<CircleShape>;
  }
  class Circle extends Path<CircleProps> {
      shape: CircleShape;
      constructor(opts?: CircleProps);
      getDefaultShape(): CircleShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: CircleShape): void;
  }
  
  class EllipseShape {
      cx: number;
      cy: number;
      rx: number;
      ry: number;
  }
  interface EllipseProps extends PathProps {
      shape?: Partial<EllipseShape>;
  }
  class Ellipse extends Path<EllipseProps> {
      shape: EllipseShape;
      constructor(opts?: EllipseProps);
      getDefaultShape(): EllipseShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: EllipseShape): void;
  }
  
  class SectorShape {
      cx: number;
      cy: number;
      r0: number;
      r: number;
      startAngle: number;
      endAngle: number;
      clockwise: boolean;
      cornerRadius: number | number[];
  }
  interface SectorProps extends PathProps {
      shape?: Partial<SectorShape>;
  }
  class Sector extends Path<SectorProps> {
      shape: SectorShape;
      constructor(opts?: SectorProps);
      getDefaultShape(): SectorShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: SectorShape): void;
      isZeroArea(): boolean;
  }
  
  class RingShape {
      cx: number;
      cy: number;
      r: number;
      r0: number;
  }
  interface RingProps extends PathProps {
      shape?: Partial<RingShape>;
  }
  class Ring extends Path<RingProps> {
      shape: RingShape;
      constructor(opts?: RingProps);
      getDefaultShape(): RingShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: RingShape): void;
  }
  
  class PolygonShape {
      points: VectorArray[];
      smooth?: number;
      smoothConstraint?: VectorArray[];
  }
  interface PolygonProps extends PathProps {
      shape?: Partial<PolygonShape>;
  }
  class Polygon extends Path<PolygonProps> {
      shape: PolygonShape;
      constructor(opts?: PolygonProps);
      getDefaultShape(): PolygonShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: PolygonShape): void;
  }
  
  class LineShape {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      percent: number;
  }
  interface LineProps extends PathProps {
      shape?: Partial<LineShape>;
  }
  class Line extends Path<LineProps> {
      shape: LineShape;
      constructor(opts?: LineProps);
      getDefaultStyle(): {
          stroke: string;
          fill: string;
      };
      getDefaultShape(): LineShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: LineShape): void;
      pointAt(p: number): VectorArray;
  }
  
  class BezierCurveShape {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cpx1: number;
      cpy1: number;
      cpx2?: number;
      cpy2?: number;
      percent: number;
  }
  interface BezierCurveProps extends PathProps {
      shape?: Partial<BezierCurveShape>;
  }
  class BezierCurve extends Path<BezierCurveProps> {
      shape: BezierCurveShape;
      constructor(opts?: BezierCurveProps);
      getDefaultStyle(): {
          stroke: string;
          fill: string;
      };
      getDefaultShape(): BezierCurveShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: BezierCurveShape): void;
      pointAt(t: number): number[];
      tangentAt(t: number): number[];
  }
  
  class ArcShape {
      cx: number;
      cy: number;
      r: number;
      startAngle: number;
      endAngle: number;
      clockwise?: boolean;
  }
  interface ArcProps extends PathProps {
      shape?: Partial<ArcShape>;
  }
  class Arc extends Path<ArcProps> {
      shape: ArcShape;
      constructor(opts?: ArcProps);
      getDefaultStyle(): {
          stroke: string;
          fill: string;
      };
      getDefaultShape(): ArcShape;
      buildPath(ctx: CanvasRenderingContext2D, shape: ArcShape): void;
  }
  
  interface CompoundPathShape {
      paths: Path[];
  }
  class CompoundPath extends Path {
      type: string;
      shape: CompoundPathShape;
      private _updatePathDirty;
      beforeBrush(): void;
      buildPath(ctx: PathProxy | CanvasRenderingContext2D, shape: CompoundPathShape): void;
      afterBrush(): void;
      getBoundingRect(): BoundingRect;
  }
  
  class IncrementalDisplayable extends Displayable {
      notClear: boolean;
      incremental: boolean;
      private _displayables;
      private _temporaryDisplayables;
      private _cursor;
      traverse<T>(cb: (this: T, el: this) => void, context: T): void;
      useStyle(): void;
      getCursor(): number;
      innerAfterBrush(): void;
      clearDisplaybles(): void;
      clearTemporalDisplayables(): void;
      addDisplayable(displayable: Displayable, notPersistent?: boolean): void;
      addDisplayables(displayables: Displayable[], notPersistent?: boolean): void;
      getDisplayables(): Displayable[];
      getTemporalDisplayables(): Displayable[];
      eachPendingDisplayable(cb: (displayable: Displayable) => void): void;
      update(): void;
      getBoundingRect(): BoundingRect;
      contain(x: number, y: number): boolean;
  }
  
  type Constructor = new (...args: any) => any;
  interface ClassManager {
      registerClass: (clz: Constructor) => Constructor;
      getClass: (componentMainType: ComponentMainType, subType?: ComponentSubType, throwWhenNotFound?: boolean) => Constructor;
      getClassesByMainType: (componentType: ComponentMainType) => Constructor[];
      hasClass: (componentType: ComponentFullType) => boolean;
      getAllClassMainTypes: () => ComponentMainType[];
      hasSubTypes: (componentType: ComponentFullType) => boolean;
  }
  
  interface SubTypeDefaulter {
      (option: ComponentOption): ComponentSubType;
  }
  interface SubTypeDefaulterManager {
      registerSubTypeDefaulter: (componentType: string, defaulter: SubTypeDefaulter) => void;
      determineSubType: (componentType: string, option: ComponentOption) => string;
  }
  
  type DiffKeyGetter<CTX = unknown> = (this: DataDiffer<CTX>, value: unknown, index: number) => string;
  type DiffCallbackAdd = (newIndex: number) => void;
  type DiffCallbackUpdate = (newIndex: number, oldIndex: number) => void;
  type DiffCallbackRemove = (oldIndex: number) => void;
  type DiffCallbackUpdateManyToOne = (newIndex: number, oldIndex: number[]) => void;
  type DiffCallbackUpdateOneToMany = (newIndex: number[], oldIndex: number) => void;
  type DiffCallbackUpdateManyToMany = (newIndex: number[], oldIndex: number[]) => void;
  type DataDiffMode = 'oneToOne' | 'multiple';
  class DataDiffer<CTX = unknown> {
      private _old;
      private _new;
      private _oldKeyGetter;
      private _newKeyGetter;
      private _add;
      private _update;
      private _updateManyToOne;
      private _updateOneToMany;
      private _updateManyToMany;
      private _remove;
      private _diffModeMultiple;
      readonly context: CTX;
      /**
       * @param context Can be visited by this.context in callback.
       */
      constructor(oldArr: ArrayLike$1<unknown>, newArr: ArrayLike$1<unknown>, oldKeyGetter?: DiffKeyGetter<CTX>, newKeyGetter?: DiffKeyGetter<CTX>, context?: CTX, diffMode?: DataDiffMode);
      /**
       * Callback function when add a data
       */
      add(func: DiffCallbackAdd): this;
      /**
       * Callback function when update a data
       */
      update(func: DiffCallbackUpdate): this;
      /**
       * Callback function when update a data and only work in `cbMode: 'byKey'`.
       */
      updateManyToOne(func: DiffCallbackUpdateManyToOne): this;
      /**
       * Callback function when update a data and only work in `cbMode: 'byKey'`.
       */
      updateOneToMany(func: DiffCallbackUpdateOneToMany): this;
      /**
       * Callback function when update a data and only work in `cbMode: 'byKey'`.
       */
      updateManyToMany(func: DiffCallbackUpdateManyToMany): this;
      /**
       * Callback function when remove a data
       */
      remove(func: DiffCallbackRemove): this;
      execute(): void;
      private _executeOneToOne;
      /**
       * For example, consider the case:
       * oldData: [o0, o1, o2, o3, o4, o5, o6, o7],
       * newData: [n0, n1, n2, n3, n4, n5, n6, n7, n8],
       * Where:
       *     o0, o1, n0 has key 'a' (many to one)
       *     o5, n4, n5, n6 has key 'b' (one to many)
       *     o2, n1 has key 'c' (one to one)
       *     n2, n3 has key 'd' (add)
       *     o3, o4 has key 'e' (remove)
       *     o6, o7, n7, n8 has key 'f' (many to many, treated as add and remove)
       * Then:
       *     (The order of the following directives are not ensured.)
       *     this._updateManyToOne(n0, [o0, o1]);
       *     this._updateOneToMany([n4, n5, n6], o5);
       *     this._update(n1, o2);
       *     this._remove(o3);
       *     this._remove(o4);
       *     this._remove(o6);
       *     this._remove(o7);
       *     this._add(n2);
       *     this._add(n3);
       *     this._add(n7);
       *     this._add(n8);
       */
      private _executeMultiple;
      private _performRestAdd;
      private _initIndexMap;
  }
  
  type PipedDataTransformOption = DataTransformOption[];
  type DataTransformType = string;
  type DataTransformConfig = unknown;
  interface DataTransformOption {
      type: DataTransformType;
      config?: DataTransformConfig;
      print?: boolean;
  }
  interface ExternalDataTransform<TO extends DataTransformOption = DataTransformOption> {
      type: string;
      __isBuiltIn?: boolean;
      transform: (param: ExternalDataTransformParam<TO>) => ExternalDataTransformResultItem | ExternalDataTransformResultItem[];
  }
  interface ExternalDataTransformParam<TO extends DataTransformOption = DataTransformOption> {
      upstream: ExternalSource;
      upstreamList: ExternalSource[];
      config: TO['config'];
  }
  interface ExternalDataTransformResultItem {
      /**
       * If `data` is null/undefined, inherit upstream data.
       */
      data: OptionSourceDataArrayRows | OptionSourceDataObjectRows;
      /**
       * A `transform` can optionally return a dimensions definition.
       * The rule:
       * If this `transform result` have different dimensions from the upstream, it should return
       * a new dimension definition. For example, this transform inherit the upstream data totally
       * but add a extra dimension.
       * Otherwise, do not need to return that dimension definition. echarts will inherit dimension
       * definition from the upstream.
       */
      dimensions?: DimensionDefinitionLoose[];
  }
  type DataTransformDataItem = ExternalDataTransformResultItem['data'][number];
  interface ExternalDimensionDefinition extends Partial<DimensionDefinition> {
      index: DimensionIndex;
  }
  /**
   * TODO: disable writable.
   * This structure will be exposed to users.
   */
  class ExternalSource {
      /**
       * [Caveat]
       * This instance is to be exposed to users.
       * (1) DO NOT mount private members on this instance directly.
       * If we have to use private members, we can make them in closure or use `makeInner`.
       * (2) "source header count" is not provided to transform, because it's complicated to manage
       * header and dimensions definition in each transform. Source headers are all normalized to
       * dimensions definitions in transforms and their downstreams.
       */
      sourceFormat: SourceFormat;
      getRawData(): Source['data'];
      getRawDataItem(dataIndex: number): DataTransformDataItem;
      cloneRawData(): Source['data'];
      /**
       * @return If dimension not found, return null/undefined.
       */
      getDimensionInfo(dim: DimensionLoose): ExternalDimensionDefinition;
      /**
       * dimensions defined if and only if either:
       * (a) dataset.dimensions are declared.
       * (b) dataset data include dimensions definitions in data (detected or via specified `sourceHeader`).
       * If dimensions are defined, `dimensionInfoAll` is corresponding to
       * the defined dimensions.
       * Otherwise, `dimensionInfoAll` is determined by data columns.
       * @return Always return an array (even empty array).
       */
      cloneAllDimensionInfo(): ExternalDimensionDefinition[];
      count(): number;
      /**
       * Only support by dimension index.
       * No need to support by dimension name in transform function,
       * because transform function is not case-specific, no need to use name literally.
       */
      retrieveValue(dataIndex: number, dimIndex: DimensionIndex): OptionDataValue;
      retrieveValueFromItem(dataItem: DataTransformDataItem, dimIndex: DimensionIndex): OptionDataValue;
      convertValue(rawVal: unknown, dimInfo: ExternalDimensionDefinition): ParsedValue;
  }
  function registerExternalTransform(externalTransform: ExternalDataTransform): void;
  
  interface PaletteMixin<T extends PaletteOptionMixin = PaletteOptionMixin> extends Pick<Model<T>, 'get'> {
  }
  class PaletteMixin<T extends PaletteOptionMixin = PaletteOptionMixin> {
      getColorFromPalette(this: PaletteMixin<T>, name: string, scope?: any, requestNum?: number): ZRColor;
      clearColorPalette(this: PaletteMixin<T>): void;
  }
  
  interface ComponentView {
      /**
       * Implement it if needed.
       */
      updateTransform?(model: ComponentModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void | {
          update: true;
      };
      /**
       * Pass only when return `true`.
       * Implement it if needed.
       */
      filterForExposedEvent(eventType: string, query: EventQueryItem, targetEl: Element, packedEvent: ECActionEvent | ECElementEvent): boolean;
      /**
       * Find dispatchers for highlight/downplay by name.
       * If this methods provided, hover link (within the same name) is enabled in component.
       * That is, in component, a name can correspond to multiple dispatchers.
       * Those dispatchers can have no common ancestor.
       * The highlight/downplay state change will be applied on the
       * dispatchers and their descendents.
       *
       * @return Must return an array but not null/undefined.
       */
      findHighDownDispatchers?(name: string): Element[];
      focusBlurEnabled?: boolean;
  }
  class ComponentView {
      readonly group: ViewRootGroup;
      readonly uid: string;
      __model: ComponentModel;
      __alive: boolean;
      __id: string;
      constructor();
      init(ecModel: GlobalModel, api: ExtensionAPI): void;
      render(model: ComponentModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      dispose(ecModel: GlobalModel, api: ExtensionAPI): void;
      updateView(model: ComponentModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      updateLayout(model: ComponentModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      updateVisual(model: ComponentModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Hook for toggle blur target series.
       * Can be used in marker for blur or leave blur the markers
       */
      toggleBlurSeries(seriesModels: SeriesModel[], isBlur: boolean, ecModel: GlobalModel): void;
      /**
       * Traverse the new rendered elements.
       *
       * It will traverse the new added element in progressive rendering.
       * And traverse all in normal rendering.
       */
      eachRendered(cb: (el: Element) => boolean | void): void;
      static registerClass: ClassManager['registerClass'];
  }
  
  interface TaskContext {
      outputData?: SeriesData;
      data?: SeriesData;
      payload?: Payload;
      model?: SeriesModel;
  }
  type TaskResetCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => TaskResetCallbackReturn<Ctx>;
  type TaskResetCallbackReturn<Ctx extends TaskContext> = void | (TaskProgressCallback<Ctx> | TaskProgressCallback<Ctx>[]) | {
      forceFirstProgress?: boolean;
      progress: TaskProgressCallback<Ctx> | TaskProgressCallback<Ctx>[];
  };
  type TaskProgressCallback<Ctx extends TaskContext> = (this: Task<Ctx>, params: TaskProgressParams, context: Ctx) => void;
  type TaskProgressParams = {
      start: number;
      end: number;
      count: number;
      next?: TaskDataIteratorNext;
  };
  type TaskPlanCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => TaskPlanCallbackReturn;
  type TaskPlanCallbackReturn = 'reset' | false | null | undefined;
  type TaskCountCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => number;
  type TaskOnDirtyCallback<Ctx extends TaskContext> = (this: Task<Ctx>, context: Ctx) => void;
  type TaskDataIteratorNext = () => number;
  type TaskDefineParam<Ctx extends TaskContext> = {
      reset?: TaskResetCallback<Ctx>;
      plan?: TaskPlanCallback<Ctx>;
      count?: TaskCountCallback<Ctx>;
      onDirty?: TaskOnDirtyCallback<Ctx>;
  };
  type PerformArgs = {
      step?: number;
      skip?: boolean;
      modBy?: number;
      modDataCount?: number;
  };
  class Task<Ctx extends TaskContext> {
      private _reset;
      private _plan;
      private _count;
      private _onDirty;
      private _progress;
      private _callingProgress;
      private _dirty;
      private _modBy;
      private _modDataCount;
      private _upstream;
      private _downstream;
      private _dueEnd;
      private _outputDueEnd;
      private _settedOutputEnd;
      private _dueIndex;
      private _disposed;
      __pipeline: Pipeline;
      __idxInPipeline: number;
      __block: boolean;
      context: Ctx;
      constructor(define: TaskDefineParam<Ctx>);
      /**
       * @param step Specified step.
       * @param skip Skip customer perform call.
       * @param modBy Sampling window size.
       * @param modDataCount Sampling count.
       * @return whether unfinished.
       */
      perform(performArgs?: PerformArgs): boolean;
      dirty(): void;
      private _doProgress;
      private _doReset;
      unfinished(): boolean;
      /**
       * @param downTask The downstream task.
       * @return The downstream task.
       */
      pipe(downTask: Task<Ctx>): void;
      dispose(): void;
      getUpstream(): Task<Ctx>;
      getDownstream(): Task<Ctx>;
      setOutputEnd(end: number): void;
  }
  
  type GeneralTask = Task<TaskContext>;
  type SeriesTask = Task<SeriesTaskContext>;
  type Pipeline = {
      id: string;
      head: GeneralTask;
      tail: GeneralTask;
      threshold: number;
      progressiveEnabled: boolean;
      blockIndex: number;
      step: number;
      count: number;
      currentTask?: GeneralTask;
      context?: PipelineContext;
  };
  type PipelineContext = {
      progressiveRender: boolean;
      modDataCount: number;
      large: boolean;
  };
  type PerformStageTaskOpt = {
      block?: boolean;
      setDirty?: boolean;
      visualType?: StageHandlerInternal['visualType'];
      dirtyMap?: HashMap<any>;
  };
  interface SeriesTaskContext extends TaskContext {
      model?: SeriesModel;
      data?: SeriesData;
      view?: ChartView;
      ecModel?: GlobalModel;
      api?: ExtensionAPI;
      useClearVisual?: boolean;
      plan?: StageHandlerPlan;
      reset?: StageHandlerReset;
      scheduler?: Scheduler;
      payload?: Payload;
      resetDefines?: StageHandlerProgressExecutor[];
  }
  interface OverallTaskContext extends TaskContext {
      ecModel: GlobalModel;
      api: ExtensionAPI;
      overallReset: StageHandlerOverallReset;
      scheduler: Scheduler;
      payload?: Payload;
  }
  class Scheduler {
      readonly ecInstance: EChartsType;
      readonly api: ExtensionAPI;
      unfinished: boolean;
      private _dataProcessorHandlers;
      private _visualHandlers;
      private _allHandlers;
      private _stageTaskMap;
      private _pipelineMap;
      constructor(ecInstance: EChartsType, api: ExtensionAPI, dataProcessorHandlers: StageHandlerInternal[], visualHandlers: StageHandlerInternal[]);
      restoreData(ecModel: GlobalModel, payload: Payload): void;
      getPerformArgs(task: GeneralTask, isBlock?: boolean): {
          step: number;
          modBy: number;
          modDataCount: number;
      };
      getPipeline(pipelineId: string): Pipeline;
      /**
       * Current, progressive rendering starts from visual and layout.
       * Always detect render mode in the same stage, avoiding that incorrect
       * detection caused by data filtering.
       * Caution:
       * `updateStreamModes` use `seriesModel.getData()`.
       */
      updateStreamModes(seriesModel: SeriesModel<SeriesOption$1 & SeriesLargeOptionMixin>, view: ChartView): void;
      restorePipelines(ecModel: GlobalModel): void;
      prepareStageTasks(): void;
      prepareView(view: ChartView, model: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI): void;
      performDataProcessorTasks(ecModel: GlobalModel, payload?: Payload): void;
      performVisualTasks(ecModel: GlobalModel, payload?: Payload, opt?: PerformStageTaskOpt): void;
      private _performStageTasks;
      performSeriesTasks(ecModel: GlobalModel): void;
      plan(): void;
      updatePayload(task: Task<SeriesTaskContext | OverallTaskContext>, payload: Payload | 'remain'): void;
      private _createSeriesStageTask;
      private _createOverallStageTask;
      private _pipe;
      static wrapStageHandler(stageHandler: StageHandler | StageHandlerOverallReset, visualType: StageHandlerInternal['visualType']): StageHandlerInternal;
  }
  
  interface ChartView {
      /**
       * Rendering preparation in progressive mode.
       * Implement it if needed.
       */
      incrementalPrepareRender(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Render in progressive mode.
       * Implement it if needed.
       * @param params See taskParams in `stream/task.js`
       */
      incrementalRender(params: StageHandlerProgressParams, seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Update transform directly.
       * Implement it if needed.
       */
      updateTransform(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void | {
          update: true;
      };
      /**
       * The view contains the given point.
       * Implement it if needed.
       */
      containPoint(point: number[], seriesModel: SeriesModel): boolean;
      /**
       * Pass only when return `true`.
       * Implement it if needed.
       */
      filterForExposedEvent(eventType: string, query: EventQueryItem, targetEl: Element, packedEvent: ECActionEvent | ECElementEvent): boolean;
  }
  class ChartView {
      type: string;
      readonly group: ViewRootGroup;
      readonly uid: string;
      readonly renderTask: SeriesTask;
      /**
       * Ignore label line update in global stage. Will handle it in chart itself.
       * Used in pie / funnel
       */
      ignoreLabelLineUpdate: boolean;
      __alive: boolean;
      __model: SeriesModel;
      __id: string;
      static protoInitialize: void;
      constructor();
      init(ecModel: GlobalModel, api: ExtensionAPI): void;
      render(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Highlight series or specified data item.
       */
      highlight(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Downplay series or specified data item.
       */
      downplay(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Remove self.
       */
      remove(ecModel: GlobalModel, api: ExtensionAPI): void;
      /**
       * Dispose self.
       */
      dispose(ecModel: GlobalModel, api: ExtensionAPI): void;
      updateView(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      updateLayout(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      updateVisual(seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload: Payload): void;
      /**
       * Traverse the new rendered elements.
       *
       * It will traverse the new added element in progressive rendering.
       * And traverse all in normal rendering.
       */
      eachRendered(cb: (el: Element) => boolean | void): void;
      static markUpdateMethod(payload: Payload, methodName: keyof ChartView): void;
      static registerClass: ClassManager['registerClass'];
  }
  
  const availableMethods: (keyof EChartsType)[];
  interface ExtensionAPI extends Pick<EChartsType, (typeof availableMethods)[number]> {
  }
  abstract class ExtensionAPI {
      constructor(ecInstance: EChartsType);
      abstract getCoordinateSystems(): CoordinateSystemMaster[];
      abstract getComponentByElement(el: Element): ComponentModel;
      abstract enterEmphasis(el: Element, highlightDigit?: number): void;
      abstract leaveEmphasis(el: Element, highlightDigit?: number): void;
      abstract enterSelect(el: Element): void;
      abstract leaveSelect(el: Element): void;
      abstract enterBlur(el: Element): void;
      abstract leaveBlur(el: Element): void;
      abstract getViewOfComponentModel(componentModel: ComponentModel): ComponentView;
      abstract getViewOfSeriesModel(seriesModel: SeriesModel): ChartView;
      abstract getModel(): GlobalModel;
      abstract getMainProcessVersion(): number;
  }
  
  const _default: {
      time: {
          month: string[];
          monthAbbr: string[];
          dayOfWeek: string[];
          dayOfWeekAbbr: string[];
      };
      legend: {
          selector: {
              all: string;
              inverse: string;
          };
      };
      toolbox: {
          brush: {
              title: {
                  rect: string;
                  polygon: string;
                  lineX: string;
                  lineY: string;
                  keep: string;
                  clear: string;
              };
          };
          dataView: {
              title: string;
              lang: string[];
          };
          dataZoom: {
              title: {
                  zoom: string;
                  back: string;
              };
          };
          magicType: {
              title: {
                  line: string;
                  bar: string;
                  stack: string;
                  tiled: string;
              };
          };
          restore: {
              title: string;
          };
          saveAsImage: {
              title: string;
              lang: string[];
          };
      };
      series: {
          typeNames: {
              pie: string;
              bar: string;
              line: string;
              scatter: string;
              effectScatter: string;
              radar: string;
              tree: string;
              treemap: string;
              boxplot: string;
              candlestick: string;
              k: string;
              heatmap: string;
              map: string;
              parallel: string;
              lines: string;
              graph: string;
              sankey: string;
              funnel: string;
              gauge: string;
              pictorialBar: string;
              themeRiver: string;
              sunburst: string;
              custom: string;
              chart: string;
          };
      };
      aria: {
          general: {
              withTitle: string;
              withoutTitle: string;
          };
          series: {
              single: {
                  prefix: string;
                  withName: string;
                  withoutName: string;
              };
              multiple: {
                  prefix: string;
                  withName: string;
                  withoutName: string;
                  separator: {
                      middle: string;
                      end: string;
                  };
              };
          };
          data: {
              allData: string;
              partialData: string;
              withName: string;
              withoutName: string;
              separator: {
                  middle: string;
                  end: string;
              };
          };
      };
  };
  
  type LocaleOption = typeof _default;
  function registerLocale(locale: string, localeObj: LocaleOption): void;
  
  type PrimaryTimeUnit = (typeof primaryTimeUnits)[number];
  const primaryTimeUnits: readonly ["year", "month", "day", "hour", "minute", "second", "millisecond"];
  function format(time: unknown, template: string, isUTC: boolean, lang?: string | Model<LocaleOption>): string;
  /**
   * e.g.,
   * If timeUnit is 'year', return the Jan 1st 00:00:00 000 of that year.
   * If timeUnit is 'day', return the 00:00:00 000 of that day.
   *
   * @return The input date.
   */
  function roundTime(date: Date, timeUnit: PrimaryTimeUnit, isUTC: boolean): Date;
  
  const AXIS_TYPES: {
      readonly value: 1;
      readonly category: 1;
      readonly time: 1;
      readonly log: 1;
  };
  type OptionAxisType = keyof typeof AXIS_TYPES;
  interface AxisBaseOptionCommon extends ComponentOption, AnimationOptionMixin {
      type?: OptionAxisType;
      show?: boolean;
      inverse?: boolean;
      name?: string;
      /**
       * - 'start': place name based on axis.extent[0].
       * - 'end': place name based on axis.extent[1].
       * - 'middle': place name based on the center of the axis.
       * - 'center': ='middle'.
       */
      nameLocation?: 'start' | 'middle' | 'center' | 'end';
      nameRotate?: number;
      nameTruncate?: {
          maxWidth?: number;
          ellipsis?: string;
          placeholder?: string;
      };
      nameTextStyle?: AxisNameTextStyleOption;
      /**
       * This is the offset of axis name from:
       * - If `nameMoveOverlap: false`: offset from axisLine.
       * - If `nameMoveOverlap: true`: offset from axisLine+axisLabels.
       *
       * PENDING: should it named as "nameOffset" or support `[offsetX, offsetY]`?
       */
      nameGap?: number;
      /**
       * Whether to auto move axis name to avoid overlap with axis labels.
       * The procedure of axis name layout:
       * 1. Firstly apply `nameRotate`, `nameTruncate`, `nameLocation`, `nameGap`.
       *  Note that if `nameGap` is applied after the overlap handling, it may still
       *  cause overlap and confuse users.
       * 2. If `nameMoveOverlap: true`, move the name util it does not overlap with
       *  axis lables. `nameTextStyle.textMargin` can be used to adjust its gap from
       *  others in this case.
       * - If 'auto'/null/undefined, use `nameMoveOverlap`, except when `grid.containLabel` is
       *  true. This is for backward compat - users have tuned the position based on no name moved.
       */
      nameMoveOverlap?: boolean | 'auto' | NullUndefined$1;
      silent?: boolean;
      triggerEvent?: boolean;
      tooltip?: {
          show?: boolean;
      };
      axisLabel?: AxisLabelBaseOption;
      axisPointer?: CommonAxisPointerOption;
      axisLine?: AxisLineOption;
      axisTick?: AxisTickOption;
      minorTick?: MinorTickOption;
      splitLine?: SplitLineOption;
      minorSplitLine?: MinorSplitLineOption;
      splitArea?: SplitAreaOption;
      /**
       * Min value of the axis. can be:
       * + ScaleDataValue
       * + 'dataMin': use the min value in data.
       * + null/undefined: auto decide min value (consider pretty look and boundaryGap).
       */
      min?: ScaleDataValue | 'dataMin' | ((extent: {
          min: number;
          max: number;
      }) => ScaleDataValue);
      /**
       * Max value of the axis. can be:
       * + ScaleDataValue
       * + 'dataMax': use the max value in data.
       * + null/undefined: auto decide max value (consider pretty look and boundaryGap).
       */
      max?: ScaleDataValue | 'dataMax' | ((extent: {
          min: number;
          max: number;
      }) => ScaleDataValue);
      startValue?: number;
      jitter?: number;
      jitterOverlap?: boolean;
      jitterMargin?: number;
      breaks?: AxisBreakOption[];
      breakArea?: {
          show?: boolean;
          itemStyle?: ItemStyleOption;
          zigzagAmplitude?: number;
          zigzagMinSpan?: number;
          zigzagMaxSpan?: number;
          zigzagZ: number;
          expandOnClick?: boolean;
      };
      breakLabelLayout?: {
          moveOverlap?: 'auto' | boolean;
      };
  }
  interface NumericAxisBaseOptionCommon extends AxisBaseOptionCommon {
      boundaryGap?: [number | string, number | string];
      /**
       * AxisTick and axisLabel and splitLine are calculated based on splitNumber.
       */
      splitNumber?: number;
      /**
       * Interval specifies the span of the ticks is mandatorily.
       */
      interval?: number;
      /**
       * Specify min interval when auto calculate tick interval.
       */
      minInterval?: number;
      /**
       * Specify max interval when auto calculate tick interval.
       */
      maxInterval?: number;
      /**
       * If align ticks to the first axis that is not use alignTicks
       * If all axes has alignTicks: true. The first one will be applied.
       *
       * Will be ignored if interval is set.
       */
      alignTicks?: boolean;
  }
  interface CategoryAxisBaseOption extends AxisBaseOptionCommon {
      type?: 'category';
      boundaryGap?: boolean;
      axisLabel?: AxisLabelOption<'category'>;
      data?: (OrdinalRawValue | {
          value: OrdinalRawValue;
          textStyle?: TextCommonOption;
      })[];
      deduplication?: boolean;
      axisTick?: AxisBaseOptionCommon['axisTick'] & {
          alignWithLabel?: boolean;
          interval?: 'auto' | number | ((index: number, value: string) => boolean);
      };
  }
  interface ValueAxisBaseOption extends NumericAxisBaseOptionCommon {
      type?: 'value';
      axisLabel?: AxisLabelOption<'value'>;
      /**
       * Optional value can be:
       * + `false`: always include value 0.
       * + `true`: the axis may not contain zero position.
       */
      scale?: boolean;
  }
  interface LogAxisBaseOption extends NumericAxisBaseOptionCommon {
      type?: 'log';
      axisLabel?: AxisLabelOption<'log'>;
      logBase?: number;
  }
  interface TimeAxisBaseOption extends NumericAxisBaseOptionCommon {
      type?: 'time';
      axisLabel?: AxisLabelOption<'time'>;
  }
  interface AxisNameTextStyleOption extends LabelCommonOption {
      rich?: RichTextOption;
  }
  interface AxisLineOption {
      show?: boolean | 'auto';
      onZero?: boolean;
      onZeroAxisIndex?: number;
      symbol?: string | [string, string];
      symbolSize?: number[];
      symbolOffset?: string | number | (string | number)[];
      lineStyle?: LineStyleOption;
      breakLine?: boolean;
  }
  interface AxisTickOption {
      show?: boolean | 'auto';
      inside?: boolean;
      length?: number;
      lineStyle?: LineStyleOption;
      customValues?: (number | string | Date)[];
  }
  type AxisLabelValueFormatter = (value: number, index: number, extra: AxisLabelFormatterExtraParams | NullUndefined$1) => string;
  type AxisLabelCategoryFormatter = (value: string, index: number, extra: NullUndefined$1) => string;
  type AxisLabelTimeFormatter = (value: number, index: number, extra: TimeAxisLabelFormatterExtraParams) => string;
  type AxisLabelFormatterExtraParams = {} & AxisLabelFormatterExtraBreakPart;
  type TimeAxisLabelFormatterExtraParams = {
      time: TimeScaleTick['time'];
      /**
       * @deprecated Refactored to `time.level`, and keep it for backward compat,
       *  although `level` is never published in doc since it is introduced.
       */
      level: number;
  } & AxisLabelFormatterExtraParams;
  type TimeAxisLabelLeveledFormatterOption = string[] | string;
  type TimeAxisLabelFormatterUpperDictionaryOption = {
      [key in PrimaryTimeUnit]?: TimeAxisLabelLeveledFormatterOption;
  };
  /**
   * @see {parseTimeAxisLabelFormatterDictionary}
   */
  type TimeAxisLabelFormatterDictionaryOption = {
      [key in PrimaryTimeUnit]?: TimeAxisLabelLeveledFormatterOption | TimeAxisLabelFormatterUpperDictionaryOption;
  };
  type TimeAxisLabelFormatterOption = string | AxisLabelTimeFormatter | TimeAxisLabelFormatterDictionaryOption;
  type LabelFormatters = {
      value: AxisLabelValueFormatter | string;
      log: AxisLabelValueFormatter | string;
      category: AxisLabelCategoryFormatter | string;
      time: TimeAxisLabelFormatterOption;
  };
  type AxisLabelBaseOptionNuance = {
      color?: ColorString | ((value?: string | number, index?: number) => ColorString);
  };
  interface AxisLabelBaseOption extends LabelCommonOption<AxisLabelBaseOptionNuance> {
      show?: boolean;
      inside?: boolean;
      rotate?: number;
      showMinLabel?: boolean;
      showMaxLabel?: boolean;
      alignMinLabel?: TextAlign;
      alignMaxLabel?: TextAlign;
      verticalAlignMinLabel?: TextVerticalAlign;
      verticalAlignMaxLabel?: TextVerticalAlign;
      margin?: number;
      /**
       * If hide overlapping labels.
       */
      hideOverlap?: boolean;
      customValues?: (number | string | Date)[];
  }
  interface AxisLabelOption<TType extends OptionAxisType> extends AxisLabelBaseOption {
      formatter?: LabelFormatters[TType];
      interval?: TType extends 'category' ? ('auto' | number | ((index: number, value: string) => boolean)) : unknown;
  }
  interface MinorTickOption {
      show?: boolean;
      splitNumber?: number;
      length?: number;
      lineStyle?: LineStyleOption;
  }
  interface SplitLineOption {
      show?: boolean;
      interval?: 'auto' | number | ((index: number, value: string) => boolean);
      showMinLine?: boolean;
      showMaxLine?: boolean;
      lineStyle?: LineStyleOption<ZRColor | ZRColor[]>;
  }
  interface MinorSplitLineOption {
      show?: boolean;
      lineStyle?: LineStyleOption;
  }
  interface SplitAreaOption {
      show?: boolean;
      interval?: 'auto' | number | ((index: number, value: string) => boolean);
      areaStyle?: AreaStyleOption<ZRColor[]>;
  }
  type AxisBaseOption = ValueAxisBaseOption | LogAxisBaseOption | CategoryAxisBaseOption | TimeAxisBaseOption;
  
  interface AxisModelCommonMixin<Opt extends AxisBaseOption> extends Pick<Model<Opt>, 'option'> {
      axis: Axis;
  }
  class AxisModelCommonMixin<Opt extends AxisBaseOption> {
      getNeedCrossZero(): boolean;
      /**
       * Should be implemented by each axis model if necessary.
       * @return coordinate system model
       */
      getCoordSysModel(): CoordinateSystemHostModel;
  }
  
  class OrdinalMeta {
      readonly categories: OrdinalRawValue[];
      private _needCollect;
      private _deduplication;
      private _map;
      private _onCollect;
      readonly uid: number;
      /**
       * PENDING - Regarding forcibly converting to string:
       *  In the early days, the underlying hash map impl used JS plain object and converted the key to
       *  string; later in https://github.com/ecomfe/zrender/pull/966 it was changed to a JS Map (in supported
       *  platforms), which does not require string keys. But consider any input that `scale/Ordinal['parse']`
       *  is involved, a number input represents an `OrdinalNumber` (i.e., an index), and affect the query
       *  behavior:
       *    - If forcbily converting to string:
       *      pros: users can use numeric string (such as, '123') to query the raw data (123), tho it's probably
       *      still confusing.
       *      cons: NaN/null/undefined in data will be equals to 'NaN'/'null'/'undefined', if simply using
       *      `val + ''` to convert them, like currently `getName` does.
       *    - Otherwise:
       *      pros: see NaN/null/undefined case above.
       *      cons: users cannot query the raw data (123) any more.
       *  There are two inconsistent behaviors in the current impl:
       *    - Force conversion is applied on the case `xAxis{data: ['aaa', 'bbb', ...]}`,
       *      but no conversion applied to the case `xAxis{data: [{value: 'aaa'}, ...]}` and
       *      the case `dataset: {source: [['aaa', 123], ['bbb', 234], ...]}`.
       *    - behaves differently according to whether JS Map is supported (the polyfill is simply using JS
       *      plain object) (tho it seems rare platform that do not support it).
       *  Since there's no sufficient good solution to offset cost of the breaking change, we preserve the
       *  current behavior, until real issues is reported.
       */
      constructor(opt: {
          categories?: OrdinalRawValue[];
          needCollect?: boolean;
          deduplication?: boolean;
          onCollect?: OrdinalMeta['_onCollect'];
      });
      static createByAxisModel(axisModel: Model): OrdinalMeta;
      getOrdinal(category: OrdinalRawValue): OrdinalNumber;
      /**
       * @return The ordinal. If not found, return NaN.
       */
      parseAndCollect(category: OrdinalRawValue | OrdinalNumber): OrdinalNumber;
      private _getOrCreateMap;
  }
  
  function registerImpl(name: string, impl: any): void;
  
  type MarkerStatisticType = 'average' | 'min' | 'max' | 'median';
  /**
   * Option to specify where to put the marker.
   */
  interface MarkerPositionOption {
      x?: number | string;
      y?: number | string;
      relativeTo?: 'container' | 'coordinate';
      /**
       * Coord on any coordinate system
       */
      coord?: (ScaleDataValue | MarkerStatisticType)[];
      xAxis?: ScaleDataValue;
      yAxis?: ScaleDataValue;
      radiusAxis?: ScaleDataValue;
      angleAxis?: ScaleDataValue;
      type?: MarkerStatisticType;
      /**
       * When using statistic method with type.
       * valueIndex and valueDim can be specify which dim the statistic is used on.
       */
      valueIndex?: number;
      valueDim?: string;
      /**
       * Value to be displayed as label. Totally optional
       */
      value?: string | number;
  }
  interface MarkerOption extends ComponentOption, AnimationOptionMixin {
      silent?: boolean;
      data?: unknown[];
      tooltip?: CommonTooltipOption<unknown> & {
          trigger?: 'item' | 'axis' | boolean | 'none';
      };
  }
  
  interface MarkAreaStateOption {
      itemStyle?: ItemStyleOption;
      label?: SeriesLabelOption;
      z2?: number;
  }
  interface MarkAreaDataItemOptionBase extends MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption, StatesMixinBase> {
      name?: string;
  }
  interface MarkArea1DDataItemOption extends MarkAreaDataItemOptionBase {
      xAxis?: number;
      yAxis?: number;
      type?: MarkerStatisticType;
      valueIndex?: number;
      valueDim?: string;
  }
  interface MarkArea2DDataItemDimOption extends MarkAreaDataItemOptionBase, MarkerPositionOption {
  }
  type MarkArea2DDataItemOption = [
      MarkArea2DDataItemDimOption,
      MarkArea2DDataItemDimOption
  ];
  interface MarkAreaOption extends MarkerOption, MarkAreaStateOption, StatesOptionMixin<MarkAreaStateOption, StatesMixinBase> {
      mainType?: 'markArea';
      precision?: number;
      data?: (MarkArea1DDataItemOption | MarkArea2DDataItemOption)[];
  }
  
  const dimPermutations: readonly [readonly ["x0", "y0"], readonly ["x1", "y0"], readonly ["x1", "y1"], readonly ["x0", "y1"]];
  
  interface BaseBarSeriesOption<StateOption, ExtraStateOption extends StatesMixinBase = DefaultStatesMixin> extends SeriesOption$1<StateOption, ExtraStateOption>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin {
      /**
       * Min height of bar
       */
      barMinHeight?: number;
      /**
       * Min angle of bar. Available on polar coordinate system.
       */
      barMinAngle?: number;
      /**
       * Max width of bar. Defaults to 1 on cartesian coordinate system. Otherwise it's null.
       */
      barMaxWidth?: number | string;
      barMinWidth?: number | string;
      /**
       * Bar width. Will be calculated automatically.
       * Can be pixel width or percent string.
       */
      barWidth?: number | string;
      /**
       * Gap between each bar inside category. Default to be 30%. Can be an aboslute pixel value
       */
      barGap?: string | number;
      /**
       * @private
       */
      defaultBarGap?: string | number;
      /**
       * Gap between each category. Default to be 20%. can be an absolute pixel value.
       */
      barCategoryGap?: string | number;
      large?: boolean;
      largeThreshold?: number;
  }
  
  /**
   * @file The fasade of scale break.
   *  Separate the impl to reduce code size.
   *
   * @caution
   *  Must not import `scale/breakImpl.ts` directly or indirectly.
   *  Must not implement anything in this file.
   */
  interface ScaleBreakContext {
      readonly breaks: ParsedAxisBreakList;
      setBreaks(parsed: AxisBreakParsingResult): void;
      update(scaleExtent: [number, number]): void;
      hasBreaks(): boolean;
      calcNiceTickMultiple(tickVal: number, estimateNiceMultiple: (tickVal: number, brkEnd: number) => number): number;
      getExtentSpan(): number;
      normalize(val: number): number;
      scale(val: number): number;
      elapse(val: number): number;
      unelapse(elapsedVal: number): number;
  }
  type AxisBreakParsingResult = {
      breaks: ParsedAxisBreakList;
  };
  /**
   * Whether to remove any normal ticks that are too close to axis breaks.
   *  - 'auto': Default. Remove any normal ticks that are too close to axis breaks.
   *  - 'no': Do nothing pruning.
   *  - 'exclude_scale_bound': Prune but keep scale extent boundary.
   * For example:
   *  - For splitLine, if remove the tick on extent, split line on the bounary of cartesian
   *   will not be displayed, causing werid effect.
   *  - For labels, scale extent boundary should be pruned if in break, otherwise duplicated
   *   labels will displayed.
   */
  type ParamPruneByBreak = 'auto' | 'no' | 'preserve_extent_bound' | NullUndefined$1;
  
  class ScaleCalculator {
      normalize: (val: number, extent: [number, number]) => number;
      scale: (val: number, extent: [number, number]) => number;
      updateMethods(brkCtx: ScaleBreakContext): void;
  }
  
  interface ScaleRawExtentResult {
      readonly min: number;
      readonly max: number;
      readonly minFixed: boolean;
      readonly maxFixed: boolean;
      readonly isBlank: boolean;
  }
  class ScaleRawExtentInfo {
      private _needCrossZero;
      private _isOrdinal;
      private _axisDataLen;
      private _boundaryGapInner;
      private _modelMinRaw;
      private _modelMaxRaw;
      private _modelMinNum;
      private _modelMaxNum;
      private _dataMin;
      private _dataMax;
      private _determinedMin;
      private _determinedMax;
      readonly frozen: boolean;
      constructor(scale: Scale, model: AxisBaseModel, originalExtent: number[]);
      /**
       * Parameters depending on outside (like model, user callback)
       * are prepared and fixed here.
       */
      private _prepareParams;
      /**
       * Calculate extent by prepared parameters.
       * This method has no external dependency and can be called duplicatedly,
       * getting the same result.
       * If parameters changed, should call this method to recalcuate.
       */
      calculate(): ScaleRawExtentResult;
      modifyDataMinMax(minMaxName: 'min' | 'max', val: number): void;
      setDeterminedMinMax(minMaxName: 'min' | 'max', val: number): void;
      freeze(): void;
  }
  
  type ScaleGetTicksOpt = {
      expandToNicedExtent?: boolean;
      pruneByBreak?: ParamPruneByBreak;
      breakTicks?: 'only_break' | 'none' | NullUndefined$1;
  };
  type ScaleSettingDefault = Dictionary<unknown>;
  abstract class Scale<SETTING extends ScaleSettingDefault = ScaleSettingDefault> {
      type: string;
      private _setting;
      protected _extent: [number, number];
      protected _brkCtx: ScaleBreakContext | NullUndefined$1;
      protected _calculator: ScaleCalculator;
      private _isBlank;
      readonly rawExtentInfo: ScaleRawExtentInfo;
      constructor(setting?: SETTING);
      getSetting<KEY extends keyof SETTING>(name: KEY): SETTING[KEY];
      /**
       * Parse input val to valid inner number.
       * Notice: This would be a trap here, If the implementation
       * of this method depends on extent, and this method is used
       * before extent set (like in dataZoom), it would be wrong.
       * Nevertheless, parse does not depend on extent generally.
       */
      abstract parse(val: ScaleDataValue): number;
      /**
       * Whether contain the given value.
       */
      abstract contain(val: number): boolean;
      /**
       * Normalize value to linear [0, 1], return 0.5 if extent span is 0.
       */
      abstract normalize(val: number): number;
      /**
       * Scale normalized value to extent.
       */
      abstract scale(val: number): number;
      /**
       * [CAVEAT]: It should not be overridden!
       */
      _innerUnionExtent(other: [number, number]): void;
      /**
       * Set extent from data
       */
      unionExtentFromData(data: SeriesData, dim: DimensionName | DimensionLoose): void;
      /**
       * Get a new slice of extent.
       * Extent is always in increase order.
       */
      getExtent(): [number, number];
      setExtent(start: number, end: number): void;
      /**
       * [CAVEAT]: It should not be overridden!
       */
      protected _innerSetExtent(start: number, end: number): void;
      /**
       * Prerequisite: Scale#parse is ready.
       */
      setBreaksFromOption(breakOptionList: AxisBreakOption[]): void;
      /**
       * [CAVEAT]: It should not be overridden!
       */
      _innerSetBreak(parsed: AxisBreakParsingResult): void;
      /**
       * [CAVEAT]: It should not be overridden!
       */
      _innerGetBreaks(): ParsedAxisBreakList;
      /**
       * Do not expose the internal `_breaks` unless necessary.
       */
      hasBreaks(): boolean;
      protected _getExtentSpanWithBreaks(): number;
      /**
       * If value is in extent range
       */
      isInExtentRange(value: number): boolean;
      /**
       * When axis extent depends on data and no data exists,
       * axis ticks should not be drawn, which is named 'blank'.
       */
      isBlank(): boolean;
      /**
       * When axis extent depends on data and no data exists,
       * axis ticks should not be drawn, which is named 'blank'.
       */
      setBlank(isBlank: boolean): void;
      /**
       * Update interval and extent of intervals for nice ticks
       *
       * @param splitNumber Approximated tick numbers. Optional.
       *        The implementation of `niceTicks` should decide tick numbers
       *        whether `splitNumber` is given.
       * @param minInterval Optional.
       * @param maxInterval Optional.
       */
      abstract calcNiceTicks(splitNumber?: number, minInterval?: number, maxInterval?: number): void;
      abstract calcNiceExtent(opt?: {
          splitNumber?: number;
          fixMin?: boolean;
          fixMax?: boolean;
          minInterval?: number;
          maxInterval?: number;
      }): void;
      /**
       * @return label of the tick.
       */
      abstract getLabel(tick: ScaleTick): string;
      abstract getTicks(opt?: ScaleGetTicksOpt): ScaleTick[];
      abstract getMinorTicks(splitNumber: number): number[][];
      static registerClass: ClassManager['registerClass'];
      static getClass: ClassManager['getClass'];
  }
  
  /**
   * @see {getLayoutRect}
   */
  interface LayoutRect extends BoundingRect {
      margin: number[];
  }
  type GetLayoutRectInputContainerRect = {
      x?: number;
      y?: number;
      width: number;
      height: number;
  };
  /**
   * Parse position info.
   */
  function getLayoutRect(positionInfo: BoxLayoutOptionMixin & {
      aspect?: number;
  }, containerRect: GetLayoutRectInputContainerRect, margin?: number | number[]): LayoutRect;
  
  interface GridOption extends ComponentOption, BoxLayoutOptionMixin, ShadowOptionMixin {
      mainType?: 'grid';
      show?: boolean;
      /**
       * @deprecated Use `grid.outerBounds` instead.
       * Whether grid size contains axis labels. This approach estimates the size by sample labels.
       * It works for most case but it does not strictly contain all labels in some cases.
       */
      containLabel?: boolean;
      /**
       * Define a constrains rect.
       * Axis lines is firstly laid out based on the rect defined by `grid.left/right/top/bottom/width/height`.
       * (for axis line alignment requirements between multiple grids)
       * But if axisLabel and/or axisName overflow the outerBounds, shrink the layout to avoid that overflow.
       *
       * Options:
       *  - 'none': outerBounds is infinity.
       *  - 'same': outerBounds is the same as the layout rect defined by `grid.left/right/top/bottom/width/height`.
       *  - 'auto'/null/undefined: Default. Use `outerBounds`, or 'same' if `containLabel:true`.
       *
       * Note:
       *  `grid.containLabel` is equivalent to `{outerBoundsMode: 'same', outerBoundsContain: 'axisLabel'}`.
       */
      outerBoundsMode?: 'auto' | NullUndefined$1 | 'same' | 'none';
      /**
       * {left, right, top, bottom, width, height}: Define a outerBounds rect, based on:
       *  - the canvas by default.
       *  - or the `dataToLayout` result if a `boxCoordinateSystem` is specified.
       */
      outerBounds?: BoxLayoutOptionMixin;
      /**
       * - 'all': Default. Contains the cartesian rect and axis labels and axis name.
       * - 'axisLabel': Contains the cartesian rect and axis labels. This effect differs slightly from the
       *  previous option `containLabel` but more precise.
       * - 'auto'/null/undefined: Default. be 'axisLabel' if `containLabel:true`, otherwise 'all'.
       */
      outerBoundsContain?: 'all' | 'axisLabel' | 'auto' | NullUndefined$1;
      /**
       * Available only when `outerBoundsMode` is not 'none'.
       * Offer a constraint to not to shrink the grid rect causing smaller that width/height.
       * A string means percent, like '30%', based on the original rect size
       *  determined by `grid.top/right/bottom/left/width/height`.
       */
      outerBoundsClampWidth?: number | string;
      outerBoundsClampHeight?: number | string;
      backgroundColor?: ZRColor;
      borderWidth?: number;
      borderColor?: ZRColor;
      tooltip?: any;
  }
  
  type CartesianAxisPosition = 'top' | 'bottom' | 'left' | 'right';
  type CartesianAxisOption = AxisBaseOption & {
      gridIndex?: number;
      gridId?: string;
      position?: CartesianAxisPosition;
      offset?: number;
      categorySortInfo?: OrdinalSortInfo;
  };
  type XAXisOption = CartesianAxisOption & {
      mainType?: 'xAxis';
  };
  type YAXisOption = CartesianAxisOption & {
      mainType?: 'yAxis';
  };
  
  type AngleAxisOption = AxisBaseOption & {
      mainType?: 'angleAxis';
      /**
       * Index of host polar component
       */
      polarIndex?: number;
      /**
       * Id of host polar component
       */
      polarId?: string;
      startAngle?: number;
      endAngle?: number;
      clockwise?: boolean;
      axisLabel?: AxisBaseOption['axisLabel'];
  };
  type RadiusAxisOption = AxisBaseOption & {
      mainType?: 'radiusAxis';
      /**
       * Index of host polar component
       */
      polarIndex?: number;
      /**
       * Id of host polar component
       */
      polarId?: string;
  };
  
  interface PolarOption extends ComponentOption, CircleLayoutOptionMixin {
      mainType?: 'polar';
  }
  
  /**
   * BrushController is not only used in "brush component",
   * but is also used in "tooltip DataZoom", and other possible
   * further brush behavior related scenarios.
   * So `BrushController` should not depend on "brush component model".
   */
  type BrushType = 'polygon' | 'rect' | 'lineX' | 'lineY';
  /**
   * Only for drawing (after enabledBrush).
   * 'line', 'rect', 'polygon' or false
   * If passing false/null/undefined, disable brush.
   * If passing 'auto', determined by panel.defaultBrushType
   */
  type BrushTypeUncertain = BrushType | false | 'auto';
  type BrushMode = 'single' | 'multiple';
  type BrushDimensionMinMax = number[];
  type BrushAreaRange = BrushDimensionMinMax | BrushDimensionMinMax[];
  interface BrushCoverConfig {
      brushType: BrushType;
      id?: string;
      range?: BrushAreaRange;
      panelId?: string;
      brushMode?: BrushMode;
      brushStyle?: Pick<PathStyleProps, BrushStyleKey>;
      transformable?: boolean;
      removeOnClick?: boolean;
      z?: number;
  }
  type BrushStyleKey = 'fill' | 'stroke' | 'lineWidth' | 'opacity' | 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowColor';
  
  interface RadarIndicatorOption {
      name?: string;
      /**
       * @deprecated Use `name` instead.
       */
      text?: string;
      min?: number;
      max?: number;
      color?: ColorString;
      axisType?: 'value' | 'log';
  }
  interface RadarOption extends ComponentOption, CircleLayoutOptionMixin {
      mainType?: 'radar';
      startAngle?: number;
      shape?: 'polygon' | 'circle';
      axisLine?: AxisBaseOption['axisLine'];
      axisTick?: AxisBaseOption['axisTick'];
      axisLabel?: AxisBaseOption['axisLabel'];
      splitLine?: AxisBaseOption['splitLine'];
      splitArea?: AxisBaseOption['splitArea'];
      axisName?: {
          show?: boolean;
          formatter?: string | ((name?: string, indicatorOpt?: InnerIndicatorAxisOption) => string);
      } & LabelOption;
      axisNameGap?: number;
      triggerEvent?: boolean;
      scale?: boolean;
      splitNumber?: number;
      boundaryGap?: CategoryAxisBaseOption['boundaryGap'] | ValueAxisBaseOption['boundaryGap'];
      indicator?: RadarIndicatorOption[];
  }
  type InnerIndicatorAxisOption = AxisBaseOption & {
      showName?: boolean;
  };
  
  type SingleAxisPosition = 'top' | 'bottom' | 'left' | 'right';
  type SingleAxisOption = AxisBaseOption & BoxLayoutOptionMixin & {
      mainType?: 'singleAxis';
      position?: SingleAxisPosition;
      orient?: LayoutOrient;
  };
  
  type ParallelLayoutDirection = 'horizontal' | 'vertical';
  interface ParallelCoordinateSystemOption extends ComponentOption, BoxLayoutOptionMixin {
      mainType?: 'parallel';
      layout?: ParallelLayoutDirection;
      axisExpandable?: boolean;
      axisExpandCenter?: number;
      axisExpandCount?: number;
      axisExpandWidth?: number;
      axisExpandTriggerOn?: 'click' | 'mousemove';
      axisExpandRate?: number;
      axisExpandDebounce?: number;
      axisExpandSlideTriggerArea?: [number, number, number];
      axisExpandWindow?: number[];
      parallelAxisDefault?: ParallelAxisOption;
  }
  
  type ParallelAxisOption = AxisBaseOption & {
      /**
       * 0, 1, 2, ...
       */
      dim?: number | number[];
      parallelIndex?: number;
      areaSelectStyle?: {
          width?: number;
          borderWidth?: number;
          borderColor?: ZRColor;
          color?: ZRColor;
          opacity?: number;
      };
      realtime?: boolean;
  };
  
  interface CalendarMonthLabelFormatterCallbackParams {
      nameMap: string;
      yyyy: string;
      yy: string;
      /**
       * Month string. With 0 prefix.
       */
      MM: string;
      /**
       * Month number
       */
      M: number;
  }
  interface CalendarYearLabelFormatterCallbackParams {
      nameMap: string;
      /**
       * Start year
       */
      start: string;
      /**
       * End year
       */
      end: string;
  }
  interface CalendarOption extends ComponentOption, BoxLayoutOptionMixin {
      mainType?: 'calendar';
      cellSize?: number | 'auto' | (number | 'auto')[];
      orient?: LayoutOrient;
      splitLine?: {
          show?: boolean;
          lineStyle?: LineStyleOption;
      };
      itemStyle?: ItemStyleOption;
      /**
       * // one year
       * range: 2017
       * // one month
       * range: '2017-02'
       * //  a range
       * range: ['2017-01-02', '2017-02-23']
       * // note: they will be identified as ['2017-01-01', '2017-02-01']
       * range: ['2017-01', '2017-02']
       */
      range?: OptionDataValueDate | (OptionDataValueDate)[];
      dayLabel?: Omit<LabelOption, 'position'> & {
          /**
           * First day of week.
           */
          firstDay?: number;
          /**
           * Margin between day label and axis line.
           * Can be percent string of cell size.
           */
          margin?: number | string;
          /**
           * Position of week, at the beginning or end of the range.
           */
          position?: 'start' | 'end';
          /**
           * Week text content
           *
           * defaults to auto-detected locale by the browser or the specified locale by `echarts.init` function.
           * It supports any registered locale name (case-sensitive) or customized array.
           * index 0 always means Sunday.
           */
          nameMap?: string | string[];
      };
      monthLabel?: Omit<LabelOption, 'position'> & {
          /**
           * Margin between month label and axis line.
           */
          margin?: number;
          /**
           * Position of month label, at the beginning or end of the range.
           */
          position?: 'start' | 'end';
          /**
           * Month text content
           *
           * defaults to auto-detected locale by the browser or the specified locale by `echarts.init` function.
           * It supports any registered locale name (case-sensitive) or customized array.
           * index 0 always means Jan.
           */
          nameMap?: string | string[];
          formatter?: string | ((params: CalendarMonthLabelFormatterCallbackParams) => string);
      };
      yearLabel?: Omit<LabelOption, 'position'> & {
          /**
           * Margin between year label and axis line.
           */
          margin?: number;
          /**
           * Position of year label, at the beginning or end of the range.
           */
          position?: 'top' | 'bottom' | 'left' | 'right';
          formatter?: string | ((params: CalendarYearLabelFormatterCallbackParams) => string);
      };
  }
  
  const MatrixCellLayoutInfoType: {
      readonly level: 1;
      readonly leaf: 2;
      readonly nonLeaf: 3;
  };
  type MatrixCellLayoutInfoType = (typeof MatrixCellLayoutInfoType)[keyof typeof MatrixCellLayoutInfoType];
  
  interface MatrixCellLayoutInfo {
      type: MatrixCellLayoutInfoType;
      id: Point;
      xy: number;
      wh: number;
      dim: MatrixDim;
  }
  type MatrixXYLocator = MatrixCellLayoutInfo['id']['x'] | MatrixCellLayoutInfo['id']['y'];
  interface MatrixDimensionCell extends MatrixCellLayoutInfo {
      span: Point;
      level: number;
      firstLeafLocator: MatrixXYLocator;
      ordinal: OrdinalNumber;
      option: MatrixDimensionCellOption;
      rect: RectLike;
  }
  /**
   * Computed properties of a certain tree level.
   * In most cases this is used to describe level size or locate corner cells.
   */
  interface MatrixDimensionLevelInfo extends MatrixCellLayoutInfo {
      option: MatrixDimensionLevelOption | NullUndefined$1;
  }
  /**
   * Lifetime: the same with `MatrixModel`, but different from `coord/Matrix`.
   */
  class MatrixDim {
      readonly dim: 'x' | 'y';
      readonly dimIdx: number;
      private _cells;
      private _levels;
      private _leavesCount;
      private _model;
      private _ordinalMeta;
      private _scale;
      private _uniqueValueGen;
      constructor(dim: 'x' | 'y', dimModel: MatrixDimensionModel);
      private _initByDimModelData;
      private _initBySeriesData;
      private _setCellId;
      private _initCellsId;
      private _initLevelIdOptions;
      shouldShow(): boolean;
      /**
       * Iterate leaves (they are layout units) if dimIdx === this.dimIdx.
       * Iterate levels if dimIdx !== this.dimIdx.
       */
      resetLayoutIterator(it: ListIterator<MatrixCellLayoutInfo> | NullUndefined$1, dimIdx: number, startLocator?: MatrixXYLocator | NullUndefined$1, count?: number | NullUndefined$1): ListIterator<MatrixCellLayoutInfo>;
      resetCellIterator(it?: ListIterator<MatrixDimensionCell>): ListIterator<MatrixDimensionCell>;
      resetLevelIterator(it?: ListIterator<MatrixDimensionLevelInfo>): ListIterator<MatrixDimensionLevelInfo>;
      getLayout(outRect: RectLike, dimIdx: number, locator: MatrixXYLocator): void;
      /**
       * Get leaf cell or get level info.
       * Should be able to return null/undefined if not found on x or y, thus input `dimIdx` is needed.
       */
      getUnitLayoutInfo(dimIdx: number, locator: MatrixXYLocator): MatrixCellLayoutInfo | NullUndefined$1;
      /**
       * Get dimension cell by data, including leaves and non-leaves.
       */
      getCell(value: MatrixCoordValueOption): MatrixDimensionCell | NullUndefined$1;
      /**
       * Get leaf count or get level count.
       */
      getLocatorCount(dimIdx: number): number;
      getOrdinalMeta(): OrdinalMeta;
  }
  
  interface MatrixOption extends ComponentOption, BoxLayoutOptionMixin {
      mainType?: 'matrix';
      x?: MatrixDimensionOption;
      y?: MatrixDimensionOption;
      body?: MatrixBodyOption;
      corner?: MatrixCornerOption;
      backgroundStyle?: ItemStyleOption;
      borderZ2?: number;
      tooltip?: CommonTooltipOption<MatrixTooltipFormatterParams>;
  }
  interface MatrixBodyCornerBaseOption extends MatrixCellStyleOption {
      /**
       * Only specify some special cell definitions.
       * It can represent both body cells and top-left corner cells.
       *
       * [body/corner cell locating]:
       *  The rule is uniformly applied, such as, in `matrix.dataToPoint`
       *  and `matrix.dataToLayout` and `xxxComponent.coord`.
       *  Suppose the matrix.x/y dimensions (header) are defined as:
       *  matrix: {
       *      x: [{ value: 'Xa0', children: ['Xb0', 'Xb1'] }, 'Xa1'],
       *      y: [{ value: 'Ya0', children: ['Yb0', 'Yb1'] }],
       *  }
       *  -----------------------------------------
       *  |       |       |     Xa0       |       |
       *  |-------+-------+---------------|  Xa1  |
       *  |cornerQ|cornerP|  Xb0  |  Xb1  |       |
       *  |-------+-------+-------+-------+--------
       *  |       |  Yb0  | bodyR | bodyS |       |
       *  |  Ya0  |-------+-------+---------------|
       *  |       |  Yb1  |       |     bodyT     |
       *  |---------------|------------------------
       *  "Locator number" (`MatrixXYLocator`):
       *    The term `locator` refers to a integer number to locate cells on x or y direction.
       *    Use the top-left cell of the body as the origin point (0, 0),
       *      the non-negative locator indicates the right/bottom of the origin point;
       *      the negative locator indicates the left/top of the origin point.
       *  "Ordinal number" (`OrdinalNumber`):
       *    This term follows the same meaning as that in category axis of cartesian. They are
       *    non-negative integer, designating each string `matrix.x.data[i].value`/`matrix.y.data[i].value`.
       *    'Xb0', 'Xb2', 'Xa1', 'Xa0' are assigned with the ordinal numbers 0, 1, 2, 3.
       *    For every leaf dimension cell, `OrdinalNumber` and `MatrixXYLocator` is the same.
       *
       *  A cell or pixel point or rect can be determined/located by a pair of `MatrixCoordValueOption`.
       *  See also `MatrixBodyCornerCellOption['coord']`.
       *
       *  - The body cell `bodyS` above can be located by:
       *      - `coord: [1, 0]` (`MatrixXYLocator` or `OrdinalNumber`, which is a non-negative integer)
       *      - `coord: ['Xb1', 'Yb0']`
       *      - `coord: ['Xb1', 0]` (mix them)
       *  - The corner cell `cornerQ` above can be located by:
       *      - `coord: [-2, -1]` (negative `MatrixXYLocator`)
       *      - But it is NOT supported to use `coord: ['Y1_0', 'X1_0']` (XY transposed form) here.
       *        It's mathematically sound, but may introduce confusion and unnecessary
       *        complexity (consider the 'Xa1' case), and corner locating is not frequently used.
       *  - `mergeCells`: Body cells or corner cells can be merged, such as "bodyT" above, an input
       *      - The merging can be defined by:
       *        `matrix.data[i]: {coord: [['Xb1', 'Xa1'], 'Yb0'], mergeCells: true}`.
       *      - Input `['Xa1', 'Yb1']` to `dataToPoint` will get a point in the center of "bodyT".
       *      - Input `['Xa1', 'Yb1']` to `dataToLayout` will get a rect of the "bodyT".
       *  - If inputing a non-leaf dimension cell to locate, such as `['Xa0', 'Yb0']`,
       *      - it returns only according to the center of the dimension cells, regardless of the body span.
       *        (therefore, the result can be on the boundary of two body cells.)
       *        And the oridinal number assigned to 'Xa0' is 3, thus input `[3, 'Yb0']` get the some result.
       *  - The dimension (header) cell can be located by negative `MatrixXYLocator`. For example:
       *      - The center of the node 'Ya0' can be located by `[-2, 'Ya0']`.
       */
      data?: MatrixBodyCornerCellOption[];
  }
  interface MatrixBodyOption extends MatrixBodyCornerBaseOption {
  }
  interface MatrixCornerOption extends MatrixBodyCornerBaseOption {
  }
  /**
   * Commonly used as `MatrixCoordRangeOption[]`
   * Can locate a cell or a rect range of cells.
   * `[2, 8]` indicates a cell.
   * `[2, null/undefined/NaN]` means y is not relevant.
   * `[null/undefined/NaN, 8]` means x is not relevant.
   * `[[2, 5], 8]` indicates a rect of cells in x range of `2~5` and y `8`.
   * `[[2, 5], null/undefined/NaN]` indicates a x range of `2~5` and y is not relevant.
   * `[[2, 5], [7, 8]]` indicates a rect of cells in x range of `2~5` and y range of `7~8`.
   * `['aNonLeaf', 8]` indicates a rect of cells in x range of `aNonLeaf` and y `8`.
   * @see {parseCoordRangeOption}
   * @see {MatrixBodyCornerBaseOption['data']}
   */
  type MatrixCoordRangeOption = (MatrixCoordValueOption | MatrixCoordValueOption[] | NullUndefined$1);
  /**
   * `OrdinalRawValue` is originally provided by `matrix.x/y.data[i].value` or `series.data`.
   */
  type MatrixCoordValueOption = OrdinalRawValue | OrdinalNumber | MatrixXYLocator;
  interface MatrixBaseCellOption extends MatrixCellStyleOption {
  }
  interface MatrixBodyCornerCellOption extends MatrixBaseCellOption {
      value?: string;
      coord?: MatrixCoordRangeOption[];
      coordClamp?: boolean;
      mergeCells?: boolean;
  }
  interface MatrixDimensionOption extends MatrixCellStyleOption, MatrixDimensionLevelOption {
      type?: 'category';
      show?: boolean;
      data?: MatrixDimensionCellLooseOption[];
      levels?: (MatrixDimensionLevelOption | NullUndefined$1)[];
      dividerLineStyle?: LineStyleOption;
  }
  interface MatrixDimensionCellOption extends MatrixBaseCellOption {
      value?: string;
      size?: PositionSizeOption;
      children?: MatrixDimensionCellOption[];
  }
  type MatrixDimensionCellLooseOption = MatrixDimensionCellOption | MatrixDimensionCellOption['value'];
  interface MatrixDimensionLevelOption {
      levelSize?: PositionSizeOption;
  }
  /**
   * Two levels of cascade inheritance:
   *  - priority-high: style options defined in `matrix.x/y/coner/body.data[i]` (in cell)
   *  - priority-low: style options defined in `matrix.x/y/coner/body`
   */
  interface MatrixCellStyleOption {
      label?: LabelOption;
      itemStyle?: ItemStyleOption;
      cursor?: string;
      silent?: boolean | NullUndefined$1;
      z2?: number;
  }
  interface MatrixTooltipFormatterParams {
      componentType: 'matrix';
      matrixIndex: number;
      name: string;
      $vars: ['name', 'xyLocator'];
  }
  interface MatrixDimensionModel extends Model<MatrixDimensionOption> {
  }
  class MatrixDimensionModel extends Model<MatrixDimensionOption> {
      dim: MatrixDim;
      getOrdinalMeta(): OrdinalMeta;
  }
  
  type IconStyle = ItemStyleOption & {
      textFill?: LabelOption['color'];
      textBackgroundColor?: LabelOption['backgroundColor'];
      textPosition?: LabelOption['position'];
      textAlign?: LabelOption['align'];
      textBorderRadius?: LabelOption['borderRadius'];
      textPadding?: LabelOption['padding'];
      textFontFamily?: LabelOption['fontFamily'];
      textFontSize?: LabelOption['fontSize'];
      textFontWeight?: LabelOption['fontWeight'];
      textFontStyle?: LabelOption['fontStyle'];
  };
  interface ToolboxFeatureOption {
      show?: boolean;
      title?: string | Partial<Dictionary<string>>;
      icon?: string | Partial<Dictionary<string>>;
      iconStyle?: IconStyle;
      emphasis?: {
          iconStyle?: IconStyle;
      };
      iconStatus?: Partial<Dictionary<DisplayState>>;
      onclick?: () => void;
  }
  
  interface ToolboxTooltipFormatterParams {
      componentType: 'toolbox';
      name: string;
      title: string;
      $vars: ['name', 'title'];
  }
  interface ToolboxOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
      mainType?: 'toolbox';
      show?: boolean;
      orient?: LayoutOrient;
      backgroundColor?: ZRColor;
      borderRadius?: number | number[];
      padding?: number | number[];
      itemSize?: number;
      itemGap?: number;
      showTitle?: boolean;
      iconStyle?: ItemStyleOption;
      emphasis?: {
          iconStyle?: ItemStyleOption;
      };
      textStyle?: LabelOption;
      tooltip?: CommonTooltipOption<ToolboxTooltipFormatterParams>;
      /**
       * Write all supported features in the final export option.
       */
      feature?: Partial<Dictionary<ToolboxFeatureOption>>;
  }
  
  interface MapperParamAxisInfo {
      axisIndex: number;
      axisName: string;
      axisId: string;
      axisDim: string;
  }
  interface AxisPointerLink {
      xAxisIndex?: number[] | 'all';
      yAxisIndex?: number[] | 'all';
      xAxisId?: string[];
      yAxisId?: string[];
      xAxisName?: string[] | string;
      yAxisName?: string[] | string;
      radiusAxisIndex?: number[] | 'all';
      angleAxisIndex?: number[] | 'all';
      radiusAxisId?: string[];
      angleAxisId?: string[];
      radiusAxisName?: string[] | string;
      angleAxisName?: string[] | string;
      singleAxisIndex?: number[] | 'all';
      singleAxisId?: string[];
      singleAxisName?: string[] | string;
      mapper?(sourceVal: ScaleDataValue, sourceAxisInfo: MapperParamAxisInfo, targetAxisInfo: MapperParamAxisInfo): CommonAxisPointerOption['value'];
  }
  interface AxisPointerOption extends ComponentOption, Omit<CommonAxisPointerOption, 'type'> {
      mainType?: 'axisPointer';
      type?: 'line' | 'shadow' | 'cross' | 'none';
      link?: AxisPointerLink[];
  }
  
  type TopLevelFormatterParams = CallbackDataParams | CallbackDataParams[];
  interface TooltipOption extends CommonTooltipOption<TopLevelFormatterParams>, ComponentOption {
      mainType?: 'tooltip';
      axisPointer?: AxisPointerOption & {
          axis?: 'auto' | 'x' | 'y' | 'angle' | 'radius';
          crossStyle?: LineStyleOption & {
              textStyle?: LabelOption;
          };
      };
      /**
       * If show popup content
       */
      showContent?: boolean;
      /**
       * Trigger only works on coordinate system.
       */
      trigger?: 'item' | 'axis' | 'none';
      /**
       * 'auto': use html by default, and use non-html if `document` is not defined
       * 'html': use html for tooltip
       * 'richText': use canvas, svg, and etc. for tooltip
       */
      renderMode?: 'auto' | TooltipRenderMode;
      /**
       * @deprecated
       * use appendTo: 'body' instead
       */
      appendToBody?: boolean;
      /**
       * If append the tooltip element to another DOM element.
       * Only available when renderMode is html
       */
      appendTo?: ((chartContainer: HTMLElement) => HTMLElement | undefined | null) | string | HTMLElement;
      /**
       * Specify the class name of tooltip element
       * Only available when renderMode is html
       */
      className?: string;
      /**
       * Default border color to use when there are multiple series
       */
      defaultBorderColor?: string;
      order?: TooltipOrderMode;
  }
  
  interface TitleTextStyleOption extends LabelOption {
      width?: number;
  }
  interface TitleOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
      mainType?: 'title';
      show?: boolean;
      text?: string;
      /**
       * Link to url
       */
      link?: string;
      target?: 'self' | 'blank';
      subtext?: string;
      sublink?: string;
      subtarget?: 'self' | 'blank';
      textAlign?: ZRTextAlign;
      textVerticalAlign?: ZRTextVerticalAlign;
      /**
       * @deprecated Use textVerticalAlign instead
       */
      textBaseline?: ZRTextVerticalAlign;
      backgroundColor?: ZRColor;
      /**
       * Padding between text and border.
       * Support to be a single number or an array.
       */
      padding?: number | number[];
      /**
       * Gap between text and subtext
       */
      itemGap?: number;
      textStyle?: TitleTextStyleOption;
      subtextStyle?: TitleTextStyleOption;
      /**
       * If trigger mouse or touch event
       */
      triggerEvent?: boolean;
      /**
       * Radius of background border.
       */
      borderRadius?: number | number[];
  }
  
  /**
   * [NOTE]: thumbnail is implemented as a component, rather than internal data strucutrue,
   *  due to the possibility of serveing geo and related series with a single thumbnail,
   *  and enable to apply some common layout feature, such as matrix coord sys.
   */
  interface ThumbnailOption extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
      mainType?: 'thumbnail';
      show?: boolean;
      itemStyle?: ItemStyleOption;
      windowStyle?: ItemStyleOption;
      seriesIndex?: number | number[];
      seriesId?: string | string[];
  }
  
  interface TimelineControlStyle extends ItemStyleOption {
      show?: boolean;
      showPlayBtn?: boolean;
      showPrevBtn?: boolean;
      showNextBtn?: boolean;
      itemSize?: number;
      itemGap?: number;
      position?: 'left' | 'right' | 'top' | 'bottom';
      playIcon?: string;
      stopIcon?: string;
      prevIcon?: string;
      nextIcon?: string;
      playBtnSize?: number | string;
      stopBtnSize?: number | string;
      nextBtnSize?: number | string;
      prevBtnSize?: number | string;
  }
  interface TimelineCheckpointStyle extends ItemStyleOption, SymbolOptionMixin {
      animation?: boolean;
      animationDuration?: number;
      animationEasing?: ZREasing;
  }
  interface TimelineLineStyleOption extends LineStyleOption {
      show?: boolean;
  }
  interface TimelineLabelOption extends Omit<LabelOption, 'position'> {
      show?: boolean;
      position?: 'auto' | 'left' | 'right' | 'top' | 'bottom' | number;
      interval?: 'auto' | number;
      formatter?: string | ((value: string | number, index: number) => string);
  }
  interface TimelineDataItemOption extends SymbolOptionMixin {
      value?: OptionDataValue;
      itemStyle?: ItemStyleOption;
      label?: TimelineLabelOption;
      checkpointStyle?: TimelineCheckpointStyle;
      emphasis?: {
          itemStyle?: ItemStyleOption;
          label?: TimelineLabelOption;
          checkpointStyle?: TimelineCheckpointStyle;
      };
      progress?: {
          lineStyle?: TimelineLineStyleOption;
          itemStyle?: ItemStyleOption;
          label?: TimelineLabelOption;
      };
      tooltip?: boolean;
  }
  interface TimelineOption extends ComponentOption, BoxLayoutOptionMixin, SymbolOptionMixin {
      mainType?: 'timeline';
      backgroundColor?: ZRColor;
      borderColor?: ColorString;
      borderWidth?: number;
      tooltip?: CommonTooltipOption<CallbackDataParams> & {
          trigger?: 'item';
      };
      show?: boolean;
      axisType?: 'category' | 'time' | 'value';
      currentIndex?: number;
      autoPlay?: boolean;
      rewind?: boolean;
      loop?: boolean;
      playInterval?: number;
      realtime?: boolean;
      controlPosition?: 'left' | 'right' | 'top' | 'bottom';
      padding?: number | number[];
      orient?: LayoutOrient;
      inverse?: boolean;
      replaceMerge?: GlobalModelSetOptionOpts['replaceMerge'];
      lineStyle?: TimelineLineStyleOption;
      itemStyle?: ItemStyleOption;
      checkpointStyle?: TimelineCheckpointStyle;
      controlStyle?: TimelineControlStyle;
      label?: TimelineLabelOption;
      emphasis?: {
          lineStyle?: TimelineLineStyleOption;
          itemStyle?: ItemStyleOption;
          checkpointStyle?: TimelineCheckpointStyle;
          controlStyle?: TimelineControlStyle;
          label?: TimelineLabelOption;
      };
      progress?: {
          lineStyle?: TimelineLineStyleOption;
          itemStyle?: ItemStyleOption;
          label?: TimelineLabelOption;
      };
      data?: (OptionDataValue | TimelineDataItemOption)[];
  }
  
  interface SliderTimelineOption extends TimelineOption {
  }
  
  type ItemStyleKeys = 'fill' | 'stroke' | 'decal' | 'lineWidth' | 'opacity' | 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowColor' | 'lineDash' | 'lineDashOffset' | 'lineCap' | 'lineJoin' | 'miterLimit';
  type ItemStyleProps = Pick<PathStyleProps, ItemStyleKeys>;
  class ItemStyleMixin {
      getItemStyle(this: Model, excludes?: readonly (keyof ItemStyleOption)[], includes?: readonly (keyof ItemStyleOption)[]): ItemStyleProps;
  }
  
  type LineStyleKeys = 'lineWidth' | 'stroke' | 'opacity' | 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY' | 'shadowColor' | 'lineDash' | 'lineDashOffset' | 'lineCap' | 'lineJoin' | 'miterLimit';
  type LineStyleProps = Pick<PathStyleProps, LineStyleKeys>;
  class LineStyleMixin {
      getLineStyle(this: Model, excludes?: readonly (keyof LineStyleOption)[]): LineStyleProps;
  }
  
  type SelectorType = 'all' | 'inverse';
  interface LegendSelectorButtonOption {
      type?: SelectorType;
      title?: string;
  }
  /**
   * T: the type to be extended
   * ET: extended type for keys of T
   * ST: special type for T to be extended
   */
  type ExtendPropertyType<T, ET, ST extends {
      [key in keyof T]: any;
  }> = {
      [key in keyof T]: key extends keyof ST ? T[key] | ET | ST[key] : T[key] | ET;
  };
  interface LegendItemStyleOption extends ExtendPropertyType<ItemStyleOption, 'inherit', {
      borderWidth: 'auto';
  }> {
  }
  interface LegendLineStyleOption extends ExtendPropertyType<LineStyleOption, 'inherit', {
      width: 'auto';
  }> {
      inactiveColor?: ColorString;
      inactiveWidth?: number;
  }
  interface LegendStyleOption {
      /**
       * Icon of the legend items.
       * @default 'roundRect'
       */
      icon?: string;
      /**
       * Color when legend item is not selected
       */
      inactiveColor?: ColorString;
      /**
       * Border color when legend item is not selected
       */
      inactiveBorderColor?: ColorString;
      /**
       * Border color when legend item is not selected
       */
      inactiveBorderWidth?: number | 'auto';
      /**
       * Legend label formatter
       */
      formatter?: string | ((name: string) => string);
      itemStyle?: LegendItemStyleOption;
      lineStyle?: LegendLineStyleOption;
      textStyle?: LabelOption;
      symbolRotate?: number | 'inherit';
      /**
       * @deprecated
       */
      symbolKeepAspect?: boolean;
  }
  interface DataItem extends LegendStyleOption {
      name?: string;
      icon?: string;
      textStyle?: LabelOption;
      tooltip?: unknown;
  }
  interface LegendTooltipFormatterParams {
      componentType: 'legend';
      legendIndex: number;
      name: string;
      $vars: ['name'];
  }
  interface LegendIconParams {
      itemWidth: number;
      itemHeight: number;
      /**
       * symbolType is from legend.icon, legend.data.icon, or series visual
       */
      icon: string;
      iconRotate: number | 'inherit';
      symbolKeepAspect: boolean;
      itemStyle: PathStyleProps;
      lineStyle: LineStyleProps;
  }
  interface LegendOption extends ComponentOption, LegendStyleOption, BoxLayoutOptionMixin, BorderOptionMixin {
      mainType?: 'legend';
      show?: boolean;
      orient?: LayoutOrient;
      align?: 'auto' | 'left' | 'right';
      backgroundColor?: ColorString;
      /**
       * Border radius of background rect
       * @default 0
       */
      borderRadius?: number | number[];
      /**
       * Padding between legend item and border.
       * Support to be a single number or an array.
       * @default 5
       */
      padding?: number | number[];
      /**
       * Gap between each legend item.
       * @default 10
       */
      itemGap?: number;
      /**
       * Width of legend symbol
       */
      itemWidth?: number;
      /**
       * Height of legend symbol
       */
      itemHeight?: number;
      selectedMode?: boolean | 'single' | 'multiple';
      /**
       * selected map of each item. Default to be selected if item is not in the map
       */
      selected?: Dictionary<boolean>;
      /**
       * Buttons for all select or inverse select.
       * @example
       *  selector: [{type: 'all or inverse', title: xxx}]
       *  selector: true
       *  selector: ['all', 'inverse']
       */
      selector?: (LegendSelectorButtonOption | SelectorType)[] | boolean;
      selectorLabel?: LabelOption;
      emphasis?: {
          selectorLabel?: LabelOption;
      };
      /**
       * Position of selector buttons.
       */
      selectorPosition?: 'auto' | 'start' | 'end';
      /**
       * Gap between each selector button
       */
      selectorItemGap?: number;
      /**
       * Gap between selector buttons group and legend main items.
       */
      selectorButtonGap?: number;
      data?: (string | DataItem)[];
      /**
       * Tooltip option
       */
      tooltip?: CommonTooltipOption<LegendTooltipFormatterParams>;
      triggerEvent?: boolean;
  }
  
  interface ScrollableLegendOption extends LegendOption {
      scrollDataIndex?: number;
      /**
       * Gap between each page button
       */
      pageButtonItemGap?: number;
      /**
       * Gap between page buttons group and legend items.
       */
      pageButtonGap?: number;
      pageButtonPosition?: 'start' | 'end';
      pageFormatter?: string | ((param: {
          current: number;
          total: number;
      }) => string);
      pageIcons?: {
          horizontal?: string[];
          vertical?: string[];
      };
      pageIconColor?: ZRColor;
      pageIconInactiveColor?: ZRColor;
      pageIconSize?: number;
      pageTextStyle?: LabelOption;
      animationDurationUpdate?: number;
  }
  
  interface DataZoomOption extends ComponentOption {
      mainType?: 'dataZoom';
      /**
       * Default auto by axisIndex
       */
      orient?: LayoutOrient;
      /**
       * Default the first horizontal category axis.
       */
      xAxisIndex?: number | number[];
      xAxisId?: string | string[];
      /**
       * Default the first vertical category axis.
       */
      yAxisIndex?: number | number[];
      yAxisId?: string | string[];
      radiusAxisIndex?: number | number[];
      radiusAxisId?: string | string[];
      angleAxisIndex?: number | number[];
      angleAxisId?: string | string[];
      singleAxisIndex?: number | number[];
      singleAxisId?: string | string[];
      /**
       * Possible values: 'filter' or 'empty' or 'weakFilter'.
       * 'filter': data items which are out of window will be removed. This option is
       *         applicable when filtering outliers. For each data item, it will be
       *         filtered if one of the relevant dimensions is out of the window.
       * 'weakFilter': data items which are out of window will be removed. This option
       *         is applicable when filtering outliers. For each data item, it will be
       *         filtered only if all  of the relevant dimensions are out of the same
       *         side of the window.
       * 'empty': data items which are out of window will be set to empty.
       *         This option is applicable when user should not neglect
       *         that there are some data items out of window.
       * 'none': Do not filter.
       * Taking line chart as an example, line will be broken in
       * the filtered points when filterModel is set to 'empty', but
       * be connected when set to 'filter'.
       */
      filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';
      /**
       * Dispatch action by the fixed rate, avoid frequency.
       * default 100. Do not throttle when use null/undefined.
       * If animation === true and animationDurationUpdate > 0,
       * default value is 100, otherwise 20.
       */
      throttle?: number | null | undefined;
      /**
       * Start percent. 0 ~ 100
       */
      start?: number;
      /**
       * End percent. 0 ~ 100
       */
      end?: number;
      /**
       * Start value. If startValue specified, start is ignored
       */
      startValue?: number | string | Date;
      /**
       * End value. If endValue specified, end is ignored.
       */
      endValue?: number | string | Date;
      /**
       * Min span percent, 0 - 100
       * The range of dataZoom can not be smaller than that.
       */
      minSpan?: number;
      /**
       * Max span percent, 0 - 100
       * The range of dataZoom can not be larger than that.
       */
      maxSpan?: number;
      minValueSpan?: number;
      maxValueSpan?: number;
      rangeMode?: ['value' | 'percent', 'value' | 'percent'];
      realtime?: boolean;
      textStyle?: LabelOption;
  }
  
  interface SliderHandleLabelOption {
      show?: boolean;
  }
  interface SliderDataZoomOption extends DataZoomOption, BoxLayoutOptionMixin {
      show?: boolean;
      /**
       * Slider dataZoom don't support textStyle
       */
      /**
       * Background of slider zoom component
       */
      backgroundColor?: ZRColor;
      /**
       * @deprecated Use borderColor instead
       */
      /**
       * border color of the box. For compatibility,
       * if dataBackgroundColor is set, borderColor
       * is ignored.
       */
      borderColor?: ZRColor;
      /**
       * Border radius of the box.
       */
      borderRadius?: number | number[];
      dataBackground?: {
          lineStyle?: LineStyleOption;
          areaStyle?: AreaStyleOption;
      };
      selectedDataBackground?: {
          lineStyle?: LineStyleOption;
          areaStyle?: AreaStyleOption;
      };
      /**
       * Color of selected area.
       */
      fillerColor?: ZRColor;
      /**
       * @deprecated Use handleStyle instead
       */
      handleIcon?: string;
      handleLabel?: SliderHandleLabelOption;
      /**
       * number: height of icon. width will be calculated according to the aspect of icon.
       * string: percent of the slider height. width will be calculated according to the aspect of icon.
       */
      handleSize?: string | number;
      handleStyle?: ItemStyleOption;
      /**
       * Icon to indicate it is a draggable panel.
       */
      moveHandleIcon?: string;
      moveHandleStyle?: ItemStyleOption;
      /**
       * Height of handle rect. Can be a percent string relative to the slider height.
       */
      moveHandleSize?: number;
      labelPrecision?: number | 'auto';
      labelFormatter?: string | ((value: number, valueStr: string) => string);
      showDetail?: boolean;
      showDataShadow?: 'auto' | boolean;
      zoomLock?: boolean;
      textStyle?: LabelOption;
      /**
       * If eable select by brushing
       */
      brushSelect?: boolean;
      brushStyle?: ItemStyleOption;
      emphasis?: {
          handleLabel: SliderHandleLabelOption;
          handleStyle?: ItemStyleOption;
          moveHandleStyle?: ItemStyleOption;
      };
      /**
       * @private
       * Distance between the slider and the edge of the chart.
       */
      defaultLocationEdgeGap?: number;
  }
  
  interface InsideDataZoomOption extends DataZoomOption {
      /**
       * Whether disable this inside zoom.
       */
      disabled?: boolean;
      /**
       * Whether disable zoom but only pan.
       */
      zoomLock?: boolean;
      zoomOnMouseWheel?: boolean | 'shift' | 'ctrl' | 'alt';
      moveOnMouseMove?: boolean | 'shift' | 'ctrl' | 'alt';
      moveOnMouseWheel?: boolean | 'shift' | 'ctrl' | 'alt';
      preventDefaultMouseMove?: boolean;
      /**
       * Inside dataZoom don't support textStyle
       */
      textStyle?: never;
  }
  
  type VisualOptionBase = {
      [key in BuiltinVisualProperty]?: any;
  };
  type LabelFormatter = (min: OptionDataValue, max?: OptionDataValue) => string;
  interface VisualMapOption<T extends VisualOptionBase = VisualOptionBase> extends ComponentOption, BoxLayoutOptionMixin, BorderOptionMixin {
      mainType?: 'visualMap';
      show?: boolean;
      align?: string;
      realtime?: boolean;
      /**
       * 'all' or null/undefined: all series.
       * A number or an array of number: the specified series.
       */
      seriesIndex?: 'all' | number[] | number;
      seriesId?: OptionId | OptionId[];
      /**
       * set min: 0, max: 200, only for campatible with ec2.
       * In fact min max should not have default value.
       * min value, must specified if pieces is not specified.
       */
      min?: number;
      /**
       * max value, must specified if pieces is not specified.
       */
      max?: number;
      /**
       * Dimension to be encoded
       */
      dimension?: number;
      /**
       * Visual configuration for the data in selection
       */
      inRange?: T;
      /**
       * Visual configuration for the out of selection
       */
      outOfRange?: T;
      controller?: {
          inRange?: T;
          outOfRange?: T;
      };
      target?: {
          inRange?: T;
          outOfRange?: T;
      };
      /**
       * Width of the display item
       */
      itemWidth?: number;
      /**
       * Height of the display item
       */
      itemHeight?: number;
      inverse?: boolean;
      orient?: 'horizontal' | 'vertical';
      backgroundColor?: ZRColor;
      contentColor?: ZRColor;
      inactiveColor?: ZRColor;
      /**
       * Padding of the component. Can be an array similar to CSS
       */
      padding?: number[] | number;
      /**
       * Gap between text and item
       */
      textGap?: number;
      precision?: number;
      /**
       * @deprecated
       * Option from version 2
       */
      color?: ColorString[];
      formatter?: string | LabelFormatter;
      /**
       * Text on the both end. Such as ['High', 'Low']
       */
      text?: string[];
      textStyle?: LabelOption;
      categories?: unknown;
  }
  interface VisualMeta {
      stops: {
          value: number;
          color: ColorString;
      }[];
      outerColors: ColorString[];
      dimension?: DimensionIndex;
  }
  
  interface ContinousVisualMapOption extends VisualMapOption {
      align?: 'auto' | 'left' | 'right' | 'top' | 'bottom';
      /**
       * This prop effect default component type determine
       * @see echarts/component/visualMap/typeDefaulter.
       */
      calculable?: boolean;
      /**
       * selected range. In default case `range` is `[min, max]`
       * and can auto change along with user interaction or action "selectDataRange",
       * until user specified a range.
       * @see unboundedRange for the special case when `range[0]` or `range[1]` touch `min` or `max`.
       */
      range?: number[];
      /**
       * Whether to treat the range as unbounded when `range` touches `min` or `max`.
       * - `true`:
       *   when `range[0]` <= `min`, the actual range becomes `[-Infinity, range[1]]`;
       *   when `range[1]` >= `max`, the actual range becomes `[range[0], Infinity]`.
       *   NOTE:
       *     - This provides a way to ensure all data can be considered in-range when `min`/`max`
       *       are not precisely known.
       *     - Default is `true` for backward compatibility.
       *     - Piecewise VisualMap does not need it, since it can define unbounded range in each piece,
       *       such as "< 12", ">= 300".
       * - `false`:
       *   Disable the unbounded range behavior.
       *   Use case: `min`/`max` reflect the normal data range, and some outlier data should always be
       *   treated as out of range.
       */
      unboundedRange?: boolean;
      /**
       * Whether to enable hover highlight.
       */
      hoverLink?: boolean;
      /**
       * The extent of hovered data.
       */
      hoverLinkDataSize?: number;
      /**
       * Whether trigger hoverLink when hover handle.
       * If not specified, follow the value of `realtime`.
       */
      hoverLinkOnHandle?: boolean;
      handleIcon?: string;
      handleSize?: string | number;
      handleStyle?: ItemStyleOption;
      indicatorIcon?: string;
      indicatorSize?: string | number;
      indicatorStyle?: ItemStyleOption;
      emphasis?: {
          handleStyle?: ItemStyleOption;
      };
  }
  
  interface VisualPiece extends VisualOptionPiecewise {
      min?: number;
      max?: number;
      lt?: number;
      gt?: number;
      lte?: number;
      gte?: number;
      value?: number;
      label?: string;
  }
  /**
   * Order Rule:
   *
   * option.categories / option.pieces / option.text / option.selected:
   *     If !option.inverse,
   *     Order when vertical: ['top', ..., 'bottom'].
   *     Order when horizontal: ['left', ..., 'right'].
   *     If option.inverse, the meaning of
   *     the order should be reversed.
   *
   * this._pieceList:
   *     The order is always [low, ..., high].
   *
   * Mapping from location to low-high:
   *     If !option.inverse
   *     When vertical, top is high.
   *     When horizontal, right is high.
   *     If option.inverse, reverse.
   */
  interface PiecewiseVisualMapOption extends VisualMapOption {
      align?: 'auto' | 'left' | 'right';
      minOpen?: boolean;
      maxOpen?: boolean;
      /**
       * When put the controller vertically, it is the length of
       * horizontal side of each item. Otherwise, vertical side.
       * When put the controller vertically, it is the length of
       * vertical side of each item. Otherwise, horizontal side.
       */
      itemWidth?: number;
      itemHeight?: number;
      itemSymbol?: string;
      pieces?: VisualPiece[];
      /**
       * category names, like: ['some1', 'some2', 'some3'].
       * Attr min/max are ignored when categories set. See "Order Rule"
       */
      categories?: string[];
      /**
       * If set to 5, auto split five pieces equally.
       * If set to 0 and component type not set, component type will be
       * determined as "continuous". (It is less reasonable but for ec2
       * compatibility, see echarts/component/visualMap/typeDefaulter)
       */
      splitNumber?: number;
      /**
       * Object. If not specified, means selected. When pieces and splitNumber: {'0': true, '5': true}
       * When categories: {'cate1': false, 'cate3': true} When selected === false, means all unselected.
       */
      selected?: Dictionary<boolean>;
      selectedMode?: 'multiple' | 'single' | boolean;
      /**
       * By default, when text is used, label will hide (the logic
       * is remained for compatibility reason)
       */
      showLabel?: boolean;
      itemGap?: number;
      hoverLink?: boolean;
  }
  
  interface MarkLineStateOption {
      lineStyle?: LineStyleOption;
      /**
       * itemStyle for symbol
       */
      itemStyle?: ItemStyleOption;
      label?: SeriesLineLabelOption;
      z2?: number;
  }
  interface MarkLineDataItemOptionBase extends MarkLineStateOption, StatesOptionMixin<MarkLineStateOption, StatesMixinBase> {
      name?: string;
  }
  interface MarkLine1DDataItemOption extends MarkLineDataItemOptionBase {
      xAxis?: number | string;
      yAxis?: number | string;
      type?: MarkerStatisticType;
      /**
       * When using statistic method with type.
       * valueIndex and valueDim can be specify which dim the statistic is used on.
       */
      valueIndex?: number;
      valueDim?: string;
      /**
       * Symbol for both two ends
       */
      symbol?: string[] | string;
      symbolSize?: number[] | number;
      symbolRotate?: number[] | number;
      symbolOffset?: number | string | (number | string)[];
  }
  interface MarkLine2DDataItemDimOption extends MarkLineDataItemOptionBase, SymbolOptionMixin, MarkerPositionOption {
  }
  type MarkLine2DDataItemOption = [
      MarkLine2DDataItemDimOption,
      MarkLine2DDataItemDimOption
  ];
  interface MarkLineOption extends MarkerOption, MarkLineStateOption, StatesOptionMixin<MarkLineStateOption, StatesMixinBase> {
      mainType?: 'markLine';
      symbol?: string[] | string;
      symbolSize?: number[] | number;
      symbolRotate?: number[] | number;
      symbolOffset?: number | string | (number | string)[] | (number | string)[][];
      /**
       * Precision used on statistic method
       */
      precision?: number;
      data?: (MarkLine1DDataItemOption | MarkLine2DDataItemOption)[];
  }
  
  interface MarkPointStateOption {
      itemStyle?: ItemStyleOption;
      label?: SeriesLabelOption;
      z2?: number;
  }
  interface MarkPointDataItemOption extends MarkPointStateOption, StatesOptionMixin<MarkPointStateOption, StatesMixinBase>, SymbolOptionMixin<CallbackDataParams>, MarkerPositionOption {
      name: string;
  }
  interface MarkPointOption extends MarkerOption, SymbolOptionMixin<CallbackDataParams>, StatesOptionMixin<MarkPointStateOption, StatesMixinBase>, MarkPointStateOption {
      mainType?: 'markPoint';
      precision?: number;
      data?: MarkPointDataItemOption[];
  }
  
  type ECSymbol = Path & {
      __isEmptyBrush?: boolean;
      setColor: (color: ZRColor, innerColor?: ZRColor) => void;
      getColor: () => ZRColor;
  };
  /**
   * Create a symbol element with given symbol configuration: shape, x, y, width, height, color
   */
  function createSymbol(symbolType: string, x: number, y: number, w: number, h: number, color?: ZRColor, keepAspect?: boolean): ECSymbol;
  
  type LineDataValue = OptionDataValue | OptionDataValue[];
  interface LineStateOptionMixin {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean | number;
      };
  }
  interface LineStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
      endLabel?: LineEndLabelOption;
  }
  interface LineDataItemOption extends SymbolOptionMixin, LineStateOption, StatesOptionMixin<LineStateOption, LineStateOptionMixin> {
      name?: string;
      value?: LineDataValue;
  }
  interface LineEndLabelOption extends SeriesLabelOption {
      valueAnimation?: boolean;
  }
  interface LineSeriesOption extends SeriesOption$1<LineStateOption<CallbackDataParams>, LineStateOptionMixin & {
      emphasis?: {
          lineStyle?: Omit<LineStyleOption, 'width'> & {
              width?: LineStyleOption['width'] | 'bolder';
          };
          areaStyle?: AreaStyleOption;
      };
      blur?: {
          lineStyle?: LineStyleOption;
          areaStyle?: AreaStyleOption;
      };
  }>, LineStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesStackOptionMixin, SeriesSamplingOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
      type?: 'line';
      coordinateSystem?: 'cartesian2d' | 'polar';
      clip?: boolean;
      label?: SeriesLabelOption;
      endLabel?: LineEndLabelOption;
      lineStyle?: LineStyleOption;
      areaStyle?: AreaStyleOption & {
          origin?: 'auto' | 'start' | 'end' | number;
      };
      step?: false | 'start' | 'end' | 'middle';
      smooth?: boolean | number;
      smoothMonotone?: 'x' | 'y' | 'none';
      connectNulls?: boolean;
      showSymbol?: boolean;
      showAllSymbol?: 'auto' | boolean;
      data?: (LineDataValue | LineDataItemOption)[];
      triggerLineEvent?: boolean;
  }
  
  interface ScatterStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
  }
  interface ScatterStatesOptionMixin {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean | number;
      };
  }
  interface ScatterDataItemOption extends SymbolOptionMixin, ScatterStateOption, StatesOptionMixin<ScatterStateOption, ScatterStatesOptionMixin>, OptionDataItemObject<OptionDataValue> {
  }
  interface ScatterSeriesOption extends SeriesOption$1<ScatterStateOption<CallbackDataParams>, ScatterStatesOptionMixin>, ScatterStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SeriesLargeOptionMixin, SeriesStackOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
      type?: 'scatter';
      coordinateSystem?: string;
      cursor?: string;
      clip?: boolean;
      data?: (ScatterDataItemOption | OptionDataValue | OptionDataValue[])[] | ArrayLike<number>;
  }
  
  interface PieItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      borderRadius?: (number | string)[] | number | string;
  }
  interface PieCallbackDataParams extends CallbackDataParams {
      percent: number;
  }
  interface PieStateOption<TCbParams = never> {
      itemStyle?: PieItemStyleOption<TCbParams>;
      label?: PieLabelOption;
      labelLine?: PieLabelLineOption;
  }
  interface PieLabelOption extends Omit<SeriesLabelOption, 'rotate' | 'position'> {
      rotate?: number | boolean | 'radial' | 'tangential';
      alignTo?: 'none' | 'labelLine' | 'edge';
      edgeDistance?: string | number;
      /**
       * @deprecated Use `edgeDistance` instead
       */
      margin?: string | number;
      bleedMargin?: number;
      distanceToLabelLine?: number;
      position?: SeriesLabelOption['position'] | 'outer' | 'inner' | 'center' | 'outside';
  }
  interface PieLabelLineOption extends LabelLineOption {
      /**
       * Max angle between labelLine and surface normal.
       * 0 - 180
       */
      maxSurfaceAngle?: number;
  }
  interface ExtraStateOption {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean;
          scaleSize?: number;
      };
  }
  interface PieDataItemOption extends OptionDataItemObject<OptionDataValueNumeric>, PieStateOption, StatesOptionMixin<PieStateOption, ExtraStateOption> {
      cursor?: string;
  }
  interface PieSeriesOption extends Omit<SeriesOption$1<PieStateOption<PieCallbackDataParams>, ExtraStateOption>, 'labelLine'>, PieStateOption<PieCallbackDataParams>, CircleLayoutOptionMixin<{
      centerExtra: string | number;
  }>, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
      type?: 'pie';
      roseType?: 'radius' | 'area';
      clockwise?: boolean;
      startAngle?: number;
      endAngle?: number | 'auto';
      padAngle?: number;
      minAngle?: number;
      minShowLabelAngle?: number;
      selectedOffset?: number;
      avoidLabelOverlap?: boolean;
      percentPrecision?: number;
      stillShowZeroSum?: boolean;
      animationType?: 'expansion' | 'scale';
      animationTypeUpdate?: 'transition' | 'expansion';
      showEmptyCircle?: boolean;
      emptyCircleStyle?: PieItemStyleOption;
      data?: (OptionDataValueNumeric | OptionDataValueNumeric[] | PieDataItemOption)[];
  }
  
  type RadarSeriesDataValue = OptionDataValue[];
  interface RadarStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface RadarSeriesStateOption<TCbParams = never> {
      lineStyle?: LineStyleOption;
      areaStyle?: AreaStyleOption;
      label?: SeriesLabelOption;
      itemStyle?: ItemStyleOption<TCbParams>;
  }
  interface RadarSeriesDataItemOption extends SymbolOptionMixin, RadarSeriesStateOption<CallbackDataParams>, StatesOptionMixin<RadarSeriesStateOption<CallbackDataParams>, RadarStatesMixin>, OptionDataItemObject<RadarSeriesDataValue> {
  }
  interface RadarSeriesOption extends SeriesOption$1<RadarSeriesStateOption, RadarStatesMixin>, RadarSeriesStateOption, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
      type?: 'radar';
      coordinateSystem?: 'radar';
      radarIndex?: number;
      radarId?: string;
      data?: (RadarSeriesDataItemOption | RadarSeriesDataValue)[];
  }
  
  interface MapStateOption<TCbParams = never> {
      itemStyle?: GeoItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
  }
  interface MapDataItemOption extends MapStateOption, StatesOptionMixin<MapStateOption, StatesMixinBase>, OptionDataItemObject<OptionDataValueNumeric> {
      cursor?: string;
      silent?: boolean;
  }
  type MapValueCalculationType = 'sum' | 'average' | 'min' | 'max';
  interface MapSeriesOption extends SeriesOption$1<MapStateOption<CallbackDataParams>, StatesMixinBase>, MapStateOption<CallbackDataParams>, GeoCommonOptionMixin, SeriesOnGeoOptionMixin, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
      type?: 'map';
      coordinateSystem?: string;
      silent?: boolean;
      markLine?: any;
      markPoint?: any;
      markArea?: any;
      mapValueCalculation?: MapValueCalculationType;
      showLegendSymbol?: boolean;
      geoCoord?: Dictionary<number[]>;
      data?: (OptionDataValueNumeric | OptionDataValueNumeric[] | MapDataItemOption)[];
      nameProperty?: string;
  }
  
  interface CurveLineStyleOption extends LineStyleOption {
      curveness?: number;
  }
  interface TreeSeriesStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      /**
       * Line style of the edge between node and it's parent.
       */
      lineStyle?: CurveLineStyleOption;
      label?: SeriesLabelOption;
  }
  interface TreeStatesMixin {
      emphasis?: {
          focus?: DefaultEmphasisFocus | 'ancestor' | 'descendant' | 'relative';
          scale?: boolean;
      };
  }
  interface TreeSeriesNodeItemOption extends SymbolOptionMixin<CallbackDataParams>, TreeSeriesStateOption<CallbackDataParams>, StatesOptionMixin<TreeSeriesStateOption<CallbackDataParams>, TreeStatesMixin>, OptionDataItemObject<OptionDataValue> {
      children?: TreeSeriesNodeItemOption[];
      collapsed?: boolean;
      link?: string;
      target?: string;
  }
  /**
   * Configuration of leaves nodes.
   */
  interface TreeSeriesLeavesOption extends TreeSeriesStateOption, StatesOptionMixin<TreeSeriesStateOption, TreeStatesMixin> {
  }
  interface TreeSeriesOption extends SeriesOption$1<TreeSeriesStateOption, TreeStatesMixin>, TreeSeriesStateOption, SymbolOptionMixin<CallbackDataParams>, BoxLayoutOptionMixin, RoamOptionMixin {
      type?: 'tree';
      layout?: 'orthogonal' | 'radial';
      edgeShape?: 'polyline' | 'curve';
      /**
       * Available when edgeShape is polyline
       */
      edgeForkPosition?: string | number;
      nodeScaleRatio?: number;
      /**
       * The orient of orthoginal layout, can be setted to 'LR', 'TB', 'RL', 'BT'.
       * and the backward compatibility configuration 'horizontal = LR', 'vertical = TB'.
       */
      orient?: 'LR' | 'TB' | 'RL' | 'BT' | 'horizontal' | 'vertical';
      expandAndCollapse?: boolean;
      /**
       * The initial expanded depth of tree
       */
      initialTreeDepth?: number;
      leaves?: TreeSeriesLeavesOption;
      data?: TreeSeriesNodeItemOption[];
  }
  
  type TreeTraverseOrder = 'preorder' | 'postorder';
  type TreeTraverseCallback<Ctx> = (this: Ctx, node: TreeNode) => boolean | void;
  type TreeTraverseOption = {
      order?: TreeTraverseOrder;
      attr?: 'children' | 'viewChildren';
  };
  interface TreeNodeOption extends Pick<OptionDataItemObject<OptionDataValue>, 'name' | 'value'> {
      children?: TreeNodeOption[];
  }
  class TreeNode {
      name: string;
      depth: number;
      height: number;
      parentNode: TreeNode;
      /**
       * Reference to list item.
       * Do not persistent dataIndex outside,
       * besause it may be changed by list.
       * If dataIndex -1,
       * this node is logical deleted (filtered) in list.
       */
      dataIndex: number;
      children: TreeNode[];
      viewChildren: TreeNode[];
      isExpand: boolean;
      readonly hostTree: Tree<Model>;
      constructor(name: string, hostTree: Tree<Model>);
      /**
       * The node is removed.
       */
      isRemoved(): boolean;
      /**
       * Travel this subtree (include this node).
       * Usage:
       *    node.eachNode(function () { ... }); // preorder
       *    node.eachNode('preorder', function () { ... }); // preorder
       *    node.eachNode('postorder', function () { ... }); // postorder
       *    node.eachNode(
       *        {order: 'postorder', attr: 'viewChildren'},
       *        function () { ... }
       *    ); // postorder
       *
       * @param options If string, means order.
       * @param options.order 'preorder' or 'postorder'
       * @param options.attr 'children' or 'viewChildren'
       * @param cb If in preorder and return false,
       *                      its subtree will not be visited.
       */
      eachNode<Ctx>(options: TreeTraverseOrder, cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      eachNode<Ctx>(options: TreeTraverseOption, cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      eachNode<Ctx>(cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      /**
       * Update depth and height of this subtree.
       */
      updateDepthAndHeight(depth: number): void;
      getNodeById(id: string): TreeNode;
      contains(node: TreeNode): boolean;
      /**
       * @param includeSelf Default false.
       * @return order: [root, child, grandchild, ...]
       */
      getAncestors(includeSelf?: boolean): TreeNode[];
      getAncestorsIndices(): number[];
      getDescendantIndices(): number[];
      getValue(dimension?: DimensionLoose): ParsedValue;
      setLayout(layout: any, merge?: boolean): void;
      /**
       * @return {Object} layout
       */
      getLayout(): any;
      getModel<T = unknown>(): Model<T>;
      getLevelModel(): Model;
      /**
       * @example
       *  setItemVisual('color', color);
       *  setItemVisual({
       *      'color': color
       *  });
       */
      setVisual(key: string, value: any): void;
      setVisual(obj: Dictionary<any>): void;
      /**
       * Get item visual
       * FIXME: make return type better
       */
      getVisual(key: string): unknown;
      getRawIndex(): number;
      getId(): string;
      /**
       * index in parent's children
       */
      getChildIndex(): number;
      /**
       * if this is an ancestor of another node
       *
       * @param node another node
       * @return if is ancestor
       */
      isAncestorOf(node: TreeNode): boolean;
      /**
       * if this is an descendant of another node
       *
       * @param node another node
       * @return if is descendant
       */
      isDescendantOf(node: TreeNode): boolean;
  }
  class Tree<HostModel extends Model = Model, LevelOption = any> {
      type: 'tree';
      root: TreeNode;
      data: SeriesData;
      hostModel: HostModel;
      levelModels: Model<LevelOption>[];
      private _nodes;
      constructor(hostModel: HostModel);
      /**
       * Travel this subtree (include this node).
       * Usage:
       *    node.eachNode(function () { ... }); // preorder
       *    node.eachNode('preorder', function () { ... }); // preorder
       *    node.eachNode('postorder', function () { ... }); // postorder
       *    node.eachNode(
       *        {order: 'postorder', attr: 'viewChildren'},
       *        function () { ... }
       *    ); // postorder
       *
       * @param options If string, means order.
       * @param options.order 'preorder' or 'postorder'
       * @param options.attr 'children' or 'viewChildren'
       * @param cb
       * @param context
       */
      eachNode<Ctx>(options: TreeTraverseOrder, cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      eachNode<Ctx>(options: TreeTraverseOption, cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      eachNode<Ctx>(cb: TreeTraverseCallback<Ctx>, context?: Ctx): void;
      getNodeByDataIndex(dataIndex: number): TreeNode;
      getNodeById(name: string): TreeNode;
      /**
       * Update item available by list,
       * when list has been performed options like 'filterSelf' or 'map'.
       */
      update(): void;
      /**
       * Clear all layouts
       */
      clearLayouts(): void;
      /**
       * data node format:
       * {
       *     name: ...
       *     value: ...
       *     children: [
       *         {
       *             name: ...
       *             value: ...
       *             children: ...
       *         },
       *         ...
       *     ]
       * }
       */
      static createTree<T extends TreeNodeOption, HostModel extends Model>(dataRoot: T, hostModel: HostModel, beforeLink?: (data: SeriesData) => void): Tree<HostModel, any>;
  }
  
  type TreemapSeriesDataValue = number | number[];
  interface BreadcrumbItemStyleOption extends ItemStyleOption {
      textStyle?: LabelOption;
  }
  interface TreemapSeriesLabelOption extends SeriesLabelOption {
      formatter?: string | ((params: CallbackDataParams) => string);
  }
  interface TreemapSeriesItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      borderRadius?: number | number[];
      colorAlpha?: number;
      colorSaturation?: number;
      borderColorSaturation?: number;
      gapWidth?: number;
  }
  interface TreePathInfo {
      name: string;
      dataIndex: number;
      value: TreemapSeriesDataValue;
  }
  interface TreemapSeriesCallbackDataParams extends CallbackDataParams {
      /**
       * @deprecated
       */
      treePathInfo?: TreePathInfo[];
      treeAncestors?: TreePathInfo[];
  }
  interface ExtraStateOption$1 {
      emphasis?: {
          focus?: DefaultEmphasisFocus | 'descendant' | 'ancestor';
      };
  }
  interface TreemapStateOption<TCbParams = never> {
      itemStyle?: TreemapSeriesItemStyleOption<TCbParams>;
      label?: TreemapSeriesLabelOption;
      upperLabel?: TreemapSeriesLabelOption;
  }
  interface TreemapSeriesVisualOption {
      /**
       * Which dimension will be applied with the visual properties.
       */
      visualDimension?: number | string;
      /**
       * @deprecated Use colorBy instead
       */
      colorMappingBy?: 'value' | 'index' | 'id';
      visualMin?: number;
      visualMax?: number;
      colorAlpha?: number[] | 'none';
      colorSaturation?: number[] | 'none';
      /**
       * A node will not be shown when its area size is smaller than this value (unit: px square).
       */
      visibleMin?: number;
      /**
       * Children will not be shown when area size of a node is smaller than this value (unit: px square).
       */
      childrenVisibleMin?: number;
  }
  interface TreemapSeriesLevelOption extends TreemapSeriesVisualOption, TreemapStateOption, StatesOptionMixin<TreemapStateOption, ExtraStateOption$1> {
      color?: ColorString[] | 'none';
      decal?: DecalObject[] | 'none';
  }
  interface TreemapSeriesNodeItemOption extends TreemapSeriesVisualOption, TreemapStateOption, StatesOptionMixin<TreemapStateOption, ExtraStateOption$1> {
      id?: OptionId;
      name?: OptionName;
      value?: TreemapSeriesDataValue;
      children?: TreemapSeriesNodeItemOption[];
      color?: ColorString[] | 'none';
      decal?: DecalObject[] | 'none';
      cursor?: string;
  }
  interface TreemapSeriesOption extends SeriesOption$1<TreemapStateOption<TreemapSeriesCallbackDataParams>, ExtraStateOption$1>, TreemapStateOption<TreemapSeriesCallbackDataParams>, BoxLayoutOptionMixin, RoamOptionMixin, TreemapSeriesVisualOption {
      type?: 'treemap';
      /**
       * configuration in echarts2
       * @deprecated
       */
      size?: (number | string)[];
      /**
       * If sort in desc order.
       * Default to be desc. asc has strange effect
       */
      sort?: boolean | 'asc' | 'desc';
      /**
       * Size of clipped window when zooming. 'origin' or 'fullscreen'
       */
      clipWindow?: 'origin' | 'fullscreen';
      squareRatio?: number;
      /**
       * Nodes on depth from root are regarded as leaves.
       * Count from zero (zero represents only view root).
       */
      leafDepth?: number;
      drillDownIcon?: string;
      /**
       * Be effective when using zoomToNode. Specify the proportion of the
       * target node area in the view area.
       */
      zoomToNodeRatio?: number;
      /**
       * Leaf node click behaviour: 'zoomToNode', 'link', false.
       * If leafDepth is set and clicking a node which has children but
       * be on left depth, the behaviour would be changing root. Otherwise
       * use behaviour defined above.
       */
      nodeClick?: 'zoomToNode' | 'link' | false;
      breadcrumb?: BoxLayoutOptionMixin & {
          show?: boolean;
          height?: number;
          emptyItemWidth?: number;
          itemStyle?: BreadcrumbItemStyleOption;
          emphasis?: {
              disabled?: boolean;
              focus?: DefaultEmphasisFocus;
              blurScope?: BlurScope;
              itemStyle?: BreadcrumbItemStyleOption;
          };
      };
      levels?: TreemapSeriesLevelOption[];
      data?: TreemapSeriesNodeItemOption[];
  }
  
  class Graph {
      type: 'graph';
      readonly nodes: GraphNode[];
      readonly edges: GraphEdge[];
      data: SeriesData;
      edgeData: SeriesData;
      /**
       * Whether directed graph.
       */
      private _directed;
      private _nodesMap;
      /**
       * @type {Object.<string, module:echarts/data/Graph.Edge>}
       * @private
       */
      private _edgesMap;
      constructor(directed?: boolean);
      /**
       * If is directed graph
       */
      isDirected(): boolean;
      /**
       * Add a new node
       */
      addNode(id: string | number, dataIndex?: number): GraphNode;
      /**
       * Get node by data index
       */
      getNodeByIndex(dataIndex: number): GraphNode;
      /**
       * Get node by id
       */
      getNodeById(id: string): GraphNode;
      /**
       * Add a new edge
       */
      addEdge(n1: GraphNode | number | string, n2: GraphNode | number | string, dataIndex?: number): GraphEdge;
      /**
       * Get edge by data index
       */
      getEdgeByIndex(dataIndex: number): GraphEdge;
      /**
       * Get edge by two linked nodes
       */
      getEdge(n1: string | GraphNode, n2: string | GraphNode): GraphEdge;
      /**
       * Iterate all nodes
       */
      eachNode<Ctx>(cb: (this: Ctx, node: GraphNode, idx: number) => void, context?: Ctx): void;
      /**
       * Iterate all edges
       */
      eachEdge<Ctx>(cb: (this: Ctx, edge: GraphEdge, idx: number) => void, context?: Ctx): void;
      /**
       * Breadth first traverse
       * Return true to stop traversing
       */
      breadthFirstTraverse<Ctx>(cb: (this: Ctx, node: GraphNode, fromNode: GraphNode) => boolean | void, startNode: GraphNode | string, direction: 'none' | 'in' | 'out', context?: Ctx): void;
      update(): void;
      /**
       * @return {module:echarts/data/Graph}
       */
      clone(): Graph;
  }
  interface GraphDataProxyMixin {
      getValue(dimension?: DimensionLoose): ParsedValue;
      setVisual(key: string | Dictionary<any>, value?: any): void;
      getVisual(key: string): any;
      setLayout(layout: any, merge?: boolean): void;
      getLayout(): any;
      getGraphicEl(): Element;
      getRawIndex(): number;
  }
  class GraphEdge {
      /**
       * The first node. If directed graph, it represents the source node.
       */
      node1: GraphNode;
      /**
       * The second node. If directed graph, it represents the target node.
       */
      node2: GraphNode;
      dataIndex: number;
      hostGraph: Graph;
      constructor(n1: GraphNode, n2: GraphNode, dataIndex?: number);
      getModel<T = unknown>(): Model<T>;
      getModel<T = unknown, S extends keyof T = keyof T>(path: S): Model<T[S]>;
      getAdjacentDataIndices(): {
          node: number[];
          edge: number[];
      };
      getTrajectoryDataIndices(): {
          node: number[];
          edge: number[];
      };
  }
  interface GraphEdge extends GraphDataProxyMixin {
  }
  class GraphNode {
      id: string;
      inEdges: GraphEdge[];
      outEdges: GraphEdge[];
      edges: GraphEdge[];
      hostGraph: Graph;
      dataIndex: number;
      __visited: boolean;
      constructor(id?: string, dataIndex?: number);
      /**
       * @return {number}
       */
      degree(): number;
      /**
       * @return {number}
       */
      inDegree(): number;
      /**
      * @return {number}
      */
      outDegree(): number;
      getModel<T = unknown>(): Model<T>;
      getModel<T = unknown, S extends keyof T = keyof T>(path: S): Model<T[S]>;
      getAdjacentDataIndices(): {
          node: number[];
          edge: number[];
      };
      getTrajectoryDataIndices(): {
          node: number[];
          edge: number[];
      };
  }
  interface GraphNode extends GraphDataProxyMixin {
  }
  
  type GraphDataValue = OptionDataValue | OptionDataValue[];
  interface GraphEdgeLineStyleOption extends LineStyleOption {
      curveness?: number;
  }
  interface GraphNodeStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
  }
  interface ExtraEmphasisState {
      focus?: DefaultEmphasisFocus | 'adjacency';
  }
  interface GraphNodeStatesMixin {
      emphasis?: ExtraEmphasisState;
  }
  interface GraphEdgeStatesMixin {
      emphasis?: ExtraEmphasisState;
  }
  interface GraphNodeItemOption extends SymbolOptionMixin, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption, GraphNodeStatesMixin> {
      id?: string;
      name?: string;
      value?: GraphDataValue;
      /**
       * Fixed x position
       */
      x?: number;
      /**
       * Fixed y position
       */
      y?: number;
      /**
       * If this node is fixed during force layout.
       */
      fixed?: boolean;
      /**
       * Index or name of category
       */
      category?: number | string;
      draggable?: boolean;
      cursor?: string;
  }
  interface GraphEdgeStateOption {
      lineStyle?: GraphEdgeLineStyleOption;
      label?: SeriesLineLabelOption;
  }
  interface GraphEdgeItemOption extends GraphEdgeStateOption, StatesOptionMixin<GraphEdgeStateOption, GraphEdgeStatesMixin>, GraphEdgeItemObject<OptionDataValueNumeric> {
      value?: number;
      /**
       * Symbol of both line ends
       */
      symbol?: string | string[];
      symbolSize?: number | number[];
      ignoreForceLayout?: boolean;
  }
  interface GraphCategoryItemOption extends SymbolOptionMixin, GraphNodeStateOption, StatesOptionMixin<GraphNodeStateOption, GraphNodeStatesMixin> {
      name?: string;
      value?: OptionDataValue;
  }
  interface GraphSeriesOption extends SeriesOption$1<GraphNodeStateOption<CallbackDataParams>, GraphNodeStatesMixin>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, RoamOptionMixin, BoxLayoutOptionMixin, PreserveAspectMixin {
      type?: 'graph';
      coordinateSystem?: string;
      legendHoverLink?: boolean;
      layout?: 'none' | 'force' | 'circular';
      data?: (GraphNodeItemOption | GraphDataValue)[];
      nodes?: (GraphNodeItemOption | GraphDataValue)[];
      edges?: GraphEdgeItemOption[];
      links?: GraphEdgeItemOption[];
      categories?: GraphCategoryItemOption[];
      /**
       * @deprecated
       */
      focusNodeAdjacency?: boolean;
      /**
       * Symbol size scale ratio in roam
       */
      nodeScaleRatio?: 0.6;
      draggable?: boolean;
      edgeSymbol?: string | string[];
      edgeSymbolSize?: number | number[];
      edgeLabel?: SeriesLineLabelOption;
      label?: SeriesLabelOption;
      itemStyle?: ItemStyleOption<CallbackDataParams>;
      lineStyle?: GraphEdgeLineStyleOption;
      emphasis?: {
          focus?: Exclude<GraphNodeItemOption['emphasis'], undefined>['focus'];
          scale?: boolean | number;
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
      blur?: {
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
      select?: {
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
      circular?: {
          rotateLabel?: boolean;
      };
      force?: {
          initLayout?: 'circular' | 'none';
          repulsion?: number | number[];
          gravity?: number;
          friction?: number;
          edgeLength?: number | number[];
          layoutAnimation?: boolean;
      };
      /**
       * auto curveness for multiple edge, invalid when `lineStyle.curveness` is set
       */
      autoCurveness?: boolean | number | number[];
  }
  
  interface ExtraEmphasisState$1 {
      /**
       * For focus on nodes:
       * - self: Focus self node, and all edges connected to it.
       * - adjacency: Focus self nodes and two edges (source and target)
       *   connected to the focused node.
       *
       * For focus on edges:
       * - self: Focus self edge, and all nodes connected to it.
       * - adjacency: Focus self edge and all edges connected to it and all
       *   nodes connected to these edges.
       */
      focus?: DefaultEmphasisFocus | 'adjacency';
  }
  interface ChordStatesMixin {
      emphasis?: ExtraEmphasisState$1;
  }
  interface ChordEdgeStatesMixin {
      emphasis?: ExtraEmphasisState$1;
  }
  type ChordDataValue = OptionDataValue | OptionDataValue[];
  interface ChordItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      borderRadius?: (number | string)[] | number | string;
  }
  interface ChordNodeStateOption<TCbParams = never> {
      itemStyle?: ChordItemStyleOption<TCbParams>;
      label?: ChordNodeLabelOption;
  }
  interface ChordNodeItemOption extends ChordNodeStateOption, StatesOptionMixin<ChordNodeStateOption, ChordStatesMixin> {
      id?: string;
      name?: string;
      value?: ChordDataValue;
  }
  interface ChordEdgeLineStyleOption extends LineStyleOption {
      curveness?: number;
  }
  interface ChordNodeLabelOption extends Omit<SeriesLabelOption<CallbackDataParams>, 'position'> {
      silent?: boolean;
      position?: SeriesLabelOption['position'] | 'outside';
  }
  interface ChordEdgeStateOption {
      lineStyle?: ChordEdgeLineStyleOption;
      label?: SeriesLineLabelOption;
  }
  interface ChordEdgeItemOption extends ChordEdgeStateOption, StatesOptionMixin<ChordEdgeStateOption, ChordEdgeStatesMixin>, GraphEdgeItemObject<OptionDataValueNumeric> {
      value?: number;
  }
  interface ChordSeriesOption extends SeriesOption$1<ChordNodeStateOption<CallbackDataParams>, ChordStatesMixin>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, RoamOptionMixin, BoxLayoutOptionMixin, CircleLayoutOptionMixin {
      type?: 'chord';
      coordinateSystem?: 'none';
      legendHoverLink?: boolean;
      clockwise?: boolean;
      startAngle?: number;
      endAngle?: number | 'auto';
      padAngle?: number;
      minAngle?: number;
      data?: (ChordNodeItemOption | ChordDataValue)[];
      nodes?: (ChordNodeItemOption | ChordDataValue)[];
      edges?: ChordEdgeItemOption[];
      links?: ChordEdgeItemOption[];
      edgeLabel?: SeriesLineLabelOption;
      label?: ChordNodeLabelOption;
      itemStyle?: ChordItemStyleOption<CallbackDataParams>;
      lineStyle?: ChordEdgeLineStyleOption;
      emphasis?: {
          focus?: Exclude<ChordNodeItemOption['emphasis'], undefined>['focus'];
          scale?: boolean | number;
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
      blur?: {
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
      select?: {
          label?: SeriesLabelOption;
          edgeLabel?: SeriesLabelOption;
          itemStyle?: ItemStyleOption;
          lineStyle?: LineStyleOption;
      };
  }
  
  type GaugeColorStop = [number, ColorString];
  interface LabelFormatter$1 {
      (value: number): string;
  }
  interface PointerOption {
      icon?: string;
      show?: boolean;
      /**
       * If pointer shows above title and detail
       */
      showAbove?: boolean;
      keepAspect?: boolean;
      itemStyle?: ItemStyleOption;
      /**
       * Can be percent
       */
      offsetCenter?: (number | string)[];
      length?: number | string;
      width?: number;
  }
  interface AnchorOption {
      show?: boolean;
      showAbove?: boolean;
      size?: number;
      icon?: string;
      offsetCenter?: (number | string)[];
      keepAspect?: boolean;
      itemStyle?: ItemStyleOption;
  }
  interface ProgressOption {
      show?: boolean;
      overlap?: boolean;
      width?: number;
      roundCap?: boolean;
      clip?: boolean;
      itemStyle?: ItemStyleOption;
  }
  interface TitleOption$1 extends LabelOption {
      /**
       * [x, y] offset
       */
      offsetCenter?: (number | string)[];
      formatter?: LabelFormatter$1 | string;
      /**
       * If do value animtion.
       */
      valueAnimation?: boolean;
  }
  interface DetailOption extends LabelOption {
      /**
       * [x, y] offset
       */
      offsetCenter?: (number | string)[];
      formatter?: LabelFormatter$1 | string;
      /**
       * If do value animtion.
       */
      valueAnimation?: boolean;
  }
  interface GaugeStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface GaugeStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
  }
  interface GaugeDataItemOption extends GaugeStateOption, StatesOptionMixin<GaugeStateOption<CallbackDataParams>, GaugeStatesMixin> {
      name?: string;
      value?: OptionDataValueNumeric;
      pointer?: PointerOption;
      progress?: ProgressOption;
      title?: TitleOption$1;
      detail?: DetailOption;
  }
  interface GaugeSeriesOption extends SeriesOption$1<GaugeStateOption, GaugeStatesMixin>, GaugeStateOption<CallbackDataParams>, CircleLayoutOptionMixin, SeriesEncodeOptionMixin {
      type?: 'gauge';
      radius?: number | string;
      startAngle?: number;
      endAngle?: number;
      clockwise?: boolean;
      min?: number;
      max?: number;
      splitNumber?: number;
      itemStyle?: ItemStyleOption;
      axisLine?: {
          show?: boolean;
          roundCap?: boolean;
          lineStyle?: Omit<LineStyleOption, 'color'> & {
              color?: GaugeColorStop[];
          };
      };
      progress?: ProgressOption;
      splitLine?: {
          show?: boolean;
          /**
           * Can be percent
           */
          length?: number;
          distance?: number;
          lineStyle?: LineStyleOption;
      };
      axisTick?: {
          show?: boolean;
          splitNumber?: number;
          /**
           * Can be percent
           */
          length?: number | string;
          distance?: number;
          lineStyle?: LineStyleOption;
      };
      axisLabel?: Omit<LabelOption, 'rotate'> & {
          formatter?: LabelFormatter$1 | string;
          rotate?: 'tangential' | 'radial' | number;
      };
      pointer?: PointerOption;
      anchor?: AnchorOption;
      title?: TitleOption$1;
      detail?: DetailOption;
      data?: (OptionDataValueNumeric | GaugeDataItemOption)[];
  }
  
  type FunnelLabelOption = Omit<SeriesLabelOption, 'position'> & {
      position?: LabelOption['position'] | 'outer' | 'inner' | 'center' | 'rightTop' | 'rightBottom' | 'leftTop' | 'leftBottom';
  };
  interface FunnelStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface FunnelCallbackDataParams extends CallbackDataParams {
      percent: number;
  }
  interface FunnelStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: FunnelLabelOption;
      labelLine?: LabelLineOption;
  }
  interface FunnelDataItemOption extends FunnelStateOption, StatesOptionMixin<FunnelStateOption, FunnelStatesMixin>, OptionDataItemObject<OptionDataValueNumeric> {
      itemStyle?: ItemStyleOption & {
          width?: number | string;
          height?: number | string;
      };
  }
  interface FunnelSeriesOption extends SeriesOption$1<FunnelStateOption<FunnelCallbackDataParams>, FunnelStatesMixin>, FunnelStateOption<FunnelCallbackDataParams>, BoxLayoutOptionMixin, SeriesEncodeOptionMixin {
      type?: 'funnel';
      min?: number;
      max?: number;
      /**
       * Absolute number or percent string
       */
      minSize?: number | string;
      maxSize?: number | string;
      sort?: 'ascending' | 'descending' | 'none';
      orient?: LayoutOrient;
      gap?: number;
      funnelAlign?: HorizontalAlign | VerticalAlign;
      data?: (OptionDataValueNumeric | OptionDataValueNumeric[] | FunnelDataItemOption)[];
  }
  
  type ParallelSeriesDataValue = OptionDataValue[];
  interface ParallelStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface ParallelStateOption<TCbParams = never> {
      lineStyle?: LineStyleOption<(TCbParams extends never ? never : (params: TCbParams) => ZRColor) | ZRColor>;
      label?: SeriesLabelOption;
  }
  interface ParallelSeriesDataItemOption extends ParallelStateOption, StatesOptionMixin<ParallelStateOption, ParallelStatesMixin> {
      value?: ParallelSeriesDataValue;
  }
  interface ParallelSeriesOption extends SeriesOption$1<ParallelStateOption<CallbackDataParams>, ParallelStatesMixin>, ParallelStateOption<CallbackDataParams>, SeriesEncodeOptionMixin {
      type?: 'parallel';
      coordinateSystem?: string;
      parallelIndex?: number;
      parallelId?: string;
      inactiveOpacity?: number;
      activeOpacity?: number;
      smooth?: boolean | number;
      realtime?: boolean;
      tooltip?: SeriesTooltipOption;
      parallelAxisDefault?: ParallelAxisOption;
      data?: (ParallelSeriesDataValue | ParallelSeriesDataItemOption)[];
  }
  
  type FocusNodeAdjacency = boolean | 'inEdges' | 'outEdges' | 'allEdges';
  interface SankeyNodeStateOption<TCbParams = never> {
      label?: SeriesLabelOption;
      itemStyle?: ItemStyleOption<TCbParams>;
  }
  interface SankeyEdgeStateOption {
      lineStyle?: SankeyEdgeStyleOption;
  }
  interface SankeyBothStateOption<TCbParams> extends SankeyNodeStateOption<TCbParams>, SankeyEdgeStateOption {
  }
  interface SankeyEdgeStyleOption extends LineStyleOption {
      curveness?: number;
  }
  interface ExtraStateOption$2 {
      emphasis?: {
          focus?: DefaultEmphasisFocus | 'adjacency' | 'trajectory';
      };
  }
  interface SankeyNodeItemOption extends SankeyNodeStateOption, StatesOptionMixin<SankeyNodeStateOption, ExtraStateOption$2>, OptionDataItemObject<OptionDataValue> {
      id?: string;
      localX?: number;
      localY?: number;
      depth?: number;
      draggable?: boolean;
      focusNodeAdjacency?: FocusNodeAdjacency;
  }
  interface SankeyEdgeItemOption extends SankeyEdgeStateOption, StatesOptionMixin<SankeyEdgeStateOption, ExtraStateOption$2>, GraphEdgeItemObject<OptionDataValueNumeric> {
      focusNodeAdjacency?: FocusNodeAdjacency;
      edgeLabel?: SeriesLabelOption;
  }
  interface SankeyLevelOption extends SankeyNodeStateOption, SankeyEdgeStateOption {
      depth: number;
  }
  interface SankeySeriesOption extends SeriesOption$1<SankeyBothStateOption<CallbackDataParams>, ExtraStateOption$2>, SankeyBothStateOption<CallbackDataParams>, BoxLayoutOptionMixin, RoamOptionMixin {
      type?: 'sankey';
      /**
       * color will be linear mapped.
       */
      color?: ColorString[];
      coordinateSystem?: 'view';
      orient?: LayoutOrient;
      /**
       * The width of the node
       */
      nodeWidth?: number;
      /**
       * The vertical distance between two nodes
       */
      nodeGap?: number;
      /**
       * Control if the node can move or not
       */
      draggable?: boolean;
      /**
       * Will be allEdges if true.
       * @deprecated
       */
      focusNodeAdjacency?: FocusNodeAdjacency;
      /**
       * The number of iterations to change the position of the node
       */
      layoutIterations?: number;
      nodeAlign?: 'justify' | 'left' | 'right';
      data?: SankeyNodeItemOption[];
      nodes?: SankeyNodeItemOption[];
      edges?: SankeyEdgeItemOption[];
      links?: SankeyEdgeItemOption[];
      levels?: SankeyLevelOption[];
      edgeLabel?: SeriesLabelOption & {
          position?: 'inside';
      };
  }
  
  class SeriesDimensionDefine {
      /**
       * Dimension type. The enumerable values are the key of
       * Optional.
       */
      type?: DimensionType;
      /**
       * Dimension name.
       * Mandatory.
       */
      name: string;
      /**
       * The origin name in dimsDef, see source helper.
       * If displayName given, the tooltip will displayed vertically.
       * Optional.
       */
      displayName?: string;
      tooltip?: boolean;
      /**
       * This dimension maps to the the dimension in dataStore by `storeDimIndex`.
       * Notice the facts:
       * 1. When there are too many dimensions in data store, seriesData only save the
       * used store dimensions.
       * 2. We use dimensionIndex but not name to reference store dimension
       * becuause the dataset dimension definition might has no name specified by users,
       * or names in sereis dimension definition might be different from dataset.
       */
      storeDimIndex?: number;
      /**
       * Which coordSys dimension this dimension mapped to.
       * A `coordDim` can be a "coordSysDim" that the coordSys required
       * (for example, an item in `coordSysDims` of `model/referHelper#CoordSysInfo`),
       * or an generated "extra coord name" if does not mapped to any "coordSysDim"
       * (That is determined by whether `isExtraCoord` is `true`).
       * Mandatory.
       */
      coordDim?: string;
      /**
       * The index of this dimension in `series.encode[coordDim]`.
       * Mandatory.
       */
      coordDimIndex?: number;
      /**
       * The format of `otherDims` is:
       * ```js
       * {
       *     tooltip?: number
       *     label?: number
       *     itemName?: number
       *     seriesName?: number
       * }
       * ```
       *
       * A `series.encode` can specified these fields:
       * ```js
       * encode: {
       *     // "3, 1, 5" is the index of data dimension.
       *     tooltip: [3, 1, 5],
       *     label: [0, 3],
       *     ...
       * }
       * ```
       * `otherDims` is the parse result of the `series.encode` above, like:
       * ```js
       * // Suppose the index of this data dimension is `3`.
       * this.otherDims = {
       *     // `3` is at the index `0` of the `encode.tooltip`
       *     tooltip: 0,
       *     // `3` is at the index `1` of the `encode.label`
       *     label: 1
       * };
       * ```
       *
       * This prop should never be `null`/`undefined` after initialized.
       */
      otherDims?: DataVisualDimensions;
      /**
       * Be `true` if this dimension is not mapped to any "coordSysDim" that the
       * "coordSys" required.
       * Mandatory.
       */
      isExtraCoord?: boolean;
      /**
       * If this dimension if for calculated value like stacking
       */
      isCalculationCoord?: boolean;
      defaultTooltip?: boolean;
      ordinalMeta?: OrdinalMeta;
      /**
       * Whether to create inverted indices.
       */
      createInvertedIndices?: boolean;
      /**
       * @param opt All of the fields will be shallow copied.
       */
      constructor(opt?: object | SeriesDimensionDefine);
  }
  
  /**
   * Multi dimensional data store
   */
  const dataCtors: {
      readonly float: ArrayConstructor | Float64ArrayConstructor;
      readonly int: ArrayConstructor | Int32ArrayConstructor;
      readonly ordinal: ArrayConstructor;
      readonly number: ArrayConstructor;
      readonly time: ArrayConstructor | Float64ArrayConstructor;
  };
  type DataStoreDimensionType = keyof typeof dataCtors;
  type EachCb = (...args: any) => void;
  type FilterCb = (...args: any) => boolean;
  type MapCb = (...args: any) => ParsedValue | ParsedValue[];
  type DimValueGetter = (this: DataStore, dataItem: any, property: string, dataIndex: number, dimIndex: DimensionIndex) => ParsedValue;
  interface DataStoreDimensionDefine {
      /**
       * Default to be float.
       */
      type?: DataStoreDimensionType;
      /**
       * Only used in SOURCE_FORMAT_OBJECT_ROWS and SOURCE_FORMAT_KEYED_COLUMNS to retrieve value
       * by "object property".
       * For example, in `[{bb: 124, aa: 543}, ...]`, "aa" and "bb" is "object property".
       *
       * Deliberately name it as "property" rather than "name" to prevent it from been used in
       * SOURCE_FORMAT_ARRAY_ROWS, because if it comes from series, it probably
       * can not be shared by different series.
       */
      property?: string;
      /**
       * When using category axis.
       * Category strings will be collected and stored in ordinalMeta.categories.
       * And store will store the index of categories.
       */
      ordinalMeta?: OrdinalMeta;
      /**
       * Offset for ordinal parsing and collect
       */
      ordinalOffset?: number;
  }
  /**
   * Basically, DataStore API keep immutable.
   */
  class DataStore {
      private _chunks;
      private _provider;
      private _rawExtent;
      private _extent;
      private _indices;
      private _count;
      private _rawCount;
      private _dimensions;
      private _dimValueGetter;
      private _calcDimNameToIdx;
      defaultDimValueGetter: DimValueGetter;
      /**
       * Initialize from data
       */
      initData(provider: DataProvider, inputDimensions: DataStoreDimensionDefine[], dimValueGetter?: DimValueGetter): void;
      getProvider(): DataProvider;
      /**
       * Caution: even when a `source` instance owned by a series, the created data store
       * may still be shared by different sereis (the source hash does not use all `source`
       * props, see `sourceManager`). In this case, the `source` props that are not used in
       * hash (like `source.dimensionDefine`) probably only belongs to a certain series and
       * thus should not be fetch here.
       */
      getSource(): Source;
      /**
       * @caution Only used in dataStack.
       */
      ensureCalculationDimension(dimName: DimensionName, type: DataStoreDimensionType): DimensionIndex;
      collectOrdinalMeta(dimIdx: number, ordinalMeta: OrdinalMeta): void;
      getOrdinalMeta(dimIdx: number): OrdinalMeta;
      getDimensionProperty(dimIndex: DimensionIndex): DataStoreDimensionDefine['property'];
      /**
       * Caution: Can be only called on raw data (before `this._indices` created).
       */
      appendData(data: ArrayLike<any>): number[];
      appendValues(values: any[][], minFillLen?: number): {
          start: number;
          end: number;
      };
      private _initDataFromProvider;
      count(): number;
      /**
       * Get value. Return NaN if idx is out of range.
       */
      get(dim: DimensionIndex, idx: number): ParsedValue;
      getValues(idx: number): ParsedValue[];
      getValues(dimensions: readonly DimensionIndex[], idx?: number): ParsedValue[];
      /**
       * @param dim concrete dim
       */
      getByRawIndex(dim: DimensionIndex, rawIdx: number): ParsedValue;
      /**
       * Get sum of data in one dimension
       */
      getSum(dim: DimensionIndex): number;
      /**
       * Get median of data in one dimension
       */
      getMedian(dim: DimensionIndex): number;
      /**
       * Retrieve the index with given raw data index.
       */
      indexOfRawIndex(rawIndex: number): number;
      getIndices(): ArrayLike<number>;
      /**
       * Data filter.
       */
      filter(dims: DimensionIndex[], cb: FilterCb): DataStore;
      /**
       * Select data in range. (For optimization of filter)
       * (Manually inline code, support 5 million data filtering in data zoom.)
       */
      selectRange(range: {
          [dimIdx: number]: [number, number];
      }): DataStore;
      /**
       * Data mapping to a new List with given dimensions
       */
      map(dims: DimensionIndex[], cb: MapCb): DataStore;
      /**
       * @caution Danger!! Only used in dataStack.
       */
      modify(dims: DimensionIndex[], cb: MapCb): void;
      private _updateDims;
      /**
       * Large data down sampling using largest-triangle-three-buckets
       * @param {string} valueDimension
       * @param {number} targetCount
       */
      lttbDownSample(valueDimension: DimensionIndex, rate: number): DataStore;
      /**
       * Large data down sampling using min-max
       * @param {string} valueDimension
       * @param {number} rate
       */
      minmaxDownSample(valueDimension: DimensionIndex, rate: number): DataStore;
      /**
       * Large data down sampling on given dimension
       * @param sampleIndex Sample index for name and id
       */
      downSample(dimension: DimensionIndex, rate: number, sampleValue: (frameValues: ArrayLike<ParsedValue>) => ParsedValueNumeric, sampleIndex: (frameValues: ArrayLike<ParsedValue>, value: ParsedValueNumeric) => number): DataStore;
      /**
       * Data iteration
       * @param ctx default this
       * @example
       *  list.each('x', function (x, idx) {});
       *  list.each(['x', 'y'], function (x, y, idx) {});
       *  list.each(function (idx) {})
       */
      each(dims: DimensionIndex[], cb: EachCb): void;
      /**
       * Get extent of data in one dimension
       */
      getDataExtent(dim: DimensionIndex): [number, number];
      /**
       * Get raw data index.
       * Do not initialize.
       * Default `getRawIndex`. And it can be changed.
       */
      getRawIndex: (idx: number) => number;
      /**
       * Get raw data item
       */
      getRawDataItem(idx: number): OptionDataItem;
      /**
       * Clone shallow.
       *
       * @param clonedDims Determine which dims to clone. Will share the data if not specified.
       */
      clone(clonedDims?: DimensionIndex[], ignoreIndices?: boolean): DataStore;
      private _copyCommonProps;
      private _cloneIndices;
      private _getRawIdxIdentity;
      private _getRawIdx;
      private _updateGetRawIdx;
      private static internalField;
  }
  
  /**
   * Represents the dimension requirement of a series.
   *
   * NOTICE:
   * When there are too many dimensions in dataset and many series, only the used dimensions
   * (i.e., used by coord sys and declared in `series.encode`) are add to `dimensionDefineList`.
   * But users may query data by other unused dimension names.
   * In this case, users can only query data if and only if they have defined dimension names
   * via ec option, so we provide `getDimensionIndexFromSource`, which only query them from
   * `source` dimensions.
   */
  class SeriesDataSchema {
      /**
       * When there are too many dimensions, `dimensionDefineList` might only contain
       * used dimensions.
       *
       * CAUTION:
       * Should have been sorted by `storeDimIndex` asc.
       *
       * PENDING:
       * The item can still be modified outsite.
       * But MUST NOT add/remove item of this array.
       */
      readonly dimensions: SeriesDimensionDefine[];
      readonly source: Source;
      private _fullDimCount;
      private _dimNameMap;
      private _dimOmitted;
      constructor(opt: {
          source: Source;
          dimensions: SeriesDimensionDefine[];
          fullDimensionCount: number;
          dimensionOmitted: boolean;
      });
      isDimensionOmitted(): boolean;
      private _updateDimOmitted;
      /**
       * @caution Can only be used when `dimensionOmitted: true`.
       *
       * Get index by user defined dimension name (i.e., not internal generate name).
       * That is, get index from `dimensionsDefine`.
       * If no `dimensionsDefine`, or no name get, return -1.
       */
      getSourceDimensionIndex(dimName: DimensionName): DimensionIndex;
      /**
       * @caution Can only be used when `dimensionOmitted: true`.
       *
       * Notice: may return `null`/`undefined` if user not specify dimension names.
       */
      getSourceDimension(dimIndex: DimensionIndex): DimensionDefinition;
      makeStoreSchema(): {
          dimensions: DataStoreDimensionDefine[];
          hash: string;
      };
      makeOutputDimensionNames(): DimensionName[];
      appendCalculationDimension(dimDef: SeriesDimensionDefine): void;
  }
  
  interface CoordDimensionDefinition extends DimensionDefinition {
      dimsDef?: (DimensionName | {
          name: DimensionName;
          defaultTooltip?: boolean;
      })[];
      otherDims?: DataVisualDimensions;
      ordinalMeta?: OrdinalMeta;
      coordDim?: DimensionName;
      coordDimIndex?: DimensionIndex;
  }
  type CoordDimensionDefinitionLoose = CoordDimensionDefinition['name'] | CoordDimensionDefinition;
  type PrepareSeriesDataSchemaParams = {
      coordDimensions?: CoordDimensionDefinitionLoose[];
      /**
       * Will use `source.dimensionsDefine` if not given.
       */
      dimensionsDefine?: DimensionDefinitionLoose[];
      /**
       * Will use `source.encodeDefine` if not given.
       */
      encodeDefine?: HashMap<OptionEncodeValue, DimensionName> | OptionEncode;
      dimensionsCount?: number;
      /**
       * Make default encode if user not specified.
       */
      encodeDefaulter?: EncodeDefaulter;
      generateCoord?: string;
      generateCoordCount?: number;
      /**
       * If be able to omit unused dimension
       * Used to improve the performance on high dimension data.
       */
      canOmitUnusedDimensions?: boolean;
  };
  /**
   * For outside usage compat (like echarts-gl are using it).
   */
  function createDimensions(source: Source | OptionSourceData, opt?: PrepareSeriesDataSchemaParams): SeriesDimensionDefine[];
  
  type BoxplotDataValue = OptionDataValueNumeric[];
  interface BoxplotStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
  }
  interface BoxplotDataItemOption extends BoxplotStateOption, StatesOptionMixin<BoxplotStateOption, ExtraStateOption$3> {
      value: BoxplotDataValue;
  }
  interface ExtraStateOption$3 {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean;
      };
  }
  interface BoxplotSeriesOption extends SeriesOption$1<BoxplotStateOption<CallbackDataParams>, ExtraStateOption$3>, BoxplotStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesEncodeOptionMixin {
      type?: 'boxplot';
      coordinateSystem?: 'cartesian2d';
      layout?: LayoutOrient;
      /**
       * [min, max] can be percent of band width.
       */
      boxWidth?: (string | number)[];
      data?: (BoxplotDataValue | BoxplotDataItemOption)[];
  }
  
  type CandlestickDataValue = OptionDataValue[];
  interface CandlestickItemStyleOption extends ItemStyleOption {
      color0?: ZRColor;
      borderColor0?: ColorString;
      borderColorDoji?: ZRColor;
  }
  interface CandlestickStateOption {
      itemStyle?: CandlestickItemStyleOption;
      label?: SeriesLabelOption;
  }
  interface CandlestickDataItemOption extends CandlestickStateOption, StatesOptionMixin<CandlestickStateOption, ExtraStateOption$4> {
      value: CandlestickDataValue;
  }
  interface ExtraStateOption$4 {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean;
      };
  }
  interface CandlestickSeriesOption extends SeriesOption$1<CandlestickStateOption, ExtraStateOption$4>, CandlestickStateOption, SeriesOnCartesianOptionMixin, SeriesLargeOptionMixin, SeriesEncodeOptionMixin {
      type?: 'candlestick';
      coordinateSystem?: 'cartesian2d';
      layout?: LayoutOrient;
      clip?: boolean;
      barMaxWidth?: number | string;
      barMinWidth?: number | string;
      barWidth?: number | string;
      data?: (CandlestickDataValue | CandlestickDataItemOption)[];
  }
  
  interface RippleEffectOption {
      period?: number;
      /**
       * Scale of ripple
       */
      scale?: number;
      brushType?: 'fill' | 'stroke';
      color?: ZRColor;
      /**
       * ripple number
       */
      number?: number;
  }
  interface SymbolDrawStateOption {
      itemStyle?: ItemStyleOption;
      label?: LabelOption;
  }
  interface SymbolDrawItemModelOption extends SymbolOptionMixin<object>, StatesOptionMixin<SymbolDrawStateOption, {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean | number;
      };
  }>, SymbolDrawStateOption {
      cursor?: string;
      rippleEffect?: RippleEffectOption;
  }
  
  type ScatterDataValue = OptionDataValue | OptionDataValue[];
  interface EffectScatterStatesOptionMixin {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean | number;
      };
  }
  interface EffectScatterStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams>;
      label?: SeriesLabelOption;
  }
  interface EffectScatterDataItemOption extends SymbolOptionMixin, EffectScatterStateOption, StatesOptionMixin<EffectScatterStateOption, EffectScatterStatesOptionMixin> {
      name?: string;
      value?: ScatterDataValue;
      rippleEffect?: SymbolDrawItemModelOption['rippleEffect'];
  }
  interface EffectScatterSeriesOption extends SeriesOption$1<EffectScatterStateOption<CallbackDataParams>, EffectScatterStatesOptionMixin>, EffectScatterStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesOnGeoOptionMixin, SeriesOnSingleOptionMixin, SymbolOptionMixin<CallbackDataParams>, SeriesEncodeOptionMixin {
      type?: 'effectScatter';
      coordinateSystem?: string;
      effectType?: 'ripple';
      /**
       * When to show the effect
       */
      showEffectOn?: 'render' | 'emphasis';
      clip?: boolean;
      /**
       * Ripple effect config
       */
      rippleEffect?: SymbolDrawItemModelOption['rippleEffect'];
      data?: (EffectScatterDataItemOption | ScatterDataValue)[];
  }
  
  interface LineDrawStateOption {
      lineStyle?: LineStyleOption;
      label?: LineLabelOption;
  }
  interface LineDrawModelOption extends LineDrawStateOption, StatesOptionMixin<LineDrawStateOption, {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
      };
  }> {
      effect?: {
          show?: boolean;
          period?: number;
          delay?: number | ((idx: number) => number);
          /**
           * If move with constant speed px/sec
           * period will be ignored if this property is > 0,
           */
          constantSpeed?: number;
          symbol?: string;
          symbolSize?: number | number[];
          loop?: boolean;
          roundTrip?: boolean;
          /**
           * Length of trail, 0 - 1
           */
          trailLength?: number;
          /**
           * Default to be same with lineStyle.color
           */
          color?: ColorString;
      };
  }
  
  type LinesCoords = number[][];
  type LinesValue = OptionDataValue | OptionDataValue[];
  interface LinesLineStyleOption<TClr> extends LineStyleOption<TClr> {
      curveness?: number;
  }
  interface LinesStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface LinesStateOption<TCbParams = never> {
      lineStyle?: LinesLineStyleOption<(TCbParams extends never ? never : (params: TCbParams) => ZRColor) | ZRColor>;
      label?: SeriesLineLabelOption;
  }
  interface LinesDataItemOption extends LinesStateOption, StatesOptionMixin<LinesStateOption, LinesStatesMixin> {
      name?: string;
      fromName?: string;
      toName?: string;
      symbol?: string[] | string;
      symbolSize?: number[] | number;
      coords?: LinesCoords;
      value?: LinesValue;
      effect?: LineDrawModelOption['effect'];
  }
  interface LinesSeriesOption extends SeriesOption$1<LinesStateOption, LinesStatesMixin>, LinesStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesOnGeoOptionMixin, SeriesOnPolarOptionMixin, SeriesOnCalendarOptionMixin, SeriesLargeOptionMixin {
      type?: 'lines';
      coordinateSystem?: string;
      symbol?: string[] | string;
      symbolSize?: number[] | number;
      effect?: LineDrawModelOption['effect'];
      /**
       * If lines are polyline
       * polyline not support curveness, label, animation
       */
      polyline?: boolean;
      /**
       * If clip the overflow.
       * Available when coordinateSystem is cartesian or polar.
       */
      clip?: boolean;
      data?: LinesDataItemOption[] | ArrayLike<number>;
      dimensions?: DimensionDefinitionLoose | DimensionDefinitionLoose[];
  }
  
  type HeatmapDataValue = OptionDataValue[];
  interface HeatmapStateOption<TCbParams = never> {
      itemStyle?: ItemStyleOption<TCbParams> & {
          borderRadius?: number | number[];
      };
      label?: SeriesLabelOption;
  }
  interface HeatmapStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface HeatmapDataItemOption extends HeatmapStateOption, StatesOptionMixin<HeatmapStateOption, HeatmapStatesMixin> {
      value: HeatmapDataValue;
  }
  interface HeatmapSeriesOption extends SeriesOption$1<HeatmapStateOption<CallbackDataParams>, HeatmapStatesMixin>, HeatmapStateOption<CallbackDataParams>, SeriesOnCartesianOptionMixin, SeriesOnGeoOptionMixin, SeriesOnCalendarOptionMixin, SeriesEncodeOptionMixin {
      type?: 'heatmap';
      coordinateSystem?: 'cartesian2d' | 'geo' | 'calendar' | 'matrix';
      blurSize?: number;
      pointSize?: number;
      maxOpacity?: number;
      minOpacity?: number;
      data?: (HeatmapDataItemOption | HeatmapDataValue)[];
  }
  
  interface PictorialBarStateOption {
      itemStyle?: ItemStyleOption;
      label?: SeriesLabelOption<CallbackDataParams, {
          positionExtra: 'outside';
      }>;
  }
  interface PictorialBarSeriesSymbolOption {
      /**
       * Customized bar shape
       */
      symbol?: string;
      /**
       * Can be ['100%', '100%'], null means auto.
       * The percent will be relative to category width. If no repeat.
       * Will be relative to symbolBoundingData.
       */
      symbolSize?: (number | string)[] | number | string;
      symbolRotate?: number;
      /**
       * Default to be auto
       */
      symbolPosition?: 'start' | 'end' | 'center';
      /**
       * Can be percent offset relative to the symbolSize
       */
      symbolOffset?: (number | string)[] | number | string;
      /**
       * start margin and end margin. Can be a number or a percent string relative to symbolSize.
       * Auto margin by default.
       */
      symbolMargin?: (number | string)[] | number | string;
      /**
       * true: means auto calculate repeat times and cut by data.
       * a number: specifies repeat times, and do not cut by data.
       * 'fixed': means auto calculate repeat times but do not cut by data.
       *
       * Otherwise means no repeat
       */
      symbolRepeat?: boolean | number | 'fixed';
      /**
       * From start to end or end to start.
       */
      symbolRepeatDirection?: 'start' | 'end';
      symbolClip?: boolean;
      /**
       * It will define the size of graphic elements.
       */
      symbolBoundingData?: number | number[];
      symbolPatternSize?: number;
  }
  interface ExtraStateOption$5 {
      emphasis?: {
          focus?: DefaultEmphasisFocus;
          scale?: boolean;
      };
  }
  interface PictorialBarDataItemOption extends PictorialBarSeriesSymbolOption, AnimationOptionMixin, PictorialBarStateOption, StatesOptionMixin<PictorialBarStateOption, ExtraStateOption$5>, OptionDataItemObject<OptionDataValue> {
      z?: number;
      cursor?: string;
  }
  interface PictorialBarSeriesOption extends BaseBarSeriesOption<PictorialBarStateOption, ExtraStateOption$5>, PictorialBarStateOption, PictorialBarSeriesSymbolOption, SeriesStackOptionMixin, SeriesEncodeOptionMixin {
      type?: 'pictorialBar';
      coordinateSystem?: 'cartesian2d';
      data?: (PictorialBarDataItemOption | OptionDataValue | OptionDataValue[])[];
      clip?: boolean;
  }
  
  interface ThemeRiverSeriesLabelOption extends SeriesLabelOption {
      margin?: number;
  }
  type ThemerRiverDataItem = [OptionDataValueDate, OptionDataValueNumeric, string];
  interface ThemeRiverStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface ThemeRiverStateOption<TCbParams = never> {
      label?: ThemeRiverSeriesLabelOption;
      itemStyle?: ItemStyleOption<TCbParams>;
  }
  interface ThemeRiverSeriesOption extends SeriesOption$1<ThemeRiverStateOption<CallbackDataParams>, ThemeRiverStatesMixin>, ThemeRiverStateOption<CallbackDataParams>, SeriesOnSingleOptionMixin, BoxLayoutOptionMixin {
      type?: 'themeRiver';
      color?: ZRColor[];
      coordinateSystem?: 'singleAxis';
      /**
       * gap in axis's orthogonal orientation
       */
      boundaryGap?: (string | number)[];
      /**
       * [date, value, name]
       */
      data?: ThemerRiverDataItem[];
  }
  
  interface SunburstItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      borderRadius?: (number | string)[] | number | string;
  }
  interface SunburstLabelOption extends Omit<SeriesLabelOption<SunburstDataParams>, 'rotate' | 'position'> {
      rotate?: 'radial' | 'tangential' | number;
      minAngle?: number;
      silent?: boolean;
      position?: SeriesLabelOption['position'] | 'outside';
  }
  interface SunburstDataParams extends CallbackDataParams {
      treePathInfo: {
          name: string;
          dataIndex: number;
          value: SunburstSeriesNodeItemOption['value'];
      }[];
  }
  interface SunburstStatesMixin {
      emphasis?: {
          focus?: DefaultEmphasisFocus | 'descendant' | 'ancestor' | 'relative';
      };
  }
  interface SunburstStateOption<TCbParams = never> {
      itemStyle?: SunburstItemStyleOption<TCbParams>;
      label?: SunburstLabelOption;
  }
  interface SunburstSeriesNodeItemOption extends SunburstStateOption<SunburstDataParams>, StatesOptionMixin<SunburstStateOption<SunburstDataParams>, SunburstStatesMixin>, OptionDataItemObject<OptionDataValue> {
      nodeClick?: 'rootToNode' | 'link' | false;
      link?: string;
      target?: string;
      children?: SunburstSeriesNodeItemOption[];
      collapsed?: boolean;
      cursor?: string;
  }
  interface SunburstSeriesLevelOption extends SunburstStateOption<SunburstDataParams>, StatesOptionMixin<SunburstStateOption<SunburstDataParams>, SunburstStatesMixin> {
      radius?: (number | string)[];
      /**
       * @deprecated use radius instead
       */
      r?: number | string;
      /**
       * @deprecated use radius instead
       */
      r0?: number | string;
      highlight?: {
          itemStyle?: SunburstItemStyleOption;
          label?: SunburstLabelOption;
      };
  }
  interface SortParam {
      dataIndex: number;
      depth: number;
      height: number;
      getValue(): number;
  }
  interface SunburstSeriesOption extends SeriesOption$1<SunburstStateOption<SunburstDataParams>, SunburstStatesMixin>, SunburstStateOption<SunburstDataParams>, SunburstColorByMixin, CircleLayoutOptionMixin {
      type?: 'sunburst';
      clockwise?: boolean;
      startAngle?: number;
      minAngle?: number;
      /**
       * If still show when all data zero.
       */
      stillShowZeroSum?: boolean;
      /**
       * Policy of highlighting pieces when hover on one
       * Valid values: 'none' (for not downplay others), 'descendant',
       * 'ancestor', 'self'
       */
      nodeClick?: 'rootToNode' | 'link' | false;
      renderLabelForZeroData?: boolean;
      data?: SunburstSeriesNodeItemOption[];
      levels?: SunburstSeriesLevelOption[];
      animationType?: 'expansion' | 'scale';
      sort?: 'desc' | 'asc' | ((a: SortParam, b: SortParam) => number);
  }
  
  interface TransitionOptionMixin<T = Record<string, any>> {
      transition?: (keyof T & string) | ((keyof T & string)[]) | 'all';
      enterFrom?: T;
      leaveTo?: T;
      enterAnimation?: AnimationOption$1;
      updateAnimation?: AnimationOption$1;
      leaveAnimation?: AnimationOption$1;
  }
  interface TransitionBaseDuringAPI {
      setTransform(key: TransformProp, val: number): this;
      getTransform(key: TransformProp): number;
      setExtra(key: string, val: unknown): this;
      getExtra(key: string): unknown;
  }
  interface TransitionDuringAPI<StyleOpt extends any = any, ShapeOpt extends any = any> extends TransitionBaseDuringAPI {
      setShape<T extends keyof ShapeOpt>(key: T, val: ShapeOpt[T]): this;
      getShape<T extends keyof ShapeOpt>(key: T): ShapeOpt[T];
      setStyle<T extends keyof StyleOpt>(key: T, val: StyleOpt[T]): this;
      getStyle<T extends keyof StyleOpt>(key: T): StyleOpt[T];
  }
  
  type AnimationKeyframe<T extends Record<string, any>> = T & {
      easing?: AnimationEasing;
      percent?: number;
  };
  interface ElementKeyframeAnimationOption<Props extends Record<string, any>> extends AnimationOption$1 {
      loop?: boolean;
      keyframes?: AnimationKeyframe<Props>[];
  }
  
  interface GraphicComponentBaseElementOption extends Partial<Pick<Element, TransformProp | 'silent' | 'ignore' | 'textConfig' | 'draggable' | ElementEventNameWithOn>>, 
  /**
   * left/right/top/bottom: (like 12, '22%', 'center', default undefined)
   * If left/right is set, shape.x/shape.cx/position will not be used.
   * If top/bottom is set, shape.y/shape.cy/position will not be used.
   * This mechanism is useful when you want to position a group/element
   * against the right side or the center of this container.
   */
  Partial<Pick<BoxLayoutOptionMixin, 'left' | 'right' | 'top' | 'bottom'>> {
      /**
       * element type, mandatory.
       * Only can be omit if call setOption not at the first time and perform merge.
       */
      type?: string;
      id?: OptionId;
      name?: string;
      parentId?: OptionId;
      parentOption?: GraphicComponentElementOption;
      children?: GraphicComponentElementOption[];
      hv?: [boolean, boolean];
      /**
       * bounding: (enum: 'all' (default) | 'raw')
       * Specify how to calculate boundingRect when locating.
       * 'all': Get uioned and transformed boundingRect
       *     from both itself and its descendants.
       *     This mode simplies confining a group of elements in the bounding
       *     of their ancester container (e.g., using 'right: 0').
       * 'raw': Only use the boundingRect of itself and before transformed.
       *     This mode is similar to css behavior, which is useful when you
       *     want an element to be able to overflow its container. (Consider
       *     a rotated circle needs to be located in a corner.)
       */
      bounding?: 'raw' | 'all';
      /**
       * info: custom info. enables user to mount some info on elements and use them
       * in event handlers. Update them only when user specified, otherwise, remain.
       */
      info?: GraphicExtraElementInfo;
      clipPath?: Omit<GraphicComponentZRPathOption, 'clipPath'> | false;
      textContent?: Omit<GraphicComponentTextOption, 'clipPath'>;
      textConfig?: ElementTextConfig;
      $action?: 'merge' | 'replace' | 'remove';
      tooltip?: CommonTooltipOption<unknown>;
      enterAnimation?: AnimationOption$1;
      updateAnimation?: AnimationOption$1;
      leaveAnimation?: AnimationOption$1;
  }
  interface GraphicComponentDisplayableOption extends GraphicComponentBaseElementOption, Partial<Pick<Displayable, 'zlevel' | 'z' | 'z2' | 'invisible' | 'cursor'>> {
      style?: ZRStyleProps;
      z2?: number;
  }
  interface GraphicComponentGroupOption extends GraphicComponentBaseElementOption, TransitionOptionMixin<GroupProps> {
      type?: 'group';
      /**
       * width/height: (can only be pixel value, default 0)
       * Is only used to specify container (group) size, if needed. And
       * cannot be a percentage value (like '33%'). See the reason in the
       * layout algorithm below.
       */
      width?: number;
      height?: number;
      children: GraphicComponentElementOption[];
      keyframeAnimation?: ElementKeyframeAnimationOption<GroupProps> | ElementKeyframeAnimationOption<GroupProps>[];
  }
  interface GraphicComponentZRPathOption extends GraphicComponentDisplayableOption, TransitionOptionMixin<PathProps> {
      shape?: PathProps['shape'] & TransitionOptionMixin<PathProps['shape']>;
      style?: PathStyleProps & TransitionOptionMixin<PathStyleProps>;
      keyframeAnimation?: ElementKeyframeAnimationOption<PathProps> | ElementKeyframeAnimationOption<PathProps>[];
  }
  interface GraphicComponentImageOption extends GraphicComponentDisplayableOption, TransitionOptionMixin<ImageProps> {
      type?: 'image';
      style?: ImageStyleProps & TransitionOptionMixin<ImageStyleProps>;
      keyframeAnimation?: ElementKeyframeAnimationOption<ImageProps> | ElementKeyframeAnimationOption<ImageProps>[];
  }
  interface GraphicComponentTextOption extends Omit<GraphicComponentDisplayableOption, 'textContent' | 'textConfig'>, TransitionOptionMixin<TextProps> {
      type?: 'text';
      style?: TextStyleProps & TransitionOptionMixin<TextStyleProps>;
      keyframeAnimation?: ElementKeyframeAnimationOption<TextProps> | ElementKeyframeAnimationOption<TextProps>[];
  }
  type GraphicComponentElementOption = GraphicComponentGroupOption | GraphicComponentZRPathOption | GraphicComponentImageOption | GraphicComponentTextOption;
  type GraphicExtraElementInfo = Dictionary<unknown>;
  type GraphicComponentLooseOption = (GraphicComponentOption | GraphicComponentElementOption) & {
      mainType?: 'graphic';
  };
  interface GraphicComponentOption extends ComponentOption, AnimationOptionMixin {
      elements?: GraphicComponentElementOption[];
  }
  
  const ICON_TYPES: readonly ["rect", "polygon", "lineX", "lineY", "keep", "clear"];
  type IconType = typeof ICON_TYPES[number];
  interface ToolboxBrushFeatureOption extends ToolboxFeatureOption {
      type?: IconType[];
      icon?: {
          [key in IconType]?: string;
      };
      title?: {
          [key in IconType]?: string;
      };
  }
  
  interface ToolboxDataViewFeatureOption extends ToolboxFeatureOption {
      readOnly?: boolean;
      optionToContent?: (option: ECUnitOption) => string | HTMLElement;
      contentToOption?: (viewMain: HTMLDivElement, oldOption: ECUnitOption) => ECUnitOption;
      icon?: string;
      title?: string;
      lang?: string[];
      backgroundColor?: ColorString;
      textColor?: ColorString;
      textareaColor?: ColorString;
      textareaBorderColor?: ColorString;
      buttonColor?: ColorString;
      buttonTextColor?: ColorString;
  }
  
  const ICON_TYPES$1: readonly ["zoom", "back"];
  type IconType$1 = typeof ICON_TYPES$1[number];
  interface ToolboxDataZoomFeatureOption extends ToolboxFeatureOption {
      type?: IconType$1[];
      icon?: {
          [key in IconType$1]?: string;
      };
      title?: {
          [key in IconType$1]?: string;
      };
      filterMode?: 'filter' | 'weakFilter' | 'empty' | 'none';
      xAxisIndex?: ModelFinderIndexQuery;
      yAxisIndex?: ModelFinderIndexQuery;
      xAxisId?: ModelFinderIdQuery;
      yAxisId?: ModelFinderIdQuery;
      brushStyle?: ItemStyleOption;
  }
  
  const ICON_TYPES$2: readonly ["line", "bar", "stack"];
  const TITLE_TYPES: readonly ["line", "bar", "stack", "tiled"];
  type IconType$2 = typeof ICON_TYPES$2[number];
  type TitleType = typeof TITLE_TYPES[number];
  interface ToolboxMagicTypeFeatureOption extends ToolboxFeatureOption {
      type?: IconType$2[];
      /**
       * Icon group
       */
      icon?: {
          [key in IconType$2]?: string;
      };
      title?: {
          [key in TitleType]?: string;
      };
      option?: {
          [key in IconType$2]?: SeriesOption$1;
      };
      /**
       * Map of seriesType: seriesIndex
       */
      seriesIndex?: {
          line?: number;
          bar?: number;
      };
  }
  
  interface ToolboxRestoreFeatureOption extends ToolboxFeatureOption {
      icon?: string;
      title?: string;
  }
  
  interface ToolboxSaveAsImageFeatureOption extends ToolboxFeatureOption {
      icon?: string;
      title?: string;
      type?: 'png' | 'jpeg';
      backgroundColor?: ZRColor;
      connectedBackgroundColor?: ZRColor;
      name?: string;
      excludeComponents?: string[];
      pixelRatio?: number;
      lang?: string[];
  }
  
  interface ToolboxComponentOption extends ToolboxOption {
      feature?: {
          brush?: ToolboxBrushFeatureOption;
          dataView?: ToolboxDataViewFeatureOption;
          dataZoom?: ToolboxDataZoomFeatureOption;
          magicType?: ToolboxMagicTypeFeatureOption;
          restore?: ToolboxRestoreFeatureOption;
          saveAsImage?: ToolboxSaveAsImageFeatureOption;
          [key: string]: ToolboxFeatureOption | {
              [key: string]: any;
          } | undefined;
      };
  }
  
  type DataZoomComponentOption = SliderDataZoomOption | InsideDataZoomOption;
  
  type VisualMapComponentOption = ContinousVisualMapOption | PiecewiseVisualMapOption;
  
  type LegendComponentOption = LegendOption | ScrollableLegendOption;
  
  type SeriesInjectedOption = {
      markArea?: MarkAreaOption;
      markLine?: MarkLineOption;
      markPoint?: MarkPointOption;
      tooltip?: SeriesTooltipOption;
  };
  type LineSeriesOption$1 = LineSeriesOption & SeriesInjectedOption;
  type BarSeriesOption = BarSeriesOption$1 & SeriesInjectedOption;
  type ScatterSeriesOption$1 = ScatterSeriesOption & SeriesInjectedOption;
  type PieSeriesOption$1 = PieSeriesOption & SeriesInjectedOption;
  type RadarSeriesOption$1 = RadarSeriesOption & SeriesInjectedOption;
  type MapSeriesOption$1 = MapSeriesOption & SeriesInjectedOption;
  type TreeSeriesOption$1 = TreeSeriesOption & SeriesInjectedOption;
  type TreemapSeriesOption$1 = TreemapSeriesOption & SeriesInjectedOption;
  type GraphSeriesOption$1 = GraphSeriesOption & SeriesInjectedOption;
  type ChordSeriesOption$1 = ChordSeriesOption & SeriesInjectedOption;
  type GaugeSeriesOption$1 = GaugeSeriesOption & SeriesInjectedOption;
  type FunnelSeriesOption$1 = FunnelSeriesOption & SeriesInjectedOption;
  type ParallelSeriesOption$1 = ParallelSeriesOption & SeriesInjectedOption;
  type SankeySeriesOption$1 = SankeySeriesOption & SeriesInjectedOption;
  type BoxplotSeriesOption$1 = BoxplotSeriesOption & SeriesInjectedOption;
  type CandlestickSeriesOption$1 = CandlestickSeriesOption & SeriesInjectedOption;
  type EffectScatterSeriesOption$1 = EffectScatterSeriesOption & SeriesInjectedOption;
  type LinesSeriesOption$1 = LinesSeriesOption & SeriesInjectedOption;
  type HeatmapSeriesOption$1 = HeatmapSeriesOption & SeriesInjectedOption;
  type PictorialBarSeriesOption$1 = PictorialBarSeriesOption & SeriesInjectedOption;
  type ThemeRiverSeriesOption$1 = ThemeRiverSeriesOption & SeriesInjectedOption;
  type SunburstSeriesOption$1 = SunburstSeriesOption & SeriesInjectedOption;
  type CustomSeriesOption = CustomSeriesOption$1 & SeriesInjectedOption;
  /**
   * A map from series 'type' to series option
   * It's used for declaration merging in echarts extensions.
   * For example:
   * ```ts
   * import echarts from 'echarts';
   * module 'echarts/types/dist/echarts' {
   *   interface RegisteredSeriesOption {
   *     wordCloud: WordCloudSeriesOption
   *   }
   * }
   * ```
   */
  interface RegisteredSeriesOption {
      line: LineSeriesOption$1;
      bar: BarSeriesOption;
      scatter: ScatterSeriesOption$1;
      pie: PieSeriesOption$1;
      radar: RadarSeriesOption$1;
      map: MapSeriesOption$1;
      tree: TreeSeriesOption$1;
      treemap: TreemapSeriesOption$1;
      graph: GraphSeriesOption$1;
      chord: ChordSeriesOption$1;
      gauge: GaugeSeriesOption$1;
      funnel: FunnelSeriesOption$1;
      parallel: ParallelSeriesOption$1;
      sankey: SankeySeriesOption$1;
      boxplot: BoxplotSeriesOption$1;
      candlestick: CandlestickSeriesOption$1;
      effectScatter: EffectScatterSeriesOption$1;
      lines: LinesSeriesOption$1;
      heatmap: HeatmapSeriesOption$1;
      pictorialBar: PictorialBarSeriesOption$1;
      themeRiver: ThemeRiverSeriesOption$1;
      sunburst: SunburstSeriesOption$1;
      custom: CustomSeriesOption;
  }
  type Values<T> = T[keyof T];
  type SeriesOption = Values<RegisteredSeriesOption>;
  interface EChartsOption extends ECBasicOption {
      dataset?: DatasetOption | DatasetOption[];
      aria?: AriaOption;
      title?: TitleOption | TitleOption[];
      grid?: GridOption | GridOption[];
      radar?: RadarOption | RadarOption[];
      polar?: PolarOption | PolarOption[];
      geo?: GeoOption | GeoOption[];
      angleAxis?: AngleAxisOption | AngleAxisOption[];
      radiusAxis?: RadiusAxisOption | RadiusAxisOption[];
      xAxis?: XAXisOption | XAXisOption[];
      yAxis?: YAXisOption | YAXisOption[];
      singleAxis?: SingleAxisOption | SingleAxisOption[];
      parallel?: ParallelCoordinateSystemOption | ParallelCoordinateSystemOption[];
      parallelAxis?: ParallelAxisOption | ParallelAxisOption[];
      calendar?: CalendarOption | CalendarOption[];
      matrix?: MatrixOption | MatrixOption[];
      toolbox?: ToolboxComponentOption | ToolboxComponentOption[];
      tooltip?: TooltipOption | TooltipOption[];
      axisPointer?: AxisPointerOption | AxisPointerOption[];
      brush?: BrushOption | BrushOption[];
      timeline?: TimelineOption | SliderTimelineOption;
      legend?: LegendComponentOption | (LegendComponentOption)[];
      dataZoom?: DataZoomComponentOption | (DataZoomComponentOption)[];
      visualMap?: VisualMapComponentOption | (VisualMapComponentOption)[];
      thumbnail?: ThumbnailOption | (ThumbnailOption)[];
      graphic?: GraphicComponentLooseOption | GraphicComponentLooseOption[];
      series?: SeriesOption | SeriesOption[];
      options?: EChartsOption[];
      baseOption?: EChartsOption;
  }
  
  type GeoSVGSourceInput = string | Document | SVGElement;
  type GeoJSONSourceInput = string | GeoJSON | GeoJSONCompressed;
  interface NameMap {
      [regionName: string]: string;
  }
  interface GeoSpecialAreas {
      [areaName: string]: {
          left: number;
          top: number;
          width?: number;
          height?: number;
      };
  }
  interface GeoJSON extends GeoJSONFeatureCollection<GeoJSONGeometry> {
  }
  interface GeoJSONCompressed extends GeoJSONFeatureCollection<GeoJSONGeometryCompressed> {
      UTF8Encoding?: boolean;
      UTF8Scale?: number;
  }
  interface GeoJSONFeatureCollection<G> {
      type: 'FeatureCollection';
      features: GeoJSONFeature<G>[];
  }
  interface GeoJSONFeature<G = GeoJSONGeometry> {
      type: 'Feature';
      id?: string | number;
      properties: {
          name?: string;
          cp?: number[];
          [key: string]: any;
      };
      geometry: G;
  }
  type GeoJSONGeometry = GeoJSONGeometryPoint | GeoJSONGeometryMultiPoint | GeoJSONGeometryLineString | GeoJSONGeometryMultiLineString | GeoJSONGeometryPolygon | GeoJSONGeometryMultiPolygon;
  type GeoJSONGeometryCompressed = GeoJSONGeometryPolygonCompressed | GeoJSONGeometryMultiPolygonCompressed | GeoJSONGeometryLineStringCompressed | GeoJSONGeometryMultiLineStringCompressed;
  interface GeoJSONGeometryPoint {
      type: 'Point';
      coordinates: number[];
  }
  interface GeoJSONGeometryMultiPoint {
      type: 'MultiPoint';
      coordinates: number[][];
  }
  interface GeoJSONGeometryLineString {
      type: 'LineString';
      coordinates: number[][];
  }
  interface GeoJSONGeometryLineStringCompressed {
      type: 'LineString';
      coordinates: string;
      encodeOffsets: number[];
  }
  interface GeoJSONGeometryMultiLineString {
      type: 'MultiLineString';
      coordinates: number[][][];
  }
  interface GeoJSONGeometryMultiLineStringCompressed {
      type: 'MultiLineString';
      coordinates: string[];
      encodeOffsets: number[][];
  }
  interface GeoJSONGeometryPolygon {
      type: 'Polygon';
      coordinates: number[][][];
  }
  interface GeoJSONGeometryPolygonCompressed {
      type: 'Polygon';
      coordinates: string[];
      encodeOffsets: number[][];
  }
  interface GeoJSONGeometryMultiPolygon {
      type: 'MultiPolygon';
      coordinates: number[][][][];
  }
  interface GeoJSONGeometryMultiPolygonCompressed {
      type: 'MultiPolygon';
      coordinates: string[][];
      encodeOffsets: number[][][];
  }
  interface GeoResource {
      readonly type: 'geoJSON' | 'geoSVG';
      load(nameMap: NameMap, nameProperty: string): {
          boundingRect: BoundingRect;
          regions: Region[];
          regionsMap: HashMap<Region>;
      };
  }
  /**
   * Geo stream interface compatitable with d3-geo
   * See the API detail in https://github.com/d3/d3-geo#streams
   */
  interface ProjectionStream {
      point(x: number, y: number): void;
      lineStart(): void;
      lineEnd(): void;
      polygonStart(): void;
      polygonEnd(): void;
      /**
       * Not supported yet.
       */
      sphere(): void;
  }
  interface GeoProjection {
      project(point: number[]): number[];
      unproject(point: number[]): number[];
      /**
       * Projection stream compatitable to d3-geo projection stream.
       *
       * When rotate projection is used. It may have antimeridian artifacts.
       * So we need to introduce the fule projection stream to do antimeridian clipping.
       *
       * project will be ignored if projectStream is given.
       */
      stream?(outStream: ProjectionStream): ProjectionStream;
  }
  
  abstract class Region {
      readonly name: string;
      readonly type: 'geoJSON' | 'geoSVG';
      protected _center: number[];
      protected _rect: BoundingRect;
      constructor(name: string);
      setCenter(center: number[]): void;
      /**
       * Get center point in data unit. That is,
       * for GeoJSONRegion, the unit is lat/lng,
       * for GeoSVGRegion, the unit is SVG local coord.
       */
      getCenter(): number[];
      abstract calcCenter(): number[];
  }
  class GeoJSONPolygonGeometry {
      readonly type = "polygon";
      exterior: number[][];
      interiors?: number[][][];
      constructor(exterior: number[][], interiors: number[][][]);
  }
  class GeoJSONLineStringGeometry {
      readonly type = "linestring";
      points: number[][][];
      constructor(points: number[][][]);
  }
  class GeoJSONRegion extends Region {
      readonly type = "geoJSON";
      readonly geometries: (GeoJSONPolygonGeometry | GeoJSONLineStringGeometry)[];
      properties: GeoJSON['features'][0]['properties'] & {
          echartsStyle?: Omit<RegionOption, 'name'>;
      };
      constructor(name: string, geometries: GeoJSONRegion['geometries'], cp: GeoJSON['features'][0]['properties']['cp']);
      calcCenter(): number[];
      getBoundingRect(projection?: GeoProjection): BoundingRect;
      contain(coord: number[]): boolean;
      /**
       * Transform the raw coords to target bounding.
       * @param x
       * @param y
       * @param width
       * @param height
       */
      transformTo(x: number, y: number, width: number, height: number): void;
      cloneShallow(name: string): GeoJSONRegion;
  }
  
  interface GeoItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      areaColor?: ZRColor;
  }
  interface GeoLabelOption extends LabelOption {
      formatter?: string | ((params: GeoLabelFormatterDataParams) => string);
  }
  interface GeoStateOption {
      itemStyle?: GeoItemStyleOption;
      label?: GeoLabelOption;
  }
  interface GeoLabelFormatterDataParams {
      name: string;
      status: DisplayState;
  }
  interface RegionOption extends GeoStateOption, StatesOptionMixin<GeoStateOption, StatesMixinBase> {
      name?: string;
      selected?: boolean;
      tooltip?: CommonTooltipOption<GeoTooltipFormatterParams>;
      silent?: boolean;
  }
  interface GeoTooltipFormatterParams {
      componentType: 'geo';
      geoIndex: number;
      name: string;
      $vars: ['name'];
  }
  interface GeoCommonOptionMixin extends RoamOptionMixin, PreserveAspectMixin {
      map: string;
      aspectScale?: number;
      layoutCenter?: (number | string)[];
      layoutSize?: number | string;
      clip?: boolean;
      boundingCoords?: number[][];
      nameMap?: NameMap;
      nameProperty?: string;
      /**
       * Use raw projection by default
       * Only available for GeoJSON source.
       *
       * NOTE: `center` needs to be the projected coord if projection is used.
       */
      projection?: GeoProjection;
  }
  interface GeoOption extends ComponentOption, BoxLayoutOptionMixin, AnimationOptionMixin, GeoCommonOptionMixin, StatesOptionMixin<GeoStateOption, StatesMixinBase>, GeoStateOption {
      mainType?: 'geo';
      show?: boolean;
      silent?: boolean;
      regions?: RegionOption[];
      stateAnimation?: AnimationOptionMixin;
      selectedMode?: 'single' | 'multiple' | boolean;
      selectedMap?: Dictionary<boolean>;
      tooltip?: CommonTooltipOption<GeoTooltipFormatterParams>;
      /**
       * @private
       */
      defaultItemStyleColor?: ZRColor;
  }
  
  /**
   * The input to define brush areas.
   * (1) Can be created by user when calling dispatchAction.
   * (2) Can be created by `BrushController`
   * for brush behavior. area params are picked from `cover.__brushOptoin`.
   * In `BrushController`, "covers" are create or updated for each "area".
   */
  interface BrushAreaParam extends ModelFinderObject {
      brushType: BrushCoverConfig['brushType'];
      id?: BrushCoverConfig['id'];
      range?: BrushCoverConfig['range'];
      panelId?: BrushCoverConfig['panelId'];
      coordRange?: BrushAreaRange;
      coordRanges?: BrushAreaRange[];
      __rangeOffset?: {
          offset: BrushDimensionMinMax[] | BrushDimensionMinMax;
          xyMinMax: BrushDimensionMinMax[];
      };
  }
  /**
   * Generated by `brushModel.setAreas`, which merges
   * `area: BrushAreaParam` and `brushModel.option: BrushOption`.
   * See `generateBrushOption`.
   */
  interface BrushAreaParamInternal extends BrushAreaParam {
      brushMode: BrushMode;
      brushStyle: BrushCoverConfig['brushStyle'];
      transformable: BrushCoverConfig['transformable'];
      removeOnClick: BrushCoverConfig['removeOnClick'];
      z: BrushCoverConfig['z'];
      __rangeOffset?: {
          offset: BrushDimensionMinMax | BrushDimensionMinMax[];
          xyMinMax: BrushDimensionMinMax[];
      };
  }
  type BrushToolboxIconType = BrushType | 'keep' | 'clear';
  interface BrushOption extends ComponentOption, ModelFinderObject {
      mainType?: 'brush';
      toolbox?: BrushToolboxIconType[];
      brushLink?: number[] | 'all' | 'none';
      throttleType?: 'fixRate' | 'debounce';
      throttleDelay?: number;
      inBrush?: VisualOptionFixed;
      outOfBrush?: VisualOptionFixed;
      brushType?: BrushTypeUncertain;
      brushStyle?: {
          borderWidth?: number;
          color?: ZRColor;
          borderColor?: ZRColor;
      };
      transformable?: boolean;
      brushMode?: BrushMode;
      removeOnClick?: boolean;
      /**
       * @private
       */
      defaultOutOfBrushColor?: ColorString;
  }
  
  interface BrushSelectableArea extends BrushAreaParamInternal {
      boundingRect: BoundingRect;
      selectors: BrushCommonSelectorsForSeries;
  }
  /**
   * This methods are corresponding to `BrushSelectorOnBrushType`,
   * but `area: BrushSelectableArea` is binded to each method.
   */
  interface BrushCommonSelectorsForSeries {
      point(itemLayout: number[]): boolean;
      rect(itemLayout: RectLike): boolean;
  }
  
  type PolarBarLabelPositionExtra = 'start' | 'insideStart' | 'middle' | 'end' | 'insideEnd';
  type BarSeriesLabelOption = SeriesLabelOption<CallbackDataParams, {
      positionExtra: PolarBarLabelPositionExtra | 'outside';
  }>;
  interface BarStateOption<TCbParams = never> {
      itemStyle?: BarItemStyleOption<TCbParams>;
      label?: BarSeriesLabelOption;
  }
  interface BarStatesMixin {
      emphasis?: DefaultStatesMixinEmphasis;
  }
  interface BarItemStyleOption<TCbParams = never> extends ItemStyleOption<TCbParams> {
      borderRadius?: (number | string)[] | number | string;
  }
  interface BarDataItemOption extends BarStateOption, StatesOptionMixin<BarStateOption, BarStatesMixin>, OptionDataItemObject<OptionDataValue> {
      cursor?: string;
  }
  interface BarSeriesOption$1 extends BaseBarSeriesOption<BarStateOption<CallbackDataParams>, BarStatesMixin>, BarStateOption<CallbackDataParams>, SeriesStackOptionMixin, SeriesSamplingOptionMixin, SeriesEncodeOptionMixin {
      type?: 'bar';
      coordinateSystem?: 'cartesian2d' | 'polar';
      clip?: boolean;
      /**
       * If use caps on two sides of bars
       * Only available on tangential polar bar
       */
      roundCap?: boolean;
      showBackground?: boolean;
      backgroundStyle?: ItemStyleOption & {
          borderRadius?: number | number[];
      };
      data?: (BarDataItemOption | OptionDataValue | OptionDataValue[])[];
      realtimeSort?: boolean;
  }
  
  /**
   * {
   *  [coordSysId]: {
   *      [stackId]: {bandWidth, offset, width}
   *  }
   * }
   */
  type BarWidthAndOffset = Dictionary<Dictionary<{
      bandWidth: number;
      offset: number;
      offsetCenter: number;
      width: number;
  }>>;
  interface BarGridLayoutOptionForCustomSeries {
      count: number;
      barWidth?: number | string;
      barMaxWidth?: number | string;
      barMinWidth?: number | string;
      barGap?: number | string;
      barCategoryGap?: number | string;
  }
  type BarGridLayoutResult = BarWidthAndOffset[string][string][];
  
  type CustomExtraElementInfo = Dictionary<unknown>;
  const STYLE_VISUAL_TYPE: {
      readonly color: "fill";
      readonly borderColor: "stroke";
  };
  type StyleVisualProps = keyof typeof STYLE_VISUAL_TYPE;
  const NON_STYLE_VISUAL_PROPS: {
      readonly symbol: 1;
      readonly symbolSize: 1;
      readonly symbolKeepAspect: 1;
      readonly legendIcon: 1;
      readonly visualMeta: 1;
      readonly liftZ: 1;
      readonly decal: 1;
  };
  type NonStyleVisualProps = keyof typeof NON_STYLE_VISUAL_PROPS;
  type ShapeMorphingOption = {
      /**
       * If do shape morphing animation when type is changed.
       * Only available on path.
       */
      morph?: boolean;
  };
  interface CustomBaseElementOption extends Partial<Pick<Element, TransformProp | 'silent' | 'ignore' | 'textConfig'>> {
      type: string;
      id?: string;
      name?: string;
      info?: CustomExtraElementInfo;
      textContent?: CustomTextOption | false;
      clipPath?: CustomBaseZRPathOption | false;
      tooltipDisabled?: boolean;
      extra?: Dictionary<unknown> & TransitionOptionMixin;
      during?(params: TransitionBaseDuringAPI): void;
      enterAnimation?: AnimationOption$1;
      updateAnimation?: AnimationOption$1;
      leaveAnimation?: AnimationOption$1;
  }
  interface CustomDisplayableOption extends CustomBaseElementOption, Partial<Pick<Displayable, 'zlevel' | 'z' | 'z2' | 'invisible'>> {
      style?: ZRStyleProps;
      during?(params: TransitionDuringAPI): void;
      /**
       * @deprecated
       */
      styleEmphasis?: ZRStyleProps | false;
      emphasis?: CustomDisplayableOptionOnState;
      blur?: CustomDisplayableOptionOnState;
      select?: CustomDisplayableOptionOnState;
  }
  interface CustomDisplayableOptionOnState extends Partial<Pick<Displayable, TransformProp | 'textConfig' | 'z2'>> {
      style?: ZRStyleProps | false;
  }
  interface CustomGroupOption extends CustomBaseElementOption, TransitionOptionMixin<GroupProps> {
      type: 'group';
      width?: number;
      height?: number;
      diffChildrenByName?: boolean;
      children: CustomElementOption[];
      $mergeChildren?: false | 'byName' | 'byIndex';
      keyframeAnimation?: ElementKeyframeAnimationOption<GroupProps> | ElementKeyframeAnimationOption<GroupProps>[];
  }
  interface CustomBaseZRPathOption<T extends PathProps['shape'] = PathProps['shape']> extends CustomDisplayableOption, ShapeMorphingOption, TransitionOptionMixin<PathProps & {
      shape: T;
  }> {
      autoBatch?: boolean;
      shape?: T & TransitionOptionMixin<T>;
      style?: PathProps['style'] & TransitionOptionMixin<PathStyleProps>;
      during?(params: TransitionDuringAPI<PathStyleProps, T>): void;
      keyframeAnimation?: ElementKeyframeAnimationOption<PathProps & {
          shape: T;
      }> | ElementKeyframeAnimationOption<PathProps & {
          shape: T;
      }>[];
  }
  interface BuiltinShapes {
      circle: Partial<Circle['shape']>;
      rect: Partial<Rect['shape']>;
      sector: Partial<Sector['shape']>;
      polygon: Partial<Polygon['shape']>;
      polyline: Partial<Polyline['shape']>;
      line: Partial<Line['shape']>;
      arc: Partial<Arc['shape']>;
      bezierCurve: Partial<BezierCurve['shape']>;
      ring: Partial<Ring['shape']>;
      ellipse: Partial<Ellipse['shape']>;
      compoundPath: Partial<CompoundPath['shape']>;
  }
  interface CustomSVGPathShapeOption {
      pathData?: string;
      d?: string;
      layout?: 'center' | 'cover';
      x?: number;
      y?: number;
      width?: number;
      height?: number;
  }
  interface CustomSVGPathOption extends CustomBaseZRPathOption<CustomSVGPathShapeOption> {
      type: 'path';
  }
  interface CustomBuitinPathOption<T extends keyof BuiltinShapes> extends CustomBaseZRPathOption<BuiltinShapes[T]> {
      type: T;
  }
  type CreateCustomBuitinPathOption<T extends keyof BuiltinShapes> = T extends any ? CustomBuitinPathOption<T> : never;
  type CustomPathOption = CreateCustomBuitinPathOption<keyof BuiltinShapes> | CustomSVGPathOption;
  interface CustomImageOptionOnState extends CustomDisplayableOptionOnState {
      style?: ImageStyleProps;
  }
  interface CustomImageOption extends CustomDisplayableOption, TransitionOptionMixin<ImageProps> {
      type: 'image';
      style?: ImageStyleProps & TransitionOptionMixin<ImageStyleProps>;
      emphasis?: CustomImageOptionOnState;
      blur?: CustomImageOptionOnState;
      select?: CustomImageOptionOnState;
      keyframeAnimation?: ElementKeyframeAnimationOption<ImageProps> | ElementKeyframeAnimationOption<ImageProps>[];
  }
  interface CustomTextOptionOnState extends CustomDisplayableOptionOnState {
      style?: TextStyleProps;
  }
  interface CustomTextOption extends CustomDisplayableOption, TransitionOptionMixin<TextProps> {
      type: 'text';
      style?: TextStyleProps & TransitionOptionMixin<TextStyleProps>;
      emphasis?: CustomTextOptionOnState;
      blur?: CustomTextOptionOnState;
      select?: CustomTextOptionOnState;
      keyframeAnimation?: ElementKeyframeAnimationOption<TextProps> | ElementKeyframeAnimationOption<TextProps>[];
  }
  interface CustomompoundPathOptionOnState extends CustomDisplayableOptionOnState {
      style?: PathStyleProps;
  }
  interface CustomCompoundPathOption extends CustomDisplayableOption, TransitionOptionMixin<PathProps> {
      type: 'compoundPath';
      shape?: PathProps['shape'];
      style?: PathStyleProps & TransitionOptionMixin<PathStyleProps>;
      emphasis?: CustomompoundPathOptionOnState;
      blur?: CustomompoundPathOptionOnState;
      select?: CustomompoundPathOptionOnState;
      keyframeAnimation?: ElementKeyframeAnimationOption<PathProps> | ElementKeyframeAnimationOption<PathProps>[];
  }
  type CustomElementOption = CustomPathOption | CustomImageOption | CustomTextOption | CustomCompoundPathOption | CustomGroupOption;
  type CustomRootElementOption = CustomElementOption & {
      focus?: 'none' | 'self' | 'series' | ArrayLike<number>;
      blurScope?: BlurScope;
      emphasisDisabled?: boolean;
  };
  interface CustomSeriesRenderItemAPI extends CustomSeriesRenderItemCoordinateSystemAPI {
      getWidth(): number;
      getHeight(): number;
      getZr(): ZRenderType;
      getDevicePixelRatio(): number;
      value(dim: DimensionLoose, dataIndexInside?: number): ParsedValue;
      ordinalRawValue(dim: DimensionLoose, dataIndexInside?: number): ParsedValue | OrdinalRawValue;
      /**
       * @deprecated
       */
      style(userProps?: ZRStyleProps, dataIndexInside?: number): ZRStyleProps;
      /**
       * @deprecated
       */
      styleEmphasis(userProps?: ZRStyleProps, dataIndexInside?: number): ZRStyleProps;
      visual<VT extends NonStyleVisualProps | StyleVisualProps>(visualType: VT, dataIndexInside?: number): VT extends NonStyleVisualProps ? DefaultDataVisual[VT] : VT extends StyleVisualProps ? PathStyleProps[typeof STYLE_VISUAL_TYPE[VT]] : void;
      barLayout(opt: BarGridLayoutOptionForCustomSeries): BarGridLayoutResult;
      currentSeriesIndices(): number[];
      font(opt: Pick<TextCommonOption, 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily'>): string;
  }
  interface CustomSeriesRenderItemParamsCoordSys {
      type: string;
  }
  interface CustomSeriesRenderItemCoordinateSystemAPI {
      coord(data: (OptionDataValue | NullUndefined$1) | (OptionDataValue | NullUndefined$1)[] | (OptionDataValue | OptionDataValue[] | NullUndefined$1)[], opt?: unknown): number[];
      size?(dataSize: OptionDataValue | OptionDataValue[], dataItem?: OptionDataValue | OptionDataValue[]): number | number[];
      layout?(data: (OptionDataValue | NullUndefined$1) | (OptionDataValue | NullUndefined$1)[] | (OptionDataValue | OptionDataValue[] | NullUndefined$1)[], opt?: unknown): CoordinateSystemDataLayout;
  }
  type WrapEncodeDefRet = Dictionary<number[]>;
  interface CustomSeriesRenderItemParams {
      context: Dictionary<unknown>;
      dataIndex: number;
      seriesId: string;
      seriesName: string;
      seriesIndex: number;
      coordSys: CustomSeriesRenderItemParamsCoordSys;
      encode: WrapEncodeDefRet;
      dataIndexInside: number;
      dataInsideLength: number;
      itemPayload: Dictionary<unknown>;
      actionType?: string;
  }
  type CustomSeriesRenderItemReturn = CustomRootElementOption | undefined | null;
  type CustomSeriesRenderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => CustomSeriesRenderItemReturn;
  interface CustomSeriesOption$1 extends SeriesOption$1<unknown>, // don't support StateOption in custom series.
  SeriesEncodeOptionMixin, SeriesOnCartesianOptionMixin, SeriesOnPolarOptionMixin, SeriesOnSingleOptionMixin, SeriesOnGeoOptionMixin, SeriesOnCalendarOptionMixin {
      type?: 'custom';
      coordinateSystem?: string | 'none';
      renderItem?: CustomSeriesRenderItem;
      itemPayload?: Dictionary<unknown>;
      /**
       * @deprecated
       */
      itemStyle?: ItemStyleOption;
      /**
       * @deprecated
       */
      label?: LabelOption;
      /**
       * @deprecated
       */
      emphasis?: {
          /**
           * @deprecated
           */
          itemStyle?: ItemStyleOption;
          /**
           * @deprecated
           */
          label?: LabelOption;
      };
      clip?: boolean;
  }
  type PrepareCustomInfo = (coordSys: CoordinateSystem) => {
      coordSys: CustomSeriesRenderItemParamsCoordSys;
      api: CustomSeriesRenderItemCoordinateSystemAPI;
  };
  
  const extensionRegisters: {
      registerPreprocessor: typeof registerPreprocessor;
      registerProcessor: typeof registerProcessor;
      registerPostInit: typeof registerPostInit;
      registerPostUpdate: typeof registerPostUpdate;
      registerUpdateLifecycle: typeof registerUpdateLifecycle;
      registerAction: typeof registerAction;
      registerCoordinateSystem: typeof registerCoordinateSystem;
      registerLayout: typeof registerLayout;
      registerVisual: typeof registerVisual;
      registerTransform: typeof registerExternalTransform;
      registerLoading: typeof registerLoading;
      registerMap: typeof registerMap;
      registerImpl: typeof registerImpl;
      PRIORITY: {
          PROCESSOR: {
              FILTER: number;
              SERIES_FILTER: number;
              STATISTIC: number;
          };
          VISUAL: {
              LAYOUT: number;
              PROGRESSIVE_LAYOUT: number;
              GLOBAL: number;
              CHART: number;
              POST_CHART_LAYOUT: number;
              COMPONENT: number;
              BRUSH: number;
              CHART_ITEM: number;
              ARIA: number;
              DECAL: number;
          };
      };
      ComponentModel: typeof ComponentModel;
      ComponentView: typeof ComponentView;
      SeriesModel: typeof SeriesModel;
      ChartView: typeof ChartView;
      registerComponentModel(ComponentModelClass: Constructor): void;
      registerComponentView(ComponentViewClass: typeof ComponentView): void;
      registerSeriesModel(SeriesModelClass: Constructor): void;
      registerChartView(ChartViewClass: typeof ChartView): void;
      registerCustomSeries(seriesType: string, renderItem: CustomSeriesRenderItem): void;
      registerSubTypeDefaulter(componentType: string, defaulter: SubTypeDefaulter): void;
      registerPainter(painterType: string, PainterCtor: Parameters<typeof registerPainter>[1]): void;
  };
  type EChartsExtensionInstallRegisters = typeof extensionRegisters;
  type EChartsExtensionInstaller = (ec: EChartsExtensionInstallRegisters) => void;
  interface EChartsExtension {
      install: EChartsExtensionInstaller;
  }
  function use(ext: EChartsExtensionInstaller | EChartsExtension | (EChartsExtensionInstaller | EChartsExtension)[]): void;
  
  interface BaseAxisBreakPayload extends Payload {
      xAxisIndex?: ModelFinderIndexQuery;
      xAxisId?: ModelFinderIdQuery;
      xAxisName?: ModelFinderNameQuery;
      yAxisIndex?: ModelFinderIndexQuery;
      yAxisId?: ModelFinderIdQuery;
      yAxisName?: ModelFinderNameQuery;
      singleAxisIndex?: ModelFinderIndexQuery;
      singleAxisId?: ModelFinderIdQuery;
      singleAxisName?: ModelFinderNameQuery;
      breaks: AxisBreakOptionIdentifierInAxis[];
  }
  interface ExpandAxisBreakPayload extends BaseAxisBreakPayload {
      type: typeof AXIS_BREAK_EXPAND_ACTION_TYPE;
  }
  interface CollapseAxisBreakPayload extends BaseAxisBreakPayload {
      type: typeof AXIS_BREAK_COLLAPSE_ACTION_TYPE;
  }
  interface ToggleAxisBreakPayload extends BaseAxisBreakPayload {
      type: typeof AXIS_BREAK_TOGGLE_ACTION_TYPE;
  }
  type AxisBreakChangedEventBreak = AxisBreakOptionIdentifierInAxis & {
      xAxisIndex?: ModelFinderIndexQuery;
      yAxisIndex?: ModelFinderIndexQuery;
      singleAxisIndex?: ModelFinderIndexQuery;
      isExpanded: boolean;
      old: {
          isExpanded: boolean;
      };
  };
  interface AxisBreakChangedEvent extends ECActionRefinedEvent {
      type: typeof AXIS_BREAK_CHANGED_EVENT_TYPE;
      fromAction: typeof AXIS_BREAK_EXPAND_ACTION_TYPE | typeof AXIS_BREAK_COLLAPSE_ACTION_TYPE | typeof AXIS_BREAK_TOGGLE_ACTION_TYPE;
      fromActionPayload: ExpandAxisBreakPayload | CollapseAxisBreakPayload | ToggleAxisBreakPayload;
      breaks: AxisBreakChangedEventBreak[];
  }
  const AXIS_BREAK_EXPAND_ACTION_TYPE: "expandAxisBreak";
  const AXIS_BREAK_COLLAPSE_ACTION_TYPE: "collapseAxisBreak";
  const AXIS_BREAK_TOGGLE_ACTION_TYPE: "toggleAxisBreak";
  const AXIS_BREAK_CHANGED_EVENT_TYPE: "axisbreakchanged";
  
  type AxisBreakUpdateResult = {
      breaks: (AxisBreakOptionIdentifierInAxis & {
          isExpanded: boolean;
          old: {
              isExpanded: boolean;
          };
      })[];
  };
  
  interface AxisModelExtendedInCreator {
      getCategories(rawData?: boolean): OrdinalRawValue[] | CategoryAxisBaseOption['data'];
      getOrdinalMeta(): OrdinalMeta;
      updateAxisBreaks(payload: BaseAxisBreakPayload): AxisBreakUpdateResult;
  }
  
  /**
   * Base Axis Model for xAxis, yAxis, angleAxis, radiusAxis. singleAxis
   */
  
  interface AxisBaseModel<T extends AxisBaseOptionCommon = AxisBaseOptionCommon> extends ComponentModel<T>, AxisModelCommonMixin<T>, AxisModelExtendedInCreator {
      axis: Axis;
  }
  
  type AxisLabelInfoDetermined = {
      formattedLabel: string;
      rawLabel: string;
      tickValue: number;
      time: ScaleTick['time'] | NullUndefined$1;
      break: VisualAxisBreak | NullUndefined$1;
  };
  const AxisTickLabelComputingKind: {
      readonly estimate: 1;
      readonly determine: 2;
  };
  type AxisTickLabelComputingKind = (typeof AxisTickLabelComputingKind)[keyof typeof AxisTickLabelComputingKind];
  interface AxisLabelsComputingContext {
      out: {
          noPxChangeTryDetermine: (() => boolean)[];
      };
      kind: AxisTickLabelComputingKind;
  }
  function createAxisLabels(axis: Axis, ctx: AxisLabelsComputingContext): {
      labels: AxisLabelInfoDetermined[];
  };
  
  interface AxisTickCoord {
      coord: number;
      tickValue?: ScaleTick['value'];
      onBand?: boolean;
  }
  /**
   * Base class of Axis.
   *
   * Lifetime: recreate for each main process.
   * [NOTICE]: Some caches is stored on the axis instance (see `axisTickLabelBuilder.ts`)
   *  which is based on this lifetime.
   */
  class Axis {
      /**
       * Axis type
       *  - 'category'
       *  - 'value'
       *  - 'time'
       *  - 'log'
       */
      type: OptionAxisType;
      readonly dim: DimensionName;
      scale: Scale;
      private _extent;
      model: AxisBaseModel;
      onBand: CategoryAxisBaseOption['boundaryGap'];
      inverse: AxisBaseOption['inverse'];
      constructor(dim: DimensionName, scale: Scale, extent: [number, number]);
      /**
       * If axis extent contain given coord
       */
      contain(coord: number): boolean;
      /**
       * If axis extent contain given data
       */
      containData(data: ScaleDataValue): boolean;
      /**
       * Get coord extent.
       */
      getExtent(): [number, number];
      /**
       * Get precision used for formatting
       */
      getPixelPrecision(dataExtent?: [number, number]): number;
      /**
       * Set coord extent
       */
      setExtent(start: number, end: number): void;
      /**
       * Convert data to coord. Data is the rank if it has an ordinal scale
       */
      dataToCoord(data: ScaleDataValue, clamp?: boolean): number;
      /**
       * Convert coord to data. Data is the rank if it has an ordinal scale
       */
      coordToData(coord: number, clamp?: boolean): number;
      /**
       * Convert pixel point to data in axis
       */
      pointToData(point: number[], clamp?: boolean): number;
      /**
       * Different from `zrUtil.map(axis.getTicks(), axis.dataToCoord, axis)`,
       * `axis.getTicksCoords` considers `onBand`, which is used by
       * `boundaryGap:true` of category axis and splitLine and splitArea.
       * @param opt.tickModel default: axis.model.getModel('axisTick')
       * @param opt.clamp If `true`, the first and the last
       *        tick must be at the axis end points. Otherwise, clip ticks
       *        that outside the axis extent.
       */
      getTicksCoords(opt?: {
          tickModel?: Model;
          clamp?: boolean;
          breakTicks?: ScaleGetTicksOpt['breakTicks'];
          pruneByBreak?: ScaleGetTicksOpt['pruneByBreak'];
      }): AxisTickCoord[];
      getMinorTicksCoords(): AxisTickCoord[][];
      getViewLabels(ctx?: AxisLabelsComputingContext): ReturnType<typeof createAxisLabels>['labels'];
      getLabelModel(): Model<AxisBaseOption['axisLabel']>;
      /**
       * Notice here we only get the default tick model. For splitLine
       * or splitArea, we should pass the splitLineModel or splitAreaModel
       * manually when calling `getTicksCoords`.
       * In GL, this method may be overridden to:
       * `axisModel.getModel('axisTick', grid3DModel.getModel('axisTick'));`
       */
      getTickModel(): Model;
      /**
       * Get width of band
       */
      getBandWidth(): number;
      /**
       * Get axis rotate, by degree.
       */
      getRotate: () => number;
      /**
       * Only be called in category axis.
       * Can be overridden, consider other axes like in 3D.
       * @return Auto interval for cateogry axis tick and label
       */
      calculateCategoryInterval(ctx?: AxisLabelsComputingContext): number;
  }
  
  interface CoordinateSystemCreator {
      create: (ecModel: GlobalModel, api: ExtensionAPI) => CoordinateSystemMaster[];
      dimensions?: DimensionName[];
      getDimensionsInfo?: () => DimensionDefinitionLoose[];
  }
  /**
   * The instance get from `CoordinateSystemManger` is `CoordinateSystemMaster`.
   * Consider a typical case: `grid` is a `CoordinateSystemMaster`, and it contains
   * one or multiple `cartesian2d`s, which are `CoordinateSystem`s.
   */
  interface CoordinateSystemMaster {
      dimensions: DimensionName[];
      model?: ComponentModel;
      boxCoordinateSystem?: CoordinateSystem;
      update?: (ecModel: GlobalModel, api: ExtensionAPI) => void;
      convertToPixel?(ecModel: GlobalModel, finder: ParsedModelFinder, value: Parameters<CoordinateSystem['dataToPoint']>[0], opt?: unknown): ReturnType<CoordinateSystem['dataToPoint']> | number | NullUndefined$1;
      convertToLayout?(ecModel: GlobalModel, finder: ParsedModelFinder, value: Parameters<NonNullable<CoordinateSystem['dataToLayout']>>[0], opt?: unknown): ReturnType<NonNullable<CoordinateSystem['dataToLayout']>> | NullUndefined$1;
      convertFromPixel?(ecModel: GlobalModel, finder: ParsedModelFinder, pixelValue: Parameters<NonNullable<CoordinateSystem['pointToData']>>[0], opt?: unknown): ReturnType<NonNullable<CoordinateSystem['pointToData']>> | NullUndefined$1;
      containPoint(point: number[]): boolean;
      getAxes?: () => Axis[];
      axisPointerEnabled?: boolean;
      getTooltipAxes?: (dim: DimensionName | 'auto') => {
          baseAxes: Axis[];
          otherAxes: Axis[];
      };
      /**
       * Get layout rect or coordinate system
       */
      getRect?: () => RectLike;
  }
  /**
   * For example: cartesian is CoordinateSystem.
   * series.coordinateSystem is CoordinateSystem.
   */
  interface CoordinateSystem {
      type: string;
      /**
       * Master of coordinate system. For example:
       * Grid is master of cartesian.
       */
      master?: CoordinateSystemMaster;
      dimensions: DimensionName[];
      model?: ComponentModel;
      /**
       * @param data
       * @param reserved Defined by the coordinate system itself
       * @param out Fill it if passing, and return. For performance optimization.
       * @return Point in global pixel coordinate system.
       *  An invalid returned point should be represented by `[NaN, NaN]`,
       *  rather than `null/undefined`.
       */
      dataToPoint(data: CoordinateSystemDataCoord, opt?: unknown, out?: number[]): number[];
      /**
       * @param data See the meaning in `dataToPoint`.
       * @param reserved Defined by the coordinate system itself
       * @param out Fill it if passing, and return. For performance optimization. Vary by different coord sys.
       * @return Layout in global pixel coordinate system.
       *  An invalid returned rect should be represented by `{x: NaN, y: NaN, width: NaN, height: NaN}`,
       *  Never return `null/undefined`.
       */
      dataToLayout?(data: CoordinateSystemDataCoord, opt?: unknown, out?: CoordinateSystemDataLayout): CoordinateSystemDataLayout;
      /**
       * Some coord sys (like Parallel) might do not have `pointToData`,
       * or the meaning of this kind of features is not clear yet.
       * @param point point Point in global pixel coordinate system.
       * @param out Fill it if passing, and return. For performance optimization.
       * @return data
       *  An invalid returned data should be represented by `[NaN, NaN]` or `NaN`,
       *  rather than `null/undefined`, which represents not-applicable in `convertFromPixel`.
       *  Return `OrdinalNumber` in ordianal (category axis) case.
       *  Return timestamp in time axis.
       */
      pointToData?(point: number[], opt?: unknown, out?: number | number[]): number | number[];
      containPoint(point: number[]): boolean;
      getAxes?: () => Axis[];
      getAxis?: (dim?: DimensionName) => Axis;
      getBaseAxis?: () => Axis;
      getOtherAxis?: (baseAxis: Axis) => Axis;
      clampData?: (data: ScaleDataValue[], out?: number[]) => number[];
      getRoamTransform?: () => MatrixArray;
      getArea?: (tolerance?: number) => CoordinateSystemClipArea;
      getBoundingRect?: () => BoundingRect;
      getAxesByScale?: (scaleType: string) => Axis[];
      prepareCustoms?: PrepareCustomInfo;
  }
  /**
   * Like GridModel, PolarModel, ...
   */
  interface CoordinateSystemHostModel extends ComponentModel {
      coordinateSystem?: CoordinateSystemMaster;
  }
  /**
   * Clip area will be returned by getArea of CoordinateSystem.
   * It is used to clip the graphic elements with the contain methods.
   */
  interface CoordinateSystemClipArea {
      x: number;
      y: number;
      width: number;
      height: number;
      contain(x: number, y: number): boolean;
  }
  
  /**
   * LegendVisualProvider is an bridge that pick encoded color from data and
   * provide to the legend component.
   */
  class LegendVisualProvider {
      private _getDataWithEncodedVisual;
      private _getRawData;
      constructor(getDataWithEncodedVisual: () => SeriesData, getRawData: () => SeriesData);
      getAllNames(): string[];
      containName(name: string): boolean;
      indexOfName(name: string): number;
      getItemVisual(dataIndex: number, key: string): any;
  }
  
  function makeStyleMapper(properties: readonly string[][], ignoreParent?: boolean): (model: Model, excludes?: readonly string[], includes?: readonly string[]) => PathStyleProps;
  
  const SERIES_UNIVERSAL_TRANSITION_PROP = "__universalTransitionEnabled";
  interface SeriesModel {
      /**
       * Convenient for override in extended class.
       * Implement it if needed.
       */
      preventIncremental(): boolean;
      /**
       * See tooltip.
       * Implement it if needed.
       * @return Point of tooltip. null/undefined can be returned.
       */
      getTooltipPosition(dataIndex: number): number[];
      /**
       * Get data indices for show tooltip content. See tooltip.
       * Implement it if needed.
       */
      getAxisTooltipData(dim: DimensionName[], value: ScaleDataValue, baseAxis: Axis): {
          dataIndices: number[];
          nestestValue: any;
      };
      /**
       * Get position for marker
       */
      getMarkerPosition(value: ScaleDataValue[], dims?: typeof dimPermutations[number], startingAtTick?: boolean): number[];
      /**
       * Get legend icon symbol according to each series type
       */
      getLegendIcon(opt: LegendIconParams): ECSymbol | Group;
      /**
       * See `component/brush/selector.js`
       * Defined the brush selector for this series.
       */
      brushSelector(dataIndex: number, data: SeriesData, selectors: BrushCommonSelectorsForSeries, area: BrushSelectableArea): boolean;
      enableAriaDecal(): void;
  }
  class SeriesModel<Opt extends SeriesOption$1 = SeriesOption$1> extends ComponentModel<Opt> {
      type: string;
      defaultOption: SeriesOption$1;
      seriesIndex: number;
      coordinateSystem: CoordinateSystem;
      dataTask: SeriesTask;
      pipelineContext: PipelineContext;
      legendVisualProvider: LegendVisualProvider;
      visualStyleAccessPath: string;
      visualDrawType: 'fill' | 'stroke';
      visualStyleMapper: ReturnType<typeof makeStyleMapper>;
      ignoreStyleOnData: boolean;
      hasSymbolVisual: boolean;
      defaultSymbol: string;
      legendIcon: string;
      [SERIES_UNIVERSAL_TRANSITION_PROP]: boolean;
      private _selectedDataIndicesMap;
      readonly preventUsingHoverLayer: boolean;
      static protoInitialize: void;
      init(option: Opt, parentModel: Model, ecModel: GlobalModel): void;
      /**
       * Util for merge default and theme to option
       */
      mergeDefaultAndTheme(option: Opt, ecModel: GlobalModel): void;
      mergeOption(newSeriesOption: Opt, ecModel: GlobalModel): void;
      fillDataTextStyle(data: ArrayLike<any>): void;
      /**
       * Init a data structure from data related option in series
       * Must be overridden.
       */
      getInitialData(option: Opt, ecModel: GlobalModel): SeriesData;
      /**
       * Append data to list
       */
      appendData(params: {
          data: ArrayLike<any>;
      }): void;
      /**
       * Consider some method like `filter`, `map` need make new data,
       * We should make sure that `seriesModel.getData()` get correct
       * data in the stream procedure. So we fetch data from upstream
       * each time `task.perform` called.
       */
      getData(dataType?: SeriesDataType): SeriesData<this>;
      getAllData(): ({
          data: SeriesData;
          type?: SeriesDataType;
      })[];
      setData(data: SeriesData): void;
      getEncode(): HashMap<OptionEncodeValue, string>;
      getSourceManager(): SourceManager;
      getSource(): Source;
      /**
       * Get data before processed
       */
      getRawData(): SeriesData;
      getColorBy(): ColorBy;
      isColorBySeries(): boolean;
      /**
       * Get base axis if has coordinate system and has axis.
       * By default use coordSys.getBaseAxis();
       * Can be overridden for some chart.
       * @return {type} description
       */
      getBaseAxis(): Axis;
      /**
       * Retrieve the index of nearest value in the view coordinate.
       * Data position is compared with each axis's dataToCoord.
       *
       * @param axisDim axis dimension
       * @param dim data dimension
       * @param value
       * @param [maxDistance=Infinity] The maximum distance in view coordinate space
       * @return If and only if multiple indices has
       *         the same value, they are put to the result.
       */
      indicesOfNearest(axisDim: DimensionName, dim: DimensionLoose, value: number, maxDistance?: number): number[];
      /**
       * Default tooltip formatter
       *
       * @param dataIndex
       * @param multipleSeries
       * @param dataType
       * @param renderMode valid values: 'html'(by default) and 'richText'.
       *        'html' is used for rendering tooltip in extra DOM form, and the result
       *        string is used as DOM HTML content.
       *        'richText' is used for rendering tooltip in rich text form, for those where
       *        DOM operation is not supported.
       * @return formatted tooltip with `html` and `markers`
       *        Notice: The override method can also return string
       */
      formatTooltip(dataIndex: number, multipleSeries?: boolean, dataType?: SeriesDataType): ReturnType<DataFormatMixin['formatTooltip']>;
      isAnimationEnabled(): boolean;
      restoreData(): void;
      getColorFromPalette(name: string, scope: any, requestColorNum?: number): ZRColor;
      /**
       * Use `data.mapDimensionsAll(coordDim)` instead.
       * @deprecated
       */
      coordDimToDataDim(coordDim: DimensionName): DimensionName[];
      /**
       * Get progressive rendering count each step
       */
      getProgressive(): number | false;
      /**
       * Get progressive rendering count each step
       */
      getProgressiveThreshold(): number;
      select(innerDataIndices: number[], dataType?: SeriesDataType): void;
      unselect(innerDataIndices: number[], dataType?: SeriesDataType): void;
      toggleSelect(innerDataIndices: number[], dataType?: SeriesDataType): void;
      getSelectedDataIndices(): number[];
      isSelected(dataIndex: number, dataType?: SeriesDataType): boolean;
      isUniversalTransitionEnabled(): boolean;
      private _innerSelect;
      private _initSelectedMapFromData;
      static registerClass(clz: Constructor): Constructor;
  }
  interface SeriesModel<Opt extends SeriesOption$1 = SeriesOption$1> extends DataFormatMixin, PaletteMixin<Opt>, DataHost {
      /**
       * Get dimension to render shadow in dataZoom component
       */
      getShadowDim?(): string;
  }
  
  /**
   * [REQUIREMENT_MEMO]:
   * (0) `metaRawOption` means `dimensions`/`sourceHeader`/`seriesLayoutBy` in raw option.
   * (1) Keep support the feature: `metaRawOption` can be specified both on `series` and
   * `root-dataset`. Them on `series` has higher priority.
   * (2) Do not support to set `metaRawOption` on a `non-root-dataset`, because it might
   * confuse users: whether those props indicate how to visit the upstream source or visit
   * the transform result source, and some transforms has nothing to do with these props,
   * and some transforms might have multiple upstream.
   * (3) Transforms should specify `metaRawOption` in each output, just like they can be
   * declared in `root-dataset`.
   * (4) At present only support visit source in `SERIES_LAYOUT_BY_COLUMN` in transforms.
   * That is for reducing complexity in transforms.
   * PENDING: Whether to provide transposition transform?
   *
   * [IMPLEMENTAION_MEMO]:
   * "sourceVisitConfig" are calculated from `metaRawOption` and `data`.
   * They will not be calculated until `source` is about to be visited (to prevent from
   * duplicate calcuation). `source` is visited only in series and input to transforms.
   *
   * [DIMENSION_INHERIT_RULE]:
   * By default the dimensions are inherited from ancestors, unless a transform return
   * a new dimensions definition.
   * Consider the case:
   * ```js
   * dataset: [{
   *     source: [ ['Product', 'Sales', 'Prise'], ['Cookies', 321, 44.21], ...]
   * }, {
   *     transform: { type: 'filter', ... }
   * }]
   * dataset: [{
   *     dimension: ['Product', 'Sales', 'Prise'],
   *     source: [ ['Cookies', 321, 44.21], ...]
   * }, {
   *     transform: { type: 'filter', ... }
   * }]
   * ```
   * The two types of option should have the same behavior after transform.
   *
   *
   * [SCENARIO]:
   * (1) Provide source data directly:
   * ```js
   * series: {
   *     encode: {...},
   *     dimensions: [...]
   *     seriesLayoutBy: 'row',
   *     data: [[...]]
   * }
   * ```
   * (2) Series refer to dataset.
   * ```js
   * series: [{
   *     encode: {...}
   *     // Ignore datasetIndex means `datasetIndex: 0`
   *     // and the dimensions defination in dataset is used
   * }, {
   *     encode: {...},
   *     seriesLayoutBy: 'column',
   *     datasetIndex: 1
   * }]
   * ```
   * (3) dataset transform
   * ```js
   * dataset: [{
   *     source: [...]
   * }, {
   *     source: [...]
   * }, {
   *     // By default from 0.
   *     transform: { type: 'filter', config: {...} }
   * }, {
   *     // Piped.
   *     transform: [
   *         { type: 'filter', config: {...} },
   *         { type: 'sort', config: {...} }
   *     ]
   * }, {
   *     id: 'regressionData',
   *     fromDatasetIndex: 1,
   *     // Third-party transform
   *     transform: { type: 'ecStat:regression', config: {...} }
   * }, {
   *     // retrieve the extra result.
   *     id: 'regressionFormula',
   *     fromDatasetId: 'regressionData',
   *     fromTransformResult: 1
   * }]
   * ```
   */
  class SourceManager {
      private _sourceHost;
      private _sourceList;
      private _storeList;
      private _upstreamSignList;
      private _versionSignBase;
      private _dirty;
      constructor(sourceHost: DatasetModel | SeriesModel);
      /**
       * Mark dirty.
       */
      dirty(): void;
      private _setLocalSource;
      /**
       * For detecting whether the upstream source is dirty, so that
       * the local cached source (in `_sourceList`) should be discarded.
       */
      private _getVersionSign;
      /**
       * Always return a source instance. Otherwise throw error.
       */
      prepareSource(): void;
      private _createSource;
      private _applyTransform;
      private _isDirty;
      /**
       * @param sourceIndex By default 0, means "main source".
       *                    In most cases there is only one source.
       */
      getSource(sourceIndex?: number): Source;
      /**
       *
       * Get a data store which can be shared across series.
       * Only available for series.
       *
       * @param seriesDimRequest Dimensions that are generated in series.
       *        Should have been sorted by `storeDimIndex` asc.
       */
      getSharedDataStore(seriesDimRequest: SeriesDataSchema): DataStore;
      private _innerGetDataStore;
      /**
       * PENDING: Is it fast enough?
       * If no upstream, return empty array.
       */
      private _getUpstreamSourceManagers;
      private _getSourceMetaRawOption;
  }
  
  /**
   * This module is imported by echarts directly.
   *
   * Notice:
   * Always keep this file exists for backward compatibility.
   * Because before 4.1.0, dataset is an optional component,
   * some users may import this module manually.
   */
  
  interface DatasetOption extends Pick<ComponentOption, 'type' | 'id' | 'name'>, Pick<SeriesEncodeOptionMixin, 'dimensions'> {
      mainType?: 'dataset';
      seriesLayoutBy?: SeriesLayoutBy;
      sourceHeader?: OptionSourceHeader;
      source?: OptionSourceData;
      fromDatasetIndex?: number;
      fromDatasetId?: string;
      transform?: DataTransformOption | PipedDataTransformOption;
      fromTransformResult?: number;
  }
  class DatasetModel<Opts extends DatasetOption = DatasetOption> extends ComponentModel<Opts> {
      type: string;
      static type: string;
      static defaultOption: DatasetOption;
      private _sourceManager;
      init(option: Opts, parentModel: Model, ecModel: GlobalModel): void;
      mergeOption(newOption: Opts, ecModel: GlobalModel): void;
      optionUpdated(): void;
      getSourceManager(): SourceManager;
  }
  
  /**
   * [sourceFormat]
   *
   * + "original":
   * This format is only used in series.data, where
   * itemStyle can be specified in data item.
   *
   * + "arrayRows":
   * [
   *     ['product', 'score', 'amount'],
   *     ['Matcha Latte', 89.3, 95.8],
   *     ['Milk Tea', 92.1, 89.4],
   *     ['Cheese Cocoa', 94.4, 91.2],
   *     ['Walnut Brownie', 85.4, 76.9]
   * ]
   *
   * + "objectRows":
   * [
   *     {product: 'Matcha Latte', score: 89.3, amount: 95.8},
   *     {product: 'Milk Tea', score: 92.1, amount: 89.4},
   *     {product: 'Cheese Cocoa', score: 94.4, amount: 91.2},
   *     {product: 'Walnut Brownie', score: 85.4, amount: 76.9}
   * ]
   *
   * + "keyedColumns":
   * {
   *     'product': ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie'],
   *     'count': [823, 235, 1042, 988],
   *     'score': [95.8, 81.4, 91.2, 76.9]
   * }
   *
   * + "typedArray"
   *
   * + "unknown"
   */
  interface SourceMetaRawOption {
      seriesLayoutBy: SeriesLayoutBy;
      sourceHeader: OptionSourceHeader;
      dimensions: DimensionDefinitionLoose[];
  }
  interface Source extends SourceImpl {
  }
  class SourceImpl {
      /**
       * Not null/undefined.
       */
      readonly data: OptionSourceData;
      /**
       * See also "detectSourceFormat".
       * Not null/undefined.
       */
      readonly sourceFormat: SourceFormat;
      /**
       * 'row' or 'column'
       * Not null/undefined.
       */
      readonly seriesLayoutBy: SeriesLayoutBy;
      /**
       * dimensions definition from:
       * (1) standalone defined in option prop `dimensions: [...]`
       * (2) detected from option data. See `determineSourceDimensions`.
       * If can not be detected (e.g., there is only pure data `[[11, 33], ...]`
       * `dimensionsDefine` will be null/undefined.
       */
      readonly dimensionsDefine: DimensionDefinition[];
      /**
       * Only make sense in `SOURCE_FORMAT_ARRAY_ROWS`.
       * That is the same as `sourceHeader: number`,
       * which means from which line the real data start.
       * Not null/undefined, uint.
       */
      readonly startIndex: number;
      /**
       * Dimension count detected from data. Only works when `dimensionDefine`
       * does not exists.
       * Can be null/undefined (when unknown), uint.
       */
      readonly dimensionsDetectedCount: number;
      /**
       * Raw props from user option.
       */
      readonly metaRawOption: SourceMetaRawOption;
      constructor(fields: {
          data: OptionSourceData;
          sourceFormat: SourceFormat;
          seriesLayoutBy?: SeriesLayoutBy;
          dimensionsDefine?: DimensionDefinition[];
          startIndex?: number;
          dimensionsDetectedCount?: number;
          metaRawOption?: SourceMetaRawOption;
          encodeDefine?: HashMap<OptionEncodeValue, DimensionName>;
      });
  }
  
  interface DataProvider {
      /**
       * true: all of the value are in primitive type (in type `OptionDataValue`).
       * false: Not sure whether any of them is non primitive type (in type `OptionDataItemObject`).
       *     Like `data: [ { value: xx, itemStyle: {...} }, ...]`
       *     At present it only happen in `SOURCE_FORMAT_ORIGINAL`.
       */
      pure?: boolean;
      /**
       * If data is persistent and will not be released after use.
       */
      persistent?: boolean;
      getSource(): Source;
      count(): number;
      getItem(idx: number, out?: OptionDataItem): OptionDataItem;
      fillStorage?(start: number, end: number, out: ArrayLike$1<ParsedValue>[], extent: number[][]): void;
      appendData?(newData: ArrayLike$1<OptionDataItem>): void;
      clean?(): void;
  }
  
  type DimensionSummaryEncode = {
      defaultedLabel: DimensionName[];
      defaultedTooltip: DimensionName[];
      [coordOrVisualDimName: string]: DimensionName[];
  };
  type DimensionSummary = {
      encode: DimensionSummaryEncode;
      userOutput: DimensionUserOuput;
      dataDimsOnCoord: DimensionName[];
      dataDimIndicesOnCoord: DimensionIndex[];
      encodeFirstDimNotExtra: {
          [coordDim: string]: DimensionName;
      };
  };
  type DimensionUserOuputEncode = {
      [coordOrVisualDimName: string]: DimensionIndex[];
  };
  class DimensionUserOuput {
      private _encode;
      private _cachedDimNames;
      private _schema?;
      constructor(encode: DimensionUserOuputEncode, dimRequest?: SeriesDataSchema);
      get(): {
          fullDimensions: DimensionName[];
          encode: DimensionUserOuputEncode;
      };
      /**
       * Get all data store dimension names.
       * Theoretically a series data store is defined both by series and used dataset (if any).
       * If some dimensions are omitted for performance reason in `this.dimensions`,
       * the dimension name may not be auto-generated if user does not specify a dimension name.
       * In this case, the dimension name is `null`/`undefined`.
       */
      private _getFullDimensionNames;
  }
  
  type ItrParamDims = DimensionLoose | Array<DimensionLoose>;
  type CtxOrList<Ctx> = unknown extends Ctx ? SeriesData : Ctx;
  type EachCb0<Ctx> = (this: CtxOrList<Ctx>, idx: number) => void;
  type EachCb1<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, idx: number) => void;
  type EachCb2<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, y: ParsedValue, idx: number) => void;
  type EachCb$1<Ctx> = (this: CtxOrList<Ctx>, ...args: any) => void;
  type FilterCb0<Ctx> = (this: CtxOrList<Ctx>, idx: number) => boolean;
  type FilterCb1<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, idx: number) => boolean;
  type FilterCb2<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, y: ParsedValue, idx: number) => boolean;
  type FilterCb$1<Ctx> = (this: CtxOrList<Ctx>, ...args: any) => boolean;
  type MapArrayCb0<Ctx> = (this: CtxOrList<Ctx>, idx: number) => any;
  type MapArrayCb1<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, idx: number) => any;
  type MapArrayCb2<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, y: ParsedValue, idx: number) => any;
  type MapArrayCb<Ctx> = (this: CtxOrList<Ctx>, ...args: any) => any;
  type MapCb1<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, idx: number) => ParsedValue | ParsedValue[];
  type MapCb2<Ctx> = (this: CtxOrList<Ctx>, x: ParsedValue, y: ParsedValue, idx: number) => ParsedValue | ParsedValue[];
  type SeriesDimensionDefineLoose = string | object | SeriesDimensionDefine;
  type SeriesDimensionLoose = DimensionLoose;
  type SeriesDimensionName = DimensionName;
  interface DefaultDataVisual {
      style: PathStyleProps;
      drawType: 'fill' | 'stroke';
      symbol?: string;
      symbolSize?: number | number[];
      symbolRotate?: number;
      symbolKeepAspect?: boolean;
      symbolOffset?: string | number | (string | number)[];
      z2: number;
      liftZ?: number;
      legendIcon?: string;
      legendLineStyle?: LineStyleProps;
      visualMeta?: VisualMeta[];
      colorFromPalette?: boolean;
      decal?: DecalObject;
  }
  interface DataCalculationInfo<SERIES_MODEL> {
      stackedDimension: DimensionName;
      stackedByDimension: DimensionName;
      isStackedByIndex: boolean;
      stackedOverDimension: DimensionName;
      stackResultDimension: DimensionName;
      stackedOnSeries?: SERIES_MODEL;
  }
  class SeriesData<HostModel extends Model = Model, Visual extends DefaultDataVisual = DefaultDataVisual> {
      readonly type = "list";
      /**
       * Name of dimensions list of SeriesData.
       *
       * @caution Carefully use the index of this array.
       * Because when DataStore is an extra high dimension(>30) dataset. We will only pick
       * the used dimensions from DataStore to avoid performance issue.
       */
      readonly dimensions: SeriesDimensionName[];
      private _dimInfos;
      private _dimOmitted;
      private _schema?;
      /**
       * @pending
       * Actually we do not really need to convert dimensionIndex to dimensionName
       * and do not need `_dimIdxToName` if we do everything internally based on dimension
       * index rather than dimension name.
       */
      private _dimIdxToName?;
      readonly hostModel: HostModel;
      /**
       * @readonly
       */
      dataType: SeriesDataType;
      /**
       * @readonly
       * Host graph if List is used to store graph nodes / edges.
       */
      graph?: Graph;
      /**
       * @readonly
       * Host tree if List is used to store tree nodes.
       */
      tree?: Tree;
      private _store;
      private _nameList;
      private _idList;
      private _visual;
      private _layout;
      private _itemVisuals;
      private _itemLayouts;
      private _graphicEls;
      private _approximateExtent;
      private _dimSummary;
      private _invertedIndicesMap;
      private _calculationInfo;
      userOutput: DimensionSummary['userOutput'];
      hasItemOption: boolean;
      private _nameRepeatCount;
      private _nameDimIdx;
      private _idDimIdx;
      private __wrappedMethods;
      TRANSFERABLE_METHODS: readonly ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"];
      CHANGABLE_METHODS: readonly ["filterSelf", "selectRange"];
      DOWNSAMPLE_METHODS: readonly ["downSample", "minmaxDownSample", "lttbDownSample"];
      /**
       * @param dimensionsInput.dimensions
       *        For example, ['someDimName', {name: 'someDimName', type: 'someDimType'}, ...].
       *        Dimensions should be concrete names like x, y, z, lng, lat, angle, radius
       */
      constructor(dimensionsInput: SeriesDataSchema | SeriesDimensionDefineLoose[], hostModel: HostModel);
      /**
       *
       * Get concrete dimension name by dimension name or dimension index.
       * If input a dimension name, do not validate whether the dimension name exits.
       *
       * @caution
       * @param dim Must make sure the dimension is `SeriesDimensionLoose`.
       * Because only those dimensions will have auto-generated dimension names if not
       * have a user-specified name, and other dimensions will get a return of null/undefined.
       *
       * @notice Because of this reason, should better use `getDimensionIndex` instead, for examples:
       * ```js
       * const val = data.getStore().get(data.getDimensionIndex(dim), dataIdx);
       * ```
       *
       * @return Concrete dim name.
       */
      getDimension(dim: SeriesDimensionLoose): DimensionName;
      /**
       * Get dimension index in data store. Return -1 if not found.
       * Can be used to index value from getRawValue.
       */
      getDimensionIndex(dim: DimensionLoose): DimensionIndex;
      /**
       * The meanings of the input parameter `dim`:
       *
       * + If dim is a number (e.g., `1`), it means the index of the dimension.
       *   For example, `getDimension(0)` will return 'x' or 'lng' or 'radius'.
       * + If dim is a number-like string (e.g., `"1"`):
       *     + If there is the same concrete dim name defined in `series.dimensions` or `dataset.dimensions`,
       *        it means that concrete name.
       *     + If not, it will be converted to a number, which means the index of the dimension.
       *        (why? because of the backward compatibility. We have been tolerating number-like string in
       *        dimension setting, although now it seems that it is not a good idea.)
       *     For example, `visualMap[i].dimension: "1"` is the same meaning as `visualMap[i].dimension: 1`,
       *     if no dimension name is defined as `"1"`.
       * + If dim is a not-number-like string, it means the concrete dim name.
       *   For example, it can be be default name `"x"`, `"y"`, `"z"`, `"lng"`, `"lat"`, `"angle"`, `"radius"`,
       *   or customized in `dimensions` property of option like `"age"`.
       *
       * @return recognized `DimensionIndex`. Otherwise return null/undefined (means that dim is `DimensionName`).
       */
      private _recognizeDimIndex;
      private _getStoreDimIndex;
      /**
       * Get type and calculation info of particular dimension
       * @param dim
       *        Dimension can be concrete names like x, y, z, lng, lat, angle, radius
       *        Or a ordinal number. For example getDimensionInfo(0) will return 'x' or 'lng' or 'radius'
       */
      getDimensionInfo(dim: SeriesDimensionLoose): SeriesDimensionDefine;
      /**
       * If `dimName` if from outside of `SeriesData`,
       * use this method other than visit `this._dimInfos` directly.
       */
      private _getDimInfo;
      private _initGetDimensionInfo;
      /**
       * concrete dimension name list on coord.
       */
      getDimensionsOnCoord(): SeriesDimensionName[];
      /**
       * @param coordDim
       * @param idx A coordDim may map to more than one data dim.
       *        If not specified, return the first dim not extra.
       * @return concrete data dim. If not found, return null/undefined
       */
      mapDimension(coordDim: SeriesDimensionName): SeriesDimensionName;
      mapDimension(coordDim: SeriesDimensionName, idx: number): SeriesDimensionName;
      mapDimensionsAll(coordDim: SeriesDimensionName): SeriesDimensionName[];
      getStore(): DataStore;
      /**
       * Initialize from data
       * @param data source or data or data store.
       * @param nameList The name of a datum is used on data diff and
       *        default label/tooltip.
       *        A name can be specified in encode.itemName,
       *        or dataItem.name (only for series option data),
       *        or provided in nameList from outside.
       */
      initData(data: Source | OptionSourceData | DataStore | DataProvider, nameList?: string[], dimValueGetter?: DimValueGetter): void;
      /**
       * Caution: Can be only called on raw data (before `this._indices` created).
       */
      appendData(data: ArrayLike$1<any>): void;
      /**
       * Caution: Can be only called on raw data (before `this._indices` created).
       * This method does not modify `rawData` (`dataProvider`), but only
       * add values to store.
       *
       * The final count will be increased by `Math.max(values.length, names.length)`.
       *
       * @param values That is the SourceType: 'arrayRows', like
       *        [
       *            [12, 33, 44],
       *            [NaN, 43, 1],
       *            ['-', 'asdf', 0]
       *        ]
       *        Each item is exactly corresponding to a dimension.
       */
      appendValues(values: any[][], names?: string[]): void;
      private _updateOrdinalMeta;
      private _shouldMakeIdFromName;
      private _doInit;
      /**
       * PENDING: In fact currently this function is only used to short-circuit
       * the calling of `scale.unionExtentFromData` when data have been filtered by modules
       * like "dataZoom". `scale.unionExtentFromData` is used to calculate data extent for series on
       * an axis, but if a "axis related data filter module" is used, the extent of the axis have
       * been fixed and no need to calling `scale.unionExtentFromData` actually.
       * But if we add "custom data filter" in future, which is not "axis related", this method may
       * be still needed.
       *
       * Optimize for the scenario that data is filtered by a given extent.
       * Consider that if data amount is more than hundreds of thousand,
       * extent calculation will cost more than 10ms and the cache will
       * be erased because of the filtering.
       */
      getApproximateExtent(dim: SeriesDimensionLoose): [number, number];
      /**
       * Calculate extent on a filtered data might be time consuming.
       * Approximate extent is only used for: calculate extent of filtered data outside.
       */
      setApproximateExtent(extent: [number, number], dim: SeriesDimensionLoose): void;
      getCalculationInfo<CALC_INFO_KEY extends keyof DataCalculationInfo<HostModel>>(key: CALC_INFO_KEY): DataCalculationInfo<HostModel>[CALC_INFO_KEY];
      /**
       * @param key or k-v object
       */
      setCalculationInfo(key: DataCalculationInfo<HostModel>): void;
      setCalculationInfo<CALC_INFO_KEY extends keyof DataCalculationInfo<HostModel>>(key: CALC_INFO_KEY, value: DataCalculationInfo<HostModel>[CALC_INFO_KEY]): void;
      /**
       * @return Never be null/undefined. `number` will be converted to string. Because:
       * In most cases, name is used in display, where returning a string is more convenient.
       * In other cases, name is used in query (see `indexOfName`), where we can keep the
       * rule that name `2` equals to name `'2'`.
       */
      getName(idx: number): string;
      private _getCategory;
      /**
       * @return Never null/undefined. `number` will be converted to string. Because:
       * In all cases having encountered at present, id is used in making diff comparison, which
       * are usually based on hash map. We can keep the rule that the internal id are always string
       * (treat `2` is the same as `'2'`) to make the related logic simple.
       */
      getId(idx: number): string;
      count(): number;
      /**
       * Get value. Return NaN if idx is out of range.
       *
       * @notice Should better to use `data.getStore().get(dimIndex, dataIdx)` instead.
       */
      get(dim: SeriesDimensionName, idx: number): ParsedValue;
      /**
       * @notice Should better to use `data.getStore().getByRawIndex(dimIndex, dataIdx)` instead.
       */
      getByRawIndex(dim: SeriesDimensionName, rawIdx: number): ParsedValue;
      getIndices(): globalThis.ArrayLike<number>;
      getDataExtent(dim: DimensionLoose): [number, number];
      getSum(dim: DimensionLoose): number;
      getMedian(dim: DimensionLoose): number;
      /**
       * Get value for multi dimensions.
       * @param dimensions If ignored, using all dimensions.
       */
      getValues(idx: number): ParsedValue[];
      getValues(dimensions: readonly DimensionName[], idx: number): ParsedValue[];
      /**
       * If value is NaN. Including '-'
       * Only check the coord dimensions.
       */
      hasValue(idx: number): boolean;
      /**
       * Retrieve the index with given name
       */
      indexOfName(name: string): number;
      getRawIndex(idx: number): number;
      indexOfRawIndex(rawIndex: number): number;
      /**
       * Only support the dimension which inverted index created.
       * Do not support other cases until required.
       * @param dim concrete dim
       * @param value ordinal index
       * @return rawIndex
       */
      rawIndexOf(dim: SeriesDimensionName, value: OrdinalNumber): number;
      /**
       * Data iteration
       * @param ctx default this
       * @example
       *  list.each('x', function (x, idx) {});
       *  list.each(['x', 'y'], function (x, y, idx) {});
       *  list.each(function (idx) {})
       */
      each<Ctx>(cb: EachCb0<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): void;
      each<Ctx>(dims: DimensionLoose, cb: EachCb1<Ctx>, ctx?: Ctx): void;
      each<Ctx>(dims: [DimensionLoose], cb: EachCb1<Ctx>, ctx?: Ctx): void;
      each<Ctx>(dims: [DimensionLoose, DimensionLoose], cb: EachCb2<Ctx>, ctx?: Ctx): void;
      each<Ctx>(dims: ItrParamDims, cb: EachCb$1<Ctx>, ctx?: Ctx): void;
      /**
       * Data filter
       */
      filterSelf<Ctx>(cb: FilterCb0<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): this;
      filterSelf<Ctx>(dims: DimensionLoose, cb: FilterCb1<Ctx>, ctx?: Ctx): this;
      filterSelf<Ctx>(dims: [DimensionLoose], cb: FilterCb1<Ctx>, ctx?: Ctx): this;
      filterSelf<Ctx>(dims: [DimensionLoose, DimensionLoose], cb: FilterCb2<Ctx>, ctx?: Ctx): this;
      filterSelf<Ctx>(dims: ItrParamDims, cb: FilterCb$1<Ctx>, ctx?: Ctx): this;
      /**
       * Select data in range. (For optimization of filter)
       * (Manually inline code, support 5 million data filtering in data zoom.)
       */
      selectRange(range: Record<string, [number, number]>): SeriesData;
      /**
       * Data mapping to a plain array
       */
      mapArray<Ctx, Cb extends MapArrayCb0<Ctx>>(cb: Cb, ctx?: Ctx, ctxCompat?: Ctx): ReturnType<Cb>[];
      mapArray<Ctx, Cb extends MapArrayCb1<Ctx>>(dims: DimensionLoose, cb: Cb, ctx?: Ctx, ctxCompat?: Ctx): ReturnType<Cb>[];
      mapArray<Ctx, Cb extends MapArrayCb1<Ctx>>(dims: [DimensionLoose], cb: Cb, ctx?: Ctx, ctxCompat?: Ctx): ReturnType<Cb>[];
      mapArray<Ctx, Cb extends MapArrayCb2<Ctx>>(dims: [DimensionLoose, DimensionLoose], cb: Cb, ctx?: Ctx, ctxCompat?: Ctx): ReturnType<Cb>[];
      mapArray<Ctx, Cb extends MapArrayCb<Ctx>>(dims: ItrParamDims, cb: Cb, ctx?: Ctx, ctxCompat?: Ctx): ReturnType<Cb>[];
      /**
       * Data mapping to a new List with given dimensions
       */
      map<Ctx>(dims: DimensionLoose, cb: MapCb1<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): SeriesData<HostModel>;
      map<Ctx>(dims: [DimensionLoose], cb: MapCb1<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): SeriesData<HostModel>;
      map<Ctx>(dims: [DimensionLoose, DimensionLoose], cb: MapCb2<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): SeriesData<HostModel>;
      /**
       * !!Danger: used on stack dimension only.
       */
      modify<Ctx>(dims: DimensionLoose, cb: MapCb1<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): void;
      modify<Ctx>(dims: [DimensionLoose], cb: MapCb1<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): void;
      modify<Ctx>(dims: [DimensionLoose, DimensionLoose], cb: MapCb2<Ctx>, ctx?: Ctx, ctxCompat?: Ctx): void;
      /**
       * Large data down sampling on given dimension
       * @param sampleIndex Sample index for name and id
       */
      downSample(dimension: DimensionLoose, rate: number, sampleValue: (frameValues: ArrayLike$1<ParsedValue>) => ParsedValueNumeric, sampleIndex: (frameValues: ArrayLike$1<ParsedValue>, value: ParsedValueNumeric) => number): SeriesData<HostModel>;
      /**
       * Large data down sampling using min-max
       * @param {string} valueDimension
       * @param {number} rate
       */
      minmaxDownSample(valueDimension: DimensionLoose, rate: number): SeriesData<HostModel>;
      /**
       * Large data down sampling using largest-triangle-three-buckets
       * @param {string} valueDimension
       * @param {number} targetCount
       */
      lttbDownSample(valueDimension: DimensionLoose, rate: number): SeriesData<HostModel>;
      getRawDataItem(idx: number): OptionDataItem;
      /**
       * Get model of one data item.
       */
      getItemModel<ItemOpts extends unknown = unknown>(idx: number): Model<ItemOpts>;
      /**
       * Create a data differ
       */
      diff(otherList: SeriesData): DataDiffer;
      /**
       * Get visual property.
       */
      getVisual<K extends keyof Visual>(key: K): Visual[K];
      /**
       * Set visual property
       *
       * @example
       *  setVisual('color', color);
       *  setVisual({
       *      'color': color
       *  });
       */
      setVisual<K extends keyof Visual>(key: K, val: Visual[K]): void;
      setVisual(kvObj: Partial<Visual>): void;
      /**
       * Get visual property of single data item
       */
      getItemVisual<K extends keyof Visual>(idx: number, key: K): Visual[K];
      /**
       * If exists visual property of single data item
       */
      hasItemVisual(): boolean;
      /**
       * Make sure itemVisual property is unique
       */
      ensureUniqueItemVisual<K extends keyof Visual>(idx: number, key: K): Visual[K];
      /**
       * Set visual property of single data item
       *
       * @param {number} idx
       * @param {string|Object} key
       * @param {*} [value]
       *
       * @example
       *  setItemVisual(0, 'color', color);
       *  setItemVisual(0, {
       *      'color': color
       *  });
       */
      setItemVisual<K extends keyof Visual>(idx: number, key: K, value: Visual[K]): void;
      setItemVisual(idx: number, kvObject: Partial<Visual>): void;
      /**
       * Clear itemVisuals and list visual.
       */
      clearAllVisual(): void;
      /**
       * Set layout property.
       */
      setLayout(key: string, val: any): void;
      setLayout(kvObj: Dictionary<any>): void;
      /**
       * Get layout property.
       */
      getLayout(key: string): any;
      /**
       * Get layout of single data item
       */
      getItemLayout(idx: number): any;
      /**
       * Set layout of single data item
       */
      setItemLayout<M = false>(idx: number, layout: (M extends true ? Dictionary<any> : any), merge?: M): void;
      /**
       * Clear all layout of single data item
       */
      clearItemLayouts(): void;
      /**
       * Set graphic element relative to data. It can be set as null
       */
      setItemGraphicEl(idx: number, el: Element): void;
      getItemGraphicEl(idx: number): Element;
      eachItemGraphicEl<Ctx = unknown>(cb: (this: Ctx, el: Element, idx: number) => void, context?: Ctx): void;
      /**
       * Shallow clone a new list except visual and layout properties, and graph elements.
       * New list only change the indices.
       */
      cloneShallow(list?: SeriesData<HostModel>): SeriesData<HostModel>;
      /**
       * Wrap some method to add more feature
       */
      wrapMethod(methodName: FunctionPropertyNames<SeriesData>, injectFunction: (...args: any) => any): void;
      private static internalField;
  }
  interface SeriesData {
      getLinkedData(dataType?: SeriesDataType): SeriesData;
      getLinkedDataAll(): {
          data: SeriesData;
          type?: SeriesDataType;
      }[];
  }
  
  /**
   * If string, e.g., 'geo', means {geoIndex: 0}.
   * If Object, could contain some of these properties below:
   * {
   *     seriesIndex, seriesId, seriesName,
   *     geoIndex, geoId, geoName,
   *     bmapIndex, bmapId, bmapName,
   *     xAxisIndex, xAxisId, xAxisName,
   *     yAxisIndex, yAxisId, yAxisName,
   *     gridIndex, gridId, gridName,
   *     ... (can be extended)
   * }
   * Each properties can be number|string|Array.<number>|Array.<string>
   * For example, a finder could be
   * {
   *     seriesIndex: 3,
   *     geoId: ['aa', 'cc'],
   *     gridName: ['xx', 'rr']
   * }
   * xxxIndex can be set as 'all' (means all xxx) or 'none' (means not specify)
   * If nothing or null/undefined specified, return nothing.
   * If both `abcIndex`, `abcId`, `abcName` specified, only one work.
   * The priority is: index > id > name, the same with `ecModel.queryComponents`.
   */
  type ModelFinderIndexQuery = number | number[] | 'all' | 'none' | false;
  type ModelFinderIdQuery = OptionId | OptionId[];
  type ModelFinderNameQuery = OptionId | OptionId[];
  type ModelFinder = string | ModelFinderObject;
  type ModelFinderObject = {
      seriesIndex?: ModelFinderIndexQuery;
      seriesId?: ModelFinderIdQuery;
      seriesName?: ModelFinderNameQuery;
      geoIndex?: ModelFinderIndexQuery;
      geoId?: ModelFinderIdQuery;
      geoName?: ModelFinderNameQuery;
      bmapIndex?: ModelFinderIndexQuery;
      bmapId?: ModelFinderIdQuery;
      bmapName?: ModelFinderNameQuery;
      xAxisIndex?: ModelFinderIndexQuery;
      xAxisId?: ModelFinderIdQuery;
      xAxisName?: ModelFinderNameQuery;
      yAxisIndex?: ModelFinderIndexQuery;
      yAxisId?: ModelFinderIdQuery;
      yAxisName?: ModelFinderNameQuery;
      gridIndex?: ModelFinderIndexQuery;
      gridId?: ModelFinderIdQuery;
      gridName?: ModelFinderNameQuery;
      matrixIndex?: ModelFinderIndexQuery;
      matrixId?: ModelFinderIdQuery;
      matrixName?: ModelFinderNameQuery;
      dataIndex?: number;
      dataIndexInside?: number;
  };
  /**
   * {
   *     seriesModels: [seriesModel1, seriesModel2],
   *     seriesModel: seriesModel1, // The first model
   *     geoModels: [geoModel1, geoModel2],
   *     geoModel: geoModel1, // The first model
   *     ...
   * }
   */
  type ParsedModelFinder = {
      [key: string]: ComponentModel | ComponentModel[] | undefined;
  };
  type QueryReferringOpt = {
      useDefault?: boolean;
      enableAll?: boolean;
      enableNone?: boolean;
  };
  /**
   * Use an iterator to avoid exposing the internal list or duplicating it
   * for the outside traveller, and no extra heap allocation.
   * @usage
   *  for (const it = resetIterator(); it.next();) {
   *      const item = it.item;
   *      const key = it.key;
   *      const itIdx = it.itIdx;
   *      // ...
   *  }
   * @usage
   *  const it = resetIterator();
   *  while (it.next()) { ... }
   * @usage
   *  for (resetIterator(it); it.next();) { ... }
   */
  class ListIterator<TItem> {
      private _idx;
      private _end;
      private _list;
      private _step;
      item: TItem | NullUndefined$1;
      key: number;
      /**
       * The loop condition is `idx < end` if `step > 0`;
       * The loop condition is `idx >= end` if `step < 0`.
       *
       * @param end By default `list.length` if `step > 0`; `0` if `step < 0`.
       * @param step By default `1`.
       */
      reset(list: TItem[], start: number, end?: number, step?: number): ListIterator<TItem>;
      next(): boolean;
  }
  
  class ComponentModel<Opt extends ComponentOption = ComponentOption> extends Model<Opt> {
      /**
       * @readonly
       */
      type: ComponentFullType;
      /**
       * @readonly
       */
      id: string;
      /**
       * Because simplified concept is probably better, series.name (or component.name)
       * has been having too many responsibilities:
       * (1) Generating id (which requires name in option should not be modified).
       * (2) As an index to mapping series when merging option or calling API (a name
       * can refer to more than one component, which is convenient is some cases).
       * (3) Display.
       * @readOnly But injected
       */
      name: string;
      /**
       * @readOnly
       */
      mainType: ComponentMainType;
      /**
       * @readOnly
       */
      subType: ComponentSubType;
      /**
       * @readOnly
       */
      componentIndex: number;
      /**
       * @readOnly
       */
      protected defaultOption: ComponentOption;
      /**
       * @readOnly
       */
      ecModel: GlobalModel;
      /**
       * @readOnly
       */
      static dependencies: string[];
      readonly uid: string;
      boxCoordinateSystem?: CoordinateSystem | NullUndefined$1;
      /**
       * Support merge layout params.
       * Only support 'box' now (left/right/top/bottom/width/height).
       */
      static layoutMode: ComponentLayoutMode | ComponentLayoutMode['type'];
      /**
       * Prevent from auto set z, zlevel, z2 by the framework.
       */
      preventAutoZ: boolean;
      __viewId: string;
      __requireNewView: boolean;
      static protoInitialize: void;
      constructor(option: Opt, parentModel: Model, ecModel: GlobalModel);
      init(option: Opt, parentModel: Model, ecModel: GlobalModel): void;
      mergeDefaultAndTheme(option: Opt, ecModel: GlobalModel): void;
      mergeOption(option: Opt, ecModel: GlobalModel): void;
      /**
       * Called immediately after `init` or `mergeOption` of this instance called.
       */
      optionUpdated(newCptOption: Opt, isInit: boolean): void;
      /**
       * [How to defaultOption]:
       *
       * (A) If using class declaration in typescript (since echarts 5):
       * ```ts
       * import {ComponentOption} from '../model/option.js';
       * export interface XxxOption extends ComponentOption {
       *     aaa: number
       * }
       * export class XxxModel extends Component {
       *     static type = 'xxx';
       *     static defaultOption: XxxOption = {
       *         aaa: 123
       *     }
       * }
       * Component.registerClass(XxxModel);
       * ```
       * ```ts
       * import {inheritDefaultOption} from '../util/component.js';
       * import {XxxModel, XxxOption} from './XxxModel.js';
       * export interface XxxSubOption extends XxxOption {
       *     bbb: number
       * }
       * class XxxSubModel extends XxxModel {
       *     static defaultOption: XxxSubOption = inheritDefaultOption(XxxModel.defaultOption, {
       *         bbb: 456
       *     })
       *     fn() {
       *         let opt = this.getDefaultOption();
       *         // opt is {aaa: 123, bbb: 456}
       *     }
       * }
       * ```
       *
       * (B) If using class extend (previous approach in echarts 3 & 4):
       * ```js
       * let XxxComponent = Component.extend({
       *     defaultOption: {
       *         xx: 123
       *     }
       * })
       * ```
       * ```js
       * let XxxSubComponent = XxxComponent.extend({
       *     defaultOption: {
       *         yy: 456
       *     },
       *     fn: function () {
       *         let opt = this.getDefaultOption();
       *         // opt is {xx: 123, yy: 456}
       *     }
       * })
       * ```
       */
      getDefaultOption(): Opt;
      /**
       * Notice: always force to input param `useDefault` in case that forget to consider it.
       * The same behavior as `modelUtil.parseFinder`.
       *
       * @param useDefault In many cases like series refer axis and axis refer grid,
       *        If axis index / axis id not specified, use the first target as default.
       *        In other cases like dataZoom refer axis, if not specified, measn no refer.
       */
      getReferringComponents(mainType: ComponentMainType, opt: QueryReferringOpt): {
          models: ComponentModel[];
          specified: boolean;
      };
      getBoxLayoutParams(): {
          left: PositionSizeOption;
          top: PositionSizeOption;
          right: PositionSizeOption;
          bottom: PositionSizeOption;
          width: PositionSizeOption;
          height: PositionSizeOption;
      };
      /**
       * Get key for zlevel.
       * If developers don't configure zlevel. We will assign zlevel to series based on the key.
       * For example, lines with trail effect and progressive series will in an individual zlevel.
       */
      getZLevelKey(): string;
      setZLevel(zlevel: number): void;
      static registerClass: ClassManager['registerClass'];
      static hasClass: ClassManager['hasClass'];
      static registerSubTypeDefaulter: SubTypeDefaulterManager['registerSubTypeDefaulter'];
  }
  
  type AnimateOrSetPropsOption = {
      dataIndex?: number;
      cb?: () => void;
      during?: (percent: number) => void;
      removeOpt?: AnimationOption$1;
      isFrom?: boolean;
  };
  /**
   * Update graphic element properties with or without animation according to the
   * configuration in series.
   *
   * Caution: this method will stop previous animation.
   * So do not use this method to one element twice before
   * animation starts, unless you know what you are doing.
   * @example
   *     graphic.updateProps(el, {
   *         position: [100, 100]
   *     }, seriesModel, dataIndex, function () { console.log('Animation done!'); });
   *     // Or
   *     graphic.updateProps(el, {
   *         position: [100, 100]
   *     }, seriesModel, function () { console.log('Animation done!'); });
   */
  function updateProps<Props extends ElementProps>(el: Element<Props>, props: Props, animatableModel?: Model<AnimationOptionMixin>, dataIndex?: AnimateOrSetPropsOption['dataIndex'] | AnimateOrSetPropsOption['cb'] | AnimateOrSetPropsOption, cb?: AnimateOrSetPropsOption['cb'] | AnimateOrSetPropsOption['during'], during?: AnimateOrSetPropsOption['during']): void;
  
  /**
   * Init graphic element properties with or without animation according to the
   * configuration in series.
   *
   * Caution: this method will stop previous animation.
   * So do not use this method to one element twice before
   * animation starts, unless you know what you are doing.
   */
  function initProps<Props extends ElementProps>(el: Element<Props>, props: Props, animatableModel?: Model<AnimationOptionMixin>, dataIndex?: AnimateOrSetPropsOption['dataIndex'] | AnimateOrSetPropsOption['cb'] | AnimateOrSetPropsOption, cb?: AnimateOrSetPropsOption['cb'] | AnimateOrSetPropsOption['during'], during?: AnimateOrSetPropsOption['during']): void;
  
  type ExtendShapeOpt = Parameters<typeof Path.extend>[0];
  type ExtendShapeReturn = ReturnType<typeof Path.extend>;
  /**
   * Extend shape with parameters
   */
  function extendShape(opts: ExtendShapeOpt): ExtendShapeReturn;
  const extendPathFromString: typeof extendFromString;
  type SVGPathOption$1 = Parameters<typeof extendPathFromString>[1];
  type SVGPathCtor = ReturnType<typeof extendPathFromString>;
  type SVGPath$1 = InstanceType<SVGPathCtor>;
  /**
   * Extend path
   */
  function extendPath(pathData: string, opts: SVGPathOption$1): SVGPathCtor;
  /**
   * Register a user defined shape.
   * The shape class can be fetched by `getShapeClass`
   * This method will overwrite the registered shapes, including
   * the registered built-in shapes, if using the same `name`.
   * The shape can be used in `custom series` and
   * `graphic component` by declaring `{type: name}`.
   *
   * @param name
   * @param ShapeClass Can be generated by `extendShape`.
   */
  function registerShape(name: string, ShapeClass: {
      new (): Path;
  }): void;
  /**
   * Find shape class registered by `registerShape`. Usually used in
   * fetching user defined shape.
   *
   * [Caution]:
   * (1) This method **MUST NOT be used inside echarts !!!**, unless it is prepared
   * to use user registered shapes.
   * Because the built-in shape (see `getBuiltInShape`) will be registered by
   * `registerShape` by default. That enables users to get both built-in
   * shapes as well as the shapes belonging to themsleves. But users can overwrite
   * the built-in shapes by using names like 'circle', 'rect' via calling
   * `registerShape`. So the echarts inner featrues should not fetch shapes from here
   * in case that it is overwritten by users, except that some features, like
   * `custom series`, `graphic component`, do it deliberately.
   *
   * (2) In the features like `custom series`, `graphic component`, the user input
   * `{tpye: 'xxx'}` does not only specify shapes but also specify other graphic
   * elements like `'group'`, `'text'`, `'image'` or event `'path'`. Those names
   * are reserved names, that is, if some user registers a shape named `'image'`,
   * the shape will not be used. If we intending to add some more reserved names
   * in feature, that might bring break changes (disable some existing user shape
   * names). But that case probably rarely happens. So we don't make more mechanism
   * to resolve this issue here.
   *
   * @param name
   * @return The shape class. If not found, return nothing.
   */
  function getShapeClass(name: string): {
      new (): Path;
  };
  /**
   * Create a path element from path data string
   * @param pathData
   * @param opts
   * @param rect
   * @param layout 'center' or 'cover' default to be cover
   */
  function makePath(pathData: string, opts: SVGPathOption$1, rect: ZRRectLike, layout?: 'center' | 'cover'): SVGPath$1;
  /**
   * Create a image element from image url
   * @param imageUrl image url
   * @param opts options
   * @param rect constrain rect
   * @param layout 'center' or 'cover'. Default to be 'cover'
   */
  function makeImage(imageUrl: string, rect: ZRRectLike, layout?: 'center' | 'cover'): ZRImage;
  const mergePath$1: typeof mergePath;
  /**
   * Resize a path to fit the rect
   * @param path
   * @param rect
   */
  function resizePath(path: SVGPath$1, rect: ZRRectLike): void;
  /**
   * Get transform matrix of target (param target),
   * in coordinate of its ancestor (param ancestor)
   *
   * @param target
   * @param [ancestor]
   */
  function getTransform(target: Transformable, ancestor?: Transformable): MatrixArray;
  function clipPointsByRect(points: VectorArray[], rect: ZRRectLike): number[][];
  /**
   * Return a new clipped rect. If rect size are negative, return undefined.
   */
  function clipRectByRect(targetRect: ZRRectLike, rect: ZRRectLike): ZRRectLike | undefined;
  function createIcon(iconStr: string, // Support 'image://' or 'path://' or direct svg path.
  opt?: Omit<DisplayableProps, 'style'>, rect?: ZRRectLike): SVGPath$1 | ZRImage;
  
  type TextStyleProps$1 = ZRText['style'];
  function getTextRect(text: TextStyleProps$1['text'], font?: TextStyleProps$1['font'], align?: TextStyleProps$1['align'], verticalAlign?: TextStyleProps$1['verticalAlign'], padding?: TextStyleProps$1['padding'], rich?: TextStyleProps$1['rich'], truncate?: boolean, lineHeight?: number): BoundingRect;
  
  /**
   * Add a comma each three digit.
   */
  function addCommas(x: string | number): string;
  function toCamelCase(str: string, upperCaseFirst?: boolean): string;
  const normalizeCssArray$1: typeof normalizeCssArray;
  
  interface TplFormatterParam extends Dictionary<any> {
      $vars: string[];
  }
  /**
   * Template formatter
   * @param {Array.<Object>|Object} paramsList
   */
  function formatTpl(tpl: string, paramsList: TplFormatterParam | TplFormatterParam[], encode?: boolean): string;
  interface RichTextTooltipMarker {
      renderMode: TooltipRenderMode;
      content: string;
      style: Dictionary<unknown>;
  }
  type TooltipMarker = string | RichTextTooltipMarker;
  type TooltipMarkerType = 'item' | 'subItem';
  interface GetTooltipMarkerOpt {
      color?: ColorString;
      extraCssText?: string;
      type?: TooltipMarkerType;
      renderMode?: TooltipRenderMode;
      markerId?: string;
  }
  function getTooltipMarker(color: ColorString, extraCssText?: string): TooltipMarker;
  function getTooltipMarker(opt: GetTooltipMarkerOpt): TooltipMarker;
  /**
   * @deprecated Use `time/format` instead.
   * ISO Date format
   * @param {string} tpl
   * @param {number} value
   * @param {boolean} [isUTC=false] Default in local time.
   *           see `module:echarts/scale/Time`
   *           and `module:echarts/util/number#parseDate`.
   * @inner
   */
  function formatTime(tpl: string, value: unknown, isUTC?: boolean): string;
  /**
   * Capital first
   * @param {string} str
   * @return {string}
   */
  function capitalFirst(str: string): string;
  
  /**
   * This is an abstract layer to insulate the upper usage of tooltip content
   * from the different backends according to different `renderMode` ('html' or 'richText').
   * With the help of the abstract layer, it does not need to consider how to create and
   * assemble html or richText snippets when making tooltip content.
   *
   * @usage
   *
   * ```ts
   * class XxxSeriesModel {
   *     formatTooltip(
   *         dataIndex: number,
   *         multipleSeries: boolean,
   *         dataType: string
   *     ) {
   *         ...
   *         return createTooltipMarkup('section', {
   *             header: header,
   *             blocks: [
   *                 createTooltipMarkup('nameValue', {
   *                     name: name,
   *                     value: value,
   *                     noValue: value == null
   *                 })
   *             ]
   *         });
   *     }
   * }
   * ```
   */
  type TooltipMarkupBlockFragment = TooltipMarkupSection | TooltipMarkupNameValueBlock;
  interface TooltipMarkupBlock {
      sortParam?: unknown;
  }
  interface TooltipMarkupSection extends TooltipMarkupBlock {
      type: 'section';
      header?: unknown;
      noHeader?: boolean;
      blocks?: TooltipMarkupBlockFragment[];
      sortBlocks?: boolean;
      valueFormatter?: CommonTooltipOption<unknown>['valueFormatter'];
  }
  interface TooltipMarkupNameValueBlock extends TooltipMarkupBlock {
      type: 'nameValue';
      markerType?: TooltipMarkerType;
      markerColor?: ColorString;
      name?: string;
      value?: unknown | unknown[];
      valueType?: DimensionType | DimensionType[];
      noName?: boolean;
      noValue?: boolean;
      dataIndex?: number;
      valueFormatter?: CommonTooltipOption<unknown>['valueFormatter'];
  }
  
  interface DataFormatMixin extends DataHost {
      ecModel: GlobalModel;
      mainType: ComponentMainType;
      subType: ComponentSubType;
      componentIndex: number;
      id: string;
      name: string;
      animatedValue: OptionDataValue[];
  }
  class DataFormatMixin {
      /**
       * Get params for formatter
       */
      getDataParams(dataIndex: number, dataType?: SeriesDataType): CallbackDataParams;
      /**
       * Format label
       * @param dataIndex
       * @param status 'normal' by default
       * @param dataType
       * @param labelDimIndex Only used in some chart that
       *        use formatter in different dimensions, like radar.
       * @param formatter Formatter given outside.
       * @return return null/undefined if no formatter
       */
      getFormattedLabel(dataIndex: number, status?: DisplayState, dataType?: SeriesDataType, labelDimIndex?: number, formatter?: string | ((params: object) => string), extendParams?: {
          interpolatedValue: InterpolatableValue;
      }): string;
      /**
       * Get raw value in option
       */
      getRawValue(idx: number, dataType?: SeriesDataType): unknown;
      /**
       * Should be implemented.
       * @param {number} dataIndex
       * @param {boolean} [multipleSeries=false]
       * @param {string} [dataType]
       */
      formatTooltip(dataIndex: number, multipleSeries?: boolean, dataType?: string): TooltipFormatResult;
  }
  type TooltipFormatResult = string | TooltipMarkupBlockFragment;
  
  /**
   * [Notice]:
   * Consider custom bundle on demand, chart specified
   * or component specified types and constants should
   * not put here. Only common types and constants can
   * be put in this file.
   */
  
  type RendererType = 'canvas' | 'svg';
  type NullUndefined$1 = null | undefined;
  type LayoutOrient = 'vertical' | 'horizontal';
  type HorizontalAlign = 'left' | 'center' | 'right';
  type VerticalAlign = 'top' | 'middle' | 'bottom';
  type ColorString = string;
  type ZRColor = ColorString | LinearGradientObject | RadialGradientObject | PatternObject;
  type ZRLineType = 'solid' | 'dotted' | 'dashed' | number | number[];
  type ZRFontStyle = 'normal' | 'italic' | 'oblique';
  type ZRFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | number;
  type ZREasing = AnimationEasing;
  type ZRTextAlign = TextAlign;
  type ZRTextVerticalAlign = TextVerticalAlign;
  type ZRRectLike = RectLike;
  type ZRStyleProps = PathStyleProps | ImageStyleProps | TSpanStyleProps | TextStyleProps;
  type ZRElementEventName = ElementEventName | 'globalout';
  type ComponentFullType = string;
  type ComponentMainType = keyof ECUnitOption & string;
  type ComponentSubType = Exclude<ComponentOption['type'], undefined>;
  interface DataHost {
      getData(dataType?: SeriesDataType): SeriesData;
  }
  interface DataModel extends Model<unknown>, DataHost, DataFormatMixin {
      getDataParams(dataIndex: number, dataType?: SeriesDataType, el?: Element): CallbackDataParams;
  }
  interface PayloadItem {
      excludeSeriesId?: OptionId | OptionId[];
      animation?: PayloadAnimationPart;
      [other: string]: any;
  }
  interface Payload extends PayloadItem {
      type: string;
      escapeConnect?: boolean;
      batch?: PayloadItem[];
  }
  interface HighlightPayload extends Payload {
      type: 'highlight';
      notBlur?: boolean;
  }
  interface DownplayPayload extends Payload {
      type: 'downplay';
      notBlur?: boolean;
  }
  interface PayloadAnimationPart {
      duration?: number;
      easing?: AnimationEasing;
      delay?: number;
  }
  interface SelectChangedEvent extends ECActionRefinedEvent {
      type: 'selectchanged';
      isFromClick: boolean;
      fromAction: 'select' | 'unselect' | 'toggleSelected';
      fromActionPayload: Payload;
      selected: {
          seriesIndex: number;
          dataType?: SeriesDataType;
          dataIndex: number[];
      }[];
  }
  /**
   * @deprecated Backward compat.
   */
  interface SelectChangedPayload extends Payload {
      type: 'selectchanged';
      isFromClick: boolean;
      fromAction: 'select' | 'unselect' | 'toggleSelected';
      fromActionPayload: Payload;
      selected: {
          seriesIndex: number;
          dataType?: SeriesDataType;
          dataIndex: number[];
      }[];
  }
  interface ViewRootGroup extends Group {
      __ecComponentInfo?: {
          mainType: string;
          index: number;
      };
  }
  interface ECElementEvent extends ECEventData, CallbackDataParams {
      type: ZRElementEventName;
      event?: ElementEvent;
  }
  /**
   * The echarts event type to user.
   * Also known as packedEvent.
   */
  interface ECActionEvent extends ECEventData {
      type: string;
      componentType?: string;
      componentIndex?: number;
      seriesIndex?: number;
      escapeConnect?: boolean;
      batch?: ECEventData[];
  }
  /**
   * TODO: not applicable in `ECEventProcessor` yet.
   */
  interface ECActionRefinedEvent extends ECActionEvent {
      type: string;
      fromAction: string;
      fromActionPayload: Payload;
  }
  type ECActionRefinedEventContent<TRefinedEvent extends ECActionRefinedEvent> = Omit<TRefinedEvent, 'type' | 'fromAction' | 'fromActionPayload'>;
  interface ECEventData {
      [key: string]: any;
  }
  interface EventQueryItem {
      [key: string]: any;
  }
  /**
   * The rule of creating "public event" and "event for connect":
   *  - If `refineEvent` provided,
   *      `refineEvent` creates the "public event",
   *      and "event for connect" is created internally by replicating the payload.
   *      This is because `makeActionFromEvent` requires the content of event to be
   *      the same as the original payload, while `refineEvent` creates a user-friend
   *      event that differs from the original payload.
   *  - Else if `ActionHandler` returns an object,
   *      it is both the "public event" and the "event for connect".
   *      (@deprecated, but keep this mechanism for backward compatibility).
   *  - Else,
   *      replicate the payload as both the "public event" and "event for connect".
   */
  interface ActionInfo {
      type: string;
      event?: string;
      update?: string;
      action?: ActionHandler;
      refineEvent?: ActionRefineEvent;
      publishNonRefinedEvent?: boolean;
  }
  interface ActionHandler {
      (payload: Payload, ecModel: GlobalModel, api: ExtensionAPI): void | ECEventData;
  }
  interface ActionRefineEvent {
      (actionResultBatch: ECEventData[], payload: Payload, ecModel: GlobalModel, api: ExtensionAPI): {
          eventContent: ECActionRefinedEventContent<ECActionRefinedEvent>;
      };
  }
  interface OptionPreprocessor {
      (option: ECUnitOption, isTheme: boolean): void;
  }
  interface PostUpdater {
      (ecModel: GlobalModel, api: ExtensionAPI): void;
  }
  interface StageHandlerReset {
      (seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload?: Payload): StageHandlerProgressExecutor | StageHandlerProgressExecutor[] | void;
  }
  interface StageHandlerOverallReset {
      (ecModel: GlobalModel, api: ExtensionAPI, payload?: Payload): void;
  }
  interface StageHandler {
      /**
       * Indicate that the task will be piped all series
       * (`performRawSeries` indicate whether includes filtered series).
       */
      createOnAllSeries?: boolean;
      /**
       * Indicate that the task will be only piped in the pipeline of this type of series.
       * (`performRawSeries` indicate whether includes filtered series).
       */
      seriesType?: string;
      /**
       * Indicate that the task will be only piped in the pipeline of the returned series.
       */
      getTargetSeries?: (ecModel: GlobalModel, api: ExtensionAPI) => HashMap<SeriesModel>;
      /**
       * If `true`, filtered series will also be "performed".
       */
      performRawSeries?: boolean;
      /**
       * Called only when this task in a pipeline.
       */
      plan?: StageHandlerPlan;
      /**
       * If `overallReset` specified, an "overall task" will be created.
       * "overall task" does not belong to a certain pipeline.
       * They always be "performed" in certain phase (depends on when they declared).
       * They has "stub"s to connect with pipelines (one stub for one pipeline),
       * delivering info like "dirty" and "output end".
       */
      overallReset?: StageHandlerOverallReset;
      /**
       * Called only when this task in a pipeline, and "dirty".
       */
      reset?: StageHandlerReset;
  }
  interface StageHandlerInternal extends StageHandler {
      uid: string;
      visualType?: 'layout' | 'visual';
      __prio: number;
      __raw: StageHandler | StageHandlerOverallReset;
      isVisual?: boolean;
      isLayout?: boolean;
  }
  type StageHandlerProgressParams = TaskProgressParams;
  interface StageHandlerProgressExecutor {
      dataEach?: (data: SeriesData, idx: number) => void;
      progress?: (params: StageHandlerProgressParams, data: SeriesData) => void;
  }
  type StageHandlerPlanReturn = TaskPlanCallbackReturn;
  interface StageHandlerPlan {
      (seriesModel: SeriesModel, ecModel: GlobalModel, api: ExtensionAPI, payload?: Payload): StageHandlerPlanReturn;
  }
  interface LoadingEffectCreator {
      (api: ExtensionAPI, cfg: object): LoadingEffect;
  }
  interface LoadingEffect extends Element {
      resize: () => void;
  }
  /**
   * 'html' is used for rendering tooltip in extra DOM form, and the result
   * string is used as DOM HTML content.
   * 'richText' is used for rendering tooltip in rich text form, for those where
   * DOM operation is not supported.
   */
  type TooltipRenderMode = 'html' | 'richText';
  type TooltipOrderMode = 'valueAsc' | 'valueDesc' | 'seriesAsc' | 'seriesDesc';
  type OrdinalRawValue = string | number;
  type OrdinalNumber = number;
  /**
   * @usage For example,
   * ```js
   * { ordinalNumbers: [2, 5, 3, 4] }
   * ```
   * means that ordinal 2 should be displayed on tick 0,
   * ordinal 5 should be displayed on tick 1, ...
   */
  type OrdinalSortInfo = {
      ordinalNumbers: OrdinalNumber[];
  };
  /**
   * `OptionDataValue` is the primitive value in `series.data` or `dataset.source`.
   * `OptionDataValue` are parsed (see `src/data/helper/dataValueHelper.parseDataValue`)
   * into `ParsedValue` and stored into `data/SeriesData` storage.
   * Note:
   * (1) The term "parse" does not mean `src/scale/Scale['parse']`(@see `ScaleDataValue`).
   * (2) If a category dimension is not mapped to any axis, its raw value will NOT be
   * parsed to `OrdinalNumber` but keep the original `OrdinalRawValue` in `src/data/SeriesData` storage.
   */
  type ParsedValue = ParsedValueNumeric | OrdinalRawValue;
  type ParsedValueNumeric = number | OrdinalNumber;
  /**
   * `ScaleDataValue` represents the user input axis value in echarts API.
   * (For example, used `axis.min`/`axis.max` in echarts option, `convertToPixel`).
   * NOTICE:
   *  `ScaleDataValue` is slightly different from `OptionDataValue` for historical reason.
   *  `ScaleDataValue` should be parsed by `src/scale/Scale['parse']`.
   *  `OptionDataValue` should be parsed by `src/data/helper/dataValueHelper.parseDataValue`.
   * FIXME:
   *  Make `ScaleDataValue` `OptionDataValue` consistent? Since numeric string (like `'123'`) is accepted
   *  in `series.data` and is effectively accepted in some axis relevant option (e.g., `axis.min/max`),
   *  `type ScaleDataValue` should also include it for consistency. But it might bring some breaking in
   *  TS interface (user callback) and need comprehensive checks for all of the parsing of `ScaleDataValue`.
   */
  type ScaleDataValue = ParsedValueNumeric | OrdinalRawValue | Date;
  /**
   * - `ScaleDataValue`:
   *   e.g. geo accept that primitive input, like `convertToPixel('some_place')`;
   *   Some coord sys, such as 'cartesian2d', also supports that for only query only a single axis.
   * - `ScaleDataValue[]`:
   *   This is the most common case, each array item represent each data in
   *   every dimension required by the coord sys. e.g., `[12, 98]` represents `[xData, yData]`.
   * - `(ScaleDataValue[])[]`:
   *   represents `[data_range_x, data_range_y]`. e.g., `dataToPoint([[5, 600], [8889, 9000]])`,
   *   represents data range `[5, 600]` in x, and `[8889, 9000]` in y.
   *   Can be also `[5, [8999, 9000]]`.
   */
  type CoordinateSystemDataCoord = (ScaleDataValue | NullUndefined$1) | (ScaleDataValue | NullUndefined$1)[] | (ScaleDataValue | ScaleDataValue[] | NullUndefined$1)[];
  type AxisBreakOption = {
      start: ScaleDataValue;
      end: ScaleDataValue;
      gap?: number | string;
      isExpanded?: boolean;
  };
  type AxisBreakOptionIdentifierInAxis = Pick<AxisBreakOption, 'start' | 'end'>;
  type ParsedAxisBreakList = ParsedAxisBreak[];
  type ParsedAxisBreak = {
      breakOption: AxisBreakOption;
      vmin: number;
      vmax: number;
      gapParsed: {
          type: 'tpAbs' | 'tpPrct';
          val: number;
      };
      gapReal: number | NullUndefined$1;
  };
  type VisualAxisBreak = {
      type: 'vmin' | 'vmax';
      parsedBreak: ParsedAxisBreak;
  };
  type AxisLabelFormatterExtraBreakPart = {
      break?: {
          type: 'start' | 'end';
          start: ParsedAxisBreak['vmin'];
          end: ParsedAxisBreak['vmax'];
      };
  };
  interface ScaleTick {
      value: number;
      break?: VisualAxisBreak;
      time?: TimeScaleTick['time'];
  }
  interface TimeScaleTick extends ScaleTick {
      time: {
          /**
           * Level information is used for label formatting.
           * `level` is 0 or undefined by default, with higher value indicating greater significant.
           * For example, a time axis may contain labels like: Jan, 8th, 16th, 23th, Feb, and etc.
           * In this case, month labels like Jan and Feb should be displayed in a more significant
           * way than days. The tick labels are:
           *      labels: `Jan  8th  16th  23th  Feb`
           *      levels: `1    0    0     0     1  `
           * The label formatter can be configured as `{[timeUnit]: string | string[]}`, where the
           * timeUnit is determined by the tick value itself by `time.ts#getUnitFromValue`, while
           * the `level` is the index under that time unit. (i.e., `formatter[timeUnit][level]`).
           */
          level: number;
          /**
           * An upper and lower time unit that is suggested to be displayed.
           * Terms upper/lower means, such as 'year' is "upper" and 'month' is "lower".
           * This is just suggestion. Time units that are out of this range can also be displayed.
           */
          upperTimeUnit: PrimaryTimeUnit;
          lowerTimeUnit: PrimaryTimeUnit;
      };
  }
  /**
   * Return type of API `CoordinateSystem['dataToLayout']`, expose to users.
   */
  interface CoordinateSystemDataLayout {
      rect?: RectLike;
      contentRect?: RectLike;
      matrixXYLocatorRange?: number[][];
  }
  type DimensionIndex = number;
  type DimensionIndexLoose = DimensionIndex | string;
  type DimensionName = string;
  type DimensionLoose = DimensionName | DimensionIndexLoose;
  type DimensionType = DataStoreDimensionType;
  interface DataVisualDimensions {
      tooltip?: DimensionIndex | false;
      label?: DimensionIndex;
      itemName?: DimensionIndex;
      itemId?: DimensionIndex;
      itemGroupId?: DimensionIndex;
      itemChildGroupId?: DimensionIndex;
      seriesName?: DimensionIndex;
  }
  type DimensionDefinition = {
      type?: DataStoreDimensionType;
      name?: DimensionName;
      displayName?: string;
  };
  type DimensionDefinitionLoose = DimensionDefinition['name'] | DimensionDefinition;
  const SOURCE_FORMAT_ORIGINAL: "original";
  const SOURCE_FORMAT_ARRAY_ROWS: "arrayRows";
  const SOURCE_FORMAT_OBJECT_ROWS: "objectRows";
  const SOURCE_FORMAT_KEYED_COLUMNS: "keyedColumns";
  const SOURCE_FORMAT_TYPED_ARRAY: "typedArray";
  const SOURCE_FORMAT_UNKNOWN: "unknown";
  type SourceFormat = typeof SOURCE_FORMAT_ORIGINAL | typeof SOURCE_FORMAT_ARRAY_ROWS | typeof SOURCE_FORMAT_OBJECT_ROWS | typeof SOURCE_FORMAT_KEYED_COLUMNS | typeof SOURCE_FORMAT_TYPED_ARRAY | typeof SOURCE_FORMAT_UNKNOWN;
  const SERIES_LAYOUT_BY_COLUMN: "column";
  const SERIES_LAYOUT_BY_ROW: "row";
  type SeriesLayoutBy = typeof SERIES_LAYOUT_BY_COLUMN | typeof SERIES_LAYOUT_BY_ROW;
  type OptionSourceHeader = boolean | 'auto' | number;
  type SeriesDataType = 'main' | 'node' | 'edge';
  /**
   * [ECUnitOption]:
   * An object that contains definitions of components
   * and other properties. For example:
   *
   * ```ts
   * let option: ECUnitOption = {
   *
   *     // Single `title` component:
   *     title: {...},
   *
   *     // Two `visualMap` components:
   *     visualMap: [{...}, {...}],
   *
   *     // Two `series.bar` components
   *     // and one `series.pie` component:
   *     series: [
   *         {type: 'bar', data: [...]},
   *         {type: 'bar', data: [...]},
   *         {type: 'pie', data: [...]}
   *     ],
   *
   *     // A property:
   *     backgroundColor: '#421ae4'
   *
   *     // A property object:
   *     textStyle: {
   *         color: 'red',
   *         fontSize: 20
   *     }
   * };
   * ```
   */
  type ECUnitOption = {
      baseOption?: unknown;
      options?: unknown;
      media?: unknown;
      timeline?: ComponentOption | ComponentOption[];
      backgroundColor?: ZRColor;
      darkMode?: boolean | 'auto';
      textStyle?: GlobalTextStyleOption;
      useUTC?: boolean;
      hoverLayerThreshold?: number;
      legacyViewCoordSysCenterBase?: boolean;
      [key: string]: ComponentOption | ComponentOption[] | Dictionary<unknown> | unknown;
      stateAnimation?: AnimationOption$1;
  } & AnimationOptionMixin & ColorPaletteOptionMixin;
  /**
   * [ECOption]:
   * An object input to echarts.setOption(option).
   * May be an 'option: ECUnitOption',
   * or may be an object contains multi-options. For example:
   *
   * ```ts
   * let option: ECOption = {
   *     baseOption: {
   *         title: {...},
   *         legend: {...},
   *         series: [
   *             {data: [...]},
   *             {data: [...]},
   *             ...
   *         ]
   *     },
   *     timeline: {...},
   *     options: [
   *         {title: {...}, series: {data: [...]}},
   *         {title: {...}, series: {data: [...]}},
   *         ...
   *     ],
   *     media: [
   *         {
   *             query: {maxWidth: 320},
   *             option: {series: {x: 20}, visualMap: {show: false}}
   *         },
   *         {
   *             query: {minWidth: 320, maxWidth: 720},
   *             option: {series: {x: 500}, visualMap: {show: true}}
   *         },
   *         {
   *             option: {series: {x: 1200}, visualMap: {show: true}}
   *         }
   *     ]
   * };
   * ```
   */
  interface ECBasicOption extends ECUnitOption {
      baseOption?: ECUnitOption;
      timeline?: ComponentOption | ComponentOption[];
      options?: ECUnitOption[];
      media?: MediaUnit[];
  }
  type OptionSourceData<VAL extends OptionDataValue = OptionDataValue, ORIITEM extends OptionDataItemOriginal<VAL> = OptionDataItemOriginal<VAL>> = OptionSourceDataOriginal<VAL, ORIITEM> | OptionSourceDataObjectRows<VAL> | OptionSourceDataArrayRows<VAL> | OptionSourceDataKeyedColumns<VAL> | OptionSourceDataTypedArray;
  type OptionDataItemOriginal<VAL extends OptionDataValue = OptionDataValue> = VAL | VAL[] | OptionDataItemObject<VAL>;
  type OptionSourceDataOriginal<VAL extends OptionDataValue = OptionDataValue, ORIITEM extends OptionDataItemOriginal<VAL> = OptionDataItemOriginal<VAL>> = ArrayLike<ORIITEM>;
  type OptionSourceDataObjectRows<VAL extends OptionDataValue = OptionDataValue> = Array<Dictionary<VAL>>;
  type OptionSourceDataArrayRows<VAL extends OptionDataValue = OptionDataValue> = Array<Array<VAL>>;
  type OptionSourceDataKeyedColumns<VAL extends OptionDataValue = OptionDataValue> = Dictionary<ArrayLike<VAL>>;
  type OptionSourceDataTypedArray = ArrayLike<number>;
  type OptionDataItem = OptionDataValue | Dictionary<OptionDataValue> | OptionDataValue[] | OptionDataItemObject<OptionDataValue>;
  type OptionDataItemObject<T> = {
      id?: OptionId;
      name?: OptionName;
      groupId?: OptionId;
      childGroupId?: OptionId;
      value?: T[] | T;
      selected?: boolean;
  };
  type OptionId = string | number;
  type OptionName = string | number;
  interface GraphEdgeItemObject<VAL extends OptionDataValue> extends OptionDataItemObject<VAL> {
      /**
       * Name or index of source node.
       */
      source?: string | number;
      /**
       * Name or index of target node.
       */
      target?: string | number;
  }
  type OptionDataValue = string | number | Date | null | undefined;
  type OptionDataValueNumeric = number | '-';
  type OptionDataValueDate = Date | string | number;
  type ModelOption = any;
  type ThemeOption = Dictionary<any>;
  type DisplayState = 'normal' | 'emphasis' | 'blur' | 'select';
  interface OptionEncodeVisualDimensions {
      tooltip?: OptionEncodeValue;
      label?: OptionEncodeValue;
      itemName?: OptionEncodeValue;
      itemId?: OptionEncodeValue;
      seriesName?: OptionEncodeValue;
      itemGroupId?: OptionEncodeValue;
      childGroupdId?: OptionEncodeValue;
  }
  interface OptionEncode extends OptionEncodeVisualDimensions {
      [coordDim: string]: OptionEncodeValue | undefined;
  }
  type OptionEncodeValue = DimensionLoose | DimensionLoose[];
  type EncodeDefaulter = (source: Source, dimCount: number) => OptionEncode;
  interface CallbackDataParams {
      componentType: string;
      componentSubType: string;
      componentIndex: number;
      seriesType?: string;
      seriesIndex?: number;
      seriesId?: string;
      seriesName?: string;
      name: string;
      dataIndex: number;
      data: OptionDataItem;
      dataType?: SeriesDataType;
      value: OptionDataItem | OptionDataValue;
      color?: ZRColor;
      borderColor?: string;
      dimensionNames?: DimensionName[];
      encode?: DimensionUserOuputEncode;
      marker?: TooltipMarker;
      status?: DisplayState;
      dimensionIndex?: number;
      percent?: number;
      $vars: string[];
  }
  type InterpolatableValue = ParsedValue | ParsedValue[];
  type DecalDashArrayX = number | (number | number[])[];
  type DecalDashArrayY = number | number[];
  interface DecalObject {
      symbol?: string | string[];
      symbolSize?: number;
      symbolKeepAspect?: boolean;
      color?: string;
      backgroundColor?: string;
      dashArrayX?: DecalDashArrayX;
      dashArrayY?: DecalDashArrayY;
      rotation?: number;
      maxTileWidth?: number;
      maxTileHeight?: number;
  }
  interface MediaQuery {
      minWidth?: number;
      maxWidth?: number;
      minHeight?: number;
      maxHeight?: number;
      minAspectRatio?: number;
      maxAspectRatio?: number;
  }
  type MediaUnit = {
      query?: MediaQuery;
      option: ECUnitOption;
  };
  type ComponentLayoutMode = {
      type?: 'box';
      ignoreSize?: boolean | boolean[];
  };
  type PaletteOptionMixin = ColorPaletteOptionMixin;
  interface ColorPaletteOptionMixin {
      color?: ZRColor | ZRColor[];
      colorLayer?: ZRColor[][];
  }
  /**
   * Mixin of option set to control the box layout of each component.
   */
  interface BoxLayoutOptionMixin {
      width?: PositionSizeOption;
      height?: PositionSizeOption;
      top?: PositionSizeOption;
      right?: PositionSizeOption;
      bottom?: PositionSizeOption;
      left?: PositionSizeOption;
  }
  /**
   * Need to be parsed by `parsePositionOption` or `parsePositionSizeOption`.
   * Accept number, or numeric string (`'123'`), or percentage ('100%'), as x/y/width/height pixel number.
   * If null/undefined or invalid, return NaN.
   */
  type PositionSizeOption = number | string;
  interface CircleLayoutOptionMixin<TNuance extends {
      centerExtra: unknown;
  } = {
      centerExtra: never;
  }> {
      center?: (number | string)[] | TNuance['centerExtra'];
      radius?: (number | string)[] | number | string;
  }
  interface ShadowOptionMixin {
      shadowBlur?: number;
      shadowColor?: ColorString;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
  }
  interface BorderOptionMixin {
      borderColor?: ZRColor;
      borderWidth?: number;
      borderType?: ZRLineType;
      borderCap?: CanvasLineCap;
      borderJoin?: CanvasLineJoin;
      borderDashOffset?: number;
      borderMiterLimit?: number;
  }
  type ColorBy = 'series' | 'data';
  interface SunburstColorByMixin {
      colorBy?: ColorBy;
  }
  type AnimationDelayCallbackParam = {
      count: number;
      index: number;
  };
  type AnimationDurationCallback = (idx: number) => number;
  type AnimationDelayCallback = (idx: number, params?: AnimationDelayCallbackParam) => number;
  interface AnimationOption$1 {
      duration?: number;
      easing?: AnimationEasing;
      delay?: number;
  }
  /**
   * Mixin of option set to control the animation of series.
   */
  interface AnimationOptionMixin {
      /**
       * If enable animation
       */
      animation?: boolean;
      /**
       * Disable animation when the number of elements exceeds the threshold
       */
      animationThreshold?: number;
      /**
       * Duration of initialize animation.
       * Can be a callback to specify duration of each element
       */
      animationDuration?: number | AnimationDurationCallback;
      /**
       * Easing of initialize animation
       */
      animationEasing?: AnimationEasing;
      /**
       * Delay of initialize animation
       * Can be a callback to specify duration of each element
       */
      animationDelay?: number | AnimationDelayCallback;
      /**
       * Delay of data update animation.
       * Can be a callback to specify duration of each element
       */
      animationDurationUpdate?: number | AnimationDurationCallback;
      /**
       * Easing of data update animation.
       */
      animationEasingUpdate?: AnimationEasing;
      /**
       * Delay of data update animation.
       * Can be a callback to specify duration of each element
       */
      animationDelayUpdate?: number | AnimationDelayCallback;
  }
  interface RoamOptionMixin {
      /**
       * If enable roam. can be specified 'scale' or 'move'
       */
      roam?: boolean | 'pan' | 'move' | 'zoom' | 'scale';
      /**
       * Hover over an area where roaming is triggered.
       * - if `null`/`undefined`, the trigger area is
       *   the intersection of "self bounding rect" and "clipping rect (if any)".
       * - if 'global', the trigger area is
       *   the intersection of "the entire canvas" and "clipping rect (if any)".
       * NOTE:
       *  The clipping rect, which can be enabled by `clip: true`, is typically the layout rect.
       *  The layout rect is typically determined by option `left`/`right`/`top`/`bottom`/`width`/`height`, some
       *  components/series, such as `geo` and `series.map` can also be determined by `layoutCenter`/`layoutSize`,
       *  and may modified by `preserveAspect`.
       *
       * PENDING: do we need to support to only trigger roaming on the shapes themselves,
       *  rather than the bounding rect?
       * PENDING: do we need to support to check by the laytout rect? But in this case,
       *  `roamTrigger: 'global', clip: true` is more reasonable.
       */
      roamTrigger?: 'global' | 'selfRect' | NullUndefined$1;
      /**
       * Current center position.
       */
      center?: (number | string)[];
      /**
       * Current zoom level. Default is 1
       */
      zoom?: number;
      scaleLimit?: {
          min?: number;
          max?: number;
      };
  }
  interface PreserveAspectMixin {
      preserveAspect?: boolean | 'contain' | 'cover';
      preserveAspectAlign?: 'left' | 'right' | 'center';
      preserveAspectVerticalAlign?: 'top' | 'bottom' | 'middle';
  }
  type SymbolSizeCallback<T> = (rawValue: any, params: T) => number | number[];
  type SymbolCallback<T> = (rawValue: any, params: T) => string;
  type SymbolRotateCallback<T> = (rawValue: any, params: T) => number;
  type SymbolOffsetCallback<T> = (rawValue: any, params: T) => string | number | (string | number)[];
  /**
   * Mixin of option set to control the element symbol.
   * Include type of symbol, and size of symbol.
   */
  interface SymbolOptionMixin<T = never> {
      /**
       * type of symbol, like `cirlce`, `rect`, or custom path and image.
       */
      symbol?: string | (T extends never ? never : SymbolCallback<T>);
      /**
       * Size of symbol.
       */
      symbolSize?: number | number[] | (T extends never ? never : SymbolSizeCallback<T>);
      symbolRotate?: number | (T extends never ? never : SymbolRotateCallback<T>);
      symbolKeepAspect?: boolean;
      symbolOffset?: string | number | (string | number)[] | (T extends never ? never : SymbolOffsetCallback<T>);
  }
  /**
   * ItemStyleOption is a most common used set to config element styles.
   * It includes both fill and stroke style.
   */
  interface ItemStyleOption<TCbParams = never> extends ShadowOptionMixin, BorderOptionMixin {
      color?: ZRColor | (TCbParams extends never ? never : ((params: TCbParams) => ZRColor));
      opacity?: number;
      decal?: DecalObject | 'none';
      borderRadius?: (number | string)[] | number | string;
  }
  /**
   * ItemStyleOption is a option set to control styles on lines.
   * Used in the components or series like `line`, `axis`
   * It includes stroke style.
   */
  interface LineStyleOption<Clr = ZRColor> extends ShadowOptionMixin {
      width?: number;
      color?: Clr;
      opacity?: number;
      type?: ZRLineType;
      cap?: CanvasLineCap;
      join?: CanvasLineJoin;
      dashOffset?: number;
      miterLimit?: number;
  }
  /**
   * ItemStyleOption is a option set to control styles on an area, like polygon, rectangle.
   * It only include fill style.
   */
  interface AreaStyleOption<Clr = ZRColor> extends ShadowOptionMixin {
      color?: Clr;
      opacity?: number;
  }
  interface VisualOptionUnit {
      symbol?: string;
      symbolSize?: number;
      color?: ColorString;
      colorAlpha?: number;
      opacity?: number;
      colorLightness?: number;
      colorSaturation?: number;
      colorHue?: number;
      decal?: DecalObject;
      liftZ?: number;
  }
  type VisualOptionFixed = VisualOptionUnit;
  /**
   * Option about visual properties used in piecewise mapping
   * Used in each piece.
   */
  type VisualOptionPiecewise = VisualOptionUnit;
  /**
   * All visual properties can be encoded.
   */
  type BuiltinVisualProperty = keyof VisualOptionUnit;
  type TextCommonOptionNuanceBase = Record<string, unknown>;
  type TextCommonOptionNuanceDefault = {};
  type LabelStyleColorString = ColorString | 'inherit' | 'auto';
  interface TextCommonOption<TNuance extends TextCommonOptionNuanceBase = TextCommonOptionNuanceDefault> extends ShadowOptionMixin {
      color?: 'color' extends keyof TNuance ? (TNuance['color'] | LabelStyleColorString) : LabelStyleColorString;
      fontStyle?: ZRFontStyle;
      fontWeight?: ZRFontWeight;
      fontFamily?: string;
      fontSize?: number | string;
      align?: HorizontalAlign;
      verticalAlign?: VerticalAlign;
      baseline?: VerticalAlign;
      opacity?: number;
      lineHeight?: number;
      backgroundColor?: ColorString | {
          image: ImageLike | string;
      };
      borderColor?: string;
      borderWidth?: number;
      borderType?: ZRLineType;
      borderDashOffset?: number;
      borderRadius?: number | number[];
      padding?: number | number[];
      /**
       * Currently margin related options are not declared here. They are not supported in rich text.
       * @see {LabelCommonOption}
       */
      width?: number | string;
      height?: number;
      textBorderColor?: string;
      textBorderWidth?: number;
      textBorderType?: ZRLineType;
      textBorderDashOffset?: number;
      textShadowBlur?: number;
      textShadowColor?: string;
      textShadowOffsetX?: number;
      textShadowOffsetY?: number;
      tag?: string;
  }
  type GlobalTextStyleOption = Pick<TextCommonOption, 'color' | 'opacity' | 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily' | 'textShadowColor' | 'textShadowBlur' | 'textShadowOffsetX' | 'textShadowOffsetY' | 'textBorderColor' | 'textBorderWidth' | 'textBorderType' | 'textBorderDashOffset'>;
  interface RichTextOption extends Dictionary<TextCommonOption> {
  }
  interface LabelFormatterCallback<T = CallbackDataParams> {
      (params: T): string;
  }
  /**
   * LabelOption is an option set to control the style of labels.
   * Include color, background, shadow, truncate, rotation, distance, etc..
   */
  interface LabelOption<TNuance extends {
      positionExtra: unknown;
  } = {
      positionExtra: never;
  }> extends LabelCommonOption {
      /**
       * If show label
       */
      show?: boolean;
      position?: ElementTextConfig['position'] | TNuance['positionExtra'];
      distance?: number;
      rotate?: number;
      offset?: number[];
      silent?: boolean;
      precision?: number | 'auto';
      valueAnimation?: boolean;
  }
  /**
   * Common options for both `axis.axisLabel`, `axis.nameTextStyle and other `label`s.
   * Historically, they have had some nuances in options.
   */
  interface LabelCommonOption<TNuanceOption extends TextCommonOptionNuanceBase = TextCommonOptionNuanceDefault> extends TextCommonOption<TNuanceOption> {
      /**
       * Min margin between labels. Used when label has layout.
       * PENDING: @see {LabelMarginType}
       * It's `minMargin` instead of `margin` is for not breaking the previous code using `margin`.
       * See the summary in `textMargin`.
       *
       * [CAUTION]: do not set `minMargin` in `defaultOption`, otherwise users have to explicitly
       *  clear the `minMargin` to use `textMargin`.
       */
      minMargin?: number;
      /**
       * The space around the label to escape from overlapping.
       * Applied on the label local rect (rather than rotated enlarged rect)
       * Follow the format defined by `format.ts#normalizeCssArray`.
       *
       * Introduce the name `textMargin` rather than reuse the existing names to avoid breaking change:
       *  - `margin` historically have been used to indicate the distance from `label.x/.y` to something:
       *      - `axisLabel.margin` & `axisPointer.label.margin`: to the axis line.
       *      - `calendar.dayLabel/monthLabel/yearLabel.margin`:
       *      - `series-pie.label.margin`: to pie body (deprecated, replaced by `edgeDistance`)
       *      - `series-themeRiver.label.margin`: to the shape edge
       *  - `minMargin` conveys the same meaning as this `textMargin` but has a different nuance,
       *    it works like CSS margin collapse (gap = label1.minMargin/2 + label2.minMargin/2),
       *    and `minMargin` applied on the global bounding rect (parallel to screen x and y) rather
       *    than the original local bounding rect (can be rotated, smaller and more presice).
       * PENDING: @see {LabelMarginType}
       */
      textMargin?: number | number[];
      overflow?: TextStyleProps['overflow'];
      lineOverflow?: TextStyleProps['lineOverflow'];
      ellipsis?: TextStyleProps['ellipsis'];
      rich?: RichTextOption;
  }
  interface SeriesLabelOption<TCallbackDataParams extends CallbackDataParams = CallbackDataParams, TNuance extends {
      positionExtra: unknown;
  } = {
      positionExtra: never;
  }> extends LabelOption<TNuance> {
      formatter?: string | LabelFormatterCallback<TCallbackDataParams>;
  }
  /**
   * Option for labels on line, like markLine, lines
   */
  interface LineLabelOption extends Omit<LabelOption, 'distance' | 'position'> {
      position?: 'start' | 'middle' | 'end' | 'insideStart' | 'insideStartTop' | 'insideStartBottom' | 'insideMiddle' | 'insideMiddleTop' | 'insideMiddleBottom' | 'insideEnd' | 'insideEndTop' | 'insideEndBottom' | 'insideMiddleBottom';
      /**
       * Distance can be an array.
       * Which will specify horizontal and vertical distance respectively
       */
      distance?: number | number[];
  }
  interface LabelLineOption {
      show?: boolean;
      /**
       * If displayed above other elements
       */
      showAbove?: boolean;
      length?: number;
      length2?: number;
      smooth?: boolean | number;
      minTurnAngle?: number;
      lineStyle?: LineStyleOption;
  }
  interface SeriesLineLabelOption extends LineLabelOption {
      formatter?: string | LabelFormatterCallback<CallbackDataParams>;
  }
  interface LabelLayoutOptionCallbackParams {
      /**
       * Index of data which the label represents.
       * It can be null if label doesn't represent any data.
       */
      dataIndex?: number;
      /**
       * Type of data which the label represents.
       * It can be null if label doesn't represent any data.
       */
      dataType?: SeriesDataType;
      seriesIndex: number;
      text: string;
      align: ZRTextAlign;
      verticalAlign: ZRTextVerticalAlign;
      rect: RectLike;
      labelRect: RectLike;
      labelLinePoints?: number[][];
  }
  interface LabelLayoutOption {
      /**
       * If move the overlapped label. If label is still overlapped after moved.
       * It will determine if to hide this label with `hideOverlap` policy.
       *
       * shiftX/Y will keep the order on x/y
       * shuffleX/y will move the label around the original position randomly.
       */
      moveOverlap?: 'shiftX' | 'shiftY' | 'shuffleX' | 'shuffleY';
      /**
       * If hide the overlapped label. It will be handled after move.
       * @default 'none'
       */
      hideOverlap?: boolean;
      /**
       * If label is draggable.
       */
      draggable?: boolean;
      /**
       * Can be absolute px number or percent string.
       */
      x?: number | string;
      y?: number | string;
      /**
       * offset on x based on the original position.
       */
      dx?: number;
      /**
       * offset on y based on the original position.
       */
      dy?: number;
      rotate?: number;
      align?: ZRTextAlign;
      verticalAlign?: ZRTextVerticalAlign;
      width?: number;
      height?: number;
      fontSize?: number;
      labelLinePoints?: number[][];
  }
  type LabelLayoutOptionCallback = (params: LabelLayoutOptionCallbackParams) => LabelLayoutOption;
  interface TooltipFormatterCallback<T> {
      /**
       * For sync callback
       * params will be an array on axis trigger.
       */
      (params: T, asyncTicket: string): string | HTMLElement | HTMLElement[];
      /**
       * For async callback.
       * Returned html string will be a placeholder when callback is not invoked.
       */
      (params: T, asyncTicket: string, callback: (cbTicket: string, htmlOrDomNodes: string | HTMLElement | HTMLElement[]) => void): string | HTMLElement | HTMLElement[];
  }
  type TooltipBuiltinPosition = 'inside' | 'top' | 'left' | 'right' | 'bottom';
  type TooltipBoxLayoutOption = Pick<BoxLayoutOptionMixin, 'top' | 'left' | 'right' | 'bottom'>;
  type TooltipPositionCallbackParams = CallbackDataParams | CallbackDataParams[];
  /**
   * Position relative to the hoverred element. Only available when trigger is item.
   */
  interface TooltipPositionCallback {
      (point: [number, number], 
      /**
       * params will be an array on axis trigger.
       */
      params: TooltipPositionCallbackParams, 
      /**
       * Will be HTMLDivElement when renderMode is html
       * Otherwise it's graphic.Text
       */
      el: HTMLDivElement | ZRText | null, 
      /**
       * Rect of hover elements. Will be null if not hovered
       */
      rect: RectLike | null, size: {
          /**
           * Size of popup content
           */
          contentSize: [number, number];
          /**
           * Size of the chart view
           */
          viewSize: [number, number];
      }): Array<number | string> | TooltipBuiltinPosition | TooltipBoxLayoutOption;
  }
  /**
   * Common tooltip option
   * Can be configured on series, graphic elements
   */
  interface CommonTooltipOption<FormatterParams> {
      show?: boolean;
      /**
       * When to trigger
       */
      triggerOn?: 'mousemove' | 'click' | 'none' | 'mousemove|click';
      /**
       * Whether to not hide popup content automatically
       */
      alwaysShowContent?: boolean;
      formatter?: string | TooltipFormatterCallback<FormatterParams>;
      /**
       * Formatter of value.
       *
       * Will be ignored if tooltip.formatter is specified.
       */
      valueFormatter?: (value: OptionDataValue | OptionDataValue[], dataIndex: number) => string;
      /**
       * Absolution pixel [x, y] array. Or relative percent string [x, y] array.
       * If trigger is 'item'. position can be set to 'inside' / 'top' / 'left' / 'right' / 'bottom',
       * which is relative to the hovered element.
       *
       * Support to be a callback
       */
      position?: (number | string)[] | TooltipBuiltinPosition | TooltipPositionCallback | TooltipBoxLayoutOption;
      confine?: boolean;
      /**
       * Consider triggered from axisPointer handle, verticalAlign should be 'middle'
       */
      align?: HorizontalAlign;
      verticalAlign?: VerticalAlign;
      /**
       * Delay of show. milesecond.
       */
      showDelay?: number;
      /**
       * Delay of hide. milesecond.
       */
      hideDelay?: number;
      transitionDuration?: number;
      /**
       * Whether mouse is allowed to enter the floating layer of tooltip
       * If you need to interact in the tooltip like with links or buttons, it can be set as true.
       */
      enterable?: boolean;
      /**
       * Whether enable display transition when show/hide tooltip.
       * Defaults to `true` for backward compatibility.
       * If set to `false`, the tooltip 'display' will be set to 'none' when hidden.
       * @default true
       * @since v6.0.0
       */
      displayTransition?: boolean;
      backgroundColor?: ColorString;
      borderColor?: ColorString;
      borderRadius?: number;
      borderWidth?: number;
      shadowBlur?: number;
      shadowColor?: string;
      shadowOffsetX?: number;
      shadowOffsetY?: number;
      /**
       * Padding between tooltip content and tooltip border.
       */
      padding?: number | number[];
      /**
       * Available when renderMode is 'html'
       */
      extraCssText?: string;
      textStyle?: Pick<LabelOption, 'color' | 'fontStyle' | 'fontWeight' | 'fontFamily' | 'fontSize' | 'lineHeight' | 'width' | 'height' | 'textBorderColor' | 'textBorderWidth' | 'textShadowColor' | 'textShadowBlur' | 'textShadowOffsetX' | 'textShadowOffsetY' | 'align'> & {
          decoration?: string;
      };
  }
  type ComponentItemTooltipOption<T> = CommonTooltipOption<T> & {
      content?: string;
      /**
       * Whether to encode HTML content according to `tooltip.renderMode`.
       *
       * e.g. renderMode 'html' needs to encode but 'richText' does not.
       */
      encodeHTMLContent?: boolean;
      formatterParams?: ComponentItemTooltipLabelFormatterParams;
  };
  type ComponentItemTooltipLabelFormatterParams = {
      componentType: string;
      name: string;
      $vars: string[];
  } & {
      [key in string]: unknown;
  };
  /**
   * Tooltip option configured on each series
   */
  type SeriesTooltipOption = CommonTooltipOption<CallbackDataParams> & {
      trigger?: 'item' | 'axis' | boolean | 'none';
  };
  type LabelFormatterParams = {
      value: ScaleDataValue;
      axisDimension: string;
      axisIndex: number;
      seriesData: CallbackDataParams[];
  };
  /**
   * Common axis option. can be configured on each axis
   */
  interface CommonAxisPointerOption {
      show?: boolean | 'auto';
      z?: number;
      zlevel?: number;
      triggerOn?: 'click' | 'mousemove' | 'none' | 'mousemove|click';
      type?: 'line' | 'shadow' | 'none';
      snap?: boolean;
      triggerTooltip?: boolean;
      triggerEmphasis?: boolean;
      /**
       * current value. When using axisPointer.handle, value can be set to define the initial position of axisPointer.
       */
      value?: ScaleDataValue;
      status?: 'show' | 'hide';
      label?: LabelOption & {
          precision?: 'auto' | number;
          margin?: number;
          /**
           * String template include variable {value} or callback function
           */
          formatter?: string | ((params: LabelFormatterParams) => string);
      };
      animation?: boolean | 'auto';
      animationDurationUpdate?: number;
      animationEasingUpdate?: ZREasing;
      /**
       * Available when type is 'line'
       */
      lineStyle?: LineStyleOption;
      /**
       * Available when type is 'shadow'
       */
      shadowStyle?: AreaStyleOption;
      handle?: {
          show?: boolean;
          icon?: string;
          /**
           * The size of the handle
           */
          size?: number | number[];
          /**
           * Distance from handle center to axis.
           */
          margin?: number;
          color?: ColorString;
          /**
           * Throttle for mobile performance
           */
          throttle?: number;
      } & ShadowOptionMixin;
      seriesDataIndices?: {
          seriesIndex: number;
          dataIndex: number;
          dataIndexInside: number;
      }[];
  }
  interface ComponentOption {
      mainType?: string;
      type?: string;
      id?: OptionId;
      name?: OptionName;
      z?: number;
      zlevel?: number;
      coordinateSystem?: string;
      coordinateSystemUsage?: CoordinateSystemUsageOption;
      coord?: CoordinateSystemDataCoord;
  }
  /**
   * - "data": Use it as "dataCoordSys", each data item is laid out based on a coord sys.
   * - "box": Use it as "boxCoordSys", the overall bounding rect or anchor point is calculated based on a coord sys.
   *   e.g.,
   *      grid rect (cartesian rect) is calculate based on matrix/calendar coord sys;
   *      pie center is calculated based on calendar/cartesian;
   *
   * The default value (if not declared in option `coordinateSystemUsage`):
   *  For series, be "data", since this is the most case and backward compatible.
   *  For non-series components, be "box", since "data" is not applicable.
   */
  type CoordinateSystemUsageOption = 'data' | 'box';
  type BlurScope = 'coordinateSystem' | 'series' | 'global';
  /**
   * can be array of data indices.
   * Or may be an dictionary if have different types of data like in graph.
   */
  type InnerFocus = DefaultEmphasisFocus | ArrayLike<number> | Dictionary<ArrayLike<number>>;
  interface DefaultStatesMixin {
      emphasis?: any;
      select?: any;
      blur?: any;
  }
  type DefaultEmphasisFocus = 'none' | 'self' | 'series';
  interface DefaultStatesMixinEmphasis {
      /**
       * self: Focus self and blur all others.
       * series: Focus series and blur all other series.
       */
      focus?: DefaultEmphasisFocus;
  }
  interface StatesMixinBase {
      emphasis?: unknown;
      select?: unknown;
      blur?: unknown;
  }
  interface StatesOptionMixin<StateOption, StatesMixin extends StatesMixinBase> {
      /**
       * Emphasis states
       */
      emphasis?: StateOption & StatesMixin['emphasis'] & {
          /**
           * Scope of blurred element when focus.
           *
           * coordinateSystem: blur others in the same coordinateSystem
           * series: blur others in the same series
           * global: blur all others
           *
           * Default to be coordinate system.
           */
          blurScope?: BlurScope;
          /**
           * If emphasis state is disabled.
           */
          disabled?: boolean;
      };
      /**
       * Select states
       */
      select?: StateOption & StatesMixin['select'] & {
          disabled?: boolean;
      };
      /**
       * Blur states.
       */
      blur?: StateOption & StatesMixin['blur'];
  }
  interface UniversalTransitionOption {
      enabled?: boolean;
      /**
       * Animation delay of each divided element
       */
      delay?: (index: number, count: number) => number;
      /**
       * How to divide the shape in combine and split animation.
       */
      divideShape?: 'clone' | 'split';
      /**
       * Series will have transition between if they have same seriesKey.
       * Usually it is a string. It can also be an array,
       * which means it can be transition from or to multiple series with each key in this array item.
       *
       * Note:
       * If two series have both array seriesKey. They will be compared after concated to a string(which is order independent)
       * Transition between string key has higher priority.
       *
       * Default to use series id.
       */
      seriesKey?: string | string[];
  }
  interface SeriesOption$1<StateOption = unknown, StatesMixin extends StatesMixinBase = DefaultStatesMixin> extends ComponentOption, AnimationOptionMixin, ColorPaletteOptionMixin, StatesOptionMixin<StateOption, StatesMixin> {
      mainType?: 'series';
      silent?: boolean;
      blendMode?: string;
      /**
       * Cursor when mouse on the elements
       */
      cursor?: string;
      /**
       * groupId of data. can be used for doing drilldown / up animation
       * It will be ignored if:
       *  - groupId is specified in each data
       *  - encode.itemGroupId is given.
       */
      dataGroupId?: OptionId;
      data?: unknown;
      colorBy?: ColorBy;
      legendHoverLink?: boolean;
      /**
       * Configurations about progressive rendering
       */
      progressive?: number | false;
      progressiveThreshold?: number;
      progressiveChunkMode?: 'mod';
      hoverLayerThreshold?: number;
      /**
       * When dataset is used, seriesLayoutBy specifies whether the column or the row of dataset is mapped to the series
       * namely, the series is "layout" on columns or rows
       * @default 'column'
       */
      seriesLayoutBy?: 'column' | 'row';
      labelLine?: LabelLineOption;
      /**
       * Overall label layout option in label layout stage.
       */
      labelLayout?: LabelLayoutOption | LabelLayoutOptionCallback;
      /**
       * Animation config for state transition.
       */
      stateAnimation?: AnimationOption$1;
      /**
       * If enabled universal transition cross series.
       * @example
       *  universalTransition: true
       *  universalTransition: { enabled: true }
       */
      universalTransition?: boolean | UniversalTransitionOption;
      /**
       * Map of selected data
       * key is name or index of data.
       */
      selectedMap?: Dictionary<boolean> | 'all';
      selectedMode?: 'single' | 'multiple' | 'series' | boolean;
  }
  interface SeriesOnCartesianOptionMixin {
      xAxisIndex?: number;
      yAxisIndex?: number;
      xAxisId?: string;
      yAxisId?: string;
  }
  interface SeriesOnPolarOptionMixin {
      polarIndex?: number;
      polarId?: string;
  }
  interface SeriesOnSingleOptionMixin {
      singleAxisIndex?: number;
      singleAxisId?: string;
  }
  interface SeriesOnGeoOptionMixin {
      geoIndex?: number;
      geoId?: string;
  }
  interface SeriesOnCalendarOptionMixin {
      calendarIndex?: number;
      calendarId?: string;
  }
  interface SeriesLargeOptionMixin {
      large?: boolean;
      largeThreshold?: number;
  }
  interface SeriesStackOptionMixin {
      stack?: string;
      stackStrategy?: 'samesign' | 'all' | 'positive' | 'negative';
      stackOrder?: 'seriesAsc' | 'seriesDesc';
  }
  type SamplingFunc = (frame: ArrayLike<number>) => number;
  interface SeriesSamplingOptionMixin {
      sampling?: 'none' | 'average' | 'min' | 'max' | 'minmax' | 'sum' | 'lttb' | SamplingFunc;
  }
  interface SeriesEncodeOptionMixin {
      datasetIndex?: number;
      datasetId?: string | number;
      seriesLayoutBy?: SeriesLayoutBy;
      sourceHeader?: OptionSourceHeader;
      dimensions?: DimensionDefinitionLoose[];
      encode?: OptionEncode;
  }
  interface AriaLabelOption {
      enabled?: boolean;
      description?: string;
      general?: {
          withTitle?: string;
          withoutTitle?: string;
      };
      series?: {
          maxCount?: number;
          single?: {
              prefix?: string;
              withName?: string;
              withoutName?: string;
          };
          multiple?: {
              prefix?: string;
              withName?: string;
              withoutName?: string;
              separator?: {
                  middle?: string;
                  end?: string;
              };
          };
      };
      data?: {
          maxCount?: number;
          allData?: string;
          partialData?: string;
          withName?: string;
          withoutName?: string;
          separator?: {
              middle?: string;
              end?: string;
          };
          excludeDimensionId?: number[];
      };
  }
  interface AriaOption extends AriaLabelOption {
      mainType?: 'aria';
      enabled?: boolean;
      label?: AriaLabelOption;
      decal?: {
          show?: boolean;
          decals?: DecalObject | DecalObject[];
      };
  }
  
  type AreaStyleProps = Pick<PathStyleProps, 'fill' | 'shadowBlur' | 'shadowOffsetX' | 'shadowOffsetY' | 'opacity' | 'shadowColor'>;
  class AreaStyleMixin {
      getAreaStyle(this: Model, excludes?: readonly (keyof AreaStyleOption)[], includes?: readonly (keyof AreaStyleOption)[]): AreaStyleProps;
  }
  
  type LabelFontOption = Pick<LabelOption, 'fontStyle' | 'fontWeight' | 'fontSize' | 'fontFamily'>;
  type LabelRectRelatedOption = Pick<LabelOption, 'align' | 'verticalAlign' | 'padding' | 'lineHeight' | 'baseline' | 'rich' | 'width' | 'height' | 'overflow'> & LabelFontOption;
  class TextStyleMixin {
      /**
       * Get color property or get color from option.textStyle.color
       */
      getTextColor(this: Model, isEmphasis?: boolean): ColorString;
      /**
       * Create font string from fontStyle, fontWeight, fontSize, fontFamily
       * @return {string}
       */
      getFont(this: Model<LabelFontOption>): string;
      getTextRect(this: Model<LabelRectRelatedOption> & TextStyleMixin, text: string): BoundingRect;
  }
  
  interface Model<Opt = ModelOption> extends LineStyleMixin, ItemStyleMixin, TextStyleMixin, AreaStyleMixin {
  }
  class Model<Opt = ModelOption> {
      parentModel: Model;
      ecModel: GlobalModel;
      option: Opt;
      constructor(option?: Opt, parentModel?: Model, ecModel?: GlobalModel);
      init(option: Opt, parentModel?: Model, ecModel?: GlobalModel, ...rest: any): void;
      /**
       * Merge the input option to me.
       */
      mergeOption(option: Opt, ecModel?: GlobalModel): void;
      get<R extends keyof Opt>(path: R, ignoreParent?: boolean): Opt[R];
      get<R extends keyof Opt>(path: readonly [R], ignoreParent?: boolean): Opt[R];
      get<R extends keyof Opt, S extends keyof Opt[R]>(path: readonly [R, S], ignoreParent?: boolean): Opt[R][S];
      get<R extends keyof Opt, S extends keyof Opt[R], T extends keyof Opt[R][S]>(path: readonly [R, S, T], ignoreParent?: boolean): Opt[R][S][T];
      getShallow<R extends keyof Opt>(key: R, ignoreParent?: boolean): Opt[R];
      getModel<R extends keyof Opt>(path: R, parentModel?: Model): Model<Opt[R]>;
      getModel<R extends keyof Opt>(path: readonly [R], parentModel?: Model): Model<Opt[R]>;
      getModel<R extends keyof Opt, S extends keyof Opt[R]>(path: readonly [R, S], parentModel?: Model): Model<Opt[R][S]>;
      getModel<Ra extends keyof Opt, Rb extends keyof Opt, S extends keyof Opt[Rb]>(path: readonly [Ra] | readonly [Rb, S], parentModel?: Model): Model<Opt[Ra]> | Model<Opt[Rb][S]>;
      getModel<R extends keyof Opt, S extends keyof Opt[R], T extends keyof Opt[R][S]>(path: readonly [R, S, T], parentModel?: Model): Model<Opt[R][S][T]>;
      /**
       * If model has option
       */
      isEmpty(): boolean;
      restoreData(): void;
      clone(): Model<Opt>;
      parsePath(path: string | readonly string[]): readonly string[];
      resolveParentPath(path: readonly string[]): string[];
      isAnimationEnabled(): boolean;
      private _doGet;
  }
  
  /**
   * ECharts option manager
   */
  
  /**
   * TERM EXPLANATIONS:
   * See `ECOption` and `ECUnitOption` in `src/util/types.ts`.
   */
  class OptionManager {
      private _api;
      private _timelineOptions;
      private _mediaList;
      private _mediaDefault;
      /**
       * -1, means default.
       * empty means no media.
       */
      private _currentMediaIndices;
      private _optionBackup;
      private _newBaseOption;
      constructor(api: ExtensionAPI);
      setOption(rawOption: ECBasicOption, optionPreprocessorFuncs: OptionPreprocessor[], opt: InnerSetOptionOpts): void;
      mountOption(isRecreate: boolean): ECUnitOption;
      getTimelineOption(ecModel: GlobalModel): ECUnitOption;
      getMediaOption(ecModel: GlobalModel): ECUnitOption[];
  }
  
  /**
   * Caution: If the mechanism should be changed some day, these cases
   * should be considered:
   *
   * (1) In `merge option` mode, if using the same option to call `setOption`
   * many times, the result should be the same (try our best to ensure that).
   * (2) In `merge option` mode, if a component has no id/name specified, it
   * will be merged by index, and the result sequence of the components is
   * consistent to the original sequence.
   * (3) In `replaceMerge` mode, keep the result sequence of the components is
   * consistent to the original sequence, even though there might result in "hole".
   * (4) `reset` feature (in toolbox). Find detailed info in comments about
   * `mergeOption` in module:echarts/model/OptionManager.
   */
  
  interface GlobalModelSetOptionOpts {
      replaceMerge: ComponentMainType | ComponentMainType[];
  }
  interface InnerSetOptionOpts {
      replaceMergeMainTypeMap: HashMap<boolean, string>;
  }
  /**
   * @param condition.mainType Mandatory.
   * @param condition.subType Optional.
   * @param condition.query like {xxxIndex, xxxId, xxxName},
   *        where xxx is mainType.
   *        If query attribute is null/undefined or has no index/id/name,
   *        do not filtering by query conditions, which is convenient for
   *        no-payload situations or when target of action is global.
   * @param condition.filter parameter: component, return boolean.
   */
  interface QueryConditionKindA {
      mainType: ComponentMainType;
      subType?: ComponentSubType;
      query?: {
          [k: string]: number | number[] | string | string[];
      };
      filter?: (cmpt: ComponentModel) => boolean;
  }
  /**
   * If none of index and id and name used, return all components with mainType.
   * @param condition.mainType
   * @param condition.subType If ignore, only query by mainType
   * @param condition.index Either input index or id or name.
   * @param condition.id Either input index or id or name.
   * @param condition.name Either input index or id or name.
   */
  interface QueryConditionKindB {
      mainType: ComponentMainType;
      subType?: ComponentSubType;
      index?: number | number[];
      id?: OptionId | OptionId[];
      name?: OptionName | OptionName[];
  }
  interface EachComponentAllCallback {
      (mainType: string, model: ComponentModel, componentIndex: number): void;
  }
  interface EachComponentInMainTypeCallback {
      (model: ComponentModel, componentIndex: number): void;
  }
  class GlobalModel extends Model<ECUnitOption> {
      option: ECUnitOption;
      private _theme;
      private _locale;
      private _optionManager;
      private _componentsMap;
      /**
       * `_componentsMap` might have "hole" because of remove.
       * So save components count for a certain mainType here.
       */
      private _componentsCount;
      /**
       * Mapping between filtered series list and raw series list.
       * key: filtered series indices, value: raw series indices.
       * Items of `_seriesIndices` never be null/empty/-1.
       * If series has been removed by `replaceMerge`, those series
       * also won't be in `_seriesIndices`, just like be filtered.
       */
      private _seriesIndices;
      /**
       * Key: seriesIndex.
       * Keep consistent with `_seriesIndices`.
       */
      private _seriesIndicesMap;
      /**
       * Model for store update payload
       */
      private _payload;
      scheduler: Scheduler;
      ssr: boolean;
      init(option: ECBasicOption, parentModel: Model, ecModel: GlobalModel, theme: object, locale: object, optionManager: OptionManager): void;
      setOption(option: ECBasicOption, opts: GlobalModelSetOptionOpts, optionPreprocessorFuncs: OptionPreprocessor[]): void;
      /**
       * @param type null/undefined: reset all.
       *        'recreate': force recreate all.
       *        'timeline': only reset timeline option
       *        'media': only reset media query option
       * @return Whether option changed.
       */
      resetOption(type: 'recreate' | 'timeline' | 'media', opt?: Pick<GlobalModelSetOptionOpts, 'replaceMerge'>): boolean;
      private _resetOption;
      mergeOption(option: ECUnitOption): void;
      private _mergeOption;
      /**
       * Get option for output (cloned option and inner info removed)
       */
      getOption(): ECUnitOption;
      setTheme(theme: object): void;
      getTheme(): Model;
      getLocaleModel(): Model<LocaleOption>;
      setUpdatePayload(payload: Payload): void;
      getUpdatePayload(): Payload;
      /**
       * @param idx If not specified, return the first one.
       */
      getComponent(mainType: ComponentMainType, idx?: number): ComponentModel;
      /**
       * @return Never be null/undefined.
       */
      queryComponents(condition: QueryConditionKindB): ComponentModel[];
      /**
       * The interface is different from queryComponents,
       * which is convenient for inner usage.
       *
       * @usage
       * let result = findComponents(
       *     {mainType: 'dataZoom', query: {dataZoomId: 'abc'}}
       * );
       * let result = findComponents(
       *     {mainType: 'series', subType: 'pie', query: {seriesName: 'uio'}}
       * );
       * let result = findComponents(
       *     {mainType: 'series',
       *     filter: function (model, index) {...}}
       * );
       * // result like [component0, componnet1, ...]
       */
      findComponents(condition: QueryConditionKindA): ComponentModel[];
      /**
       * Travel components (before filtered).
       *
       * @usage
       * eachComponent('legend', function (legendModel, index) {
       *     ...
       * });
       * eachComponent(function (componentType, model, index) {
       *     // componentType does not include subType
       *     // (componentType is 'a' but not 'a.b')
       * });
       * eachComponent(
       *     {mainType: 'dataZoom', query: {dataZoomId: 'abc'}},
       *     function (model, index) {...}
       * );
       * eachComponent(
       *     {mainType: 'series', subType: 'pie', query: {seriesName: 'uio'}},
       *     function (model, index) {...}
       * );
       */
      eachComponent<T>(cb: EachComponentAllCallback, context?: T): void;
      eachComponent<T>(mainType: string, cb: EachComponentInMainTypeCallback, context?: T): void;
      eachComponent<T>(mainType: QueryConditionKindA, cb: EachComponentInMainTypeCallback, context?: T): void;
      /**
       * Get series list before filtered by name.
       */
      getSeriesByName(name: OptionName): SeriesModel[];
      /**
       * Get series list before filtered by index.
       */
      getSeriesByIndex(seriesIndex: number): SeriesModel;
      /**
       * Get series list before filtered by type.
       * FIXME: rename to getRawSeriesByType?
       */
      getSeriesByType(subType: ComponentSubType): SeriesModel[];
      /**
       * Get all series before filtered.
       */
      getSeries(): SeriesModel[];
      /**
       * Count series before filtered.
       */
      getSeriesCount(): number;
      /**
       * After filtering, series may be different
       * from raw series.
       */
      eachSeries<T>(cb: (this: T, series: SeriesModel, rawSeriesIndex: number) => void, context?: T): void;
      /**
       * Iterate raw series before filtered.
       *
       * @param {Function} cb
       * @param {*} context
       */
      eachRawSeries<T>(cb: (this: T, series: SeriesModel, rawSeriesIndex: number) => void, context?: T): void;
      /**
       * After filtering, series may be different.
       * from raw series.
       */
      eachSeriesByType<T>(subType: ComponentSubType, cb: (this: T, series: SeriesModel, rawSeriesIndex: number) => void, context?: T): void;
      /**
       * Iterate raw series before filtered of given type.
       */
      eachRawSeriesByType<T>(subType: ComponentSubType, cb: (this: T, series: SeriesModel, rawSeriesIndex: number) => void, context?: T): void;
      isSeriesFiltered(seriesModel: SeriesModel): boolean;
      getCurrentSeriesIndices(): number[];
      filterSeries<T>(cb: (this: T, series: SeriesModel, rawSeriesIndex: number) => boolean, context?: T): void;
      restoreData(payload?: Payload): void;
      private static internalField;
  }
  interface GlobalModel extends PaletteMixin<ECUnitOption> {
  }
  
  interface UpdateLifecycleTransitionSeriesFinder {
      seriesIndex?: ModelFinderIndexQuery;
      seriesId?: ModelFinderIdQuery;
      dimension: DimensionLoose;
  }
  interface UpdateLifecycleTransitionItem {
      from?: UpdateLifecycleTransitionSeriesFinder | UpdateLifecycleTransitionSeriesFinder[];
      to: UpdateLifecycleTransitionSeriesFinder | UpdateLifecycleTransitionSeriesFinder[];
  }
  type UpdateLifecycleTransitionOpt = UpdateLifecycleTransitionItem | UpdateLifecycleTransitionItem[];
  interface UpdateLifecycleParams {
      updatedSeries?: SeriesModel[];
      /**
       * If this update is from setOption and option is changed.
       */
      optionChanged?: boolean;
      seriesTransition?: UpdateLifecycleTransitionOpt;
  }
  interface LifecycleEvents {
      'afterinit': [EChartsType];
      'series:beforeupdate': [GlobalModel, ExtensionAPI, UpdateLifecycleParams];
      'series:layoutlabels': [GlobalModel, ExtensionAPI, UpdateLifecycleParams];
      'series:transition': [GlobalModel, ExtensionAPI, UpdateLifecycleParams];
      'series:afterupdate': [GlobalModel, ExtensionAPI, UpdateLifecycleParams];
      'afterupdate': [GlobalModel, ExtensionAPI];
  }
  
  class GeoJSONResource implements GeoResource {
      readonly type = "geoJSON";
      private _geoJSON;
      private _specialAreas;
      private _mapName;
      private _parsedMap;
      constructor(mapName: string, geoJSON: GeoJSONSourceInput, specialAreas: GeoSpecialAreas);
      /**
       * @param nameMap can be null/undefined
       * @param nameProperty can be null/undefined
       */
      load(nameMap: NameMap, nameProperty: string): {
          regions: GeoJSONRegion[];
          boundingRect: BoundingRect;
          regionsMap: HashMap<GeoJSONRegion, string | number>;
      };
      private _parseToRegions;
      /**
       * Only for exporting to users.
       * **MUST NOT** used internally.
       */
      getMapForUser(): {
          geoJson: GeoJSON | GeoJSONCompressed;
          geoJSON: GeoJSON | GeoJSONCompressed;
          specialAreas: GeoSpecialAreas;
      };
  }
  
  type MapInput = GeoJSONMapInput | SVGMapInput;
  interface GeoJSONMapInput {
      geoJSON: GeoJSONSourceInput;
      specialAreas: GeoSpecialAreas;
  }
  interface SVGMapInput {
      svg: GeoSVGSourceInput;
  }
  const _default$1: {
      /**
       * Compatible with previous `echarts.registerMap`.
       *
       * @usage
       * ```js
       *
       * echarts.registerMap('USA', geoJson, specialAreas);
       *
       * echarts.registerMap('USA', {
       *     geoJson: geoJson,
       *     specialAreas: {...}
       * });
       * echarts.registerMap('USA', {
       *     geoJSON: geoJson,
       *     specialAreas: {...}
       * });
       *
       * echarts.registerMap('airport', {
       *     svg: svg
       * }
       * ```
       *
       * Note:
       * Do not support that register multiple geoJSON or SVG
       * one map name. Because different geoJSON and SVG have
       * different unit. It's not easy to make sure how those
       * units are mapping/normalize.
       * If intending to use multiple geoJSON or SVG, we can
       * use multiple geo coordinate system.
       */
      registerMap: (mapName: string, rawDef: MapInput | GeoJSONSourceInput, rawSpecialAreas?: GeoSpecialAreas) => void;
      getGeoResource(mapName: string): GeoResource;
      /**
       * Only for exporting to users.
       * **MUST NOT** used internally.
       */
      getMapForUser: (mapName: string) => ReturnType<GeoJSONResource['getMapForUser']>;
      load: (mapName: string, nameMap: NameMap, nameProperty: string) => ReturnType<GeoResource['load']>;
  };
  
  type ModelFinder$1 = ModelFinder;
  const version$1 = "6.0.0";
  const dependencies: {
      zrender: string;
  };
  const PRIORITY: {
      PROCESSOR: {
          FILTER: number;
          SERIES_FILTER: number;
          STATISTIC: number;
      };
      VISUAL: {
          LAYOUT: number;
          PROGRESSIVE_LAYOUT: number;
          GLOBAL: number;
          CHART: number;
          POST_CHART_LAYOUT: number;
          COMPONENT: number;
          BRUSH: number;
          CHART_ITEM: number;
          ARIA: number;
          DECAL: number;
      };
  };
  const IN_MAIN_PROCESS_KEY: "__flagInMainProcess";
  const MAIN_PROCESS_VERSION_KEY: "__mainProcessVersion";
  const PENDING_UPDATE: "__pendingUpdate";
  const STATUS_NEEDS_UPDATE_KEY: "__needsUpdateStatus";
  const CONNECT_STATUS_KEY: "__connectUpdateStatus";
  type SetOptionTransitionOpt = UpdateLifecycleTransitionOpt;
  type SetOptionTransitionOptItem = UpdateLifecycleTransitionItem;
  interface SetOptionOpts {
      notMerge?: boolean;
      lazyUpdate?: boolean;
      silent?: boolean;
      replaceMerge?: GlobalModelSetOptionOpts['replaceMerge'];
      transition?: SetOptionTransitionOpt;
  }
  interface ResizeOpts {
      width?: number | 'auto';
      height?: number | 'auto';
      animation?: AnimationOption$1;
      silent?: boolean;
  }
  interface SetThemeOpts {
      silent?: boolean;
  }
  interface PostIniter {
      (chart: EChartsType): void;
  }
  type RenderedEventParam = {
      elapsedTime: number;
  };
  type ECEventDefinition = {
      [key in ZRElementEventName]: EventCallbackSingleParam<ECElementEvent>;
  } & {
      rendered: EventCallbackSingleParam<RenderedEventParam>;
      finished: () => void | boolean;
  } & {
      [key: string]: (...args: unknown[]) => void | boolean;
  };
  type EChartsInitOpts = {
      locale?: string | LocaleOption;
      renderer?: RendererType;
      devicePixelRatio?: number;
      useDirtyRect?: boolean;
      useCoarsePointer?: boolean;
      pointerSize?: number;
      ssr?: boolean;
      width?: number | string;
      height?: number | string;
  };
  class ECharts extends Eventful<ECEventDefinition> {
      /**
       * @readonly
       */
      id: string;
      /**
       * Group id
       * @readonly
       */
      group: string;
      private _ssr;
      private _zr;
      private _dom;
      private _model;
      private _throttledZrFlush;
      private _theme;
      private _locale;
      private _chartsViews;
      private _chartsMap;
      private _componentsViews;
      private _componentsMap;
      private _coordSysMgr;
      private _api;
      private _scheduler;
      private _messageCenter;
      private _pendingActions;
      protected _$eventProcessor: never;
      private _disposed;
      private _loadingFX;
      private [PENDING_UPDATE];
      private [IN_MAIN_PROCESS_KEY];
      private [MAIN_PROCESS_VERSION_KEY];
      private [CONNECT_STATUS_KEY];
      private [STATUS_NEEDS_UPDATE_KEY];
      constructor(dom: HTMLElement, theme?: string | ThemeOption, opts?: EChartsInitOpts);
      private _onframe;
      getDom(): HTMLElement;
      getId(): string;
      getZr(): ZRenderType;
      isSSR(): boolean;
      /**
       * Usage:
       * chart.setOption(option, notMerge, lazyUpdate);
       * chart.setOption(option, {
       *     notMerge: ...,
       *     lazyUpdate: ...,
       *     silent: ...
       * });
       *
       * @param opts opts or notMerge.
       * @param opts.notMerge Default `false`.
       * @param opts.lazyUpdate Default `false`. Useful when setOption frequently.
       * @param opts.silent Default `false`.
       * @param opts.replaceMerge Default undefined.
       */
      setOption<Opt extends ECBasicOption>(option: Opt, notMerge?: boolean, lazyUpdate?: boolean): void;
      setOption<Opt extends ECBasicOption>(option: Opt, opts?: SetOptionOpts): void;
      /**
       * Update theme with name or theme option and repaint the chart.
       * @param theme Theme name or theme option.
       * @param opts Optional settings
       */
      setTheme(theme: string | ThemeOption, opts?: SetThemeOpts): void;
      private _updateTheme;
      private getModel;
      getOption(): ECBasicOption;
      getWidth(): number;
      getHeight(): number;
      getDevicePixelRatio(): number;
      /**
       * Get canvas which has all thing rendered
       * @deprecated Use renderToCanvas instead.
       */
      getRenderedCanvas(opts?: any): HTMLCanvasElement;
      renderToCanvas(opts?: {
          backgroundColor?: ZRColor;
          pixelRatio?: number;
      }): HTMLCanvasElement;
      renderToSVGString(opts?: {
          useViewBox?: boolean;
      }): string;
      /**
       * Get svg data url
       */
      getSvgDataURL(): string;
      getDataURL(opts?: {
          type?: 'png' | 'jpeg' | 'svg';
          pixelRatio?: number;
          backgroundColor?: ZRColor;
          excludeComponents?: ComponentMainType[];
      }): string;
      getConnectedDataURL(opts?: {
          type?: 'png' | 'jpeg' | 'svg';
          pixelRatio?: number;
          backgroundColor?: ZRColor;
          connectedBackgroundColor?: ZRColor;
          excludeComponents?: string[];
      }): string;
      /**
       * Convert from logical coordinate system to pixel coordinate system.
       * See CoordinateSystem#convertToPixel.
       *
       * TODO / PENDING:
       *  currently `convertToPixel` `convertFromPixel` `convertToLayout` may not be suitable
       *  for some extremely performance-sensitive scenarios (such as, handling massive amounts of data),
       *  since it performce "find component" every time.
       *  And it is not friendly to the nuances between different coordinate systems.
       *  @see https://github.com/apache/echarts/issues/20985 for details
       *
       * @see CoordinateSystem['dataToPoint'] for parameters and return.
       * @see CoordinateSystemDataCoord
       */
      convertToPixel(finder: ModelFinder$1, value: ScaleDataValue): number;
      convertToPixel(finder: ModelFinder$1, value: ScaleDataValue[]): number[];
      convertToPixel(finder: ModelFinder$1, value: ScaleDataValue | ScaleDataValue[]): number | number[];
      convertToPixel(finder: ModelFinder$1, value: (ScaleDataValue | ScaleDataValue[] | NullUndefined$1)[]): number | number[];
      /**
       * Convert from logical coordinate system to pixel coordinate system.
       * See CoordinateSystem#convertToPixel.
       *
       * @see CoordinateSystem['dataToLayout'] for parameters and return.
       * @see CoordinateSystemDataCoord
       */
      convertToLayout(finder: ModelFinder$1, value: (ScaleDataValue | NullUndefined$1) | (ScaleDataValue | ScaleDataValue[] | NullUndefined$1)[], opt?: unknown): CoordinateSystemDataLayout;
      /**
       * Convert from pixel coordinate system to logical coordinate system.
       * See CoordinateSystem#convertFromPixel.
       *
       * @see CoordinateSystem['pointToData'] for parameters and return.
       */
      convertFromPixel(finder: ModelFinder$1, value: number): number;
      convertFromPixel(finder: ModelFinder$1, value: number[]): number[];
      convertFromPixel(finder: ModelFinder$1, value: number | number[]): number | number[];
      /**
       * Is the specified coordinate systems or components contain the given pixel point.
       * @param {Array|number} value
       * @return {boolean} result
       */
      containPixel(finder: ModelFinder$1, value: number[]): boolean;
      /**
       * Get visual from series or data.
       * @param finder
       *        If string, e.g., 'series', means {seriesIndex: 0}.
       *        If Object, could contain some of these properties below:
       *        {
       *            seriesIndex / seriesId / seriesName,
       *            dataIndex / dataIndexInside
       *        }
       *        If dataIndex is not specified, series visual will be fetched,
       *        but not data item visual.
       *        If all of seriesIndex, seriesId, seriesName are not specified,
       *        visual will be fetched from first series.
       * @param visualType 'color', 'symbol', 'symbolSize'
       */
      getVisual(finder: ModelFinder$1, visualType: string): string | number | number[] | PatternObject | LinearGradientObject | RadialGradientObject;
      /**
       * Get view of corresponding component model
       */
      private getViewOfComponentModel;
      /**
       * Get view of corresponding series model
       */
      private getViewOfSeriesModel;
      private _initEvents;
      isDisposed(): boolean;
      clear(): void;
      dispose(): void;
      /**
       * Resize the chart
       */
      resize(opts?: ResizeOpts): void;
      /**
       * Show loading effect
       * @param name 'default' by default
       * @param cfg cfg of registered loading effect
       */
      showLoading(cfg?: object): void;
      showLoading(name?: string, cfg?: object): void;
      /**
       * Hide loading effect
       */
      hideLoading(): void;
      makeActionFromEvent(eventObj: ECActionEvent): Payload;
      /**
       * @param opt If pass boolean, means opt.silent
       * @param opt.silent Default `false`. Whether trigger events.
       * @param opt.flush Default `undefined`.
       *        true: Flush immediately, and then pixel in canvas can be fetched
       *            immediately. Caution: it might affect performance.
       *        false: Not flush.
       *        undefined: Auto decide whether perform flush.
       */
      dispatchAction(payload: Payload, opt?: boolean | {
          silent?: boolean;
          flush?: boolean | undefined;
      }): void;
      updateLabelLayout(): void;
      appendData(params: {
          seriesIndex: number;
          data: any;
      }): void;
      private static internalField;
  }
  /**
   * @param opts.devicePixelRatio Use window.devicePixelRatio by default
   * @param opts.renderer Can choose 'canvas' or 'svg' to render the chart.
   * @param opts.width Use clientWidth of the input `dom` by default.
   *        Can be 'auto' (the same as null/undefined)
   * @param opts.height Use clientHeight of the input `dom` by default.
   *        Can be 'auto' (the same as null/undefined)
   * @param opts.locale Specify the locale.
   * @param opts.useDirtyRect Enable dirty rectangle rendering or not.
   */
  function init$1(dom?: HTMLElement | null, theme?: string | object | null, opts?: EChartsInitOpts): EChartsType;
  /**
   * @usage
   * (A)
   * ```js
   * let chart1 = echarts.init(dom1);
   * let chart2 = echarts.init(dom2);
   * chart1.group = 'xxx';
   * chart2.group = 'xxx';
   * echarts.connect('xxx');
   * ```
   * (B)
   * ```js
   * let chart1 = echarts.init(dom1);
   * let chart2 = echarts.init(dom2);
   * echarts.connect('xxx', [chart1, chart2]);
   * ```
   */
  function connect(groupId: string | EChartsType[]): string;
  function disconnect(groupId: string): void;
  /**
   * Alias and backward compatibility
   * @deprecated
   */
  const disConnect: typeof disconnect;
  /**
   * Dispose a chart instance
   */
  function dispose$1(chart: EChartsType | HTMLElement | string): void;
  function getInstanceByDom(dom: HTMLElement): EChartsType | undefined;
  function getInstanceById(key: string): EChartsType | undefined;
  /**
   * Register theme
   */
  function registerTheme(name: string, theme: ThemeOption): void;
  /**
   * Register option preprocessor
   */
  function registerPreprocessor(preprocessorFunc: OptionPreprocessor): void;
  function registerProcessor(priority: number | StageHandler | StageHandlerOverallReset, processor?: StageHandler | StageHandlerOverallReset): void;
  /**
   * Register postIniter
   * @param {Function} postInitFunc
   */
  function registerPostInit(postInitFunc: PostIniter): void;
  /**
   * Register postUpdater
   * @param {Function} postUpdateFunc
   */
  function registerPostUpdate(postUpdateFunc: PostUpdater): void;
  function registerUpdateLifecycle<T extends keyof LifecycleEvents>(name: T, cb: (...args: LifecycleEvents[T]) => void): void;
  /**
   * @usage
   * registerAction('someAction', 'someEvent', function () { ... });
   * registerAction('someAction', function () { ... });
   * registerAction(
   *     {type: 'someAction', event: 'someEvent', update: 'updateView'},
   *     function () { ... }
   * );
   * registerAction({
   *     type: 'someAction',
   *     event: 'someEvent',
   *     update: 'updateView'
   *     action: function () { ... }
   *     refineEvent: function () { ... }
   * });
   * @see {ActionInfo} for more details.
   */
  function registerAction(type: string, eventType: string, action: ActionHandler): void;
  function registerAction(type: string, action: ActionHandler): void;
  function registerAction(actionInfo: ActionInfo, action?: ActionHandler): void;
  function registerCoordinateSystem(type: string, coordSysCreator: CoordinateSystemCreator): void;
  /**
   * Get dimensions of specified coordinate system.
   * @param {string} type
   * @return {Array.<string|Object>}
   */
  function getCoordinateSystemDimensions(type: string): DimensionDefinitionLoose[];
  function registerCustomSeries(seriesType: string, renderItem: CustomSeriesRenderItem): void;
  
  /**
   * Layout is a special stage of visual encoding
   * Most visual encoding like color are common for different chart
   * But each chart has it's own layout algorithm
   */
  function registerLayout(priority: number, layoutTask: StageHandler | StageHandlerOverallReset): void;
  function registerLayout(layoutTask: StageHandler | StageHandlerOverallReset): void;
  function registerVisual(priority: number, layoutTask: StageHandler | StageHandlerOverallReset): void;
  function registerVisual(layoutTask: StageHandler | StageHandlerOverallReset): void;
  
  function registerLoading(name: string, loadingFx: LoadingEffectCreator): void;
  /**
   * ZRender need a canvas context to do measureText.
   * But in node environment canvas may be created by node-canvas.
   * So we need to specify how to create a canvas instead of using document.createElement('canvas')
   *
   *
   * @deprecated use setPlatformAPI({ createCanvas }) instead.
   *
   * @example
   *     let Canvas = require('canvas');
   *     let echarts = require('echarts');
   *     echarts.setCanvasCreator(function () {
   *         // Small size is enough.
   *         return new Canvas(32, 32);
   *     });
   */
  function setCanvasCreator(creator: () => HTMLCanvasElement): void;
  type RegisterMapParams = Parameters<typeof _default$1.registerMap>;
  /**
   * The parameters and usage: see `geoSourceManager.registerMap`.
   * Compatible with previous `echarts.registerMap`.
   */
  function registerMap(mapName: RegisterMapParams[0], geoJson: RegisterMapParams[1], specialAreas?: RegisterMapParams[2]): void;
  function getMap(mapName: string): any;
  const registerTransform: typeof registerExternalTransform;
  const dataTool: {};
  interface EChartsType extends ECharts {
  }
  
  function parseCssInt(val: string | number): number;
  function parseCssFloat(val: string | number): number;
  function parse(colorStr: string, rgbaArr?: number[]): number[];
  function lift(color: string, level: number): string;
  function toHex(color: string): string;
  function fastLerp(normalizedValue: number, colors: number[][], out?: number[]): number[];
  const fastMapToColor: typeof fastLerp;
  type LerpFullOutput = {
      color: string;
      leftIndex: number;
      rightIndex: number;
      value: number;
  };
  function lerp$1(normalizedValue: number, colors: string[], fullOutput: boolean): LerpFullOutput;
  function lerp$1(normalizedValue: number, colors: string[]): string;
  const mapToColor: typeof lerp$1;
  function modifyHSL(color: string, h?: number | ((h: number) => number), s?: number | string | ((s: number) => number), l?: number | string | ((l: number) => number)): string;
  function modifyAlpha(color: string, alpha?: number): string;
  function stringify(arrColor: number[], type: string): string;
  function lum(color: string, backgroundLum: number): number;
  function random(): string;
  function liftColor(color: GradientObject): GradientObject;
  function liftColor(color: string): string;
  
  const color_d_parseCssInt: typeof parseCssInt;
  const color_d_parseCssFloat: typeof parseCssFloat;
  const color_d_parse: typeof parse;
  const color_d_lift: typeof lift;
  const color_d_toHex: typeof toHex;
  const color_d_fastLerp: typeof fastLerp;
  const color_d_fastMapToColor: typeof fastMapToColor;
  const color_d_mapToColor: typeof mapToColor;
  const color_d_modifyHSL: typeof modifyHSL;
  const color_d_modifyAlpha: typeof modifyAlpha;
  const color_d_stringify: typeof stringify;
  const color_d_lum: typeof lum;
  const color_d_random: typeof random;
  const color_d_liftColor: typeof liftColor;
  namespace color_d {
    export {
      color_d_parseCssInt as parseCssInt,
      color_d_parseCssFloat as parseCssFloat,
      color_d_parse as parse,
      color_d_lift as lift,
      color_d_toHex as toHex,
      color_d_fastLerp as fastLerp,
      color_d_fastMapToColor as fastMapToColor,
      lerp$1 as lerp,
      color_d_mapToColor as mapToColor,
      color_d_modifyHSL as modifyHSL,
      color_d_modifyAlpha as modifyAlpha,
      color_d_stringify as stringify,
      color_d_lum as lum,
      color_d_random as random,
      color_d_liftColor as liftColor,
    };
  }
  
  type ThrottleFunction = (this: unknown, ...args: unknown[]) => void;
  interface ThrottleController {
      clear(): void;
      debounceNextCall(debounceDelay: number): void;
  }
  /**
   * @public
   * @param {(Function)} fn
   * @param {number} [delay=0] Unit: ms.
   * @param {boolean} [debounce=false]
   *        true: If call interval less than `delay`, only the last call works.
   *        false: If call interval less than `delay, call works on fixed rate.
   * @return {(Function)} throttled fn.
   */
  function throttle<T extends ThrottleFunction>(fn: T, delay?: number, debounce?: boolean): T & ThrottleController;
  
  type EnableDataStackDimensionsInput = {
      schema: SeriesDataSchema;
      store?: DataStore;
  };
  type EnableDataStackDimensionsInputLegacy = (SeriesDimensionDefine | string)[];
  /**
   * Note that it is too complicated to support 3d stack by value
   * (have to create two-dimension inverted index), so in 3d case
   * we just support that stacked by index.
   *
   * @param seriesModel
   * @param dimensionsInput The same as the input of <module:echarts/data/SeriesData>.
   *        The input will be modified.
   * @param opt
   * @param opt.stackedCoordDimension Specify a coord dimension if needed.
   * @param opt.byIndex=false
   * @return calculationInfo
   * {
   *     stackedDimension: string
   *     stackedByDimension: string
   *     isStackedByIndex: boolean
   *     stackedOverDimension: string
   *     stackResultDimension: string
   * }
   */
  function enableDataStack(seriesModel: SeriesModel<SeriesOption$1 & SeriesStackOptionMixin>, dimensionsInput: EnableDataStackDimensionsInput | EnableDataStackDimensionsInputLegacy, opt?: {
      stackedCoordDimension?: string;
      byIndex?: boolean;
  }): Pick<DataCalculationInfo<unknown>, 'stackedDimension' | 'stackedByDimension' | 'isStackedByIndex' | 'stackedOverDimension' | 'stackResultDimension'>;
  function isDimensionStacked(data: SeriesData, stackedDim: string): boolean;
  function getStackedDimension(data: SeriesData, targetDim: string): DimensionName;
  
  type SSRItemType = 'chart' | 'legend';
  /**
   * ECData stored on graphic element
   */
  interface ECData {
      dataIndex?: number;
      dataModel?: DataModel;
      eventData?: ECEventData;
      seriesIndex?: number;
      dataType?: SeriesDataType;
      focus?: InnerFocus;
      blurScope?: BlurScope;
      ssrType?: SSRItemType;
      componentMainType?: ComponentMainType;
      componentIndex?: number;
      componentHighDownName?: string;
      tooltipConfig?: {
          name: string;
          option: ComponentItemTooltipOption<unknown>;
      };
  }
  const getECData: (hostObj: Element<ElementProps>) => ECData;
  
  /**
   * Enable the function that mouseover will trigger the emphasis state.
   *
   * NOTE:
   * This function should be used on the element with dataIndex, seriesIndex.
   *
   */
  function enableHoverEmphasis(el: Element, focus?: InnerFocus, blurScope?: BlurScope): void;
  
  /**
   * Create a multi dimension List structure from seriesModel.
   */
  function createList(seriesModel: SeriesModel): SeriesData<Model<any>, DefaultDataVisual>;
  
  const dataStack: {
      isDimensionStacked: typeof isDimensionStacked;
      enableDataStack: typeof enableDataStack;
      getStackedDimension: typeof getStackedDimension;
  };
  
  /**
   * Create scale
   * @param {Array.<number>} dataExtent
   * @param {Object|module:echarts/Model} option If `optoin.type`
   *        is secified, it can only be `'value'` currently.
   */
  function createScale(dataExtent: number[], option: object | AxisBaseModel): Scale<ScaleSettingDefault>;
  /**
   * Mixin common methods to axis model,
   *
   * Include methods
   * `getFormattedLabels() => Array.<string>`
   * `getCategories() => Array.<string>`
   * `getMin(origin: boolean) => number`
   * `getMax(origin: boolean) => number`
   * `getNeedCrossZero() => boolean`
   */
  function mixinAxisModelCommonMethods(Model: Model): void;
  
  function createTextStyle(textStyleModel: Model<TextCommonOption>, opts?: {
      state?: DisplayState;
  }): TextStyleProps;
  
  const helper_d_getLayoutRect: typeof getLayoutRect;
  const helper_d_getECData: typeof getECData;
  const helper_d_createList: typeof createList;
  const helper_d_dataStack: typeof dataStack;
  const helper_d_createScale: typeof createScale;
  const helper_d_mixinAxisModelCommonMethods: typeof mixinAxisModelCommonMethods;
  const helper_d_createTextStyle: typeof createTextStyle;
  const helper_d_createDimensions: typeof createDimensions;
  const helper_d_createSymbol: typeof createSymbol;
  const helper_d_enableHoverEmphasis: typeof enableHoverEmphasis;
  namespace helper_d {
    export {
      helper_d_getLayoutRect as getLayoutRect,
      helper_d_getECData as getECData,
      helper_d_createList as createList,
      helper_d_dataStack as dataStack,
      helper_d_createScale as createScale,
      helper_d_mixinAxisModelCommonMethods as mixinAxisModelCommonMethods,
      helper_d_createTextStyle as createTextStyle,
      helper_d_createDimensions as createDimensions,
      helper_d_createSymbol as createSymbol,
      helper_d_enableHoverEmphasis as enableHoverEmphasis,
    };
  }
  
  interface Platform {
      createCanvas(): HTMLCanvasElement;
      measureText(text: string, font?: string): {
          width: number;
      };
      loadImage(src: string, onload: () => void | HTMLImageElement['onload'], onerror: () => void | HTMLImageElement['onerror']): HTMLImageElement;
  }
  function setPlatformAPI(newPlatformApis: Partial<Platform>): void;
  
  function parseGeoJSON(geoJson: GeoJSON | GeoJSONCompressed, nameProperty: string): GeoJSONRegion[];
  
  /**
   * Linear mapping a value from domain to range
   * @param  val
   * @param  domain Domain extent domain[0] can be bigger than domain[1]
   * @param  range  Range extent range[0] can be bigger than range[1]
   * @param  clamp Default to be false
   */
  function linearMap(val: number, domain: number[], range: number[], clamp?: boolean): number;
  /**
   * Preserve the name `parsePercent` for backward compatibility,
   * and it's effectively published as `echarts.number.parsePercent`.
   */
  const parsePercent: typeof parsePositionOption;
  /**
   * @see {parsePositionSizeOption} and also accept a string preset.
   * @see {PositionSizeOption}
   */
  function parsePositionOption(option: unknown, percentBase: number, percentOffset?: number): number;
  /**
   * (1) Fix rounding error of float numbers.
   * (2) Support return string to avoid scientific notation like '3.5e-7'.
   */
  function round(x: number | string, precision?: number): number;
  function round(x: number | string, precision: number, returnStr: false): number;
  function round(x: number | string, precision: number, returnStr: true): string;
  /**
   * Inplacd asc sort arr.
   * The input arr will be modified.
   */
  function asc<T extends number[]>(arr: T): T;
  /**
   * Get precision.
   */
  function getPrecision(val: string | number): number;
  /**
   * Get precision with slow but safe method
   */
  function getPrecisionSafe(val: string | number): number;
  /**
   * Minimal dicernible data precisioin according to a single pixel.
   */
  function getPixelPrecision(dataExtent: [number, number], pixelExtent: [number, number]): number;
  /**
   * Get a data of given precision, assuring the sum of percentages
   * in valueList is 1.
   * The largest remainder method is used.
   * https://en.wikipedia.org/wiki/Largest_remainder_method
   *
   * @param valueList a list of all data
   * @param idx index of the data to be processed in valueList
   * @param precision integer number showing digits of precision
   * @return percent ranging from 0 to 100
   */
  function getPercentWithPrecision(valueList: number[], idx: number, precision: number): number;
  const MAX_SAFE_INTEGER = 9007199254740991;
  /**
   * To 0 - 2 * PI, considering negative radian.
   */
  function remRadian(radian: number): number;
  /**
   * @param {type} radian
   * @return {boolean}
   */
  function isRadianAroundZero(val: number): boolean;
  /**
   * @param value valid type: number | string | Date, otherwise return `new Date(NaN)`
   *   These values can be accepted:
   *   + An instance of Date, represent a time in its own time zone.
   *   + Or string in a subset of ISO 8601, only including:
   *     + only year, month, date: '2012-03', '2012-03-01', '2012-03-01 05', '2012-03-01 05:06',
   *     + separated with T or space: '2012-03-01T12:22:33.123', '2012-03-01 12:22:33.123',
   *     + time zone: '2012-03-01T12:22:33Z', '2012-03-01T12:22:33+8000', '2012-03-01T12:22:33-05:00',
   *     all of which will be treated as local time if time zone is not specified
   *     (see <https://momentjs.com/>).
   *   + Or other string format, including (all of which will be treated as local time):
   *     '2012', '2012-3-1', '2012/3/1', '2012/03/01',
   *     '2009/6/12 2:00', '2009/6/12 2:05:08', '2009/6/12 2:05:08.123'
   *   + a timestamp, which represent a time in UTC.
   * @return date Never be null/undefined. If invalid, return `new Date(NaN)`.
   */
  function parseDate(value: unknown): Date;
  /**
   * Quantity of a number. e.g. 0.1, 1, 10, 100
   *
   * @param val
   * @return
   */
  function quantity(val: number): number;
  /**
   * Exponent of the quantity of a number
   * e.g., 1234 equals to 1.234*10^3, so quantityExponent(1234) is 3
   *
   * @param val non-negative value
   * @return
   */
  function quantityExponent(val: number): number;
  /**
   * find a “nice” number approximately equal to x. Round the number if round = true,
   * take ceiling if round = false. The primary observation is that the “nicest”
   * numbers in decimal are 1, 2, and 5, and all power-of-ten multiples of these numbers.
   *
   * See "Nice Numbers for Graph Labels" of Graphic Gems.
   *
   * @param  val Non-negative value.
   * @param  round
   * @return Niced number
   */
  function nice(val: number, round?: boolean): number;
  /**
   * This code was copied from "d3.js"
   * <https://github.com/d3/d3/blob/9cc9a875e636a1dcf36cc1e07bdf77e1ad6e2c74/src/arrays/quantile.js>.
   * See the license statement at the head of this file.
   * @param ascArr
   */
  function quantile(ascArr: number[], p: number): number;
  type IntervalItem = {
      interval: [number, number];
      close: [0 | 1, 0 | 1];
  };
  /**
   * Order intervals asc, and split them when overlap.
   * expect(numberUtil.reformIntervals([
   *     {interval: [18, 62], close: [1, 1]},
   *     {interval: [-Infinity, -70], close: [0, 0]},
   *     {interval: [-70, -26], close: [1, 1]},
   *     {interval: [-26, 18], close: [1, 1]},
   *     {interval: [62, 150], close: [1, 1]},
   *     {interval: [106, 150], close: [1, 1]},
   *     {interval: [150, Infinity], close: [0, 0]}
   * ])).toEqual([
   *     {interval: [-Infinity, -70], close: [0, 0]},
   *     {interval: [-70, -26], close: [1, 1]},
   *     {interval: [-26, 18], close: [0, 1]},
   *     {interval: [18, 62], close: [0, 1]},
   *     {interval: [62, 150], close: [0, 1]},
   *     {interval: [150, Infinity], close: [0, 0]}
   * ]);
   * @param list, where `close` mean open or close
   *        of the interval, and Infinity can be used.
   * @return The origin list, which has been reformed.
   */
  function reformIntervals(list: IntervalItem[]): IntervalItem[];
  /**
   * [Numeric is defined as]:
   *     `parseFloat(val) == val`
   * For example:
   * numeric:
   *     typeof number except NaN, '-123', '123', '2e3', '-2e3', '011', 'Infinity', Infinity,
   *     and they rounded by white-spaces or line-terminal like ' -123 \n ' (see es spec)
   * not-numeric:
   *     null, undefined, [], {}, true, false, 'NaN', NaN, '123ab',
   *     empty string, string with only white-spaces or line-terminal (see es spec),
   *     0x12, '0x12', '-0x12', 012, '012', '-012',
   *     non-string, ...
   *
   * @test See full test cases in `test/ut/spec/util/number.js`.
   * @return Must be a typeof number. If not numeric, return NaN.
   */
  function numericToNumber(val: unknown): number;
  /**
   * Definition of "numeric": see `numericToNumber`.
   */
  function isNumeric(val: unknown): val is number;
  
  const number_d_linearMap: typeof linearMap;
  const number_d_round: typeof round;
  const number_d_asc: typeof asc;
  const number_d_getPrecision: typeof getPrecision;
  const number_d_getPrecisionSafe: typeof getPrecisionSafe;
  const number_d_getPixelPrecision: typeof getPixelPrecision;
  const number_d_getPercentWithPrecision: typeof getPercentWithPrecision;
  const number_d_parsePercent: typeof parsePercent;
  const number_d_MAX_SAFE_INTEGER: typeof MAX_SAFE_INTEGER;
  const number_d_remRadian: typeof remRadian;
  const number_d_isRadianAroundZero: typeof isRadianAroundZero;
  const number_d_parseDate: typeof parseDate;
  const number_d_quantity: typeof quantity;
  const number_d_quantityExponent: typeof quantityExponent;
  const number_d_nice: typeof nice;
  const number_d_quantile: typeof quantile;
  const number_d_reformIntervals: typeof reformIntervals;
  const number_d_isNumeric: typeof isNumeric;
  const number_d_numericToNumber: typeof numericToNumber;
  namespace number_d {
    export {
      number_d_linearMap as linearMap,
      number_d_round as round,
      number_d_asc as asc,
      number_d_getPrecision as getPrecision,
      number_d_getPrecisionSafe as getPrecisionSafe,
      number_d_getPixelPrecision as getPixelPrecision,
      number_d_getPercentWithPrecision as getPercentWithPrecision,
      number_d_parsePercent as parsePercent,
      number_d_MAX_SAFE_INTEGER as MAX_SAFE_INTEGER,
      number_d_remRadian as remRadian,
      number_d_isRadianAroundZero as isRadianAroundZero,
      number_d_parseDate as parseDate,
      number_d_quantity as quantity,
      number_d_quantityExponent as quantityExponent,
      number_d_nice as nice,
      number_d_quantile as quantile,
      number_d_reformIntervals as reformIntervals,
      number_d_isNumeric as isNumeric,
      number_d_numericToNumber as numericToNumber,
    };
  }
  
  const time_d_format: typeof format;
  const time_d_roundTime: typeof roundTime;
  namespace time_d {
    export {
      parseDate as parse,
      time_d_format as format,
      time_d_roundTime as roundTime,
    };
  }
  
  const graphic_d_extendShape: typeof extendShape;
  const graphic_d_extendPath: typeof extendPath;
  const graphic_d_makePath: typeof makePath;
  const graphic_d_makeImage: typeof makeImage;
  const graphic_d_resizePath: typeof resizePath;
  const graphic_d_createIcon: typeof createIcon;
  const graphic_d_updateProps: typeof updateProps;
  const graphic_d_initProps: typeof initProps;
  const graphic_d_getTransform: typeof getTransform;
  const graphic_d_clipPointsByRect: typeof clipPointsByRect;
  const graphic_d_clipRectByRect: typeof clipRectByRect;
  const graphic_d_registerShape: typeof registerShape;
  const graphic_d_getShapeClass: typeof getShapeClass;
  type graphic_d_Group = Group;
  const graphic_d_Group: typeof Group;
  type graphic_d_Circle = Circle;
  const graphic_d_Circle: typeof Circle;
  type graphic_d_Ellipse = Ellipse;
  const graphic_d_Ellipse: typeof Ellipse;
  type graphic_d_Sector = Sector;
  const graphic_d_Sector: typeof Sector;
  type graphic_d_Ring = Ring;
  const graphic_d_Ring: typeof Ring;
  type graphic_d_Polygon = Polygon;
  const graphic_d_Polygon: typeof Polygon;
  type graphic_d_Polyline = Polyline;
  const graphic_d_Polyline: typeof Polyline;
  type graphic_d_Rect = Rect;
  const graphic_d_Rect: typeof Rect;
  type graphic_d_Line = Line;
  const graphic_d_Line: typeof Line;
  type graphic_d_BezierCurve = BezierCurve;
  const graphic_d_BezierCurve: typeof BezierCurve;
  type graphic_d_Arc = Arc;
  const graphic_d_Arc: typeof Arc;
  type graphic_d_IncrementalDisplayable = IncrementalDisplayable;
  const graphic_d_IncrementalDisplayable: typeof IncrementalDisplayable;
  type graphic_d_CompoundPath = CompoundPath;
  const graphic_d_CompoundPath: typeof CompoundPath;
  type graphic_d_LinearGradient = LinearGradient;
  const graphic_d_LinearGradient: typeof LinearGradient;
  type graphic_d_RadialGradient = RadialGradient;
  const graphic_d_RadialGradient: typeof RadialGradient;
  type graphic_d_BoundingRect = BoundingRect;
  const graphic_d_BoundingRect: typeof BoundingRect;
  namespace graphic_d {
    export {
      graphic_d_extendShape as extendShape,
      graphic_d_extendPath as extendPath,
      graphic_d_makePath as makePath,
      graphic_d_makeImage as makeImage,
      mergePath$1 as mergePath,
      graphic_d_resizePath as resizePath,
      graphic_d_createIcon as createIcon,
      graphic_d_updateProps as updateProps,
      graphic_d_initProps as initProps,
      graphic_d_getTransform as getTransform,
      graphic_d_clipPointsByRect as clipPointsByRect,
      graphic_d_clipRectByRect as clipRectByRect,
      graphic_d_registerShape as registerShape,
      graphic_d_getShapeClass as getShapeClass,
      graphic_d_Group as Group,
      ZRImage as Image,
      ZRText as Text,
      graphic_d_Circle as Circle,
      graphic_d_Ellipse as Ellipse,
      graphic_d_Sector as Sector,
      graphic_d_Ring as Ring,
      graphic_d_Polygon as Polygon,
      graphic_d_Polyline as Polyline,
      graphic_d_Rect as Rect,
      graphic_d_Line as Line,
      graphic_d_BezierCurve as BezierCurve,
      graphic_d_Arc as Arc,
      graphic_d_IncrementalDisplayable as IncrementalDisplayable,
      graphic_d_CompoundPath as CompoundPath,
      graphic_d_LinearGradient as LinearGradient,
      graphic_d_RadialGradient as RadialGradient,
      graphic_d_BoundingRect as BoundingRect,
    };
  }
  
  const format_d_addCommas: typeof addCommas;
  const format_d_toCamelCase: typeof toCamelCase;
  const format_d_encodeHTML: typeof encodeHTML;
  const format_d_formatTpl: typeof formatTpl;
  const format_d_getTooltipMarker: typeof getTooltipMarker;
  const format_d_formatTime: typeof formatTime;
  const format_d_capitalFirst: typeof capitalFirst;
  const format_d_truncateText: typeof truncateText;
  const format_d_getTextRect: typeof getTextRect;
  namespace format_d {
    export {
      format_d_addCommas as addCommas,
      format_d_toCamelCase as toCamelCase,
      normalizeCssArray$1 as normalizeCssArray,
      format_d_encodeHTML as encodeHTML,
      format_d_formatTpl as formatTpl,
      format_d_getTooltipMarker as getTooltipMarker,
      format_d_formatTime as formatTime,
      format_d_capitalFirst as capitalFirst,
      format_d_truncateText as truncateText,
      format_d_getTextRect as getTextRect,
    };
  }
  
  const util_d$1_map: typeof map;
  const util_d$1_each: typeof each;
  const util_d$1_indexOf: typeof indexOf;
  const util_d$1_inherits: typeof inherits;
  const util_d$1_reduce: typeof reduce;
  const util_d$1_filter: typeof filter;
  const util_d$1_bind: typeof bind;
  const util_d$1_curry: typeof curry;
  const util_d$1_isArray: typeof isArray;
  const util_d$1_isString: typeof isString;
  const util_d$1_isObject: typeof isObject;
  const util_d$1_isFunction: typeof isFunction;
  const util_d$1_extend: typeof extend;
  const util_d$1_defaults: typeof defaults;
  const util_d$1_clone: typeof clone;
  const util_d$1_merge: typeof merge;
  namespace util_d$1 {
    export {
      util_d$1_map as map,
      util_d$1_each as each,
      util_d$1_indexOf as indexOf,
      util_d$1_inherits as inherits,
      util_d$1_reduce as reduce,
      util_d$1_filter as filter,
      util_d$1_bind as bind,
      util_d$1_curry as curry,
      util_d$1_isArray as isArray,
      util_d$1_isString as isString,
      util_d$1_isObject as isObject,
      util_d$1_isFunction as isFunction,
      util_d$1_extend as extend,
      util_d$1_defaults as defaults,
      util_d$1_clone as clone,
      util_d$1_merge as merge,
    };
  }
  
  class Browser {
      firefox: boolean;
      ie: boolean;
      edge: boolean;
      newEdge: boolean;
      weChat: boolean;
      version: string | number;
  }
  class Env {
      browser: Browser;
      node: boolean;
      wxa: boolean;
      worker: boolean;
      svgSupported: boolean;
      touchEventsSupported: boolean;
      pointerEventsSupported: boolean;
      domSupported: boolean;
      transformSupported: boolean;
      transform3dSupported: boolean;
      hasGlobalWindow: boolean;
  }
  const env: Env;
  
  function brushSingle(ctx: CanvasRenderingContext2D, el: Displayable): void;
  
  function extendComponentModel(proto: object): ComponentModel;
  function extendComponentView(proto: object): ChartView;
  function extendSeriesModel(proto: object): SeriesModel;
  function extendChartView(proto: object): ChartView;
  
  type Dependencies = {
      grid: XAXisOption | YAXisOption | AxisPointerOption;
      polar: AngleAxisOption | RadiusAxisOption;
      parallel: ParallelAxisOption;
  };
  type DependenciesKeys = keyof Dependencies & string;
  type Arrayable<T> = T | T[];
  type GetMainType<OptionUnion extends ComponentOption> = Exclude<OptionUnion['mainType'], undefined>;
  type ExtractComponentOption<OptionUnion, ExtractMainType> = OptionUnion extends {
      mainType?: ExtractMainType;
  } ? OptionUnion : never;
  type GetDependency<DependencyOption extends ComponentOption> = {
      [key in GetMainType<DependencyOption>]?: Arrayable<ExtractComponentOption<DependencyOption, key>>;
  };
  type GetDependencies<MainType extends string> = GetDependency<Dependencies[Extract<MainType, DependenciesKeys>]>;
  type ComposeUnitOption<OptionUnion extends ComponentOption> = CheckMainType<GetMainType<OptionUnion>> & Omit<ECBasicOption, 'baseOption' | 'options'> & {
      [key in GetMainType<OptionUnion>]?: Arrayable<ExtractComponentOption<OptionUnion, key>>;
  } & GetDependencies<GetMainType<OptionUnion>>;
  type CheckMainType<OptionUnionMainType extends string> = string extends OptionUnionMainType ? never : {};
  type ComposeOption<OptionUnion extends ComponentOption> = ComposeUnitOption<OptionUnion> & {
      baseOption?: ComposeUnitOption<OptionUnion>;
      options?: ComposeUnitOption<OptionUnion>[];
  };
  
  export { AngleAxisOption as AngleAxisComponentOption, AnimationDelayCallback, AnimationDelayCallbackParam as AnimationDelayCallbackParams, AnimationDurationCallback, AriaOption as AriaComponentOption, Axis, AxisBreakChangedEvent, AxisPointerOption as AxisPointerComponentOption, BarSeriesOption, BoxplotSeriesOption$1 as BoxplotSeriesOption, BrushOption as BrushComponentOption, CalendarOption as CalendarComponentOption, CandlestickSeriesOption$1 as CandlestickSeriesOption, ChartView, ChordSeriesOption$1 as ChordSeriesOption, CollapseAxisBreakPayload, ZRColor as Color, ComponentModel, ComponentView, ComposeOption, ContinousVisualMapOption as ContinousVisualMapComponentOption, CustomSeriesOption, CustomSeriesRenderItem, CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams, CustomSeriesRenderItemReturn, DataZoomComponentOption, DatasetOption as DatasetComponentOption, CallbackDataParams as DefaultLabelFormatterCallbackParams, DownplayPayload, ECElementEvent, EChartsType as ECharts, ECBasicOption as EChartsCoreOption, EChartsInitOpts, EChartsOption, EChartsType, EffectScatterSeriesOption$1 as EffectScatterSeriesOption, ElementEvent, ExpandAxisBreakPayload, FunnelSeriesOption$1 as FunnelSeriesOption, GaugeSeriesOption$1 as GaugeSeriesOption, GeoOption as GeoComponentOption, GraphSeriesOption$1 as GraphSeriesOption, GraphicComponentLooseOption as GraphicComponentOption, GridOption as GridComponentOption, HeatmapSeriesOption$1 as HeatmapSeriesOption, HighlightPayload, ImagePatternObject, InsideDataZoomOption as InsideDataZoomComponentOption, LabelFormatterCallback, LabelLayoutOptionCallback, LabelLayoutOptionCallbackParams, LegendComponentOption, LineSeriesOption$1 as LineSeriesOption, LinearGradientObject, LinesSeriesOption$1 as LinesSeriesOption, SeriesData as List, MapSeriesOption$1 as MapSeriesOption, MarkAreaOption as MarkAreaComponentOption, MarkLineOption as MarkLineComponentOption, MarkPointOption as MarkPointComponentOption, MatrixOption as MatrixComponentOption, Model, PRIORITY, ParallelCoordinateSystemOption as ParallelComponentOption, ParallelSeriesOption$1 as ParallelSeriesOption, PatternObject, Payload, PictorialBarSeriesOption$1 as PictorialBarSeriesOption, PieSeriesOption$1 as PieSeriesOption, PiecewiseVisualMapOption as PiecewiseVisualMapComponentOption, LegendOption as PlainLegendComponentOption, PolarOption as PolarComponentOption, RadarOption as RadarComponentOption, RadarSeriesOption$1 as RadarSeriesOption, RadialGradientObject, RadiusAxisOption as RadiusAxisComponentOption, RegisteredSeriesOption, ResizeOpts, SVGPatternObject, SankeySeriesOption$1 as SankeySeriesOption, ScatterSeriesOption$1 as ScatterSeriesOption, ScrollableLegendOption as ScrollableLegendComponentOption, SelectChangedEvent, SelectChangedPayload, SeriesModel, SeriesOption, SetOptionOpts, SetOptionTransitionOpt, SetOptionTransitionOptItem, SetThemeOpts, SingleAxisOption as SingleAxisComponentOption, SliderDataZoomOption as SliderDataZoomComponentOption, SunburstSeriesOption$1 as SunburstSeriesOption, ThemeRiverSeriesOption$1 as ThemeRiverSeriesOption, ThumbnailOption as ThumbnailComponentOption, TimelineOption as TimelineComponentOption, TitleOption as TitleComponentOption, ToggleAxisBreakPayload, ToolboxComponentOption, TooltipFormatterCallback as TooltipComponentFormatterCallback, TopLevelFormatterParams as TooltipComponentFormatterCallbackParams, TooltipOption as TooltipComponentOption, TooltipPositionCallback as TooltipComponentPositionCallback, TooltipPositionCallbackParams as TooltipComponentPositionCallbackParams, TreeSeriesOption$1 as TreeSeriesOption, TreemapSeriesOption$1 as TreemapSeriesOption, VisualMapComponentOption, XAXisOption as XAXisComponentOption, YAXisOption as YAXisComponentOption, color_d as color, connect, dataTool, dependencies, disConnect, disconnect, dispose$1 as dispose, env, extendChartView, extendComponentModel, extendComponentView, extendSeriesModel, format_d as format, getCoordinateSystemDimensions, getInstanceByDom, getInstanceById, getMap, graphic_d as graphic, helper_d as helper, init$1 as init, brushSingle as innerDrawElementOnCanvas, matrix_d as matrix, number_d as number, parseGeoJSON, parseGeoJSON as parseGeoJson, registerAction, registerCoordinateSystem, registerCustomSeries, registerLayout, registerLoading, registerLocale, registerMap, registerPostInit, registerPostUpdate, registerPreprocessor, registerProcessor, registerTheme, registerTransform, registerUpdateLifecycle, registerVisual, setCanvasCreator, setPlatformAPI, throttle, time_d as time, use, util_d$1 as util, vector_d as vector, version$1 as version, util_d as zrUtil, zrender_d as zrender };
}

declare module "d3-sankey" {
  import { Link } from 'd3-shape';
  
  /**
   * Get a Sankey layout generator.
   *
   * Invoking sankey() without generics, means the node type and link type assume no user-defined attributes, i.e.
   * only the attributes internally used by the Sankey layout generator.
   *
   * Default nodes/links accessors are assumed.
   */
  export function sankey(): SankeyLayout<SankeyGraph<{}, {}>, {}, {}>;
  
  /**
   * Get a Sankey layout generator.
   *
   * Default nodes/links accessors are assumed.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export function sankey<N extends SankeyExtraProperties, L extends SankeyExtraProperties>(): SankeyLayout<
  SankeyGraph<N, L>,
  N,
  L
  >;
  
  /**
   * Get a Sankey layout generator.
   *
   * The nodes/links accessors need to be configured to work with the data type of the first argument passed
   * in when invoking the Sankey layout generator.
   *
   * The first generic corresponds to the data type of the first argument passed in when invoking the Sankey layout generator,
   * and its nodes/links accessors.
   *
   * The second generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The third generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export function sankey<Data, N extends SankeyExtraProperties, L extends SankeyExtraProperties>(): SankeyLayout<
  Data,
  N,
  L
  >;
  
  /**
   * Compute the horizontal node position of a node in a Sankey layout with center alignment.
   * Like d3.sankeyLeft, except that nodes without any incoming links are moved as right as possible.
   * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
   *
   * @param node Sankey node for which to calculate the horizontal node position.
   * @param n Total depth n of the graph  (one plus the maximum node.depth)
   */
  export function sankeyCenter(node: SankeyNode<{}, {}>, n: number): number;
  
  /**
   * A helper interface as an extension reference for user-provided properties of
   * nodes and links in the graph, which are not required or calculated by
   * the Sankey layout Generator
   */
  export interface SankeyExtraProperties {
      [key: string]: any;
  }
  
  /**
   * A Sankey Graph Object which contains the computed layout information for nodes and links.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export interface SankeyGraph<N extends SankeyExtraProperties, L extends SankeyExtraProperties> {
      /**
       * Array of Sankey diagram nodes
       */
      nodes: Array<SankeyNode<N, L>>;
      /**
       * Array of Sankey diagram links
       */
      links: Array<SankeyLink<N, L>>;
  }
  
  /**
   * Compute the horizontal node position of a node in a Sankey layout with justified alignment.
   * Like d3.sankeyLeft, except that nodes without any outgoing links are moved to the far right.
   * Returns an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
   *
   * @param node Sankey node for which to calculate the horizontal node position.
   * @param n Total depth n of the graph  (one plus the maximum node.depth)
   */
  export function sankeyJustify(node: SankeyNode<{}, {}>, n: number): number;
  
  /**
   * A Sankey layout generator.
   *
   * The first generic Data refers to the data type of the first argument passed in when invoking the
   * Sankey layout generator and internally the configured nodes/links accessor functions.
   *
   * The second generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The third generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export interface SankeyLayout<Data, N extends SankeyExtraProperties, L extends SankeyExtraProperties> {
      /**
       * Computes the node and link positions for the given arguments, returning a graph representing the Sankey layout.
       *
       * @param data Data object being passed as the first argument to the nodes and links accessor functions. Additional arguments will also be passed
       * to the accessor functions.
       */
      (data: Data, ...args: any[]): SankeyGraph<N, L>;
  
      /**
       * Recomputes the specified graph’s links’ positions, updating the following properties of each link:
       *
       * - link.sy: the link’s vertical starting position (at source node)
       * - link.ty: the link’s vertical end position (at target node)
       *
       * This method is intended to be called after computing the initial Sankey layout, for example when the diagram is repositioned interactively.
       *
       * @param graph A previously initialized Sankey graph for which the link positions should be re-calculated
       */
      update(graph: SankeyGraph<N, L>): SankeyGraph<N, L>;
  
      /**
       * Return the current nodes accessor function, which defaults to a function returning the "nodes" property of the
       * first argument it is invoked with.
       */
      nodes(): (data: Data, ...args: any[]) => Array<SankeyNode<N, L>>;
      /**
       * Set the Sankey generator's nodes accessor to a function returning the specified array of objects and returns this Sankey layout generator.
       *
       * @param nodes Array of nodes.
       */
      nodes(nodes: Array<SankeyNode<N, L>>): this;
      /**
       * Set the Sankey generator's nodes accessor to the specified function and returns this Sankey layout generator.
       *
       * @param nodes A nodes accessor function. The function is invoked when the Sankey layout is generated, being passed any arguments passed to the Sankey generator.
       * This function must return an array of nodes.
       */
      nodes(nodes: (data: Data, ...args: any[]) => Array<SankeyNode<N, L>>): this;
  
      /**
       * Return the current links accessor function, which defaults to a function returning the "links" property of the
       * first argument it is invoked with.
       */
      links(): (data: Data, ...args: any[]) => Array<SankeyLink<N, L>>;
      /**
       * Set the Sankey generator's links accessor to a function returning the specified array of objects and returns this Sankey layout generator.
       *
       * @param links Array of links.
       */
      links(links: Array<SankeyLink<N, L>>): this;
      /**
       * Set the Sankey generator's links accessor to the specified function and returns this Sankey layout generator.
       *
       * @param links A links accessor function. The function is invoked when the Sankey layout is generated, being passed any arguments passed to the Sankey generator.
       * This function must return an array of links.
       */
      links(links: (data: Data, ...args: any[]) => Array<SankeyLink<N, L>>): this;
  
      /**
       * Return the current node id accessor.
       * The default accessor is a function being passed in a Sankey layout node and returning its numeric node.index.
       */
      nodeId(): (node: SankeyNode<N, L>) => string | number;
      /**
       * Set the node id accessor to the specified function and return this Sankey layout generator.
       *
       * The default accessor is a function being passed in a Sankey layout node and returning its numeric node.index.
       * The default id accessor allows each link’s source and target to be specified as a zero-based index into the nodes array.
       *
       * @param nodeId A node id accessor function being passed a node in the Sankey graph and returning its id.
       */
      nodeId(nodeId: (node: SankeyNode<N, L>) => string | number): this;
  
      /**
       * Return the current node alignment method, which defaults to d3.sankeyJustify.
       */
      nodeAlign(): (node: SankeyNode<N, L>, n: number) => number;
      /**
       * Set the node alignment method the specified function and return this Sankey layout generator.
       *
       * @param nodeAlign A node alignment function which is evaluated for each input node in order,
       * being passed the current node and the total depth n of the graph (one plus the maximum node.depth),
       * and must return an integer between 0 and n - 1 that indicates the desired horizontal position of the node in the generated Sankey diagram.
       */
      nodeAlign(nodeAlign: (node: SankeyNode<N, L>, n: number) => number): this;
  
      /**
       * Return the current node width, which defaults to 24.
       */
      nodeWidth(): number;
      /**
       * Set the node width to the specified number and return this Sankey layout generator.
       *
       * @param width Width of node in pixels, which defaults to 24.
       */
      nodeWidth(width: number): this;
  
      /**
       * Return the current node padding, which defaults to 8.
       *
       * Node padding refers to the vertical space between nodes which occupy the same horizontal space.
       */
      nodePadding(): number;
      /**
       * Set the vertical separation between nodes at each column to the specified number and return this Sankey layout generator.
       *
       * @param padding Node padding, i.e. vertical separation between nodes at each column, in pixels, which defaults to 8.
       */
      nodePadding(padding: number): this;
  
      /**
       * Return the current extent which defaults to [[0, 0], [1, 1]].
       */
      extent(): [[number, number], [number, number]];
      /**
       * Set the extent of the Sankey layout to the specified bounds and returns this Sankey layout generator.
       *
       * @param extent Extent bounds for the layout. The extent bounds are specified as an array [[x0, y0], [x1, y1]],
       * where x0 is the left side of the extent, y0 is the top, x1 is the right and y1 is the bottom. The default is [[0, 0], [1, 1]].
       */
      extent(extent: [[number, number], [number, number]]): this;
  
      /**
       * Return the current layout size in pixels. The size is a two element array of [width, height] which defaults to [1, 1].
       */
      size(): [number, number];
      /**
       * Set the size of the layout and return this Sankey layout generator.
       * This convenience method is equivalent to using extent([[0, 0], [width, height]]).
       *
       * @param size A two element array of [width, height] in pixels which defaults to [1, 1].
       */
      size(size: [number, number]): this;
  
      /**
       * Return the current number of relaxation iterations, which defaults to 32.
       */
      iterations(): number;
      /**
       * Set the number of relaxation iterations when generating the layout and return this Sankey layout generator.
       *
       * @param iterations Number of relaxation iterations, which defaults to 32.
       */
      iterations(iterations: number): this;
  
      /**
       * Returns the node comparison function which defaults to undefined.
       */
      nodeSort(): ((a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number) | undefined;
  
      /**
       * Set the node comparison function and return this Sankey layout generator.
       *
       * @param compare Node comparison function.
       */
      nodeSort(compare: (a: SankeyNode<N, L>, b: SankeyNode<N, L>) => number | undefined | null): this;
  
      /**
       * Returns the link comparison function which defaults to undefined.
       */
      linkSort(): ((a: SankeyLink<N, L>, b: SankeyLink<N, L>) => number) | undefined;
  
      /**
       * Set the link comparison function and return this Sankey layout generator.
       *
       * @param compare Link comparison function.
       */
      linkSort(compare: (a: SankeyLink<N, L>, b: SankeyLink<N, L>) => number | undefined | null): this;
  }
  
  /**
   * Compute the horizontal node position of a node in a Sankey layout with left alignment.
   * Returns (node.depth) to indicate the desired horizontal position of the node in the generated Sankey diagram.
   *
   * @param node Sankey node for which to calculate the horizontal node position.
   * @param n Total depth n of the graph  (one plus the maximum node.depth)
   */
  export function sankeyLeft(node: SankeyNode<{}, {}>, n: number): number;
  
  /**
   * Sankey Link type including both user-defined link data elements, those required by the Sankey layout generator,
   *  as well as those calculated once the layout(...) method of the layout generator has been invoked.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export type SankeyLink<N extends SankeyExtraProperties, L extends SankeyExtraProperties> = L & SankeyLinkMinimal<N, L>;
  
  /**
   * Get a horizontal link shape suitable for a Sankey diagram.
   * Source and target accessors are pre-configured and work with the
   * default x- and y- accessors of the link shape generator.
   */
  export function sankeyLinkHorizontal(): Link<any, SankeyLink<{}, {}>, [number, number]>;
  
  /**
   * Get a horizontal link shape suitable for a Sankey diagram.
   * Source and target accessors are pre-configured and work with the
   * default x- and y- accessors of the link shape generator.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export function sankeyLinkHorizontal<N extends SankeyExtraProperties, L extends SankeyExtraProperties>(): Link<
  any,
  SankeyLink<N, L>,
  [number, number]
  >;
  
  /**
   * Helper interface to define the properties of Sankey Links. Calculated properties may only be defined,
   * once the layout(...) method of the Sankey layout generator has been invoked.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export interface SankeyLinkMinimal<N extends SankeyExtraProperties, L extends SankeyExtraProperties> {
      /**
       * Link's source node. For convenience, when initializing a Sankey layout using the default node id accessor,
       * source may be the zero-based index of the corresponding node in the nodes array
       * returned by the nodes accessor of the Sankey layout generator rather than object references. Alternatively,
       * the Sankey layout can be configured with a custom node ID accessor to resolve the source node of the link upon initialization.
       *
       * Once the Sankey generator is invoked to return the Sankey graph object,
       * the numeric index will be replaced with the corresponding source node object.
       */
      source: number | string | SankeyNode<N, L>;
      /**
       * Link's target node. For convenience, when initializing a Sankey layout using the default node id accessor,
       * target may be the zero-based index of the corresponding node in the nodes array
       * returned by the nodes accessor of the Sankey layout generator rather than object references. Alternatively,
       * the Sankey layout can be configured with a custom node ID accessor to resolve the target node of the link upon initialization.
       *
       * Once the Sankey generator is invoked to return the Sankey graph object,
       * the numeric index will be replaced with the corresponding target node object.
       */
      target: number | string | SankeyNode<N, L>;
      /**
       * Link's numeric value
       */
      value: number;
      /**
       * Link's vertical starting position (at source node) calculated by Sankey layout generator.
       */
      y0?: number | undefined;
      /**
       * Link's vertical end position (at target node) calculated by Sankey layout generator.
       */
      y1?: number | undefined;
      /**
       * Link's width (proportional to its value) calculated by Sankey layout generator.
       */
      width?: number | undefined;
      /**
       * Link's zero-based index within the array of links calculated by Sankey layout generator.
       */
      index?: number | undefined;
  }
  
  /**
   * Sankey Node type including both user-defined node data elements as well as those
   * calculated once the layout(...) method of the Sankey layout generators has been invoked.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export type SankeyNode<N extends SankeyExtraProperties, L extends SankeyExtraProperties> = N & SankeyNodeMinimal<N, L>;
  
  /**
   * Helper interface to define the properties of Sankey Nodes. Calculated properties may only be defined,
   * once the layout(...) method of the Sankey layout generator has been invoked.
   *
   * The first generic N refers to user-defined properties contained in the node data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyNodeMinimal interface.
   *
   * The second generic L refers to user-defined properties contained in the link data passed into
   * Sankey layout generator. These properties are IN EXCESS to the properties explicitly identified in the
   * SankeyLinkMinimal interface.
   */
  export interface SankeyNodeMinimal<N extends SankeyExtraProperties, L extends SankeyExtraProperties> {
      /**
       * Array of outgoing links which have this node as their source.
       * This property is calculated internally by the Sankey layout generator.
       */
      sourceLinks?: Array<SankeyLink<N, L>> | undefined;
      /**
       * Array of incoming links which have this node as their target.
       * This property is calculated internally by the Sankey layout generator.
       */
      targetLinks?: Array<SankeyLink<N, L>> | undefined;
      /**
       * Node's value calculated by Sankey layout Generator;
       * the sum of link.value for the node’s incoming links.
       */
      value?: number | undefined;
      /**
       * Node's fixedValue (user-defined)
       */
      fixedValue?: number | undefined;
      /**
       * Node’s zero-based index within the array of nodes calculated by Sankey layout generator.
       */
      index?: number | undefined;
      /**
       * Node’s zero-based graph depth, derived from the graph topology calculated by Sankey layout generator.
       */
      depth?: number | undefined;
      /**
       * Node’s zero-based graph height, derived from the graph topology calculated by Sankey layout generator.
       */
      height?: number | undefined;
      /**
       * Node's minimum horizontal position (derived from the node.depth) calculated by Sankey layout generator.
       */
      x0?: number | undefined;
      /**
       * Node’s maximum horizontal position (node.x0 + sankey.nodeWidth) calculated by Sankey layout generator.
       */
      x1?: number | undefined;
      /**
       * Node's minimum vertical position calculated by Sankey layout generator.
       */
      y0?: number | undefined;
      /**
       * Node's maximum vertical position (node.y1 - node.y0 is proportional to node.value) calculated by Sankey layout generator.
       */
      y1?: number | undefined;
  }
  
  /**
   * Compute the horizontal node position of a node in a Sankey layout with right alignment.
   * Returns (n - 1 - node.height) to indicate the desired horizontal position of the node in the generated Sankey diagram.
   *
   * @param node Sankey node for which to calculate the horizontal node position.
   * @param n Total depth n of the graph  (one plus the maximum node.depth)
   */
  export function sankeyRight(node: SankeyNode<{}, {}>, n: number): number;
  
  export { }
  
}

declare module "@mui/x-data-grid" {
  import { BaseIconButtonPropsOverrides as BaseIconButtonPropsOverrides_2 } from '@mui/x-data-grid';
  import { BaseMenuItemPropsOverrides as BaseMenuItemPropsOverrides_2 } from '@mui/x-data-grid';
  import type { DimensionsState } from '@mui/x-virtualizer/models';
  import { EMPTY_RENDER_CONTEXT } from '@mui/x-virtualizer';
  import { EventListenerOptions as EventListenerOptions_2 } from '@mui/x-internals/EventManager';
  import { EventManager } from '@mui/x-internals/EventManager';
  import { GridBaseIconProps as GridBaseIconProps_2 } from '@mui/x-data-grid';
  import { GridCellCoordinates as GridCellCoordinates_2 } from '@mui/x-data-grid';
  import { GridColumnGroupIdentifier as GridColumnGroupIdentifier_2 } from '@mui/x-data-grid';
  import { GridColumnIdentifier as GridColumnIdentifier_2 } from '@mui/x-data-grid';
  import { GridColumnMenuState as GridColumnMenuState_2 } from '@mui/x-data-grid';
  import { GridColumnResizeState as GridColumnResizeState_2 } from '@mui/x-data-grid';
  import { GridColumnsGroupingState as GridColumnsGroupingState_2 } from '@mui/x-data-grid';
  import { GridColumnsState as GridColumnsState_2 } from '@mui/x-data-grid';
  import { GridColumnVisibilityModel as GridColumnVisibilityModel_2 } from '@mui/x-data-grid';
  import { GridDimensions as GridDimensions_2 } from '@mui/x-data-grid';
  import { GridEditCellProps as GridEditCellProps_2 } from '@mui/x-data-grid';
  import { GridEditingState as GridEditingState_2 } from '@mui/x-data-grid';
  import { GridFilterModel as GridFilterModel_2 } from '@mui/x-data-grid';
  import { GridPaginationMeta as GridPaginationMeta_2 } from '@mui/x-data-grid';
  import { GridPaginationModel as GridPaginationModel_2 } from '@mui/x-data-grid';
  import { GridPaginationState as GridPaginationState_2 } from '@mui/x-data-grid';
  import { GridPreferencePanelState as GridPreferencePanelState_2 } from '@mui/x-data-grid';
  import { GridRowEntry as GridRowEntry_2 } from '@mui/x-data-grid';
  import { GridRowIdToModelLookup as GridRowIdToModelLookup_2 } from '@mui/x-data-grid';
  import type { GridRowModelUpdate as GridRowModelUpdate_2 } from '@mui/x-data-grid';
  import { GridRowSelectionModel as GridRowSelectionModel_2 } from '@mui/x-data-grid';
  import { GridRowsMetaState as GridRowsMetaState_2 } from '@mui/x-data-grid';
  import { GridRowTreeConfig as GridRowTreeConfig_2 } from '@mui/x-data-grid';
  import { GridTreeNode as GridTreeNode_2 } from '@mui/x-data-grid';
  import { GridTreeNodeWithRender as GridTreeNodeWithRender_2 } from '@mui/x-data-grid';
  import { GridValidRowModel as GridValidRowModel_2 } from '@mui/x-data-grid';
  import { GridVirtualizationState as GridVirtualizationState_2 } from '@mui/x-data-grid';
  import { HeightEntry } from '@mui/x-virtualizer/models';
  import { MuiBaseEvent } from '@mui/x-internals/types';
  import { MuiEvent } from '@mui/x-internals/types';
  import { MUIStyledCommonProps } from '@mui/system';
  import { OutputSelector as OutputSelector_2 } from '@mui/x-data-grid';
  import { PropsFromSlot } from '@mui/x-internals/slots';
  import * as React_2 from 'react';
  import { RefObject } from '@mui/x-internals/types';
  import { RefObject as RefObject_2 } from 'react';
  import { RenderContext } from '@mui/x-virtualizer/models';
  import { RenderProp } from '@mui/x-internals/useComponentRenderer';
  import { RowsMetaState } from '@mui/x-virtualizer/models';
  import { RowSpanningState } from '@mui/x-virtualizer/models';
  import type { Store } from '@mui/x-internals/store';
  import { StyledComponent } from '@emotion/styled';
  import { SxProps } from '@mui/material/styles';
  import { SxProps as SxProps_2 } from '@mui/system';
  import { Theme } from '@mui/material/styles';
  import { Theme as Theme_2 } from '@mui/system';
  import { default as useOnMount } from '@mui/utils/useOnMount';
  import { Virtualization } from '@mui/x-virtualizer';
  import type { Virtualizer } from '@mui/x-virtualizer';
  import type { VirtualScrollerCompat } from '@mui/x-virtualizer';
  
  type AcValue<Value, Multiple, DisableClearable, FreeSolo> = Multiple extends true ? Array<Value | AcValueMap<FreeSolo>> : DisableClearable extends true ? NonNullable<Value | AcValueMap<FreeSolo>> : Value | null | AcValueMap<FreeSolo>;
  
  type AcValueMap<FreeSolo> = FreeSolo extends true ? string : never;
  
  type ApplyFilterFn<R extends GridValidRowModel = any, V = any, F = V> = (value: V, row: R, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => boolean;
  
  type AutocompleteProps<Value = string, Multiple extends boolean = false, DisableClearable extends boolean = false, FreeSolo extends boolean = false> = {
      id?: string;
      /** Allow multiple selection. */
      multiple?: Multiple;
      /** Allow to add new options. */
      freeSolo?: FreeSolo;
      value?: AcValue<Value, Multiple, DisableClearable, FreeSolo>;
      options: ReadonlyArray<Value>;
      /**
       * Used to determine the string value for a given option.
       * It's used to fill the input (and the list box options if `renderOption` is not provided).
       *
       * If used in free solo mode, it must accept both the type of the options and a string.
       *
       * @param {Value} option The option
       * @returns {string} The label
       * @default (option) => option.label ?? option
       */
      getOptionLabel?: (option: Value | AcValueMap<FreeSolo>) => string;
      /**
       * Used to determine if the option represents the given value.
       * Uses strict equality by default.
       * ⚠️ Both arguments need to be handled, an option can only match with one value.
       *
       * @param {Value} option The option to test.
       * @param {Value} value The value to test against.
       * @returns {boolean} true if value matches
       */
      isOptionEqualToValue?: (option: Value, value: Value) => boolean;
      /**
       * Callback fired when the value changes.
       *
       * @param {React.SyntheticEvent} event The event source of the callback.
       * @param {Value|Value[]} value The new value of the component.
       */
      onChange?: (event: React.SyntheticEvent, value: AcValue<Value, Multiple, DisableClearable, FreeSolo>) => void;
      /**
       * Callback fired when the input value changes.
       *
       * @param {React.SyntheticEvent} event The event source of the callback.
       * @param {string} value The new value of the input.
       */
      onInputChange?: (event: React.SyntheticEvent, value: string) => void;
      label?: React.ReactNode;
      placeholder?: string;
      slotProps?: {
          textField: TextFieldProps;
      };
  };
  
  type AutoPlacement = 'auto' | 'auto-start' | 'auto-end';
  
  type BadgeProps = CommonProps & {
      badgeContent?: React.ReactNode;
      children?: React.ReactNode;
      color?: 'primary' | 'default' | 'error';
      invisible?: boolean;
      overlap?: 'circular';
      variant?: 'dot';
      style?: React.CSSProperties;
  };
  
  export interface BaseAutocompletePropsOverrides {}
  
  export interface BaseBadgePropsOverrides {}
  
  export interface BaseButtonPropsOverrides {}
  
  export interface BaseCheckboxPropsOverrides {}
  
  export interface BaseChipPropsOverrides {}
  
  export interface BaseCircularProgressPropsOverrides {}
  
  export interface BaseDividerPropsOverrides {}
  
  export interface BaseIconButtonPropsOverrides {}
  
  export interface BaseIconPropsOverrides {}
  
  export interface BaseInputLabelPropsOverrides {}
  
  export interface BaseInputPropsOverrides {}
  
  export interface BaseLinearProgressPropsOverrides {}
  
  export interface BaseMenuItemPropsOverrides {}
  
  export interface BaseMenuListPropsOverrides {}
  
  export interface BasePaginationPropsOverrides {}
  
  type BasePlacement = 'top' | 'bottom' | 'left' | 'right';
  
  export interface BasePopperPropsOverrides {}
  
  export interface BaseSelectOptionPropsOverrides {}
  
  export interface BaseSelectPropsOverrides {}
  
  export interface BaseSkeletonPropsOverrides {}
  
  interface BaseSlotProps {
      baseAutocomplete: AutocompleteProps<string, true, false, true> & BaseAutocompletePropsOverrides;
      baseBadge: BadgeProps & BaseBadgePropsOverrides;
      baseCheckbox: CheckboxProps & BaseCheckboxPropsOverrides;
      baseChip: ChipProps & BaseChipPropsOverrides;
      baseCircularProgress: CircularProgressProps & BaseCircularProgressPropsOverrides;
      baseDivider: DividerProps & BaseDividerPropsOverrides;
      baseLinearProgress: LinearProgressProps & BaseLinearProgressPropsOverrides;
      baseMenuList: MenuListProps & BaseMenuListPropsOverrides;
      baseMenuItem: MenuItemProps & BaseMenuItemPropsOverrides;
      baseTabs: TabsProps & BaseTabsPropsOverrides;
      baseTextField: TextFieldProps & BaseTextFieldPropsOverrides;
      baseSwitch: SwitchProps & BaseSwitchPropsOverrides;
      baseButton: ButtonProps & BaseButtonPropsOverrides;
      baseIconButton: IconButtonProps & BaseIconButtonPropsOverrides;
      baseToggleButton: ToggleButtonProps & BaseToggleButtonPropsOverrides;
      basePagination: PaginationProps & BasePaginationPropsOverrides;
      basePopper: PopperProps & BasePopperPropsOverrides;
      baseTooltip: TooltipProps & BaseTooltipPropsOverrides;
      baseInput: InputProps & BaseInputPropsOverrides;
      baseSelect: SelectProps & BaseSelectPropsOverrides;
      baseSelectOption: SelectOptionProps & BaseSelectOptionPropsOverrides;
      baseSkeleton: SkeletonProps & BaseSkeletonPropsOverrides;
  }
  
  export interface BaseSwitchPropsOverrides {}
  
  export interface BaseTabsPropsOverrides {}
  
  export interface BaseTextFieldPropsOverrides {}
  
  export interface BaseToggleButtonPropsOverrides {}
  
  export interface BaseTooltipPropsOverrides {}
  
  export interface BottomContainerPropsOverrides {}
  
  type ButtonProps = CommonProps & {
      ref?: Ref<HTMLButtonElement>;
      children?: React.ReactNode;
      disabled?: boolean;
      id?: string;
      role?: string;
      size?: 'small' | 'medium' | 'large';
      startIcon?: React.ReactNode;
      tabIndex?: number;
      title?: string;
      touchRippleRef?: any;
  };
  
  export interface CellPropsOverrides {}
  
  type CheckboxProps = CommonProps & {
      ref?: Ref<HTMLButtonElement>;
      id?: string;
      autoFocus?: boolean;
      checked?: boolean;
      disabled?: boolean;
      fullWidth?: boolean;
      indeterminate?: boolean;
      inputRef?: React.Ref<HTMLInputElement>;
      name?: string;
      label?: React.ReactNode;
      onChange?: React.ChangeEventHandler;
      size?: 'small' | 'medium';
      density?: 'standard' | 'compact';
      slotProps?: {
          htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
      };
      style?: React.CSSProperties;
      tabIndex?: number;
      touchRippleRef?: any;
  };
  
  /**
   * A helper function to check if the id provided is valid.
   * @param {GridRowId} id Id as [[GridRowId]].
   * @param {GridRowModel | Partial<GridRowModel>} row Row as [[GridRowModel]].
   * @param {string} detailErrorMessage A custom error message to display for invalid IDs
   */
  export function checkGridRowIdIsValid(id: GridRowId, row: GridRowModel | Partial<GridRowModel>, detailErrorMessage?: string): void;
  
  type ChipProps = CommonProps & {
      ref?: Ref<HTMLDivElement>;
      id?: string;
      label: string;
      size?: 'small' | 'medium';
      icon?: React.ReactElement;
      children?: null;
      variant?: 'filled' | 'outlined';
  };
  
  type CircularProgressProps = CommonProps & {
      /**
       * Pixels or CSS value.
       * @default 40
       */
      size?: number | string;
      /** @default 'primary' */
      color?: 'inherit' | 'primary';
  };
  
  type ClickAwayMouseEventHandler = 'onClick' | 'onMouseDown' | 'onMouseUp' | 'onPointerDown' | 'onPointerUp';
  
  type ClickAwayTouchEventHandler = 'onTouchStart' | 'onTouchEnd';
  
  export interface ColumnHeaderFilterIconButtonProps {
      field: string;
      counter?: number;
      onClick?: (params: GridColumnHeaderParams, event: React_2.MouseEvent<HTMLButtonElement>) => void;
  }
  
  export interface ColumnHeaderFilterIconButtonPropsOverrides {}
  
  export interface ColumnHeaderSortIconPropsOverrides {}
  
  export interface ColumnMenuPropsOverrides {}
  
  const COLUMNS_DIMENSION_PROPERTIES: readonly ["maxWidth", "minWidth", "width", "flex"];
  
  export interface ColumnsManagementPropsOverrides {}
  
  export interface ColumnsPanelPropsOverrides {}
  
  export interface ColumnsPanelState {
      /**
       * If `true`, the columns panel is open.
       */
      open: boolean;
  }
  
  /**
   * A button that opens and closes the columns panel.
   * It renders the `baseButton` slot.
   *
   * Demos:
   *
   * - [Columns Panel](https://mui.com/x/react-data-grid/components/columns-panel/)
   *
   * API:
   *
   * - [ColumnsPanelTrigger API](https://mui.com/x/api/data-grid/columns-panel-trigger/)
   */
  export const ColumnsPanelTrigger: React_2.ForwardRefExoticComponent<ColumnsPanelTriggerProps> | React_2.ForwardRefExoticComponent<Omit<ColumnsPanelTriggerProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
  export type ColumnsPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
      /**
       * A function to customize rendering of the component.
       */
      render?: RenderProp<GridSlotProps['baseButton'], ColumnsPanelState>;
      /**
       * Override or extend the styles applied to the component.
       */
      className?: string | ((state: ColumnsPanelState) => string);
  };
  
  export const COMFORTABLE_DENSITY_FACTOR = 1.3;
  
  type CommonProps<T = HTMLElement> = React.DOMAttributes<T> & {
      className?: string;
      style?: React.CSSProperties;
      [k: `aria-${string}`]: any;
      [k: `data-${string}`]: any;
  };
  
  type CommonProps_2 = {
      className?: string;
      style?: React_2.CSSProperties;
  };
  
  export const COMPACT_DENSITY_FACTOR = 0.7;
  
  type CreateObjectEntries<TValue, TValueInitial = TValue> = TValue extends object ? { [TKey in keyof TValue]-?: TKey extends string ? OmitItself<TValue[TKey], TValueInitial> extends infer TNestedValue ? TNestedValue extends Entry ? {
          key: `${TKey}.${TNestedValue['key']}`;
          value: TNestedValue['value'];
      } : never : never : never }[keyof TValue] : EmptyEntry<TValue>;
  
  export const createRowSelectionManager: (model: GridRowSelectionModel) => RowSelectionManager;
  
  export interface CursorCoordinates {
      x: number;
      y: number;
  }
  
  /**
   * The default values of `DataGridPropsWithDefaultValues` to inject in the props of DataGrid.
   */
  export const DATA_GRID_PROPS_DEFAULT_VALUES: DataGridPropsWithDefaultValues;
  
  /**
   * Features:
   * - [DataGrid](https://mui.com/x/react-data-grid/features/)
   *
   * API:
   * - [DataGrid API](https://mui.com/x/api/data-grid/data-grid/)
   */
  export const DataGrid: DataGridComponent;
  
  interface DataGridComponent {
      <R extends GridValidRowModel = any>(props: DataGridProps<R> & React_2.RefAttributes<HTMLDivElement>): React_2.JSX.Element;
      propTypes?: any;
  }
  
  /**
   * The props of the Data Grid component after the pre-processing phase that the user should not be able to override.
   * Those are usually used in feature-hook for which the pro-plan has more advanced features (eg: multi-sorting, multi-filtering, ...).
   */
  type DataGridForcedPropsKey = 'checkboxSelectionVisibleOnly' | 'disableMultipleColumnsFiltering' | 'disableMultipleColumnsSorting' | 'disableColumnReorder' | 'keepColumnPositionIfDraggedOutside' | 'throttleRowsMs' | 'hideFooterRowCount' | 'pagination' | 'signature' | 'listView';
  
  interface DataGridPremiumSharedPropsWithDefaultValue {
      /**
       * If `true`, the cell selection mode is enabled.
       * @default false
       */
      cellSelection: boolean;
  }
  
  /**
   * The props of the Data Grid component after the pre-processing phase.
   */
  interface DataGridProcessedProps<R extends GridValidRowModel = any> extends DataGridPropsWithDefaultValues, DataGridPropsWithComplexDefaultValueAfterProcessing, DataGridPropsWithoutDefaultValue<R>, DataGridProSharedPropsWithoutDefaultValue, Partial<DataGridProSharedPropsWithDefaultValue>, Partial<DataGridPremiumSharedPropsWithDefaultValue> {}
  
  /**
   * The props users can give to the Data Grid component.
   */
  export type DataGridProps<R extends GridValidRowModel = any> = Omit<Partial<DataGridPropsWithDefaultValues<R>> & DataGridPropsWithComplexDefaultValueBeforeProcessing & DataGridPropsWithoutDefaultValue<R>, DataGridForcedPropsKey> & {
      pagination?: true;
  };
  
  /**
   * The Data Grid options with a default value that must be merged with the value given through props.
   */
  interface DataGridPropsWithComplexDefaultValueAfterProcessing {
      slots: GridSlotsComponent;
      localeText: GridLocaleText;
  }
  
  /**
   * The Data Grid options with a default value that must be merged with the value given through props.
   */
  interface DataGridPropsWithComplexDefaultValueBeforeProcessing {
      /**
       * Overridable components.
       */
      slots?: Partial<GridSlotsComponent>;
      /**
       * Set the locale text of the Data Grid.
       * You can find all the translation keys supported in [the source](https://github.com/mui/mui-x/blob/HEAD/packages/x-data-grid/src/constants/localeTextConstants.ts) in the GitHub repository.
       */
      localeText?: Partial<GridLocaleText>;
  }
  
  /**
   * The Data Grid options with a default value overridable through props
   * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
   * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
   * TODO: add multiSortKey
   */
  interface DataGridPropsWithDefaultValues<R extends GridValidRowModel = any> {
      /**
       * If `true`, the Data Grid height is dynamic and follows the number of rows in the Data Grid.
       * @default false
       * @deprecated Use flex parent container instead: https://mui.com/x/react-data-grid/layout/#flex-parent-container
       * @example
       * <div style={{ display: 'flex', flexDirection: 'column' }}>
       *   <DataGrid />
       * </div>
       */
      autoHeight: boolean;
      /**
       * If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar.
       * @default false
       */
      autoPageSize: boolean;
      /**
       * If `true`, the Data Grid will display an extra column with checkboxes for selecting rows.
       * @default false
       */
      checkboxSelection: boolean;
      /**
       * If `true`, the "Select All" header checkbox selects only the rows on the current page. To be used in combination with `checkboxSelection`.
       * It only works if the pagination is enabled.
       * @default false
       */
      checkboxSelectionVisibleOnly: boolean;
      /**
       * Column region in pixels to render before/after the viewport
       * @default 150
       */
      columnBufferPx: number;
      /**
       * Row region in pixels to render before/after the viewport
       * @default 150
       */
      rowBufferPx: number;
      /**
       * If `false`, the row selection mode is disabled.
       * @default true
       */
      rowSelection: boolean;
      /**
       * The milliseconds throttle delay for resizing the grid.
       * @default 60
       */
      resizeThrottleMs: number;
      /**
       * If `true`, column filters are disabled.
       * @default false
       */
      disableColumnFilter: boolean;
      /**
       * If `true`, the column menu is disabled.
       * @default false
       */
      disableColumnMenu: boolean;
      /**
       * If `true`, hiding/showing columns is disabled.
       * @default false
       */
      disableColumnSelector: boolean;
      /**
       * If `true`, the density selector is disabled.
       * @default false
       */
      disableDensitySelector: boolean;
      /**
       * If `true`, `eval()` is not used for performance optimization.
       * @default false
       */
      disableEval: boolean;
      /**
       * If `true`, filtering with multiple columns is disabled.
       * @default false
       */
      disableMultipleColumnsFiltering: boolean;
      /**
       * If `true`, multiple selection using the Ctrl/CMD or Shift key is disabled.
       * The MIT DataGrid will ignore this prop, unless `checkboxSelection` is enabled.
       * @default false (`!props.checkboxSelection` for MIT Data Grid)
       */
      disableMultipleRowSelection: boolean;
      /**
       * If `true`, the column sorting feature will be disabled.
       * @default false
       */
      disableColumnSorting: boolean;
      /**
       * If `true`, the sorting with multiple columns is disabled.
       * @default false
       */
      disableMultipleColumnsSorting: boolean;
      /**
       * If `true`, the selection on click on a row or cell is disabled.
       * @default false
       */
      disableRowSelectionOnClick: boolean;
      /**
       * If `true`, the Data Grid will not use the exclude model optimization when selecting all rows.
       * @default false
       */
      disableRowSelectionExcludeModel: boolean;
      /**
       * If `true`, the virtualization is disabled.
       * @default false
       */
      disableVirtualization: boolean;
      /**
       * Controls whether to use the cell or row editing.
       * @default "cell"
       */
      editMode: GridEditMode;
      /**
       * Filtering can be processed on the server or client-side.
       * Set it to 'server' if you would like to handle filtering on the server-side.
       * @default "client"
       */
      filterMode: GridFeatureMode;
      /**
       * The milliseconds delay to wait after a keystroke before triggering filtering.
       * @default 150
       */
      filterDebounceMs: number;
      /**
       * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
       * @default 150
       */
      columnFilterDebounceMs: number;
      /**
       * Sets the height in pixel of the column headers in the Data Grid.
       * @default 56
       */
      columnHeaderHeight: number;
      /**
       * If `true`, the footer component is hidden.
       * @default false
       */
      hideFooter: boolean;
      /**
       * If `true`, the pagination component in the footer is hidden.
       * @default false
       */
      hideFooterPagination: boolean;
      /**
       * If `true`, the row count in the footer is hidden.
       * It has no effect if the pagination is enabled.
       * @default false
       */
      hideFooterRowCount: boolean;
      /**
       * If `true`, the selected row count in the footer is hidden.
       * @default false
       */
      hideFooterSelectedRowCount: boolean;
      /**
       * If `true`, the diacritics (accents) are ignored when filtering or quick filtering.
       * E.g. when filter value is `cafe`, the rows with `café` will be visible.
       * @default false
       */
      ignoreDiacritics: boolean;
      /**
       * If `true`, the selection model will retain selected rows that do not exist.
       * Useful when using server side pagination and row selections need to be retained
       * when changing pages.
       * @default false
       */
      keepNonExistentRowsSelected: boolean;
      /**
       * Pass a custom logger in the components that implements the [[Logger]] interface.
       * @default console
       */
      logger: Logger;
      /**
       * Allows to pass the logging level or false to turn off logging.
       * @default "error" ("warn" in dev mode)
       */
      logLevel: keyof Logger | false;
      /**
       * If `true`, a loading overlay is displayed.
       * @default false
       */
      loading: boolean;
      /**
       * If `true`, pagination is enabled.
       * @default false
       */
      pagination: boolean;
      /**
       * Pagination can be processed on the server or client-side.
       * Set it to 'client' if you would like to handle the pagination on the client-side.
       * Set it to 'server' if you would like to handle the pagination on the server-side.
       * @default "client"
       */
      paginationMode: GridFeatureMode;
      /**
       * Set of rows of type [[GridRowsProp]].
       * @default []
       */
      rows: GridRowsProp<R>;
      /**
       * Sets the height in pixel of a row in the Data Grid.
       * @default 52
       */
      rowHeight: number;
      /**
       * Select the pageSize dynamically using the component UI.
       * @default [25, 50, 100]
       */
      pageSizeOptions: ReadonlyArray<number | {
          value: number;
          label: string;
      }>;
      /**
       * Sets the type of space between rows added by `getRowSpacing`.
       * @default "margin"
       */
      rowSpacingType: 'margin' | 'border';
      /**
       * If `true`, vertical borders will be displayed between cells.
       * @default false
       */
      showCellVerticalBorder: boolean;
      /**
       * If `true`, vertical borders will be displayed between column header items.
       * @default false
       */
      showColumnVerticalBorder: boolean;
      /**
       * If `true`, the toolbar is displayed.
       * @default false
       */
      showToolbar: boolean;
      /**
       * The order of the sorting sequence.
       * @default ['asc', 'desc', null]
       */
      sortingOrder: readonly GridSortDirection[];
      /**
       * Sorting can be processed on the server or client-side.
       * Set it to 'client' if you would like to handle sorting on the client-side.
       * Set it to 'server' if you would like to handle sorting on the server-side.
       * @default "client"
       */
      sortingMode: GridFeatureMode;
      /**
       * If positive, the Data Grid will throttle updates coming from `apiRef.current.updateRows` and `apiRef.current.setRows`.
       * It can be useful if you have a high update rate but do not want to do heavy work like filtering / sorting or rendering on each  individual update.
       * @default 0
       */
      throttleRowsMs: number;
      /**
       * If `true`, reordering columns is disabled.
       * @default false
       */
      disableColumnReorder: boolean;
      /**
       * If `true`, resizing columns is disabled.
       * @default false
       */
      disableColumnResize: boolean;
      /**
       * If `true`, moving the mouse pointer outside the Data Grid before releasing the mouse button
       * in a column re-order action will not cause the column to jump back to its original position.
       * @default false
       */
      keepColumnPositionIfDraggedOutside: boolean;
      /**
       * If `true`, the Data Grid will not use `valueFormatter` when exporting to CSV or copying to clipboard.
       * If an object is provided, you can choose to ignore the `valueFormatter` for CSV export or clipboard export.
       * @default false
       */
      ignoreValueFormatterDuringExport: boolean | {
          csvExport?: boolean;
          clipboardExport?: boolean;
      };
      /**
       * The character used to separate cell values when copying to the clipboard.
       * @default '\t'
       */
      clipboardCopyCellDelimiter: string;
      /**
       * If `true`, columns are autosized after the datagrid is mounted.
       * @default false
       */
      autosizeOnMount: boolean;
      /**
       * If `true`, column autosizing on header separator double-click is disabled.
       * @default false
       */
      disableAutosize: boolean;
      /**
       * If `true`, the Data Grid will auto span the cells over the rows having the same value.
       * @default false
       */
      rowSpanning: boolean;
      /**
       * If `true`, the Data Grid enables column virtualization when `getRowHeight` is set to `() => 'auto'`.
       * By default, column virtualization is disabled when dynamic row height is enabled to measure the row height correctly.
       * For datasets with a large number of columns, this can cause performance issues.
       * The downside of enabling this prop is that the row height will be estimated based the cells that are currently rendered, which can cause row height change when scrolling horizontally.
       * @default false
       */
      virtualizeColumnsWithAutoRowHeight: boolean;
  }
  
  /**
   * The Data Grid props with no default value.
   */
  interface DataGridPropsWithoutDefaultValue<R extends GridValidRowModel = any> extends CommonProps_2 {
      /**
       * The ref object that allows Data Grid manipulation. Can be instantiated with `useGridApiRef()`.
       */
      apiRef?: RefObject<GridApiCommunity | null>;
      /**
       * Signal to the underlying logic what version of the public component API
       * of the Data Grid is exposed [[GridSignature]].
       * @ignore - do not document.
       */
      signature?: string;
      /**
       * Override or extend the styles applied to the component.
       */
      classes?: Partial<GridClasses>;
      /**
       * The data source object.
       */
      dataSource?: GridDataSource;
      /**
       * Data source cache object.
       */
      dataSourceCache?: GridDataSourceCache | null;
      /**
       * Set the density of the Data Grid.
       * @default "standard"
       */
      density?: GridDensity;
      /**
       * Set the total number of rows, if it is different from the length of the value `rows` prop.
       * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
       * Only works with `paginationMode="server"`, ignored when `paginationMode="client"`.
       */
      rowCount?: number;
      /**
       * Use if the actual rowCount is not known upfront, but an estimation is available.
       * If some rows have children (for instance in the tree data), this number represents the amount of top level rows.
       * Applicable only with `paginationMode="server"` and when `rowCount="-1"`
       */
      estimatedRowCount?: number;
      /**
       * Override the height/width of the Data Grid inner scrollbar.
       */
      scrollbarSize?: number;
      /**
       * Function that applies CSS classes dynamically on cells.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @returns {string} The CSS class to apply to the cell.
       */
      getCellClassName?: (params: GridCellParams<any, R>) => string;
      /**
       * Function that applies CSS classes dynamically on rows.
       * @param {GridRowClassNameParams} params With all properties from [[GridRowClassNameParams]].
       * @returns {string} The CSS class to apply to the row.
       */
      getRowClassName?: (params: GridRowClassNameParams<R>) => string;
      /**
       * Function that sets the row height per row.
       * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
       * @returns {GridRowHeightReturnValue} The row height value. If `null` or `undefined` then the default row height is applied. If "auto" then the row height is calculated based on the content.
       */
      getRowHeight?: (params: GridRowHeightParams) => GridRowHeightReturnValue;
      /**
       * Function that returns the estimated height for a row.
       * Only works if dynamic row height is used.
       * Once the row height is measured this value is discarded.
       * @param {GridRowHeightParams} params With all properties from [[GridRowHeightParams]].
       * @returns {number | null} The estimated row height value. If `null` or `undefined` then the default row height, based on the density, is applied.
       */
      getEstimatedRowHeight?: (params: GridRowHeightParams) => number | null;
      /**
       * Function that allows to specify the spacing between rows.
       * @param {GridRowSpacingParams} params With all properties from [[GridRowSpacingParams]].
       * @returns {GridRowSpacing} The row spacing values.
       */
      getRowSpacing?: (params: GridRowSpacingParams) => GridRowSpacing;
      /**
       * Function that returns the element to render in row detail.
       * @param {GridRowParams} params With all properties from [[GridRowParams]].
       * @returns {React.JSX.Element} The row detail element.
       */
      getDetailPanelContent?: (params: GridRowParams<R>) => React_2.ReactNode;
      /**
       * Callback fired when a cell is rendered, returns true if the cell is editable.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @returns {boolean} A boolean indicating if the cell is editable.
       */
      isCellEditable?: (params: GridCellParams<any, R>) => boolean;
      /**
       * Determines if a row can be selected.
       * @param {GridRowParams} params With all properties from [[GridRowParams]].
       * @returns {boolean} A boolean indicating if the row is selectable.
       */
      isRowSelectable?: (params: GridRowParams<R>) => boolean;
      /**
       * Callback fired when the cell turns to edit mode.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
       */
      onCellEditStart?: GridEventListener<'cellEditStart'>;
      /**
       * Callback fired when the cell turns to view mode.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
       */
      onCellEditStop?: GridEventListener<'cellEditStop'>;
      /**
       * Callback fired when a data source request fails.
       * @param {GridGetRowsError | GridUpdateRowError} error The data source error object.
       */
      onDataSourceError?: (error: GridGetRowsError | GridUpdateRowError) => void;
      /**
       * Callback fired when the row turns to edit mode.
       * @param {GridRowParams} params With all properties from [[GridRowParams]].
       * @param {MuiEvent<React.KeyboardEvent | React.MouseEvent>} event The event that caused this prop to be called.
       */
      onRowEditStart?: GridEventListener<'rowEditStart'>;
      /**
       * Callback fired when the row turns to view mode.
       * @param {GridRowParams} params With all properties from [[GridRowParams]].
       * @param {MuiEvent<MuiBaseEvent>} event The event that caused this prop to be called.
       */
      onRowEditStop?: GridEventListener<'rowEditStop'>;
      /**
       * Callback fired when any cell is clicked.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onCellClick?: GridEventListener<'cellClick'>;
      /**
       * Callback fired when a double click event comes from a cell element.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onCellDoubleClick?: GridEventListener<'cellDoubleClick'>;
      /**
       * Callback fired when a keydown event comes from a cell element.
       * @param {GridCellParams} params With all properties from [[GridCellParams]].
       * @param {MuiEvent<React.KeyboardEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onCellKeyDown?: GridEventListener<'cellKeyDown'>;
      /**
       * Callback fired when a click event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderClick?: GridEventListener<'columnHeaderClick'>;
      /**
       * Callback fired when a contextmenu event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       */
      onColumnHeaderContextMenu?: GridEventListener<'columnHeaderContextMenu'>;
      /**
       * Callback fired when a double click event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderDoubleClick?: GridEventListener<'columnHeaderDoubleClick'>;
      /**
       * Callback fired when a mouseover event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderOver?: GridEventListener<'columnHeaderOver'>;
      /**
       * Callback fired when a mouseout event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderOut?: GridEventListener<'columnHeaderOut'>;
      /**
       * Callback fired when a mouse enter event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderEnter?: GridEventListener<'columnHeaderEnter'>;
      /**
       * Callback fired when a mouse leave event comes from a column header element.
       * @param {GridColumnHeaderParams} params With all properties from [[GridColumnHeaderParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnHeaderLeave?: GridEventListener<'columnHeaderLeave'>;
      /**
       * Callback fired when a column is reordered.
       * @param {GridColumnOrderChangeParams} params With all properties from [[GridColumnOrderChangeParams]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnOrderChange?: GridEventListener<'columnOrderChange'>;
      /**
       * Callback fired when the density changes.
       * @param {GridDensity} density New density value.
       */
      onDensityChange?: (density: GridDensity) => void;
      /**
       * Callback fired when a row is clicked.
       * Not called if the target clicked is an interactive element added by the built-in columns.
       * @param {GridRowParams} params With all properties from [[GridRowParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onRowClick?: GridEventListener<'rowClick'>;
      /**
       * Callback fired when a double click event comes from a row container element.
       * @param {GridRowParams} params With all properties from [[RowParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onRowDoubleClick?: GridEventListener<'rowDoubleClick'>;
      /**
       * Callback fired when the Data Grid is resized.
       * @param {ElementSize} containerSize With all properties from [[ElementSize]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onResize?: GridEventListener<'debouncedResize'>;
      /**
       * Callback fired when the state of the Data Grid is updated.
       * @param {GridState} state The new state.
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       * @ignore - do not document.
       */
      onStateChange?: GridEventListener<'stateChange'>;
      /**
       * The pagination model of type [[GridPaginationModel]] which refers to current `page` and `pageSize`.
       */
      paginationModel?: GridPaginationModel;
      /**
       * The extra information about the pagination state of the Data Grid.
       * Only applicable with `paginationMode="server"`.
       */
      paginationMeta?: GridPaginationMeta;
      /**
       * Callback fired when the pagination model has changed.
       * @param {GridPaginationModel} model Updated pagination model.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<'pagination'>) => void;
      /**
       * Callback fired when the row count has changed.
       * @param {number} count Updated row count.
       */
      onRowCountChange?: (count: number) => void;
      /**
       * Callback fired when the pagination meta has changed.
       * @param {GridPaginationMeta} paginationMeta Updated pagination meta.
       */
      onPaginationMetaChange?: (paginationMeta: GridPaginationMeta) => void;
      /**
       * Callback fired when the preferences panel is closed.
       * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onPreferencePanelClose?: GridEventListener<'preferencePanelClose'>;
      /**
       * Callback fired when the preferences panel is opened.
       * @param {GridPreferencePanelParams} params With all properties from [[GridPreferencePanelParams]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onPreferencePanelOpen?: GridEventListener<'preferencePanelOpen'>;
      /**
       * Callback fired when the menu is opened.
       * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onMenuOpen?: GridEventListener<'menuOpen'>;
      /**
       * Callback fired when the menu is closed.
       * @param {GridMenuParams} params With all properties from [[GridMenuParams]].
       * @param {MuiEvent<{}>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onMenuClose?: GridEventListener<'menuClose'>;
      /**
       * Controls the modes of the cells.
       */
      cellModesModel?: GridCellModesModel;
      /**
       * Callback fired when the `cellModesModel` prop changes.
       * @param {GridCellModesModel} cellModesModel Object containing which cells are in "edit" mode.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onCellModesModelChange?: (cellModesModel: GridCellModesModel, details: GridCallbackDetails) => void;
      /**
       * Controls the modes of the rows.
       */
      rowModesModel?: GridRowModesModel;
      /**
       * Callback fired when the `rowModesModel` prop changes.
       * @param {GridRowModesModel} rowModesModel Object containing which rows are in "edit" mode.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onRowModesModelChange?: (rowModesModel: GridRowModesModel, details: GridCallbackDetails) => void;
      /**
       * Set the filter model of the Data Grid.
       */
      filterModel?: GridFilterModel;
      /**
       * Callback fired when the Filter model changes before the filters are applied.
       * @param {GridFilterModel} model With all properties from [[GridFilterModel]].
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onFilterModelChange?: (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => void;
      /**
       * Sets the row selection model of the Data Grid.
       */
      rowSelectionModel?: GridRowSelectionModel;
      /**
       * Callback fired when the selection state of one or multiple rows changes.
       * @param {GridRowSelectionModel} rowSelectionModel With all the row ids [[GridSelectionModel]].
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onRowSelectionModelChange?: (rowSelectionModel: GridRowSelectionModel, details: GridCallbackDetails) => void;
      /**
       * Set the column visibility model of the Data Grid.
       * If defined, the Data Grid will ignore the `hide` property in [[GridColDef]].
       */
      columnVisibilityModel?: GridColumnVisibilityModel;
      /**
       * Callback fired when the column visibility model changes.
       * @param {GridColumnVisibilityModel} model The new model.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnVisibilityModelChange?: (model: GridColumnVisibilityModel, details: GridCallbackDetails) => void;
      /**
       * Set the sort model of the Data Grid.
       */
      sortModel?: GridSortModel;
      /**
       * Callback fired when the sort model changes before a column is sorted.
       * @param {GridSortModel} model With all properties from [[GridSortModel]].
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onSortModelChange?: (model: GridSortModel, details: GridCallbackDetails) => void;
      /**
       * The `aria-label` of the Data Grid.
       */
      'aria-label'?: string;
      /**
       * The `id` of the element containing a label for the Data Grid.
       */
      'aria-labelledby'?: string;
      /**
       * The label of the Data Grid.
       * If the `showToolbar` prop is `true`, the label will be displayed in the toolbar and applied to the `aria-label` attribute of the grid.
       * If the `showToolbar` prop is `false`, the label will not be visible but will be applied to the `aria-label` attribute of the grid.
       */
      label?: string;
      /**
       * Set of columns of type [[GridColDef]][].
       */
      columns: readonly GridColDef<R>[];
      /**
       * Return the id of a given [[GridRowModel]].
       * Ensure the reference of this prop is stable to avoid performance implications.
       * It could be done by either defining the prop outside of the component or by memoizing it.
       */
      getRowId?: GridRowIdGetter<R>;
      /**
       * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
       */
      nonce?: string;
      /**
       * The initial state of the DataGrid.
       * The data in it will be set in the state on initialization but will not be controlled.
       * If one of the data in `initialState` is also being controlled, then the control state wins.
       */
      initialState?: GridInitialStateCommunity;
      /**
       * Overridable components props dynamically passed to the component at rendering.
       */
      slotProps?: GridSlotsComponentsProps;
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx?: SxProps_2<Theme>;
      /**
       * Unstable features, breaking changes might be introduced.
       * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
       */
      experimentalFeatures?: Partial<GridExperimentalFeatures>;
      /**
       * Callback called before updating a row with new values in the row and cell editing.
       * @template R
       * @param {R} newRow Row object with the new values.
       * @param {R} oldRow Row object with the old values.
       * @param {{ rowId: GridRowId }} params Additional parameters.
       * @returns {Promise<R> | R} The final values to update the row.
       */
      processRowUpdate?: (newRow: R, oldRow: R, params: {
          rowId: GridRowId;
      }) => Promise<R> | R;
      /**
       * Callback called when `processRowUpdate()` throws an error or rejects.
       * @param {any} error The error thrown.
       */
      onProcessRowUpdateError?: (error: any) => void;
      columnGroupingModel?: GridColumnGroupingModel;
      /**
       * Sets the height in pixels of the column group headers in the Data Grid.
       * Inherits the `columnHeaderHeight` value if not set.
       */
      columnGroupHeaderHeight?: number;
      /**
       * Callback called when the data is copied to the clipboard.
       * @param {string} data The data copied to the clipboard.
       */
      onClipboardCopy?: GridEventListener<'clipboardCopy'>;
      /**
       * The options for autosize when user-initiated.
       */
      autosizeOptions?: GridAutosizeOptions;
      /**
       * Callback fired while a column is being resized.
       * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnResize?: GridEventListener<'columnResize'>;
      /**
       * Callback fired when the width of a column is changed.
       * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
       * @param {MuiEvent<React.MouseEvent>} event The event object.
       * @param {GridCallbackDetails} details Additional details for this callback.
       */
      onColumnWidthChange?: GridEventListener<'columnWidthChange'>;
  }
  
  interface DataGridProSharedPropsWithDefaultValue {
      /**
       * If `true`, the header filters feature is enabled.
       * @default false
       */
      headerFilters: boolean;
      /**
       * When `rowSelectionPropagation.descendants` is set to `true`.
       * - Selecting a parent selects all its filtered descendants automatically.
       * - Deselecting a parent row deselects all its filtered descendants automatically.
       *
       * When `rowSelectionPropagation.parents` is set to `true`
       * - Selecting all the filtered descendants of a parent selects the parent automatically.
       * - Deselecting a descendant of a selected parent deselects the parent automatically.
       *
       * Works with tree data and row grouping on the client-side only.
       * @default { parents: true, descendants: true }
       */
      rowSelectionPropagation: GridRowSelectionPropagation;
      /**
       * If `true`, displays the data in a list view.
       * Use in combination with `listViewColumn`.
       * @default false
       */
      listView: boolean;
      /**
       * If set to "always", the multi-sorting is applied without modifier key.
       * Otherwise, the modifier key is required for multi-sorting to be applied.
       * @see See https://mui.com/x/react-data-grid/sorting/#multi-sorting
       * @default "withModifierKey"
       */
      multipleColumnsSortingMode: 'withModifierKey' | 'always';
      /**
       * Sets the type of separator between pinned columns and non-pinned columns.
       * @default 'border-and-shadow'
       */
      pinnedColumnsSectionSeparator: 'border' | 'shadow' | 'border-and-shadow';
      /**
       * Sets the type of separator between pinned rows and non-pinned rows.
       * @default 'border-and-shadow'
       */
      pinnedRowsSectionSeparator: 'border' | 'border-and-shadow';
  }
  
  interface DataGridProSharedPropsWithoutDefaultValue<R extends GridValidRowModel = any> {
      /**
       * Override the height of the header filters.
       */
      headerFilterHeight?: number;
      /**
       * Definition of the column rendered when the `listView` prop is enabled.
       */
      listViewColumn?: GridListViewColDef<R>;
  }
  
  type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
  
  export const DEFAULT_GRID_AUTOSIZE_OPTIONS: {
      includeHeaders: boolean;
      includeOutliers: boolean;
      outliersFactor: number;
      expand: boolean;
      disableColumnVirtualization: boolean;
  };
  
  export const DEFAULT_GRID_COL_TYPE_KEY = "string";
  
  export interface DetailPanelsPropsOverrides {}
  
  type DividerProps = {
      className?: string;
      orientation?: 'horizontal' | 'vertical';
  };
  
  /**
   * The size of a container.
   */
  export interface ElementSize {
      /**
       * The height of a container or HTMLElement.
       */
      height: number;
      /**
       * The width of a container or HTMLElement.
       */
      width: number;
  }
  
  interface ElementSlotProps {
      bottomContainer: GridBottomContainerProps & BottomContainerPropsOverrides;
      cell: GridCellProps & CellPropsOverrides;
      columnHeaders: GridColumnHeadersProps;
      columnHeaderFilterIconButton: ColumnHeaderFilterIconButtonProps & ColumnHeaderFilterIconButtonPropsOverrides;
      columnHeaderSortIcon: GridColumnHeaderSortIconProps & ColumnHeaderSortIconPropsOverrides;
      columnMenu: GridColumnMenuProps & ColumnMenuPropsOverrides;
      columnsPanel: GridColumnsPanelProps & ColumnsPanelPropsOverrides;
      columnsManagement: GridColumnsManagementProps & ColumnsManagementPropsOverrides;
      detailPanels: GridDetailPanelsProps & DetailPanelsPropsOverrides;
      filterPanel: GridFilterPanelProps & FilterPanelPropsOverrides;
      footer: GridFooterContainerProps & FooterPropsOverrides;
      footerRowCount: GridRowCountProps & FooterRowCountOverrides;
      loadingOverlay: GridLoadingOverlayProps & LoadingOverlayPropsOverrides;
      noResultsOverlay: GridOverlayProps & NoResultsOverlayPropsOverrides;
      noRowsOverlay: GridOverlayProps & NoRowsOverlayPropsOverrides;
      noColumnsOverlay: GridOverlayProps & NoColumnsOverlayPropsOverrides;
      pagination: PaginationPropsOverrides;
      panel: GridPanelProps & PanelPropsOverrides;
      pinnedRows: GridPinnedRowsProps & PinnedRowsPropsOverrides;
      row: GridRowProps & RowPropsOverrides;
      skeletonCell: GridSkeletonCellProps & SkeletonCellPropsOverrides;
      toolbar: GridToolbarProps & ToolbarPropsOverrides;
      /**
       * Props passed to the `.main` (role="grid") element.
       */
      main: MainProps;
      /**
       * Props passed to the `.root` element.
       */
      root: RootProps;
  }
  
  export const EMPTY_PINNED_COLUMN_FIELDS: {
      left: never[];
      right: never[];
  };
  
  export { EMPTY_RENDER_CONTEXT }
  
  type EmptyEntry<TValue> = {
      key: '';
      value: TValue;
  };
  
  type Entry = {
      key: string;
      value: unknown;
  };
  
  /**
   * A button that triggers a CSV export.
   * It renders the `baseButton` slot.
   *
   * Demos:
   *
   * - [Export](https://mui.com/x/react-data-grid/components/export/)
   *
   * API:
   *
   * - [ExportCsv API](https://mui.com/x/api/data-grid/export-csv/)
   */
  export const ExportCsv: React_2.ForwardRefExoticComponent<ExportCsvProps> | React_2.ForwardRefExoticComponent<Omit<ExportCsvProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
  export type ExportCsvProps = GridSlotProps['baseButton'] & {
      /**
       * A function to customize rendering of the component.
       */
      render?: RenderProp<GridSlotProps['baseButton']>;
      /**
       * The options to apply on the CSV export.
       * @demos
       *   - [CSV export](/x/react-data-grid/export/#csv-export)
       */
      options?: GridCsvExportOptions;
  };
  
  /**
   * A button that triggers a print export.
   * It renders the `baseButton` slot.
   *
   * Demos:
   *
   * - [Export](https://mui.com/x/react-data-grid/components/export/)
   *
   * API:
   *
   * - [ExportPrint API](https://mui.com/x/api/data-grid/export-print/)
   */
  export const ExportPrint: React_2.ForwardRefExoticComponent<ExportPrintProps> | React_2.ForwardRefExoticComponent<Omit<ExportPrintProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
  export type ExportPrintProps = GridSlotProps['baseButton'] & {
      /**
       * A function to customize rendering of the component.
       */
      render?: RenderProp<GridSlotProps['baseButton']>;
      /**
       * The options to apply on the Print export.
       * @demos
       *   - [Print export](/x/react-data-grid/export/#print-export)
       */
      options?: GridPrintExportOptions;
  };
  
  export interface FilterColumnsArgs {
      field: GridColDef['field'];
      columns: GridStateColDef[];
      currentFilters: GridFilterItem[];
  }
  
  export interface FilterPanelPropsOverrides {}
  
  export interface FilterPanelState {
      /**
       * If `true`, the filter panel is open.
       */
      open: boolean;
      /**
       * The number of active filters.
       */
      filterCount: number;
  }
  
  /**
   * A button that opens and closes the filter panel.
   * It renders the `baseButton` slot.
   *
   * Demos:
   *
   * - [Filter Panel](https://mui.com/x/react-data-grid/components/filter-panel/)
   *
   * API:
   *
   * - [FilterPanelTrigger API](https://mui.com/x/api/data-grid/filter-panel-trigger/)
   */
  export const FilterPanelTrigger: React_2.ForwardRefExoticComponent<FilterPanelTriggerProps> | React_2.ForwardRefExoticComponent<Omit<FilterPanelTriggerProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
  export type FilterPanelTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
      /**
       * A function to customize rendering of the component.
       */
      render?: RenderProp<GridSlotProps['baseButton'], FilterPanelState>;
      /**
       * A function to customize rendering of the component.
       */
      className?: string | ((state: FilterPanelState) => string);
  };
  
  type FilterValueGetterFn = (row: GridRowModel, colDef: GridColDef) => any;
  
  export interface FocusElement {
      focus(): void;
  }
  
  export interface FooterPropsOverrides {}
  
  export interface FooterRowCountOverrides {}
  
  export type GetApplyFilterFn<R extends GridValidRowModel = any, V = any, F = V> = (filterItem: GridFilterItem, column: GridColDef<R, V, F>) => null | ApplyFilterFn<R, V, F>;
  
  export type GetApplyQuickFilterFn<R extends GridValidRowModel = GridValidRowModel, V = any> = (value: any, colDef: GridStateColDef<R, V>, apiRef: RefObject<GridApiCommunity>) => null | GridApplyQuickFilter<R, V>;
  
  /**
   * Get the cell aggregation result
   * @param {GridRowId} id The row id
   * @param {string} field The field
   * @returns { { position: 'footer' | 'inline'; value: any } | null } The cell aggregation result
   */
  type GetCellAggregationResultFn = (id: GridRowId, field: string) => {
      position: 'footer' | 'inline';
      value: any;
      formattedValue?: any;
  } | null;
  
  export interface GetColumnForNewFilterArgs {
      currentFilters: GridFilterItem[];
      columns: GridStateColDef[];
  }
  
  export function getDataGridUtilityClass(slot: string): string;
  
  export const getDefaultGridFilterModel: () => GridFilterModel;
  
  export const getGridBooleanOperators: () => GridFilterOperator<any, boolean | null, any>[];
  
  export const getGridDateOperators: (showTime?: boolean) => GridFilterOperator<any, Date, any, GridFilterInputDateProps>[];
  
  export const getGridDefaultColumnTypes: () => GridColumnTypesRecord;
  
  export const getGridNumericOperators: () => GridFilterOperator<any, number | string | null, any, GridFilterInputValueProps & {
      type?: "number";
  }>[];
  
  export const getGridNumericQuickFilterFn: GetApplyQuickFilterFn<any, number | string | null>;
  
  export const getGridSingleSelectOperators: () => GridFilterOperator[];
  
  export const getGridStringOperators: (disableTrim?: boolean) => GridFilterOperator<any, number | string | null, any>[];
  
  export const getGridStringQuickFilterFn: GetApplyQuickFilterFn<any, unknown>;
  
  type GetPublicApiType<PrivateApi> = PrivateApi extends {
      getPublicApi: () => infer PublicApi;
  } ? PublicApi : never;
  
  /**
   * Get the ARIA attributes for a row
   * @param {GridTreeNode} rowNode The row node
   * @param {number} index The position index of the row
   * @returns {React.HTMLAttributes<HTMLElement>} The ARIA attributes
   */
  type GetRowAriaAttributesFn = (rowNode: GridTreeNode, index: number) => React_2.HTMLAttributes<HTMLElement>;
  
  export const GRID_ACTIONS_COL_DEF: GridColTypeDef;
  
  export const GRID_ACTIONS_COLUMN_TYPE = "actions";
  
  export const GRID_BOOLEAN_COL_DEF: GridColTypeDef<boolean | null, any>;
  
  export const GRID_CHECKBOX_SELECTION_COL_DEF: GridColDef;
  
  export const GRID_CHECKBOX_SELECTION_FIELD = "__check__";
  
  export const GRID_COLUMN_MENU_SLOT_PROPS: {
      columnMenuSortItem: {
          displayOrder: number;
      };
      columnMenuFilterItem: {
          displayOrder: number;
      };
      columnMenuColumnsItem: {
          displayOrder: number;
      };
  };
  
  export const GRID_COLUMN_MENU_SLOTS: {
      columnMenuSortItem: typeof GridColumnMenuSortItem;
      columnMenuFilterItem: typeof GridColumnMenuFilterItem;
      columnMenuColumnsItem: typeof GridColumnMenuColumnsItem;
  };
  
  export const GRID_DATE_COL_DEF: GridColTypeDef<Date, string>;
  
  export const GRID_DATETIME_COL_DEF: GridColTypeDef<Date, string>;
  
  export const GRID_DEFAULT_LOCALE_TEXT: GridLocaleText;
  
  export const GRID_EXPERIMENTAL_ENABLED = false;
  
  export const GRID_NUMERIC_COL_DEF: GridColTypeDef<number | string | null, string>;
  
  export const GRID_ROOT_GROUP_ID: GridRowId;
  
  export const GRID_SINGLE_SELECT_COL_DEF: Omit<GridSingleSelectColDef, 'field'>;
  
  /**
   * TODO: Move pro and premium properties outside of this Community file
   */
  export const GRID_STRING_COL_DEF: GridColTypeDef<any, any>;
  
  export function GridActionsCell(props: GridActionsCellProps): React_2.JSX.Element;
  
  export namespace GridActionsCell {
      var propTypes: any;
  }
  
  export const GridActionsCellItem: React_2.ForwardRefExoticComponent<GridActionsCellItemProps> | React_2.ForwardRefExoticComponent<((GridActionsCellItemCommonProps & {
      showInMenu: true;
      /**
       * If false, the menu will not close when this item is clicked.
       * @default true
       */
      closeMenuOnClick?: boolean;
      closeMenu?: () => void;
      label: React_2.ReactNode;
  } & Omit<React_2.DOMAttributes<HTMLElement> & {
      [k: `aria-${string}`]: any;
      [k: `data-${string}`]: any;
      className?: string;
      style?: React_2.CSSProperties;
  } & {
      autoFocus?: boolean;
      children?: React_2.ReactNode;
      inert?: boolean;
      disabled?: boolean;
      iconStart?: React_2.ReactNode;
      iconEnd?: React_2.ReactNode;
      selected?: boolean;
      value?: number | string | readonly string[];
      style?: React_2.CSSProperties;
  } & BaseMenuItemPropsOverrides_2, "component">) | Omit<GridActionsCellItemCommonProps & {
      showInMenu?: false;
      icon: React_2.ReactElement<any>;
      label: string;
  } & Omit<Omit<ButtonProps, "startIcon"> & {
      label?: string;
      color?: "default" | "inherit" | "primary";
      edge?: "start" | "end" | false;
  } & BaseIconButtonPropsOverrides_2, "component">, "ref">) & React_2.RefAttributes<HTMLElement>>;
  
  interface GridActionsCellItemCommonProps {
      icon?: React_2.JSXElementConstructor<GridBaseIconProps> | React_2.ReactNode;
      /** from https://mui.com/material-ui/api/button-base/#ButtonBase-prop-component */
      component?: React_2.ElementType;
  }
  
  export type GridActionsCellItemProps = GridActionsCellItemCommonProps & (({
      showInMenu?: false;
      icon: React_2.ReactElement<any>;
      label: string;
  } & Omit<GridSlotProps['baseIconButton'], 'component'>) | ({
      showInMenu: true;
      /**
       * If false, the menu will not close when this item is clicked.
       * @default true
       */
      closeMenuOnClick?: boolean;
      closeMenu?: () => void;
      label: React_2.ReactNode;
  } & Omit<GridSlotProps['baseMenuItem'], 'component'>));
  
  interface GridActionsCellProps extends Omit<GridRenderCellParams, 'api'> {
      api?: GridRenderCellParams['api'];
      position?: GridMenuProps['position'];
  }
  
  /**
   * Column Definition interface used for columns with the `actions` type.
   * @demos
   *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
   */
  export interface GridActionsColDef<R extends GridValidRowModel = any, V = any, F = V> extends GridBaseColDef<R, V, F> {
      /**
       * The type of the column.
       * @default 'actions'
       */
      type: 'actions';
      /**
       * Function that returns the actions to be shown.
       * @param {GridRowParams} params The params for each row.
       * @returns {readonly React.ReactElement<GridActionsCellItemProps>[]} An array of [[GridActionsCell]] elements.
       */
      getActions: (params: GridRowParams<R>) => readonly React_2.ReactElement<GridActionsCellItemProps>[];
  }
  
  export const GridAddIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * @param {GridValidRowModel} row The model of the row we want to filter.
   * @param {(filterItem: GridFilterItem) => boolean} shouldApplyItem An optional callback to allow the filtering engine to only apply some items.
   * @param {GridAggregatedFilterItemApplierResult} result The previous result of the filtering engine.
   */
  type GridAggregatedFilterItemApplier = (row: GridValidRowModel, shouldApplyItem: ((field: string) => boolean) | undefined, result: GridAggregatedFilterItemApplierResult) => void;
  
  interface GridAggregatedFilterItemApplierResult {
      passingFilterItems: null | GridFilterItemResult;
      passingQuickFilterValues: null | GridQuickFilterValueResult;
  }
  
  interface GridAggregationInternalHooks<Api, Props> {
      useCellAggregationResult: GetCellAggregationResultFn;
      useFilterValueGetter: (apiRef: RefObject<Api>, props: Props) => FilterValueGetterFn;
  }
  
  /**
   * Alignment used in position elements in Cells.
   */
  export type GridAlignment = 'left' | 'right' | 'center';
  
  /**
   * The full grid API.
   * @demos
   *   - [API object](/x/react-data-grid/api-object/)
   */
  export type GridApi = GridApiCommunity;
  
  interface GridApiCaches {
      columns: {
          lastColumnsProp: readonly GridColDef[];
      };
      columnGrouping: GridColumnGroupingInternalCache;
      rows: GridRowsInternalCache;
      rowsMeta: GridRowsMetaInternalCache;
  }
  
  export interface GridApiCommon<GridState extends GridStateCommunity = GridStateCommunity, GridInitialState extends GridInitialStateCommunity = GridInitialStateCommunity> extends GridCoreApi, GridPipeProcessingApi, GridDensityApi, GridDimensionsApi, GridRowApi, GridRowsMetaApi, GridEditingApi, GridParamsApi, GridColumnApi, GridRowSelectionApi, GridSortApi, GridPaginationApi, GridCsvExportApi, GridFocusApi, GridFilterApi, GridColumnMenuApi, GridPreferencesPanelApi, GridPrintExportApi, GridVirtualizationApi, GridLocaleTextApi, GridScrollApi, GridColumnSpanningApi, GridStateApi<GridState>, GridStatePersistenceApi<GridInitialState>, GridColumnGroupingApi, GridHeaderFilteringApi, GridColumnResizeApi {}
  
  /**
   * The API of the community version of the Data Grid.
   */
  interface GridApiCommunity extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity>, GridDataSourceApi {}
  
  export const GridApiContext: React_2.Context<unknown>;
  
  type GridApplyQuickFilter<R extends GridValidRowModel = GridValidRowModel, V = any> = (value: V, row: R, column: GridColDef, apiRef: RefObject<GridApiCommunity>) => boolean;
  
  interface GridAriaAttributesInternalHook {
      useGridAriaAttributes: () => React_2.HTMLAttributes<HTMLElement>;
  }
  
  export const GridArrowDownwardIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridArrowUpwardIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export interface GridAutoGeneratedGroupNode extends GridBasicGroupNode {
      /**
       * If `true`, this node has been automatically generated by the grid.
       * In the row grouping, all groups are auto-generated
       * In the tree data, some groups can be passed in the rows
       */
      isAutoGenerated: true;
  }
  
  export interface GridAutoGeneratedPinnedRowNode extends GridBasicPinnedRowNode {
      /**
       * If `true`, this node has been automatically generated by the grid.
       */
      isAutoGenerated: false;
  }
  
  export type GridAutosizeOptions = {
      /**
       * The columns to autosize. By default, applies to all columns.
       */
      columns?: GridColDef['field'][];
      /**
       * If true, include the header widths in the calculation.
       * @default false
       */
      includeHeaders?: boolean;
      /**
       * If true, width outliers will be ignored.
       * @default false
       */
      includeOutliers?: boolean;
      /**
       * The IQR factor range to detect outliers.
       * @default 1.5
       */
      outliersFactor?: number;
      /**
       * If the total width is less than the available width, expand columns to fill it.
       * @default false
       */
      expand?: boolean;
      /**
       * If false, column virtualization is not disabled while resizing.
       * @default true
       */
      disableColumnVirtualization?: boolean;
  };
  
  /**
   * Column Definition base interface.
   */
  interface GridBaseColDef<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> {
      /**
       * The unique identifier of the column. Used to map with [[GridRowModel]] values.
       */
      field: string;
      /**
       * The title displayed in the column header cell.
       */
      headerName?: string;
      /**
       * The tooltip text shown when the column header name is truncated.
       */
      description?: string;
      /**
       * The width of the column in pixels.
       * @default 100
       */
      width?: number;
      /**
       * The flex grow factor of the column. Must be a positive number.
       */
      flex?: number;
      /**
       * The minimum width of the column in pixels.
       * @default 50
       */
      minWidth?: number;
      /**
       * The maximum width of the column in pixels.
       * @default Infinity
       */
      maxWidth?: number;
      /**
       * If `false`, removes the option to hide this column.
       * @default true
       */
      hideable?: boolean;
      /**
       * If `false`, disables sorting for this column.
       * @default true
       */
      sortable?: boolean;
      /**
       * The order of the sorting sequence.
       */
      sortingOrder?: readonly GridSortDirection[];
      /**
       * If `false`, disables resizing for this column.
       * @default true
       */
      resizable?: boolean;
      /**
       * If `true`, the cells of the column are editable.
       * @default false
       */
      editable?: boolean;
      /**
       * If `true`, the rows can be grouped based on this column values (pro-plan only).
       * Only available in DataGridPremium.
       * TODO: Use module augmentation to move it to `@mui/x-data-grid-premium` (need to modify how we handle column types default values).
       * @default true
       */
      groupable?: boolean;
      /**
       * If `false`, the menu items for column pinning menu will not be rendered.
       * Only available in DataGridPro.
       * TODO: Use module augmentation to move it to `@mui/x-data-grid-pro` (need to modify how we handle column types default values).
       * @default true
       */
      pinnable?: boolean;
      /**
       * A comparator function used to sort rows.
       */
      sortComparator?: GridComparatorFn<V>;
      /**
       * Provide an alternative comparator function for sorting.
       * Takes precedence over `sortComparator`.
       * @param {GridSortDirection} sortDirection The direction of the sort.
       * @returns {GridComparatorFn<V>} The comparator function to use.
       */
      getSortComparator?: (sortDirection: GridSortDirection) => GridComparatorFn<V> | undefined;
      /**
       * The type of the column.
       * @default 'string'
       * @see See {@link https://mui.com/x/react-data-grid/column-definition/#column-types column types docs} for more details.
       */
      type?: GridColType;
      /**
       * Align cell content.
       */
      align?: GridAlignment;
      /**
       * Function that returns specific data to render in the cell instead of using the field value.
       */
      valueGetter?: GridValueGetter<R, V, F>;
      /**
       * Function that returns a specific value to be used in row spanning.
       */
      rowSpanValueGetter?: GridValueGetter<R, V, F>;
      /**
       * Function that customizes how the entered value is stored in the row.
       * Only works with cell/row editing.
       * @returns {R} The row with the updated field.
       */
      valueSetter?: GridValueSetter<R, V, F>;
      /**
       * Formats the cell value before rendering.
       */
      valueFormatter?: GridValueFormatter<R, V, F>;
      /**
       * Function that takes the user-entered value and converts it to a value used internally.
       * @returns {V} The converted value to use internally.
       */
      valueParser?: GridValueParser<R, V, F>;
      /**
       * Class name added to cells in this column.
       */
      cellClassName?: GridCellClassNamePropType<R, V>;
      /**
       * Display mode for the cell:
       *  - 'text': For text-based cells (default)
       *  - 'flex': For cells with HTMLElement children
       */
      display?: 'text' | 'flex';
      /**
       * Override the component rendered as cell for this column.
       * @template R, V, F
       * @param {GridRenderCellParams<R, V, F>} params Object containing parameters for the renderer.
       * @returns {React.ReactNode} The element to be rendered.
       */
      renderCell?: (params: GridRenderCellParams<R, V, F>) => React_2.ReactNode;
      /**
       * Override the component rendered in edit cell mode for this column.
       * @param {GridRenderEditCellParams} params Object containing parameters for the renderer.
       * @returns {React.ReactNode} The element to be rendered.
       */
      renderEditCell?: (params: GridRenderEditCellParams<R, V, F>) => React_2.ReactNode;
      /**
       * Callback fired when the edit props of the cell changes.
       * Processes the props before being saved into the state.
       * @param {GridPreProcessEditCellProps} params Object containing parameters of the cell being edited.
       * @returns {GridEditCellProps | Promise<GridEditCellProps>} The new edit cell props.
       */
      preProcessEditCellProps?: (params: GridPreProcessEditCellProps) => GridEditCellProps | Promise<GridEditCellProps>;
      /**
       * Class name added to the column header cell.
       */
      headerClassName?: GridColumnHeaderClassNamePropType;
      /**
       * Override the component rendered in the column header cell.
       * @template R, V, F
       * @param {GridColumnHeaderParams<R, V, F>} params Object containing parameters for the renderer.
       * @returns {React.ReactNode} The element to be rendered.
       */
      renderHeader?: (params: GridColumnHeaderParams<R, V, F>) => React_2.ReactNode;
      /**
       * Align column header content.
       */
      headerAlign?: GridAlignment;
      /**
       * Toggle the visibility of the sort icons.
       * @default false
       */
      hideSortIcons?: boolean;
      /**
       * If `true`, the column menu is disabled for this column.
       * @default false
       */
      disableColumnMenu?: boolean;
      /**
       * If `true`, the column is filterable.
       * @default true
       */
      filterable?: boolean;
      /**
       * Allows setting the filter operators for this column.
       */
      filterOperators?: readonly GridFilterOperator<R, V, F, any>[];
      /**
       * The callback that generates a filtering function for a given quick filter value.
       * This function can return `null` to skip filtering for this value and column.
       * @param {any} value The value with which we want to filter the column.
       * @param {GridStateColDef} colDef The column from which we want to filter the rows.
       * @param {RefObject<GridApiCommunity>} apiRef Deprecated: The API of the grid.
       * @returns {null | GridApplyQuickFilter} The function to call to check if a row pass this filter value or not.
       */
      getApplyQuickFilterFn?: GetApplyQuickFilterFn<R, V>;
      /**
       * If `true`, this column cannot be reordered.
       * @default false
       */
      disableReorder?: boolean;
      /**
       * If `true`, this column will not be included in exports.
       * @default false
       */
      disableExport?: boolean;
      /**
       * Number of columns a cell should span.
       * @default 1
       */
      colSpan?: number | GridColSpanFn<R, V, F>;
      /**
       * Example values that can be used by the grid to get more context about the column.
       */
      examples?: V[];
  }
  
  export type GridBaseIconProps = IconProps & BaseIconPropsOverrides;
  
  interface GridBaseSlots {
      /**
       * The custom Autocomplete component used in the grid for both header and cells.
       * @default Autocomplete
       */
      baseAutocomplete: React_2.JSXElementConstructor<GridSlotProps['baseAutocomplete']>;
      /**
       * The custom Badge component used in the grid for both header and cells.
       * @default Badge
       */
      baseBadge: React_2.JSXElementConstructor<GridSlotProps['baseBadge']>;
      /**
       * The custom Checkbox component used in the grid for both header and cells.
       * @default Checkbox
       */
      baseCheckbox: React_2.JSXElementConstructor<GridSlotProps['baseCheckbox']>;
      /**
       * The custom Chip component used in the grid.
       * @default Chip
       */
      baseChip: React_2.JSXElementConstructor<GridSlotProps['baseChip']>;
      /**
       * The custom CircularProgress component used in the grid.
       * @default CircularProgress
       */
      baseCircularProgress: React_2.JSXElementConstructor<GridSlotProps['baseCircularProgress']>;
      /**
       * The custom Divider component used in the grid.
       * @default Divider
       */
      baseDivider: React_2.JSXElementConstructor<GridSlotProps['baseDivider']>;
      /**
       * The custom LinearProgress component used in the grid.
       * @default LinearProgress
       */
      baseLinearProgress: React_2.JSXElementConstructor<GridSlotProps['baseLinearProgress']>;
      /**
       * The custom MenuList component used in the grid.
       * @default MenuList
       */
      baseMenuList: React_2.JSXElementConstructor<GridSlotProps['baseMenuList']>;
      /**
       * The custom MenuItem component used in the grid.
       * @default MenuItem
       */
      baseMenuItem: React_2.JSXElementConstructor<GridSlotProps['baseMenuItem']>;
      /**
       * The custom TextField component used in the grid.
       * @default TextField
       */
      baseTextField: React_2.JSXElementConstructor<GridSlotProps['baseTextField']>;
      /**
       * The custom Select component used in the grid.
       * @default Select
       */
      baseSelect: React_2.JSXElementConstructor<GridSlotProps['baseSelect']>;
      /**
       * The custom Button component used in the grid.
       * @default Button
       */
      baseButton: React_2.JSXElementConstructor<GridSlotProps['baseButton']>;
      /**
       * The custom IconButton component used in the grid.
       * @default IconButton
       */
      baseIconButton: React_2.JSXElementConstructor<GridSlotProps['baseIconButton']>;
      /**
       * The custom Input component used in the grid.
       * @default Input
       */
      baseInput: React_2.JSXElementConstructor<GridSlotProps['baseInput']>;
      /**
       * The custom ToggleButton component used in the grid.
       * @default ToggleButton
       */
      baseToggleButton: React_2.JSXElementConstructor<GridSlotProps['baseToggleButton']>;
      /**
       * The custom Tooltip component used in the grid.
       * @default Tooltip
       */
      baseTooltip: React_2.JSXElementConstructor<GridSlotProps['baseTooltip']>;
      /**
       * The custom Pagination component used in the grid.
       * @default Pagination
       */
      basePagination: React_2.JSXElementConstructor<GridSlotProps['basePagination']>;
      /**
       * The custom Popper component used in the grid.
       * @default Popper
       */
      basePopper: React_2.JSXElementConstructor<GridSlotProps['basePopper']>;
      /**
       * The custom SelectOption component used in the grid.
       * @default SelectOption
       */
      baseSelectOption: React_2.JSXElementConstructor<GridSlotProps['baseSelectOption']>;
      /**
       * The custom Skeleton component used in the grid.
       * @default Skeleton
       */
      baseSkeleton: React_2.JSXElementConstructor<GridSlotProps['baseSkeleton']>;
      /**
       * The custom Switch component used in the grid.
       * @default Switch
       */
      baseSwitch: React_2.JSXElementConstructor<GridSlotProps['baseSwitch']>;
      /**
       * The custom Tabs component used in the grid.
       * @default Tabs
       */
      baseTabs: React_2.JSXElementConstructor<GridSlotProps['baseTabs']>;
  }
  
  export interface GridBasicGroupNode extends GridTreeBasicNode {
      type: 'group';
      /**
       * The key used to group the children of this row.
       */
      groupingKey: GridKeyValue | null;
      /**
       * The field used to group the children of this row.
       * Is `null` if no field has been used to group the children of this row.
       */
      groupingField: string | null;
      /**
       * The id of the body children nodes.
       * Only contains the children of type "group" and "leaf".
       */
      children: GridRowId[];
      /**
       * The id of the footer child node.
       */
      footerId?: GridRowId | null;
      /**
       * The id of the children nodes, grouped by grouping field and grouping key.
       * Only contains the children of type "group" and "leaf".
       * Empty for flat tree.
       */
      childrenFromPath: GridChildrenFromPathLookup;
      /**
       * If `true`, the children of this group are not visible.
       * @default false
       */
      childrenExpanded?: boolean;
      /**
       * The id of the group containing this node (null for the root group).
       */
      parent: GridRowId | null;
      /**
       * If `true`, this row is pinned.
       * @default false
       */
      isPinned?: boolean;
  }
  
  interface GridBasicPinnedRowNode extends GridTreeBasicNode {
      type: 'pinnedRow';
      /**
       * The id of the group containing this node.
       * Is always equal to `GRID_ROOT_GROUP_ID`.
       */
      parent: GridRowId;
  }
  
  export function GridBody(props: GridVirtualScrollerProps): React_2.JSX.Element;
  
  export const GridBooleanCell: React_2.MemoExoticComponent<typeof GridBooleanCellRaw>;
  
  interface GridBooleanCellProps extends GridRenderCellParams {
      hideDescendantCount?: boolean;
  }
  
  function GridBooleanCellRaw(props: GridBooleanCellProps): React_2.JSX.Element | null;
  
  namespace GridBooleanCellRaw {
      var propTypes: any;
  }
  
  type GridBottomContainerProps = React_2.PropsWithChildren;
  
  /**
   * Additional details passed to the callbacks
   */
  export interface GridCallbackDetails<K extends keyof GridControlledStateReasonLookup = any> {
      /**
       * The reason for this callback to have been called.
       */
      reason?: GridControlledStateReasonLookup[K];
      /**
       * GridApi that let you manipulate the grid.
       */
      api: GridApiCommon;
  }
  
  export const GridCell: React_2.ForwardRefExoticComponent<GridCellProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      [x: `data-${string}`]: string;
      align: GridAlignment;
      className?: string;
      colIndex: number;
      column: GridStateColDef;
      row: GridRowModel;
      rowId: GridRowId;
      rowNode: GridTreeNode;
      width: number;
      colSpan?: number;
      disableDragEvents?: boolean;
      isNotVisible: boolean;
      pinnedOffset?: number;
      pinnedPosition: PinnedColumnPosition;
      showRightBorder: boolean;
      showLeftBorder: boolean;
      onClick?: React_2.MouseEventHandler<HTMLDivElement>;
      onDoubleClick?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseEnter?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseDown?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseLeave?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseUp?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseOver?: React_2.MouseEventHandler<HTMLDivElement>;
      onKeyUp?: React_2.KeyboardEventHandler<HTMLDivElement>;
      onKeyDown?: React_2.KeyboardEventHandler<HTMLDivElement>;
      onDragEnter?: React_2.DragEventHandler<HTMLDivElement>;
      onDragOver?: React_2.DragEventHandler<HTMLDivElement>;
      onFocus?: React_2.FocusEventHandler<Element>;
      children?: React_2.ReactNode;
      style?: React_2.CSSProperties;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export const GridCellCheckboxForwardRef: React_2.ForwardRefExoticComponent<GridRenderCellParams<any, any, any, GridTreeNodeWithRender_2>> | React_2.ForwardRefExoticComponent<GridRenderCellParams<any, any, any, GridTreeNodeWithRender_2> & React_2.RefAttributes<HTMLInputElement>>;
  
  export const GridCellCheckboxRenderer: React_2.ForwardRefExoticComponent<GridRenderCellParams<any, any, any, GridTreeNodeWithRender_2>> | React_2.ForwardRefExoticComponent<GridRenderCellParams<any, any, any, GridTreeNodeWithRender_2> & React_2.RefAttributes<HTMLInputElement>>;
  
  /**
   * A function used to process cellClassName params.
   * @param {GridCellParams<R, V>} params The parameters of the cell.
   * @returns {string} The class name to be added to the cell.
   */
  export type GridCellClassFn<R extends GridValidRowModel = any, V = unknown> = (params: GridCellParams<R, V>) => string;
  
  /**
   * The union type representing the [[GridColDef]] cell class type.
   */
  export type GridCellClassNamePropType<R extends GridValidRowModel = any, V = unknown> = string | GridCellClassFn<R, V>;
  
  type GridCellColSpanInfo = {
      spannedByColSpan: true;
      rightVisibleCellIndex: GridColumnIndex;
      leftVisibleCellIndex: GridColumnIndex;
  } | {
      spannedByColSpan: false;
      cellProps: {
          colSpan: number;
          width: number;
      };
  };
  
  /**
   * The coordinates of a cell represented by their row ID and column field.
   */
  export interface GridCellCoordinates {
      id: GridRowId;
      field: GridColDef['field'];
  }
  
  /**
   * The cell editing API interface.
   */
  interface GridCellEditingApi extends GridEditingSharedApi {
      /**
       * Gets the mode of a cell.
       * @param {GridRowId} id The id of the row.
       * @param {string} field The field to get the mode.
       * @returns {GridCellMode} Returns `"edit"` or `"view"`.
       */
      getCellMode: (id: GridRowId, field: string) => GridCellMode;
      /**
       * Puts the cell corresponding to the given row id and field into edit mode.
       * @param {GridStartCellEditModeParams} params The row id and field of the cell to edit.
       */
      startCellEditMode(params: GridStartCellEditModeParams): void;
      /**
       * Puts the cell corresponding to the given row id and field into view mode and updates the original row with the new value stored.
       * If `params.ignoreModifications` is `true` it will discard the modifications made.
       * @param {GridStopCellEditModeParams} params The row id and field of the cell to stop editing.
       */
      stopCellEditMode(params: GridStopCellEditModeParams): void;
  }
  
  interface GridCellEditingPrivateApi extends GridEditingSharedPrivateApi {
      /**
       * Updates the value of a cell being edited.
       * Don't call this method directly, prefer `setEditCellValue`.
       * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
       * @returns {Promise<boolean>} Resolves with `true` when the new value is valid.
       */
      setCellEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
      /**
       * Returns the row with the new value that was set by editing the cell.
       * @param {GridRowId} id The row id being edited.
       * @param {string} field The field being edited.
       * @returns {GridRowModel} The data model of the row.
       */
      getRowWithUpdatedValuesFromCellEditing: (id: GridRowId, field: string) => GridRowModel;
  }
  
  /**
   * Params passed to the `cellEditStart` event.
   */
  export interface GridCellEditStartParams<R extends GridValidRowModel = any, V = any, F = V> extends GridCellParams<R, V, F> {
      /**
       * The reason for this event to be triggered.
       */
      reason?: GridCellEditStartReasons;
      /**
       * If the reason is related to a keyboard event, it contains which key was pressed.
       * @deprecated No longer needed.
       */
      key?: string;
  }
  
  export enum GridCellEditStartReasons {
      enterKeyDown = "enterKeyDown",
      cellDoubleClick = "cellDoubleClick",
      printableKeyDown = "printableKeyDown",
      deleteKeyDown = "deleteKeyDown",
      pasteKeyDown = "pasteKeyDown",
  }
  
  /**
   * Params passed to the `cellEditStop event.
   */
  export interface GridCellEditStopParams<R extends GridValidRowModel = any, V = any, F = V> extends GridCellParams<R, V, F> {
      /**
       * The reason for this event to be triggered.
       */
      reason?: GridCellEditStopReasons;
  }
  
  export enum GridCellEditStopReasons {
      cellFocusOut = "cellFocusOut",
      escapeKeyDown = "escapeKeyDown",
      enterKeyDown = "enterKeyDown",
      tabKeyDown = "tabKeyDown",
      shiftTabKeyDown = "shiftTabKeyDown",
  }
  
  export interface GridCellEventLookup {
      /**
       * Fired when a cell is clicked.
       */
      cellClick: {
          params: GridCellParams<any>;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a cell is double-clicked.
       */
      cellDoubleClick: {
          params: GridCellParams<any>;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mousedown` event happens in a cell.
       */
      cellMouseDown: {
          params: GridCellParams<any>;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseup` event happens in a cell.
       */
      cellMouseUp: {
          params: GridCellParams<any>;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseover` event happens in a cell.
       */
      cellMouseOver: {
          params: GridCellParams<any>;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `keydown` event happens in a cell.
       */
      cellKeyDown: {
          params: GridCellParams<any>;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when a `keyup` event happens in a cell.
       */
      cellKeyUp: {
          params: GridCellParams<any>;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when the dragged cell enters a valid drop target. It's mapped to the `dragend` DOM event.
       * @ignore - do not document.
       */
      cellDragEnter: {
          params: GridCellParams<any>;
          event: React_2.DragEvent<HTMLElement>;
      };
      /**
       * Fired while an element or text selection is dragged over the cell.
       * It's mapped to the `dragover` DOM event.
       * @ignore - do not document.
       */
      cellDragOver: {
          params: GridCellParams<any>;
          event: React_2.DragEvent<HTMLElement>;
      };
  }
  
  /**
   * The coordinates of cell represented by their row and column indexes.
   */
  export interface GridCellIndexCoordinates {
      colIndex: number;
      rowIndex: number;
  }
  
  /**
   * The mode of the cell.
   */
  export type GridCellMode = 'edit' | 'view';
  
  export enum GridCellModes {
      Edit = "edit",
      View = "view",
  }
  
  export type GridCellModesModel = Record<GridRowId, Record<string, GridCellModesModelProps>>;
  
  type GridCellModesModelProps = ({
      mode: GridCellModes.View;
  } & Omit<GridStopCellEditModeParams, 'id' | 'field'>) | ({
      mode: GridCellModes.Edit;
  } & Omit<GridStartCellEditModeParams, 'id' | 'field'>);
  
  /**
   * Object passed as parameter in the column [[GridColDef]] cell renderer.
   */
  export interface GridCellParams<R extends GridValidRowModel = any, V = unknown, F = V, N extends GridTreeNode = GridTreeNode> {
      /**
       * The grid row id.
       */
      id: GridRowId;
      /**
       * The column field of the cell that triggered the event.
       */
      field: string;
      /**
       * The cell value.
       * If the column has `valueGetter`, use `params.row` to directly access the fields.
       */
      value?: V | undefined;
      /**
       * The cell value formatted with the column valueFormatter.
       */
      formattedValue?: F | undefined;
      /**
       * The row model of the row that the current cell belongs to.
       */
      row: GridRowModel<R>;
      /**
       * The node of the row that the current cell belongs to.
       */
      rowNode: N;
      /**
       * The column of the row that the current cell belongs to.
       */
      colDef: GridStateColDef;
      /**
       * If true, the cell is editable.
       */
      isEditable?: boolean;
      /**
       * The mode of the cell.
       */
      cellMode: GridCellMode;
      /**
       * If true, the cell is the active element.
       */
      hasFocus: boolean;
      /**
       * the tabIndex value.
       */
      tabIndex: 0 | -1;
      /**
       * GridApi that let you manipulate the grid.
       */
      api: GridApiCommunity;
  }
  
  export type GridCellProps = React_2.HTMLAttributes<HTMLDivElement> & {
      align: GridAlignment;
      className?: string;
      colIndex: number;
      column: GridStateColDef;
      row: GridRowModel;
      rowId: GridRowId;
      rowNode: GridTreeNode;
      width: number;
      colSpan?: number;
      disableDragEvents?: boolean;
      isNotVisible: boolean;
      pinnedOffset?: number;
      pinnedPosition: PinnedColumnPosition;
      showRightBorder: boolean;
      showLeftBorder: boolean;
      onClick?: React_2.MouseEventHandler<HTMLDivElement>;
      onDoubleClick?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseEnter?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseDown?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseLeave?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseUp?: React_2.MouseEventHandler<HTMLDivElement>;
      onMouseOver?: React_2.MouseEventHandler<HTMLDivElement>;
      onKeyUp?: React_2.KeyboardEventHandler<HTMLDivElement>;
      onKeyDown?: React_2.KeyboardEventHandler<HTMLDivElement>;
      onDragEnter?: React_2.DragEventHandler<HTMLDivElement>;
      onDragOver?: React_2.DragEventHandler<HTMLDivElement>;
      onFocus?: React_2.FocusEventHandler<Element>;
      children?: React_2.ReactNode;
      style?: React_2.CSSProperties;
      [x: `data-${string}`]: string;
  };
  
  export const GridCheckCircleIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridCheckIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export type GridChildrenFromPathLookup = {
      [groupingField: string]: {
          [groupingKey: string]: GridRowId;
      };
  };
  
  export interface GridClasses {
      /**
       * Styles applied to the root element of the AI assistant panel.
       */
      aiAssistantPanel: string;
      /**
       * Styles applied to the AI assistant panel header.
       */
      aiAssistantPanelHeader: string;
      /**
       * Styles applied to the AI assistant panel title.
       */
      aiAssistantPanelTitle: string;
      /**
       * Styles applied to the AI assistant panel title container.
       */
      aiAssistantPanelTitleContainer: string;
      /**
       * Styles applied to the AI assistant panel body.
       */
      aiAssistantPanelBody: string;
      /**
       * Styles applied to the AI assistant panel conversation title.
       */
      aiAssistantPanelConversationTitle: string;
      /**
       * Styles applied to the AI assistant panel empty text.
       */
      aiAssistantPanelEmptyText: string;
      /**
       * Styles applied to the AI assistant panel footer.
       */
      aiAssistantPanelFooter: string;
      /**
       * Styles applied to the AI assistant panel conversation.
       */
      aiAssistantPanelConversation: string;
      /**
       * Styles applied to the AI assistant panel conversation list.
       */
      aiAssistantPanelConversationList: string;
      /**
       * Styles applied to the AI assistant panel suggestions.
       */
      aiAssistantPanelSuggestions: string;
      /**
       * Styles applied to the AI assistant panel suggestions list.
       */
      aiAssistantPanelSuggestionsList: string;
      /**
       * Styles applied to the AI assistant panel suggestions item.
       */
      aiAssistantPanelSuggestionsItem: string;
      /**
       * Styles applied to the AI assistant panel suggestions label.
       */
      aiAssistantPanelSuggestionsLabel: string;
      /**
       * Styles applied to the root element of the cell with type="actions".
       */
      actionsCell: string;
      /**
       * Styles applied to the root element of the column header when aggregated.
       */
      aggregationColumnHeader: string;
      /**
       * Styles applied to the root element of the header when aggregation if `headerAlign="left"`.
       */
      'aggregationColumnHeader--alignLeft': string;
      /**
       * Styles applied to the root element of the header when aggregation if `headerAlign="center"`.
       */
      'aggregationColumnHeader--alignCenter': string;
      /**
       * Styles applied to the root element of the header when aggregation if `headerAlign="right"`.
       */
      'aggregationColumnHeader--alignRight': string;
      /**
       * Styles applied to the aggregation label in the column header when aggregated.
       */
      aggregationColumnHeaderLabel: string;
      /**
       * Styles applied to the aggregation row overlay wrapper.
       */
      aggregationRowOverlayWrapper: string;
      /**
       * Styles applied to the root element if `autoHeight={true}`.
       */
      autoHeight: string;
      /**
       * Styles applied to the root element while it is being autosized.
       */
      autosizing: string;
      withSidePanel: string;
      /**
       * Styles applied to the icon of the boolean cell.
       */
      booleanCell: string;
      /**
       * Styles applied to the cell element if the cell is editable.
       */
      'cell--editable': string;
      /**
       * Styles applied to the cell element if the cell is in edit mode.
       */
      'cell--editing': string;
      /**
       * Styles applied to the cell element in flex display mode.
       */
      'cell--flex': string;
      /**
       * Styles applied to the cell element if `align="center"`.
       */
      'cell--textCenter': string;
      /**
       * Styles applied to the cell element if `align="left"`.
       */
      'cell--textLeft': string;
      /**
       * Styles applied to the cell element if `align="right"`.
       */
      'cell--textRight': string;
      /**
       * Styles applied to the cell element if it is at the top edge of a cell selection range.
       */
      'cell--rangeTop': string;
      /**
       * Styles applied to the cell element if it is at the bottom edge of a cell selection range.
       */
      'cell--rangeBottom': string;
      /**
       * Styles applied to the cell element if it is at the left edge of a cell selection range.
       */
      'cell--rangeLeft': string;
      /**
       * Styles applied to the cell element if it is at the right edge of a cell selection range.
       */
      'cell--rangeRight': string;
      /**
       * Styles applied to the cell element if it is pinned to the left.
       */
      'cell--pinnedLeft': string;
      /**
       * Styles applied to the cell element if it is pinned to the right.
       */
      'cell--pinnedRight': string;
      /**
       * Styles applied to the cell element if it is in a cell selection range.
       */
      'cell--selectionMode': string;
      /**
       * Styles applied to the cell element.
       */
      cell: string;
      /**
       * Styles applied to the cell checkbox element.
       */
      cellCheckbox: string;
      /**
       * Styles applied to the empty cell element.
       */
      cellEmpty: string;
      /**
       * Styles applied to the skeleton cell element.
       */
      cellSkeleton: string;
      /**
       * @ignore - do not document.
       * Styles applied to the left offset cell element.
       */
      cellOffsetLeft: string;
      /**
       * Styles applied to the selection checkbox element.
       */
      checkboxInput: string;
      /**
       * Styles applied to the column header element.
       */
      columnHeader: string;
      /**
       * Styles applied to the collapsible element.
       */
      collapsible: string;
      /**
       * Styles applied to the collapsible icon element.
       */
      collapsibleIcon: string;
      /**
       * Styles applied to the collapsible trigger element.
       */
      collapsibleTrigger: string;
      /**
       * Styles applied to the collapsible panel element.
       */
      collapsiblePanel: string;
      /**
       * Styles applied to the column header if `headerAlign="center"`.
       */
      'columnHeader--alignCenter': string;
      /**
       * Styles applied to the column header if `headerAlign="left"`.
       */
      'columnHeader--alignLeft': string;
      /**
       * Styles applied to the column header if `headerAlign="right"`.
       */
      'columnHeader--alignRight': string;
      /**
       * Styles applied to the floating column header element when it is dragged.
       */
      'columnHeader--dragging': string;
      /**
       * Styles applied to the column header if it is being dragged.
       */
      'columnHeader--moving': string;
      /**
       * Styles applied to the column header if the type of the column is `number`.
       */
      'columnHeader--numeric': string;
      /**
       * Styles applied to the column header if the column is sortable.
       */
      'columnHeader--sortable': string;
      /**
       * Styles applied to the column header if the column is sorted.
       */
      'columnHeader--sorted': string;
      /**
       * Styles applied to the column header if the column has a filter applied to it.
       */
      'columnHeader--filtered': string;
      'columnHeader--pinnedLeft': string;
      'columnHeader--pinnedRight': string;
      /**
       * Styles applied to the last column header element.
       */
      'columnHeader--last': string;
      /**
       * Styles applied to a column header item when its sibling with a bordering separator is focused.
       * @ignore - do not document.
       */
      'columnHeader--siblingFocused': string;
      /**
       * Styles applied to the header filter input element.
       */
      columnHeaderFilterInput: string;
      /**
       * Styles applied to the header filter operator label element.
       */
      columnHeaderFilterOperatorLabel: string;
      /**
       * Styles applied to the header checkbox cell element.
       */
      columnHeaderCheckbox: string;
      /**
       * Styles applied to the column header's draggable container element.
       */
      columnHeaderDraggableContainer: string;
      /**
       * Styles applied to the row's draggable placeholder element inside the special row reorder cell.
       */
      rowReorderCellPlaceholder: string;
      /**
       * Styles applied to the column header's title element;
       */
      columnHeaderTitle: string;
      /**
       * Styles applied to the column header's title container element.
       */
      columnHeaderTitleContainer: string;
      /**
       * Styles applied to the column header's title excepted buttons.
       */
      columnHeaderTitleContainerContent: string;
      /**
       * Styles applied to the column group header cell if not empty.
       */
      'columnHeader--filledGroup': string;
      /**
       * Styles applied to the empty column group header cell.
       */
      'columnHeader--emptyGroup': string;
      /**
       * Styles applied to the header filter cell.
       */
      'columnHeader--filter': string;
      /**
       * Styles applied to the column headers.
       */
      columnHeaders: string;
      /**
       * Styles applied to the column header separator if the column is resizable.
       */
      'columnSeparator--resizable': string;
      /**
       * Styles applied to the column header separator if the column is being resized.
       */
      'columnSeparator--resizing': string;
      /**
       * Styles applied to the column header separator if the side is "left".
       */
      'columnSeparator--sideLeft': string;
      /**
       * Styles applied to the column header separator if the side is "right".
       */
      'columnSeparator--sideRight': string;
      /**
       * Styles applied to the column header separator element.
       */
      columnSeparator: string;
      /**
       * Styles applied to the columns management body.
       */
      columnsManagement: string;
      /**
       * Styles applied to the columns management row element.
       */
      columnsManagementRow: string;
      /**
       * Styles applied to the columns management header element.
       */
      columnsManagementHeader: string;
      /**
       * Styles applied to the columns management search input element.
       */
      columnsManagementSearchInput: string;
      /**
       * Styles applied to the columns management footer element.
       */
      columnsManagementFooter: string;
      /**
       * Styles applied to the columns management scroll area element.
       */
      columnsManagementScrollArea: string;
      /**
       * Styles applied to the columns management empty text element.
       */
      columnsManagementEmptyText: string;
      /**
       * Styles applied to the top container.
       */
      'container--top': string;
      /**
       * Styles applied to the bottom container.
       */
      'container--bottom': string;
      /**
       * Styles applied to the detail panel element.
       */
      detailPanel: string;
      /**
       * Styles applied to the detail panel toggle cell element.
       */
      detailPanelToggleCell: string;
      /**
       * Styles applied to the detail panel toggle cell element if expanded.
       */
      'detailPanelToggleCell--expanded': string;
      /**
       * Styles applied to the root element of the cell inside a footer row.
       */
      footerCell: string;
      /**
       * Styles applied to the panel element.
       */
      panel: string;
      /**
       * Styles applied to the panel header element.
       */
      panelHeader: string;
      /**
       * Styles applied to the panel wrapper element.
       */
      panelWrapper: string;
      /**
       * Styles applied to the panel content element.
       */
      panelContent: string;
      /**
       * Styles applied to the panel footer element.
       */
      panelFooter: string;
      /**
       * Styles applied to the paper element.
       */
      paper: string;
      /**
       * Styles applied to root of the boolean edit component.
       */
      editBooleanCell: string;
      /**
       * Styles applied to the filler row.
       * @ignore - do not document.
       */
      filler: string;
      /**
       * Styles applied to the filler row with bottom border.
       * @ignore - do not document.
       */
      'filler--borderBottom': string;
      /**
       * Styles applied to the filler row pinned left section.
       * @ignore - do not document.
       */
      'filler--pinnedLeft': string;
      /**
       * Styles applied to the filler row pinned right section.
       * @ignore - do not document.
       */
      'filler--pinnedRight': string;
      /**
       * Styles applied to the root of the filter form component.
       */
      filterForm: string;
      /**
       * Styles applied to the delete icon of the filter form component.
       */
      filterFormDeleteIcon: string;
      /**
       * Styles applied to the link operator input of the filter form component.
       */
      filterFormLogicOperatorInput: string;
      /**
       * Styles applied to the column input of the filter form component.
       */
      filterFormColumnInput: string;
      /**
       * Styles applied to the operator input of the filter form component.
       */
      filterFormOperatorInput: string;
      /**
       * Styles applied to the value input of the filter form component.
       */
      filterFormValueInput: string;
      /**
       * Styles applied to the root of the input component.
       */
      editInputCell: string;
      /**
       * Styles applied to the filter icon element.
       */
      filterIcon: string;
      /**
       * Styles applied to the footer container element.
       */
      footerContainer: string;
      /**
       * Styles applied to the column header icon's container.
       */
      iconButtonContainer: string;
      /**
       * Styles applied to the column header separator icon element.
       */
      iconSeparator: string;
      /**
       * Styles applied to the column header filter row.
       */
      headerFilterRow: string;
      mainContent: string;
      /**
       * Styles applied to the main container element.
       */
      main: string;
      /**
       * Styles applied to the main container element when it has right pinned columns.
       */
      'main--hasPinnedRight': string;
      /**
       * Styles applied to the main container element to hide the contents of the grid.
       * @ignore - do not document.
       */
      'main--hiddenContent': string;
      /**
       * Styles applied to the menu element.
       */
      menu: string;
      /**
       * Styles applied to the menu icon element.
       */
      menuIcon: string;
      /**
       * Styles applied to the menu icon button element.
       */
      menuIconButton: string;
      /**
       * Styles applied to the menu icon element if the menu is open.
       */
      menuOpen: string;
      /**
       * Styles applied to the menu list element.
       */
      menuList: string;
      /**
       * Styles applied to the overlay wrapper element.
       */
      overlayWrapper: string;
      /**
       * Styles applied to the overlay wrapper inner element.
       */
      overlayWrapperInner: string;
      /**
       * Styles applied to the overlay element.
       */
      overlay: string;
      /**
       * Styles applied to the virtualization container.
       */
      virtualScroller: string;
      /**
       * Styles applied to the virtualization container when it is scrollable in the horizontal direction.
       * @ignore - do not document.
       */
      'virtualScroller--hasScrollX': string;
      /**
       * Styles applied to the virtualization content.
       */
      virtualScrollerContent: string;
      /**
       * Styles applied to the virtualization content when its height is bigger than the virtualization container.
       */
      'virtualScrollerContent--overflowed': string;
      /**
       * Styles applied to the virtualization render zone.
       */
      virtualScrollerRenderZone: string;
      /**
       * Styles applied to resizable panel handles.
       */
      resizablePanelHandle: string;
      /**
       * Styles applied to horizontal resizable panel handles.
       */
      'resizablePanelHandle--horizontal': string;
      /**
       * Styles applied to vertical resizable panel handles.
       */
      'resizablePanelHandle--vertical': string;
      /**
       * Styles applied to the root element.
       */
      root: string;
      /**
       * Styles applied to the root element if density is "standard" (default).
       */
      'root--densityStandard': string;
      /**
       * Styles applied to the root element if density is "comfortable".
       */
      'root--densityComfortable': string;
      /**
       * Styles applied to the root element if density is "compact".
       */
      'root--densityCompact': string;
      /**
       * Styles applied to the root element when user selection is disabled.
       */
      'root--disableUserSelection': string;
      /**
       * Used to fix header outline border radius.
       * @ignore - do not document.
       */
      'root--noToolbar': string;
      /**
       * Styles applied to the row element if the row is editable.
       */
      'row--editable': string;
      /**
       * Styles applied to the row element if the row is in edit mode.
       */
      'row--editing': string;
      /**
       * Styles applied to the floating special row reorder cell element when it is dragged.
       */
      'row--dragging': string;
      /**
       * Styles applied to the row element when it is a drop target above.
       */
      'row--dropAbove': string;
      /**
       * Styles applied to the row element when it is a drop target below.
       */
      'row--dropBelow': string;
      /**
       * Styles applied to the row element when it is being dragged (entire row).
       */
      'row--beingDragged': string;
      /**
       * Styles applied to the first visible row element on every page of the grid.
       */
      'row--firstVisible': string;
      /**
       * Styles applied to the last visible row element on every page of the grid.
       */
      'row--lastVisible': string;
      /**
       * Styles applied to the row if it has dynamic row height.
       */
      'row--dynamicHeight': string;
      /**
       * Styles applied to the row if its detail panel is open.
       */
      'row--detailPanelExpanded': string;
      /**
       * Styles applied to the row cells if the row needs a bottom border.
       * @ignore - do not document.
       */
      'row--borderBottom': string;
      /**
       * Styles applied to the row element.
       */
      row: string;
      /**
       * Styles applied to the footer row count element to show the total number of rows.
       * Only works when pagination is disabled.
       */
      rowCount: string;
      /**
       * Styles applied to the row reorder cell container element.
       */
      rowReorderCellContainer: string;
      /**
       * Styles applied to the root element of the row reorder cell
       */
      rowReorderCell: string;
      /**
       * Styles applied to the root element of the row reorder cell when dragging is allowed
       */
      'rowReorderCell--draggable': string;
      /**
       * Styles applied to the row reorder icon element.
       */
      rowReorderIcon: string;
      /**
       * Styles applied to the skeleton row element.
       */
      rowSkeleton: string;
      /**
       * Styles applied to both scroll area elements.
       */
      scrollArea: string;
      /**
       * Styles applied to the left scroll area element.
       */
      'scrollArea--left': string;
      /**
       * Styles applied to the right scroll area element.
       */
      'scrollArea--right': string;
      /**
       * Styles applied to the top scroll area element.
       */
      'scrollArea--up': string;
      /**
       * Styles applied to the bottom scroll area element.
       */
      'scrollArea--down': string;
      /**
       * Styles applied to the scrollbars.
       */
      scrollbar: string;
      /**
       * Styles applied to the horizontal scrollbar.
       */
      'scrollbar--horizontal': string;
      /**
       * Styles applied to the horizontal scrollbar.
       */
      'scrollbar--vertical': string;
      /**
       * @ignore - do not document.
       * Styles applied to the scrollbar filler cell.
       */
      scrollbarFiller: string;
      /**
       * @ignore - do not document.
       * Styles applied to the scrollbar filler cell.
       */
      'scrollbarFiller--pinnedRight': string;
      /**
       * Styles applied to the scroll shadow element.
       */
      scrollShadow: string;
      /**
       * Styles applied to the horizontal scroll shadow element.
       */
      'scrollShadow--horizontal': string;
      /**
       * Styles applied to the vertical scroll shadow element.
       */
      'scrollShadow--vertical': string;
      /**
       * Styles applied to the footer selected row count element.
       */
      selectedRowCount: string;
      /**
       * Styles applied to the sort button element.
       */
      sortButton: string;
      /**
       * Styles applied to the sort button icon element.
       */
      sortIcon: string;
      /**
       * Styles applied to the toolbar root element.
       */
      toolbar: string;
      /**
       * Styles applied to the toolbar label element.
       */
      toolbarLabel: string;
      /**
       * Styles applied to the toolbar divider element.
       */
      toolbarDivider: string;
      /**
       * Styles applied to the shadow scroll area element.
       * @ignore - do not document.
       */
      shadowScrollArea: string;
      /**
       * Styles applied to the sidebar element.
       */
      sidebar: string;
      /**
       * Styles applied to the sidebar header element.
       */
      sidebarHeader: string;
      /**
       * Styles applied to the toolbar container element.
       */
      toolbarContainer: string;
      /**
       * Styles applied to the toolbar filter list element.
       */
      toolbarFilterList: string;
      /**
       * Styles applied to the toolbar quick filter root element.
       */
      toolbarQuickFilter: string;
      /**
       * Styles applied to the toolbar quick filter trigger element.
       */
      toolbarQuickFilterTrigger: string;
      /**
       * Styles applied to the toolbar quick filter control element.
       */
      toolbarQuickFilterControl: string;
      /**
       * Styles applied the grid if `showColumnVerticalBorder={true}`.
       */
      withVerticalBorder: string;
      /**
       * Styles applied to cells, column header and other elements that have border.
       * Sets border color only.
       */
      withBorderColor: string;
      /**
       * Styles applied the cell if `showColumnVerticalBorder={true}`.
       */
      'cell--withRightBorder': string;
      /**
       * Styles applied the cell if `showColumnVerticalBorder={true}`.
       */
      'cell--withLeftBorder': string;
      /**
       * Styles applied the column header if `showColumnVerticalBorder={true}`.
       */
      'columnHeader--withRightBorder': string;
      'columnHeader--withLeftBorder': string;
      /**
       * Styles applied to the root of the grouping column of the tree data.
       */
      treeDataGroupingCell: string;
      /**
       * Styles applied to the toggle of the grouping cell of the tree data.
       */
      treeDataGroupingCellToggle: string;
      /**
       * Styles applied to the loading container of the grouping cell of the tree data.
       * @ignore - do not document.
       */
      treeDataGroupingCellLoadingContainer: string;
      /**
       * Styles applied to the root element of the grouping criteria cell
       */
      groupingCriteriaCell: string;
      /**
       * Styles applied to the toggle of the grouping criteria cell
       */
      groupingCriteriaCellToggle: string;
      /**
       * Styles applied to the loading container of the grouping cell of the tree data.
       * @ignore - do not document.
       */
      groupingCriteriaCellLoadingContainer: string;
      /**
       * Styles applied to the pinned rows container.
       */
      pinnedRows: string;
      /**
       * Styles applied to the top pinned rows container.
       */
      'pinnedRows--top': string;
      /**
       * Styles applied to the bottom pinned rows container.
       */
      'pinnedRows--bottom': string;
      /**
       * Styles applied to the pivot panel available fields.
       */
      pivotPanelAvailableFields: string;
      /**
       * Styles applied to the pivot panel body.
       */
      pivotPanelBody: string;
      /**
       * Styles applied to the pivot panel field.
       */
      pivotPanelField: string;
      /**
       * Styles applied to the pivot panel field action container.
       */
      pivotPanelFieldActionContainer: string;
      /**
       * Styles applied to the pivot panel field checkbox.
       */
      pivotPanelFieldCheckbox: string;
      /**
       * Styles applied to the pivot panel field drag icon.
       */
      pivotPanelFieldDragIcon: string;
      /**
       * Styles applied to the pivot panel field list.
       */
      pivotPanelFieldList: string;
      /**
       * Styles applied to the pivot panel field name.
       */
      pivotPanelFieldName: string;
      /**
       * Styles applied to the pivot panel field when sorted.
       */
      'pivotPanelField--sorted': string;
      /**
       * Styles applied to the pivot panel header.
       */
      pivotPanelHeader: string;
      /**
       * Styles applied to the pivot panel placeholder.
       */
      pivotPanelPlaceholder: string;
      /**
       * Styles applied to the pivot panel scroll area.
       */
      pivotPanelScrollArea: string;
      /**
       * Styles applied to the pivot panel search container.
       */
      pivotPanelSearchContainer: string;
      /**
       * Styles applied to the pivot panel section.
       */
      pivotPanelSection: string;
      /**
       * Styles applied to the pivot panel section title.
       */
      pivotPanelSectionTitle: string;
      /**
       * Styles applied to the pivot panel sections.
       */
      pivotPanelSections: string;
      /**
       * Styles applied to the pivot panel switch.
       */
      pivotPanelSwitch: string;
      /**
       * Styles applied to the pivot panel switch label.
       */
      pivotPanelSwitchLabel: string;
      /**
       * Styles applied to the prompt root element.
       */
      prompt: string;
      /**
       * Styles applied to the prompt content element.
       */
      promptContent: string;
      /**
       * Styles applied to the prompt text element.
       */
      promptText: string;
      /**
       * Styles applied to the prompt feedback element.
       */
      promptFeedback: string;
      /**
       * Styles applied to the prompt change list element.
       */
      promptChangeList: string;
      /**
       * Styles applied to the prompt changes toggle element.
       */
      promptChangesToggle: string;
      /**
       * Styles applied to the prompt changes toggle icon element.
       */
      promptChangesToggleIcon: string;
      /**
       * Styles applied to the prompt icon element.
       */
      promptIconContainer: string;
      /**
       * Styles applied to the prompt icon element.
       */
      promptIcon: string;
      /**
       * Styles applied to the prompt error element.
       */
      promptError: string;
      /**
       * Styles applied to the prompt action element.
       */
      promptAction: string;
  }
  
  export const gridClasses: Record<keyof GridClasses, string>;
  
  export type GridClassKey = keyof GridClasses;
  
  export const GridClearIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridCloseIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * Column Definition interface.
   * @demos
   *   - [Column definition](/x/react-data-grid/column-definition/)
   */
  export type GridColDef<R extends GridValidRowModel = any, V = any, F = V> = GridBaseColDef<R, V, F> | GridActionsColDef<R, V, F> | GridSingleSelectColDef<R, V, F>;
  
  export type GridColSpanFn<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (value: V, row: R, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => number | undefined;
  
  export type GridColType = GridColumnTypes[keyof GridColumnTypes];
  
  export type GridColTypeDef<V = any, F = V> = Omit<GridBaseColDef<any, V, F>, 'field'>;
  
  /**
   * The column API interface that is available in the grid [[apiRef]].
   * TODO: Differentiate interfaces based on the plan
   */
  export interface GridColumnApi {
      /**
       * Returns the [[GridColDef]] for the given `field`.
       * @param {string} field The column field.
       * @returns {{GridStateColDef}} The [[GridStateColDef]].
       */
      getColumn: (field: string) => GridStateColDef;
      /**
       * Returns an array of [[GridColDef]] containing all the column definitions.
       * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
       */
      getAllColumns: () => GridStateColDef[];
      /**
       * Returns the currently visible columns.
       * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
       */
      getVisibleColumns: () => GridStateColDef[];
      /**
       * Returns the index position of a column. By default, only the visible columns are considered.
       * Pass `false` to `useVisibleColumns` to consider all columns.
       * @param {string} field The column field.
       * @param {boolean} useVisibleColumns Determines if all columns or the visible ones should be considered. Default is `true`.
       * @returns {number} The index position.
       */
      getColumnIndex: (field: string, useVisibleColumns?: boolean) => number;
      /**
       * Returns the left-position of a column relative to the inner border of the grid.
       * @param {string} field The column field.
       * @returns {number} The position in pixels.
       */
      getColumnPosition: (field: string) => number;
      /**
       * Updates the definition of multiple columns at the same time.
       * @param {GridColDef[]} cols The new column [[GridColDef]] objects.
       */
      updateColumns: (cols: GridColDef[]) => void;
      /**
       * Sets the column visibility model to the one given by `model`.
       * @param {GridColumnVisibilityModel} model The new visible columns model.
       */
      setColumnVisibilityModel: (model: GridColumnVisibilityModel) => void;
      /**
       * Changes the visibility of the column referred by `field`.
       * @param {string} field The column to change visibility.
       * @param {boolean} isVisible Pass `true` to show the column, or `false` to hide it. Default is `false`
       */
      setColumnVisibility: (field: string, isVisible: boolean) => void;
      /**
       * Updates the width of a column.
       * @param {string} field The column field.
       * @param {number} width The new width.
       */
      setColumnWidth: (field: string, width: number) => void;
      /**
       * Gets the index of a column relative to the columns that are reachable by scroll.
       * @param {string} field The column field.
       * @returns {number} The index of the column.
       */
      getColumnIndexRelativeToVisibleColumns: (field: string) => number;
  }
  
  /**
   * Get an array of column definitions in the order rendered on screen..
   * @category Columns
   */
  export const gridColumnDefinitionsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridStateColDef[];
  
  type GridColumnDimensionProperties = (typeof COLUMNS_DIMENSION_PROPERTIES)[number];
  
  export type GridColumnDimensions = { [key in GridColumnDimensionProperties]?: number };
  
  /**
   * Get an array of column fields in the order rendered on screen.
   * @category Columns
   */
  export const gridColumnFieldsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => string[];
  
  export interface GridColumnGroup extends Pick<GridColDef, 'headerName' | 'description' | 'headerAlign'> {
      /**
       * A unique string identifying the group.
       */
      groupId: string;
      /**
       * The groups and columns included in this group.
       */
      children: GridColumnNode[];
      /**
       * If `true`, allows reordering columns outside of the group.
       * @default false
       */
      freeReordering?: boolean;
      /**
       * Allows to render a component in the column group header cell.
       * @param {GridColumnGroupHeaderParams} params Object containing parameters for the renderer.
       * @returns {React.ReactNode} The element to be rendered.
       */
      renderHeaderGroup?: (params: GridColumnGroupHeaderParams) => React.ReactNode;
      /**
       * Class name that will be added in the column group header cell.
       */
      headerClassName?: GridColumnGroupHeaderClassNamePropType;
  }
  
  /**
   * A function used to process headerClassName params.
   * @param {GridColumnGroupHeaderParams} params The parameters of the column group header.
   * @returns {string} The class name to be added to the column group header cell.
   */
  export type GridColumnGroupHeaderClassFn = (params: GridColumnGroupHeaderParams) => string;
  
  /**
   * The union type representing the [[GridColDef]] column header class type.
   */
  export type GridColumnGroupHeaderClassNamePropType = string | GridColumnGroupHeaderClassFn;
  
  export interface GridColumnGroupHeaderEventLookup {
      /**
       * Fired when a key is pressed in a column group header. It's mapped do the `keydown` DOM event.
       */
      columnGroupHeaderKeyDown: {
          params: GridColumnGroupHeaderParams;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when a column group header gains focus.
       * @ignore - do not document.
       */
      columnGroupHeaderFocus: {
          params: GridColumnGroupHeaderParams;
          event: React_2.FocusEvent<HTMLElement>;
      };
      /**
       * Fired when a column group header loses focus.
       * @ignore - do not document.
       */
      columnGroupHeaderBlur: {
          params: GridColumnGroupHeaderParams;
          event: React_2.FocusEvent<HTMLElement>;
      };
  }
  
  /**
   * Object passed as parameter in the column group header renderer.
   */
  export interface GridColumnGroupHeaderParams extends Pick<GridColumnGroup, 'headerName' | 'description'> {
      /**
       * A unique string identifying the group.
       */
      groupId: GridColumnGroup['groupId'] | null;
      /**
       * The number parent the group have.
       */
      depth: number;
      /**
       * The maximal depth among visible columns.
       */
      maxDepth: number;
      /**
       * The column fields included in the group (including nested ones).
       */
      fields: string[];
      /**
       * The column index (0 based).
       */
      colIndex: number;
      /**
       * Indicate if the group is the last one for the given depth.
       */
      isLastColumn: boolean;
  }
  
  export type GridColumnGroupIdentifier = {
      field: string;
      depth: number;
  };
  
  /**
   * The column grouping API interface that is available in the grid [[apiRef]].
   */
  interface GridColumnGroupingApi {
      /**
       * Returns the id of the groups leading to the requested column.
       * The array is ordered by increasing depth (the last element is the direct parent of the column).
       * @param {string} field The field of of the column requested.
       * @returns {string[]} The id of the groups leading to the requested column.
       */
      getColumnGroupPath: (field: string) => GridColumnGroup['groupId'][];
      /**
       * Returns the column group lookup.
       * @returns {GridColumnGroupLookup} The column group lookup.
       */
      getAllGroupDetails: () => GridColumnGroupLookup;
  }
  
  interface GridColumnGroupingInternalCache {
      lastColumnGroupingModel?: GridColumnGroupingModel;
  }
  
  export type GridColumnGroupingModel = GridColumnGroup[];
  
  /**
   * @category ColumnGrouping
   * @ignore - do not document.
   */
  export const gridColumnGroupingSelector: OutputSelector_2<GridStateCommunity, unknown, GridColumnsGroupingState_2>;
  
  type GridColumnGroupLookup = {
      [groupId: string]: Omit<GridColumnGroup, 'children'>;
  };
  
  export const gridColumnGroupsHeaderMaxDepthSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  export const gridColumnGroupsHeaderStructureSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridGroupingStructure[][];
  
  export const gridColumnGroupsLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnGroupLookup;
  
  export const gridColumnGroupsUnwrappedModelSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => {
      [columnField: string]: string[];
  };
  
  /**
   * A function used to process headerClassName params.
   * @param {GridColumnHeaderParams} params The parameters of the column header.
   * @returns {string} The class name to be added to the column header cell.
   */
  export type GridColumnHeaderClassFn = (params: GridColumnHeaderParams) => string;
  
  /**
   * The union type representing the [[GridColDef]] column header class type.
   */
  export type GridColumnHeaderClassNamePropType = string | GridColumnHeaderClassFn;
  
  export interface GridColumnHeaderEventLookup {
      /**
       * Fired when a column header is clicked
       */
      columnHeaderClick: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when the user attempts to open a context menu in the column header.
       */
      columnHeaderContextMenu: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a column header is double-clicked.
       */
      columnHeaderDoubleClick: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseover` event happens in a column header.
       * @ignore - do not document.
       */
      columnHeaderOver: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseout` event happens in a column header.
       * @ignore - do not document.
       */
      columnHeaderOut: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseenter` event happens in a column header.
       * @ignore - do not document.
       */
      columnHeaderEnter: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mouseleave` event happens in a column header.
       * @ignore - do not document.*
       */
      columnHeaderLeave: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a key is pressed in a column header. It's mapped do the `keydown` DOM event.
       */
      columnHeaderKeyDown: {
          params: GridColumnHeaderParams;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when a column header gains focus.
       * @ignore - do not document.
       */
      columnHeaderFocus: {
          params: GridColumnHeaderParams;
          event: React_2.FocusEvent<HTMLElement>;
      };
      /**
       * Fired when a column header loses focus.
       * @ignore - do not document.
       */
      columnHeaderBlur: {
          params: GridColumnHeaderParams;
          event: React_2.FocusEvent<HTMLElement>;
      };
      /**
       * Fired when the user starts dragging a column header. It's mapped to the `dragstart` DOM event.
       * @ignore - do not document.
       */
      columnHeaderDragStart: {
          params: GridColumnHeaderParams;
          event: React_2.DragEvent<HTMLElement>;
      };
      /**
       * Fired when the dragged column header enters a valid drop target.
       * It's mapped to the `dragend` DOM event.
       * @ignore - do not document.
       */
      columnHeaderDragEnter: {
          params: GridColumnHeaderParams;
          event: React_2.DragEvent<HTMLElement>;
      };
      /**
       * Fired while an element or text selection is dragged over the column header.
       * It's mapped to the `dragover` DOM event.
       * @ignore - do not document.
       */
      columnHeaderDragOver: {
          params: GridColumnHeaderParams;
          event: React_2.DragEvent<HTMLElement>;
      };
      /**
       * Fired when the dragging of a column header ends.
       * @ignore - do not document.
       */
      columnHeaderDragEnd: {
          params: GridColumnHeaderParams;
          event: React_2.DragEvent<HTMLElement>;
      };
      /**
       * Fired when the dragging of a column header ends.
       * Same as `columnHeaderDragEnd`, but also fires when the DOM element is unmounted.
       * @ignore - do not document.
       */
      columnHeaderDragEndNative: {
          params: GridColumnHeaderParams;
          event: DragEvent;
      };
      /**
       * Fired when a `dblclick` DOM event happens in the column header separator.
       * @ignore - do not document.
       */
      columnSeparatorDoubleClick: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a `mousedown` DOM event happens in the column header separator.
       * @ignore - do not document.
       */
      columnSeparatorMouseDown: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when the index of a column changes.
       * @ignore - do not document.
       */
      columnIndexChange: {
          params: GridColumnOrderChangeParams;
      };
  }
  
  export function GridColumnHeaderFilterIconButton(props: ColumnHeaderFilterIconButtonProps): React_2.JSX.Element | null;
  
  export namespace GridColumnHeaderFilterIconButton {
      var propTypes: any;
  }
  
  /**
   * The coordinates of column header represented by their row and column indexes.
   */
  export interface GridColumnHeaderIndexCoordinates {
      colIndex: number;
  }
  
  export const GridColumnHeaderItem: typeof GridColumnHeaderItem_2;
  
  function GridColumnHeaderItem_2(props: GridColumnHeaderItemProps): React_2.JSX.Element;
  
  namespace GridColumnHeaderItem_2 {
      var propTypes: any;
  }
  
  interface GridColumnHeaderItemProps {
      colIndex: number;
      colDef: GridStateColDef;
      columnMenuOpen: boolean;
      headerHeight: number;
      isDragging: boolean;
      isResizing: boolean;
      isLast: boolean;
      sortDirection: GridSortDirection;
      sortIndex?: number;
      filterItemsCounter?: number;
      hasFocus?: boolean;
      tabIndex: 0 | -1;
      disableReorder?: boolean;
      separatorSide?: GridColumnHeaderSeparatorProps['side'];
      pinnedPosition?: PinnedColumnPosition;
      pinnedOffset?: number;
      style?: React_2.CSSProperties;
      isSiblingFocused: boolean;
      showLeftBorder: boolean;
      showRightBorder: boolean;
  }
  
  export function GridColumnHeaderMenu({
      columnMenuId,
      columnMenuButtonId,
      ContentComponent,
      contentComponentProps,
      field,
      open,
      target,
      onExited
  }: GridColumnHeaderMenuProps): React_2.JSX.Element | null;
  
  export namespace GridColumnHeaderMenu {
      var propTypes: any;
  }
  
  export interface GridColumnHeaderMenuProps {
      columnMenuId?: string;
      columnMenuButtonId?: string;
      ContentComponent: React_2.JSXElementConstructor<any>;
      contentComponentProps?: any;
      field: string;
      open: boolean;
      target: HTMLElement | null;
      onExited?: GridMenuProps['onExited'];
  }
  
  /**
   * Object passed as parameter in the column [[GridColDef]] header renderer.
   */
  export interface GridColumnHeaderParams<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> {
      /**
       * The column field of the column that triggered the event
       */
      field: string;
      /**
       * The column of the current header component.
       */
      colDef: GridStateColDef<R, V, F>;
  }
  
  export const GridColumnHeaders: React_2.ForwardRefExoticComponent<GridColumnHeadersProps> | React_2.ForwardRefExoticComponent<Omit<GridColumnHeadersProps, "ref"> & React_2.RefAttributes<HTMLDivElement>>;
  
  export const GridColumnHeaderSeparator: React_2.MemoExoticComponent<typeof GridColumnHeaderSeparatorRaw>;
  
  export interface GridColumnHeaderSeparatorProps extends React_2.HTMLAttributes<HTMLDivElement> {
      resizable: boolean;
      resizing: boolean;
      height: number;
      side?: GridColumnHeaderSeparatorSides;
  }
  
  function GridColumnHeaderSeparatorRaw(props: GridColumnHeaderSeparatorProps): React_2.JSX.Element;
  
  namespace GridColumnHeaderSeparatorRaw {
      var propTypes: any;
  }
  
  export enum GridColumnHeaderSeparatorSides {
      Left = "left",
      Right = "right",
  }
  
  export const GridColumnHeaderSortIcon: React_2.MemoExoticComponent<typeof GridColumnHeaderSortIconRaw>;
  
  export interface GridColumnHeaderSortIconProps extends GridColumnSortButtonProps {}
  
  function GridColumnHeaderSortIconRaw(props: GridColumnHeaderSortIconProps): React_2.JSX.Element;
  
  namespace GridColumnHeaderSortIconRaw {
      var propTypes: any;
  }
  
  export interface GridColumnHeadersProps extends React_2.HTMLAttributes<HTMLDivElement>, UseGridColumnHeadersProps {
      ref?: React_2.Ref<HTMLDivElement>;
  }
  
  export function GridColumnHeaderTitle(props: GridColumnHeaderTitleProps): React_2.JSX.Element;
  
  export namespace GridColumnHeaderTitle {
      var propTypes: any;
  }
  
  export interface GridColumnHeaderTitleProps {
      label: string;
      columnWidth: number;
      description?: React_2.ReactNode;
  }
  
  export const GridColumnIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export type GridColumnIdentifier = {
      field: string;
  };
  
  type GridColumnIndex = number;
  
  export type GridColumnLookup = {
      [field: string]: GridStateColDef;
  };
  
  /**
   * Get the columns as a lookup (an object containing the field for keys and the definition for values).
   * @category Columns
   */
  export const gridColumnLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnLookup;
  
  export const GridColumnMenu: React_2.ForwardRefExoticComponent<GridColumnMenuProps> | React_2.ForwardRefExoticComponent<GridColumnMenuProps & React_2.RefAttributes<HTMLUListElement>>;
  
  /**
   * The column menu API interface that is available in the grid [[apiRef]].
   */
  export interface GridColumnMenuApi {
      /**
       * Display the column menu under the `field` column.
       * @param {string} field The column to display the menu.
       */
      showColumnMenu: (field: string) => void;
      /**
       * Hides the column menu that is open.
       */
      hideColumnMenu: () => void;
      /**
       * Toggles the column menu under the `field` column.
       * @param {string} field The field name to toggle the column menu.
       */
      toggleColumnMenu: (field: string) => void;
  }
  
  export function GridColumnMenuColumnsItem(props: GridColumnMenuItemProps): React_2.JSX.Element;
  
  export namespace GridColumnMenuColumnsItem {
      var propTypes: any;
  }
  
  export const GridColumnMenuContainer: React_2.ForwardRefExoticComponent<GridColumnMenuContainerProps> | React_2.ForwardRefExoticComponent<GridColumnMenuContainerProps & React_2.RefAttributes<HTMLUListElement>>;
  
  export interface GridColumnMenuContainerProps extends React_2.HTMLAttributes<HTMLUListElement> {
      hideMenu: (event: React_2.SyntheticEvent) => void;
      colDef: GridColDef;
      open: boolean;
      id?: string;
      labelledby?: string;
  }
  
  export function GridColumnMenuFilterItem(props: GridColumnMenuItemProps): React_2.JSX.Element | null;
  
  export namespace GridColumnMenuFilterItem {
      var propTypes: any;
  }
  
  export function GridColumnMenuHideItem(props: GridColumnMenuItemProps): React_2.JSX.Element | null;
  
  export namespace GridColumnMenuHideItem {
      var propTypes: any;
  }
  
  export interface GridColumnMenuItemProps {
      colDef: GridColDef;
      onClick: (event: React_2.MouseEvent<any>) => void;
      [key: string]: any;
  }
  
  export function GridColumnMenuManageItem(props: GridColumnMenuItemProps): React_2.JSX.Element | null;
  
  export namespace GridColumnMenuManageItem {
      var propTypes: any;
  }
  
  export interface GridColumnMenuProps extends Omit<GridGenericColumnMenuProps, 'defaultSlots' | 'defaultSlotProps'> {}
  
  export interface GridColumnMenuRootProps {
      /**
       * Initial `slots` - it is internal, to be overrriden by Pro or Premium packages
       * @ignore - do not document.
       */
      defaultSlots: {
          [key: string]: React_2.JSXElementConstructor<any>;
      };
      /**
       * Initial `slotProps` - it is internal, to be overrriden by Pro or Premium packages
       * @ignore - do not document.
       */
      defaultSlotProps: {
          [key: string]: GridColumnMenuSlotProps;
      };
      /**
       * `slots` could be used to add new and (or) override default column menu items
       * If you register a nee component you must pass it's `displayOrder` in `slotProps`
       * or it will be placed in the end of the list
       */
      slots?: {
          [key: string]: React_2.JSXElementConstructor<any> | null;
      };
      /**
       * Could be used to pass new props or override props specific to a column menu component
       * e.g. `displayOrder`
       */
      slotProps?: {
          [key: string]: GridColumnMenuSlotProps;
      };
  }
  
  export const gridColumnMenuSelector: OutputSelector_2<GridStateCommunity, unknown, GridColumnMenuState_2>;
  
  export interface GridColumnMenuSlotProps {
      /**
       * Every item has a `displayOrder` based which it will be placed before or after other
       * items in the column menu, `array.prototype.sort` is applied to sort the items.
       * Note: If same `displayOrder` is applied to two or more items they will be sorted
       * based on the definition order
       * @default 100
       */
      displayOrder?: number;
      [key: string]: any;
  }
  
  export function GridColumnMenuSortItem(props: GridColumnMenuItemProps): React_2.JSX.Element | null;
  
  export namespace GridColumnMenuSortItem {
      var propTypes: any;
  }
  
  export interface GridColumnMenuState {
      open: boolean;
      field?: string;
  }
  
  export type GridColumnNode = GridColumnGroup | GridLeafColumn;
  
  /**
   * Object passed as parameter of the column order change event.
   */
  export interface GridColumnOrderChangeParams {
      /**
       * The column of the current header component.
       */
      column: GridColDef;
      /**
       * The target column index.
       */
      targetIndex: number;
      /**
       * The old column index.
       */
      oldIndex: number;
  }
  
  export type GridColumnPinningState = GridPinnedColumnFields;
  
  /**
   * Get the left position in pixel of each visible columns relative to the left of the first column.
   * @category Visible Columns
   */
  export const gridColumnPositionsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number[];
  
  export type GridColumnRawLookup = {
      [field: string]: GridColDef | GridStateColDef;
  };
  
  export interface GridColumnReorderApi {
      /**
       * Moves a column from its original position to the position given by `targetIndexPosition`.
       * @param {string} field The field name
       * @param {number} targetIndexPosition The new position (0-based).
       */
      setColumnIndex: (field: string, targetIndexPosition: number) => void;
  }
  
  /**
   * The Resize API interface that is available in the grid `apiRef`.
   */
  export interface GridColumnResizeApi {
      /**
       * Auto-size the columns of the grid based on the cells' content and the space available.
       * @param {GridAutosizeOptions} options The autosizing options
       * @returns {Promise} A promise that resolves when autosizing is completed
       */
      autosizeColumns: (options?: GridAutosizeOptions) => Promise<void>;
  }
  
  /**
   * Object passed as parameter of the column resize event.
   */
  export interface GridColumnResizeParams {
      /**
       * The HTMLElement column header element.
       */
      element?: HTMLElement | null;
      /**
       * The column of the current header component.
       */
      colDef: GridStateColDef;
      /**
       * The width of the column.
       */
      width: number;
  }
  
  export const gridColumnResizeSelector: OutputSelector_2<GridStateCommunity, unknown, GridColumnResizeState_2>;
  
  export interface GridColumnResizeState {
      resizingColumnField: string;
  }
  
  export interface GridColumnsGroupingState {
      lookup: GridColumnGroupLookup;
      headerStructure: GridGroupingStructure[][];
      unwrappedGroupingModel: {
          [columnField: string]: GridColumnGroup['groupId'][];
      };
      maxDepth: number;
  }
  
  export interface GridColumnsInitialState {
      columnVisibilityModel?: GridColumnVisibilityModel;
      orderedFields?: string[];
      dimensions?: Record<string, GridColumnDimensions>;
  }
  
  export function GridColumnsManagement(props: GridColumnsManagementProps): React_2.JSX.Element;
  
  export namespace GridColumnsManagement {
      var propTypes: any;
  }
  
  export interface GridColumnsManagementProps {
      sort?: 'asc' | 'desc';
      searchPredicate?: (column: GridColDef, searchValue: string) => boolean;
      searchInputProps?: Partial<TextFieldProps>;
      /**
       * The milliseconds delay to wait after a keystroke before triggering filtering in the columns menu.
       * @default 150
       */
      searchDebounceMs?: DataGridProcessedProps['columnFilterDebounceMs'];
      /**
       * If `true`, the column search field will be focused automatically.
       * If `false`, the first column switch input will be focused automatically.
       * This helps to avoid input keyboard panel to popup automatically on touch devices.
       * @default true
       */
      autoFocusSearchField?: boolean;
      /**
       * If `true`, the `Show/Hide all` toggle checkbox will not be displayed.
       * @default false
       */
      disableShowHideToggle?: boolean;
      /**
       * If `true`, the `Reset` button will not be disabled
       * @default false
       */
      disableResetButton?: boolean;
      /**
       * Changes the behavior of the `Show/Hide All` toggle when the search field is used:
       * - `all`: Will toggle all columns.
       * - `filteredOnly`: Will only toggle columns that match the search criteria.
       * @default 'all'
       */
      toggleAllMode?: 'all' | 'filteredOnly';
      /**
       * Returns the list of togglable columns.
       * If used, only those columns will be displayed in the panel
       * which are passed as the return value of the function.
       * @param {GridColDef[]} columns The `ColDef` list of all columns.
       * @returns {GridColDef['field'][]} The list of togglable columns' field names.
       */
      getTogglableColumns?: (columns: GridColDef[]) => GridColDef['field'][];
  }
  
  /**
   * Meta Info about columns.
   */
  export interface GridColumnsMeta {
      totalWidth: number;
      positions: number[];
  }
  
  type GridColumnSortButtonProps = GridSlotProps['baseIconButton'] & {
      field: string;
      direction: GridSortDirection;
      index?: number;
      sortingOrder: readonly GridSortDirection[];
      disabled?: boolean;
      onClick?: (event: React_2.MouseEvent<HTMLButtonElement>) => void;
  };
  
  export function GridColumnsPanel(props: GridColumnsPanelProps): React_2.JSX.Element;
  
  export interface GridColumnsPanelProps extends GridPanelWrapperProps {}
  
  /**
   * The Column Spanning API interface that is available in the grid `apiRef`.
   */
  interface GridColumnSpanningApi {
      /**
       * Returns cell colSpan info.
       * @param {GridRowId} rowId The row id
       * @param {number} columnIndex The column index (0-based)
       * @returns {GridCellColSpanInfo|undefined} Cell colSpan info
       * @ignore - do not document.
       */
      unstable_getCellColSpanInfo: (rowId: GridRowId, columnIndex: GridColumnIndex) => GridCellColSpanInfo | undefined;
  }
  
  interface GridColumnSpanningPrivateApi {
      /** Reset the colspan cache */
      resetColSpan: () => void;
      /**
       * Calculate column spanning for each cell in the row
       * @param {GridRowId} rowId The row id
       * @param {number} minFirstColumn First visible column index
       * @param {number} maxLastColumn Last visible column index
       * @param {GridStateColDef[]} columns List of columns to calculate colSpan for
       */
      calculateColSpan: (rowId: GridRowId, minFirstColumn: number, maxLastColumn: number, columns: GridStateColDef[]) => void;
  }
  
  export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
      lookup: GridColumnRawLookup;
  };
  
  export interface GridColumnsRenderContext {
      firstColumnIndex: number;
      lastColumnIndex: number;
  }
  
  export interface GridColumnsState {
      orderedFields: string[];
      lookup: GridColumnLookup;
      columnVisibilityModel: GridColumnVisibilityModel;
      initialColumnVisibilityModel: GridColumnVisibilityModel;
  }
  
  /**
   * Get the columns state
   * @category Columns
   */
  export const gridColumnsStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridColumnsState_2>;
  
  /**
   * Get the summed width of all the visible columns.
   * @category Visible Columns
   */
  export const gridColumnsTotalWidthSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  export interface GridColumnTypes {
      string: 'string';
      number: 'number';
      date: 'date';
      dateTime: 'dateTime';
      boolean: 'boolean';
      singleSelect: 'singleSelect';
      actions: 'actions';
      custom: 'custom';
  }
  
  export type GridColumnTypesRecord = Record<GridColType, GridColTypeDef>;
  
  interface GridColumnUnsortedIconProps extends GridBaseIconProps {
      sortingOrder: GridSortDirection[];
  }
  
  export type GridColumnVisibilityModel = Record<GridColDef['field'], boolean>;
  
  /**
   * Get the column visibility model, containing the visibility status of each column.
   * If a column is not registered in the model, it is visible.
   * @category Visible Columns
   */
  export const gridColumnVisibilityModelSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnVisibilityModel_2;
  
  /**
   * The type of the sort comparison function.
   * @param {V} v1 The first value to compare.
   * @param {V} v2 The second value to compare.
   * @param {GridSortCellParams<V>} cellParams1 The parameters of the first cell.
   * @param {GridSortCellParams<V>} cellParams2 The parameters of the second cell.
   * @returns {number} The result of the comparison.
   */
  export type GridComparatorFn<V = any> = (v1: V, v2: V, cellParams1: GridSortCellParams<V>, cellParams2: GridSortCellParams<V>) => number;
  
  interface GridConfiguration<Api extends GridPrivateApiCommon = GridPrivateApiCommunity, Props = DataGridProcessedProps> {
      hooks: GridInternalHook<Api, Props>;
  }
  
  export function GridContextProvider({
      privateApiRef,
      configuration,
      props,
      children
  }: GridContextProviderProps): React_2.JSX.Element;
  
  type GridContextProviderProps = {
      privateApiRef: RefObject<GridPrivateApiCommunity>;
      configuration: GridConfiguration;
      props: {};
      children: React_2.ReactNode;
  };
  
  export interface GridControlledStateEventLookup {
      /**
       * Fired when the pagination model changes.
       */
      paginationModelChange: {
          params: GridPaginationModel;
      };
      /**
       * Fired when the filter model changes.
       */
      filterModelChange: {
          params: GridFilterModel;
      };
      /**
       * Fired when the sort model changes.
       */
      sortModelChange: {
          params: GridSortModel;
      };
      /**
       * Fired when the selection state of one or multiple rows changes.
       */
      rowSelectionChange: {
          params: GridRowSelectionModel;
      };
      /**
       * Fired when the column visibility model changes.
       */
      columnVisibilityModelChange: {
          params: GridColumnVisibilityModel;
      };
      /**
       * Fired when the row count change.
       */
      rowCountChange: {
          params: number;
      };
      /**
       * Fired when the density changes.
       */
      densityChange: {
          params: GridDensity;
      };
      /**
       * Fired when the pagination meta change.
       */
      paginationMetaChange: {
          params: GridPaginationMeta;
      };
  }
  
  export interface GridControlledStateReasonLookup {
      filter: 'upsertFilterItem' | 'upsertFilterItems' | 'deleteFilterItem' | 'changeLogicOperator' | 'restoreState' | 'removeAllFilterItems';
      pagination: 'setPaginationModel' | 'stateRestorePreProcessing';
      rows: 'addSkeletonRows';
      rowSelection: 'singleRowSelection' | 'multipleRowsSelection';
  }
  
  interface GridControlStateItem<State extends GridStateCommunity, Args, E extends keyof GridControlledStateEventLookup> {
      stateId: string;
      propModel?: GridEventLookup[E]['params'];
      stateSelector: OutputSelector<State, Args, GridControlledStateEventLookup[E]['params']> | ((apiRef: RefObject<{
          state: State;
      }>) => GridControlledStateEventLookup[E]['params']);
      propOnChange?: (model: GridControlledStateEventLookup[E]['params'], details: GridCallbackDetails) => void;
      changeEvent: E;
  }
  
  /**
   * The core API interface that is available in the grid `apiRef`.
   */
  export interface GridCoreApi {
      /**
       * The React ref of the grid root container div element.
       * @ignore - do not document.
       */
      rootElementRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * Registers a handler for an event.
       * @param {string} event The name of the event.
       * @param {function} handler The handler to be called.
       * @param {object} options Additional options for this listener.
       * @returns {function} A function to unsubscribe from this event.
       */
      subscribeEvent: <E extends GridEvents>(event: E, handler: GridEventListener<E>, options?: EventListenerOptions_2) => () => void;
      /**
       * Emits an event.
       * @param {GridEvents} name The name of the event.
       * @param {any} params Arguments to be passed to the handlers.
       * @param {MuiEvent<MuiBaseEvent>} event The event object to pass forward.
       */
      publishEvent: GridEventPublisher;
      /**
       * Unique identifier for each component instance in a page.
       * @ignore - do not document.
       */
      instanceId: {
          id: number;
      };
      /**
       * The pub/sub store containing a reference to the public state.
       * @ignore - do not document.
       */
      store: Store<GridApiCommon['state']>;
  }
  
  interface GridCorePrivateApi<GridPublicApi extends GridApiCommon, GridPrivateApi extends GridPrivateApiCommon, GridProps extends DataGridProcessedProps> {
      /**
       * The caches used by hooks and state initializers.
       */
      caches: GridApiCaches;
      /**
       * Registers a method on the public or private API.
       * @param {'public' | 'private'} visibility The visibility of the methods.
       * @param {Partial<GridApiRef>} methods The methods to register.
       */
      /**
       * The generic event emitter manager.
       */
      eventManager: EventManager;
      /**
       * The React ref of the grid main container div element.
       */
      mainElementRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * The React ref of the grid's virtual scroller container element.
       */
      virtualScrollerRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * The React ref of the grid's vertical virtual scrollbar container element.
       */
      virtualScrollbarVerticalRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * The React ref of the grid's horizontal virtual scrollbar container element.
       */
      virtualScrollbarHorizontalRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * The React ref of the grid column container virtualized div element.
       */
      columnHeadersContainerRef: React_2.RefObject<HTMLDivElement | null>;
      /**
       * The React ref of the grid header filter row element.
       */
      headerFiltersElementRef?: React_2.RefObject<HTMLDivElement | null>;
      register: <V extends 'public' | 'private', T extends (V extends 'public' ? Partial<GridPublicApi> : Partial<Omit<GridPrivateApi, keyof GridPublicApi>>)>(visibility: V, methods: T) => void;
      /**
       * Returns the public API.
       * Can be useful on a feature hook if we want to pass the `apiRef` to a callback.
       * Do not use it to access the public method in private parts of the codebase.
       * @returns {GridPublicApi} The public api.
       */
      getPublicApi: () => GridPublicApi;
      /**
       * Allows to access the root props outside of the React component.
       * Do not use in React components - use the `useGridRootProps` hook instead.
       */
      rootProps: GridProps;
  }
  
  type GridCSSVariablesInterface = { [E in CreateObjectEntries<typeof keys> as E['value']]: string | number };
  
  /**
   * The CSV export API interface that is available in the grid [[apiRef]].
   */
  export interface GridCsvExportApi {
      /**
       * Returns the grid data as a CSV string.
       * This method is used internally by `exportDataAsCsv`.
       * @param {GridCsvExportOptions} options The options to apply on the export.
       * @returns {string} The data in the CSV format.
       */
      getDataAsCsv: (options?: GridCsvExportOptions) => string;
      /**
       * Downloads and exports a CSV of the grid's data.
       * @param {GridCsvExportOptions} options The options to apply on the export.
       */
      exportDataAsCsv: (options?: GridCsvExportOptions) => void;
  }
  
  export function GridCsvExportMenuItem(props: GridCsvExportMenuItemProps): React_2.JSX.Element;
  
  export namespace GridCsvExportMenuItem {
      var propTypes: any;
  }
  
  export type GridCsvExportMenuItemProps = GridExportMenuItemProps<GridCsvExportOptions>;
  
  /**
   * The options to apply on the CSV export.
   * @demos
   *   - [CSV export](/x/react-data-grid/export/#csv-export)
   */
  export interface GridCsvExportOptions extends GridFileExportOptions {
      /**
       * The character used to separate fields.
       * @default ','
       */
      delimiter?: string;
      /**
       * The string used as the file name.
       * @default document.title
       */
      fileName?: string;
      /**
       * If `true`, the UTF-8 Byte Order Mark (BOM) prefixes the exported file.
       * This can allow Excel to automatically detect file encoding as UTF-8.
       * @default false
       */
      utf8WithBom?: boolean;
      /**
       * If `true`, the CSV will include the column headers and column groups.
       * Use `includeColumnGroupsHeaders` to control whether the column groups are included.
       * @default true
       */
      includeHeaders?: boolean;
      /**
       * If `true`, the CSV will include the column groups.
       * @see See {@link https://mui.com/x/react-data-grid/column-groups/ column groups docs} for more details.
       * @default true
       */
      includeColumnGroupsHeaders?: boolean;
      /**
       * Function that returns the list of row ids to export on the order they should be exported.
       * @param {GridCsvGetRowsToExportParams} params With all properties from [[GridCsvGetRowsToExportParams]].
       * @returns {GridRowId[]} The list of row ids to export.
       */
      getRowsToExport?: (params: GridCsvGetRowsToExportParams) => GridRowId[];
      /**
       * @ignore
       * If `false`, the quotes will not be appended to the cell value.
       * @default true
       */
      shouldAppendQuotes?: boolean;
  }
  
  export interface GridCsvGetRowsToExportParams<Api extends GridApiCommon = GridApiCommunity> extends GridGetRowsToExportParams<Api> {}
  
  export interface GridDataGroupNode extends GridBasicGroupNode {
      /**
       * If `true`, this node has been automatically generated by the grid.
       * In the row grouping, all groups are auto-generated
       * In the tree data, some groups can be passed in the rows
       */
      isAutoGenerated: false;
  }
  
  export interface GridDataPinnedRowNode extends GridBasicPinnedRowNode {
      /**
       * If `true`, this node has been automatically generated by the grid.
       */
      isAutoGenerated: true;
  }
  
  /**
   * @category Rows
   */
  export const gridDataRowIdsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowId[];
  
  export interface GridDataSource {
      /**
       * This method will be called when the grid needs to fetch some rows.
       * @param {GridGetRowsParams} params The parameters required to fetch the rows.
       * @returns {Promise<GridGetRowsResponse>} A promise that resolves to the data of type [GridGetRowsResponse].
       */
      getRows(params: GridGetRowsParams): Promise<GridGetRowsResponse>;
      /**
       * This method will be called when the user updates a row.
       * @param {GridUpdateRowParams} params The parameters required to update the row.
       * @returns {Promise<any>} If resolved (synced on the backend), the grid will update the row and mutate the cache.
       */
      updateRow?(params: GridUpdateRowParams): Promise<any>;
  }
  
  export interface GridDataSourceApi {
      /**
       * The data source API.
       */
      dataSource: {
          /**
           * Fetches the rows from the server.
           * If no `parentId` option is provided, it fetches the root rows.
           * Any missing parameter from `params` will be filled from the state (sorting, filtering, etc.).
           * @param {GridRowId} parentId The id of the parent node (default: `GRID_ROOT_GROUP_ID`).
           * @param {GridDataSourceFetchRowsParams<GridGetRowsParams>} params Request parameters override.
           * @returns {Promise<void>} A promise that resolves when the rows are fetched.
           */
          fetchRows: (parentId?: GridRowId, params?: GridDataSourceFetchRowsParams<GridGetRowsParams>) => Promise<void>;
          /**
           * The data source cache object.
           */
          cache: GridDataSourceCache;
          /**
           * Syncs the row with the server and updates in the grid.
           * @param {GridUpdateRowParams} params The parameters for the edit operation.
           * @returns {Promise<GridRowModel> | undefined} The updated row or `undefined` if `dataSource.updateRow` is not passed.
           */
          editRow: (params: GridUpdateRowParams) => Promise<GridRowModel> | undefined;
      };
  }
  
  export interface GridDataSourceApiBase {
      fetchRows: GridDataSourceApi['dataSource']['fetchRows'];
      cache: GridDataSourceApi['dataSource']['cache'];
      editRow: GridDataSourceApi['dataSource']['editRow'];
  }
  
  export interface GridDataSourceCache {
      /**
       * Set the cache entry for the given key.
       * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
       * @param {GridGetRowsResponse} value The value to be stored in the cache.
       */
      set: (key: GridGetRowsParams, value: GridGetRowsResponse) => void;
      /**
       * Get the cache entry for the given key.
       * @param {GridGetRowsParams} key The key of type `GridGetRowsParams`.
       * @returns {GridGetRowsResponse} The value stored in the cache.
       */
      get: (key: GridGetRowsParams) => GridGetRowsResponse | undefined;
      /**
       * Clear the cache.
       */
      clear: () => void;
  }
  
  export class GridDataSourceCacheDefault {
      private cache;
      private ttl;
      private getKey;
      constructor({
          ttl,
          getKey
      }: GridDataSourceCacheDefaultConfig);
      set(key: GridGetRowsParams, value: GridGetRowsResponse): void;
      get(key: GridGetRowsParams): GridGetRowsResponse | undefined;
      clear(): void;
  }
  
  export type GridDataSourceCacheDefaultConfig = {
      /**
       * Time To Live for each cache entry in milliseconds.
       * After this time the cache entry will become stale and the next query will result in cache miss.
       * @default 300_000 (5 minutes)
       */
      ttl?: number;
      /**
       * Function to generate a cache key from the params.
       * @param {GridGetRowsParams} params The params to generate the cache key from.
       * @returns {string} The cache key.
       * @default `getKeyDefault()`
       */
      getKey?: (params: GridGetRowsParams) => string;
  };
  
  /**
   * The parameters for the `fetchRows` method.
   */
  type GridDataSourceFetchRowsParams<T> = Partial<T> & GridGetRowsOptions;
  
  export interface GridDataSourceGroupNode extends GridDataGroupNode {
      /**
       * Number of children this node has on the server. Equals to `-1` if there are some children but the count is unknown.
       */
      serverChildrenCount: number;
      /**
       * The cached path to be passed on as `groupKey` to the server.
       */
      path: string[];
  }
  
  export const gridDateComparator: GridComparatorFn;
  
  export const gridDateFormatter: GridValueFormatter;
  
  export const gridDateTimeFormatter: GridValueFormatter;
  
  export const GridDeleteForeverIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridDeleteIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * Available densities.
   */
  export type GridDensity = 'compact' | 'standard' | 'comfortable';
  
  /**
   * The density API interface that is available in the grid `apiRef`.
   */
  export interface GridDensityApi {
      /**
       * Sets the density of the grid.
       * @param {string} density Can be: `"compact"`, `"standard"`, `"comfortable"`.
       */
      setDensity: (density: GridDensity) => void;
  }
  
  export const gridDensityFactorSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  export interface GridDensityOption {
      icon: React_2.ReactElement<any>;
      label: string;
      value: GridDensity;
  }
  
  export const gridDensitySelector: OutputSelector_2<GridStateCommunity, unknown, GridDensity>;
  
  export type GridDensityState = GridDensity;
  
  interface GridDetailPanelsProps {
      virtualScroller: VirtualScrollerCompat;
  }
  
  export interface GridDimensions extends DimensionsState {
      /**
       * Height of one column header.
       */
      headerHeight: number;
      /**
       * Height of one column group header.
       */
      groupHeaderHeight: number;
      /**
       * Height of header filters.
       */
      headerFilterHeight: number;
      /**
       * Height of all the column headers.
       */
      headersTotalHeight: number;
  }
  
  export interface GridDimensionsApi {
      /**
       * Returns the dimensions of the grid
       * @returns {GridDimensions} The dimension information of the grid. If `null`, the grid is not ready yet.
       */
      getRootDimensions: () => GridDimensions;
  }
  
  interface GridDimensionsPrivateApi {
      /**
       * Recalculates the grid layout. This should be called when an operation has changed the size
       * of the content of the grid.
       */
      updateDimensions: () => void;
      /**
       * Returns the amount of rows that are currently visible in the viewport
       * @returns {number} The amount of rows visible in the viewport
       */
      getViewportPageSize: () => number;
  }
  
  export const gridDimensionsSelector: OutputSelector_2<GridStateCommunity, unknown, GridDimensions_2>;
  
  export type GridDimensionsState = GridDimensions;
  
  export const GridDownloadIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridDragIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export function GridEditBooleanCell(props: GridEditBooleanCellProps): React_2.JSX.Element;
  
  export namespace GridEditBooleanCell {
      var propTypes: any;
  }
  
  export interface GridEditBooleanCellProps extends GridRenderEditCellParams, Omit<React_2.DetailedHTMLProps<React_2.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, 'id' | 'tabIndex'> {
      /**
       * Callback called when the value is changed by the user.
       * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
       * @param {boolean} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
       * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
       */
      onValueChange?: (event: React_2.ChangeEvent<HTMLInputElement>, newValue: boolean) => Promise<void> | void;
  }
  
  interface GridEditCellMeta {
      changeReason?: 'debouncedSetEditCellValue' | 'setEditCellValue';
  }
  
  export interface GridEditCellProps<V = any> {
      value?: V | undefined;
      isValidating?: boolean;
      isProcessingProps?: boolean;
      changeReason?: GridEditCellMeta['changeReason'];
      [prop: string]: any;
  }
  
  export const gridEditCellStateSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>, args_1: {
      rowId: GridRowId;
      field: string;
  }) => GridEditCellProps_2<any>;
  
  /**
   * Params passed to `apiRef.current.setEditCellValue`.
   */
  export interface GridEditCellValueParams {
      /**
       * The row id.
       */
      id: GridRowId;
      /**
       * The field.
       */
      field: string;
      /**
       * The new value for the cell.
       */
      value: any;
      /**
       * The debounce time in milliseconds.
       */
      debounceMs?: number;
      /**
       * TBD
       */
      unstable_skipValueParser?: boolean;
  }
  
  export function GridEditDateCell(props: GridEditDateCellProps): React_2.JSX.Element;
  
  export namespace GridEditDateCell {
      var propTypes: any;
  }
  
  export interface GridEditDateCellProps extends GridRenderEditCellParams {
      /**
       * Callback called when the value is changed by the user.
       * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
       * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
       * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
       */
      onValueChange?: (event: React_2.ChangeEvent<HTMLInputElement>, newValue: Date | null) => Promise<void> | void;
      slotProps?: {
          root?: Partial<GridSlotProps['baseInput']>;
      };
  }
  
  /**
   * The editing API interface that is available in the grid `apiRef`.
   */
  export interface GridEditingApi extends GridCellEditingApi, GridRowEditingApi {}
  
  /**
   * The private editing API interface that is available in the grid `privateApiRef`.
   */
  interface GridEditingPrivateApi extends GridCellEditingPrivateApi, GridRowEditingPrivateApi {}
  
  interface GridEditingSharedApi {
      /**
       * Controls if a cell is editable.
       * @param {GridCellParams} params The cell params.
       * @returns {boolean} A boolean value determining if the cell is editable.
       */
      isCellEditable: (params: GridCellParams) => boolean;
      /**
       * Sets the value of the edit cell.
       * Commonly used inside the edit cell component.
       * @param {GridEditCellValueParams} params Contains the id, field and value to set.
       * @param {React.SyntheticEvent} event The event to pass forward.
       * @returns {Promise<boolean> | void} A promise with the validation status.
       */
      setEditCellValue: (params: GridEditCellValueParams, event?: MuiBaseEvent) => Promise<boolean> | void;
      /**
       * Returns the row with the values that were set by editing the cells.
       * In row editing, `field` is ignored and all fields are considered.
       * @param {GridRowId} id The row id being edited.
       * @param {string} field The field being edited.
       * @returns {GridRowModel} The row with edited values.
       */
      getRowWithUpdatedValues: (id: GridRowId, field: string) => GridRowModel;
      /**
       * Gets the meta information for the edit cell.
       * @param {GridRowId} id The row id being edited.
       * @param {string} field The field being edited.
       * @ignore - do not document.
       */
      unstable_getEditCellMeta: (id: GridRowId, field: string) => GridEditCellMeta | null;
  }
  
  interface GridEditingSharedPrivateApi {
      /**
       * Immediately updates the value of the cell, without waiting for the debounce.
       * @param {GridRowId} id The row id.
       * @param {string} field The field to update. If not passed, updates all fields in the given row id.
       */
      runPendingEditCellValueMutation: (id: GridRowId, field?: string) => void;
  }
  
  export type GridEditingState = {
      [rowId: string]: GridEditRowProps;
  };
  
  export const GridEditInputCell: React_2.ForwardRefExoticComponent<GridEditInputCellProps> | React_2.ForwardRefExoticComponent<Omit<GridEditInputCellProps, "ref"> & React_2.RefAttributes<HTMLInputElement>>;
  
  export interface GridEditInputCellProps extends GridRenderEditCellParams {
      debounceMs?: number;
      /**
       * Callback called when the value is changed by the user.
       * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
       * @param {Date | null} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
       * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
       */
      onValueChange?: (event: React_2.ChangeEvent<HTMLInputElement>, newValue: string) => Promise<void> | void;
      slotProps?: {
          root?: Partial<GridSlotProps['baseInput']>;
      };
  }
  
  export type GridEditMode = 'cell' | 'row';
  
  export enum GridEditModes {
      Cell = "cell",
      Row = "row",
  }
  
  export type GridEditRowApi = GridEditingApi;
  
  export type GridEditRowProps = {
      [field: string]: GridEditCellProps;
  };
  
  /**
   * Select the row editing state.
   */
  export const gridEditRowsStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridEditingState_2>;
  
  export function GridEditSingleSelectCell(props: GridEditSingleSelectCellProps): React_2.JSX.Element | null;
  
  export namespace GridEditSingleSelectCell {
      var propTypes: any;
  }
  
  export interface GridEditSingleSelectCellProps extends GridRenderEditCellParams {
      /**
       * Callback called when the value is changed by the user.
       * @param {Event<any>} event The event source of the callback.
       * @param {any} newValue The value that is going to be passed to `apiRef.current.setEditCellValue`.
       * @returns {Promise<void> | void} A promise to be awaited before calling `apiRef.current.setEditCellValue`
       */
      onValueChange?: (event: Parameters<NonNullable<GridSlotProps['baseSelect']['onOpen']>>[0], newValue: any) => Promise<void> | void;
      /**
       * If true, the select opens by default.
       */
      initialOpen?: boolean;
  }
  
  export type GridEventListener<E extends GridEvents> = (params: GridEventLookup[E] extends {
      params: any;
  } ? GridEventLookup[E]['params'] : undefined, event: GridEventLookup[E] extends {
      event: MuiBaseEvent;
  } ? MuiEvent<GridEventLookup[E]['event']> : MuiEvent<{}>, details: GridCallbackDetails) => void;
  
  export interface GridEventLookup extends GridRowEventLookup, GridColumnHeaderEventLookup, GridHeaderFilterEventLookup, GridColumnGroupHeaderEventLookup, GridCellEventLookup, GridControlledStateEventLookup {
      /**
       * Fired when rootElementRef.current becomes available.
       */
      rootMount: {
          params: HTMLElement;
      };
      /**
       * Fired when the grid is unmounted.
       */
      unmount: {};
      /**
       * Fired when the state of the grid is updated.
       */
      stateChange: {
          params: any;
      };
      /**
       * Fired when the grid is resized.
       */
      resize: {
          params: ElementSize;
      };
      /**
       * Fired when the inner size of the viewport changes. Called with an [[ElementSize]] object.
       */
      viewportInnerSizeChange: {
          params: ElementSize;
      };
      /**
       * Fired when the grid is resized with a debounced time of 60ms.
       */
      debouncedResize: {
          params: ElementSize;
      };
      /**
       * Fired when a processor of the active strategy changes.
       * @ignore - do not document.
       */
      activeStrategyProcessorChange: {
          params: GridStrategyProcessorName;
      };
      /**
       * Fired when the callback to decide if a strategy is available or not changes.
       * @ignore - do not document.
       */
      strategyAvailabilityChange: {};
      /**
       * Fired when the columns state is changed.
       */
      columnsChange: {
          params: string[];
      };
      /**
       * Fired when the width of a column is changed.
       */
      columnWidthChange: {
          params: GridColumnResizeParams;
          event: MouseEvent | {};
      };
      /**
       * Fired when the user starts resizing a column.
       */
      columnResizeStart: {
          params: {
              field: string;
          };
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when the user stops resizing a column.
       */
      columnResizeStop: {
          params: null;
          event: MouseEvent;
      };
      /**
       * Fired during the resizing of a column.
       */
      columnResize: {
          params: GridColumnResizeParams;
          event: MouseEvent;
      };
      /**
       * Fired when the user ends reordering a column.
       */
      columnOrderChange: {
          params: GridColumnOrderChangeParams;
      };
      /**
       * Fired when the rows are updated.
       * @ignore - do not document.
       */
      rowsSet: {};
      /**
       * Fired when the filtered rows are updated
       * @ignore - do not document.
       */
      filteredRowsSet: {};
      /**
       * Fired when the sorted rows are updated
       * @ignore - do not document
       */
      sortedRowsSet: {};
      /**
       * Fired when the expansion of a row is changed. Called with a [[GridGroupNode]] object.
       */
      rowExpansionChange: {
          params: GridGroupNode;
      };
      /**
       * Fired when the rendered rows index interval changes. Called with a [[GridRenderContext]] object.
       */
      renderedRowsIntervalChange: {
          params: GridRenderContext;
      };
      /**
       * Fired when the mode of a cell changes.
       * @ignore - do not document
       */
      cellModeChange: {
          params: GridCellParams<any>;
      };
      /**
       * Fired when the model that controls the cell modes changes.
       */
      cellModesModelChange: {
          params: GridCellModesModel;
      };
      /**
       * Fired when the model that controls the row modes changes.
       */
      rowModesModelChange: {
          params: GridRowModesModel;
      };
      /**
       * Fired when the cell turns to edit mode.
       */
      cellEditStart: {
          params: GridCellEditStartParams;
          event: React_2.MouseEvent<HTMLElement> | React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when the cell turns back to view mode.
       */
      cellEditStop: {
          params: GridCellEditStopParams;
          event: MuiBaseEvent;
      };
      /**
       * Fired when the row turns to edit mode.
       */
      rowEditStart: {
          params: GridRowEditStartParams;
          event: React_2.MouseEvent<HTMLElement> | React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when the row turns back to view mode.
       */
      rowEditStop: {
          params: GridRowEditStopParams;
          event: MuiBaseEvent;
      };
      /**
       * Fired when a cell gains focus.
       * @ignore - do not document.
       */
      cellFocusIn: {
          params: GridCellParams<any>;
      };
      /**
       * Fired when a cell loses focus.
       * @ignore - do not document.
       */
      cellFocusOut: {
          params: GridCellParams<any>;
          event: MuiBaseEvent;
      };
      /**
       * Fired during the scroll of the grid viewport.
       */
      scrollPositionChange: {
          params: GridScrollParams;
          event: React_2.UIEvent | MuiBaseEvent;
      };
      /**
       * Fired when the content size used by the `GridVirtualScroller` changes.
       * @ignore - do not document.
       */
      virtualScrollerContentSizeChange: {
          params: {
              columnsTotalWidth: number;
              contentHeight: number;
          };
      };
      /**
       * Fired when the content is scrolled by the mouse wheel.
       * It's attached to the "mousewheel" event.
       * @ignore - do not document.
       */
      virtualScrollerWheel: {
          params: {};
          event: React_2.WheelEvent;
      };
      /**
       * Fired when the content is moved using a touch device.
       * It's attached to the "touchmove" event.
       * @ignore - do not document.
       */
      virtualScrollerTouchMove: {
          params: {};
          event: React_2.TouchEvent;
      };
      /**
       * Fired when the area of height `scrollEndThreshold` is entering the viewport from the bottom.
       * Used to trigger infinite loading.
       * @ignore - do not document.
       */
      rowsScrollEndIntersection: {};
      /**
       * Fired when the value of the selection checkbox of the header is changed.
       */
      headerSelectionCheckboxChange: {
          params: GridHeaderSelectionCheckboxParams;
      };
      /**
       * Fired when the value of the selection checkbox of a row is changed.
       */
      rowSelectionCheckboxChange: {
          params: GridRowSelectionCheckboxParams;
          event: React_2.ChangeEvent<HTMLElement>;
      };
      /**
       * Fired when the data is copied to the clipboard.
       */
      clipboardCopy: {
          params: string;
      };
      /**
       * Fired when the preference panel is closed.
       */
      preferencePanelClose: {
          params: GridPreferencePanelParams;
      };
      /**
       * Fired when the preference panel is opened.
       */
      preferencePanelOpen: {
          params: GridPreferencePanelParams;
      };
      /**
       * Fired when the menu is opened.
       */
      menuOpen: {
          params: GridMenuParams;
      };
      /**
       * Fired when the grid menu is closed.
       */
      menuClose: {
          params: GridMenuParams;
      };
  }
  
  export type GridEventPublisher = <E extends GridEvents>(...params: GridEventPublisherArg<E, GridEventLookup[E]>) => void;
  
  type GridEventPublisherArg<E extends GridEvents, T> = T extends {
      params: any;
      event: MuiBaseEvent;
  } ? PublisherArgsEvent<E, T> : T extends {
      params: any;
  } ? PublisherArgsParams<E, T> : PublisherArgsNoParams<E>;
  
  export type GridEvents = keyof GridEventLookup;
  
  /**
   * Get the amount of rows accessible after the filtering process.
   * @category Filtering
   */
  export const gridExpandedRowCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the id and the model of the rows accessible after the filtering process.
   * Does not contain the collapsed children.
   * @category Filtering
   */
  export const gridExpandedSortedRowEntriesSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowEntry<GridValidRowModel>[];
  
  /**
   * Get the id of the rows accessible after the filtering process.
   * Does not contain the collapsed children.
   * @category Filtering
   */
  export const gridExpandedSortedRowIdsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowId[];
  
  export const GridExpandMoreIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export interface GridExperimentalFeatures {
      /**
       * Emits a warning if the cell receives focus without also syncing the focus state.
       * Only works if NODE_ENV=test.
       */
      warnIfFocusStateIsNotSynced: boolean;
  }
  
  export interface GridExportDisplayOptions {
      /**
       * If `true`, this export option will be removed from the GridToolbarExport menu.
       * @default false
       */
      disableToolbarButton?: boolean;
  }
  
  /**
   * Available export extensions.
   */
  export type GridExportExtension = 'csv';
  
  /**
   * Available export formats.
   */
  export type GridExportFormat = 'csv' | 'print';
  
  export interface GridExportMenuItemProps<Options extends {}> {
      hideMenu?: () => void;
      options?: Options & GridExportDisplayOptions;
  }
  
  /**
   * The options applicable to any export format.
   */
  export interface GridExportOptions {
      /**
       * The columns exported.
       * This should only be used if you want to restrict the columns exports.
       */
      fields?: string[];
      /**
       * If `true`, the hidden columns will also be exported.
       * @default false
       */
      allColumns?: boolean;
  }
  
  /**
   * Object passed as parameter in the `exportState()` grid API method.
   * @demos
   *   - [Restore state with `apiRef`](/x/react-data-grid/state/#restore-the-state-with-apiref)
   */
  export interface GridExportStateParams {
      /**
       * By default, the grid exports all the models.
       * You can switch this property to `true` to only exports models that are either controlled, initialized or modified.
       * For instance, with this property, if you don't control or initialize the `filterModel` and you did not apply any filter, the model won't be exported.
       * Note that the column dimensions are not a model. The grid only exports the dimensions of the modified columns even when `exportOnlyDirtyModels` is false.
       * @default false
       */
      exportOnlyDirtyModels?: boolean;
  }
  
  export type GridFeatureMode = 'client' | 'server';
  
  /**
   * The options applicable to any document export format (CSV and Excel).
   */
  export interface GridFileExportOptions<Api extends GridApiCommon = GridApiCommunity> extends GridExportOptions {
      /**
       * The string used as the file name.
       * @default document.title
       */
      fileName?: string;
      /**
       * If `true`, the first row of the file will include the headers of the grid.
       * @default true
       */
      includeHeaders?: boolean;
      /**
       * Function that returns the list of row ids to export on the order they should be exported.
       * @param {GridGetRowsToExportParams} params With all properties from [[GridGetRowsToExportParams]].
       * @returns {GridRowId[]} The list of row ids to export.
       */
      getRowsToExport?: (params: GridGetRowsToExportParams<Api>) => GridRowId[];
      /**
       * If `false`, the formulas in the cells will not be escaped.
       * It is not recommended to disable this option as it exposes the user to potential CSV injection attacks.
       * See https://owasp.org/www-community/attacks/CSV_Injection for more information.
       * @default true
       */
      escapeFormulas?: boolean;
  }
  
  /**
   * Get the filterable columns as an array.
   * @category Columns
   */
  export const gridFilterableColumnDefinitionsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridStateColDef[];
  
  /**
   * Get the filterable columns as a lookup (an object containing the field for keys and the definition for values).
   * @category Columns
   */
  export const gridFilterableColumnLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnLookup;
  
  export type GridFilterActiveItemsLookup = {
      [field: string]: GridFilterItem[];
  };
  
  /**
   * @category Filtering
   * @ignore - do not document.
   */
  export const gridFilterActiveItemsLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridFilterActiveItemsLookup;
  
  /**
   * @category Filtering
   * @ignore - do not document.
   */
  export const gridFilterActiveItemsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridFilterItem[];
  
  export const GridFilterAltIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * The filter API interface that is available in the grid [[apiRef]].
   */
  export interface GridFilterApi {
      /**
       * Shows the filter panel. If `targetColumnField` is given, a filter for this field is also added.
       * @param {string} targetColumnField The column field to add a filter.
       * @param {string} panelId The unique panel id
       * @param {string} labelId The unique button id
       */
      showFilterPanel: (targetColumnField?: string, panelId?: string, labelId?: string) => void;
      /**
       * Hides the filter panel.
       */
      hideFilterPanel: () => void;
      /**
       * Updates or inserts a [[GridFilterItem]].
       * @param {GridFilterItem} item The filter to update.
       */
      upsertFilterItem: (item: GridFilterItem) => void;
      /**
       * Updates or inserts many [[GridFilterItem]].
       * @param {GridFilterItem[]} items The filters to update.
       */
      upsertFilterItems: (items: GridFilterItem[]) => void;
      /**
       * Applies all filters on all rows.
       * @ignore - do not document.
       */
      unstable_applyFilters: () => void;
      /**
       * Deletes a [[GridFilterItem]].
       * @param {GridFilterItem} item The filter to delete.
       */
      deleteFilterItem: (item: GridFilterItem) => void;
      /**
       * Changes the [[GridLogicOperator]] used to connect the filters.
       * @param {GridLogicOperator} operator The new logic operator. It can be: `"and"` or `"or`".
       */
      setFilterLogicOperator: (operator: GridLogicOperator) => void;
      /**
       * Sets the filter model to the one given by `model`.
       * @param {GridFilterModel} model The new filter model.
       * @param {string} reason The reason for the model to have changed.
       */
      setFilterModel: (model: GridFilterModel, reason?: GridControlledStateReasonLookup['filter']) => void;
      /**
       * Set the quick filter values to the one given by `values`
       * @param {any[]} values The list of element to quick filter
       */
      setQuickFilterValues: (values: any[]) => void;
      /**
       * Returns the value of the `ignoreDiacritics` prop.
       */
      ignoreDiacritics: DataGridProcessedProps['ignoreDiacritics'];
      /**
       * Returns the filter state for the given filter model without applying it to the Data Grid.
       * @param {GridFilterModel} filterModel The filter model to get the state for.
       * @returns {GridStateCommunity['filter']} The filter state.
       */
      getFilterState: (filterModel: GridFilterModel) => GridStateCommunity['filter'];
  }
  
  /**
   * @category Filtering
   * @ignore - do not document.
   */
  export const gridFilteredDescendantCountLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => Record<GridRowId, number>;
  
  /**
   * Get the amount of descendant rows accessible after the filtering process.
   * @category Filtering
   */
  export const gridFilteredDescendantRowCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the amount of rows accessible after the filtering process.
   * Includes top level and descendant rows.
   * @category Filtering
   */
  export const gridFilteredRowCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * @category Filtering
   * @ignore - do not document.
   */
  export const gridFilteredRowsLookupSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => Record<GridRowId, false>;
  
  /**
   * Get the id and the model of the rows accessible after the filtering process.
   * Contains the collapsed children.
   * @category Filtering
   */
  export const gridFilteredSortedRowEntriesSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowEntry<GridValidRowModel>[];
  
  /**
   * Get the id of the rows accessible after the filtering process.
   * Contains the collapsed children.
   * @category Filtering
   */
  export const gridFilteredSortedRowIdsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowId[];
  
  /**
   * Get the id and the model of the top level rows accessible after the filtering process.
   * @category Filtering
   */
  export const gridFilteredSortedTopLevelRowEntriesSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowEntry<GridValidRowModel>[];
  
  /**
   * Get the amount of top level rows accessible after the filtering process.
   * @category Filtering
   */
  export const gridFilteredTopLevelRowCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  export const GridFilterForm: React_2.ForwardRefExoticComponent<GridFilterFormProps> | React_2.ForwardRefExoticComponent<GridFilterFormProps & React_2.RefAttributes<HTMLDivElement>>;
  
  export interface GridFilterFormProps {
      /**
       * The [[GridFilterItem]] representing this form.
       */
      item: GridFilterItem;
      /**
       * If `true`, the logic operator field is rendered.
       * The field will be invisible if `showMultiFilterOperators` is also `true`.
       */
      hasMultipleFilters: boolean;
      /**
       * If `true`, the logic operator field is visible.
       */
      showMultiFilterOperators?: boolean;
      /**
       * If `true`, disables the logic operator field but still renders it.
       */
      disableMultiFilterOperator?: boolean;
      /**
       * A ref allowing to set imperative focus.
       * It can be passed to the el
       */
      focusElementRef?: React_2.Ref<any>;
      /**
       * Callback called when the operator, column field or value is changed.
       * @param {GridFilterItem} item The updated [[GridFilterItem]].
       */
      applyFilterChanges: (item: GridFilterItem) => void;
      /**
       * Callback called when the logic operator is changed.
       * @param {GridLogicOperator} operator The new logic operator.
       */
      applyMultiFilterOperatorChanges: (operator: GridLogicOperator) => void;
      /**
       * Callback called when the delete button is clicked.
       * @param {GridFilterItem} item The deleted [[GridFilterItem]].
       */
      deleteFilter: (item: GridFilterItem) => void;
      /**
       * Allows to filter the columns displayed in the filter form.
       * @param {FilterColumnsArgs} args The columns of the grid and name of field.
       * @returns {GridColDef['field'][]} The filtered fields array.
       */
      filterColumns?: (args: FilterColumnsArgs) => GridColDef['field'][];
      /**
       * Sets the available logic operators.
       * @default [GridLogicOperator.And, GridLogicOperator.Or]
       */
      logicOperators?: GridLogicOperator[];
      /**
       * Changes how the options in the columns selector should be ordered.
       * If not specified, the order is derived from the `columns` prop.
       */
      columnsSort?: 'asc' | 'desc';
      /**
       * Props passed to the delete icon.
       * @default {}
       */
      deleteIconProps?: any;
      /**
       * Props passed to the logic operator input component.
       * @default {}
       */
      logicOperatorInputProps?: any;
      /**
       * Props passed to the operator input component.
       * @default {}
       */
      operatorInputProps?: any;
      /**
       * Props passed to the column input component.
       * @default {}
       */
      columnInputProps?: any;
      /**
       * `true` if the filter is disabled/read only.
       * i.e. `colDef.fiterable = false` but passed in `filterModel`
       * @default false
       */
      readOnly?: boolean;
      /**
       * Props passed to the value input component.
       * @default {}
       */
      valueInputProps?: any;
      /**
       * @ignore - do not document.
       */
      children?: React_2.ReactNode;
  }
  
  interface GridFilteringMethodParams {
      isRowMatchingFilters: GridAggregatedFilterItemApplier | null;
      filterModel: GridFilterModel;
      filterValueGetter: (row: GridRowModel, column: GridColDef) => any;
  }
  
  type GridFilteringMethodValue = Omit<GridFilterState, 'filterModel'>;
  
  export interface GridFilterInitialState {
      filterModel?: GridFilterModel;
  }
  
  export function GridFilterInputBoolean(props: GridFilterInputBooleanProps): React_2.JSX.Element;
  
  export namespace GridFilterInputBoolean {
      var propTypes: any;
  }
  
  export type GridFilterInputBooleanProps = GridFilterInputValueProps<TextFieldProps>;
  
  export function GridFilterInputDate(props: GridFilterInputDateProps): React_2.JSX.Element;
  
  export namespace GridFilterInputDate {
      var propTypes: any;
  }
  
  export type GridFilterInputDateProps = GridFilterInputValueProps<TextFieldProps> & {
      type?: 'date' | 'datetime-local';
  };
  
  export function GridFilterInputMultipleSingleSelect(props: GridFilterInputMultipleSingleSelectProps): React_2.JSX.Element | null;
  
  export namespace GridFilterInputMultipleSingleSelect {
      var propTypes: any;
  }
  
  export type GridFilterInputMultipleSingleSelectProps = GridFilterInputValueProps<Omit<AutocompleteProps<ValueOptions, true, false, true>, 'options'>> & {
      type?: 'singleSelect';
  };
  
  export function GridFilterInputMultipleValue(props: GridFilterInputMultipleValueProps): React_2.JSX.Element;
  
  export namespace GridFilterInputMultipleValue {
      var propTypes: any;
  }
  
  export type GridFilterInputMultipleValueProps = GridFilterInputValueProps<Omit<AutocompleteProps<string, true, false, true>, 'options'>> & {
      type?: 'text' | 'number' | 'date' | 'datetime-local';
  };
  
  export function GridFilterInputSingleSelect(props: GridFilterInputSingleSelectProps): React_2.JSX.Element | null;
  
  export namespace GridFilterInputSingleSelect {
      var propTypes: any;
  }
  
  export type GridFilterInputSingleSelectProps = GridFilterInputValueProps<TextFieldProps> & {
      type?: 'singleSelect';
  };
  
  type GridFilterInputSlotProps = {
      size?: 'small' | 'medium';
      label?: React_2.ReactNode;
      placeholder?: string;
  };
  
  export function GridFilterInputValue(props: GridTypeFilterInputValueProps): React_2.JSX.Element;
  
  export namespace GridFilterInputValue {
      var propTypes: any;
  }
  
  export type GridFilterInputValueProps<T extends GridFilterInputSlotProps = GridFilterInputSlotProps, Api extends GridApiCommon = GridApiCommunity> = {
      item: GridFilterItem;
      applyValue: (value: GridFilterItem) => void;
      apiRef: RefObject<Api>;
      inputRef?: React_2.Ref<HTMLElement | null>;
      focusElementRef?: React_2.Ref<any>;
      headerFilterMenu?: React_2.ReactNode;
      clearButton?: React_2.ReactNode | null;
      /**
       * It is `true` if the filter either has a value or an operator with no value
       * required is selected (for example `isEmpty`)
       */
      isFilterActive?: boolean;
      onFocus?: React_2.FocusEventHandler;
      onBlur?: React_2.FocusEventHandler;
      tabIndex?: number;
      disabled?: boolean;
      className?: string;
      slotProps?: {
          root: T;
      };
  };
  
  /**
   * Filter item definition interface.
   * @demos
   *   - [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)
   */
  export interface GridFilterItem {
      /**
       * Must be unique.
       * Only useful when the model contains several items.
       */
      id?: number | string;
      /**
       * The column from which we want to filter the rows.
       */
      field: GridBaseColDef['field'];
      /**
       * The filtering value.
       * The operator filtering function will decide for each row if the row values is correct compared to this value.
       */
      value?: any;
      /**
       * The name of the operator we want to apply.
       * A custom operator is supported by providing any string value.
       */
      operator: 'contains' | 'doesNotContain' | 'equals' | 'doesNotEqual' | 'startsWith' | 'endsWith' | '=' | '!=' | '>' | '>=' | '<' | '<=' | 'is' | 'not' | 'after' | 'onOrAfter' | 'before' | 'onOrBefore' | 'isEmpty' | 'isNotEmpty' | 'isAnyOf' | (string & {});
  }
  
  type GridFilterItemResult = {
      [key: Required<GridFilterItem>['id']]: boolean;
  };
  
  export const GridFilterListIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * Model describing the filters to apply to the grid.
   * @demos
   *   - [Pass filters to the grid](/x/react-data-grid/filtering/#pass-filters-to-the-data-grid)
   */
  export interface GridFilterModel {
      /**
       * @default []
       */
      items: GridFilterItem[];
      /**
       * - `GridLogicOperator.And`: the row must pass all the filter items.
       * - `GridLogicOperator.Or`: the row must pass at least on filter item.
       * @default GridLogicOperator.And
       */
      logicOperator?: GridLogicOperator;
      /**
       * values used to quick filter rows
       * @default []
       */
      quickFilterValues?: any[];
      /**
       * - `GridLogicOperator.And`: the row must pass all the values.
       * - `GridLogicOperator.Or`: the row must pass at least one value.
       * @default GridLogicOperator.And
       */
      quickFilterLogicOperator?: GridLogicOperator;
      /**
       * If `false`, the quick filter will also consider cell values from hidden columns.
       * @default true
       */
      quickFilterExcludeHiddenColumns?: boolean;
  }
  
  /**
   * Get the current filter model.
   * @category Filtering
   */
  export const gridFilterModelSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridFilterModel_2;
  
  /**
   * Filter operator definition interface.
   * @demos
   *   - [Custom filter operator](/x/react-data-grid/filtering/customization/#create-a-custom-operator)
   */
  export interface GridFilterOperator<R extends GridValidRowModel = any, V = any, F = V, I extends GridFilterInputValueProps<any> = GridFilterInputValueProps> {
      /**
       * The label of the filter operator.
       */
      label?: string;
      /**
       * The label of the filter shown in header filter row.
       */
      headerLabel?: string;
      /**
       * The name of the filter operator.
       * It will be matched with the `operator` property of the filter items.
       */
      value: GridFilterItem['operator'];
      /**
       * The callback that generates a filtering function for a given filter item and column.
       * This function can return `null` to skip filtering for this item and column.
       * @param {GridFilterItem} filterItem The filter item with which we want to filter the column.
       * @param {GridColDef} column The column from which we want to filter the rows.
       * @returns {null | ApplyFilterFn} The function to call to check if a row pass this filter item or not.
       */
      getApplyFilterFn: GetApplyFilterFn<R, V, F>;
      /**
       * The input component to render in the filter panel for this filter operator.
       */
      InputComponent?: React_2.JSXElementConstructor<I>;
      /**
       * The props to pass to the input component in the filter panel for this filter operator.
       */
      InputComponentProps?: Partial<I>;
      /**
       * Converts the value of a filter item to a human-readable form.
       * @param {GridFilterItem['value']} value The filter item value.
       * @returns {string} The value formatted to be displayed in the UI of filter button tooltip.
       */
      getValueAsString?: (value: GridFilterItem['value']) => string;
      /**
       * If `false`, filter operator doesn't require user-entered value to work.
       * Usually should be set to `false` for filter operators that don't have `InputComponent` (for example `isEmpty`)
       * @default true
       */
      requiresFilterValue?: boolean;
  }
  
  export const GridFilterPanel: React_2.ForwardRefExoticComponent<GridFilterPanelProps> | React_2.ForwardRefExoticComponent<GridFilterPanelProps & React_2.RefAttributes<HTMLDivElement>>;
  
  interface GridFilterPanelProps extends Pick<GridFilterFormProps, 'logicOperators' | 'columnsSort'> {
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
      sx?: SxProps<Theme>;
      /**
       * Function that returns the next filter item to be picked as default filter.
       * @param {GetColumnForNewFilterArgs} args Currently configured filters and columns.
       * @returns {GridColDef['field']} The field to be used for the next filter or `null` to prevent adding a filter.
       */
      getColumnForNewFilter?: (args: GetColumnForNewFilterArgs) => GridColDef['field'] | null;
      /**
       * Props passed to each filter form.
       */
      filterFormProps?: Pick<GridFilterFormProps, 'columnsSort' | 'deleteIconProps' | 'logicOperatorInputProps' | 'operatorInputProps' | 'columnInputProps' | 'valueInputProps' | 'filterColumns'>;
      /**
       * If `true`, the `Add filter` button will not be displayed.
       * @default false
       */
      disableAddFilterButton?: boolean;
      /**
       * If `true`, the `Remove all` button will be disabled
       * @default false
       */
      disableRemoveAllButton?: boolean;
      /**
       * @ignore - do not document.
       */
      children?: React_2.ReactNode;
  }
  
  export interface GridFilterState {
      filterModel: GridFilterModel;
      /**
       * Filtering status for each row.
       * A row is filtered if it is passing the filters, whether its parents are expanded or not.
       * All the rows are filtered except the ones registered in this lookup with `false` values.
       * This is the equivalent of the `visibleRowsLookup` if all the groups were expanded.
       */
      filteredRowsLookup: Record<GridRowId, false>;
      /**
       * Amount of children that are passing the filters or have children that are passing the filter (does not count grand children).
       * If a row is not registered in this lookup, it is supposed to have no descendant passing the filters.
       * If `GridDataSource` is being used to load the data, the value is `-1` if there are some children but the count is unknown.
       */
      filteredChildrenCountLookup: Record<GridRowId, number>;
      /**
       * Amount of descendants that are passing the filters.
       * For the Tree Data, it includes all the intermediate depth levels (= amount of children + amount of grand children + ...).
       * For the Row grouping by column, it does not include the intermediate depth levels (= amount of descendant of maximum depth).
       * If a row is not registered in this lookup, it is supposed to have no descendant passing the filters.
       */
      filteredDescendantCountLookup: Record<GridRowId, number>;
  }
  
  export interface GridFocusApi {
      /**
       * Sets the focus to the cell at the given `id` and `field`.
       * @param {GridRowId} id The row id.
       * @param {string} field The column field.
       */
      setCellFocus: (id: GridRowId, field: string) => void;
      /**
       * Sets the focus to the column header at the given `field`.
       * @param {string} field The column field.
       * @param {string} event The event that triggers the action.
       */
      setColumnHeaderFocus: (field: string, event?: MuiBaseEvent) => void;
      /**
       * Sets the focus to the column header filter at the given `field`.
       * @param {string} field The column field.
       * @param {string} event The event that triggers the action.
       */
      setColumnHeaderFilterFocus: (field: string, event?: MuiBaseEvent) => void;
  }
  
  export const gridFocusCellSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridCellCoordinates_2 | null;
  
  export const gridFocusColumnGroupHeaderSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnGroupIdentifier_2 | null;
  
  export const gridFocusColumnHeaderFilterSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnIdentifier_2 | null;
  
  export const gridFocusColumnHeaderSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridColumnIdentifier_2 | null;
  
  interface GridFocusPrivateApi {
      /**
       * Sets the focus to the column group header at the given `field` and given depth.
       * @param {string} field The column field.
       * @param {number} depth The group depth.
       * @param {object} event The event that triggers the action.
       */
      setColumnGroupHeaderFocus: (field: string, depth: number, event?: MuiBaseEvent) => void;
      /**
       * Gets the focus to the column group header at the given `field` and given depth.
       * @returns {GridColumnGroupIdentifier | null} focused
       */
      getColumnGroupHeaderFocus: () => GridColumnGroupIdentifier | null;
      /**
       * Moves the focus to the cell situated at the given direction.
       * If field is the last and direction=right, the focus goes to the next row.
       * If field is the first and direction=left, the focus goes to the previous row.
       * @param {GridRowId} id The base row id.
       * @param {string} field The base column field.
       * @param {'below' | 'right' | 'left'} direction Which direction is the next cell to focus.
       */
      moveFocusToRelativeCell: (id: GridRowId, field: string, direction: 'below' | 'right' | 'left') => void;
  }
  
  export interface GridFocusState {
      cell: GridCellCoordinates | null;
      columnHeader: GridColumnIdentifier | null;
      columnHeaderFilter: GridColumnIdentifier | null;
      columnGroupHeader: GridColumnGroupIdentifier | null;
  }
  
  export const gridFocusStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridFocusState>;
  
  export const GridFooter: React_2.ForwardRefExoticComponent<GridFooterContainerProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export const GridFooterContainer: React_2.ForwardRefExoticComponent<GridFooterContainerProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export type GridFooterContainerProps = React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  };
  
  export interface GridFooterNode extends GridTreeBasicNode {
      type: 'footer';
      /**
       * The id of the group containing this node.
       */
      parent: GridRowId;
  }
  
  export function GridFooterPlaceholder(): React_2.JSX.Element | null;
  
  export const GridGenericColumnMenu: React_2.ForwardRefExoticComponent<GridGenericColumnMenuProps> | React_2.ForwardRefExoticComponent<GridGenericColumnMenuProps & React_2.RefAttributes<HTMLUListElement>>;
  
  export interface GridGenericColumnMenuProps extends GridColumnMenuRootProps, GridColumnMenuContainerProps {}
  
  export class GridGetRowsError<T extends GridGetRowsParams = GridGetRowsParams> extends Error {
      /**
       * The parameters used in the failed request
       */
      readonly params: T;
      /**
       * The original error that caused this error
       */
      readonly cause?: Error;
      constructor(options: {
          message: string;
          params: T;
          cause?: Error;
      });
  }
  
  interface GridGetRowsOptions {
      /**
       * If `true`, bypasses the cache and forces a refetch of the rows from the server.
       * The response will be used to refresh the cache.
       */
      skipCache?: boolean;
      /**
       * By default, the grid tries to keep the children expanded and attached to the parent with the same ID after the data is re-fetched.
       * If `keepChildrenExpanded` is `false`, the children of the parent with the `parentId` (all children for the root level data fetch) will be collapsed and removed from the tree.
       * @default true
       */
      keepChildrenExpanded?: boolean;
  }
  
  export interface GridGetRowsParams {
      sortModel: GridSortModel;
      filterModel: GridFilterModel;
      /**
       * Alternate to `start` and `end`, maps to `GridPaginationModel` interface.
       */
      paginationModel?: GridPaginationModel;
      /**
       * First row index to fetch (number) or cursor information (number | string).
       */
      start: number | string;
      /**
       * Last row index to fetch.
       */
      end: number;
  }
  
  export interface GridGetRowsResponse {
      rows: GridRowModel[];
      /**
       * To reflect updates in total `rowCount` (optional).
       * Useful when the `rowCount` is inaccurate (for example when filtering) or not available upfront.
       */
      rowCount?: number;
      /**
       * Additional `pageInfo` for advanced use-cases.
       * `hasNextPage`: When row count is unknown/estimated, `hasNextPage` will be used to check if more records are available on server.
       */
      pageInfo?: {
          hasNextPage?: boolean;
          nextCursor?: string;
      };
  }
  
  export interface GridGetRowsToExportParams<Api extends GridApiCommon = GridApiCommunity> {
      /**
       * The API of the grid.
       */
      apiRef: RefObject<Api>;
  }
  
  type GridGroupingStructure = {
      groupId: null | string;
      columnFields: string[];
  };
  
  export type GridGroupNode = GridDataGroupNode | GridAutoGeneratedGroupNode;
  
  /**
   * Checks if some column has a colSpan field.
   * @category Columns
   * @ignore - Do not document
   */
  export const gridHasColSpanSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => boolean;
  
  export function GridHeader(): React_2.JSX.Element;
  
  export const GridHeaderCheckbox: React_2.ForwardRefExoticComponent<GridColumnHeaderParams<GridValidRowModel_2, any, any>> | React_2.ForwardRefExoticComponent<GridColumnHeaderParams<GridValidRowModel_2, any, any> & React_2.RefAttributes<HTMLButtonElement>>;
  
  export interface GridHeaderFilterEventLookup {
      /**
       * Fired when a column header filter is clicked
       * @ignore - do not document.
       */
      headerFilterClick: {
          params: GridColumnHeaderParams;
          event: React_2.MouseEvent<HTMLElement>;
      };
      /**
       * Fired when a key is pressed in a column header filter. It's mapped to the `keydown` DOM event.
       * @ignore - do not document.
       */
      headerFilterKeyDown: {
          params: GridColumnHeaderParams;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when a mouse is pressed in a column header filter. It's mapped to the `mousedown` DOM event.
       * @ignore - do not document.
       */
      headerFilterMouseDown: {
          params: GridColumnHeaderParams;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
      /**
       * Fired when a column header filter is blurred.
       * @ignore - do not document.
       */
      headerFilterBlur: {
          params: GridColumnHeaderParams;
          event: React_2.KeyboardEvent<HTMLElement>;
      };
  }
  
  interface GridHeaderFilteringApi {
      /**
       * Puts the cell corresponding to the given row id and field into edit mode.
       * @param {GridColDef['field']} field The field of the header filter to put in edit mode.
       */
      startHeaderFilterEditMode: (field: GridColDef['field']) => void;
      /**
       * Stops the edit mode for the current field.
       */
      stopHeaderFilterEditMode: () => void;
      /**
       * Opens the header filter menu for the given field.
       * @param {GridColDef['field']} field The field of the header filter to open menu for.
       */
      showHeaderFilterMenu: (field: GridColDef['field']) => void;
      /**
       * Hides the header filter menu.
       */
      hideHeaderFilterMenu: () => void;
  }
  
  export const gridHeaderFilteringEditFieldSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => string | null;
  
  export const gridHeaderFilteringEnabledSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => boolean;
  
  export const gridHeaderFilteringMenuSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => string | null;
  
  interface GridHeaderFilteringPrivateApi {
      /**
       * Internal function to set the header filter state.
       * @param {Partial<GridHeaderFilteringState>} headerFilterState The field to be edited.
       * @ignore - do not document.
       */
      setHeaderFilterState: (headerFilterState: Partial<GridHeaderFilteringState>) => void;
  }
  
  type GridHeaderFilteringState = {
      enabled: boolean;
      editing: GridColDef['field'] | null;
      menuOpen: GridColDef['field'] | null;
  };
  
  export const gridHeaderFilteringStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridHeaderFilteringState>;
  
  export interface GridHeaderSelectionCheckboxParams {
      value: boolean;
  }
  
  export type GridHydrateColumnsValue = GridColumnsRawState;
  
  type GridHydrateRowsValue = Pick<GridRowsState, 'tree' | 'treeDepths' | 'dataRowIds' | 'dataRowIdToModelLookup' | 'additionalRowGroups'>;
  
  /**
   * Set of icons used in the grid component UI.
   */
  export interface GridIconSlotsComponent {
      /**
       * Icon displayed on the boolean cell to represent the true value.
       * @default GridCheckIcon
       */
      booleanCellTrueIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the boolean cell to represent the false value.
       * @default GridCloseIcon
       */
      booleanCellFalseIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the side of the column header title to display the filter input component.
       * @default GridTripleDotsVerticalIcon
       */
      columnMenuIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the open filter button present in the toolbar by default.
       * @default GridFilterListIcon
       */
      openFilterButtonIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the column header menu to show that a filter has been applied to the column.
       * @default GridFilterAltIcon
       */
      columnFilteredIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the column menu selector tab.
       * @default GridColumnIcon
       */
      columnSelectorIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the side of the column header title when unsorted.
       * @default GridColumnUnsortedIcon
       */
      columnUnsortedIcon: React_2.JSXElementConstructor<GridColumnUnsortedIconProps> | null;
      /**
       * Icon displayed on the side of the column header title when sorted in ascending order.
       * @default GridArrowUpwardIcon
       */
      columnSortedAscendingIcon: React_2.JSXElementConstructor<IconProps> | null;
      /**
       * Icon displayed on the side of the column header title when sorted in descending order.
       * @default GridArrowDownwardIcon
       */
      columnSortedDescendingIcon: React_2.JSXElementConstructor<IconProps> | null;
      /**
       * Icon displayed in between two column headers that allows to resize the column header.
       * @default GridSeparatorIcon
       */
      columnResizeIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the compact density option in the toolbar.
       * @default GridViewHeadlineIcon
       */
      densityCompactIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the standard density option in the toolbar.
       * @default GridTableRowsIcon
       */
      densityStandardIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the "comfortable" density option in the toolbar.
       * @default GridViewStreamIcon
       */
      densityComfortableIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the open export button present in the toolbar by default.
       * @default GridDownloadIcon
       */
      exportIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the `actions` column type to open the menu.
       * @default GridMoreVertIcon
       */
      moreActionsIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the tree data toggling column when the children are collapsed
       * @default GridKeyboardArrowRight
       */
      treeDataExpandIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the tree data toggling column when the children are expanded
       * @default GridExpandMoreIcon
       */
      treeDataCollapseIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the grouping column when the children are collapsed
       * @default GridKeyboardArrowRight
       */
      groupingCriteriaExpandIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the grouping column when the children are expanded
       * @default GridExpandMoreIcon
       */
      groupingCriteriaCollapseIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the detail panel toggle column when collapsed.
       * @default GridAddIcon
       */
      detailPanelExpandIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the detail panel toggle column when expanded.
       * @default GridRemoveIcon
       */
      detailPanelCollapseIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed for deleting the filter from filter panel.
       * @default GridAddIcon
       */
      filterPanelAddIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed for deleting the filter from filter panel.
       * @default GridDeleteIcon
       */
      filterPanelDeleteIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed for deleting all the active filters from filter panel.
       * @default GridDeleteForeverIcon
       */
      filterPanelRemoveAllIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the `reorder` column type to reorder a row.
       * @default GridDragIcon
       */
      rowReorderIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the quick filter input.
       * @default GridSearchIcon
       */
      quickFilterIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the quick filter reset input.
       * @default GridCloseIcon
       */
      quickFilterClearIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for hiding column
       * @default GridVisibilityOffIcon
       */
      columnMenuHideIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for ascending sort
       * @default GridArrowUpwardIcon
       */
      columnMenuSortAscendingIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for descending sort
       * @default GridArrowDownwardIcon
       */
      columnMenuSortDescendingIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for unsort
       * @default null
       */
      columnMenuUnsortIcon: React_2.JSXElementConstructor<IconProps> | null;
      /**
       * Icon displayed in column menu for filter
       * @default GridFilterAltIcon
       */
      columnMenuFilterIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for showing all columns
       * @default GridViewColumnIcon
       */
      columnMenuManageColumnsIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed in column menu for clearing values
       * @default GridClearIcon
       */
      columnMenuClearIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the input while processing.
       * @default GridLoadIcon
       */
      loadIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed on the column reorder button.
       * @default GridDragIcon
       */
      columnReorderIcon: React_2.JSXElementConstructor<IconProps>;
      /**
       * Icon displayed to indicate that a menu item is selected.
       * @default GridCheckIcon
       */
      menuItemCheckIcon: React_2.JSXElementConstructor<IconProps>;
  }
  
  /**
   * The initial state of Data Grid.
   */
  export type GridInitialState = GridInitialStateCommunity;
  
  /**
   * The initial state of Data Grid.
   */
  interface GridInitialStateCommunity {
      pagination?: GridPaginationInitialState;
      sorting?: GridSortingInitialState;
      filter?: GridFilterInitialState;
      columns?: GridColumnsInitialState;
      preferencePanel?: GridPreferencePanelInitialState;
      density?: GridDensityState;
      scroll?: {
          top: number;
          left: number;
      };
  }
  
  interface GridInternalHook<Api, Props> extends GridAriaAttributesInternalHook, GridRowAriaAttributesInternalHook, GridAggregationInternalHooks<Api, Props>, GridRowsOverridableMethodsInternalHook<Api>, GridParamsOverridableMethodsInternalHook<Api> {
      useCSSVariables: () => {
          id: string;
          variables: GridCSSVariablesInterface;
      };
  }
  
  export const GridKeyboardArrowRight: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  /**
   * Value that can be used as a key for grouping rows
   */
  export type GridKeyValue = string | number | boolean;
  
  export interface GridLeafColumn {
      field: GridColDef['field'];
  }
  
  export interface GridLeafNode extends GridTreeBasicNode {
      type: 'leaf';
      /**
       * The id of the group containing this node.
       */
      parent: GridRowId;
      /**
       * The key used to group the children of this row.
       */
      groupingKey: GridKeyValue | null;
  }
  
  /**
   * Get the list column definition
   * @category List View
   * @ignore - Do not document
   */
  export const gridListColumnSelector: OutputSelector_2<GridStateCommunity, unknown, GridStateColDef>;
  
  /**
   * Column Definition interface used for the list view column.
   * @demos
   *   - [List view](/x/react-data-grid/list-view/)
   */
  export type GridListViewColDef<R extends GridValidRowModel = any, V = any, F = V> = Pick<GridBaseColDef<R, V, F>, 'field' | 'renderCell' | 'align' | 'cellClassName' | 'display'>;
  
  /**
   * Get the list view state
   * @category List View
   * @ignore - Do not document
   */
  export const gridListViewSelector: OutputSelector_2<GridStateCommunity, unknown, boolean>;
  
  type GridListViewState = (GridListViewColDef & {
      computedWidth: number;
  }) | undefined;
  
  export const GridLoadIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export const GridLoadingOverlay: React_2.ForwardRefExoticComponent<GridLoadingOverlayProps> | React_2.ForwardRefExoticComponent<GridLoadingOverlayProps & React_2.RefAttributes<HTMLDivElement>>;
  
  export interface GridLoadingOverlayProps extends GridOverlayProps {
      /**
       * The variant of the overlay.
       * @default 'linear-progress'
       */
      variant?: GridLoadingOverlayVariant;
      /**
       * The variant of the overlay when no rows are displayed.
       * @default 'skeleton'
       */
      noRowsVariant?: GridLoadingOverlayVariant;
  }
  
  export type GridLoadingOverlayVariant = 'circular-progress' | 'linear-progress' | 'skeleton';
  
  /**
   * Set the types of the texts in the grid.
   */
  export interface GridLocaleText {
      noRowsLabel: string;
      noResultsOverlayLabel: string;
      noColumnsOverlayLabel: string;
      noColumnsOverlayManageColumns: string;
      emptyPivotOverlayLabel: string;
      toolbarDensity: React_2.ReactNode;
      toolbarDensityLabel: string;
      toolbarDensityCompact: string;
      toolbarDensityStandard: string;
      toolbarDensityComfortable: string;
      toolbarColumns: React_2.ReactNode;
      toolbarColumnsLabel: string;
      toolbarFilters: React_2.ReactNode;
      toolbarFiltersLabel: string;
      toolbarFiltersTooltipHide: React_2.ReactNode;
      toolbarFiltersTooltipShow: React_2.ReactNode;
      toolbarFiltersTooltipActive: (count: number) => React_2.ReactNode;
      toolbarQuickFilterPlaceholder: string;
      toolbarQuickFilterLabel: string;
      toolbarQuickFilterDeleteIconLabel: string;
      toolbarExport: React_2.ReactNode;
      toolbarExportLabel: string;
      toolbarExportCSV: React_2.ReactNode;
      toolbarExportPrint: React_2.ReactNode;
      toolbarExportExcel: string;
      toolbarPivot: string;
      toolbarCharts: string;
      toolbarAssistant: React_2.ReactNode;
      columnsManagementSearchTitle: string;
      columnsManagementNoColumns: string;
      columnsManagementShowHideAllText: string;
      columnsManagementReset: string;
      columnsManagementDeleteIconLabel: string;
      filterPanelAddFilter: React_2.ReactNode;
      filterPanelRemoveAll: React_2.ReactNode;
      filterPanelDeleteIconLabel: string;
      filterPanelLogicOperator: string;
      filterPanelOperator: React_2.ReactNode;
      filterPanelOperatorAnd: React_2.ReactNode;
      filterPanelOperatorOr: React_2.ReactNode;
      filterPanelColumns: React_2.ReactNode;
      filterPanelInputLabel: string;
      filterPanelInputPlaceholder: string;
      filterOperatorContains: string;
      filterOperatorDoesNotContain: string;
      filterOperatorEquals: string;
      filterOperatorDoesNotEqual: string;
      filterOperatorStartsWith: string;
      filterOperatorEndsWith: string;
      filterOperatorIs: string;
      filterOperatorNot: string;
      filterOperatorAfter: string;
      filterOperatorOnOrAfter: string;
      filterOperatorBefore: string;
      filterOperatorOnOrBefore: string;
      filterOperatorIsEmpty: string;
      filterOperatorIsNotEmpty: string;
      filterOperatorIsAnyOf: string;
      'filterOperator=': string;
      'filterOperator!=': string;
      'filterOperator>': string;
      'filterOperator>=': string;
      'filterOperator<': string;
      'filterOperator<=': string;
      headerFilterOperatorContains: string;
      headerFilterOperatorDoesNotContain: string;
      headerFilterOperatorEquals: string;
      headerFilterOperatorDoesNotEqual: string;
      headerFilterOperatorStartsWith: string;
      headerFilterOperatorEndsWith: string;
      headerFilterOperatorIs: string;
      headerFilterOperatorNot: string;
      headerFilterOperatorAfter: string;
      headerFilterOperatorOnOrAfter: string;
      headerFilterOperatorBefore: string;
      headerFilterOperatorOnOrBefore: string;
      headerFilterOperatorIsEmpty: string;
      headerFilterOperatorIsNotEmpty: string;
      headerFilterOperatorIsAnyOf: string;
      'headerFilterOperator=': string;
      'headerFilterOperator!=': string;
      'headerFilterOperator>': string;
      'headerFilterOperator>=': string;
      'headerFilterOperator<': string;
      'headerFilterOperator<=': string;
      headerFilterClear: string;
      filterValueAny: string;
      filterValueTrue: string;
      filterValueFalse: string;
      columnMenuLabel: string;
      columnMenuAriaLabel: (columnName: string) => string;
      columnMenuShowColumns: React_2.ReactNode;
      columnMenuManageColumns: React_2.ReactNode;
      columnMenuFilter: React_2.ReactNode;
      columnMenuHideColumn: React_2.ReactNode;
      columnMenuUnsort: React_2.ReactNode;
      columnMenuSortAsc: React_2.ReactNode | ((colDef: GridColDef) => React_2.ReactNode);
      columnMenuSortDesc: React_2.ReactNode | ((colDef: GridColDef) => React_2.ReactNode);
      columnMenuManagePivot: string;
      columnMenuManageCharts: string;
      columnHeaderFiltersTooltipActive: (count: number) => React_2.ReactNode;
      columnHeaderFiltersLabel: string;
      columnHeaderSortIconLabel: string;
      footerRowSelected: (count: number) => React_2.ReactNode;
      footerTotalRows: React_2.ReactNode;
      footerTotalVisibleRows: (visibleCount: number, totalCount: number) => React_2.ReactNode;
      checkboxSelectionHeaderName: string;
      checkboxSelectionSelectAllRows: string;
      checkboxSelectionUnselectAllRows: string;
      checkboxSelectionSelectRow: string;
      checkboxSelectionUnselectRow: string;
      booleanCellTrueLabel: string;
      booleanCellFalseLabel: string;
      actionsCellMore: string;
      pinToLeft: string;
      pinToRight: string;
      unpin: string;
      treeDataGroupingHeaderName: string;
      treeDataExpand: string;
      treeDataCollapse: string;
      groupingColumnHeaderName: string;
      groupColumn: (name: string) => string;
      unGroupColumn: (name: string) => string;
      detailPanelToggle: string;
      expandDetailPanel: string;
      collapseDetailPanel: string;
      rowReorderingHeaderName: string;
      aggregationMenuItemHeader: string;
      aggregationFunctionLabelNone: string;
      aggregationFunctionLabelSum: string;
      aggregationFunctionLabelAvg: string;
      aggregationFunctionLabelMin: string;
      aggregationFunctionLabelMax: string;
      aggregationFunctionLabelSize: string;
      paginationRowsPerPage: string;
      paginationDisplayedRows: (params: {
          from: number;
          to: number;
          count: number;
          estimated: number | undefined;
      }) => string;
      paginationItemAriaLabel: (type: 'first' | 'last' | 'previous' | 'next') => string;
      pivotToggleLabel: string;
      pivotCloseButton: string;
      pivotSearchButton: string;
      pivotSearchControlPlaceholder: string;
      pivotSearchControlLabel: string;
      pivotSearchControlClear: string;
      pivotNoFields: string;
      pivotRows: string;
      pivotColumns: string;
      pivotValues: string;
      pivotMenuMoveUp: string;
      pivotMenuMoveDown: string;
      pivotMenuMoveToTop: string;
      pivotMenuMoveToBottom: string;
      pivotMenuRows: string;
      pivotMenuColumns: string;
      pivotMenuValues: string;
      pivotMenuOptions: string;
      pivotMenuAddToRows: string;
      pivotMenuAddToColumns: string;
      pivotMenuAddToValues: string;
      pivotMenuRemove: string;
      pivotDragToRows: string;
      pivotDragToColumns: string;
      pivotDragToValues: string;
      pivotYearColumnHeaderName: string;
      pivotQuarterColumnHeaderName: string;
      chartsNoCharts: string;
      chartsChartNotSelected: string;
      chartsTabChart: string;
      chartsTabFields: string;
      chartsTabCustomize: string;
      chartsCloseButton: string;
      chartsSyncButtonLabel: string;
      chartsSearchPlaceholder: string;
      chartsSearchLabel: string;
      chartsSearchClear: string;
      chartsNoFields: string;
      chartsFieldBlocked: string;
      chartsCategories: string;
      chartsSeries: string;
      chartsMenuAddToDimensions: (dimensionLabel: string) => string;
      chartsMenuAddToValues: (valuesLabel: string) => string;
      chartsMenuMoveUp: string;
      chartsMenuMoveDown: string;
      chartsMenuMoveToTop: string;
      chartsMenuMoveToBottom: string;
      chartsMenuOptions: string;
      chartsMenuRemove: string;
      chartsDragToDimensions: (dimensionLabel: string) => string;
      chartsDragToValues: (valuesLabel: string) => string;
      aiAssistantPanelTitle: string;
      aiAssistantPanelClose: string;
      aiAssistantPanelConversationHistory: string;
      aiAssistantPanelNewConversation: string;
      aiAssistantPanelEmptyConversation: string;
      aiAssistantSuggestions: string;
      promptRerun: string;
      promptProcessing: string;
      promptAppliedChanges: string;
      promptChangeGroupDescription: (column: string) => string;
      promptChangeAggregationLabel: (column: string, aggregation: string) => string;
      promptChangeAggregationDescription: (column: string, aggregation: string) => string;
      promptChangeFilterLabel: (column: string, operator: string, value: string) => string;
      promptChangeFilterDescription: (column: string, operator: string, value: string) => string;
      promptChangeSortDescription: (column: string, direction: string) => string;
      promptChangePivotEnableLabel: string;
      promptChangePivotEnableDescription: string;
      promptChangePivotColumnsLabel: (count: number) => string;
      promptChangePivotColumnsDescription: (column: string, direction: string) => string;
      promptChangePivotRowsLabel: (count: number) => string;
      promptChangePivotValuesLabel: (count: number) => string;
      promptChangePivotValuesDescription: (column: string, aggregation: string) => string;
      promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) => string;
      promptFieldLabel: string;
      promptFieldPlaceholder: string;
      promptFieldPlaceholderWithRecording: string;
      promptFieldPlaceholderListening: string;
      promptFieldSpeechRecognitionNotSupported: string;
      promptFieldSend: string;
      promptFieldRecord: string;
      promptFieldStopRecording: string;
  }
  
  /**
   * The grid locale text API [[apiRef]].
   */
  export interface GridLocaleTextApi {
      /**
       * Returns the translation for the `key`.
       * @param {T} key One of the keys in [[GridLocaleText]].
       * @returns {GridLocaleText[T]} The translated value.
       */
      getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T];
  }
  
  /**
   * The logger API interface that is available in the grid `apiRef`.
   */
  interface GridLoggerApi {
      /**
       * @param {string} name The name of the logger
       * @returns {Logger} Instance of the logger
       */
      getLogger: (name: string) => Logger;
  }
  
  export enum GridLogicOperator {
      And = "and",
      Or = "or",
  }
  
  export function GridMenu(props: GridMenuProps): React_2.JSX.Element;
  
  export namespace GridMenu {
      var propTypes: any;
  }
  
  export const GridMenuIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export interface GridMenuParams {
      /**
       * The element that opens the menu.
       */
      target: HTMLElement | null;
  }
  
  export interface GridMenuProps extends Pick<PopperProps, 'className' | 'onExited'> {
      open: boolean;
      target: HTMLElement | null;
      onClose: (event?: React_2.KeyboardEvent | MouseEvent | TouchEvent) => void;
      position?: MenuPosition;
      children: React_2.ReactNode;
  }
  
  export const GridMoreVertIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
  export interface GridMultiSelectionApi {
      /**
       * Change the selection state of multiple rows.
       * @param {GridRowId[]} ids The row ids.
       * @param {boolean} isSelected The new selection state. Default is `true`.
       * @param {boolean} resetSelection Whether to reset the already selected rows or not. Default is `false`.
       */
      selectRows: (ids: GridRowId[], isSelected?: boolean, resetSelection?: boolean) => void;
      /**
       * Change the selection state of all the selectable rows in a range.
       * @param {Object} range The range of rows to select.
       * @param {GridRowId} range.startId The first row id.
       * @param {GridRowId} range.endId The last row id.
       * @param {boolean} isSelected The new selection state. Default is `true`.
       * @param {boolean} resetSelection Whether to reset the selected rows outside of the range or not. Default is `false`.
       */
      selectRowRange: (range: {
          startId: GridRowId;
          endId: GridRowId;
      }, isSelected?: boolean, resetSelection?: boolean) => void;
  }
  
  export const GridNoColumnsOverlay: React_2.ForwardRefExoticComponent<GridOverlayProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export const GridNoRowsOverlay: React_2.ForwardRefExoticComponent<GridOverlayProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export const gridNumberComparator: GridComparatorFn;
  
  export const GridOverlay: React_2.ForwardRefExoticComponent<GridOverlayProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  } & React_2.RefAttributes<HTMLDivElement>>;
  
  export type GridOverlayProps = React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  };
  
  /**
   * Get the amount of pages needed to display all the rows if the pagination is enabled
   * @category Pagination
   */
  export const gridPageCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the index of the page to render if the pagination is enabled
   * @category Pagination
   */
  export const gridPageSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the maximum amount of rows to display on a single page if the pagination is enabled
   * @category Pagination
   */
  export const gridPageSizeSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the id and the model of each row to include in the current page if the pagination is enabled.
   * @category Pagination
   */
  export const gridPaginatedVisibleSortedGridRowEntriesSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowEntry_2<GridValidRowModel_2>[];
  
  /**
   * Get the id of each row to include in the current page if the pagination is enabled.
   * @category Pagination
   */
  export const gridPaginatedVisibleSortedGridRowIdsSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridRowId[];
  
  export function GridPagination(): React_2.JSX.Element;
  
  export namespace GridPagination {
      var propTypes: any;
  }
  
  /**
   * The pagination API interface that is available in the grid `apiRef`.
   */
  export interface GridPaginationApi extends GridPaginationModelApi, GridPaginationRowCountApi, GridPaginationMetaApi {}
  
  /**
   * @category Pagination
   * @ignore - do not document.
   */
  export const gridPaginationEnabledClientSideSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => boolean;
  
  export interface GridPaginationInitialState {
      paginationModel?: Partial<GridPaginationModel>;
      rowCount?: number;
      meta?: GridPaginationMeta;
  }
  
  export interface GridPaginationMeta {
      hasNextPage?: boolean;
  }
  
  /**
   * The pagination meta API interface that is available in the grid `apiRef`.
   */
  interface GridPaginationMetaApi {
      /**
       * Sets the `paginationMeta` to a new value.
       * @param {GridPaginationMeta} paginationMeta The new pagination meta value.
       */
      setPaginationMeta: (paginationMeta: GridPaginationMeta) => void;
  }
  
  /**
   * Get the pagination meta
   * @category Pagination
   */
  export const gridPaginationMetaSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridPaginationMeta_2;
  
  export interface GridPaginationModel {
      /**
       * Set the number of rows in one page.
       * If some of the rows have children (for instance in the tree data), this number represents the amount of top level rows wanted on each page.
       * @default 100
       */
      pageSize: number;
      /**
       * The zero-based index of the current page.
       * @default 0
       */
      page: number;
  }
  
  /**
   * The pagination model API interface that is available in the grid `apiRef`.
   */
  export interface GridPaginationModelApi {
      /**
       * Sets the displayed page to the value given by `page`.
       * @param {number} page The new page number.
       */
      setPage: (page: number) => void;
      /**
       * Sets the number of displayed rows to the value given by `pageSize`.
       * @param {number} pageSize The new number of displayed rows.
       */
      setPageSize: (pageSize: number) => void;
      /**
       * Sets the `paginationModel` to a new value.
       * @param {GridPaginationModel} model The new model value.
       */
      setPaginationModel: (model: GridPaginationModel) => void;
  }
  
  /**
   * Get the pagination model
   * @category Pagination
   */
  export const gridPaginationModelSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => GridPaginationModel_2;
  
  /**
   * The pagination row count API interface that is available in the grid `apiRef`.
   */
  export interface GridPaginationRowCountApi {
      /**
       * Sets the `rowCount` to a new value.
       * @param {number} rowCount The new row count value.
       */
      setRowCount: (rowCount: number) => void;
  }
  
  /**
   * Get the row count
   * @category Pagination
   */
  export const gridPaginationRowCountSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => number;
  
  /**
   * Get the index of the first and the last row to include in the current page if the pagination is enabled.
   * @category Pagination
   */
  export const gridPaginationRowRangeSelector: (args_0: RefObject_2<    {
  state: GridStateCommunity;
  } | null>) => {
      firstRowIndex: number;
      lastRowIndex: number;
  } | null;
  
  /**
   * @category Pagination
   * @ignore - do not document.
   */
  export const gridPaginationSelector: OutputSelector_2<GridStateCommunity, unknown, GridPaginationState_2>;
  
  export interface GridPaginationState {
      paginationModel: GridPaginationModel;
      rowCount: number;
      meta: GridPaginationMeta;
      enabled: boolean;
      paginationMode: GridFeatureMode;
  }
  
  export const GridPanel: React_2.ForwardRefExoticComponent<GridPanelProps> | React_2.ForwardRefExoticComponent<Omit<GridPanelProps, "ref"> & React_2.RefAttributes<HTMLDivElement>>;
  
  export interface GridPanelClasses {
      /** Styles applied to the root element. */
      panel: string;
      /** Styles applied to the paper element. */
      paper: string;
  }
  
  export const gridPanelClasses: Record<keyof GridPanelClasses, string>;
  
  export function GridPanelContent(props: React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  }): React_2.JSX.Element;
  
  export namespace GridPanelContent {
      var propTypes: any;
  }
  
  export function GridPanelFooter(props: React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps<Theme>;
  }): React_2.JSX.Element;
  
  export namespace GridPanelFooter {
      var propTypes: any;
  }
  
  export function GridPanelHeader(props: React_2.HTMLAttributes<HTMLDivElement> & {
      sx?: SxProps_2<Theme_2>;
  }): React_2.JSX.Element;
  
  export namespace GridPanelHeader {
      var propTypes: any;
  }
  
  export interface GridPanelProps extends Pick<GridSlotProps['basePopper'], 'id' | 'className' | 'target' | 'flip'> {
      ref?: React_2.Ref<HTMLDivElement>;
      children?: React_2.ReactNode;
      /**
       * Override or extend the styles applied to the component.
       */
      classes?: Partial<GridPanelClasses>;
      open: boolean;
      onClose?: () => void;
  }
  
  export const GridPanelWrapper: React_2.ForwardRefExoticComponent<GridPanelWrapperProps> | React_2.ForwardRefExoticComponent<GridPanelWrapperProps & React_2.RefAttributes<HTMLDivElement>>;
  
  export interface GridPanelWrapperProps extends React_2.PropsWithChildren<React_2.HTMLAttributes<HTMLDivElement>>, MUIStyledCommonProps<Theme> {}
  
  export interface GridParamsApi {
      /**
       * Gets the value of a cell at the given `id` and `field`.
       * @template V
       * @param {GridRowId} id The id of the row.
       * @param {string} field The column field.
       * @returns {v} The cell value.
       */
      getCellValue: <V = any>(id: GridRowId, field: string) => V;
      /**
       * Gets the cell value.
       * Use it instead of `getCellValue` for better performance if you have `row` and `colDef`.
       * @template V
       * @param {GridRowModel} row The row model.
       * @param {GridColDef} colDef The column definition.
       * @returns {v} The cell value.
       * @ignore - do not document
       */
      getRowValue: <V = any>(row: GridRowModel, colDef: GridColDef) => V;
      /**
       * Gets the cell formatted value
       * Use it instead of `getCellParams` for better performance if you only need the formatted value.
       * @template V
       * @param {GridRowModel} row The row model.
       * @param {GridColDef} colDef The column definition.
       * @returns {v} The cell value.
       * @ignore - do not document
       */
      getRowFormattedValue: <V = any>(row: GridRowModel, colDef: GridColDef) => V;
      /**
       * Gets the [[GridCellParams]] object that is passed as argument in events.
       * @param {GridRowId} id The id of the row.
       * @param {string} field The column field.
       * @returns {GridCellParams} The cell params.
       */
      getCellElement: (id: GridRowId, field: string) => HTMLDivElement | null;
      /**
       * Gets the [[GridCellParams]] object that is passed as argument in events.
       * @param {GridRowId} id The id of the row.
       * @param {string} field The column field.
       * @returns {GridCellParams} The cell params.
       */
      getCellParams: <R extends GridValidRowModel = any, V = unknown, F = V, N extends GridTreeNode = GridTreeNode>(id: GridRowId, field: string) => GridCellParams<R, V, F, N>;
      /**
       * Gets the [[GridRowParams]] object that is passed as argument in events.
       * @param {GridRowId} id The id of the row.
       * @param {string} field The column field.
       * @returns {GridRowParams} The row params.
       */
      getRowParams: (id: GridRowId) => GridRowParams;
      /**
       * Gets the underlying DOM element for a row at the given `id`.
       * @param {GridRowId} id The id of the row.
       * @returns {HTMLDivElement | null} The DOM element or `null`.
       */
      getRowElement: (id: GridRowId) => HTMLDivElement | null;
      /**
       * Gets the underlying DOM element for the column header with the given `field`.
       * @param {string} field The column field.
       * @returns {HTMLDivElement | null} The DOM element or `null`.
       */
      getColumnHeaderElement: (field: string) => HTMLDivElement | null;
      /**
       * Gets the [[GridColumnHeaderParams]] object that is passed as argument in events.
       * @param {string} field The column field.
       * @returns {GridColumnHeaderParams} The cell params.
       */
      getColumnHeaderParams: (field: string) => GridColumnHeaderParams;
  }
  
  /**
   * Overridable params methods interface, these methods could be overriden in a higher plan package.
   */
  interface GridParamsOverridableMethodsInternalHook<Api> {
      useGridParamsOverridableMethods: (apiRef: RefObject<Api>) => {
          getCellValue: GridParamsApi['getCellValue'];
          getRowValue: GridParamsApi['getRowValue'];
          getRowFormattedValue: GridParamsApi['getRowFormattedValue'];
      };
  }
  
  interface GridParamsPrivateApi {
      /**
       * @typedef {Object} CellParamsOverrides@typedef {Object} CellParamsOverrides
       * @property {GridCellMode} cellMode - The mode of the cell.
       * @property {GridStateColDef} colDef - The column definition.
       * @property {boolean} hasFocus - Indicates if the cell is in focus.
       * @property {GridTreeNode} rowNode - The node of the row that the current cell belongs to.
       * @property {0|-1} tabIndex - The tabIndex value.
       */
      /**
       * Used internally to render the cell based on existing row data provided by the GridRow.
       * @param {GridRowId} id The id of the row.
       * @param {string} field The column field.
       * @param {GridValidRowModel} row The row model.
       * @param {CellParamsOverrides} cellParams The cell params.
       * @returns {GridCellParams} The cell params.
       */
      getCellParamsForRow: <R extends GridValidRowModel = any, V = unknown, F = V, N extends GridTreeNode = GridTreeNode>(id: GridRowId, field: string, row: R, {
          cellMode,
          colDef,
          hasFocus,
          rowNode,
          tabIndex,
          value,
          formattedValue
      }: {
          cellMode: GridCellMode;
          colDef: GridStateColDef;
          hasFocus: boolean;
          rowNode: N;
          tabIndex: 0 | -1;
          value?: V;
          formattedValue?: F;
      }) => GridCellParams<R, V, F, N>;
  }
  
  export interface GridPinnedColumnFields {
      left?: string[];
      right?: string[];
  }
  
  export enum GridPinnedColumnPosition {
      LEFT = "left",
      RIGHT = "right",
  }
  
  export interface GridPinnedColumns {
      left: GridStateColDef[];
      right: GridStateColDef[];
  }
  
  /**
   * Get the visible pinned columns model.
   * @category Visible Columns
   */
  export const gridPinnedColumnsSelector: OutputSelector_2<GridStateCommunity, unknown, GridPinnedColumnFields>;
  
  export type GridPinnedRowNode = GridDataPinnedRowNode | GridAutoGeneratedPinnedRowNode;
  
  interface GridPinnedRowsProps {
      position: 'top' | 'bottom';
      virtualScroller: VirtualScrollerCompat;
  }
  
  interface GridPinnedRowsState {
      top?: GridRowEntry[];
      bottom?: GridRowEntry[];
  }
  
  interface GridPipeProcessingApi {
      /**
       * Run all the processors registered for the given group.
       * @template T
       * @param {GridPipeProcessorGroup} group The group from which we want to apply the processors.
       * @param {T['value']} value The initial value to pass to the first processor.
       * @param {T['context]} context Context object that will be passed to each processor.
           * @returns {T['value]} The value after passing through all pre-processors.
               * @ignore - do not document.
               */
           unstable_applyPipeProcessors: GridPipeProcessorsApplier;
       }
  
       export interface GridPipeProcessingLookup {
           columnMenu: {
               value: Array<string>;
               context: GridColDef;
           };
           exportState: {
               value: GridInitialStateCommunity;
               context: GridExportStateParams;
           };
           getRowsParams: {
               value: Partial<GridGetRowsParams>;
           };
           hydrateColumns: {
               value: GridHydrateColumnsValue;
           };
           hydrateRows: {
               value: GridHydrateRowsValue;
           };
           exportMenu: {
               value: {
                   component: React_2.ReactElement<any>;
                   componentName: string;
               }[];
               context: any;
           };
           preferencePanel: {
               value: React_2.ReactNode;
               context: GridPreferencePanelsValue;
           };
           restoreState: {
               value: GridRestoreStatePreProcessingValue;
               context: GridRestoreStatePreProcessingContext<GridInitialStateCommunity>;
           };
           rowHeight: {
               value: HeightEntry;
               context: GridRowEntry;
           };
           scrollToIndexes: {
               value: Partial<GridScrollParams>;
               context: Partial<GridCellIndexCoordinates>;
           };
           rowClassName: {
               value: string[];
               context: GridRowId;
           };
           cellClassName: {
               value: string[];
               context: GridCellCoordinates;
           };
           isCellSelected: {
               value: boolean;
               context: GridCellCoordinates;
           };
           canUpdateFocus: {
               value: boolean;
               context: {
                   event: MouseEvent | React_2.KeyboardEvent;
                   cell: GridCellParams | null;
               };
           };
           clipboardCopy: {
               value: string;
           };
           canStartEditing: {
               value: boolean;
               context: {
                   event: React_2.KeyboardEvent;
                   cellParams: GridCellParams;
                   editMode: GridEditMode;
               };
           };
           isColumnPinned: {
               value: GridPinnedColumnPosition | false;
               context: string;
           };
           processDataSourceRows: {
               value: {
                   params: GridGetRowsParams;
                   response: GridGetRowsResponse;
               };
               context: boolean;
           };
           /**
            * Does validation of the current reorder operation.
            * If the reorder is valid, it returns the position index of the drop indicator.
            *   - For example before first row is `0` and after the last row is `rows.length`.
            * If the reorder is invalid, it returns `-1`.
            */
           getRowReorderTargetIndex: {
               value: number;
               context: {
                   sourceRowId: GridRowId;
                   targetRowId: GridRowId;
                   dropPosition: 'above' | 'below';
                   dragDirection: 'up' | 'down';
               };
           };
       }
  
       interface GridPipeProcessingPrivateApi {
           /**
            * Register a processor and run all the appliers of the group.
            * @param {GridPipeProcessorGroup} group The group on which this processor should be applied.
            * @param {string} id An unique and static identifier of the processor.
            * @param {GridPipeProcessor} processor The processor to register.
            * @returns {() => void} A function to unregister the processor.
            */
           registerPipeProcessor: <G extends GridPipeProcessorGroup>(group: GridPipeProcessorGroup, id: string, processor: GridPipeProcessor<G>) => () => void;
           /**
            * Register an applier.
            * @param {GridPipeProcessorGroup} group The group of this applier
            * @param {string} id An unique and static identifier of the applier.
            * @param {() => void} applier The applier to register.
            * @returns {() => void} A function to unregister the applier.
            */
           registerPipeApplier: (group: GridPipeProcessorGroup, id: string, applier: () => void) => () => void;
           /**
            * Imperatively run all the appliers of a group.
            * Most of the time, the applier should run because a processor is re-registered,
            * but sometimes we want to re-apply the processing even if the processor deps have not changed.
            * This may occur when the change requires a `isDeepEqual` check.
            * @param {GridPipeProcessorGroup} group The group to apply.
            */
           requestPipeProcessorsApplication: (group: GridPipeProcessorGroup) => void;
           /**
            * Checks of there are any processors that have been updated and runs appliers for them.
            * It is intended to be called in a useEffect in the top-level data grid hook (`useDataGridComponent`).
            */
           runAppliersForPendingProcessors: () => void;
       }
  
       type GridPipeProcessor<P extends GridPipeProcessorGroup> = (value: GridPipeProcessingLookup[P]['value'], context: GridPipeProcessingLookup[P] extends {
           context: any;
       } ? GridPipeProcessingLookup[P]['context'] : undefined) => GridPipeProcessingLookup[P]['value'];
  
       type GridPipeProcessorGroup = keyof GridPipeProcessingLookup;
  
       type GridPipeProcessorsApplier = <P extends GridPipeProcessorGroup>(...params: GridPipeProcessorsApplierArgs<P, GridPipeProcessingLookup[P]>) => GridPipeProcessingLookup[P]['value'];
  
       type GridPipeProcessorsApplierArgs<P extends GridPipeProcessorGroup, T extends {
           value: any;
       }> = T extends {
           context: any;
       } ? [P, T['value'], T['context']] : [P, T['value']];
  
       interface GridPivotingPrivateApiCommunity {
           updateNonPivotRows: (rows: readonly GridRowModelUpdate_2[], keepPreviousRows?: boolean) => void;
           updateNonPivotColumns: (columns: readonly GridColDef[], keepPreviousColumns?: boolean) => void;
       }
  
       export function GridPortalWrapper({
           children
       }: {
           children: React_2.ReactNode;
       }): React_2.JSX.Element;
  
       export type GridPreferencePanelInitialState = GridPreferencePanelState;
  
       export interface GridPreferencePanelParams extends Omit<GridPreferencePanelState, 'open'> {}
  
       export interface GridPreferencePanelState {
           open: boolean;
           panelId?: string;
           labelId?: string;
           /**
            * Tab currently opened.
            * @default GridPreferencePanelsValue.filter
            * TODO v6: Remove the default behavior
            */
           openedPanelValue?: GridPreferencePanelsValue;
       }
  
       export const gridPreferencePanelStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridPreferencePanelState_2>;
  
       export enum GridPreferencePanelsValue {
           filters = "filters",
           columns = "columns",
           aiAssistant = "aiAssistant",
       }
  
       /**
        * The preferences panel API interface that is available in the grid [[apiRef]].
        */
       export interface GridPreferencesPanelApi {
           /**
            * Displays the preferences panel. The `newValue` argument controls the content of the panel.
            * @param {GridPreferencePanelsValue} newValue The panel to open.
            * @param {string} panelId The unique panel id
            * @param {string} labelId The unique button id
            */
           showPreferences: (newValue: GridPreferencePanelsValue, panelId?: string, labelId?: string) => void;
           /**
            * Hides the preferences panel.
            */
           hidePreferences: () => void;
       }
  
       /**
        * Object passed as parameter in the column [[GridColDef]] edit cell props change callback.
        */
       export interface GridPreProcessEditCellProps<V = any, R extends GridValidRowModel = any> {
           /**
            * The grid row id.
            */
           id: GridRowId;
           /**
            * The row that is being edited.
            */
           row: GridRowModel<R>;
           /**
            * The edit cell props.
            */
           props: GridEditCellProps<V>;
           /**
            * Whether the new value is different from the stored value or not.
            */
           hasChanged?: boolean;
           /**
            * Object containing the props of the other fields.
            * Only available for row editing and when using the new editing API.
            */
           otherFieldsProps?: Record<string, GridEditCellProps<V>>;
       }
  
       /**
        * The Print export API interface that is available in the grid [[apiRef]].
        */
       export interface GridPrintExportApi {
           /**
            * Print the grid's data.
            * @param {GridPrintExportOptions} options The options to apply on the export.
            */
           exportDataAsPrint: (options?: GridPrintExportOptions) => void;
       }
  
       export function GridPrintExportMenuItem(props: GridPrintExportMenuItemProps): React_2.JSX.Element;
  
       export namespace GridPrintExportMenuItem {
           var propTypes: any;
       }
  
       export type GridPrintExportMenuItemProps = GridExportMenuItemProps<GridPrintExportOptions>;
  
       /**
        * The options to apply on the Print export.
        * @demos
        *   - [Print export](/x/react-data-grid/export/#print-export)
        */
       export interface GridPrintExportOptions extends GridExportOptions {
           /**
            * The value to be used as the print window title.
            * @default The title of the page.
            */
           fileName?: string;
           /**
            * If `true`, the toolbar is removed for when printing.
            * @default false
            */
           hideToolbar?: boolean;
           /**
            * If `true`, the footer is removed for when printing.
            * @default false
            */
           hideFooter?: boolean;
           /**
            * If `true`, the selection checkboxes will be included when printing.
            * @default false
            */
           includeCheckboxes?: boolean;
           /**
            * If `false`, all <style> and <link type="stylesheet" /> tags from the <head> will not be copied
            * to the print window.
            * @default true
            */
           copyStyles?: boolean;
           /**
            * One or more classes passed to the print window.
            */
           bodyClassName?: string;
           /**
            * Provide Print specific styles to the print window.
            */
           pageStyle?: string | (() => string);
           /**
            * Function that returns the list of row ids to export in the order they should be exported.
            * @param {GridPrintGetRowsToExportParams} params With all properties from [[GridPrintGetRowsToExportParams]].
            * @returns {GridRowId[]} The list of row ids to export.
            */
           getRowsToExport?: (params: GridPrintGetRowsToExportParams) => GridRowId[];
       }
  
       export interface GridPrintGetRowsToExportParams<Api extends GridApiCommon = GridApiCommunity> extends GridGetRowsToExportParams<Api> {}
  
       interface GridPrivateApiCommon extends GridApiCommon, GridPrivateOnlyApiCommon<GridApiCommon, GridPrivateApiCommon, DataGridProcessedProps> {}
  
       interface GridPrivateApiCommunity extends GridApiCommunity, GridPrivateOnlyApiCommon<GridApiCommunity, GridPrivateApiCommunity, DataGridProcessedProps>, GridRowMultiSelectionApi, GridColumnReorderApi, GridRowProApi {}
  
       interface GridPrivateOnlyApiCommon<Api extends GridApiCommon, PrivateApi extends GridPrivateApiCommon, Props extends DataGridProcessedProps> extends GridCorePrivateApi<Api, PrivateApi, Props>, GridStatePrivateApi<PrivateApi['state']>, GridPipeProcessingPrivateApi, GridStrategyProcessingApi, GridColumnSpanningPrivateApi, GridRowsMetaPrivateApi, GridDimensionsPrivateApi, GridEditingPrivateApi, GridLoggerApi, GridFocusPrivateApi, GridHeaderFilteringPrivateApi, GridVirtualizationPrivateApi, GridRowProPrivateApi, GridParamsPrivateApi, GridPivotingPrivateApiCommunity {
           virtualizer: Virtualizer;
       }
  
       type GridQuickFilterValueResult = {
           [key: string]: boolean;
       };
  
       /**
        * Get the current quick filter values.
        * @category Filtering
        */
       export const gridQuickFilterValuesSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => any[] | undefined;
  
       export const GridRemoveIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
       /**
        * GridCellParams containing api.
        */
       export interface GridRenderCellParams<R extends GridValidRowModel = any, V = any, F = V, N extends GridTreeNodeWithRender = GridTreeNodeWithRender> extends GridCellParams<R, V, F, N> {
           /**
            * GridApi that let you manipulate the grid.
            */
           api: GridApiCommunity;
           /**
            * A ref allowing to set imperative focus.
            * It can be passed to the element that should receive focus.
            * @ignore - do not document.
            */
           focusElementRef?: React_2.Ref<FocusElement>;
       }
  
       /**
        * The object containing the column properties of the rendering state.
        */
       export interface GridRenderColumnsProps {
           /**
            * The index of the first rendered column.
            */
           firstColIdx: number;
           /**
            * The index of the last rendered column.
            */
           lastColIdx: number;
           /**
            * The left offset required to position the viewport at the beginning of the first rendered column.
            */
           leftEmptyWidth: number;
           /**
            * The right offset required to position the viewport to the end of the last rendered column.
            */
           rightEmptyWidth: number;
       }
  
       /**
        * Provides the current render context range for rows and columns.
        * End index is exclusive - [firstRowIndex, lastRowIndex) and [firstColumnIndex, lastColumnIndex)
        */
       export interface GridRenderContext extends GridColumnsRenderContext {
           firstRowIndex: number;
           lastRowIndex: number;
       }
  
       /**
        * Get the render context, with only columns filled in.
        * This is cached, so it can be used to only re-render when the column interval changes.
        * @category Virtualization
        * @ignore - do not document.
        */
       export const gridRenderContextColumnsSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridColumnsRenderContext;
  
       /**
        * The full rendering state.
        */
       export type GridRenderContextProps = GridRenderColumnsProps & GridRenderRowProps & GridRenderPaginationProps;
  
       /**
        * Get the render context
        * @category Virtualization
        * @ignore - do not document.
        */
       export const gridRenderContextSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => RenderContext;
  
       /**
        * GridEditCellProps containing api.
        */
       export interface GridRenderEditCellParams<R extends GridValidRowModel = any, V = any, F = V, N extends GridTreeNodeWithRender = GridTreeNodeWithRender> extends GridCellParams<R, V, F, N>, GridEditCellProps<V> {
           /**
            * GridApi that let you manipulate the grid.
            */
           api: GridApiCommunity;
       }
  
       /**
        * The object containing the pagination properties of the rendering state.
        */
       export interface GridRenderPaginationProps {
           /**
            * The current page if pagination is enabled.
            */
           paginationCurrentPage?: number;
           /**
            * The page size if pagination is enabled.
            */
           pageSize?: number;
       }
  
       /**
        * The object containing the row properties of the rendering state.
        */
       export interface GridRenderRowProps {
           /**
            * The rendering zone page calculated from the scroll position.
            */
           page: number;
           /**
            * The index of the first rendered row.
            */
           firstRowIdx: number;
           /**
            * The index of the last rendered row.
            */
           lastRowIdx: number;
       }
  
       export const gridResizingColumnFieldSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => string;
  
       interface GridRestoreStatePreProcessingContext<I extends GridInitialStateCommunity> {
           stateToRestore: I;
       }
  
       interface GridRestoreStatePreProcessingValue {
           /**
            * Functions to run after the state has been updated but before re-rendering.
            * This is usually used to apply derived states like `applyFilters` or `applySorting`
            */
           callbacks: (() => void)[];
       }
  
       export const GridRoot: React_2.ForwardRefExoticComponent<GridRootProps> | React_2.ForwardRefExoticComponent<GridRootProps & React_2.RefAttributes<HTMLDivElement>>;
  
       export interface GridRootProps extends React_2.HTMLAttributes<HTMLDivElement> {
           /**
            * The system prop that allows defining system overrides as well as additional CSS styles.
            */
           sx?: SxProps_2<Theme>;
           sidePanel?: React_2.ReactNode;
       }
  
       export const GridRow: React_2.ForwardRefExoticComponent<GridRowProps> | React_2.ForwardRefExoticComponent<GridRowProps & React_2.RefAttributes<HTMLDivElement>>;
  
       /**
        * The Row API interface that is available in the grid `apiRef`.
        */
       export interface GridRowApi {
           /**
            * Gets the full set of rows as [[Map<GridRowId, GridRowModel>]].
            * @returns {Map<GridRowId, GridRowModel>} The full set of rows.
            */
           getRowModels: () => Map<GridRowId, GridRowModel>;
           /**
            * Gets the total number of rows in the grid.
            * @returns {number} The number of rows.
            */
           getRowsCount: () => number;
           /**
            * Gets the list of row ids.
            * TODO rows v6: Rename or remove ?
            * @returns {GridRowId[]} A list of ids.
            */
           getAllRowIds: () => GridRowId[];
           /**
            * Sets the internal loading state.
            * @param {boolean} loading If `true` the loading indicator will be shown over the Data Grid.
            */
           setLoading: (loading: boolean) => void;
           /**
            * Sets a new set of rows.
            * @param {GridRowModel[]} rows The new rows.
            */
           setRows: (rows: GridRowModel[]) => void;
           /**
            * Allows to update, insert and delete rows.
            * @param {GridRowModelUpdate[]} updates An array of rows with an `action` specifying what to do.
            */
           updateRows: (updates: GridRowModelUpdate[]) => void;
           /**
            * Gets the row data with a given id.
            * @param {GridRowId} id The id of the row.
            * @returns {GridRowModel} The row data.
            */
           getRow: <R extends GridValidRowModel = any>(id: GridRowId) => R | null;
           /**
            * Gets the ID of a row given its data.
            * @param {GridRowModel} row The row data.
            * @returns {GridRowId} The id of the row.
            * @deprecated Use `gridRowIdSelector` instead.
            */
           getRowId: <R extends GridValidRowModel = any>(row: R) => GridRowId;
           /**
            * Gets the row node from the internal tree structure.
            * @param {GridRowId} id The id of the row.
            * @returns {GridTreeNode} The tree node.
            * @deprecated Use `gridRowNodeSelector` instead.
            */
           getRowNode: <N extends GridTreeNode>(id: GridRowId) => N | null;
           /**
            * Gets the index of a row relative to the rows that are reachable by scroll.
            * @param {GridRowId} id The row id.
            * @returns {number} The index of the row.
            */
           getRowIndexRelativeToVisibleRows: (id: GridRowId) => number;
           /**
            * Replace a set of rows with new rows.
            * @param {number} firstRowToReplace The index of the first row to be replaced.
            * @param {GridRowModel[]} newRows The new rows.
            */
           unstable_replaceRows: (firstRowToReplace: number, newRows: GridRowModel[]) => void;
       }
  
       interface GridRowAriaAttributesInternalHook {
           useGridRowAriaAttributes: () => GetRowAriaAttributesFn;
       }
  
       /**
        * Object passed as parameter in the row `getRowClassName` callback prop.
        * @demos
        *   - [Styling rows](/x/react-data-grid/style/#styling-rows)
        */
       export interface GridRowClassNameParams<R extends GridValidRowModel = any> extends GridRowParams<R>, GridRowVisibilityParams {}
  
       export const GridRowCount: React_2.ForwardRefExoticComponent<GridRowCountProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & RowCountProps & {
           sx?: SxProps_2<Theme_2>;
       } & React_2.RefAttributes<HTMLDivElement>>;
  
       export type GridRowCountProps = React_2.HTMLAttributes<HTMLDivElement> & RowCountProps & {
           sx?: SxProps_2<Theme_2>;
       };
  
       export const gridRowCountSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => number;
  
       /**
        * The row editing API interface.
        */
       interface GridRowEditingApi extends GridEditingSharedApi {
           /**
            * Gets the mode of a row.
            * @param {GridRowId} id The id of the row.
            * @returns {GridRowMode} Returns `"edit"` or `"view"`.
            */
           getRowMode: (id: GridRowId) => GridRowMode;
           /**
            * Puts the row corresponding to the given id into edit mode.
            * @param {GridStartCellEditModeParams} params The row id edit.
            */
           startRowEditMode(params: GridStartRowEditModeParams): void;
           /**
            * Puts the row corresponding to the given id and into view mode and updates the original row with the new values stored.
            * If `params.ignoreModifications` is `true` it will discard the modifications made.
            * @param {GridStopCellEditModeParams} params The row id and field of the cell to stop editing.
            */
           stopRowEditMode(params: GridStopRowEditModeParams): void;
       }
  
       interface GridRowEditingPrivateApi extends GridEditingSharedPrivateApi {
           /**
            * Updates the value of a cell being edited.
            * Don't call this method directly, prefer `setEditCellValue`.
            * @param {GridCommitCellChangeParams} params Object with the new value and id and field to update.
            * @returns {Promise<boolean>} Resolves with `true` when all values in the row are valid.
            */
           setRowEditingEditCellValue: (params: GridEditCellValueParams) => Promise<boolean>;
           /**
            * Returns the row with the values that were set by editing all cells.
            * @param {GridRowId} id The row id being edited.
            * @returns {GridRowModel} The data model of the row.
            */
           getRowWithUpdatedValuesFromRowEditing: (id: GridRowId) => GridRowModel;
       }
  
       /**
        * Params passed to the `rowEditStart` event.
        */
       export interface GridRowEditStartParams<R extends GridValidRowModel = any> extends GridRowParams<R> {
           /**
            * Which field triggered this event.
            */
           field?: string;
           /**
            * The reason for this event to be triggered.
            */
           reason?: GridRowEditStartReasons;
           /**
            * If the reason is related to a keyboard event, it contains which key was pressed.
            * @deprecated No longer needed.
            */
           key?: string;
       }
  
       export enum GridRowEditStartReasons {
           enterKeyDown = "enterKeyDown",
           cellDoubleClick = "cellDoubleClick",
           printableKeyDown = "printableKeyDown",
           deleteKeyDown = "deleteKeyDown",
       }
  
       export interface GridRowEditStopParams<R extends GridValidRowModel = any> extends GridRowParams<R> {
           /**
            * Which field triggered this event.
            */
           field?: string;
           /**
            * The reason for this event to be triggered.
            */
           reason?: GridRowEditStopReasons;
       }
  
       export enum GridRowEditStopReasons {
           rowFocusOut = "rowFocusOut",
           escapeKeyDown = "escapeKeyDown",
           enterKeyDown = "enterKeyDown",
           tabKeyDown = "tabKeyDown",
           shiftTabKeyDown = "shiftTabKeyDown",
       }
  
       export interface GridRowEntry<R extends GridValidRowModel = GridValidRowModel> {
           /**
            * The row id.
            */
           id: GridRowId;
           /**
            * The row model.
            */
           model: R;
       }
  
       export interface GridRowEventLookup {
           /**
            * Fired when a row is clicked.
            * Not fired if the cell clicked is from an interactive column (actions, checkbox, etc).
            */
           rowClick: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * Fired when a row is double-clicked.
            */
           rowDoubleClick: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * Fired when the mouse enters the row. Called with a [[GridRowParams]] object.
            */
           rowMouseEnter: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * Fired when the mouse leaves the row. Called with a [[GridRowParams]] object.
            */
           rowMouseLeave: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * @ignore - do not document.
            */
           rowMouseOut: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * @ignore - do not document.
            */
           rowMouseOver: {
               params: GridRowParams;
               event: React_2.MouseEvent<HTMLElement>;
           };
           /**
            * Fired when the user starts dragging a row. It's mapped to the `dragstart` DOM event.
            * @ignore - do not document.
            */
           rowDragStart: {
               params: GridRowParams;
               event: React_2.DragEvent<HTMLElement>;
           };
           /**
            * Fired while an element or text selection is dragged over the row.
            * It's mapped to the `dragover` DOM event.
            * @ignore - do not document.
            */
           rowDragOver: {
               params: GridRowParams;
               event: React_2.DragEvent<HTMLElement>;
           };
           /**
            * Fired when the dragging of a row ends.
            * It's mapped to the `dragend` DOM event.
            * @ignore - do not document.
            */
           rowDragEnd: {
               params: GridRowParams;
               event: DragEvent;
           };
       }
  
       export interface GridRowGroupChildrenGetterParams {
           /**
            * The row id of the group
            */
           groupId: GridRowId;
           /**
            * If `true`, the method will not return the generated rows generated by the grid (aggregation footers, groups, ...)
            * @default true
            */
           skipAutoGeneratedRows?: boolean;
           /**
            * If `true`, the method will only return the rows that are matching the current filters
            * @default false
            */
           applyFiltering?: boolean;
           /**
            * If `true`, the method will order the returned rows according to the current sorting rules
            * @default false
            */
           applySorting?: boolean;
           /**
            * If `true`, the method will only return the direct leaf children of the group
            * @default false
            */
           directChildrenOnly?: boolean;
       }
  
       export const gridRowGroupingNameSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => string;
  
       /**
        * Object passed as parameter in the row `getRowHeight` callback prop.
        */
       export interface GridRowHeightParams extends GridRowEntry {
           /**
            * The grid current density factor.
            */
           densityFactor: number;
       }
  
       /**
        * The getRowHeight return value.
        */
       export type GridRowHeightReturnValue = number | null | undefined | 'auto';
  
       /**
        * The type of Id supported by the grid.
        */
       export type GridRowId = string | number;
  
       /**
        * The function to retrieve the id of a [[GridRowModel]].
        * @param {R} row The row model.
        * @returns {GridRowId} The id of the row.
        */
       export type GridRowIdGetter<R extends GridValidRowModel = GridValidRowModel> = (row: R) => GridRowId;
  
       /**
        * Get the row id for a given row
        * @param apiRef - The grid api reference
        * @param {GridRowModel} row - The row to get the id for
        * @returns {GridRowId} The row id
        */
       export const gridRowIdSelector: OutputSelector_2<GridStateCommunity, GridValidRowModel_2, GridRowId>;
  
       export type GridRowIdToModelLookup<R extends GridValidRowModel = GridValidRowModel> = Record<string, R>;
  
       export const gridRowIsEditingSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>, args_1: {
           rowId: GridRowId;
           editMode: GridEditMode;
       }) => boolean;
  
       export const gridRowMaximumTreeDepthSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => number;
  
       /**
        * The mode of the row.
        */
       export type GridRowMode = 'edit' | 'view';
  
       /**
        * The key value object representing the data of a row.
        */
       export type GridRowModel<R extends GridValidRowModel = GridValidRowModel> = R;
  
       export interface GridRowModelUpdate extends GridRowModel {
           _action?: GridUpdateAction;
       }
  
       export enum GridRowModes {
           Edit = "edit",
           View = "view",
       }
  
       export type GridRowModesModel = Record<GridRowId, GridRowModesModelProps>;
  
       type GridRowModesModelProps = ({
           mode: GridRowModes.View;
       } & Omit<GridStopRowEditModeParams, 'id' | 'field'>) | ({
           mode: GridRowModes.Edit;
       } & Omit<GridStartRowEditModeParams, 'id' | 'field'>);
  
       export interface GridRowMultiSelectionApi {
           /**
            * Change the selection state of multiple rows.
            * @param {GridRowId[]} ids The row ids.
            * @param {boolean} isSelected The new selection state. Default is `true`.
            * @param {boolean} resetSelection Whether to reset the already selected rows or not. Default is `false`.
            */
           selectRows: (ids: GridRowId[], isSelected?: boolean, resetSelection?: boolean) => void;
           /**
            * Change the selection state of all the selectable rows in a range.
            * @param {Object} range The range of rows to select.
            * @param {GridRowId} range.startId The first row id.
            * @param {GridRowId} range.endId The last row id.
            * @param {boolean} isSelected The new selection state. Default is `true`.
            * @param {boolean} resetSelection Whether to reset the selected rows outside of the range or not. Default is `false`.
            */
           selectRowRange: (range: {
               startId: GridRowId;
               endId: GridRowId;
           }, isSelected?: boolean, resetSelection?: boolean) => void;
           /**
            * Returns the modified selection model after applying row selection propagation.
            *
            * Use this to achieve proper `rowSelectionPropagation` behavior when setting the selection model using `setRowSelectionModel`.
            * @param {GridRowSelectionModel} inputSelectionModel The selection model to propagate.
            * @returns {GridRowSelectionModel} The modified selection model.
            */
           getPropagatedRowSelectionModel: (inputSelectionModel: GridRowSelectionModel) => GridRowSelectionModel;
       }
  
       /**
        * @category Rows
        */
       export const gridRowNodeSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>, rowId: GridRowId) => GridTreeNode_2;
  
       /**
        * Object passed as parameter in the row callbacks.
        * @demos
        *   - [Master-detail row panels](/x/react-data-grid/master-detail/)
        */
       export interface GridRowParams<R extends GridValidRowModel = any> {
           /**
            * The grid row id.
            */
           id: GridRowId;
           /**
            * The row model of the row that the current cell belongs to.
            */
           row: R;
           /**
            * All grid columns.
            */
           columns: GridColDef[];
       }
  
       export interface GridRowProApi {
           /**
            * Moves a row from its original position to the position given by `targetIndex`.
            * @param {GridRowId} rowId The row id
            * @param {number} targetIndex The new position (0-based).
            */
           setRowIndex: (rowId: GridRowId, targetIndex: number) => void;
           /**
            * Gets the rows of a grouping criteria.
            * Only contains the rows provided to the grid, not the rows automatically generated by it.
            * @param {GridRowGroupChildrenGetterParams} params Object containing parameters for the getter.
            * @returns {GridRowId[]} The id of each row in the grouping criteria.
            */
           getRowGroupChildren: (params: GridRowGroupChildrenGetterParams) => GridRowId[];
           /**
            * Expand or collapse a row children.
            * Only works for the client side data or to collapse already fetched server side rows.
            * For server-side data, use `dataSource.fetchRows(childId)` to fetch and expand the children.
            * @param {GridRowId} id the ID of the row to expand or collapse.
            * @param {boolean} isExpanded A boolean indicating if the row must be expanded or collapsed.
            */
           setRowChildrenExpansion: (id: GridRowId, isExpanded: boolean) => void;
           /**
            * Expand all rows. Works for the client side data only.
            */
           expandAllRows: () => void;
           /**
            * Collapse all rows. Works for the client side data only.
            */
           collapseAllRows: () => void;
       }
  
       export interface GridRowProPrivateApi {
           /**
            * Allows to update, insert and delete rows at a specific nested level.
            * @param {GridRowModelUpdate[]} updates An array of rows with an `action` specifying what to do.
            * @param {string[]} nestedLevel The nested level of the rows to update, it represents the path to the row in the tree based on `node.groupingKey`.
            */
           updateNestedRows: (updates: GridRowModelUpdate[], nestedLevel?: string[]) => void;
       }
  
       export interface GridRowProps extends React_2.HTMLAttributes<HTMLDivElement> {
           row: GridRowModel;
           rowId: GridRowId;
           selected: boolean;
           /**
            * Index of the row in the whole sorted and filtered dataset.
            * If some rows above have expanded children, this index also take those children into account.
            */
           index: number;
           rowHeight: number | 'auto';
           offsetLeft: number;
           columnsTotalWidth: number;
           firstColumnIndex: number;
           lastColumnIndex: number;
           visibleColumns: GridStateColDef[];
           pinnedColumns: GridPinnedColumns;
           /**
            * Determines which cell has focus.
            * If `null`, no cell in this row has focus.
            */
           focusedColumnIndex: number | undefined;
           isFirstVisible: boolean;
           isLastVisible: boolean;
           isNotVisible: boolean;
           showBottomBorder: boolean;
           scrollbarWidth: number;
           gridHasFiller: boolean;
           onClick?: React_2.MouseEventHandler<HTMLDivElement>;
           onDoubleClick?: React_2.MouseEventHandler<HTMLDivElement>;
           onMouseEnter?: React_2.MouseEventHandler<HTMLDivElement>;
           onMouseLeave?: React_2.MouseEventHandler<HTMLDivElement>;
           [x: `data-${string}`]: string;
       }
  
       /**
        * The row reorder state.
        */
       interface GridRowReorderState {
           /**
            * Whether a row drag operation is currently active.
            */
           isActive: boolean;
       }
  
       /**
        * The selection API interface that is available in the grid [[apiRef]].
        */
       export interface GridRowSelectionApi {
           /**
            * Change the selection state of a row.
            * @param {GridRowId} id The id of the row.
            * @param {boolean} isSelected Pass `false` to unselect a row. Default is `true`.
            * @param {boolean} resetSelection Whether to reset the already selected rows or not. Default is `false`.
            */
           selectRow: (id: GridRowId, isSelected?: boolean, resetSelection?: boolean) => void;
           /**
            * Determines if a row is selected or not.
            * @param {GridRowId} id The id of the row.
            * @returns {boolean} A boolean indicating if the row is selected.
            */
           isRowSelected: (id: GridRowId) => boolean;
           /**
            * Determines if a row can be selected or not.
            * @param {GridRowId} id The id of the row.
            * @returns {boolean} A boolean indicating if the row can be selected.
            */
           isRowSelectable: (id: GridRowId) => boolean;
           /**
            * Returns an array of the selected rows.
            * @returns {Map<GridRowId, GridRowModel>} A `Map` with the selected rows.
            * @deprecated Use `gridRowSelectionIdsSelector`, `gridRowSelectionCountSelector`, or `gridRowSelectionManagerSelector` instead.
            */
           getSelectedRows: () => Map<GridRowId, GridRowModel>;
           /**
            * Sets the new row selection model.
            *
            * ⚠️ Caution: `setRowSelectionModel` doesn't apply the selection propagation automatically.
            * Pass model returned by API method `getPropagatedRowSelectionModel` instead to apply the selection propagation.
            * @param {gridRowSelectionModel} rowSelectionModel The new row selection model.
            * @param {string} reason The reason for the state change.
            */
           setRowSelectionModel: (rowSelectionModel: GridRowSelectionModel, reason?: GridControlledStateReasonLookup['rowSelection']) => void;
       }
  
       export interface GridRowSelectionCheckboxParams {
           value: boolean;
           id: GridRowId;
       }
  
       export const gridRowSelectionCountSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => number;
  
       export const gridRowSelectionIdsSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => Map<GridRowId, GridValidRowModel_2>;
  
       export const gridRowSelectionManagerSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => RowSelectionManager;
  
       export type GridRowSelectionModel = {
           type: 'include' | 'exclude';
           ids: Set<GridRowId>;
       };
  
       export type GridRowSelectionPropagation = {
           descendants?: boolean;
           parents?: boolean;
       };
  
       export const gridRowSelectionStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridRowSelectionModel_2>;
  
       /**
        * @category Rows
        */
       export const gridRowSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>, id: GridRowId) => GridValidRowModel_2;
  
       interface GridRowsFullUpdate {
           type: 'full';
           rows: GridRowId[];
       }
  
       interface GridRowsInternalCache {
           /**
            * The rows as they were the last time all the rows have been updated at once
            * It is used to avoid processing several time the same set of rows
            */
           rowsBeforePartialUpdates: DataGridProcessedProps['rows'];
           /**
            * The value of the `loading` prop since the last time that the rows state was updated.
            */
           loadingPropBeforePartialUpdates: DataGridProcessedProps['loading'];
           /**
            * The value of the `rowCount` prop since the last time that the rows state was updated.
            */
           rowCountPropBeforePartialUpdates: DataGridProcessedProps['rowCount'];
           /**
            * Lookup containing the latest model at all time (even those not stored in the state yet).
            */
           dataRowIdToModelLookup: GridRowIdToModelLookup;
           /**
            * List of updates (partial or full) applied since the last time the state was synced with the cache.
            * It is used to build the tree.
            * If the update is a full update, we rebuild the tree from scratch.
            * If the update is a partial update, we only modify the impacted nodes.
            */
           updates: GridRowsPartialUpdates | GridRowsFullUpdate;
       }
  
       export const gridRowsLoadingSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => boolean | undefined;
  
       export const gridRowsLookupSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridRowIdToModelLookup_2<GridValidRowModel_2>;
  
       /**
        * The grid rows total height and row positions.
        */
       export interface GridRowsMeta {
           /**
            * The sum of all grid rows.
            */
           totalHeight: number;
           /**
            * The grid rows positions.
            */
           positions: number[];
       }
  
       /**
        * The Row Meta API interface that is available in the grid `apiRef`.
        */
       export interface GridRowsMetaApi {
           /**
            * Gets base row height without considering additional height a row may take.
            * @param {GridRowId} id The id of the row.
            * @returns {number} The target row height.
            * @ignore - do not document.
            */
           unstable_getRowHeight: (id: GridRowId) => number;
           /**
            * Stores the row height measurement and triggers an hydration, if needed.
            * @param {GridRowId} id The id of the row.
            * @param {number} height The new height.
            * @param {string} position The position to it the row belongs to.
            * @ignore - do not document.
            */
           unstable_storeRowHeightMeasurement: (id: GridRowId, height: number) => void;
           /**
            * Updates the index of the last row measured.
            * @param {number} index The row index.
            * @ignore - do not document.
            */
           unstable_setLastMeasuredRowIndex: (index: number) => void;
           /**
            * Forces the recalculation of the heights of all rows.
            */
           resetRowHeights: () => void;
       }
  
       interface GridRowsMetaInternalCache {
           /**
            * Map of height cache entries.
            */
           heights: HeightCache;
       }
  
       interface GridRowsMetaPrivateApi {
           hydrateRowsMeta: () => void;
           /**
            * Observe row for 'auto' height changes.
            * @param {Element} element The row element to observe.
            * @param {GridRowId} rowId The id of the row.
            * @returns {ReturnType<React.EffectCallback>} A dispose callback
            */
           observeRowHeight: (element: Element, rowId: GridRowId) => ReturnType<React.EffectCallback>;
           /**
            * Determines if the height of a row is "auto".
            * @param {GridRowId} id The id of the row.
            * @returns {boolean} True if the row height is "auto", false otherwise.
            */
           rowHasAutoHeight: (id: GridRowId) => boolean;
           /**
            * Returns the index of the last row measured.
            * The value considers only the rows reachable by scroll, for example first row has index=0 in all pages.
            * @returns {number} The index of the last measured row.
            */
           getLastMeasuredRowIndex: () => number;
           /**
            * Get the height entry from the cache or create one.
            * @param {GridRowId} id The id of the row.
            * @returns {HeightEntry} The height cache entry
            */
           getRowHeightEntry: (id: GridRowId) => HeightEntry;
       }
  
       export const gridRowsMetaSelector: OutputSelector_2<GridStateCommunity, unknown, GridRowsMetaState_2>;
  
       /**
        * The grid rows total height and row positions.
        */
       export interface GridRowsMetaState extends RowsMetaState {}
  
       /**
        * Overridable row methods interface, these methods could be overriden in a higher plan package.
        */
       interface GridRowsOverridableMethodsInternalHook<Api> {
           useGridRowsOverridableMethods: (apiRef: RefObject<Api>, props: Pick<DataGridProcessedProps, 'processRowUpdate' | 'onProcessRowUpdateError' | 'dataSource'>) => {
               setRowIndex: (rowId: GridRowId, targetIndex: number) => void;
           };
       }
  
       /**
        * The getRowSpacing return value.
        */
       export interface GridRowSpacing {
           top?: number;
           bottom?: number;
       }
  
       /**
        * Object passed as parameter in the row `getRowSpacing` callback prop.
        * @demos
        *   - [Row spacing](/x/react-data-grid/row-height/#row-spacing)
        */
       export interface GridRowSpacingParams extends GridRowEntry, GridRowVisibilityParams {}
  
       interface GridRowSpanningState extends RowSpanningState {}
  
       type GridRowsPartialUpdateAction = 'insert' | 'modify' | 'remove';
  
       interface GridRowsPartialUpdates {
           type: 'partial';
           actions: { [action in GridRowsPartialUpdateAction]: GridRowId[] };
           idToActionLookup: {
               [id: GridRowId]: GridRowsPartialUpdateAction | undefined;
           };
           groupKeys?: string[];
       }
  
       export type GridRowsProp<R extends GridValidRowModel = GridValidRowModel> = Readonly<GridRowModel<R>[]>;
  
       export interface GridRowsState {
           /**
            * Name of the algorithm used to group the rows
            * It is useful to decide which filtering / sorting algorithm to apply, to avoid applying tree-data filtering on a grouping-by-column dataset for instance.
            */
           groupingName: string;
           tree: GridRowTreeConfig;
           /**
            * Amount of nodes at each depth (including auto-generated ones)
            */
           treeDepths: GridTreeDepths;
           dataRowIds: GridRowId[];
           /**
            * The loading status of the rows.
            */
           loading?: boolean;
           /**
            * Amount of data rows provided to the grid.
            * Includes the filtered and collapsed rows.
            * Does not include the auto-generated rows (auto generated groups and footers).
            */
           totalRowCount: number;
           /**
            * Amount of top level rows.
            * Includes the filtered rows and the auto-generated root footer if any.
            * Does not include the rows of depth > 0 (rows inside a group).
            */
           totalTopLevelRowCount: number;
           dataRowIdToModelLookup: GridRowIdToModelLookup;
           additionalRowGroups?: {
               pinnedRows?: GridPinnedRowsState;
           };
           /**
            * Contains some values of type `GridRowId` that have been requested to be fetched
            * either by `defaultGroupingExpansionDepth` or `isGroupExpandedByDefault` props.
            * Applicable with server-side grouped data and `dataSource` only.
            */
           groupsToFetch?: GridRowId[];
       }
  
       export type GridRowTreeConfig = Record<GridRowId, GridTreeNode>;
  
       interface GridRowTreeCreationParams {
           previousTree: GridRowTreeConfig | null;
           previousTreeDepths: GridTreeDepths | null;
           updates: GridRowsPartialUpdates | GridRowsFullUpdate;
           dataRowIdToModelLookup: GridRowIdToModelLookup;
           previousGroupsToFetch?: GridRowId[];
       }
  
       type GridRowTreeCreationValue = Pick<GridRowsState, 'groupingName' | 'tree' | 'treeDepths' | 'dataRowIds' | 'groupsToFetch'>;
  
       export const gridRowTreeDepthsSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridTreeDepths;
  
       export const gridRowTreeSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridRowTreeConfig_2;
  
       interface GridRowVisibilityParams {
           /**
            * Whether this row is the first visible or not.
            */
           isFirstVisible: boolean;
           /**
            * Whether this row is the last visible or not.
            */
           isLastVisible: boolean;
           /**
            * Index of the row in the current page.
            * If the pagination is disabled, it will be the index relative to all filtered rows.
            */
           indexRelativeToCurrentPage: number;
       }
  
       /**
        * The scroll API interface that is available in the grid [[apiRef]].
        */
       export interface GridScrollApi {
           /**
            * Triggers the viewport to scroll to the given positions (in pixels).
            * @param {GridScrollParams} params An object containing the `left` or `top` position to scroll.
            */
           scroll: (params: Partial<GridScrollParams>) => void;
           /**
            * Returns the current scroll position.
            * @returns {GridScrollParams} The scroll positions.
            */
           getScrollPosition: () => GridScrollParams;
           /**
            * Triggers the viewport to scroll to the cell at indexes given by `params`.
            * Returns `true` if the grid had to scroll to reach the target.
            * @param {GridCellIndexCoordinates} params The indexes where the cell is.
            * @returns {boolean} Returns `true` if the index was outside of the viewport and the grid had to scroll to reach the target.
            */
           scrollToIndexes: (params: Partial<GridCellIndexCoordinates>) => boolean;
       }
  
       export type GridScrollFn = (v: GridScrollParams) => void;
  
       export interface GridScrollParams {
           left: number;
           top: number;
           renderContext?: GridRenderContext;
       }
  
       export const GridSearchIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
       export const GridSelectedRowCount: React_2.ForwardRefExoticComponent<GridSelectedRowCountProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps & {
           sx?: SxProps_2<Theme_2>;
       } & React_2.RefAttributes<HTMLDivElement>>;
  
       type GridSelectedRowCountProps = React_2.HTMLAttributes<HTMLDivElement> & SelectedRowCountProps & {
           sx?: SxProps_2<Theme_2>;
       };
  
       export const GridSeparatorIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
       /**
        * Adds scroll shadows above and below content in a scrollable container.
        */
       export const GridShadowScrollArea: React_2.ForwardRefExoticComponent<GridShadowScrollAreaProps> | React_2.ForwardRefExoticComponent<GridShadowScrollAreaProps & React_2.RefAttributes<HTMLDivElement>>;
  
       export interface GridShadowScrollAreaProps extends React_2.HTMLAttributes<HTMLDivElement> {
           children: React_2.ReactNode;
       }
  
       /**
        * Signal to the underlying logic what version of the public component API
        * of the Data Grid is exposed.
        */
       export enum GridSignature {
           DataGrid = "DataGrid",
           DataGridPro = "DataGridPro",
           DataGridPremium = "DataGridPremium",
       }
  
       /**
        * Column Definition interface used for columns with the `singleSelect` type.
        * @demos
        *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
        */
       export interface GridSingleSelectColDef<R extends GridValidRowModel = any, V = any, F = V> extends GridBaseColDef<R, V, F> {
           /**
            * The type of the column.
            * @default 'singleSelect'
            */
           type: 'singleSelect';
           /**
            * To be used in combination with `type: 'singleSelect'`. This is an array (or a function returning an array) of the possible cell values and labels.
            */
           valueOptions?: Array<ValueOptions> | ((params: GridValueOptionsParams<R>) => Array<ValueOptions>);
           /**
            * Used to determine the label displayed for a given value option.
            * @param {ValueOptions} value The current value option.
            * @returns {string} The text to be displayed.
            * @default {defaultGetOptionLabel}
            */
           getOptionLabel: (value: ValueOptions) => string;
           /**
            * Used to determine the value used for a value option.
            * @param {ValueOptions} value The current value option.
            * @returns {string} The value to be used.
            * @default {defaultGetOptionValue}
            */
           getOptionValue: (value: ValueOptions) => any;
       }
  
       export const GridSkeletonCell: typeof GridSkeletonCell_2;
  
       function GridSkeletonCell_2(props: GridSkeletonCellProps): React_2.JSX.Element;
  
       namespace GridSkeletonCell_2 {
           var propTypes: any;
       }
  
       export interface GridSkeletonCellProps extends React_2.HTMLAttributes<HTMLDivElement> {
           type?: GridColType;
           width?: number | string;
           height?: number | 'auto';
           field?: string;
           align?: string;
           /**
            * If `true`, the cell will not display the skeleton but still reserve the cell space.
            * @default false
            */
           empty?: boolean;
       }
  
       export interface GridSkeletonRowNode extends GridTreeBasicNode {
           type: 'skeletonRow';
           /**
            * The id of the group containing this node.
            * Is always equal to `GRID_ROOT_GROUP_ID`.
            */
           parent: GridRowId;
       }
  
       export type GridSlotProps = BaseSlotProps & ElementSlotProps;
  
       /**
        * Grid components React prop interface containing all the overridable components.
        */
       interface GridSlotsComponent extends GridBaseSlots, GridIconSlotsComponent {
           /**
            * Component rendered for the bottom container.
            * @default GridBottomContainer
            */
           bottomContainer: React_2.JSXElementConstructor<GridSlotProps['bottomContainer']>;
           /**
            * Component rendered for each cell.
            * @default GridCell
            */
           cell: React_2.JSXElementConstructor<GridSlotProps['cell']>;
           /**
            * Component rendered for each skeleton cell.
            * @default GridSkeletonCell
            */
           skeletonCell: React_2.JSXElementConstructor<GridSlotProps['skeletonCell']>;
           /**
            * Filter icon component rendered in each column header.
            * @default GridColumnHeaderFilterIconButton
            */
           columnHeaderFilterIconButton: React_2.JSXElementConstructor<GridSlotProps['columnHeaderFilterIconButton']>;
           /**
            * Sort icon component rendered in each column header.
            * @default GridColumnHeaderSortIcon
            */
           columnHeaderSortIcon: React_2.JSXElementConstructor<GridSlotProps['columnHeaderSortIcon']>;
           /**
            * Column menu component rendered by clicking on the 3 dots "kebab" icon in column headers.
            * @default GridColumnMenu
            */
           columnMenu: React_2.JSXElementConstructor<GridSlotProps['columnMenu']>;
           /**
            * Component responsible for rendering the column headers.
            * @default GridColumnHeaders
            */
           columnHeaders: React_2.JSXElementConstructor<GridSlotProps['columnHeaders']>;
           /**
            * Component responsible for rendering the detail panels.
            * @default GridDetailPanels
            */
           detailPanels: React_2.JSXElementConstructor<GridSlotProps['detailPanels']>;
           /**
            * Footer component rendered at the bottom of the grid viewport.
            * @default GridFooter
            */
           footer: React_2.JSXElementConstructor<GridSlotProps['footer']>;
           /**
            * Row count component rendered in the footer
            * @default GridRowCount
            */
           footerRowCount: React_2.JSXElementConstructor<GridSlotProps['footerRowCount']>;
           /**
            * Toolbar component rendered in the grid header.
            */
           toolbar: React_2.JSXElementConstructor<GridSlotProps['toolbar']>;
           /**
            * Pinned rows container.
            * @ignore - do not document
            */
           pinnedRows: React_2.JSXElementConstructor<GridSlotProps['pinnedRows']>;
           /**
            * Loading overlay component rendered when the grid is in a loading state.
            * @default GridLoadingOverlay
            */
           loadingOverlay: React_2.JSXElementConstructor<GridSlotProps['loadingOverlay']>;
           /**
            * No results overlay component rendered when the grid has no results after filtering.
            * @default GridNoResultsOverlay
            */
           noResultsOverlay: React_2.JSXElementConstructor<GridSlotProps['noResultsOverlay']>;
           /**
            * No rows overlay component rendered when the grid has no rows.
            * @default GridNoRowsOverlay
            */
           noRowsOverlay: React_2.JSXElementConstructor<GridSlotProps['noRowsOverlay']>;
           /**
            * No columns overlay component rendered when the grid has no columns.
            * @default GridNoColumnsOverlay
            */
           noColumnsOverlay: React_2.JSXElementConstructor<GridSlotProps['noColumnsOverlay']>;
           /**
            * Pagination component rendered in the grid footer by default.
            * @default Pagination
            */
           pagination: React_2.JSXElementConstructor<GridSlotProps['pagination']> | null;
           /**
            * Filter panel component rendered when clicking the filter button.
            * @default GridFilterPanel
            */
           filterPanel: React_2.JSXElementConstructor<GridSlotProps['filterPanel']>;
           /**
            * GridColumns panel component rendered when clicking the columns button.
            * @default GridColumnsPanel
            */
           columnsPanel: React_2.JSXElementConstructor<GridSlotProps['columnsPanel']>;
           /**
            * Component used inside Grid Columns panel to manage columns.
            * @default GridColumnsManagement
            */
           columnsManagement: React_2.JSXElementConstructor<any>;
           /**
            * Panel component wrapping the filters and columns panels.
            * @default GridPanel
            */
           panel: React_2.JSXElementConstructor<GridSlotProps['panel']>;
           /**
            * Component rendered for each row.
            * @default GridRow
            */
           row: React_2.JSXElementConstructor<GridSlotProps['row']>;
       }
       export { GridSlotsComponent as GridSlots }
       export { GridSlotsComponent }
  
       /**
        * Overridable components props dynamically passed to the component at rendering.
        */
       export type GridSlotsComponentsProps = Partial<{ [K in keyof GridSlotProps]: Partial<GridSlotProps[K]> }>;
  
       /**
        * The sort API interface that is available in the grid [[apiRef]].
        */
       export interface GridSortApi {
           /**
            * Returns the sort model currently applied to the grid.
            * @returns {GridSortModel} The `GridSortModel`.
            */
           getSortModel: () => GridSortModel;
           /**
            * Applies the current sort model to the rows.
            */
           applySorting: () => void;
           /**
            * Updates the sort model and triggers the sorting of rows.
            * @param {GridSortModel} model The `GridSortModel` to be applied.
            */
           setSortModel: (model: GridSortModel) => void;
           /**
            * Sorts a column.
            * @param {GridColDef['field']} field The field identifier of the column to be sorted.
            * @param {GridSortDirection} direction The direction to be sorted. By default, the next in the `sortingOrder` prop.
            * @param {boolean} allowMultipleSorting Whether to keep the existing [GridSortModel]. Default is `false`.
            */
           sortColumn: (field: GridColDef['field'], direction?: GridSortDirection, allowMultipleSorting?: boolean) => void;
           /**
            * Returns all rows sorted according to the active sort model.
            * @returns {GridRowModel[]} The sorted [[GridRowModel]] objects.
            */
           getSortedRows: () => GridRowModel[];
           /**
            * Returns all row ids sorted according to the active sort model.
            * @returns {GridRowId[]} The sorted [[GridRowId]] values.
            */
           getSortedRowIds: () => GridRowId[];
           /**
            * Gets the `GridRowId` of a row at a specific index.
            * The index is based on the sorted but unfiltered row list.
            * @param {number} index The index of the row
            * @returns {GridRowId} The `GridRowId` of the row.
            */
           getRowIdFromRowIndex: (index: number) => GridRowId;
       }
  
       export interface GridSortCellParams<V = any> {
           id: GridRowId;
           field: string;
           value: V;
           rowNode: GridTreeNode;
           api: any;
       }
  
       export type GridSortColumnLookup = Record<string, {
           sortDirection: GridSortDirection;
           sortIndex?: number;
       }>;
  
       /**
        * @category Sorting
        * @ignore - do not document.
        */
       export const gridSortColumnLookupSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridSortColumnLookup;
  
       export type GridSortDirection = 'asc' | 'desc' | null | undefined;
  
       /**
        * Get the id and the model of the rows after the sorting process.
        * @category Sorting
        */
       export const gridSortedRowEntriesSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridRowEntry<GridValidRowModel>[];
  
       /**
        * Get the id of the rows after the sorting process.
        * @category Sorting
        */
       export const gridSortedRowIdsSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridRowId[];
  
       export interface GridSortingInitialState {
           sortModel?: GridSortModel;
       }
  
       interface GridSortingMethodParams {
           sortRowList: GridSortingModelApplier | null;
       }
  
       type GridSortingMethodValue = GridRowId[];
  
       type GridSortingModelApplier = (rowList: GridTreeNode[]) => GridRowId[];
  
       export interface GridSortingState {
           sortedRows: GridRowId[];
           sortModel: GridSortModel;
       }
  
       /**
        * Object that represents the column sorted data, part of the [[GridSortModel]].
        */
       interface GridSortItem {
           /**
            * The column field identifier.
            */
           field: string;
           /**
            * The direction of the column that the grid should sort.
            */
           sort: GridSortDirection;
       }
  
       /**
        * The model used for sorting the grid.
        */
       export type GridSortModel = readonly GridSortItem[];
  
       /**
        * Get the current sorting model.
        * @category Sorting
        */
       export const gridSortModelSelector: (args_0: RefObject_2<    {
       state: GridStateCommunity;
       } | null>) => GridSortModel;
  
       /**
        * Params passed to `apiRef.current.startCellEditMode`.
        */
       interface GridStartCellEditModeParams {
           /**
            * The row id.
            */
           id: GridRowId;
           /**
            * The field.
            */
           field: string;
           /**
            * If `true`, the value will be deleted before entering the edit mode.
            */
           deleteValue?: boolean;
           /**
            * The initial value for the field.
            * If `deleteValue` is also true, this value is not used.
            * @deprecated No longer needed.
            */
           initialValue?: any;
       }
  
       /**
        * Params passed to `apiRef.current.startRowEditMode`.
        */
       interface GridStartRowEditModeParams {
           /**
            * The row id.
            */
           id: GridRowId;
           /**
            * The field to put focus.
            */
           fieldToFocus?: string;
           /**
            * If `true`, the value in `fieldToFocus` will be deleted before entering the edit mode.
            */
           deleteValue?: boolean;
           /**
            * The initial value for the given `fieldToFocus`.
            * If `deleteValue` is also true, this value is not used.
            * @deprecated No longer needed.
            */
           initialValue?: string;
       }
  
       /**
        * The state of Data Grid.
        */
       export type GridState = GridStateCommunity;
  
       export interface GridStateApi<State extends GridStateCommunity> {
           /**
            * Property that contains the whole state of the grid.
            */
           state: State;
           /**
            * Sets the whole state of the grid.
            * @param {GridState | (oldState: GridState) => GridState} state The new state or the callback creating the new state.
            * @param {string} reason The reason for this change to happen.
            * @returns {boolean} Has the state been updated.
            * @ignore - do not document.
            */
           setState: <S extends State, K extends keyof GridControlledStateReasonLookup>(state: S | ((previousState: S) => S), reason?: GridControlledStateReasonLookup[K]) => boolean;
       }
  
       type GridStateColDef<R extends GridValidRowModel = any, V = any, F = V> = GridColDef<R, V, F> & {
           computedWidth: number;
           /**
            * If `true`, it means that at least one of the dimension's property of this column has been modified since the last time the column prop has changed.
            */
           hasBeenResized?: boolean;
       };
  
       /**
        * The state of Data Grid.
        */
       interface GridStateCommunity {
           isRtl: boolean;
           props: GridStateProps;
           dimensions: GridDimensionsState;
           rows: GridRowsState;
           visibleRowsLookup: GridVisibleRowsLookupState;
           rowsMeta: GridRowsMetaState;
           editRows: GridEditingState;
           headerFiltering: GridHeaderFilteringState;
           pagination: GridPaginationState;
           columns: GridColumnsState;
           columnGrouping: GridColumnsGroupingState;
           columnMenu: GridColumnMenuState;
           pinnedColumns: GridColumnPinningState;
           sorting: GridSortingState;
           focus: GridFocusState;
           tabIndex: GridTabIndexState;
           rowSelection: GridRowSelectionModel;
           filter: GridFilterState;
           preferencePanel: GridPreferencePanelState;
           density: GridDensityState;
           virtualization: GridVirtualizationState;
           columnResize: GridColumnResizeState;
           rowSpanning: GridRowSpanningState;
           listViewColumn: GridListViewState;
           rowReorder: GridRowReorderState;
       }
  
       type GridStateInitializer<P extends Partial<DataGridProcessedProps> = DataGridProcessedProps, PrivateApi extends GridPrivateApiCommon = GridPrivateApiCommunity> = (state: DeepPartial<PrivateApi['state']>, props: P, privateApiRef: RefObject<PrivateApi>) => DeepPartial<PrivateApi['state']>;
  
       export interface GridStatePersistenceApi<InitialState extends GridInitialStateCommunity> {
           /**
            * Generates a serializable object containing the exportable parts of the DataGrid state.
            * These values can then be passed to the `initialState` prop or injected using the `restoreState` method.
            * @param {GridExportStateParams} params With all properties from [[GridExportStateParams]]
            * @returns {GridInitialState} The exported state.
            */
           exportState: (params?: GridExportStateParams) => InitialState;
           /**
            * Inject the given values into the state of the DataGrid.
            * @param {GridInitialState} stateToRestore The exported state to restore.
            */
           restoreState: (stateToRestore: InitialState) => void;
       }
  
       interface GridStatePrivateApi<State extends GridStateCommunity> {
           /**
            * Updates a single sub-state.
            * Publishes the `xxxChange` event and calls the `onXXXChange` prop.
            * @param {K} key Which key of the state to update.
            * @param {(oldState: GridState) => GridState} state The new state of the sub-state to update.
            * @param {GridControlledStateReasonLookup[K]} reason The reason to pass to the callback prop and event.
            * @returns {boolean} `true` if the state has been successfully updated.
            */
           updateControlState: <K extends keyof GridControlledStateReasonLookup>(key: K, state: (oldState: State[K]) => State[K], reason?: GridControlledStateReasonLookup[K]) => boolean;
           /**
            * Updates a control state that binds the model, the onChange prop, and the grid state together.
            * @param {GridControlStateItem>} controlState The [[GridControlStateItem]] to be registered.
                */
            registerControlState: <E extends keyof GridControlledStateEventLookup, Args>(controlState: GridControlStateItem<State, Args, E>) => void;
           }
  
           /**
            * Some props are passed on the state to enable grid selectors to select
            * and react to them.
            */
           type GridStateProps = Pick<DataGridProcessedProps, 'getRowId' | 'listView' | 'isCellEditable'>;
  
           /**
            * Params passed to `apiRef.current.stopCellEditMode`.
            */
           interface GridStopCellEditModeParams {
               /**
                * The row id.
                */
               id: GridRowId;
               /**
                * The field.
                */
               field: string;
               /**
                * Whether or not to ignore the modifications made on this cell.
                * @default false
                */
               ignoreModifications?: boolean;
               /**
                * To which cell to move focus after finishing editing.
                * @default "none"
                */
               cellToFocusAfter?: 'none' | 'below' | 'right' | 'left';
           }
  
           /**
            * Params passed to `apiRef.current.stopRowEditMode`.
            */
           interface GridStopRowEditModeParams {
               /**
                * The row id.
                */
               id: GridRowId;
               /**
                * Whether or not to ignore the modifications made on this cell.
                * @default false
                */
               ignoreModifications?: boolean;
               /**
                * The field that has focus when the editing is stopped.
                * Used to calculate which cell to move the focus to after finishing editing.
                */
               field?: string;
               /**
                * To which cell to move focus after finishing editing.
                * Only works if the field is also specified, otherwise focus stay in the same cell.
                * @default "none"
                */
               cellToFocusAfter?: 'none' | 'below' | 'right' | 'left';
           }
  
           enum GridStrategyGroup {
               DataSource = "dataSource",
               RowTree = "rowTree",
           }
  
           type GridStrategyGroupValue = `${GridStrategyGroup}`;
  
           interface GridStrategyProcessingApi {
               /**
                * Registers a strategy processor.
                * If the strategy is active, it emits an event to notify the agents to re-apply the processor.
                * @template P
                * @param {string} strategyName The name of the strategy on which this processor should be applied.
                * @param {GridStrategyProcessorName} processorName The name of the processor.
                * @param {GridStrategyProcessor<P>} processor The processor to register.
                * @returns {() => void} A function to unregister the processor.
                */
               registerStrategyProcessor: <P extends GridStrategyProcessorName>(strategyName: string, processorName: P, processor: GridStrategyProcessor<P>) => () => void;
               /**
                * Set a callback to know if a strategy is available.
                * @param {GridStrategyGroupValue} strategyGroup The group for which we set strategy availability.
                * @param {string} strategyName The name of the strategy.
                * @param {boolean} callback A callback to know if this strategy is available.
                */
               setStrategyAvailability: (strategyGroup: GridStrategyGroupValue, strategyName: string, callback: () => boolean) => void;
               /**
                * Returns the name of the active strategy of a given strategy group
                * @param {GridStrategyGroupValue} strategyGroup The group from which we want the active strategy.
                * @returns {string} The name of the active strategy.
                */
               getActiveStrategy: (strategyGroup: GridStrategyGroupValue) => string;
               /**
                * Run the processor registered for the active strategy.
                * @param {GridStrategyProcessorName} processorName The name of the processor to run.
                * @param {GridStrategyProcessingLookup[P]['params']} params Additional params to pass to the processor.
                * @returns {GridStrategyProcessingLookup[P]['value']} The value returned by the processor.
                */
               applyStrategyProcessor: <P extends GridStrategyProcessorName>(processorName: P, params: GridStrategyProcessingLookup[P]['params']) => GridStrategyProcessingLookup[P]['value'];
           }
  
           interface GridStrategyProcessingLookup {
               dataSourceRowsUpdate: {
                   group: GridStrategyGroup.DataSource;
                   params: {
                       response: GridGetRowsResponse;
                       fetchParams: GridGetRowsParams;
                       options: GridGetRowsOptions;
                   } | {
                       error: Error;
                       fetchParams: GridGetRowsParams;
                       options: GridGetRowsOptions;
                   };
                   value: void;
               };
               rowTreeCreation: {
                   group: GridStrategyGroup.RowTree;
                   params: GridRowTreeCreationParams;
                   value: GridRowTreeCreationValue;
               };
               filtering: {
                   group: GridStrategyGroup.RowTree;
                   params: GridFilteringMethodParams;
                   value: GridFilteringMethodValue;
               };
               sorting: {
                   group: GridStrategyGroup.RowTree;
                   params: GridSortingMethodParams;
                   value: GridSortingMethodValue;
               };
               visibleRowsLookupCreation: {
                   group: GridStrategyGroup.RowTree;
                   params: {
                       tree: GridRowsState['tree'];
                       filteredRowsLookup: GridFilterState['filteredRowsLookup'];
                   };
                   value: GridVisibleRowsLookupState;
               };
           }
  
           type GridStrategyProcessor<P extends GridStrategyProcessorName> = (params: GridStrategyProcessingLookup[P]['params']) => GridStrategyProcessingLookup[P]['value'];
  
           type GridStrategyProcessorName = keyof GridStrategyProcessingLookup;
  
           export const gridStringOrNumberComparator: GridComparatorFn;
  
           export const gridTabIndexCellSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => GridCellCoordinates_2 | null;
  
           export const gridTabIndexColumnGroupHeaderSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => GridColumnGroupIdentifier_2 | null;
  
           export const gridTabIndexColumnHeaderFilterSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => GridColumnIdentifier_2 | null;
  
           export const gridTabIndexColumnHeaderSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => GridColumnIdentifier_2 | null;
  
           export interface GridTabIndexState {
               cell: GridCellCoordinates | null;
               columnHeader: GridColumnIdentifier | null;
               columnHeaderFilter: GridColumnIdentifier | null;
               columnGroupHeader: GridColumnGroupIdentifier | null;
           }
  
           export const gridTabIndexStateSelector: OutputSelector_2<GridStateCommunity, unknown, GridTabIndexState>;
  
           export const GridTableRowsIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           /**
            * @deprecated Use the `showToolbar` prop to show the default toolbar instead. This component will be removed in a future major release.
            */
           export const GridToolbar: React_2.ForwardRefExoticComponent<GridToolbarProps> | React_2.ForwardRefExoticComponent<GridToolbarProps & React_2.RefAttributes<HTMLDivElement>>;
  
           /**
            * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/columns-panel/ Columns Panel Trigger} component instead. This component will be removed in a future major release.
            */
           export const GridToolbarColumnsButton: React_2.ForwardRefExoticComponent<GridToolbarColumnsButtonProps> | React_2.ForwardRefExoticComponent<GridToolbarColumnsButtonProps & React_2.RefAttributes<HTMLButtonElement>>;
  
           interface GridToolbarColumnsButtonProps {
               /**
                * The props used for each slot inside.
                * @default {}
                */
               slotProps?: {
                   button?: Partial<GridSlotProps['baseButton']>;
                   tooltip?: Partial<GridSlotProps['baseTooltip']>;
               };
           }
  
           /**
            * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/toolbar/ Toolbar} component instead. This component will be removed in a future major release.
            */
           export const GridToolbarContainer: React_2.ForwardRefExoticComponent<GridToolbarContainerProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
               sx?: SxProps_2<Theme_2>;
           } & React_2.RefAttributes<HTMLDivElement>>;
  
           export type GridToolbarContainerProps = React_2.HTMLAttributes<HTMLDivElement> & {
               sx?: SxProps_2<Theme_2>;
           };
  
           /**
            * @deprecated See {@link https://mui.com/x/react-data-grid/accessibility/#set-the-density-programmatically Accessibility—Set the density programmatically} for an example of adding a density selector to the toolbar. This component will be removed in a future major release.
            */
           export const GridToolbarDensitySelector: React_2.ForwardRefExoticComponent<GridToolbarDensitySelectorProps> | React_2.ForwardRefExoticComponent<GridToolbarDensitySelectorProps & React_2.RefAttributes<HTMLButtonElement>>;
  
           interface GridToolbarDensitySelectorProps {
               /**
                * The props used for each slot inside.
                * @default {}
                */
               slotProps?: {
                   button?: Partial<GridSlotProps['baseButton']>;
                   tooltip?: Partial<GridSlotProps['baseTooltip']>;
               };
           }
  
           /**
            * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/export/ Export} components instead. This component will be removed in a future major release.
            */
           export const GridToolbarExport: React_2.ForwardRefExoticComponent<GridToolbarExportProps> | React_2.ForwardRefExoticComponent<GridToolbarExportProps & React_2.RefAttributes<HTMLButtonElement>>;
  
           export const GridToolbarExportContainer: React_2.ForwardRefExoticComponent<React_2.PropsWithChildren<GridToolbarExportContainerProps>> | React_2.ForwardRefExoticComponent<GridToolbarExportContainerProps & {
               children?: React_2.ReactNode | undefined;
           } & React_2.RefAttributes<HTMLButtonElement>>;
  
           interface GridToolbarExportContainerProps {
               /**
                * The props used for each slot inside.
                * @default {}
                */
               slotProps?: {
                   button?: Partial<GridSlotProps['baseButton']>;
                   tooltip?: Partial<GridSlotProps['baseTooltip']>;
               };
           }
  
           export interface GridToolbarExportProps {
               csvOptions?: GridCsvExportOptions & GridExportDisplayOptions;
               printOptions?: GridPrintExportOptions & GridExportDisplayOptions;
               /**
                * The props used for each slot inside.
                * @default {}
                */
               slotProps?: {
                   button?: Partial<GridSlotProps['baseButton']>;
                   tooltip?: Partial<GridSlotProps['baseTooltip']>;
               };
               [x: `data-${string}`]: string;
           }
  
           /**
            * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/filter-panel/ Filter Panel Trigger} component instead. This component will be removed in a future major release.
            */
           export const GridToolbarFilterButton: React_2.ForwardRefExoticComponent<GridToolbarFilterButtonProps> | React_2.ForwardRefExoticComponent<GridToolbarFilterButtonProps & React_2.RefAttributes<HTMLButtonElement>>;
  
           export interface GridToolbarFilterButtonProps {
               /**
                * The props used for each slot inside.
                * @default {}
                */
               slotProps?: {
                   button?: Partial<GridSlotProps['baseButton']>;
                   tooltip?: Partial<GridSlotProps['baseTooltip']>;
                   badge?: Partial<GridSlotProps['baseBadge']>;
               };
           }
  
           export interface GridToolbarProps extends GridToolbarContainerProps, GridToolbarExportProps {
               /**
                * Show the quick filter component.
                * @default true
                */
               showQuickFilter?: boolean;
               /**
                * Props passed to the quick filter component.
                */
               quickFilterProps?: GridToolbarQuickFilterProps;
           }
  
           /**
            * @deprecated Use the {@link https://mui.com/x/react-data-grid/components/quick-filter/ Quick Filter} component instead. This component will be removed in a future major release.
            */
           export function GridToolbarQuickFilter(props: GridToolbarQuickFilterProps): React_2.JSX.Element;
  
           export namespace GridToolbarQuickFilter {
               var propTypes: any;
           }
  
           export type GridToolbarQuickFilterProps = {
               className?: string;
               /**
                * Function responsible for parsing text input in an array of independent values for quick filtering.
                * @param {string} input The value entered by the user
                * @returns {any[]} The array of value on which quick filter is applied
                * @default (searchText: string) => searchText
                *   .split(' ')
                *   .filter((word) => word !== '')
                */
               quickFilterParser?: (input: string) => any[];
               /**
                * Function responsible for formatting values of quick filter in a string when the model is modified
                * @param {any[]} values The new values passed to the quick filter model
                * @returns {string} The string to display in the text field
                * @default (values: string[]) => values.join(' ')
                */
               quickFilterFormatter?: (values: NonNullable<GridFilterModel['quickFilterValues']>) => string;
               /**
                * The debounce time in milliseconds.
                * @default 150
                */
               debounceMs?: number;
               slotProps?: {
                   root: TextFieldProps;
               };
           };
  
           export const gridTopLevelRowCountSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => number;
  
           export type GridTranslationKeys = keyof GridLocaleText;
  
           export interface GridTreeBasicNode {
               /**
                * The uniq id of this node.
                */
               id: GridRowId;
               /**
                * Depth of this node in the tree.
                */
               depth: number;
           }
  
           type GridTreeDepths = {
               [depth: number]: number;
           };
  
           export type GridTreeNode = GridLeafNode | GridGroupNode | GridFooterNode | GridPinnedRowNode | GridSkeletonRowNode;
  
           export type GridTreeNodeWithRender = GridLeafNode | GridGroupNode | GridFooterNode | GridPinnedRowNode;
  
           export const GridTripleDotsVerticalIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           export type GridTypeFilterInputValueProps = GridFilterInputValueProps<TextFieldProps> & {
               type?: 'text' | 'number' | 'date' | 'datetime-local';
           };
  
           export type GridUpdateAction = 'delete';
  
           export class GridUpdateRowError extends Error {
               /**
                * The parameters used in the failed request
                */
               readonly params: GridUpdateRowParams;
               /**
                * The original error that caused this error
                */
               readonly cause?: Error;
               constructor(options: {
                   message: string;
                   params: GridUpdateRowParams;
                   cause?: Error;
               });
           }
  
           export interface GridUpdateRowParams {
               rowId: GridRowId;
               updatedRow: GridRowModel;
               previousRow: GridRowModel;
           }
  
           export type GridValidRowModel = {
               [key: string | symbol]: any;
           };
  
           export type GridValueFormatter<R extends GridValidRowModel = GridValidRowModel, V = any, F = V, TValue = never> = (value: TValue, row: R, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => F;
  
           export type GridValueGetter<R extends GridValidRowModel = GridValidRowModel, V = any, F = V, TValue = never> = (value: TValue, row: R, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => V;
  
           /**
            * Object passed as parameter of the valueOptions function for singleSelect column.
            */
           export interface GridValueOptionsParams<R extends GridValidRowModel = any> {
               /**
                * The field of the column to which options will be provided
                */
               field: string;
               /**
                * The grid row id.
                */
               id?: GridRowId;
               /**
                * The row model of the row that the current cell belongs to.
                */
               row?: R;
           }
  
           export type GridValueParser<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (value: F | undefined, row: R | undefined, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => V;
  
           export type GridValueSetter<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (value: V, row: R, column: GridColDef<R, V, F>, apiRef: RefObject<GridApiCommunity>) => R;
  
           export const GridViewColumnIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           export const GridViewHeadlineIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           export const GridViewStreamIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           export interface GridVirtualizationApi {
               /**
                * Enable/disable virtualization.
                * @param {boolean} enabled The enabled value for virtualization
                */
               unstable_setVirtualization: (enabled: boolean) => void;
               /**
                * Enable/disable column virtualization.
                * @param {boolean} enabled The enabled value for column virtualization
                */
               unstable_setColumnVirtualization: (enabled: boolean) => void;
           }
  
           /**
            * Get the enabled state for column virtualization
            * @category Virtualization
            */
           export const gridVirtualizationColumnEnabledSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => boolean;
  
           /**
            * Get the enabled state for virtualization
            * @category Virtualization
            * @deprecated Use `gridVirtualizationColumnEnabledSelector` and `gridVirtualizationRowEnabledSelector`
            */
           export const gridVirtualizationEnabledSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => boolean;
  
           interface GridVirtualizationPrivateApi {
               /**
                * Update grid rendering context.
                * @returns {GridRenderContext} The `GridRenderContext`.
                */
               updateRenderContext?: () => void;
           }
  
           /**
            * Get the enabled state for row virtualization
            * @category Virtualization
            */
           export const gridVirtualizationRowEnabledSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => boolean;
  
           /**
            * Get the columns state
            * @category Virtualization
            */
           export const gridVirtualizationSelector: OutputSelector_2<GridStateCommunity, unknown, GridVirtualizationState_2>;
  
           export type GridVirtualizationState = { [K in keyof Virtualization.State['virtualization']]: Virtualization.State['virtualization'][K] };
  
           interface GridVirtualScrollerProps {
               children?: React_2.ReactNode;
           }
  
           export const GridVisibilityOffIcon: (props: GridBaseIconProps_2) => React_2.ReactNode;
  
           /**
            * Get the visible columns as a lookup (an object containing the field for keys and the definition for values).
            * @category Visible Columns
            */
           export const gridVisibleColumnDefinitionsSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => GridStateColDef[];
  
           /**
            * Get the field of each visible column.
            * @category Visible Columns
            */
           export const gridVisibleColumnFieldsSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => string[];
  
           /**
            * Get the visible pinned columns.
            * @category Visible Columns
            */
           export const gridVisiblePinnedColumnDefinitionsSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => {
               left: GridStateColDef[];
               right: GridStateColDef[];
           };
  
           /**
            * @category Visible rows
            * @ignore - do not document.
            */
           export const gridVisibleRowsLookupSelector: OutputSelector_2<GridStateCommunity, unknown, GridVisibleRowsLookupState>;
  
           /**
            * Visibility status for each row.
            * A row is visible if it is passing the filters AND if its parents are expanded.
            * If a row is not registered in this lookup, it is visible.
            */
           type GridVisibleRowsLookupState = Record<GridRowId, false>;
  
           /**
            * Get the rows, range and rowIndex lookup map after filtering and sorting.
            * Does not contain the collapsed children.
            * @category Pagination
            */
           export const gridVisibleRowsSelector: (args_0: RefObject_2<    {
           state: GridStateCommunity;
           } | null>) => {
               rows: GridRowEntry_2<GridValidRowModel_2>[];
               range: {
                   firstRowIndex: number;
                   lastRowIndex: number;
               } | null;
               rowIdToIndexMap: Map<GridRowId, number>;
           };
  
           type HeightCache = Map<GridRowId, HeightEntry>;
  
           type IconButtonProps = Omit<ButtonProps, 'startIcon'> & {
               label?: string;
               color?: 'default' | 'inherit' | 'primary';
               edge?: 'start' | 'end' | false;
           };
  
           type IconProps = CommonProps<SVGSVGElement> & {
               fontSize?: 'small' | 'medium' | 'large' | 'inherit';
               color?: 'action' | string;
               titleAccess?: string;
           };
  
           type InputProps = CommonProps & {
               ref?: React.Ref<HTMLElement>;
               inputRef?: React.Ref<HTMLInputElement>;
               fullWidth?: boolean;
               type?: React.HTMLInputTypeAttribute;
               value?: string;
               onChange: React.ChangeEventHandler;
               disabled?: boolean;
               endAdornment?: React.ReactNode;
               startAdornment?: React.ReactNode;
               slotProps?: {
                   htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
               };
           };
  
           export const isAutogeneratedRow: (row: GridRowModel) => boolean;
  
           export function isLeaf(node: GridColumnNode): node is GridLeafColumn;
  
           const keys: {
               readonly spacingUnit: "--DataGrid-t-spacing-unit";
               readonly colors: {
                   readonly border: {
                       readonly base: "--DataGrid-t-color-border-base";
                   };
                   readonly foreground: {
                       readonly base: "--DataGrid-t-color-foreground-base";
                       readonly muted: "--DataGrid-t-color-foreground-muted";
                       readonly accent: "--DataGrid-t-color-foreground-accent";
                       readonly disabled: "--DataGrid-t-color-foreground-disabled";
                       readonly error: "--DataGrid-t-color-foreground-error";
                   };
                   readonly background: {
                       readonly base: "--DataGrid-t-color-background-base";
                       readonly overlay: "--DataGrid-t-color-background-overlay";
                       readonly backdrop: "--DataGrid-t-color-background-backdrop";
                   };
                   readonly interactive: {
                       readonly hover: "--DataGrid-t-color-interactive-hover";
                       readonly hoverOpacity: "--DataGrid-t-color-interactive-hover-opacity";
                       readonly focus: "--DataGrid-t-color-interactive-focus";
                       readonly focusOpacity: "--DataGrid-t-color-interactive-focus-opacity";
                       readonly disabled: "--DataGrid-t-color-interactive-disabled";
                       readonly disabledOpacity: "--DataGrid-t-color-interactive-disabled-opacity";
                       readonly selected: "--DataGrid-t-color-interactive-selected";
                       readonly selectedOpacity: "--DataGrid-t-color-interactive-selected-opacity";
                   };
               };
               readonly header: {
                   readonly background: {
                       readonly base: "--DataGrid-t-header-background-base";
                   };
               };
               readonly cell: {
                   readonly background: {
                       readonly pinned: "--DataGrid-t-cell-background-pinned";
                   };
               };
               readonly radius: {
                   readonly base: "--DataGrid-t-radius-base";
               };
               readonly typography: {
                   readonly font: {
                       readonly body: "--DataGrid-t-typography-font-body";
                       readonly small: "--DataGrid-t-typography-font-small";
                       readonly large: "--DataGrid-t-typography-font-large";
                   };
                   readonly fontFamily: {
                       readonly base: "--DataGrid-t-typography-font-family-base";
                   };
                   readonly fontWeight: {
                       readonly light: "--DataGrid-t-typography-font-weight-light";
                       readonly regular: "--DataGrid-t-typography-font-weight-regular";
                       readonly medium: "--DataGrid-t-typography-font-weight-medium";
                       readonly bold: "--DataGrid-t-typography-font-weight-bold";
                   };
               };
               readonly transitions: {
                   readonly easing: {
                       readonly easeIn: "--DataGrid-t-transition-easing-ease-in";
                       readonly easeOut: "--DataGrid-t-transition-easing-ease-out";
                       readonly easeInOut: "--DataGrid-t-transition-easing-ease-in-out";
                   };
                   readonly duration: {
                       readonly short: "--DataGrid-t-transition-duration-short";
                       readonly base: "--DataGrid-t-transition-duration-base";
                       readonly long: "--DataGrid-t-transition-duration-long";
                   };
               };
               readonly shadows: {
                   readonly base: "--DataGrid-t-shadow-base";
                   readonly overlay: "--DataGrid-t-shadow-overlay";
               };
               readonly zIndex: {
                   readonly panel: "--DataGrid-t-z-index-panel";
                   readonly menu: "--DataGrid-t-z-index-menu";
               };
           };
  
           type LinearProgressProps = CommonProps & {};
  
           export interface LoadingOverlayPropsOverrides {}
  
           export interface Logger {
               debug: (...args: any[]) => void;
               info: (...args: any[]) => void;
               warn: (...args: any[]) => void;
               error: (...args: any[]) => void;
           }
  
           type MainProps = React_2.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
  
           type MenuItemProps = CommonProps & {
               autoFocus?: boolean;
               children?: React.ReactNode;
               /** For items that aren't interactive themselves (but may contain an interactive widget) */
               inert?: boolean;
               disabled?: boolean;
               iconStart?: React.ReactNode;
               iconEnd?: React.ReactNode;
               selected?: boolean;
               value?: number | string | readonly string[];
               style?: React.CSSProperties;
           };
  
           type MenuListProps = CommonProps & {
               ref?: Ref<HTMLUListElement>;
               id?: string;
               children?: React.ReactNode;
               autoFocus?: boolean;
               autoFocusItem?: boolean;
           };
  
           type MenuPosition = 'bottom-end' | 'bottom-start' | 'bottom' | 'left-end' | 'left-start' | 'left' | 'right-end' | 'right-start' | 'right' | 'top-end' | 'top-start' | 'top' | undefined;
  
           export { MuiBaseEvent }
  
           export { MuiEvent }
  
           export interface NoColumnsOverlayPropsOverrides {}
  
           export interface NoResultsOverlayPropsOverrides {}
  
           export interface NoRowsOverlayPropsOverrides {}
  
           type OmitItself<TValue, TValueInitial> = TValue extends TValueInitial ? EmptyEntry<TValue> : CreateObjectEntries<TValue, TValueInitial>;
  
           export interface OutputSelector<State, Args, Result> {
               (apiRef: RefObject<{
                   state: State;
               } | null>, args?: Args): Result;
           }
  
           type PaginationProps = CommonProps & {
               count: number;
               page: number;
               rowsPerPage: number;
               rowsPerPageOptions?: readonly (number | {
                   value: number;
                   label: string;
               })[];
               onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
               onRowsPerPageChange?: (rowsPerPage: number) => void;
               disabled?: boolean;
           };
  
           export interface PaginationPropsOverrides {}
  
           export interface PanelPropsOverrides {}
  
           enum PinnedColumnPosition {
               NONE = 0,
               LEFT = 1,
               RIGHT = 2,
               VIRTUAL = 3,
           }
  
           export interface PinnedRowsPropsOverrides {}
  
           type Placement = AutoPlacement | BasePlacement | VariationPlacement;
  
           type PopperProps = CommonProps & {
               ref?: Ref<HTMLDivElement>;
               open: boolean;
               children?: React.ReactNode;
               clickAwayTouchEvent?: false | ClickAwayTouchEventHandler;
               clickAwayMouseEvent?: false | ClickAwayMouseEventHandler;
               flip?: boolean;
               focusTrap?: boolean;
               onExited?: (node: HTMLElement | null) => void;
               onClickAway?: (event: MouseEvent | TouchEvent) => void;
               onDidShow?: () => void;
               onDidHide?: () => void;
               id?: string;
               target?: Element | null;
               transition?: boolean;
               /** @default 'bottom' */
               placement?: Placement;
           };
  
           export { PropsFromSlot }
  
           type PublisherArgsEvent<E extends GridEvents, T extends {
               params: any;
               event: MuiBaseEvent;
           }> = {} extends T['event'] ? PublisherArgsOptionalEvent<E, T> : PublisherArgsRequiredEvent<E, T>;
  
           type PublisherArgsNoEvent<E extends GridEvents, T extends {
               params: any;
           }> = [E, T['params']];
  
           type PublisherArgsNoParams<E extends GridEvents> = [E];
  
           type PublisherArgsOptionalEvent<E extends GridEvents, T extends {
               params: any;
               event: MuiBaseEvent;
           }> = PublisherArgsRequiredEvent<E, T> | PublisherArgsNoEvent<E, T>;
  
           type PublisherArgsParams<E extends GridEvents, T extends {
               params: any;
           }> = [E, T['params']];
  
           type PublisherArgsRequiredEvent<E extends GridEvents, T extends {
               params: any;
               event: MuiBaseEvent;
           }> = [E, T['params'], T['event']];
  
           /**
            * The top level Quick Filter component that provides context to child components.
            * It renders a `<div />` element.
            *
            * Demos:
            *
            * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
            *
            * API:
            *
            * - [QuickFilter API](https://mui.com/x/api/data-grid/quick-filter/)
            */
           export function QuickFilter(props: QuickFilterProps): React_2.JSX.Element;
  
           export namespace QuickFilter {
               var propTypes: any;
           }
  
           /**
            * A button that resets the filter value.
            * It renders the `baseIconButton` slot.
            *
            * Demos:
            *
            * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
            *
            * API:
            *
            * - [QuickFilterClear API](https://mui.com/x/api/data-grid/quick-filter-clear/)
            */
           export const QuickFilterClear: React_2.ForwardRefExoticComponent<QuickFilterClearProps> | React_2.ForwardRefExoticComponent<Omit<QuickFilterClearProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
           export type QuickFilterClearProps = Omit<GridSlotProps['baseIconButton'], 'className'> & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<GridSlotProps['baseIconButton'], QuickFilterState>;
               /**
                * Override or extend the styles applied to the component.
                */
               className?: string | ((state: QuickFilterState) => string);
           };
  
           /**
            * A component that takes user input and filters row data.
            * It renders the `baseTextField` slot.
            *
            * Demos:
            *
            * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
            *
            * API:
            *
            * - [QuickFilterControl API](https://mui.com/x/api/data-grid/quick-filter-control/)
            */
           export const QuickFilterControl: React_2.ForwardRefExoticComponent<QuickFilterControlProps> | React_2.ForwardRefExoticComponent<Omit<QuickFilterControlProps, "ref"> & React_2.RefAttributes<HTMLInputElement>>;
  
           export type QuickFilterControlProps = Omit<GridSlotProps['baseTextField'], 'className'> & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<GridSlotProps['baseTextField'], QuickFilterState>;
               /**
                * Override or extend the styles applied to the component.
                */
               className?: string | ((state: QuickFilterState) => string);
           };
  
           export type QuickFilterProps = Omit<React_2.HTMLAttributes<HTMLDivElement>, 'className'> & {
               /**
                * Function responsible for parsing text input in an array of independent values for quick filtering.
                * @param {string} input The value entered by the user
                * @returns {any[]} The array of value on which quick filter is applied
                * @default (searchText: string) => searchText.split(' ').filter((word) => word !== '')
                */
               parser?: (input: string) => any[];
               /**
                * Function responsible for formatting values of quick filter in a string when the model is modified
                * @param {any[]} values The new values passed to the quick filter model
                * @returns {string} The string to display in the text field
                * @default (values: string[]) => values.join(' ')
                */
               formatter?: (values: NonNullable<GridFilterModel['quickFilterValues']>) => string;
               /**
                * The debounce time in milliseconds.
                * @default 150
                */
               debounceMs?: number;
               /**
                * The default expanded state of the quick filter control.
                * @default false
                */
               defaultExpanded?: boolean;
               /**
                * The expanded state of the quick filter control.
                */
               expanded?: boolean;
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<React_2.ComponentProps<'div'>, QuickFilterState>;
               /**
                * Override or extend the styles applied to the component.
                */
               className?: string | ((state: QuickFilterState) => string);
               /**
                * Callback function that is called when the quick filter input is expanded or collapsed.
                * @param {boolean} expanded The new expanded state of the quick filter control
                */
               onExpandedChange?: (expanded: boolean) => void;
           };
  
           interface QuickFilterState {
               value: string;
               expanded: boolean;
           }
  
           /**
            * A button that expands/collapses the quick filter.
            * It renders the `baseButton` slot.
            *
            * Demos:
            *
            * - [Quick Filter](https://mui.com/x/react-data-grid/components/quick-filter/)
            *
            * API:
            *
            * - [QuickFilterTrigger API](https://mui.com/x/api/data-grid/quick-filter-trigger/)
            */
           export const QuickFilterTrigger: React_2.ForwardRefExoticComponent<QuickFilterTriggerProps> | React_2.ForwardRefExoticComponent<Omit<QuickFilterTriggerProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
           export type QuickFilterTriggerProps = Omit<GridSlotProps['baseButton'], 'className'> & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<GridSlotProps['baseButton'], QuickFilterState>;
               /**
                * Override or extend the styles applied to the component.
                */
               className?: string | ((state: QuickFilterState) => string);
           };
  
           type Ref<T = HTMLElement> = React.RefCallback<T | null> | React.RefObject<T | null> | null;
  
           export const renderActionsCell: (params: GridRenderCellParams) => React_2.JSX.Element;
  
           export const renderBooleanCell: GridColDef['renderCell'];
  
           export const renderEditBooleanCell: (params: GridEditBooleanCellProps) => React_2.JSX.Element;
  
           export const renderEditDateCell: (params: GridRenderEditCellParams) => React_2.JSX.Element;
  
           export const renderEditInputCell: (params: GridEditInputCellProps) => React_2.JSX.Element;
  
           export const renderEditSingleSelectCell: (params: GridEditSingleSelectCellProps) => React_2.JSX.Element;
  
           export { RenderProp }
  
           type RootProps = React_2.HTMLAttributes<HTMLDivElement> & Record<`data-${string}`, string>;
  
           type RootProps_2 = DataGridProcessedProps;
  
           interface RowCountProps {
               rowCount: number;
               visibleRowCount: number;
           }
  
           export interface RowPropsOverrides {}
  
           interface RowSelectionManager {
               data: Set<GridRowId>;
               has(id: GridRowId): boolean;
               select(id: GridRowId): void;
               unselect(id: GridRowId): void;
           }
  
           interface SelectedRowCountProps {
               selectedRowCount: number;
           }
  
           type SelectOptionProps = CommonProps & {
               native: boolean;
               value: any;
               children?: React.ReactNode;
           };
  
           type SelectProps = CommonProps & {
               ref?: Ref;
               id?: string;
               value?: any;
               open?: boolean;
               error?: boolean;
               disabled?: boolean;
               onChange?: React.ChangeEventHandler;
               onOpen?: (event: React.SyntheticEvent) => void;
               onClose?: (event: React.KeyboardEvent, reason: 'backdropClick' | 'escapeKeyDown' | 'tabKeyDown') => void;
               label?: React.ReactNode;
               labelId?: string;
               native?: boolean;
               fullWidth?: boolean;
               size?: 'small' | 'medium';
               slotProps?: {
                   htmlInput?: {
                       ref?: Ref;
                   } & React.InputHTMLAttributes<HTMLInputElement>;
               };
               children?: React.ReactNode;
           };
  
           export interface SkeletonCellPropsOverrides {}
  
           type SkeletonProps = CommonProps & {
               variant?: 'circular' | 'text';
               width?: number | string;
               height?: number | string;
           };
  
           type SwitchProps = CommonProps & {
               checked?: boolean;
               onChange?: React.ChangeEventHandler;
               size?: 'small' | 'medium';
               label?: React.ReactNode;
               disabled?: boolean;
               title?: string;
           };
  
           type TabsProps = Omit<CommonProps, 'onChange'> & {
               items: {
                   value: string;
                   label: string;
                   children: React.ReactNode;
               }[];
               value: string;
               onChange: (event: React.SyntheticEvent, value: string) => void;
           };
  
           type TextFieldProps = CommonProps & {
               role?: string;
               autoComplete?: string;
               color?: 'primary' | 'error';
               disabled?: boolean;
               error?: boolean;
               fullWidth?: boolean;
               helperText?: string | null;
               id?: string;
               inputRef?: React.Ref<HTMLInputElement>;
               label?: React.ReactNode;
               onChange?: React.ChangeEventHandler;
               placeholder?: string;
               size?: 'small' | 'medium';
               slotProps?: {
                   input?: Omit<Partial<InputProps>, 'slotProps'>;
                   inputLabel?: {};
                   htmlInput?: React.InputHTMLAttributes<HTMLInputElement>;
               };
               tabIndex?: number;
               type?: React.HTMLInputTypeAttribute;
               value?: string;
               ref?: Ref<HTMLInputElement>;
               multiline?: boolean;
               autoFocus?: boolean;
           };
  
           type ToggleButtonProps = CommonProps & {
               selected?: boolean;
               value: string;
           };
  
           /**
            * The top level Toolbar component that provides context to child components.
            * It renders a styled `<div />` element.
            *
            * Demos:
            *
            * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
            *
            * API:
            *
            * - [Toolbar API](https://mui.com/x/api/data-grid/toolbar/)
            */
           export const Toolbar: React_2.ForwardRefExoticComponent<ToolbarProps> | React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<React_2.ComponentProps<typeof ToolbarRoot>>;
           } & React_2.RefAttributes<HTMLDivElement>>;
  
           /**
            * A button for performing actions from the toolbar.
            * It renders the `baseIconButton` slot.
            *
            * Demos:
            *
            * - [Toolbar](https://mui.com/x/react-data-grid/components/toolbar/)
            *
            * API:
            *
            * - [ToolbarButton API](https://mui.com/x/api/data-grid/toolbar-button/)
            */
           export const ToolbarButton: React_2.ForwardRefExoticComponent<ToolbarButtonProps> | React_2.ForwardRefExoticComponent<Omit<ToolbarButtonProps, "ref"> & React_2.RefAttributes<HTMLButtonElement>>;
  
           export type ToolbarButtonProps = GridSlotProps['baseIconButton'] & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<GridSlotProps['baseIconButton']>;
           };
  
           export type ToolbarProps = React_2.HTMLAttributes<HTMLDivElement> & {
               /**
                * A function to customize rendering of the component.
                */
               render?: RenderProp<React_2.ComponentProps<typeof ToolbarRoot>>;
           };
  
           export interface ToolbarPropsOverrides {}
  
           const ToolbarRoot: StyledComponent<MUIStyledCommonProps<Theme_2>, Pick<React_2.DetailedHTMLProps<React_2.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React_2.ClassAttributes<HTMLDivElement> | keyof React_2.HTMLAttributes<HTMLDivElement>>, {}>;
  
           type TooltipProps = CommonProps & {
               children: React.ReactElement<any, any>;
               enterDelay?: number;
               title: React.ReactNode;
               disableInteractive?: boolean;
           };
  
           export function unstable_resetCleanupTracking(): void;
  
           export function useGridApiContext<Api extends GridApiCommon = GridApiCommunity>(): RefObject<Api>;
  
           export function useGridApiMethod<PrivateApi extends GridPrivateApiCommon, PublicApi extends GetPublicApiType<PrivateApi>, PrivateOnlyApi extends Omit<PrivateApi, keyof PublicApi>, V extends 'public' | 'private', T extends (V extends 'public' ? Partial<PublicApi> : Partial<PrivateOnlyApi>)>(privateApiRef: RefObject<PrivateApi>, apiMethods: T, visibility: V): void;
  
           /**
            * Hook that instantiate a [[GridApiRef]].
            */
           export const useGridApiRef: <Api extends GridApiCommon = GridApiCommunity>() => RefObject<Api | null>;
  
           interface UseGridColumnHeadersProps {
               visibleColumns: GridStateColDef[];
               sortColumnLookup: GridSortColumnLookup;
               filterColumnLookup: GridFilterActiveItemsLookup;
               columnHeaderTabIndexState: GridColumnIdentifier | null;
               columnGroupHeaderTabIndexState: GridColumnGroupIdentifier | null;
               columnHeaderFocus: GridColumnIdentifier | null;
               columnGroupHeaderFocus: GridColumnGroupIdentifier | null;
               headerGroupingMaxDepth: number;
               columnMenuState: GridColumnMenuState;
               columnVisibility: GridColumnVisibilityModel;
               columnGroupsHeaderStructure: GridGroupingStructure[][];
               hasOtherElementInTabSequence: boolean;
           }
  
           export function useGridEvent<Api extends GridApiCommon, E extends GridEvents>(apiRef: RefObject<Api>, eventName: E, handler?: GridEventListener<E>, options?: EventListenerOptions_2): void;
  
           export function useGridEventPriority<Api extends GridApiCommon, E extends GridEvents>(apiRef: RefObject<Api>, eventName: E, handler?: GridEventListener<E>): void;
  
           export function useGridLogger<PrivateApi extends GridPrivateApiCommon>(privateApiRef: RefObject<PrivateApi>, name: string): Logger;
  
           export const useGridNativeEventListener: <PrivateApi extends GridPrivateApiCommon, K extends keyof HTMLElementEventMap>(apiRef: RefObject<PrivateApi>, ref: () => HTMLElement | undefined | null, eventName: K, handler: (event: HTMLElementEventMap[K]) => any, options?: AddEventListenerOptions) => void;
  
           export const useGridRootProps: () => DataGridProcessedProps;
  
           export function useGridSelector<Api extends GridApiCommon, T>(apiRef: RefObject<Api>, selector: (apiRef: RefObject<Api>) => T, args?: undefined, equals?: <U = T>(a: U, b: U) => boolean): T;
  
           export function useGridSelector<Api extends GridApiCommon, T, Args>(apiRef: RefObject<Api>, selector: (apiRef: RefObject<Api>, a1: Args) => T, args: Args, equals?: <U = T>(a: U, b: U) => boolean): T;
  
           export function useGridVirtualization(apiRef: RefObject<GridPrivateApiCommunity>, rootProps: RootProps_2): void;
  
           export { useOnMount }
  
           export function useRunOncePerLoop<T extends (...args: any[]) => void>(callback: T, nextFrame?: boolean): (...args: Parameters<T>) => void;
  
           export type ValueOptions = string | number | {
               value: any;
               label: string;
           } | Record<string, any>;
  
           type VariationPlacement = 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end';
  
           export const virtualizationStateInitializer: GridStateInitializer<RootProps_2>;
  
  
           export * from "@mui/x-internals/useFirstRender";
           export * from "@mui/x-internals/useRunOnce";
  
           export { }
  
}
