class JeuBehavior extends Sup.Behavior {
  
  playersContainer : Sup.Actor;
  players = {}
  
  awake() {
    this.playersContainer = Sup.getActor("PlayersContainer");
    Socket.on("playerJoin",(data) => {
      let Actor : Sup.Actor = this.createActor(data.id);
      Actor.arcadeBody2D.warpPosition( new Sup.Math.Vector3( data.position.x,  data.position.y , -4 ));
      
      // On ajoute le
      this.players[data.id] = {
        actor : Actor,
        id : data.id,
        position : data.position
      };
    });
    
    Socket.on("initGame",(data) => {
      let Actor : Sup.Actor = this.createActor(Pseudo);
      
      Actor.arcadeBody2D.warpPosition( new Sup.Math.Vector3( data.position.x,  data.position.y , -4 ));
      Sup.log(Actor.getPosition());
      Sup.getActor("Camera").addBehavior(CameraBehavior);
      Actor.addBehavior(PlayerBehavior);
      
      for(const k in data.players) {
        const v = data.players[k];
        if(v.login != null) {
          let playerActor : Sup.Actor = this.createPlayer(v.id,v.position);
          this.players[v.id] = {
            actor : playerActor,
            position : v.position,
            id : v.id
          };
        }
      }
    });

    Socket.on("playerExit",(data) => {
      this.players[data.id].actor.destroy();
      delete this.players[data.id];
    });
    
    Socket.on("playerPosition",(data) => {
      let focus = this.players[data.id];
      if(focus) {
        this.players[data.id].actor.arcadeBody2D.warpPosition(new Sup.Math.Vector3(data.position.x,data.position.y,-4));
      }
    });
  }
  
  createActor(name: string) : Sup.Actor {
    let Actor : Sup.Actor = Sup.appendScene("Assets/Sprites/Player/Prefab",this.playersContainer)[0];
    Actor.setName(name);
    return Actor;
  }

  createPlayer(name: string,position: {x : number, y: number}) : Sup.Actor {
    let Actor : Sup.Actor = this.createActor("player_"+name);
    Actor.arcadeBody2D.warpPosition( new Sup.Math.Vector3( position.x , position.y , -4 ));
    return Actor;
  }

}
Sup.registerBehavior(JeuBehavior);