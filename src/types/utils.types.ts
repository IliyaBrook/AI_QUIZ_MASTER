export type TKebabCase<S extends string> = S extends `${infer T} ${infer U}`
  ? `${Lowercase<T>}-${TKebabCase<U>}`
  : Lowercase<S>;
