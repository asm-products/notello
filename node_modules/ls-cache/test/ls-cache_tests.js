var originalConsole = window.console;
mocha.ui("tdd");

var assert = require("assert");
var lscache = require("../lib/ls-cache");

suite('ls-cache', function() {
  setup(function() {
    // Reset localStorage before each test
    try {
      localStorage.clear();
    } catch(e) {}
  });

  teardown(function() {
    // Reset localStorage after each test
    try {
      localStorage.clear();
    } catch(e) {}
    window.console = originalConsole;
    lscache.enableWarnings(false);
  });

  test('Testing set() and get() with string', function() {
    var key = 'thekey';
    var value = 'thevalue'
    lscache.set(key, value);
    if (lscache.supported()) {
      assert.deepEqual(lscache.get(key), value, 'We expect value to be ' + value);
    } else {
      assert.equal(lscache.get(key), null, 'We expect null value');
    }
  });

  test('Testing set() and get() with object', function() {
    var key = 'thekey';
    var value = { a: 4, b: 2};
    lscache.set(key, value);
    if (lscache.supported()) {
      assert.deepEqual(lscache.get(key), value, 'We expect value to be ' + value);
    } else {
      assert.equal(lscache.get(key), null, 'We expect null value');
    }
  });

  if (lscache.supported()) {
    test('Testing set() with non-string values', function() {
      var key, value;

      key = 'numberkey';
      value = 2;
      lscache.set(key, value, 3);
      assert.equal(lscache.get(key)+1, value+1, 'We expect incremented value to be ' + (value+1));

      key = 'arraykey';
      value = ['a', 'b', 'c'];
      lscache.set(key, value, 3);
      assert.equal(lscache.get(key).length, value.length, 'We expect array to have length ' + value.length);

      key = 'objectkey';
      value = {'name': 'Pamela', 'age': 26};
      lscache.set(key, value, 3);
      assert.equal(lscache.get(key).name, value.name, 'We expect name to be ' + value.name);
    });

    test('Testing remove()', function() {
      var key = 'thekey';
      lscache.set(key, 'bla', 2);
      lscache.remove(key);
      assert.equal(lscache.get(key), null, 'We expect value to be null');
    });

    test('Testing flush()', function() {
      localStorage.setItem('outside-cache', 'not part of lscache');
      var key = 'thekey';
      lscache.set(key, 'bla', 100);
      lscache.flush();
      assert.equal(lscache.get(key), null, 'We expect flushed value to be null');
      assert.equal(localStorage.getItem('outside-cache'), 'not part of lscache', 'We expect localStorage value to still persist');
    });

    test("Testing flush() doesn't affect sub-bucket", function() {
      sub = lscache.createBucket("tmp");
      var key = 'thekey';
      var key2 = 'thekey';
      lscache.set(key, 'bla', 100);
      sub.set(key2, 'bla', 100);

      lscache.flush();
      assert.equal(lscache.get(key), null, 'We expect flushed value to be null');
      assert.equal(sub.get(key2), 'bla', 'We expect sub-bucket value to still persist');
    });

    test("Testing flushRecursive() affects sub-buckets only", function() {
      sub1 = lscache.createBucket("sub1");
      sub1a = sub1.createBucket("sub1a");
      sub2 = lscache.createBucket("sub2");
      var key = 'thekey';
      lscache.set(key, 'bla', 100);
      sub1.set(key, 'bla', 100);
      sub1a.set(key, 'bla', 100);
      sub2.set(key, 'bla', 100);

      sub1.flushRecursive();
      assert.equal(lscache.get(key), 'bla');
      assert.equal(sub1.get(key), null);
      assert.equal(sub1a.get(key), null);
      assert.equal(sub2.get(key), 'bla');
    });

    test("Testing buckets are independant", function() {
      sub = lscache.createBucket("tmp");
      var key = 'thekey';
      lscache.set(key, 'foo', 100);
      sub.set(key, 'bar', 100);

      assert.equal(lscache.get(key), 'foo', 'We expect foo');
      assert.equal(sub.get(key), 'bar', 'We expect bar');
    });

    test("Testing buckets can be listed", function() {
      sub = lscache.createBucket("tmp");
      var key = 'thekey';
      var key2 = 'thekey2';
      lscache.set(key, 'foo', 100);
      sub.set(key, 'bar', 100);
      sub.set(key2, 'bar2', 100);

      assert.deepEqual(lscache.keys().sort(), [key].sort());
      assert.deepEqual(sub.keys().sort(), [key, key2].sort());
    });

    test("Testing buckets can contain special characters", function() {
      sub = lscache.createBucket("!@#$!#$%?//");
      var key = 'thekey';
      sub.set(key, 'foo', 100);

      assert.equal(sub.get(key), 'foo', 'We expect foo');
    });

    test('Testing setWarnings()', function() {
      window.console = {
        calls: 0,
        warn: function() { this.calls++; }
      };

      var longString = (new Array(10000)).join('s');
      var num = 0;
      while(num < 10000) {
        try {
          localStorage.setItem("key" + num, longString);
          num++;
        } catch (e) {
          break;
        }
      }
      localStorage.clear()

      for (var i = 0; i <= num; i++) {
        lscache.set("key" + i, longString, i);
      }

      // Warnings not enabled, nothing should be logged
      assert.equal(window.console.calls, 0);

      lscache.enableWarnings(true);

      lscache.set("key" + i, longString);
      assert(window.console.calls >= 1, "We expect one warning to have been printed");
      assert(window.console.calls <= 2, "We expect not too many warnings to have been printed");
    });

    test('Testing quota exceeding', function() {
      var key = 'thekey';

      // Figure out this browser's localStorage limit -
      // Chrome is around 2.6 mil, for example
      var stringLength = 10000;
      var longString = (new Array(stringLength+1)).join('s');
      var num = 0;
      while(num < 10000) {
        try {
          localStorage.setItem(key + num, longString);
          num++;
        } catch (e) {
          break;
        }
      }
      localStorage.clear();

      // Now add enough to go over the limit
      var approxLimit = num * stringLength;
      var numKeys = Math.ceil(approxLimit/(stringLength+8)) + 1;
      for (var i = 0; i <= numKeys; i++) {
        var currentKey = key + i;
        lscache.set(currentKey, longString, i+1);
      }
      // Test that last-to-expire is still there
      assert.equal(lscache.get(currentKey), longString, 'We expect newest value to still be there');
      // Test that the first-to-expire is kicked out
      assert.equal(lscache.get(key + '0'), null, 'We expect oldest value to be kicked out (null)');

      // Test trying to add something thats bigger than previous items,
      // check that it is successfully added (requires removal of multiple keys)
      var veryLongString = longString + longString;
      lscache.set(key + 'long', veryLongString, i+1);
      assert.equal(lscache.get(key + 'long'), veryLongString, 'We expect long string to get stored');

      // Try the same with no expiry times
      localStorage.clear();

      assert.throws(function() {
        for (var i = 0; i <= numKeys; i++) {
          var currentKey = key + i;
          lscache.set(currentKey, longString);
        }
      });

      // Test that first added is still there
      assert.equal(lscache.get(key + 0), longString, 'We expect value to be set');
    });
  }
});


