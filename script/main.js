class Game {
  constructor() {
    this.score = 0;
    this.clickValue = 1;
    this.perSecondValue = 0;
    this.clickUpgrades = [];
    this.autoUpgrades = [];
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
    this.saveButton = document.getElementById("save-button");
    this.loadButton = document.getElementById("load-button");

    this.clickButton.addEventListener("click", () => this.click());
    this.saveButton.addEventListener("click", () => this.saveGame());
    this.loadButton.addEventListener("click", () => this.loadGame());

    this.addClickUpgrade(
      new Upgrade("Cursor", "Increases click value by 1", 10, 1.5, () => {
        this.clickValue += 1;
      })
    );

    this.addClickUpgrade(
      new Upgrade(
        "Super Cursor",
        "Increases click value by 5",
        100,
        1.7,
        () => {
          this.clickValue += 5;
        }
      )
    );

    this.addClickUpgrade(
      new Upgrade("Banana", "Banana is truth", 1, 2, () => {
        this.clickValue += 10;
      })
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Auto-Clicker",
        "Generates 1 point per second",
        50,
        1.5,
        () => {
          this.perSecondValue += 1;
        }
      )
    );

    this.addAutoUpgrade(
      new Upgrade(
        "Mega Auto-Clicker",
        "Generates 5 points per second",
        200,
        1.7,
        () => {
          this.perSecondValue += 5;
        }
      )
    );

    this.setupTooltip();

    this.updateScore();
    this.renderUpgrades();

    setInterval(() => this.autoClick(), 1000);
  }

  click() {
    this.score += this.clickValue;
    this.updateScore();
  }

  autoClick() {
    this.score += this.perSecondValue;
    this.updateScore();
  }

  updateScore() {
    const scoreElement = document.getElementById("score");
    const oldScore = parseInt(scoreElement.textContent);
    const newScore = Math.floor(this.score);

    if (newScore !== oldScore) {
      scoreElement.textContent = newScore;
      scoreElement.classList.remove("updated");
      void scoreElement.offsetWidth; // Trigger reflow
      scoreElement.classList.add("updated");
    }

    this.perSecondDisplay.textContent = `${this.perSecondValue.toFixed(
      1
    )} par second`;
  }

  updateScoreDisplay() {
    const scoreElement = document.getElementById("score");
    const newScore = Math.floor(this.score).toString().padStart(10, "0");
    const oldScore = scoreElement.textContent.padStart(10, "0");

    scoreElement.innerHTML = "";

    for (let i = 0; i < 10; i++) {
      const digitSpan = document.createElement("span");
      digitSpan.className = "score-digit";
      digitSpan.textContent = newScore[i];

      if (newScore[i] !== oldScore[i]) {
        digitSpan.classList.add("updated");
      }

      scoreElement.appendChild(digitSpan);
    }

    // Remove leading zeros
    while (
      scoreElement.firstChild.textContent === "0" &&
      scoreElement.children.length > 1
    ) {
      scoreElement.removeChild(scoreElement.firstChild);
    }
  }

  updateScore() {
    this.updateScoreDisplay();

    this.perSecondDisplay.textContent = `${this.perSecondValue.toFixed(
      1
    )} par seconde`;
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
      button.textContent = `${upgrade.name} - Cost: ${Math.floor(
        upgrade.cost
      )}`;
      button.appendChild(img);
      button.dataset.description = upgrade.description; // Store description in data attribute
      button.addEventListener("click", () => this.buyUpgrade(upgrade));
      this.addTooltipListeners(button);
      container.appendChild(button);
    });
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

      this.loadUpgradeCategory(gameData.clickUpgrades, this.clickUpgrades);
      this.loadUpgradeCategory(gameData.autoUpgrades, this.autoUpgrades);

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
  constructor(name, description, cost, costMultiplier, effect) {
    this.name = name;
    this.description = description;
    this.cost = cost;
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
