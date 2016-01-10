class CameraBehavior extends Sup.Behavior {
  
  player : Sup.Actor;

  awake() {
    this.player = Sup.getActor(Pseudo);
  }

  update() {
    this.actor.setPosition(this.player.getX(),this.player.getY(),this.actor.getZ());
  }
}
Sup.registerBehavior(CameraBehavior);
