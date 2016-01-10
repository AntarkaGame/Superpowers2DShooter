/// <reference path="typings/tsd.d.ts" />

import * as express from "express";
import * as socketIO from "socket.io";
import * as chalk from "chalk";

const cluster = require('express-cluster');

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

cluster(function(worker) {

    let app = express();
    let server = app.listen(4239,"0.0.0.0");
    let io = socketIO(server);

    const maxPlayers : number = 6;
    const spawnPoints = [
        { x : -3.4 , y : 1.4 },
        { x : -0.9 , y : -2.6 },
        { x : 4 , y : 0.07 }
    ]
    let users = {};

    io.on('connection',function(socket) {
        console.log(chalk.green(`user connected with id => ${socket.id}`));
        users[socket.id] = {
            id : socket.id,
            inGame : false,
            login : null,
            position : null
        }

        // Player join game
        socket.on('joinGame',(data) => {
            console.log(chalk.cyan(data.login+" join the game"));

            socket.join("game");
            users[socket.id].login = data.login;
            users[socket.id].inGame = true;
            const randomSpawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];

            let connectedUsers = clone(users);
            delete connectedUsers[socket.id];

            users[socket.id].position = randomSpawn;

            socket.emit("initGame",{
                position : randomSpawn,
                players : connectedUsers
            });

            socket.broadcast.to("game").emit("playerJoin",{
                id : socket.id,
                position : randomSpawn
            });

        });

        socket.on("playerMove",(data) => {
            if(users[socket.id].position !== data.position) {
                users[socket.id].position = data.position;
                io.to("game").emit("playerPosition",{
                    id : socket.id,
                    position : data.position
                });
            }
        });

        // Player leave game
        socket.on('disconnect',() => {
            const login : string = users[socket.id].login || socket.id;
            console.log(chalk.green(login+ " leave the game !"));
            if(users[socket.id].inGame) {
                io.to("game").emit("playerExit",{
                    id : socket.id
                });

                socket.leave("game");
            }
            delete users[socket.id];
        });

    });

    console.log("server started");

}, {
    count: 5,
    verbose: true,
    respawn : true
});
