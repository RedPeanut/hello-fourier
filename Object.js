
class Object {
  constructor() {
    this.config = {};
  }

  loadConfig(config) {
    for (let item in config) {
        this.config[item] = config[item];
    }
  }
}