class ButtonBehavior extends Sup.Behavior {
  
  isHover : boolean = false; 

  awake() {
    this.actor["click"] = undefined;
    this.actor["hover"] = undefined;
    this.actor["unhover"] = undefined;
  }
  
  private call(action: string) : void {
    if(this.actor[action]) {
      this.actor[action]();
    }
  }

  update() {
    
    if(UIRay.intersectActor(this.actor,false).length > 0) {
      if(!this.isHover) {
        this.call("hover");
        this.isHover = true;
      }
      
      if(Sup.Input.wasMouseButtonJustPressed(0)) {
        this.call("click");
      }
    }
    else {
      if(this.isHover) {
        this.isHover = false;
        this.call("unhover");
      }
    }
    
  }
}
Sup.registerBehavior(ButtonBehavior);
