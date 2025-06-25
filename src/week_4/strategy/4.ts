// Prepare ESM or CJS module for Strategy
// Add .d.ts typings
// Add tests and cases

class Strategy {
  #strategyName: string = '';
  #actions: string[] = [];
  #behaviors: Map<string, Record<string, (...args: any[]) => void>> = new Map();

  constructor(strategyName: string, actions: string[]) {
    this.#strategyName = strategyName;
    this.#actions = actions;
  }

  registerBehaviour(
    implementationName: string,
    behaviour: Record<string, (...args: any[]) => void>,
  ) {
    const missedBehaviourName = Object.keys(behaviour).find(
      action => !this.#actions.includes(action),
    );

    if (missedBehaviourName) {
      throw new Error(
        `Strategy "${this.#strategyName}": Behaviour "${implementationName}" is missing required action "${missedBehaviourName}"`,
      );
    }

    this.#behaviors.set(implementationName, behaviour);
  }

  getBehaviour(implementationName: string, actionName: string) {
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

module.exports = Strategy;

// Usage
/*
const notifyStrategy = new Strategy('notification', ['notify', 'multicast']);

notifyStrategy.registerBehaviour('email', {
  notify: (to: string, message: string) => {
    console.log(`Sending "email" notification to <${to}>`);
    console.log(`Message length: ${message.length}`);
  },
  multicast: (message: string) => {
    console.log(`Sending "email" notification to all`);
    console.log(`Message length: ${message.length}`);
  },
});

notifyStrategy.registerBehaviour('sms', {
  notify: (to: string, message: string) => {
    console.log(`Sending "sms" notification to <${to}>`);
    console.log(`Message length: ${message.length}`);
  },
  multicast: (message: string) => {
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
*/
