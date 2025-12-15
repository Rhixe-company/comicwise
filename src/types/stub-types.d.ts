// ═══════════════════════════════════════════════════
// STUB TYPE DEFINITIONS FOR PACKAGES (Next.js 16 Optimized)
// ═══════════════════════════════════════════════════

// ESLint Plugins
declare module "eslint-plugin-drizzle" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin;
  export = plugin;
}

declare module "eslint-plugin-security" {
  import type { ESLint } from "eslint";

  const plugin: ESLint.Plugin;
  export default plugin;
}

// React Email Components
declare module "@react-email/components" {
  import type { ComponentType, ReactNode } from "react";

  export interface EmailProps {
    children?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
  }

  export const Html: ComponentType<EmailProps>;
  export const Head: ComponentType<EmailProps>;
  export const Body: ComponentType<EmailProps>;
  export const Container: ComponentType<EmailProps>;
  export const Section: ComponentType<EmailProps>;
  export const Row: ComponentType<EmailProps>;
  export const Column: ComponentType<EmailProps>;
  export const Text: ComponentType<EmailProps>;
  export const Button: ComponentType<EmailProps & { href?: string }>;
  export const Link: ComponentType<EmailProps & { href: string }>;
  export const Hr: ComponentType<EmailProps>;
  export const Img: ComponentType<
    EmailProps & { src: string; alt?: string; width?: number | string; height?: number | string }
  >;
  export const Preview: ComponentType<{ children: string }>;
  export const Heading: ComponentType<EmailProps & { as?: any }>;
  // helper render function commonly exported by @react-email/components
  export function render(element: any): string;
}

// React Fast Marquee
declare module "react-fast-marquee" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  export interface MarqueeProps {
    children: ReactNode;
    style?: CSSProperties;
    className?: string;
    autoFill?: boolean;
    play?: boolean;
    pauseOnHover?: boolean;
    pauseOnClick?: boolean;
    direction?: "left" | "right" | "up" | "down";
    speed?: number;
    delay?: number;
    loop?: number;
    gradient?: boolean;
    gradientColor?: string | [number, number, number];
    gradientWidth?: number | string;
    onFinish?(): void;
    onCycleComplete?(): void;
    onMount?(): void;
    children?: ReactNode;
  }

  const Marquee: ComponentType<MarqueeProps>;
  export default Marquee;
}

// React Medium Image Zoom
declare module "react-medium-image-zoom" {
  import type { ComponentType, ReactNode } from "react";

  // Fallback for HTMLElementTagNameMap if not present (for non-DOM environments)
  // Remove this if your tsconfig includes "dom" in the "lib" array.

  type HTMLElementTagNameMap = typeof globalThis extends { HTMLElementTagNameMap: infer T }
    ? T
    : Record<string, any>;

  export interface ZoomProps {
    children?: ReactNode;
    zoomMargin?: number;
    overlayBgColorStart?: string;
    overlayBgColorEnd?: string;
    portalEl?: HTMLElement;
    transitionDuration?: number;
    closeText?: string;
    openText?: string;
    wrapElement?: keyof (HTMLElementTagNameMap extends undefined
      ? Record<string, any>
      : HTMLElementTagNameMap);
    wrapStyle?: React.CSSProperties;
    zoomZindex?: number;
    defaultStyles?: {
      overlay?: React.CSSProperties;
      image?: React.CSSProperties;
    };
    classDialog?: string;
    onZoomChange?(isZoomed: boolean): void;
  }

  export const Controlled: ComponentType<
    ZoomProps & {
      isZoomed: boolean;
      onZoomChange(isZoomed: boolean): void;
    }
  >;

  const Zoom: ComponentType<ZoomProps>;
  export default Zoom;
}

// Vaul Drawer
declare module "vaul" {
  import type { ComponentType, ReactNode } from "react";

  export interface DrawerProps {
    children?: ReactNode;
    open?: boolean;
    onOpenChange?(open: boolean): void;
    shouldScaleBackground?: boolean;
    activeSnapPoint?: number | string | null;
    setActiveSnapPoint?(snapPoint: number | string | null): void;
    snapPoints?: (number | string)[];
    fadeFromIndex?: number;
    modal?: boolean;
    handleOnly?: boolean;
    dismissible?: boolean;
    direction?: "top" | "bottom" | "left" | "right";
    nested?: boolean;
    onDrag?(event: PointerEvent, percentageDragged: number): void;
    onRelease?(event: PointerEvent, open: boolean): void;
    repositionInputs?: boolean;
    noBodyStyles?: boolean;
  }

  export const Drawer: ComponentType<DrawerProps> & {
    Root: ComponentType<DrawerProps>;
    Trigger: ComponentType<{ children?: ReactNode; asChild?: boolean }>;
    Portal: ComponentType<{ children?: ReactNode }>;
    Overlay: ComponentType<{ className?: string; style?: React.CSSProperties }>;
    Content: ComponentType<{
      className?: string;
      style?: React.CSSProperties;
      children?: ReactNode;
    }>;
    Title: ComponentType<{ className?: string; children?: ReactNode }>;
    Description: ComponentType<{ className?: string; children?: ReactNode }>;
    Close: ComponentType<{ className?: string; children?: ReactNode; asChild?: boolean }>;
    Handle: ComponentType<{ className?: string }>;
    NestedRoot: ComponentType<DrawerProps>;
  };

  export const Root: ComponentType<DrawerProps>;
  export const Trigger: ComponentType<{ children?: ReactNode; asChild?: boolean }>;
  export const Portal: ComponentType<{ children?: ReactNode }>;
  export const Overlay: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  export const Content: ComponentType<{
    className?: string;
    style?: React.CSSProperties;
    children?: ReactNode;
  }>;
  export const Title: ComponentType<{ className?: string; children?: ReactNode }>;
  export const Description: ComponentType<{ className?: string; children?: ReactNode }>;
  export const Close: ComponentType<{
    className?: string;
    children?: ReactNode;
    asChild?: boolean;
  }>;
  export const Handle: ComponentType<{ className?: string }>;
  export const NestedRoot: ComponentType<DrawerProps>;
}

// CMDK (Command Menu)
declare module "cmdk" {
  import type { ComponentType, HTMLAttributes, ReactNode } from "react";

  export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    label?: string;
    shouldFilter?: boolean;
    filter?(value: string, search: string, keywords?: string[]): number;
    value?: string;
    onValueChange?(value: string): void;
    loop?: boolean;
    disablePointerSelection?: boolean;
    vimBindings?: boolean;
  }

  export interface CommandItemProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    disabled?: boolean;
    onSelect?(value: string): void;
    value?: string;
    keywords?: string[];
    forceMount?: boolean;
  }

  export const Command: ComponentType<CommandProps> & {
    Input: ComponentType<HTMLAttributes<HTMLInputElement>>;
    List: ComponentType<HTMLAttributes<HTMLDivElement>>;
    Empty: ComponentType<HTMLAttributes<HTMLDivElement>>;
    Group: ComponentType<HTMLAttributes<HTMLDivElement> & { heading?: ReactNode }>;
    Item: ComponentType<CommandItemProps>;
    Separator: ComponentType<HTMLAttributes<HTMLDivElement>>;
    Dialog: ComponentType<any>;
    Loading: ComponentType<HTMLAttributes<HTMLDivElement>>;
  };
}

// Embla Carousel React
declare module "embla-carousel-react" {
  import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from "embla-carousel";

  export type UseEmblaCarouselType = [
    (emblaRoot: HTMLElement | null) => void,
    EmblaCarouselType | undefined,
  ];

  export default function useEmblaCarousel(
    options?: EmblaOptionsType,
    plugins?: EmblaPluginType[]
  ): UseEmblaCarouselType;
}

declare module "embla-carousel" {
  export interface EmblaOptionsType {
    align?: "start" | "center" | "end" | number;
    axis?: "x" | "y";
    container?: string | HTMLElement | null;
    slides?: string | HTMLElement[] | NodeList | null;
    containScroll?: "trimSnaps" | "keepSnaps" | false;
    direction?: "ltr" | "rtl";
    slidesToScroll?: "auto" | number;
    dragFree?: boolean;
    draggable?: boolean;
    draggableClass?: string;
    dragThreshold?: number;
    inViewThreshold?: number | number[];
    loop?: boolean;
    skipSnaps?: boolean;
    duration?: number;
    startIndex?: number;
    active?: boolean;
    breakpoints?: {
      [key: string]: Omit<EmblaOptionsType, "breakpoints">;
    };
    watchDrag?(emblaApi: EmblaCarouselType, evt: MouseEvent | TouchEvent): boolean | void;
    watchResize?(emblaApi: EmblaCarouselType, entries: ResizeObserverEntry[]): boolean | void;
    watchSlides?(emblaApi: EmblaCarouselType, mutations: MutationRecord[]): boolean | void;
  }

  export interface EmblaCarouselType {
    canScrollNext(): boolean;
    canScrollPrev(): boolean;
    clickAllowed(): boolean;
    containerNode(): HTMLElement;
    dangerouslyGetEngine(): any;
    destroy(): void;
    internalEngine(): any;
    off(event: string, callback: (event: any) => void): void;
    on(event: string, callback: (event: any) => void): void;
    plugins(): EmblaPluginType[];
    previousScrollSnap(): number;
    reInit(options?: EmblaOptionsType, plugins?: EmblaPluginType[]): void;
    rootNode(): HTMLElement;
    scrollNext(jump?: boolean): void;
    scrollPrev(jump?: boolean): void;
    scrollProgress(): number;
    scrollSnapList(): number[];
    scrollTo(index: number, jump?: boolean): void;
    selectedScrollSnap(): number;
    slideNodes(): HTMLElement[];
    slidesInView(): number[];
    slidesNotInView(): number[];
  }

  export interface EmblaPluginType {
    name: string;
    options: Partial<any>;
    init(embla: EmblaCarouselType, OptionsHandler: any): void;
    destroy(): void;
  }
}

// Input OTP
declare module "input-otp" {
  import type { ComponentType, InputHTMLAttributes } from "react";

  export interface OTPInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value?: string;
    onChange?(value: string): void;
    maxLength?: number;
    pattern?: string;
    inputMode?: "numeric" | "text";
    render?(props: { slots: any[] }): React.ReactNode;
    containerClassName?: string;
    textAlign?: "left" | "center" | "right";
    pushPasswordManagerStrategy?: "increase-width" | "none";
    noScriptCSSFallback?: string | null;
  }

  export const OTPInput: ComponentType<OTPInputProps>;
  export interface OTPInputContextType {
    slots?: any[];
  }
  // export a React Context to match usage with React.useContext
  import type React from "react";

  export const OTPInputContext: React.Context<OTPInputContextType | undefined>;
}

// React Resizable Panels
declare module "react-resizable-panels" {
  import type { ComponentType, HTMLAttributes, ReactNode } from "react";

  // Fallback for HTMLElementTagNameMap if not present (for non-DOM environments)
  // Remove this if your tsconfig includes "dom" in the "lib" array.
  type HTMLElementTagNameMap = typeof globalThis extends { HTMLElementTagNameMap: infer T }
    ? T
    : Record<string, any>;

  export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    collapsedSize?: number;
    collapsible?: boolean;
    defaultSize?: number;
    id?: string;
    maxSize?: number;
    minSize?: number;
    onCollapse?(collapsed: boolean): void;
    onResize?(size: number, prevSize: number | undefined): void;
    order?: number;
    tagName?: keyof HTMLElementTagNameMap;
  }

  export interface PanelGroupProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    autoSaveId?: string;
    direction: "horizontal" | "vertical";
    id?: string;
    onLayout?(sizes: number[]): void;
    storage?: {
      getItem(name: string): string | null;
      setItem(name: string, value: string): void;
    };
    tagName?: keyof HTMLElementTagNameMap;
  }

  export interface PanelResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
    className?: string;
    disabled?: boolean;
    id?: string;
    onDragging?(isDragging: boolean): void;
    tagName?: keyof HTMLElementTagNameMap;
    hitAreaMargins?: { coarse: number; fine: number };
  }

  export const Panel: ComponentType<PanelProps>;
  export const PanelGroup: ComponentType<PanelGroupProps>;
  export const PanelResizeHandle: ComponentType<PanelResizeHandleProps>;

  export function getPanelElement(id: string, groupId?: string): HTMLElement | null;
  export function getPanelGroupElement(id: string): HTMLElement | null;
  export function getResizeHandleElement(id: string, groupId?: string): HTMLElement | null;
}

// Media Chrome
declare module "media-chrome" {
  export class MediaController extends HTMLElement {}
  export class MediaPlayButton extends HTMLElement {}
  export class MediaMuteButton extends HTMLElement {}
  export class MediaTimeRange extends HTMLElement {}
  export class MediaVolumeRange extends HTMLElement {}
  export class MediaTimeDisplay extends HTMLElement {}
  export class MediaDurationDisplay extends HTMLElement {}
  export class MediaFullscreenButton extends HTMLElement {}
  export class MediaPipButton extends HTMLElement {}
  export class MediaSeekBackwardButton extends HTMLElement {}
  export class MediaSeekForwardButton extends HTMLElement {}
  export class MediaPlaybackRateButton extends HTMLElement {}
  export class MediaCaptionsButton extends HTMLElement {}
  export class MediaAirplayButton extends HTMLElement {}
  export class MediaCastButton extends HTMLElement {}
  export class MediaPosterImage extends HTMLElement {}
  export class MediaLoadingIndicator extends HTMLElement {}
}

// Motion (Framer Motion)
declare module "motion/react" {
  export * from "framer-motion";
}

declare module "motion" {
  export * from "framer-motion";
}

// Recharts Types Enhancement
declare module "recharts" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";

  export interface ChartProps {
    width?: number | string;
    height?: number | string;
    data?: any[];
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    children?: ReactNode;
    className?: string;
    style?: CSSProperties;
    accessibilityLayer?: boolean;
    barSize?: number;
    maxBarSize?: number;
  }

  export const LineChart: ComponentType<ChartProps>;
  export const BarChart: ComponentType<ChartProps>;
  export const AreaChart: ComponentType<ChartProps>;
  export const PieChart: ComponentType<ChartProps>;
  export const RadarChart: ComponentType<ChartProps>;
  export const ScatterChart: ComponentType<ChartProps>;
  export const ComposedChart: ComponentType<ChartProps>;
  export const Treemap: ComponentType<ChartProps>;
  export const Sankey: ComponentType<ChartProps>;
  export const RadialBarChart: ComponentType<ChartProps>;
  export const FunnelChart: ComponentType<ChartProps>;

  export const Line: ComponentType<any>;
  export const Bar: ComponentType<any>;
  export const Area: ComponentType<any>;
  export const Pie: ComponentType<any>;
  export const Radar: ComponentType<any>;
  export const Scatter: ComponentType<any>;
  export const XAxis: ComponentType<any>;
  export const YAxis: ComponentType<any>;
  export const ZAxis: ComponentType<any>;
  export const CartesianGrid: ComponentType<any>;
  export const Tooltip: ComponentType<any>;
  export const Legend: ComponentType<any>;
  export const ResponsiveContainer: ComponentType<any>;
  export const Cell: ComponentType<any>;
  export const Label: ComponentType<any>;
  export const LabelList: ComponentType<any>;
  export const ReferenceLine: ComponentType<any>;
  export const ReferenceDot: ComponentType<any>;
  export const ReferenceArea: ComponentType<any>;
  export const Brush: ComponentType<any>;
  export const ErrorBar: ComponentType<any>;
  export const Funnel: ComponentType<any>;
  export const FunnelChart: ComponentType<any>;

  // minimal props types used in project
  export type LegendProps = any;
}

// Minimal Recharts primitive namespace shim used in the codebase
declare namespace RechartsPrimitive {
  export type LegendProps = any;
}

// React Dropzone
declare module "react-dropzone" {
  import type { DragEvent, InputHTMLAttributes } from "react";

  export type DropEvent = any;

  export interface FileRejection {
    file: File;
    errors: FileError[];
  }

  export interface FileError {
    code: string;
    message: string;
  }

  export interface DropzoneOptions {
    accept?: Record<string, string[]>;
    minSize?: number;
    maxSize?: number;
    maxFiles?: number;
    preventDropOnDocument?: boolean;
    noClick?: boolean;
    noKeyboard?: boolean;
    noDrag?: boolean;
    noDragEventsBubbling?: boolean;
    disabled?: boolean;
    onDrop?(acceptedFiles: File[], fileRejections: FileRejection[], event: DragEvent): void;
    onDropAccepted?(files: File[], event: DragEvent): void;
    onDropRejected?(fileRejections: FileRejection[], event: DragEvent): void;
    getFilesFromEvent?(event: DragEvent): Promise<File[]>;
    onFileDialogCancel?(): void;
    onFileDialogOpen?(): void;
    useFsAccessApi?: boolean;
    autoFocus?: boolean;
    onError?(err: Error): void;
    validator?(file: File): FileError | FileError[] | null;
    multiple?: boolean;
  }

  export interface DropzoneState {
    isFocused: boolean;
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isFileDialogActive: boolean;
    acceptedFiles: File[];
    fileRejections: FileRejection[];
    rootRef: React.RefObject<HTMLElement>;
    inputRef: React.RefObject<HTMLInputElement>;
    getRootProps(props?: any): any;
    getInputProps(
      props?: InputHTMLAttributes<HTMLInputElement>
    ): InputHTMLAttributes<HTMLInputElement>;
    open(): void;
  }

  export function useDropzone(options?: DropzoneOptions): DropzoneState;
}

// Glob
declare module "glob" {
  export interface GlobOptions {
    cwd?: string;
    root?: string;
    dot?: boolean;
    nomount?: boolean;
    mark?: boolean;
    nosort?: boolean;
    stat?: boolean;
    silent?: boolean;
    strict?: boolean;
    cache?: { [path: string]: boolean | "DIR" | "FILE" | ReadonlyArray<string> };
    statCache?: { [path: string]: false | { isDirectory(): boolean } | undefined };
    symlinks?: { [path: string]: boolean | undefined };
    realpathCache?: { [path: string]: string };
    sync?: boolean;
    nounique?: boolean;
    nonull?: boolean;
    debug?: boolean;
    nobrace?: boolean;
    noglobstar?: boolean;
    noext?: boolean;
    nocase?: boolean;
    matchBase?: boolean;
    nodir?: boolean;
    ignore?: string | ReadonlyArray<string>;
    follow?: boolean;
    realpath?: boolean;
    nonegate?: boolean;
    nocomment?: boolean;
    absolute?: boolean;
    fs?: any;
    maxLength?: number;
    windowsPathsNoEscape?: boolean;
    platform?: string;
  }

  export function glob(pattern: string | string[], options?: GlobOptions): Promise<string[]>;
  export function globSync(pattern: string | string[], options?: GlobOptions): string[];
  export function globStream(pattern: string | string[], options?: GlobOptions): ReadableStream;
  export function globStreamSync(pattern: string | string[], options?: GlobOptions): ReadableStream;
  export function hasMagic(pattern: string, options?: GlobOptions): boolean;
  export class Glob {
    constructor(pattern: string, options?: GlobOptions);
    found: Set<string>;
    walk(): Promise<void>;
    walkSync(): void;
  }
}

// Lodash Debounce
declare module "lodash.debounce" {
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      maxWait?: number;
      trailing?: boolean;
    }
  ): T & {
    cancel(): void;
    flush(): ReturnType<T> | undefined;
  };
  export = debounce;
}

// Color
declare module "color" {
  interface Color {
    rgb(): Color;
    hsl(): Color;
    hsv(): Color;
    hwb(): Color;
    cmyk(): Color;
    xyz(): Color;
    lab(): Color;
    lch(): Color;
    hex(): string;
    keyword(): string;
    rgbNumber(): number;
    luminosity(): number;
    contrast(color: Color): number;
    level(color: Color): string;
    isDark(): boolean;
    isLight(): boolean;
    negate(): Color;
    lighten(ratio: number): Color;
    darken(ratio: number): Color;
    saturate(ratio: number): Color;
    desaturate(ratio: number): Color;
    whiten(ratio: number): Color;
    blacken(ratio: number): Color;
    fade(ratio: number): Color;
    opaquer(ratio: number): Color;
    rotate(degrees: number): Color;
    mix(color: Color, weight?: number): Color;
    red(): number;
    green(): number;
    blue(): number;
    hue(): number;
    saturationl(): number;
    lightness(): number;
    saturationv(): number;
    value(): number;
    alpha(): number;
    alpha(value: number): Color;
    red(value: number): Color;
    green(value: number): Color;
    blue(value: number): Color;
    // convenience helpers often used in projects
    object(): { r: number; g: number; b: number; a?: number };
    array(): number[];
  }

  interface ColorConstructor {
    (obj?: string | number[] | Record<string, any> | Color): Color;
    rgb(r: number, g: number, b: number): Color;
    rgb(values: [number, number, number]): Color;
    hsl(h: number, s: number, l: number, a?: number): Color;
    hsl(values: [number, number, number]): Color;
    hsv(h: number, s: number, v: number): Color;
    hsv(values: [number, number, number]): Color;
    hwb(h: number, w: number, b: number): Color;
    hwb(values: [number, number, number]): Color;
    cmyk(c: number, m: number, y: number, k: number): Color;
    cmyk(values: [number, number, number, number]): Color;
  }

  const color: ColorConstructor;
  export = color;
}

// Dotenv
declare module "dotenv" {
  export interface DotenvParseOutput {
    [key: string]: string;
  }

  export interface DotenvParseOptions {
    debug?: boolean;
  }

  export interface DotenvConfigOptions {
    path?: string | string[];
    encoding?: string;
    debug?: boolean;
    override?: boolean;
    processEnv?: Record<string, any>;
    DOTENV_KEY?: string;
  }

  export interface DotenvConfigOutput {
    error?: Error;
    parsed?: DotenvParseOutput;
  }

  export interface DotenvPopulateInput {
    [name: string]: string;
  }

  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  export function parse(src: string | Buffer, options?: DotenvParseOptions): DotenvParseOutput;
  export function populate(
    processEnv: Record<string, any>,
    parsed: DotenvPopulateInput,
    options?: DotenvConfigOptions
  ): void;
}

// Dotenv Safe
declare module "dotenv-safe" {
  import type {
    DotenvConfigOptions,
    DotenvConfigOutput,
    DotenvParseOptions,
    DotenvParseOutput,
    DotenvPopulateInput,
  } from "dotenv";

  export interface DotenvSafeOptions extends DotenvConfigOptions {
    allowEmptyValues?: boolean;
    example?: string;
    sample?: string;
  }

  export function config(options?: DotenvSafeOptions): DotenvConfigOutput;
  export function parse(src: string | Buffer, options?: DotenvParseOptions): DotenvParseOutput;
  export function populate(
    processEnv: Record<string, any>,
    parsed: DotenvPopulateInput,
    options?: DotenvConfigOptions
  ): void;
}

// TW Animate CSS
declare module "tw-animate-css" {
  const plugin: {
    handler(): void;
    config?: any;
  };
  export default plugin;
}

// Tailwindcss Animate
declare module "tailwindcss-animate" {
  const plugin: {
    handler(): void;
    config?: any;
  };
  export default plugin;
}
