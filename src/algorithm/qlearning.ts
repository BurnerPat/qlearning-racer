import ExArray from "../ex-array";
import ExMath from "../ex-math";
import Brain from "./brain";

/*
 * Q-table is <s, a, r, ss>
 *  s  = sensors[] before
 *  a  = action (argmax)
 *  r  = reward (observed by this class)
 *  ss = sensors[] after
 */

export interface QLearningConfig {
    terminalStatePenalty: number;
    noProgressPenalty: number;
    backwardProgressPenalty: number;
    progressReward: number;
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
        if (terminal) {
            r = this.config.terminalStatePenalty;
        }
        else {
            r = [this.config.backwardProgressPenalty, this.config.noProgressPenalty, this.config.progressReward][r + 1];
        }

        this._experience.push(new QEntry(s, a, r, ss, terminal));

        if (this._experience.length > this.config.replayMemorySize) {
            this._experience.splice(0, 1);
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
            const q = brain.think(sample.s);
            const qq = brain.think(sample.ss);

            const a = ExMath.argmax(qq);
            const t = sample.r + this.config.futureRewardDiscountFactor * qq[a];

            q[a] = t;

            input.push(sample.s);
            output.push(q);
        }

        await brain.train(input, output);
    }

    public reset(): void {
        this._experience = [];
    }
}