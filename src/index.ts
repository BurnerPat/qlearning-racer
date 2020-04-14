import Application from "./application";

const application = new Application(document.body, {
    agent: {
        acceleration: 0.5,
        brake: 0.75,
        steer: 0.1,
        friction: 0.95,

        width: 15,
        height: 30
    },

    world: {
        width: window.innerWidth,
        height: window.innerHeight
    },

    simulation: {
        useControlBrain: false,
        tickRate: 60
    },

    qlearning: {
        explorationProbability: 0.05,
        replayBatchSize: 10,
        replayMemorySize: 1000,
        futureRewardDiscountFactor: 0.1
    }
});

application.start();