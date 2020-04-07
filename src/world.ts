import Agent from "./agent";
import Vector from "./vector";

import * as track from "./assets/track.svg";

export default class World {
    public agent: Agent;

    public readonly size: Vector;

    public constructor(size: Vector) {
        this.size = size;
        track.default;
    }

    public update(): void {
        this.agent.update(this);

        // Prevent agent from leaving the world
        this.agent.position = this.agent.position.max(Vector.NULL).min(this.size);
    }
}