import EventBus from './event-bus';

class EventBusManager {
    static _instance;
    eventBus;
    constructor() {
        if (!EventBusManager._instance) {
            EventBusManager._instance = this;
            this.eventBus = new EventBus();
        }

        return EventBusManager._instance;
    }

    add(name, callback, scope = window) {
        this.eventBus.addEventListener(name, callback, scope);
    }

    dispatch(name, data) {
        this.eventBus.dispatch(name, data);
    }

    remove(name, callback, scope = window) {
        this.eventBus.removeEventListener(name, callback, scope);
    }
}

export const eventBusManager = new EventBusManager();
