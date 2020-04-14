export default class ExArray {
    public static pickRandom<T>(array: T[], n: number): T[] {
        const result = new Array<T>(n);
        let length = array.length;
        const taken = new Array(array.length);

        while (n--) {
            const i = Math.floor(Math.random() * length);
            result[n] = array[i in taken ? taken[i] : i];
            taken[i] = --length in taken ? taken[length] : length;
        }

        return result;
    }
}