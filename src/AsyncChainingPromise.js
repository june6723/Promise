const PromiseState = require("./PromiseState");

class AsyncChainingPromise {
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
      if (value instanceof AsyncChainingPromise) {
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
    return new AsyncChainingPromise((resolve, reject) => {
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
}

new AsyncChainingPromise((resolve) => {
  setTimeout(() => {
    resolve(3);
  }, 100);
})
  .then(
    (v) =>
      new AsyncChainingPromise((resolve) => {
        setTimeout(() => {
          resolve(v * 2);
        }, 100);
      })
  )
  .then((value) => console.log(value));

module.exports = AsyncChainingPromise;
