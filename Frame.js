function Frame(config) {
  this.config = config;
  this.init = function(config) {
    this.config = config;
    return this;
  }
}