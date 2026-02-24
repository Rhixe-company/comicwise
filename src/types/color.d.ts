// Narrowed types for `color` used by the project
declare module "color" {
  export interface RGBObject {
    alpha?: number;
    b: number;
    g: number;
    r: number;
  }

  export interface Color {
    array(): number[];
    hex(): string;
    object(): RGBObject;
    rgb(): { array(): number[]; object(): RGBObject };
    toString(): string;
  }

  function Color(input?: any): Color;
  namespace Color {}
  export default Color;
}
