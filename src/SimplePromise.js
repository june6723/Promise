const PromiseState = require("./PromiseState");

class SimplePromise {
  result = null;
  state = PromiseState.PENDING;
  constructor(executor) {
    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    this.result = value;
    this.state = PromiseState.FULFILLED;

    return this;
  }
  reject(error) {
    this.result = error;
    this.state = PromiseState.REJECTED;

    return this;
  }
  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.result);
    }
    if (onRejected && this.state === "rejected") {
      onRejected(this.result);
    }
    return this;
  }
  catch(onRejected) {
    onRejected(this.result);
    return this;
  }
}

module.exports = SimplePromise;
