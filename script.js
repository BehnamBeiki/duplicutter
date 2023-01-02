"use strict";
let bg,
  start,
  info,
  warning,
  play,
  ground,
  player,
  npc,
  tween,
  tweenNpc,
  select = 0,
  round = 0,
  pool = [],
  poolDeleted = [],
  poolNpc = [];

class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: "preloader", active: true });
  }

  preload() {
    this.load.image("bg", "assets/space.png");
    this.load.image("play_button", "assets/play_button.png");
    this.load.image("online_button", "assets/online_button.png");
    this.load.image("king", "assets/group_1000.png");
    this.load.image("dragon", "assets/group_1033.png");
    this.load.image("wolf", "assets/group_1034.png");
    this.load.image("bear", "assets/group_1035.png");
    this.load.image("snake", "assets/group_1036.png");
    this.load.image("panter", "assets/group_1037.png");
    this.load.image("staff", "assets/group_1038.png");
    this.load.image("sheild", "assets/group_1039.png");
    this.load.image("flame", "assets/group_1040.png");
    this.load.image("fruit", "assets/group_1041.png");
    this.load.image("ogre", "assets/group_1043.png");
    this.load.image("centaur", "assets/group_1044.png");
    this.load.image("troll", "assets/group_1045.png");
    this.load.image("devil", "assets/group_1067.png");
  }

  create() {
    this.scene.start("mainmenu");
  }
}

class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: "mainmenu", active: true });
  }

  create() {
    bg = this.add.image(480, 360, "bg");

    let card1 = ["king", "dragon", "wolf", "bear", "snake", "panter", "staff"];
    let card2 = [
      "sheild",
      "flame",
      "fruit",
      "ogre",
      "centaur",
      "troll",
      "devil",
    ];
    let left = 0;
    let left1 = 0;
    let j = 120;

    for (let i = 0; i <= 6; i++) {
      let cards1 = this.add.image((left += j), 120, card1[i]);
      cards1.setInteractive();
      cards1.name = "cards1-" + i;

      let cards2 = this.add.image((left1 += j), 320, card2[i]);
      cards2.setInteractive();
      cards2.name = "cards2-" + i;

      cards1.on("clicked", this.clickHandler, this);
      cards2.on("clicked", this.clickHandler, this);
    }

    this.input.on(
      "gameobjectup",
      function (pointer, gameObject) {
        gameObject.emit("clicked", gameObject);
      },
      this
    );

    start = this.add.image(480, 650, "online_button").setInteractive();
    start.on(
      "pointerup",
      function () {
        this.scene.start("game");
        select = 0;
      },
      this
    );

    info = this.add
      .text(this.cameras.main.width / 2, 500, "", {
        fontFamily: "Humongous of Eternity St",
        fontSize: 24,
        fontStyle: "bold",
        color: "#ede9e0",
      })
      .setShadow(1.5, 1, "#965515", 1)
      .setOrigin(0.5);

    warning = this.add
      .text(this.cameras.main.width / 2, 570, "", {
        fontFamily: "Humongous of Eternity St",
        fontSize: 24,
        fontStyle: "bold",
        color: "#ede9e0",
      })
      .setShadow(1.5, 1, "#965515", 1)
      .setOrigin(0.5);

    this.input.mouse.disableContextMenu();
  }

  update() {
    info.setText(` You have selected ${select} cards`);

    if (select === 10) {
      warning.setText(`You're good to go`);
      start.setVisible(true);
    } else if (select < 10) {
      warning.setText(`Please add ${10 - select} cards`);
      start.setVisible(false);
    } else if (select > 10) {
      warning.setText(`Please remove ${Math.abs(10 - select)} cards`);
      start.setVisible(false);
    }
  }

  clickHandler(cards) {
    if (cards.isTinted == 0) {
      cards.setTint(0x008080);
      select++;
      pool[pool.length] = cards.texture;
    } else {
      cards.clearTint();
      select--;
      poolDeleted = pool.splice(pool.indexOf(cards.texture), 1);
    }
  }
}

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "game", active: false });
  }

  create() {
    let cards = [
      "king",
      "dragon",
      "wolf",
      "bear",
      "snake",
      "panter",
      "staff",
      "sheild",
      "flame",
      "fruit",
      "ogre",
      "centaur",
      "troll",
      "devil",
    ];
    poolNpc = Phaser.Utils.Array.Shuffle(cards).slice(4);

    ground = this.add.image(480, 300, "bg");

    info = this.add
      .text(this.cameras.main.width / 2, 580, "", {
        fontFamily: "Humongous of Eternity St",
        fontSize: 24,
        fontStyle: "bold",
        color: "#ede9e0",
      })
      .setShadow(1.5, 1, "#965515", 1)
      .setOrigin(0.5);

    start = this.add
      .image(480, 650, "online_button")
      .setInteractive()
      .setVisible(false);
    start.once(
      "pointerup",
      function () {
        this.scene.start("gameover");
        round = 0;
        pool = [];
        poolNpc = [];
      },
      this
    );

    play = this.add.image(480, 650, "play_button").setInteractive();
    play.on(
      "pointerup",
      function () {
        player = this.add.image(480, 480, pool[Math.floor(Math.random() * 10)]);

        if (ground.texture !== player.texture) {
          tween = this.tweens.add({
            targets: player,
            y: 300,
            ease: "Power1",
            duration: 500,
            delay: 100,
            onStart: onStartHandler,
            onComplete: onCompleteHandler,
            onCompleteParams: [player],
          });

          npc = this.add
            .image(480, 120, poolNpc[Math.floor(Math.random() * 10)])
            .setVisible(false);

          if (player.texture !== npc.texture) {
            tweenNpc = this.tweens.add({
              targets: npc,
              y: 300,
              ease: "Power1",
              duration: 500,
              delay: 1100,
              onComplete: onCompleteHandler1,
              onCompleteParams: [npc],
            });
          } else {
            start.setVisible(true);
            npc.setVisible(true);
            play.setVisible(false);
            this.add
              .text(this.cameras.main.width / 2, 470, `YOU LOSE`, {
                fontFamily: "Humongous of Eternity St",
                fontSize: 24,
                fontStyle: "bold",
                color: "#ede9e0",
              })
              .setShadow(1.5, 1, "#965515", 1)
              .setOrigin(0.5);
          }
        } else {
          start.setVisible(true);
          play.setVisible(false);
          this.add
            .text(this.cameras.main.width / 2, 120, `YOU WIN`, {
              fontFamily: "Humongous of Eternity St",
              fontSize: 24,
              fontStyle: "bold",
              color: "#ede9e0",
            })
            .setShadow(1.5, 1, "#965515", 1)
            .setOrigin(0.5);
        }
      },
      this
    );

    function onStartHandler(tween, targets, cards) {
      ground.texture = player.texture;
      play.setVisible(false);
      round++;
    }

    function onCompleteHandler(tween, targets, cards) {
      npc.setVisible(true);
    }

    function onCompleteHandler1(tween, targets, cards1) {
      ground.texture = npc.texture;
      play.setVisible(true);
    }
  }

  update() {
    info.setText(` Round ${round}`);
  }
}

class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameover", active: false });
  }

  create() {
    ground = this.add.image(480, 300, "bg");
    start = this.add.image(480, 650, "online_button").setInteractive();

    info = this.add
      .text(this.cameras.main.width / 2, 300, "", {
        fontFamily: "Humongous of Eternity St",
        fontSize: 24,
        fontStyle: "bold",
        color: "#ede9e0",
      })
      .setShadow(1.5, 1, "#965515", 1)
      .setOrigin(0.5);

    info.setText(`            Written by :


           Behnam Beiki

          -VirtualLich-
    
  behnam_beiki@yahoo.com
    
    `);

    start.on(
      "pointerup",
      function () {
        this.scene.start("preloader");
        select = 0;
      },
      this
    );
  }
}

let config = {
  type: Phaser.AUTO,
  width: 960,
  height: 720,
  // backgroundColor: '#000000',
  scene: [Preloader, MainMenu, Game, GameOver],
};

let game = new Phaser.Game(config);
