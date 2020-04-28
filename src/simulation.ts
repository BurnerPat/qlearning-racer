import Agent from "./agent";

import Brain from "./algorithm/brain";
import ControlBrain from "./algorithm/controlbrain";
import NnBrain from "./algorithm/nnbrain";
import QLearning from "./algorithm/qlearning";
import Application from "./application";
import Config from "./config";
import ExMath from "./ex-math";
import World from "./world";

export interface SimulationConfig {
    tickRate: number;

    useControlBrain: boolean;
}

export default class Simulation {
    public world: World;

    public agent: Agent;

    public brain: Brain;

    private learning: QLearning;

    public constructor(private readonly config: Config) {
        // Empty
    }

    public initialize(application: Application): void {
        if (this.config.simulation.useControlBrain) {
            this.brain = new ControlBrain(application.keyboard);
        }
        else {
            this.brain = new NnBrain();
        }

        this.learning = new QLearning(this.config.qlearning);

        this.agent = new Agent(this.config.agent);
        this.world = new World(this.config.world, this.agent);

        this.world.reset();

        // We need to make an initial observation of the world for QLearning to work
        this.agent.observe(this.world);
    }

    public reset(): void {
        this.world.reset();
    }

    public async step(): Promise<void> {
        const state = this.agent.state;
        this.learning.decide(this.brain, state);

        this.agent.apply(this.brain);
        this.world.update();

        this.agent.observe(this.world);

        this.learning.observe(state, ExMath.argmax(this.brain.output), this.world.progress, this.agent.state, this.world.terminal);
        await this.learning.train(this.brain);

        if (this.world.terminal) {
            this.reset();
        }
    }
}
