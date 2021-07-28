type ObjectKeys<T> = 
  T extends object ? (keyof T)[] :
  T extends number ? [] :
  T extends Array<any> | string ? string[] :
  never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>
}

interface Window {
  __INITIAL_DATA__: object;
  __PRELOADED_STATE__: object;
}

declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}

declare module "*.png" {
  const value: any;
  export default value;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

