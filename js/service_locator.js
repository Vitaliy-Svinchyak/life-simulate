"use strict";

class ServiceLocator {
    constructor() {
        this.services = new Map();
        this.factories = new Map();
        this.invokables = new Map();
    }

    get(object) {
        const name = object.name;

        if (this.services.get(name)) {
            return this.services.get(name);
        }

        if (this.invokables.get(name)) {
            const instance = this.invokables.get(name).apply(this);
            this.register(name, instance);

            return instance;
        }
    }

    create(name, parameters) {
        if (this.factories.get(name)) {
            const fabric = this.factories.get(name);

            return fabric.apply(this, parameters);
        }
    }

    loadFromConfig(config) {
        for (let key in config.invokables) {
            if (config.invokables.hasOwnProperty(key)) {
                this.invokables.set(key, config.invokables[key]);
            }
        }

        for (let key in config.factories) {
            if (config.factories.hasOwnProperty(key)) {
                this.factories.set(key, config.factories[key]);
            }
        }
    }

    register(key, object) {
        this.services.set(key, object);
    }
}

window.serviceLocator = new ServiceLocator();
const config = {
    'factories': {
        'Human': function (y, x, id) {
            return new Human(y, x, id, this.get(CollectiveMind));
        }
    },
    'invokables': {
        'GameLogic': function () {
            return new GameLogic(
                this.get(Field)
            );
        },

        'ResourcesRegister': function () {
            return new ResourcesRegister();
        },

        'CollectiveMind': function () {
            return new CollectiveMind(
                this.get(Field)
            );
        },

        'Painter': function () {
            return new Painter(
                this.get(Field)
            );
        }
    },
};
window.serviceLocator.loadFromConfig(config);