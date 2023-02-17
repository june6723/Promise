const PromiseState = require("./PromiseState");

class MyPromise {
  #value = null;

  #state = PromiseState.PENDING;

  #catchCallbacks = [];

  #thenCallbacks = [];

  constructor(executor) {
    try {
      executor(this.#resolve.bind(this), this.#reject.bind(this));
    } catch (error) {
      this.#reject(error);
    }
  }

  #runCallbacks() {
    if (this.#state === PromiseState.FULFILLED) {
      console.log(this.#thenCallbacks.length);
      this.#thenCallbacks.forEach((callback) => callback(this.#value));
      this.#thenCallbacks = [];
    }

    if (this.#state === PromiseState.REJECTED) {
      this.#catchCallbacks.forEach((callback) => callback(this.#value));
      this.#catchCallbacks = [];
    }
  }

  #update(state, value) {
    queueMicrotask(() => {
      if (this.#state !== PromiseState.PENDING) return;
      if (value instanceof MyPromise) {
        value.then(this.#resolve.bind(this), this.#reject.bind(this));
        return;
      }
      this.#state = state;
      this.#value = value;
      this.#runCallbacks();
    });
  }

  #resolve(value) {
    this.#update(PromiseState.FULFILLED, value);
  }

  #reject(error) {
    this.#update(PromiseState.REJECTED, error);
  }

  then(thenCallback, catchCallback) {
    return new MyPromise((resolve, reject) => {
      this.#thenCallbacks.push((value) => {
        if (!thenCallback) {
          resolve(value);
          return;
        }

        try {
          resolve(thenCallback(value));
        } catch (error) {
          reject(error);
        }
      });

      this.#catchCallbacks.push((value) => {
        if (!catchCallback) {
          reject(value);
          return;
        }

        try {
          resolve(catchCallback(value));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  catch(catchCallback) {
    return this.then(undefined, catchCallback);
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
}

module.exports = MyPromise;
