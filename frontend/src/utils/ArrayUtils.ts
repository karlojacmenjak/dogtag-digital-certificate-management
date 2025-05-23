export class ArrayUtils {
  static removeIndex<T>(array: T[], index: number): T[] {
    return [...array.slice(0, index), ...array.slice(index + 1)];
  }
}
