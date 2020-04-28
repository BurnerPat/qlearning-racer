import Application from "./application";
import "./style/style.less";

const application = new Application(document.body, {
    agent: {
        acceleration: 0.5,
        brake: 0.75,
        steer: 0.1,
        friction: 0.95
    },

    world: {
        width: 1280,
        height: 768,

        trackWeight: 100
    },

    simulation: {
        useControlBrain: false,
        tickRate: 60
    },

    qlearning: {
        explorationProbability: 0.2,
        replayBatchSize: 10,
        replayMemorySize: 1000,
        futureRewardDiscountFactor: 0.25,

        terminalStatePenalty: -1000,
        backwardProgressPenalty: -1,
        noProgressPenalty: 0,
        progressReward: 100
    },

    renderer: {
        agentWidth: 15,
        agentHeight: 30,
        sensorLength: 50
    }
});

application.start();