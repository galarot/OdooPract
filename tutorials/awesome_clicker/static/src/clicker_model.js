/** @odoo-module **/
import { Reactive } from "@web/core/utils/reactive";
import { EventBus } from "@odoo/owl";
import { getReward } from "@awesome_clicker/click_rewards";
import { browser } from "@web/core/browser/browser";

const CURRENT_VERSION = 3;

const MIGRATIONS = [{
    fromVersion: 1,
    toVersion: 2,
    apply: (state) => {
        return state;
    }
}, {
    fromVersion: 2,
    toVersion: 3,
    apply: (state) => {
        state.ki = 0;
        state.gokuEvolutions = 0;
        delete state.trees;
        delete state.fruits;
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
        this._lastGokuPhase = this.getGokuPhase();

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

            data.clicks = Number(data.clicks) || 0;
            data.level = Number(data.level) || 0;
            data.clickBots = Number(data.clickBots) || 0;
            data.bigBots = Number(data.bigBots) || 0;
            data.superBots = Number(data.superBots) || 0;
            data.multiplier = Number(data.multiplier) || 1;
            data.rebirthLevel = Number(data.rebirthLevel) || 0;
            data.rebirthMultiplier = Number(data.rebirthMultiplier) || 1;
            data.ki = Number(data.ki) || 0;
            data.gokuEvolutions = Number(data.gokuEvolutions) || 0;

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
            ki: 0,
            gokuEvolutions: 0,
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

    // Clicks por segundo que genera la bonificación por fase
    get phaseFarmPerSecond() {
        return this.gokuEvolutions * 10 * this.multiplier;
    }

    _setupIntervals(storageKey) {
        setInterval(() => {
            this.clicks += ((this.clickBots * 100) + (this.bigBots * 1000)) * this.multiplier;
            this._checkMilestones();
            this._saveState(storageKey);
        }, 10000);

        setInterval(() => {
            // SuperBots + bonificación por fase, ambos cada segundo
            this.clicks += (this.superBots * 1 * this.multiplier) + this.phaseFarmPerSecond;
            this._checkMilestones();
            this._saveState(storageKey);
        }, 1000);
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
            ki: this.ki,
            gokuEvolutions: this.gokuEvolutions,
        };
        browser.localStorage.setItem(key, JSON.stringify(stateToSave));
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
        } else if (this.clicks >= 300000000 && this.rebirthLevel < 2) {
            newRebirthLevel = 2;
            newRebirthMultiplier = 3;
        } else if (this.clicks >= 750000000 && this.rebirthLevel < 3) {
            newRebirthLevel = 3;
            newRebirthMultiplier = 4;
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
        this.ki = 0;
        this.gokuEvolutions = 0;
        this._lastGokuPhase = 'basegoku';
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

        const newPhase = this.getGokuPhase();
        if (newPhase !== this._lastGokuPhase) {
            this._lastGokuPhase = newPhase;
            this.evolveGoku();
        }
    }

    evolveGoku() {
        this.ki += 1000;
        this.gokuEvolutions += 1;
        this.bus.trigger("GOKU_EVOLVED", { kiGain: 1000 });
    }

    buyClicksWithKi() {
        if (this.ki >= 500) {
            this.ki -= 500;
            this.clicks += 5000000;
            this._checkMilestones();
        }
    }

    timeChamber() {
        if (this.ki >= 10000) {
            this.ki -= 10000;

            const superBotClicks = this.superBots * 1 * 600 * this.multiplier;
            const clickBotClicks = this.clickBots * 100 * 60 * this.multiplier;
            const bigBotClicks = this.bigBots * 1000 * 60 * this.multiplier;
            const phaseFarmClicks = this.phaseFarmPerSecond * 600;

            const totalClicks = superBotClicks + clickBotClicks + bigBotClicks + phaseFarmClicks;
            this.clicks += totalClicks;

            this._checkMilestones();
            this.bus.trigger("TIME_CHAMBER_USED", { clicksGained: totalClicks });
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
        this.ki = 0;
        this.gokuEvolutions = 0;
        this._lastGokuPhase = 'basegoku';
        browser.localStorage.removeItem("awesome_clicker_state");
    }
}
