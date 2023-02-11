const PromiseState = require("./PromiseState");

class SimpleAsyncPromise {
  constructor(executor) {
    this.result = null;
    this.state = PromiseState.pending;
    this.onFulfilledCallback = null;
    this.onRejectedCallback = null;

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    this.result = value;
    this.state = PromiseState.fulfilled;

    const onFulfilledCallback = this.onFulfilledCallback;
    if (onFulfilledCallback) onFulfilledCallback(this.result);

    return this;
  }
  reject(error) {
    this.result = error;
    this.state = PromiseState.rejected;

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
