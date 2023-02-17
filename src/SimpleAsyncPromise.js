const PromiseState = require("./PromiseState");

class SimpleAsyncPromise {
  constructor(executor) {
    this.result = null;
    this.state = PromiseState.PENDING;
    this.onFulfilledCallback = null;
    this.onRejectedCallback = null;

    queueMicrotask(() =>
      executor(this.resolve.bind(this), this.reject.bind(this))
    );
  }

  resolve(value) {
    this.result = value;
    this.state = PromiseState.FULFILLED;

    const onFulfilledCallback = this.onFulfilledCallback;
    if (onFulfilledCallback) onFulfilledCallback(this.result);

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
    this.onFulfilledCallback = onFulfilled;
    this.onRejectedCallback = onRejected;
    return this;
  }
  catch(onRejected) {
    this.onRejectedCallback = onRejected;
    return this;
  }
}

module.exports = SimpleAsyncPromise;
