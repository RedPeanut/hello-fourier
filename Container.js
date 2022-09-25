function Container(frame) {
  this.frame = frame;
  this.items = [];
  this.push = function(item) {
    this.items.push(item);
  }
  this.init = function() {
    //console.log("init() is called...");
    for (let i=0; i<this.items.length; i++) {
      let item = this.items[i];
      let position = item.config.position;
      console.log("position = " + position);
    }
  }
}