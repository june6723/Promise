const PromiseState = require("./PromiseState");

class MyPromise {
  #result;
  #state = PromiseState.PENDING;
  #onFulfilledCallback;
  #onRejectedCallback;

  constructor(executor) {
    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (reason) {
      this.#reject(reason);
    }
  }

  #excuteCallback() {
    if (
      this.#state === PromiseState.FULFILLED &&
      typeof this.#onFulfilledCallback === "function"
    ) {
      this.#onFulfilledCallback(this.#result);
    }
    if (
      this.#state === PromiseState.REJECTED &&
      typeof this.#onRejectedCallback === "function"
    ) {
      this.#onRejectedCallback(this.#result);
    }
  }

  #updatePromise(state, value) {
    queueMicrotask(() => {
      if (this.#state !== PromiseState.PENDING) return;
      if (value instanceof MyPromise) {
        value.then(this.#resolve.bind(this), this.#reject.bind(this));
        return;
      }
      this.#state = state;
      this.#result = value;
      this.#excuteCallback();
    });
  }

  #resolve(value) {
    this.#updatePromise(PromiseState.FULFILLED, value);
  }
  #reject(error) {
    this.#updatePromise(PromiseState.REJECTED, error);
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#onFulfilledCallback = (value) => {
        if (!onFulfilled) {
          resolve(value);
          return;
        }
        try {
          resolve(onFulfilled(value));
        } catch (error) {
          reject(error);
        }
      };

      this.#onRejectedCallback = (value) => {
        if (!onRejected) {
          reject(value);
          return;
        }
        try {
          resolve(onRejected(value));
        } catch (error) {
          reject(error);
        }
      };
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(callback) {
    return this.then(
      (value) => {
        callback();
        return value;
      },
      (value) => {
        callback();
        throw value;
      }
    );
  }

  static all(iter) {
    if (iter.length === 0) {
      const fulfilledPromise = new MyPromise();
      fulfilledPromise.#state = PromiseState.FULFILLED;
      fulfilledPromise.#result = [];
      return fulfilledPromise;
    }

    return new MyPromise((resolve, reject) => {
      const result = {
        fulfilledCount: 0,
        results: Array(iter.length).fill(undefined),
      };

      iter.forEach((maybePromise, index) => {
        if (maybePromise instanceof MyPromise) {
          maybePromise.then(
            (value) => {
              result.fulfilledCount += 1;
              result.results[index] = value;
              if (result.fulfilledCount === iter.length)
                resolve(result.results);
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          result.fulfilledCount += 1;
          result.results[index] = maybePromise;
          if (result.fulfilledCount === iter.length) resolve(result.results);
        }
      });
    });
  }
}

const pm1 = new MyPromise((res) => {
  setTimeout(() => {
    res(1);
  }, 100);
});
const pm2 = new MyPromise((res) => res(3));
const pm3 = new MyPromise((res) => {
  setTimeout(() => {
    res("안녕하세요");
  }, 500);
});
const pm4 = new MyPromise((res, rej) => {
  setTimeout(() => {
    rej("오류입니다~");
  }, 100);
});
MyPromise.all([pm1, pm2, pm3, pm4]).then(
  (value) => console.log(value),
  (error) => console.log(error)
);

module.exports = MyPromise;
