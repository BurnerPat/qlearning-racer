import Brain from "./brain";
import ExArray from "../exarray";
import ExMath from "../exmath";

/*
 * Q-table is <s, a, r, ss>
 *  s  = sensors[] before
 *  a  = action (argmax)
 *  r  = reward (observed by this class)
 *  ss = sensors[] after
 */

export interface QLearningConfig {
    explorationProbability: number;

    futureRewardDiscountFactor: number;

    replayBatchSize: number;

    replayMemorySize: number;
}

class QEntry {
    constructor(public readonly s: number[],
                public readonly a: number,
                public readonly r: number,
                public readonly ss: number[],
                public readonly terminal: boolean) {
        // Simple data class
    }
}

export default class QLearning {
    private _experience: QEntry[] = [];

    public constructor(private readonly config: QLearningConfig) {
        // Also empty
    }

    public observe(s: number[], a: number, r: number, ss: number[], terminal: boolean): void {
        this._experience.push(new QEntry(s, a, terminal ? r : -1, ss, terminal));

        if (this._experience.length > this.config.replayMemorySize) {
            this._experience.splice(Math.floor(Math.random() * (this._experience.length - 1)), 1);
        }
    }

    public decide(brain: Brain, s: number[]): void {
        if (Math.random() <= this.config.explorationProbability) {
            brain.random();
        }
        else {
            brain.think(s);
        }
    }

    public async train(brain: Brain): Promise<void> {
        const batchSize = Math.min(this.config.replayBatchSize, this._experience.length);
        const batch = ExArray.pickRandom(this._experience, batchSize);

        const input: number[][] = [];
        const output: number[][] = [];

        for (const sample of batch) {
            let t = sample.r;
            const q = brain.think(sample.s);

            if (!sample.terminal) {
                t += this.config.futureRewardDiscountFactor * Math.max(...q);
            }

            q[ExMath.argmax(q)] = t;

            input.push(sample.s);
            output.push(q);
        }

        await brain.train(input, output);
    }
}