var joinGAME = function() {
  const behavior : InputBehavior = Sup.getActor("Input_login").getBehavior(InputBehavior);
  const pseudo : string = behavior.text;
  if(pseudo.length > InputBehavior.min && pseudo.length < InputBehavior.max) {
    // Event socket
    Sup.log("emit joinGame");
    Sup.getActor("Accueil").destroy();
    Pseudo = pseudo;
    Socket.emit("joinGame",{login : pseudo});
  }
  else {
    behavior.reset();
  }
}

class HUDBehavior extends Sup.Behavior {
  awake() {
    UIRay = new Sup.Math.Ray(this.actor.getPosition(),new Sup.Math.Vector3(0,0,-1));
    UIRay.setFromCamera(this.actor.camera,Sup.Input.getMousePosition());
    Sup.log("HUD Awake!");
  }
  
  start() {
    const BTN_Rejoindre : Sup.Actor = Sup.getActor("BTN_Rejoindre");
    BTN_Rejoindre["click"] = joinGAME;
  }

  update() {
    UIRay.setFromCamera(this.actor.camera,Sup.Input.getMousePosition());
    
    if(Sup.Input.wasKeyJustPressed("ENTER")) {
      joinGAME();
    }
  }
}
Sup.registerBehavior(HUDBehavior);
// PIKACUBE WAS HERE TO POLLUTE