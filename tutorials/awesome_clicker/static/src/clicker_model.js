/** @odoo-module **/
import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { getReward } from "@awesome_clicker/click_rewards";
import { browser } from "@web/core/browser/browser";

// 1. Incrementamos la versión a 2
const CURRENT_VERSION = 2;

const MIGRATIONS = [{
    // 2. Definimos la migración de la versión 1 a la 2
    fromVersion: 1,
    toVersion: 2,
    apply: (state) => {
        // Añadimos peach a las estructuras existentes si no existen
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
        const savedState = browser.localStorage.getItem(storageKey);

        let data = savedState ? JSON.parse(savedState) : null;

        if (data) {
            data = this._migrate(data);
        } else {
            data = {
                version: CURRENT_VERSION,
                clicks: 0,
                level: 0,
                clickBots: 0,
                bigBots: 0,
                multiplier: 1,
                trees: { pear: 0, cherry: 0, peach: 0 }, // Añadido peach
                fruits: { pear: 0, cherry: 0, peach: 0 }, // Añadido peach
            };
        }

        Object.assign(this, data);
        this.bus = new EventBus();

        this._setupIntervals(storageKey);
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
            this.clicks += ((this.clickBots * 10) + (this.bigBots * 100)) * this.multiplier;
            this._checkMilestones();
            this._saveState(storageKey);
        }, 10000);

        setInterval(() => {
            this.fruits.pear += this.trees.pear;
            this.fruits.cherry += this.trees.cherry;
            this.fruits.peach += this.trees.peach; // Producción de melocotones
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
            multiplier: this.multiplier,
            trees: this.trees,
            fruits: this.fruits,
        };
        browser.localStorage.setItem(key, JSON.stringify(stateToSave));
    }

    // --- Métodos de acción ---

    buyTree(type) {
        const price = type === 'peach' ? 1500000 : 1000000; // El melocotón es más caro
        if (this.clicks >= price) {
            this.clicks -= price;
            this.trees[type] += 1;
            this._checkMilestones();
        }
    }

    increment(inc) {
        this.clicks += inc;
        this._checkMilestones();
    }

    buyClickBot() {
        if (this.clicks >= 1000) {
            this.clicks -= 1000;
            this.clickBots += 1;
            this._checkMilestones();
        }
    }

    buyBigBot() {
        if (this.clicks >= 5000) {
            this.clicks -= 5000;
            this.bigBots += 1;
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

    get totalTrees() {
        return this.trees.pear + this.trees.cherry + this.trees.peach;
    }

    get totalFruits() {
        return this.fruits.pear + this.fruits.cherry + this.fruits.peach;
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
        this.multiplier = 1;
        this.trees = { pear: 0, cherry: 0, peach: 0 };
        this.fruits = { pear: 0, cherry: 0, peach: 0 };
        browser.localStorage.removeItem("awesome_clicker_state");
    }
}