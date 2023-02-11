const PromiseState = require("./PromiseState");

class SimplePromise {
  result;
  state;
  constructor(executor) {
    this.result = null;
    this.state = PromiseState.pending;

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  resolve(value) {
    this.result = value;
    this.state = PromiseState.fulfilled;

    return this;
  }
  reject(error) {
    this.result = error;
    this.state = PromiseState.rejected;

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
