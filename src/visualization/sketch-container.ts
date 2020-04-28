import * as P5 from "p5";
import Vector from "../vector";
import Keyboard from "./keyboard";
import {Container} from "./ui";
import Visualizer from "./visualizer";

export class Sketch {
    public constructor(public readonly p5: P5) {
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

export default abstract class SketchContainer implements Visualizer {
    private _p5: P5;

    protected constructor(width: number, height: number, private readonly scale: boolean, private readonly container: Container) {
        this._height = height;
        this._width = width;
    }

    private _width: number;

    public get width(): number {
        return this._width;
    }

    private _height: number;

    public get height(): number {
        return this._height;
    }

    private _keyboard: Keyboard;

    public get keyboard(): Keyboard {
        return this._keyboard;
    }

    public setup() {
        const callback = (p5: P5) => {
            const sketch = new Sketch(p5);

            p5.setup = () => {
                p5.createCanvas(this.container.width, this.container.height);
            };

            p5.draw = () => {
                if (this.scale) {
                    const scaleWidth = this.container.width / this._width;
                    const scaleHeight = this.container.height / this._height;

                    sketch.p5.scale(scaleWidth, scaleHeight);
                }
                else {
                    this._width = this.container.width;
                    this._height = this.container.height;
                }

                this.render(sketch);
            };
        };

        this._p5 = new P5(callback, this.container.element);

        this.container.resize = (width: number, height: number): void => {
            this._p5.resizeCanvas(width, height);
        };

        this._keyboard = new Keyboard(this._p5);
    }

    public update(): void {
        this._p5.redraw();
    }

    protected abstract render(sketch: Sketch): void;
}