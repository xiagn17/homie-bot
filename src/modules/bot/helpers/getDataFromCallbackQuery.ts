// prefix must be unique
export function getDataFromCallbackQuery<T = string>(prefix: string, data?: string): T | null {
  if (!data) {
    return null;
  }
  const regexpPrefix = new RegExp('^' + prefix);
  if (!regexpPrefix.test(data)) {
    return null;
  }

  return data.split(prefix)[1] as unknown as T;
}
