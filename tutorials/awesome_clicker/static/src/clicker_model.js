/** @odoo-module **/
import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { getReward } from "@awesome_clicker/click_rewards";

export class ClickerModel extends Reactive {
    constructor() {
        super();
        this.clicks = 0;
        this.level = 0;
        this.clickBots = 0;
        this.bigBots = 0;
        this.multiplier = 1;
        this.bus = new EventBus();

        setInterval(() => {
            this.clicks += ((this.clickBots * 10) + (this.bigBots * 100)) * this.multiplier;
            this._checkMilestones();
        }, 10000);

        setInterval(() => {
            const reward = getReward(this.level);
            if (reward) {
                reward.apply(this);
                this.bus.trigger("REWARD_RECEIVED", { description: reward.description });
            }
        }, 30000);
    }

    increment(inc) {
        this.clicks += inc;
        this._checkMilestones();
    }

    buyClickBot() {
        if (this.clicks >= 1000) {
            this.clicks -= 1000;
            this.clickBots += 1;
            console.log(`Bot nivel ${this.clickBots} alcanzado`);
        }
    }

    buyBigBot() {
        if (this.clicks >= 5000) {
            this.clicks -= 5000;
            this.bigBots += 1;
            console.log(`Bot grande nivel ${this.bigBots} alcanzado`);
        }
    }

    buyMultiplier() {
        if (this.clicks >= 50000) {
            this.clicks -= 50000;
            this.multiplier += 1;
            console.log(`Multiplicador nivel ${this.multiplier} alcanzado`);
        }
    }

    getReward() {
        const reward = getReward(this.level);
        if (reward) {
            return reward;
        }
    }

    _checkMilestones() {
        const oldLevel = this.level;
        if (this.clicks >= 1000 && this.level === 0) this.level = 1;
        if (this.clicks >= 5000 && this.level === 1) this.level = 2;
        if (this.clicks >= 100000 && this.level === 2) this.level = 3;

        if (this.level > oldLevel) {
            this.bus.trigger("MILESTONE_REACHED");
        }
    }
}