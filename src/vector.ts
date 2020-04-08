export default class Vector {
    public static readonly NULL: Vector = new Vector(0, 0);

    public readonly x: number;
    public readonly y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public add(other: Vector): Vector {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Vector): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    public multiply(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    public divide(divisor: number): Vector {
        return new Vector(this.x / divisor, this.y / divisor);
    }

    public dot(other: Vector): number {
        return this.x * other.x + this.y * other.y;
    }

    public cross(other: Vector): number {
        return this.x * other.y - this.y * other.x;
    }

    public distanceSquared(other: Vector): number {
        return this.subtract(other).lengthSquared;
    }

    public distance(other: Vector): number {
        return Math.sqrt(this.distanceSquared(other));
    }

    public get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public get lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    public get length(): number {
        return Math.sqrt(this.lengthSquared);
    }

    public resize(length: number): Vector {
        return this.divide(this.length).multiply(length);
    }

    public limit(max: number): Vector {
        return this.resize(Math.min(this.length, max));
    }

    public min(range: Vector): Vector {
        return new Vector(Math.min(this.x, range.x), Math.min(this.y, range.y));
    }

    public max(range: Vector): Vector {
        return new Vector(Math.max(this.x, range.x), Math.max(this.y, range.y));
    }

    public rotate(angle: number): Vector {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        return new Vector(cos * this.x - sin * this.y, sin * this.x + cos * this.y);
    }

    public rotateTo(angle: number): Vector {
        return Vector.createFromRadial(angle, this.length);
    }

    public static createFromRadial(angle: number, length: number): Vector {
        return new Vector(Math.cos(angle) * length, Math.sin(angle) * length);
    }

    public static random(range: Vector): Vector {
        return new Vector(Math.random() * range.x, Math.random() * range.y);
    }
}
