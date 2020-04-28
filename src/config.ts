import {AgentConfig} from "./agent";
import {QLearningConfig} from "./algorithm/qlearning";
import {SimulationConfig} from "./simulation";
import {RendererConfig} from "./visualization/renderer";
import {WorldConfig} from "./world";

export default interface Config {
    agent: AgentConfig;
    qlearning: QLearningConfig;
    renderer: RendererConfig;
    simulation: SimulationConfig;
    world: WorldConfig;
}