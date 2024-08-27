export const getOwnPropertyNames = Object.getOwnPropertyNames;

export function safeGetPropertyValue<T>(
  object: T,
  propertyName: keyof T
): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(object, propertyName);
  if (descriptor?.get) {
    try {
      return descriptor.get();
    } catch {
      return descriptor.get;
    }
  }
  return object[propertyName];
}
