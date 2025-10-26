declare const __dirname: string;

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
  platform: string;
};

declare module 'path' {
  export function join(...paths: string[]): string;
  export function resolve(...paths: string[]): string;
  const _default: {
    join: typeof join;
    resolve: typeof resolve;
  };
  export default _default;
}

declare module 'electron-store' {
  export default class Store<T extends Record<string, unknown> = Record<string, unknown>> {
    constructor(options?: unknown);
    get<K extends keyof T>(key: K): T[K];
    get(key: string): unknown;
    set<K extends keyof T>(key: K, value: T[K]): void;
    set(key: string, value: unknown): void;
  }
}
