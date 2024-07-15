let cpcBtn = document.getElementById("cpcBtn");
let cpsBtn = document.getElementById("cpsBtn");

document.querySelector(".ongletNav").addEventListener("click", () => {
  if (cpcBtn.className == "activeOnglet") {
    cpcBtn.className = "desactiveOnglet";
    cpsBtn.className = "activeOnglet";
    document
      .querySelector(".bigShopCPC")
      .setAttribute("style", "display:none;");
    document
      .querySelector(".bigShopCPS")
      .setAttribute("style", "display:block;");
  } else {
    cpcBtn.className = "activeOnglet";
    cpsBtn.className = "desactiveOnglet";
    document
      .querySelector(".bigShopCPC")
      .setAttribute("style", "display:block;");
    document
      .querySelector(".bigShopCPS")
      .setAttribute("style", "display:none;");
  }
});
