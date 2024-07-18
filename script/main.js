class Game {
  constructor() {
    this.score = 0;
    this.clickValue = 1;
    this.perSecondValue = 0;
    this.currentWorld = 1;
    this.currentLevel = 1;
    this.clipPath = {
      1: {
        1: "polygon(50% 44%, 68% 55%, 50% 65%, 32% 55%)",
        2: "polygon(68% 34%, 85% 46%, 50% 65%, 32% 56%)",
        3: "polygon(67% 35%, 85% 46%, 33% 75%, 15% 65%)",
        4: "polygon(15% 65%, 68% 34%, 85% 46%, 68% 55%, 84% 65%, 67% 74%, 50% 65%, 33% 75%)",
      },
      2: {
        1: "polygon(50% 44%, 68% 55%, 50% 65%, 32% 55%)",
        2: "polygon(68% 34%, 85% 46%, 50% 65%, 32% 56%)",
        3: "polygon(68% 36%, 85% 47%, 68% 56%, 85% 67%, 67% 76%, 32% 57%)",
        4: "polygon(15% 65%, 68% 34%, 85% 46%, 68% 55%, 84% 65%, 67% 74%, 50% 65%, 33% 75%)",
      },
    };
    this.clickUpgrades = [];
    this.autoUpgrades = [];
    this.prestigeMultiplier = 1;
    this.prestigeRequirement = 1000;
    this.lastUpdateTime = Date.now();
    this.animationFrameId = null;
    this.init();
  }

  init() {
    this.clickButton = document.getElementById("click-button");
    this.scoreDisplay = document.getElementById("score");
    this.perSecondDisplay = document.getElementById("per-second");
    this.clickUpgradesContainer = document.getElementById(
      "click-upgrades-container"
    );
    this.autoUpgradesContainer = document.getElementById(
      "auto-upgrades-container"
    );

    const prestigeButton = document.getElementById("prestige-button");
    prestigeButton.dataset.description = `Requirement: ${this.prestigeRequirement}`;
    this.addTooltipListeners(prestigeButton);

    this.worldBtn1 = document.getElementById("worldBtn1");
    this.worldBtn2 = document.getElementById("worldBtn2");
    this.worldBtn3 = document.getElementById("worldBtn3");

    this.saveButton = document.getElementById("save-button");
    this.loadButton = document.getElementById("load-button");

    this.clickButton.addEventListener("click", (event) => {
      this.updateCounter(event);
      this.click();
    });

    this.worldBtn1.addEventListener("click", () => this.showWorld(1));
    this.worldBtn2.addEventListener("click", () => this.showWorld(2));
    this.worldBtn3.addEventListener("click", () => this.showWorld(3));

    this.saveButton.addEventListener("click", () => this.saveGame());
    this.loadButton.addEventListener("click", () => this.loadGame());

    prestigeButton.addEventListener("click", () => this.prestige());

    this.addClickUpgrade(
      new Upgrade(
        "Machette Affûtée",
        "Une lame plus tranchante pour une récolte plus rapide",
        1,
        1,
        100,
        1.5,
        () => {
          this.clickValue += 1;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Gants Robustes",
        "Protégez vos mains et saisissez plus de bananes",
        1,
        3,
        500,
        1.7,
        () => {
          this.clickValue += 3;
        }
      )
    );

    // this.addClickUpgrade(
    //   new Upgrade(
    //     "Sac à Dos à Bananes",
    //     "Transportez plus de bananes pendant la récolte",
    //     1,
    //     4,
    //     2000,
    //     2,
    //     () => {
    //       this.clickValue += 5;
    //     }
    //   )
    // );

    this.addAutoUpgrade(
      new Upgrade(
        "Singe Serviable",
        "Un assistant singe qui cueille des bananes pour vous",
        1,
        2,
        1000,
        1.8,
        () => {
          this.perSecondValue += 1;
        }
      )
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Système d'Arrosage",
        "Arrosage automatisé pour des bananiers en meilleure santé",
        1,
        4,
        5000,
        2.2,
        () => {
          this.perSecondValue += 3;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Perche de Récolte",
        "Atteignez facilement les branches plus hautes",
        2,
        1,
        50000,
        1.6,
        () => {
          this.clickValue += 10;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Brouette à Bananes",
        "Transportez plus de bananes en une seule fois",
        2,
        3,
        200000,
        1.9,
        () => {
          this.clickValue += 25;
        }
      )
    );

    // this.addClickUpgrade(
    //   new Upgrade(
    //     "Machette Dorée",
    //     "Une lame luxueuse pour une récolte efficace",
    //     2,
    //     4,
    //     750000,
    //     2.3,
    //     () => {
    //       this.clickValue += 50;
    //     }
    //   )
    // );

    this.addAutoUpgrade(
      new Upgrade(
        "Equipe de Cueilleurs de Bananes",
        "Engagez une équipe de cueilleurs de bananes qualifiés",
        2,
        2,
        500000,
        2,
        () => {
          this.perSecondValue += 15;
        }
      )
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Machine de Tri des Bananes",
        "Trie et emballe automatiquement les bananes",
        2,
        4,
        2000000,
        2.5,
        () => {
          this.perSecondValue += 40;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Bras de Récolte Cybernétique",
        " Une prothèse high-tech pour une cueillette ultra-rapide",
        3,
        1,
        50000000,
        1.8,
        () => {
          this.clickValue += 200;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Gants de Téléportation",
        "Transportez instantanément les bananes cueillies vers le stockage",
        3,
        3,
        200000000,
        2.1,
        () => {
          this.clickValue += 500;
        }
      )
    );

    // this.addClickUpgrade(
    //   new Upgrade(
    //     "Machette Distordant le Temps",
    //     "Tranchez le temps lui-même pour récolter plus rapidement",
    //     3,
    //     4,
    //     1000000000,
    //     2.7,
    //     () => {
    //       this.clickValue += 1000;
    //     }
    //   )
    // );

    this.addAutoUpgrade(
      new Upgrade(
        "Drones de Récolte de Bananes",
        "Une flotte de drones qui cueillent des bananes 24h/24 et 7j/7",
        3,
        2,
        500000000,
        2.3,
        () => {
          this.perSecondValue += 200;
        }
      )
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Accélérateur Génétique de Bananes",
        "Accélère la croissance des bananes à des niveaux astronomiques",
        3,
        4,
        250000000,
        3,
        () => {
          this.perSecondValue += 500;
        }
      )
    );

    // this.addClickUpgrade(
    //   new Upgrade("Cheat", "", 1, 1, 1, 1, () => {
    //     this.clickValue += 10000;
    //   })
    // );

    this.updatePrestigeDisplay();

    this.setupTooltip();
    this.startAutoClick();

    this.updateScore();
    this.renderUpgrades();
    this.updateWorld();
  }

  click() {
    this.score += this.clickValue * this.prestigeMultiplier;
    this.updateScore();
  }

  updateCounter(event) {
    const counter = document.createElement("div");
    counter.textContent = `+${this.clickValue}`;
    counter.style.setProperty("--x", `${event.offsetX}px`);
    counter.style.setProperty("--y", `${event.offsetY}px`);

    counter.classList.add("pop-up");

    counter.addEventListener("animationend", () => {
      counter.remove();
    });

    this.clickButton.appendChild(counter);
  }

  smoothAutoClick() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdateTime) / 1000; //conversion en seconde
    this.lastUpdateTime = now;

    // Calculate the score increase for this frame
    const scoreIncrease =
      this.perSecondValue * this.prestigeMultiplier * deltaTime;
    this.score += scoreIncrease;

    this.updateScore();

    // Request the next animation frame
    this.animationFrameId = requestAnimationFrame(() => this.smoothAutoClick());
  }

  startAutoClick() {
    if (!this.animationFrameId) {
      this.lastUpdateTime = Date.now();
      this.smoothAutoClick();
    }
  }

  stopAutoClick() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  updateScore() {
    const displayScore = Math.floor(this.score);
    this.updateScoreDisplay(displayScore);
    this.perSecondDisplay.textContent = `${this.perSecondValue.toFixed(
      1
    )} par seconde`;
  }

  updateScoreDisplay(displayScore) {
    const scoreElement = document.getElementById("score");
    // Update the score display
    scoreElement.textContent = `${Math.floor(
      displayScore
    ).toLocaleString()} Bananas`;
  }

  addClickUpgrade(upgrade) {
    this.clickUpgrades.push(upgrade);
  }

  addAutoUpgrade(upgrade) {
    this.autoUpgrades.push(upgrade);
  }

  renderUpgrades() {
    this.renderUpgradeCategory(this.clickUpgrades, this.clickUpgradesContainer);
    this.renderUpgradeCategory(this.autoUpgrades, this.autoUpgradesContainer);
  }

  renderUpgradeCategory(upgrades, container) {
    container.innerHTML = "";
    const worldUpgrades = upgrades.filter(
      (upg) => upg["world"] === this.currentWorld
    );
    worldUpgrades.forEach((upgrade) => {
      const button = document.createElement("button");
      const img = new Image();
      img.src = `../assets/upgrades/${this.replaceAccents(upgrade.name)
        .toLowerCase()
        .replace(" ", "-")}.png`;

      button.classList.add("upgrade-button", "button");
      button.innerHTML = `<div> <h3>${
        upgrade.name
      }</h3> <p> - Cost: ${Math.floor(upgrade.cost)} </p> </div>`;

      button.appendChild(img);

      button.dataset.description = upgrade.description; // Store description in data attribute

      if (this.currentLevel < (upgrade.world - 1) * 4 + upgrade.tier) {
        button.classList.add("locked");

        const lockedImg = new Image();
        lockedImg.src = `../assets/locked.png`;
        lockedImg.className = "locked-image";

        // button.appendChild(lockedImg);
      }

      button.addEventListener("click", () => this.buyUpgrade(upgrade));
      this.addTooltipListeners(button);
      container.appendChild(button);
    });
  }

  updateWorld() {
    const overlay = document.getElementById("overlay");
    const level = this.getLevelOutput(this.currentLevel, this.currentWorld);
    let worldImg = document.getElementById("world-image");
    worldImg.src =
      `../assets/world/world` + this.currentWorld + "-" + level + ".png";

    overlay.style.setProperty(
      "--clip-path",
      `${
        this.clipPath[this.currentWorld][
          !(this.currentLevel % 4) ? 4 : this.currentLevel % 4
        ]
      }`
    );

    let availableUpgrades = this.clickUpgrades
      .concat(this.autoUpgrades)
      .sort((a, b) => {
        a.level - b.level;
      });
    console.log(availableUpgrades);

    overlay.addEventListener("mouseenter", () => {
      worldImg.src =
        `../assets/world/world` + this.currentWorld + "-" + level + "h.png";
    });

    overlay.addEventListener("mouseleave", () => {
      worldImg.src =
        `../assets/world/world` + this.currentWorld + "-" + level + ".png";
    });
  }

  getLevelOutput(currentLevel, currentWorld) {
    if (currentLevel <= 4) {
      return currentLevel;
    } else if (currentLevel <= 8) {
      if (currentWorld === 1) {
        return 4;
      } else if (currentWorld === 2) {
        return currentLevel - 4;
      }
    } else {
      return 4;
    }
  }

  showWorld(worldId) {
    const worldButtons = document.getElementsByClassName("world-button");
    for (let button of worldButtons) {
      button.classList.remove("active-world");
    }
    document.getElementById(`worldBtn${worldId}`).classList.add("active-world");

    this.currentWorld = worldId;

    this.updateWorld();
    this.renderUpgrades();
  }

  prestige() {
    if (this.score >= this.prestigeRequirement) {
      this.prestigeMultiplier += 0.1; // 10% increase per prestige point
      this.score = 0;
      this.clickValue = 1;
      this.perSecondValue = 0;
      this.currentWorld = 1;
      this.currentLevel = 1;
      this.prestigeRequirement *= 10; // Increase requirement for next prestige

      // Reset upgrades
      this.clickUpgrades.forEach((upgrade) => {
        upgrade.cost = upgrade.initialCost;
        upgrade.purchased = 0;
      });
      this.autoUpgrades.forEach((upgrade) => {
        upgrade.cost = upgrade.initialCost;
        upgrade.purchased = 0;
      });

      this.updateScore();
      this.renderUpgrades();
      this.updatePrestigeDisplay();
    }
  }

  updatePrestigeDisplay() {
    const multiplierElement = document.getElementById("prestige-multiplier");
    const prestigeButton = document.getElementById("prestige-button");
    multiplierElement.textContent = `x${this.prestigeMultiplier.toFixed(1)}`;
    prestigeButton.dataset.description = `Requirement = ${this.prestigeRequirement}`;
  }

  addTooltipListeners(element) {
    const tooltip = document.getElementById("tooltip");
    element.addEventListener("mouseenter", () => {
      tooltip.textContent = element.dataset.description;
      tooltip.style.opacity = "1";
    });
    element.addEventListener("mouseleave", () => {
      tooltip.style.opacity = "0";
    });
  }

  buyUpgrade(upgrade) {
    if (this.score >= upgrade.cost) {
      this.score -= upgrade.cost;
      if (!upgrade.purchased) {
        this.currentLevel++;
        this.updateWorld();
      }

      switch (this.currentLevel) {
        case 5:
          document.getElementById("worldBtn2").classList.remove("locked");
          break;
        case 9:
          alert("Thank you for playing!");
          break;
      }

      upgrade.purchase();
      upgrade.cost *= upgrade.costMultiplier;
      this.updateScore();
      this.renderUpgrades();
    }
  }

  saveGame() {
    const gameData = {
      score: this.score,
      clickValue: this.clickValue,
      perSecondValue: this.perSecondValue,
      currentLevel: this.currentLevel,
      clickUpgrades: this.clickUpgrades.map((upgrade) => ({
        name: upgrade.name,
        cost: upgrade.cost,
        purchased: upgrade.purchased,
      })),
      autoUpgrades: this.autoUpgrades.map((upgrade) => ({
        name: upgrade.name,
        cost: upgrade.cost,
        purchased: upgrade.purchased,
      })),
      prestigeMultiplier: this.prestigeMultiplier,
      prestigeRequirement: this.prestigeRequirement,
    };
    localStorage.setItem("clickerGameSave", JSON.stringify(gameData));
    alert("Game saved!");
  }

  loadGame() {
    const savedGame = localStorage.getItem("clickerGameSave");
    if (savedGame) {
      const gameData = JSON.parse(savedGame);
      this.score = gameData.score;
      this.clickValue = gameData.clickValue;
      this.perSecondValue = gameData.perSecondValue;

      this.currentLevel = gameData.currentLevel;

      this.prestigeMultiplier = gameData.prestigeMultiplier || 1;
      this.prestigeRequirement = gameData.prestigeRequirement || 1000000;

      this.loadUpgradeCategory(gameData.clickUpgrades, this.clickUpgrades);
      this.loadUpgradeCategory(gameData.autoUpgrades, this.autoUpgrades);

      this.updatePrestigeDisplay();

      this.stopAutoClick();
      this.startAutoClick();

      this.updateScore();
      this.renderUpgrades();
      alert("Game loaded!");
    } else {
      alert("No saved game found!");
    }
  }

  loadUpgradeCategory(savedUpgrades, currentUpgrades) {
    savedUpgrades.forEach((savedUpgrade, index) => {
      const upgrade = currentUpgrades[index];
      upgrade.cost = savedUpgrade.cost;
      upgrade.purchased = savedUpgrade.purchased;
      for (let i = 0; i < upgrade.purchased; i++) {
        upgrade.effect();
      }
    });
  }

  setupTooltip() {
    const tooltip = document.getElementById("tooltip");
    document.addEventListener("mousemove", (e) => {
      tooltip.style.left = e.pageX + 10 + "px";
      tooltip.style.top = e.pageY + 10 + "px";
    });
  }

  replaceAccents(str) {
    const withNoAccents = str.replace(
      /[àáäâãéèëêìíïîìóòöôùúũûñç]/g,
      function (char) {
        const replacements = {
          à: "a",
          á: "a",
          ä: "a",
          â: "a",
          ã: "a",
          é: "e",
          è: "e",
          ë: "e",
          ê: "e",
          ì: "i",
          í: "i",
          ï: "i",
          î: "i",
          ì: "i",
          ó: "o",
          ò: "o",
          ö: "o",
          ô: "o",
          ù: "u",
          ú: "u",
          ũ: "u",
          û: "u",
          ñ: "n",
          ç: "c",
        };
        return replacements[char] || char; // Fallback for non-mapped characters
      }
    );
    return withNoAccents;
  }
}

class Upgrade {
  constructor(name, description, world, tier, cost, costMultiplier, effect) {
    this.name = name;
    this.description = description;
    this.world = world;
    this.tier = tier;
    this.level = (this.world - 1) * 4 + this.tier;
    this.cost = cost;
    this.initialCost = cost;
    this.costMultiplier = costMultiplier;
    this.effect = effect;
    this.purchased = 0;
  }

  purchase() {
    this.purchased++;
    this.effect();
  }
}

const game = new Game();

function showUpgradeWindow(windowId, upgId) {
  const upgradeContainers = document.getElementsByClassName("upgrades");
  for (let upgradeContainer of upgradeContainers) {
    upgradeContainer.classList.remove("active");
  }
  document.getElementById(upgId).classList.add("active");

  const categories = document.getElementsByClassName("category");
  for (let category of categories) {
    category.classList.remove("activeWindow");
    category.classList.add("unactiveWindow");
  }
  const activeCategory = document.getElementById(windowId);
  activeCategory.classList.add("activeWindow");
  activeCategory.classList.remove("unactiveWindow");
}
