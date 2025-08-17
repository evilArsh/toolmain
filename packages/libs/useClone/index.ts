import rfdc from "rfdc"

export function useClone(options?: rfdc.Options) {
  const clone = rfdc(options)
  function cloneDeep<T extends object>(obj: T): T {
    return clone(obj)
  }
  return { cloneDeep }
}
