'use strict';

describe('Player Setup: Class selection', function () {
  const should = require('should');

  const classes = require('../../../../Game/Core/PlayerSetup/classes').classes;

  describe('showClasses', function() {
    it('should show list of classes', function() {
      should.strictEqual(classes.showClass(), 'Fighter Mage ');
    });
  });

  describe('Select Class', function () {
    it('should should select the fighter class', function () {
      let selectedClass = classes.chooseClass('fighter');

      should.strictEqual(selectedClass, 'Fighter');
    });
    it('should should select the Mage class', function () {
      let selectedClass = classes.chooseClass('mage');

      should.strictEqual(selectedClass, 'Mage');
    });
  });
});
