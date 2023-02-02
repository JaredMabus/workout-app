/// <reference types="react-scripts" />

declare global {
  type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
}

export {};
