/** @odoo-module **/
import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { getReward } from "@awesome_clicker/click_rewards";
import { browser } from "@web/core/browser/browser";

const CURRENT_VERSION = 2;

const MIGRATIONS = [{
    fromVersion: 1,
    toVersion: 2,
    apply: (state) => {
        if (state.trees && !state.trees.peach) {
            state.trees.peach = 0;
        }
        if (state.fruits && !state.fruits.peach) {
            state.fruits.peach = 0;
        }
        return state;
    }
}];

export class ClickerModel extends Reactive {
    constructor() {
        super();

        const storageKey = "awesome_clicker_state";
        let data = this._loadState(storageKey);

        Object.assign(this, data);
        this.bus = new EventBus();

        this._setupIntervals(storageKey);
    }

    _loadState(storageKey) {
        try {
            const savedState = browser.localStorage.getItem(storageKey);
            let data = savedState ? JSON.parse(savedState) : null;

            if (data) {
                data = this._migrate(data);
            } else {
                data = this._getDefaultState();
            }

            // Validar que todos los valores sean números válidos
            data.clicks = Number(data.clicks) || 0;
            data.level = Number(data.level) || 0;
            data.clickBots = Number(data.clickBots) || 0;
            data.bigBots = Number(data.bigBots) || 0;
            data.superBots = Number(data.superBots) || 0;
            data.multiplier = Number(data.multiplier) || 1;
            data.rebirthLevel = Number(data.rebirthLevel) || 0;
            data.rebirthMultiplier = Number(data.rebirthMultiplier) || 1;
            data.trees = data.trees || { pear: 0, cherry: 0, peach: 0 };
            data.fruits = data.fruits || { pear: 0, cherry: 0, peach: 0 };

            return data;
        } catch (e) {
            console.error('Error loading state:', e);
            browser.localStorage.removeItem(storageKey);
            return this._getDefaultState();
        }
    }

    _getDefaultState() {
        return {
            version: CURRENT_VERSION,
            clicks: 0,
            level: 0,
            clickBots: 0,
            bigBots: 0,
            superBots: 0,
            multiplier: 1,
            rebirthLevel: 0,
            rebirthMultiplier: 1,
            trees: { pear: 0, cherry: 0, peach: 0 },
            fruits: { pear: 0, cherry: 0, peach: 0 },
        };
    }

    _migrate(state) {
        let version = state.version || 0;
        while (version < CURRENT_VERSION) {
            const migration = MIGRATIONS.find(m => m.fromVersion === version);
            if (migration) {
                state = migration.apply(state);
                version = migration.toVersion;
                state.version = version;
            } else {
                state.version = CURRENT_VERSION;
                break;
            }
        }
        return state;
    }

    _setupIntervals(storageKey) {
        setInterval(() => {
            this.clicks += ((this.clickBots * 100) + (this.bigBots * 1000)) * this.multiplier;
            this._checkMilestones();
            this._saveState(storageKey);
        }, 10000);

        setInterval(() => {
            this.clicks += (this.superBots * 1) * this.multiplier;
            this._checkMilestones();
            this._saveState(storageKey);
        }, 1000);

        setInterval(() => {
            this.fruits.pear += this.trees.pear;
            this.fruits.cherry += this.trees.cherry;
            this.fruits.peach += this.trees.peach;
        }, 30000);

        setInterval(() => {
            const reward = getReward(this.level);
            if (reward) {
                reward.apply(this);
                this.bus.trigger("REWARD_RECEIVED", { description: reward.description });
            }
        }, 30000);
    }

    _saveState(key) {
        const stateToSave = {
            version: this.version,
            clicks: this.clicks,
            level: this.level,
            clickBots: this.clickBots,
            bigBots: this.bigBots,
            superBots: this.superBots,
            multiplier: this.multiplier,
            rebirthLevel: this.rebirthLevel,
            rebirthMultiplier: this.rebirthMultiplier,
            trees: this.trees,
            fruits: this.fruits,
        };
        browser.localStorage.setItem(key, JSON.stringify(stateToSave));
    }

    buyTree(type) {
        const price = type === 'peach' ? 1500000 : 1000000;
        if (this.clicks >= price) {
            this.clicks -= price;
            this.trees[type] += 1;
            this._checkMilestones();
        }
    }

    increment(inc) {
        this.clicks += inc * this.rebirthMultiplier;
        this._checkMilestones();
    }

    buyClickBot() {
        if (this.clicks >= 1000) {
            this.clicks -= 1000;
            this.clickBots += 1 * this.rebirthMultiplier;
            this._checkMilestones();
        }
    }

    buyBigBot() {
        if (this.clicks >= 5000) {
            this.clicks -= 5000;
            this.bigBots += 1 * this.rebirthMultiplier;
            this._checkMilestones();
        }
    }

    buySuperBot() {
        if (this.clicks >= 500) {
            this.clicks -= 500;
            this.superBots += 1 * this.rebirthMultiplier;
            console.log(`SuperBot nivel ${this.superBots} alcanzado`);
            this._checkMilestones();
        }
    }

    buyMultiplier() {
        if (this.clicks >= 50000) {
            this.clicks -= 50000;
            this.multiplier += 1;
            this._checkMilestones();
        }
    }

    rebirth() {
        let newRebirthLevel = this.rebirthLevel;
        let newRebirthMultiplier = this.rebirthMultiplier;

        if (this.clicks >= 50000000 && this.rebirthLevel < 1) {
            newRebirthLevel = 1;
            newRebirthMultiplier = 2;
            console.log(`Renacimiento 1 alcanzado - Multiplicador x2`);
        } else if (this.clicks >= 300000000 && this.rebirthLevel < 2) {
            newRebirthLevel = 2;
            newRebirthMultiplier = 3;
            console.log(`Renacimiento 2 alcanzado - Multiplicador x3`);
        } else if (this.clicks >= 750000000 && this.rebirthLevel < 3) {
            newRebirthLevel = 3;
            newRebirthMultiplier = 4;
            console.log(`Renacimiento 3 alcanzado - Multiplicador x4`);
        } else {
            return;
        }

        this.rebirthLevel = newRebirthLevel;
        this.rebirthMultiplier = newRebirthMultiplier;
        this.clicks = 0;
        this.level = 0;
        this.clickBots = 0;
        this.bigBots = 0;
        this.superBots = 0;
        this.multiplier = 1;
        this.trees = { pear: 0, cherry: 0, peach: 0 };
        this.fruits = { pear: 0, cherry: 0, peach: 0 };
    }

    get totalTrees() {
        return this.trees.pear + this.trees.cherry + this.trees.peach;
    }

    get totalFruits() {
        return this.fruits.pear + this.fruits.cherry + this.fruits.peach;
    }

    getGokuPhase() {
        const phases = [
            { name: 'basegoku', minClicks: 0 },
            { name: 'kaiokenx3goku', minClicks: 5000000 },
            { name: 'kaioken20goku', minClicks: 15000000 },
            { name: 'ssj1goku', minClicks: 30000000 },
            { name: 'ssj1fpgoku', minClicks: 60000000 },
            { name: 'ssj1kaiokengoku', minClicks: 100000000 },
            { name: 'ssj2goku', minClicks: 200000000 },
            { name: 'ssj3goku', minClicks: 350000000 },
            { name: 'ssj4goku', minClicks: 500000000 },
            { name: 'ssj4fpgoku', minClicks: 650000000 },
            { name: 'ssj4daimagoku', minClicks: 750000000 },
            { name: 'gokugod', minClicks: 800000000 },
            { name: 'gokublue', minClicks: 850000000 },
            { name: 'gokubluekaioken', minClicks: 900000000 },
            { name: 'uigoku', minClicks: 950000000 },
            { name: 'muigoku', minClicks: 1000000000 },
        ];

        for (let i = phases.length - 1; i >= 0; i--) {
            if (this.clicks >= phases[i].minClicks) {
                return phases[i].name;
            }
        }
        return 'basegoku';
    }

    _checkMilestones() {
        const oldLevel = this.level;
        if (this.clicks >= 1000 && this.level === 0) this.level = 1;
        if (this.clicks >= 5000 && this.level === 1) this.level = 2;
        if (this.clicks >= 100000 && this.level === 2) this.level = 3;
        if (this.clicks >= 1000000 && this.level === 3) this.level = 4;

        if (this.level > oldLevel) {
            this.bus.trigger("MILESTONE_REACHED");
        }
    }

    reset() {
        this.clicks = 0;
        this.level = 0;
        this.clickBots = 0;
        this.bigBots = 0;
        this.superBots = 0;
        this.multiplier = 1;
        this.rebirthLevel = 0;
        this.rebirthMultiplier = 1;
        this.trees = { pear: 0, cherry: 0, peach: 0 };
        this.fruits = { pear: 0, cherry: 0, peach: 0 };
        browser.localStorage.removeItem("awesome_clicker_state");
    }
}