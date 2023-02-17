const PromiseState = require("./PromiseState");

class ChainingPromise {
  result = null;
  state = PromiseState.PENDING;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  constructor(executor) {
    queueMicrotask(() => {
      try {
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (reason) {
        this.reject(reason);
      }
    });
  }

  resolve(value) {
    this.result = value;
    this.state = PromiseState.FULFILLED;

    const onFulfilledCallbacks = [...this.onFulfilledCallbacks];
    onFulfilledCallbacks.forEach((cb) => {
      try {
        const value = cb(this.result);
        this.result = value;
      } catch (error) {
        this.result = error;
      }
    });

    return this;
  }
  reject(error) {
    this.result = error;
    this.state = PromiseState.REJECTED;

    const onRejectedCallback = this.onRejectedCallback;
    if (onRejectedCallback) onRejectedCallback(this.result);
    return this;
  }
  then(onFulfilled, onRejected) {
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
    return this;
  }
  catch(onRejected) {
    this.onRejectedCallbacks.push(onRejected);
    return this;
  }
}

module.exports = ChainingPromise;
