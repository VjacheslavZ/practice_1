import assert from 'node:assert';
import { describe, it } from 'node:test';

const Strategy = require('./4.ts');

describe('Strategy', () => {
  const notifyStrategy = new Strategy('notification', ['notify', 'multicast']);

  describe('Register behaviour', () => {
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

    it('Should handle behaviour', () => {
      const { log } = console;
      let logOutPut = '';
      console.log = msg => (logOutPut += msg);

      const emailNotify = notifyStrategy.getBehaviour('email', 'notify');
      emailNotify('test@test.com', 'Email: notify');
      assert.equal(
        logOutPut,
        'Sending "email" notification to <test@test.com>Message length: 13',
      );

      logOutPut = '';

      const emailMulticast = notifyStrategy.getBehaviour('email', 'multicast');
      emailMulticast('Email: multicast');
      assert.equal(
        logOutPut,
        'Sending "email" notification to allMessage length: 16',
      );

      console.log = log;
    });
  });
});
