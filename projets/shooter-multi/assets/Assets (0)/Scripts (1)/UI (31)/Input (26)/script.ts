class InputBehavior extends Sup.Behavior {
  
  static min : number = 2;
  static max : number = 10;

  public text : string = "";

  awake() {
  }

  reset() {
    this.text = "";
    this.actor.textRenderer.setText(this.text);
  }

  update() {
    const enteredText : string = Sup.Input.getTextEntered();
    if(enteredText && this.text.length < InputBehavior.max) {
      this.text += enteredText;
      this.actor.textRenderer.setText(this.text);
    }
    
    if(Sup.Input.wasKeyJustPressed("BACK_SPACE") && this.text.length > 0 ) {
      this.text = this.text.substring(0, this.text.length-1);
      this.actor.textRenderer.setText(this.text);
    }
    
  }
}
Sup.registerBehavior(InputBehavior);
