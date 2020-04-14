import Vector from "./vector";

import * as p5 from "p5";

export default class Sketch {
    public constructor(public readonly p5: p5) {
        // Empty constructor
    }

    public line(a: Vector, b: Vector): void {
        this.p5.line(a.x, a.y, b.x, b.y);
    }

    public rect(a: Vector, s: Vector): void {
        this.p5.rect(a.x, a.y, s.x, s.y);
    }

    public quad(a: Vector, b: Vector, c: Vector, d: Vector): void {
        this.p5.quad(a.x, a.y, b.x, b.y, c.x, c.y, d.x, d.y);
    }

    public translate(v: Vector): void {
        this.p5.translate(v.x, v.y);
    }
}