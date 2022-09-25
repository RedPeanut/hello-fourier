function Plot(frame, config) {

  /* let default_plot_config = {
    "x_min": -1, "x_max": +1,
    "y_min": -1, "y_max": +1,
    "x_tic_int": 1.0,
    "y_tic_int": 1.0,

    "width": "100%",
    "height": "100%",
    "padding": "0",
    "x_scale": undefined,
    "y_scale": undefined,
    "x_origin": undefined,
    "y_origin": undefined,
    "position": CENTER,
  }; */

  this.ctor = function() {}
  this.dtor = function() {}
  
  this.init = function(frame, config) {
    
    this.frame = frame;
    this.config = config;
    this.points = [];

    let frameWidth = frame.config.width;
    let frameHeight = frame.config.height;

    let valWidth = this.config.width;
    let valHeight = this.config.height;
    let percentWidth, percentHeight;

    if (valWidth.indexOf("%") > -1) {
      let percentWidth = parseInt(valWidth.match(/\d+/));
      //console.log("" + parseInt(frameWidth * percentWidth / 100));
      valWidth = parseInt(frameWidth * percentWidth / 100);
    } else if (valWidth.indexOf("px") > -1) {
      valWidth = parseInt(valWidth.match(/\d+/));
    } else
      throw "width is not determined!";

    if (valHeight.indexOf("%") > -1) {
      percentHeight = parseInt(valHeight.match(/\d+/));
      //console.log("" + parseInt(frameHeight * percentHeight / 100));
      valHeight = parseInt(frameHeight * percentHeight / 100);
    } else if (valHeight.indexOf("px") > -1) {
      valHeight = parseInt(valHeight.match(/\d+/));
    } else
      throw "height is not determined!";

    let valPadding = this.config.padding;
    let split = valPadding.split(" ");

    if (split.length == 1) {
      this.paddingTop = this.paddingRight = this.paddingBottoP = this.paddingLeft = split[0].match(/\d/);
    } else if (split.length == 2) {
    } else if (split.length == 3) {
    } else if (split.length == 4) {
      this.paddingTop    = parseInt(split[0].match(/\d+/));
      this.paddingRight  = parseInt(split[1].match(/\d+/));
      this.paddingBottom = parseInt(split[2].match(/\d+/));
      this.paddingLeft   = parseInt(split[3].match(/\d+/));
    }

    this.width = valWidth - (this.paddingLeft + this.paddingRight);
    this.height = valHeight - (this.paddingTop + this.paddingBottom);

    this.xMin = this.config.x_min;
    this.xMax = this.config.x_max;
    this.yMin = this.config.y_min;
    this.yMax = this.config.y_max;

    this.xScale = this.width / (this.xMax - this.xMin);
    this.yScale = this.height / (this.yMax - this.yMin);

    this.x = parseInt(this.config.x.match(/\d+/));
    this.y = parseInt(this.config.y.match(/\d+/));

    this.xOrigin = this.x+this.paddingLeft+parseInt(-this.xMin * this.xScale);
    this.yOrigin = this.y+this.paddingTop+parseInt(this.yMax * this.yScale);

    //console.log("-this.xMin = " + -this.xMin);
    //console.log("-this.yMin = " + -this.yMin);

    //console.log("xOrigin = " + this.xOrigin);
    //console.log("yOrigin = " + this.yOrigin);

    this.xTicInt = this.config.x_tic_int;
    this.yTicInt = this.config.y_tic_int;

    // Tic mark lengths. If too small on x-axis, a default value is used later.
    this.xTicLen = (this.yMax - this.yMin) / 50;
    this.yTicLen = (this.xMax - this.xMin) / 50;

    this.setup = this.config.setup || function() {};
    this.f = this.config.f || function() {};
    this.drawShape = this.config.drawShape || function() {
      stroke(Color.YELLOW_C);
      beginShape();
      noFill();
      for (let i=0; i<this.points.length; i++) {
        vertex(this.points[i].x, this.points[i].y);
      }
      endShape();
    };
    this.end = this.config.end || function() {};

    return this;
  }

  this.xMin, this.xMax, this.yMin, this.yMax;
  this.xScale, this.yScale;

  this.paddingLeft, this.paddingRight, this.paddingTop, this.paddingBottom;
  this.width, this.height;
  this.x, this.y;
  this.xOrigin, this.yOrigin;

  this.xTicLen, this.yTicLen;
  this.xTicInt, this.yTicInt;

  this.drawBackground = function() {
    stroke(Color.LIGHT_GREY);

    this.drawAxes();
    this.drawXTics();
    this.drawYTics();
  }

  this.setup;
  this.f;
  this.drawShape;
  this.end;

  //this.createPoints = function() {}

  this.translate = function() {
    translate(this.xOrigin, this.yOrigin);
  }

  this.drawAxes = function() {
    line(this.getTheX(this.xMin), this.getTheY(0.0), this.getTheX(this.xMax), this.getTheY(0.0));
    line(this.getTheX(0.0), this.getTheY(this.yMin), this.getTheX(0.0), this.getTheY(this.yMax));
  }
  
  this.drawXTics = function() {
    // Get the ends of the tic marks.
    let topEnd = this.getTheY(this.xTicLen / 2);
    let bottomEnd = this.getTheY(-this.xTicLen / 2);
    
    if (topEnd < 5) {
      topEnd = 5;
      bottomEnd = -5;
    }
    
    let dX = 0; let iX = 0;
    // moving to the right from zero
    while (dX < this.xMax) {
      iX = this.getTheX(dX);
      line(iX, topEnd, iX, bottomEnd);
      dX += this.xTicInt;
    }
    
    // moving to the left from zero
    dX = 0;
    while (dX > this.xMin) {
      iX = this.getTheX(dX);
      line(iX, topEnd, iX, bottomEnd);
      dX -= this.xTicInt;
    }
  }
  this.drawYTics = function() {
    let rightEnd = this.getTheX(this.yTicLen / 2);
    let leftEnd = this.getTheX(-this.yTicLen / 2);
    
    let dY = 0; let iY = 0;
    
    // moving up from zero.
    while (dY < this.yMax) {
      iY = this.getTheY(dY);
      line(rightEnd, iY, leftEnd, iY);
      dY += this.yTicInt;
    }
    
    // moving down from zero.
    dY = 0;
    while (dY > this.yMin) {
      iY = this.getTheY(dY);
      line(rightEnd, iY, leftEnd, iY);
      dY -= this.yTicInt;
    }
  }

  this.getTheY = function(dY) {
    return parseInt(-dY * this.yScale);
  }
  
  this.getTheX = function(dX) {
    return parseInt(dX * this.xScale);
  }

  
}