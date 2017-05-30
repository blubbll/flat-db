// tests / server

var test = require('tape');
var request = require('supertest');

var {
  isObject,
  isBoolean,
  hasProperty
} = require('bellajs');

var app = require('../server');
var config = app.context.config;
var {
  url
} = config;

var target = `${url}/`;

let collection = 'students';

let students = [
  {
    name: 'Alice',
    age: 14
  },
  {
    name: 'Bob',
    age: 15
  },
  {
    name: 'Jerry',
    age: 12
  },
  {
    name: 'Kelly',
    age: 17
  },
  {
    name: 'Lina',
    age: 13
  },
  {
    name: 'Tina',
    age: 15
  },
  {
    name: 'Sophia',
    age: 16
  }
];

var init = () => {
  return new Promise((resolve) => {
    test(`Create a new collection with schema`, (assert) => {
      request(target)
        .post(`${collection}`)
        .send({
          action: 'create',
          schema: {
            name: '',
            age: 0
          }
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'action'), 'Response data must have the property "action"');
          assert.ok(hasProperty(body, 'schema'), 'Response data must have the property "schema"');
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var add = () => {
  return new Promise((resolve) => {
    test(`Add data to collection`, (assert) => {
      request(target)
        .post(`${collection}`)
        .send(students)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'entries'), 'Response data must have the property "entries"');

          students = body.entries;
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var list = () => {
  return new Promise((resolve) => {
    test(`Listing data from collection`, (assert) => {
      request(target)
        .get(collection)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'entries'), 'Response data must have the property "entries"');

          let {
            entries
          } = body;

          assert.equals(entries.length, students.length, 'Entries length must be matched');

          students = entries;
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var get = () => {
  let id = students[0]._id_;
  return new Promise((resolve) => {
    test(`Get item from collection by key`, (assert) => {
      request(target)
        .get(`${collection}/${id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'key'), 'Response data must have the property "key"');
          assert.ok(hasProperty(body, 'entry'), 'Response data must have the property "entry"');

          let {
            entry
          } = body;

          let student = students[0];

          assert.equals(entry.name, student.name, `entry.name must be ${student.name}`);
          assert.equals(entry.age, student.age, `entry.age must be ${student.age}`);
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var query = () => {
  return new Promise((resolve) => {
    test(`Find items from collection with condition`, (assert) => {
      request(target)
        .post(`${collection}`)
        .send({
          action: 'find',
          query: {
            age: {$gt: 15},
            name: {$match: (/li/gi).toString()}
          }
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'action'), 'Response data must have the property "action"');
          assert.ok(hasProperty(body, 'entries'), 'Response data must have the property "entries"');
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var update = () => {
  return new Promise((resolve) => {
    let id = students[0]._id_;
    test(`Update collection entry`, (assert) => {
      request(target)
        .put(`${collection}/${id}`)
        .send({
          name: 'Jimmy',
          age: 18,
          level: 6
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'key'), 'Response data must have the property "key"');
          assert.ok(hasProperty(body, 'updated'), 'Response data must have the property "updated"');
          assert.ok(isObject(body.updated), 'body.updated must be object');

          let {updated} = body;
          assert.ok(updated.name === 'Jimmy', 'updated.name must be "Jimmy"');
          assert.ok(updated.age === 18, 'updated.age must be 18');
          assert.ok(!hasProperty(updated, 'level'), 'updated must not have "level"');
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var remove = () => {
  return new Promise((resolve) => {
    let id = students[0]._id_;
    test(`Remove item from collection by key`, (assert) => {
      request(target)
        .del(`${collection}/${id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'key'), 'Response data must have the property "key"');
          assert.ok(hasProperty(body, 'removed'), 'Response data must have the property "removed"');
          assert.ok(isBoolean(body.removed), 'body.removed must be boolean');
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

var reset = () => {
  return new Promise((resolve) => {
    test(`Reset collection data`, (assert) => {
      request(target)
        .post(`${collection}`)
        .send({
          action: 'reset'
        })
        .set('Content-Type', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          let {body} = res;
          assert.ok(isObject(body), 'Response data must be an object');
          assert.ok(hasProperty(body, 'collection'), 'Response data must have the property "collection"');
          assert.ok(hasProperty(body, 'action'), 'Response data must have the property "action"');
          assert.equals(body.action, 'reset', `body.action must be "reset"`);
        })
        .end(() => {
          assert.end();
          return resolve();
        });
    });
  });
};

init()
  .then(add)
  .then(list)
  .then(get)
  .then(query)
  .then(update)
  .then(remove)
  .then(reset);

test.onFinish(process.exit);

