class PlayerBehavior extends Sup.Behavior {
  
  speed : number = 0.04;

  awake() {
    Sup.log("Player behavior awake!");
  }

  update() {
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    // Movement
    let direction : Sup.Math.Vector2 = new Sup.Math.Vector2();
    let angle : number ;
    let moving = true;
    if(Sup.Input.isKeyDown("S")|| Sup.Input.isKeyDown("DOWN")) {
      angle = -90;
	  	if(Sup.Input.isKeyDown("D")|| Sup.Input.isKeyDown("RIGHT")) {
      	angle = -45;
    	}else if(Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")|| Sup.Input.isKeyDown("LEFT")) {
      	angle = -135;
    	}
    } else if(Sup.Input.isKeyDown("Z") || Sup.Input.isKeyDown("W")|| Sup.Input.isKeyDown("UP")) {
      angle = 90;
	  	if(Sup.Input.isKeyDown("D")|| Sup.Input.isKeyDown("RIGHT")) {
      	angle = 45;
    	}else if(Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")|| Sup.Input.isKeyDown("LEFT")) {
      	angle = 135;
    	}
    }
    else if(Sup.Input.isKeyDown("D")|| Sup.Input.isKeyDown("RIGHT")) {
      angle = 0;
    }else if(Sup.Input.isKeyDown("Q") || Sup.Input.isKeyDown("A")|| Sup.Input.isKeyDown("LEFT")) {
      angle = 180;
    }
	else{
		moving = false;
	}
	if(moving){
		direction.x = Math.cos(Sup.Math.toRadians(angle))*this.speed;
		direction.y = Math.sin(Sup.Math.toRadians(angle))*this.speed;

	}
    
    this.actor.arcadeBody2D.setVelocity(direction);
    //this.actor.move(direction);
    
    // Look At
    let mouse = Sup.Input.getMousePosition().unproject(Sup.getActor("Camera").camera);
    let dx = mouse.x - this.actor.getX();
    let dy = mouse.y - this.actor.getY();
    this.actor.setLocalEulerAngles(0,0, Math.atan2(dy, dx) - Sup.Math.toRadians(-90) );
    

    
/*  | Mety : ça marche presque bien sauf que le centre de rotation est excentré par rapport au personnage
 *  |        et que le personnage tourne son épaule vers la souris
 *  V        Sinon c'est impeccable ^^'
 */
//     let mousePosition = Sup.Input.getMousePosition();
//     let screenSize = Sup.Input.getScreenSize();
//     let cameraPosition = Sup.getActor("Camera").getLocalPosition();
//     let actorPosition = this.actor.getLocalPosition();
    
//     mousePosition.x *= 60 / 2 * screenSize.x / screenSize.y;
//     mousePosition.x += cameraPosition.x;
    
//     mousePosition.y *= 40 / 2;
//     mousePosition.y += cameraPosition.y;
    
//     let xDiff: number;
//     let yDiff: number;
//     xDiff = mousePosition.x - actorPosition.x;
//     yDiff = mousePosition.y - actorPosition.y;
    
    
//     let orientationAngle: number;
//     let orientation = new Sup.Math.Quaternion(0, 0, 0, 1);
//     orientationAngle = Math.atan2(yDiff, xDiff);

//     orientation.setFromYawPitchRoll(0, 0, orientationAngle );
//     this.actor.setOrientation(orientation);
    
    Socket.emit("playerMove",{
      position : {
        x : this.actor.getX(),
        y : this.actor.getY()
      }
    });
    
  }
}
Sup.registerBehavior(PlayerBehavior);
