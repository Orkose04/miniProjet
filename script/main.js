class Game {
  constructor() {
    this.score = 0;
    this.clickValue = 1;
    this.perSecondValue = 0;
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

    this.saveButton = document.getElementById("save-button");
    this.loadButton = document.getElementById("load-button");

    this.clickButton.addEventListener("click", () => this.click());
    this.saveButton.addEventListener("click", () => this.saveGame());
    this.loadButton.addEventListener("click", () => this.loadGame());

    prestigeButton.addEventListener("click", () => this.prestige());

    // this.addClickUpgrade(
    //   new Upgrade("Cursor", "Increases click value by 1", 10, 1.5, () => {
    //     this.clickValue += 1;
    //   })
    // );

    // this.addClickUpgrade(
    //   new Upgrade(
    //     "Super Cursor",
    //     "Increases click value by 5",
    //     100,
    //     1.7,
    //     () => {
    //       this.clickValue += 5;
    //     }
    //   )
    // );

    // this.addClickUpgrade(
    //   new Upgrade("Banana", "Banana is truth", 1, 2, () => {
    //     this.clickValue += 10;
    //   })
    // );

    // this.addAutoUpgrade(
    //   new Upgrade(
    //     "Auto-Clicker",
    //     "Generates 1 point per second",
    //     50,
    //     1.5,
    //     () => {
    //       this.perSecondValue += 1;
    //     }
    //   )
    // );

    // this.addAutoUpgrade(
    //   new Upgrade(
    //     "Mega Auto-Clicker",
    //     "Generates 5 points per second",
    //     200,
    //     1.7,
    //     () => {
    //       this.perSecondValue += 5;
    //     }
    //   )
    // );

    this.addClickUpgrade(
      new Upgrade(
        "Machette Affûtée",
        "Une lame plus tranchante pour une récolte plus rapide",
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
        500,
        1.7,
        () => {
          this.clickValue += 3;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade(
        "Sac à Dos à Bananes",
        "Transportez plus de bananes pendant la récolte",
        1,
        2000,
        2,
        () => {
          this.clickValue += 5;
        }
      )
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Singe Serviable",
        "Un assistant singe qui cueille des bananes pour vous",
        1,
        1000,
        1.8,
        () => {
          this.perSecondValue += 1;
        }
      )
    );

    this.updatePrestigeDisplay;

    this.setupTooltip();
    this.startAutoClick();

    this.updateScore();
    this.renderUpgrades();

    // setInterval(() => this.autoClick(), 1000);
  }

  click() {
    this.score += this.clickValue * this.prestigeMultiplier;
    this.updateScore();
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
    scoreElement.textContent = Math.floor(displayScore).toLocaleString();
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
    upgrades.forEach((upgrade) => {
      const button = document.createElement("button");
      const img = new Image();
      img.src = `../assets/upgrade/${upgrade.name
        .toLowerCase()
        .replace(" ", "-")}.png`;

      button.classList.add("upgrade-button", "button");
      button.innerHTML = `<div> <h3>${
        upgrade.name
      }</h3> <p> - Cost: ${Math.floor(upgrade.cost)} </p> </div>`;

      button.appendChild(img);

      button.dataset.description = upgrade.description; // Store description in data attribute

      button.addEventListener("click", () => this.buyUpgrade(upgrade));
      this.addTooltipListeners(button);
      container.appendChild(button);
    });
  }

  prestige() {
    if (this.score >= this.prestigeRequirement) {
      this.prestigeMultiplier += 0.1; // 10% increase per prestige point
      this.score = 0;
      this.clickValue = 1;
      this.perSecondValue = 0;
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
}

class Upgrade {
  constructor(name, description, world, cost, costMultiplier, effect) {
    this.name = name;
    this.description = description;
    this.world = world;
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
