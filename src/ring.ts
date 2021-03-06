export default class Ring<T> implements Iterable<T> {
    private readonly array: T[];

    public constructor(array: T[]) {
        this.array = array;
    }

    public get length(): number {
        return this.array.length;
    }

    public get(index: number): T {
        return this.array[this.translate(index)];
    }

    public translate(index: number): number {
        return ((index % this.length) + this.length) % this.length;
    }

    [Symbol.iterator](): Iterator<T> {
        return this.array[Symbol.iterator]();
    }

    public unwrap(): T[] {
        return this.array;
    }
}