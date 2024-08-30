export const getOwnPropertyNames = Object.getOwnPropertyNames;
export const hasOwn = Object.hasOwn;

export function safeGetPropertyValue<T>(
  object: T,
  propertyName: keyof T
): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
  if (descriptor?.get) {
    try {
      return descriptor.get();
    } catch {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      return descriptor.get;
    }
  }
  return object[propertyName];
}
