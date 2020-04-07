const ONE_METER = 10;

const sqr = (x) => x * x;
const m = (x) => x * ONE_METER;

export default class Config {
    public static readonly FIXED_1_METER = m(1);

    public static readonly TICK_RATE_SIMULATION = 60;

    public static readonly SIZE_AGENT = m(1);

    public static readonly RADIUS_SINK = m(3);
    public static readonly RADIUS_FOOD = m(5);

    public static readonly RADIUS_AGENT_DIRTINESS = m(3);
    public static readonly RADIUS_AGENT_SIGHT = m(20);

    public static readonly RATE_AGENT_DIRTINESS = 0.005;
    public static readonly RATE_AGENT_SINK_CLEANING = 0.01;
    public static readonly RATE_AGENT_FOOD_CONSUMPTION = 0.5;
    public static readonly RATE_AGENT_MOVEMENT_COST = 0.05;
    public static readonly RATE_AGENT_HEALTH_DECAY = 0.25;

    public static readonly RATE_FOOD_REGENERATION = 0.1;

    public static readonly PENALTY_INFECTED_AGENT_MOVEMENT_SPEED = 0.75;
    public static readonly PENALTY_INFECTED_AGENT_HEALTH_DECAY = 2.5;

    public static readonly MAX_FOOD_AMOUNT = 100;
    public static readonly MAX_AGENT_SPEED = 2;
    public static readonly MAX_AGENT_HEALTH = 100;
    public static readonly MAX_AGENT_INFECTION_CHANCE = 0.1;

    // Squared values, for performance reasons
    public static readonly SQUARED_RADIUS_AGENT_DIRTINESS = sqr(Config.RADIUS_AGENT_DIRTINESS);
    public static readonly SQUARED_RADIUS_AGENT_SIGHT = sqr(Config.RADIUS_AGENT_SIGHT);
    public static readonly SQUARED_RADIUS_SINK = sqr(Config.RADIUS_SINK);
    public static readonly SQUARED_RADIUS_FOOD = sqr(Config.RADIUS_FOOD);

    public static readonly SQUARED_MAX_SPEED = sqr(Config.MAX_AGENT_SPEED);
}