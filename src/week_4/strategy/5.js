const createStrategy = (strategyName, actions) => {
  const behaviors = new Map();

  const registerBehaviour = (implementationName, behaviour) => {
    const unregisteredActions = Object.keys(behaviour).filter(
      action => !actions.includes(action),
    );

    if (unregisteredActions.length > 0) {
      console.warn(
        `Strategy "${strategyName}": Behaviour "${implementationName}" has unregistered actions "${unregisteredActions.join(', ')}"`,
      );
    }

    behaviors.set(implementationName, behaviour);
  };
  const getBehaviour = (implementationName, actionName) => {
    const behaviour = behaviors.get(implementationName);
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
  };

  return { registerBehaviour, getBehaviour };
};

module.exports = createStrategy;
// Usage
// const notifyStrategy = createStrategy('notification', ['notify', 'multicast']);
// notifyStrategy.registerBehaviour('email', {
//   notify: (to, message) => {
//     console.log(`Sending "email" notification to <${to}>`);
//     console.log(`Message length: ${message.length}`);
//   },
//   multicast: message => {
//     console.log(`Sending "email" notification to all`);
//     console.log(`Message length: ${message.length}`);
//   },
// });
// const emailNotify = notifyStrategy.getBehaviour('email', 'notify');
// emailNotify('test@test.com', 'Email: notify');
// const emailMulticast = notifyStrategy.getBehaviour('email', 'multicast');
// emailMulticast('Email: multicast');

// notifyStrategy.registerBehaviour('sms', {
//   notify: (to, message) => {
//     console.log(`Sending "sms" notification to <${to}>`);
//     console.log(`Message length: ${message.length}`);
//   },
//   multicast: message => {
//     console.log(`Sending "sms" notification to all`);
//     console.log(`Message length: ${message.length}`);
//   },
// });
// const smsNotify = notifyStrategy.getBehaviour('sms', 'notify');
// smsNotify('+380501234567', 'SMS: notify');
// const smsMulticast = notifyStrategy.getBehaviour('sms', 'multicast');
// smsMulticast('SMS: multicast');
