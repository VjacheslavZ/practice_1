// Make high level abstraction from 5-agent.js:
// Now we have registerAgent(name, behaviour) and getAgent(name, action)

// Create Strategy class:
// constructor(strategyName: string, actions: Array<string>)
// registerBehaviour(implementationName, behaviour)
// getBehaviour(implementationName, actionName)

'use strict';

class Strategy {
  #strategyName = '';
  #actions = [];
  #behaviors = new Map();

  constructor(strategyName, actions) {
    this.#strategyName = strategyName;
    this.#actions = actions;
  }

  registerBehaviour(implementationName, behaviour) {
    const unregisteredActions = Object.keys(behaviour).filter(
      action => !this.#actions.includes(action),
    );

    if (unregisteredActions.length > 0) {
      console.warn(
        `Strategy "${this.#strategyName}": Implementation "${implementationName}" has unregistered actions "${unregisteredActions.join(', ')}"`,
      );
    }

    this.#behaviors.set(implementationName, behaviour);
  }

  getBehaviour(implementationName, actionName) {
    const behaviour = this.#behaviors.get(implementationName);
    if (!behaviour) {
      throw new Error(`Behaviour "${implementationName}" is not found`);
    }
    const handler = behaviour[actionName];
    if (!handler) {
      throw new Error(
        `Action "${actionName}" for strategy "${implementationName}" is not found`,
      );
    }
    return handler;
  }
}

// Usage
const notifyStrategy = new Strategy('notification', ['notify', 'multicast']);

notifyStrategy.registerBehaviour('email', {
  notify: (to, message) => {
    console.log(`Sending "email" notification to <${to}>`);
    console.log(`Message length: ${message.length}`);
  },
  multicast: message => {
    console.log(`Sending "email" notification to all`);
    console.log(`Message length: ${message.length}`);
  },
});

notifyStrategy.registerBehaviour('sms', {
  notify: (to, message) => {
    console.log(`Sending "sms" notification to <${to}>`);
    console.log(`Message length: ${message.length}`);
  },
  multicast: message => {
    console.log(`Sending "sms" notification to all`);
    console.log(`Message length: ${message.length}`);
  },
});

const smsNotify = notifyStrategy.getBehaviour('sms', 'notify');
smsNotify('+380501234567', 'SMS: notify');
const smsMulticast = notifyStrategy.getBehaviour('sms', 'multicast');
smsMulticast('SMS: multicast');

const emailNotify = notifyStrategy.getBehaviour('email', 'notify');
emailNotify('test@test.com', 'Email: notify');
const emailMulticast = notifyStrategy.getBehaviour('email', 'multicast');
emailMulticast('Email: multicast');
