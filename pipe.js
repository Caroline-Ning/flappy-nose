const space=0.2
const Tmax=1/5
const Tmin=4/5 //ratio for this.top

function Pipe() {
    this.spacing = space*height;
    this.top = random(Tmax*height, Tmin*height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 80;
    this.speed = 6;
  
    this.highlight = false;

    this.hits = function() {
      if (ny-r< this.top || ny+r > height - this.bottom) {
        if (flipX +r> this.x && flipX -r< this.x + this.w) {
          this.highlight = true;
          hit=true
          return true;
        }
      }
      this.highlight = false;
      return false;
    }
    
    this.show = function() {
      stroke(219, 205, 240)
      strokeWeight(3)
      fill(215, 227, 252); //blue
      if (this.highlight) {
        fill(250, 210, 225); //pink
      }
      rect(this.x, 0, this.w, this.top,0,0,15,15);
      rect(this.x, height - this.bottom, this.w, this.bottom,15,15,0,0);
    }
  
    this.update = function() {
      this.x -= this.speed;
    }
  
    this.offscreen = function() {
      if (this.x < -this.w) {
        return true;
      } else {
        return false;
      }
    }
  
  
  }