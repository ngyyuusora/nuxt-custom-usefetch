declare type Recordable<T = any> = Record<string, T>;

declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
