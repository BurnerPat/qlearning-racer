import Agent from "./agent";

import trackData from "./assets/track.svg";
import ExMath from "./ex-math";
import Ring from "./ring";
import Vector from "./vector";

export interface WorldConfig {
    width: number;
    height: number;
    trackWeight: number;
}

export class Segment {
    public edge1: Vector;
    public edge2: Vector;

    constructor(public readonly index: number, public readonly point: Vector) {
        // Empty
    }
}

export default class World {
    public readonly size: Vector;
    public progress: number = 0;
    public terminal: boolean = false;
    public track: Ring<Segment>;
    public segment: Segment;
    private maxSegmentCounter: number = 0;
    private segmentCounter: number = 0;

    public constructor(private readonly config: WorldConfig, private readonly agent: Agent) {
        this.size = new Vector(config.width, config.height);

        this.loadTrack();
    }

    public reset(): void {
        this.agent.reset();

        this.segment = this.track.get(0);

        const v1 = this.segment.point;
        const v2 = this.track.get(1).point;

        const d = v2.subtract(v1).divide(2);

        this.agent.position = v1.add(d);
        this.agent.angle = d.angle;

        this.progress = 0;
        this.terminal = false;
    }

    public update(): void {
        if (this.terminal) {
            return;
        }

        this.agent.update();

        this.checkAgentCollision();

        // Prevent agent from leaving the world
        this.agent.position = this.agent.position.max(Vector.NULL).min(this.size);
    }

    public getSegments(distance: number): Segment[] {
        return this.getSegmentsInternal(distance, -1).reverse().concat([this.segment], this.getSegmentsInternal(distance, 1));
    }

    private loadTrack(): void {
        let points: Vector[] = [];

        const parser = new DOMParser();
        const svg = parser.parseFromString(trackData, "image/svg+xml");

        const path = svg.getElementsByTagName("path")[0];
        const data = path.getAttribute("d");

        const parts = data.split(/L/g);
        parts[0] = parts[0].replace(/^M/, "");
        parts[parts.length - 1] = parts[parts.length - 1].replace(/Z$/, "");

        for (let i = 0; i < parts.length - 1; i++) {
            let part = parts[i];

            const [x, y] = part.split(",").map(Number);

            if (isNaN(x) || isNaN(y)) {
                throw new Error(`Parser error: "${part}"`);
            }

            points.push(new Vector(x, y));
        }

        points = this.normalizePoints(points);

        this.track = new Ring(points.map((v, i) => new Segment(i, v)));

        this.calculateEdges();
    }

    private normalizePoints(points: Vector[]): Vector[] {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;

        for (const point of points) {
            minX = Math.min(point.x, minX);
            minY = Math.min(point.y, minY);
            maxX = Math.max(point.x, maxX);
            maxY = Math.max(point.y, maxY);
        }

        const min = new Vector(minX, minY);
        const max = new Vector(maxX, maxY);

        const border = new Vector(100, 100);
        const limit = this.size.subtract(border.multiply(2));

        const factorX = limit.x / (max.x - min.x);
        const factorY = limit.y / (max.y - min.y);

        return points.map(v => {
            const d = v.subtract(min);
            return new Vector(d.x * factorX, d.y * factorY).add(border);
        });
    }

    private calculateEdges(): void {
        const w = this.config.trackWeight / 2;

        for (let i = 0; i < this.track.length; i++) {
            const s1 = this.track.get(i - 1);
            const s2 = this.track.get(i);
            const s3 = this.track.get(i + 1);

            const d = s3.point.subtract(s1.point);
            const p = new Vector(d.y, -d.x).resize(w);

            s2.edge1 = s2.point.add(p);
            s2.edge2 = s2.point.subtract(p);
        }
    }

    private checkAgentCollision(): void {
        if (!this.checkAgentInSegment(this.segment)) {
            const next = this.track.get(this.segment.index + 1);

            if (!this.checkAgentInSegment(next)) {
                const previous = this.track.get(this.segment.index - 1);

                if (!this.checkAgentInSegment(previous)) {
                    this.terminal = true;
                }
                else {
                    this.segment = previous;
                    this.progress = -1;
                }
            }
            else {
                this.segment = next;
                this.progress = 1;
            }
        }
    }

    private checkAgentInSegment(s: Segment): boolean {
        const n = this.track.get(s.index + 1);
        return ExMath.inQuad(this.agent.position, s.edge1, n.edge1, n.edge2, s.edge2);
    }

    private getSegmentsInternal(distance: number, direction: number): Segment[] {
        const segments = [];

        const max = distance * distance;

        let i = this.segment.index;
        let last = this.segment;
        let total = 0;

        let first = true;

        do {
            i += direction;

            const segment = this.track.get(i);
            segments.push(segment);

            if (!first) {
                total += segment.point.subtract(last.point).lengthSquared;
            }
            else {
                first = false;
            }

            last = segment;
        } while (total <= max);

        return segments;
    }
}