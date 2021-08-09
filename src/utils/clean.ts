export function clean(obj: any): any {
  for (const propName in obj) {
    if (typeof obj[propName] === 'string' || obj[propName]?.length === 0) {
      delete obj[propName];
    }
  }
  return obj;
}
