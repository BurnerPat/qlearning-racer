import Vector from "./vector";

export default class ExMath {
    static inTriangle(x: Vector, a: Vector, b: Vector, c: Vector): boolean {
        // Uses bayrcentric coordinates
        const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);

        const alpha = ((b.y - c.y) * (x.x - c.x) + (c.x - b.x) * (x.y - c.y)) / d;
        const beta = ((c.y - a.y) * (x.x - c.x) + (a.x - c.x) * (x.y - c.y)) / d;
        const gamma = 1 - alpha - beta;

        return (0 <= alpha) && (alpha <= 1) && (0 <= beta) && (beta <= 1) && (0 <= gamma) && (gamma <= 1);
    }

    static inQuad(x: Vector, a: Vector, b: Vector, c: Vector, d: Vector): boolean {
        return ExMath.inTriangle(x, a, b, c) || ExMath.inTriangle(x, a, c, d);
    }

    static lineIntersection(a: Vector, b: Vector, c: Vector, d: Vector): number | boolean {
        const r = b.subtract(a);
        const s = d.subtract(c);

        const x = r.cross(s);
        const y = b.subtract(a);

        const t = y.cross(s) / x;
        const u = y.cross(r) / x;

        if (x != 0 && 0 <= t && t <= 1 && 0 <= u && u <= 1) {
            return t;
        }
        else {
            return false;
        }
    }
};