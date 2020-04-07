import Agent from "./agent";
import Vector from "./vector";

export default class World {
    public agent: Agent;

    public readonly size: Vector;

    public constructor(size: Vector) {
        this.size = size;
    }

    public update(): void {
        this.agent.update(this);

        // Prevent agent from leaving the world
        this.agent.position = this.agent.position.max(Vector.NULL).min(this.size);
    }
}