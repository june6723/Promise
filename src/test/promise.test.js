// const MyPromise = Promise;

// const SimplePromise = require("../SimplePromise");
// const MyPromise = SimplePromise;
// const SimpleAsyncPromise = require("../SimpleAsyncPromise");
// const MyPromise = SimpleAsyncPromise;
// const ChainingPromise = require("../ChainingPromise");
// const MyPromise = ChainingPromise;
const AsyncChainingPromise = require("../AsyncChainingPromise");
const MyPromise = AsyncChainingPromise;
// const MyPromise = require("../MyPromise");

const DEFAULT_VALUE = "default";

describe("Promise then", () => {
  // it("with no chaining", (done) => {
  //   new MyPromise((resolve) => {
  //     resolve(DEFAULT_VALUE);
  //   }).then((v) => {
  //     try {
  //       expect(v).toEqual(DEFAULT_VALUE);
  //       done();
  //     } catch (error) {
  //       done(error);
  //     }
  //   });
  // });
  // it("Simple async resolve test", (done) => {
  //   new MyPromise((resolve) => {
  //     setTimeout(() => {
  //       resolve(DEFAULT_VALUE);
  //     }, 100);
  //   }).then((v) => {
  //     try {
  //       expect(v).toEqual(DEFAULT_VALUE);
  //       done();
  //     } catch (error) {
  //       done(error);
  //     }
  //   });
  // });
  // it("with chaining", (done) => {
  //   new MyPromise((resolve) => {
  //     resolve(3);
  //   })
  //     .then((v) => v * 4)
  //     .then((v) => {
  //       try {
  //         expect(v).toBe(12);
  //         done();
  //       } catch (error) {
  //         done(error);
  //       }
  //     });
  // });
  it("with asynchronous chaining", (done) => {
    new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(3);
      }, 100);
    })
      .then(
        (v) =>
          new MyPromise((resolve) => {
            setTimeout(() => {
              resolve(v * 2);
            }, 100);
          })
      )
      .then(
        (v) =>
          new MyPromise((resolve) => {
            setTimeout(() => {
              resolve(v * 2);
            }, 100);
          })
      )
      .then((v) => {
        try {
          expect(v).toBe(12);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});

const pm = new Promise((res) => res(1)).catch();

// describe('then', () => {

//   it('with multiple thens for same promise', () => {
//     const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
//     const mainPromise = promise();
//     const promise1 = mainPromise.then(checkFunc);
//     const promise2 = mainPromise.then(checkFunc);
//     return Promise.allSettled([promise1, promise2]);
//   });

//   it('with then and catch', () => {
//     const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
//     const failFunc = v => expect(1).toEqual(2);
//     const resolvePromise = promise().then(checkFunc, failFunc);
//     const rejectPromise = promise({ fail: true }).then(failFunc, checkFunc);
//     return Promise.allSettled([resolvePromise, rejectPromise]);
//   });

// });

// describe('catch', () => {
//   it('with no chaining', () => {
//     return promise({ fail: true }).catch(v => expect(v).toEqual(DEFAULT_VALUE));
//   });

//   it('with multiple catches for same promise', () => {
//     const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE);
//     const mainPromise = promise({ fail: true });
//     const promise1 = mainPromise.catch(checkFunc);
//     const promise2 = mainPromise.catch(checkFunc);
//     return Promise.allSettled([promise1, promise2]);
//   });

//   it('with chaining', () => {
//     return promise({ value: 3 })
//       .then(v => {
//         throw v * 4;
//       })
//       .catch(v => expect(v).toEqual(12));
//   });
// });

// describe('finally', () => {
//   it('with no chaining', () => {
//     const checkFunc = v => v => expect(v).toBeUndefined();
//     const successPromise = promise().finally(checkFunc);
//     const failPromise = promise({ fail: true }).finally(checkFunc);
//     return Promise.allSettled([successPromise, failPromise]);
//   });

//   it('with multiple finallys for same promise', () => {
//     const checkFunc = v => expect(v).toBeUndefined();
//     const mainPromise = promise();
//     const promise1 = mainPromise.finally(checkFunc);
//     const promise2 = mainPromise.finally(checkFunc);
//     return Promise.allSettled([promise1, promise2]);
//   });

//   it('with chaining', () => {
//     const checkFunc = v => v => expect(v).toBeUndefined();
//     const successPromise = promise()
//       .then(v => v)
//       .finally(checkFunc);
//     const failPromise = promise({ fail: true })
//       .then(v => v)
//       .finally(checkFunc);
//     return Promise.allSettled([successPromise, failPromise]);
//   });
// });

// describe('static methods', () => {
//   it('resolve', () => {
//     return MyPromise.resolve(DEFAULT_VALUE).then(v => expect(v).toEqual(DEFAULT_VALUE));
//   });

//   it('reject', () => {
//     return MyPromise.reject(DEFAULT_VALUE).catch(v => expect(v).toEqual(DEFAULT_VALUE));
//   });

//   describe('all', () => {
//     it('with success', () => {
//       return MyPromise.all([promise({ value: 1 }), promise({ value: 2 })]).then(v => expect(v).toEqual([1, 2]));
//     });

//     it('with fail', () => {
//       return MyPromise.all([promise(), promise({ fail: true })]).catch(v => expect(v).toEqual(DEFAULT_VALUE));
//     });
//   });

//   it('allSettled', () => {
//     return MyPromise.allSettled([promise(), promise({ fail: true })]).then(v =>
//       expect(v).toEqual([
//         { status: 'fulfilled', value: DEFAULT_VALUE },
//         { status: 'rejected', reason: DEFAULT_VALUE },
//       ]),
//     );
//   });

//   describe('race', () => {
//     it('with success', () => {
//       return MyPromise.race([promise({ value: 1 }), promise({ value: 2 })]).then(v => expect(v).toEqual(1));
//     });

//     it('with fail', () => {
//       return MyPromise.race([promise({ fail: true, value: 1 }), promise({ fail: true, value: 2 })]).catch(v =>
//         expect(v).toEqual(1),
//       );
//     });
//   });

//   describe('any', () => {
//     it('with success', () => {
//       return MyPromise.any([promise({ value: 1 }), promise({ value: 2 })]).then(v => expect(v).toEqual(1));
//     });

//     it('with fail', () => {
//       return MyPromise.any([promise({ fail: true, value: 1 }), promise({ value: 2 })]).catch(e =>
//         expect(e.errors).toEqual([1, 2]),
//       );
//     });
//   });
// });
