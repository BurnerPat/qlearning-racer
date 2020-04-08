import World from "./world";
import Agent from "./agent";

import Evolution from "./algorithm/evolution";
import Brain from "./algorithm/brain";

export default class Simulation {
    public readonly world: World;
    public readonly evolution: Evolution;

    public constructor(world: World, evolution: Evolution) {
        this.world = world;
        this.evolution = evolution;
    }

    public populate(brain: Brain): void {
        this.world.agent = new Agent(this.world.size.multiply(0.5), brain);

        brain.agent = this.world.agent;
        brain.world = this.world;

        this.world.reset();
    }

    public step(): void {
        this.world.update();
    }
}