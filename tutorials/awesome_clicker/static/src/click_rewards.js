/** @odoo-module **/
import { choose } from "./utils";

export const rewards = [{
        description: "Regalo: +100 clics",
        apply(clicker) { clicker.increment(100); },
        maxLevel: 2,
    },
    {
        description: "¡Mega bono! +1000 clics",
        apply(clicker) { clicker.increment(1000); },
        minLevel: 2,
    },
    {
        description: "Mejora de potencia: +1 multiplicador",
        apply(clicker) { clicker.multiplier += 1; },
        minLevel: 3,
    },
];

export function getReward(level) {
    const availableRewards = rewards.filter(r =>
        (!r.minLevel || level >= r.minLevel) &&
        (!r.maxLevel || level <= r.maxLevel)
    );
    return choose(availableRewards);
}