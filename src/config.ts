import {AgentConfig} from "./agent";
import {SimulationConfig} from "./simulation";
import {WorldConfig} from "./world";
import {QLearningConfig} from "./algorithm/qlearning";

export default interface Config {
    world: WorldConfig;
    agent: AgentConfig;
    simulation: SimulationConfig;
    qlearning: QLearningConfig;
}