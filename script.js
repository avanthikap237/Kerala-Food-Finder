const dishes = [
  {name:"Malabar Chicken Biryani",type:"Non-veg",region:"Malabar",category:"Biryani",emoji:"🍗",description:"A fragrant rice dish associated with the Malabar region, layered with spiced chicken and aromatic rice.",detail:"Malabar biryani is especially associated with places such as Kozhikode and Thalassery. Recipes and rice varieties differ by household and locality."},
  {name:"Thalassery Biryani",type:"Non-veg",region:"Malabar",category:"Biryani",emoji:"🍚",description:"A well-known Malabar-style biryani traditionally prepared with short-grain jeerakasala rice.",detail:"Thalassery biryani is known for its distinctive rice and fragrant masala. This listing is an introduction, not a recipe."},
  {name:"Puttu and Kadala Curry",type:"Veg",region:"Across Kerala",category:"Breakfast",emoji:"🥥",description:"Steamed rice flour and coconut served with a hearty black chickpea curry.",detail:"A much-loved Kerala breakfast combination. Some versions of kadala curry use different spice blends and gravies."},
  {name:"Appam and Stew",type:"Veg",region:"Central Kerala",category:"Breakfast",emoji:"🥞",description:"Soft, lacy rice pancakes served with a mild coconut-milk vegetable stew.",detail:"Appam is made from a fermented batter. Stew can also be prepared with chicken, so check the menu when ordering."},
  {name:"Kerala Fish Curry",type:"Non-veg",region:"Travancore",category:"Seafood",emoji:"🐟",description:"Fish cooked in a tangy, spiced gravy, often with kudampuli in some regional styles.",detail:"Fish curry styles vary widely across Kerala. Ingredients and souring agents differ by coastal region and family tradition."},
  {name:"Karimeen Pollichathu",type:"Non-veg",region:"Central Kerala",category:"Seafood",emoji:"🐠",description:"Pearl spot fish coated with masala and traditionally wrapped in banana leaf before cooking.",detail:"Karimeen pollichathu is strongly associated with Kerala's backwater cuisine. Restaurant preparations may vary."},
  {name:"Erissery",type:"Veg",region:"Across Kerala",category:"Main course",emoji:"🎃",description:"A comforting curry often made with pumpkin or other vegetables, coconut and pulses.",detail:"Erissery is served in many Kerala meals, including festive sadya spreads. Recipes vary by community and season."},
  {name:"Pazham Pori",type:"Veg",region:"Across Kerala",category:"Snacks",emoji:"🍌",description:"Ripe banana slices dipped in a simple batter and fried until golden.",detail:"Also called ethakka appam, this popular tea-time snack is made using ripe plantain."},
  {name:"Unniyappam",type:"Veg",region:"Across Kerala",category:"Snacks",emoji:"🧁",description:"Small sweet fritters traditionally made with rice, jaggery, banana and coconut.",detail:"Unniyappam is a familiar Kerala snack and offering, with recipes differing across regions."},
  {name:"Beef Ularthiyathu",type:"Non-veg",region:"Central Kerala",category:"Main course",emoji:"🍛",description:"A richly spiced Kerala-style beef preparation cooked until the masala coats the pieces.",detail:"This dish is popular in several parts of Kerala. Ingredients and spice levels vary; this listing is for food discovery."},
  {name:"Idiyappam",type:"Veg",region:"Across Kerala",category:"Breakfast",emoji:"🍜",description:"Delicate steamed rice-flour string hoppers, often served with curry or coconut milk.",detail:"Idiyappam is enjoyed for breakfast or dinner and pairs with both vegetarian and non-vegetarian curries."},
  {name:"Kozhikode Halwa",type:"Veg",region:"Malabar",category:"Snacks",emoji:"🍮",description:"A glossy, chewy sweet that is a familiar speciality of Kozhikode's market food culture.",detail:"Kozhikode is well known for its halwa shops. Varieties include different colours, flavours and ingredients."}
];

const grid = document.getElementById("foodGrid");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const regionFilter = document.getElementById("regionFilter");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");
const dialog = document.getElementById("dishDialog");
const dialogContent = document.getElementById("dialogContent");
let quickCategory = "all";
const favourites = new Set();

function renderDishes() {
  const query = searchInput.value.trim().toLowerCase();
  const type = typeFilter.value;
  const region = regionFilter.value;
  const shown = dishes.filter(d => {
    const textMatch = `${d.name} ${d.description} ${d.region} ${d.category}`.toLowerCase().includes(query);
    return textMatch && (type === "all" || d.type === type) &&
      (region === "all" || d.region === region) &&
      (quickCategory === "all" || d.category === quickCategory);
  });

  grid.innerHTML = shown.map(d => `
    <article class="food-card">
      <div class="food-art" aria-hidden="true">${d.emoji}</div>
      <div class="food-info">
        <div class="card-meta">
          <span class="tag ${d.type === "Non-veg" ? "nonveg" : ""}">${d.type}</span>
          <span class="region">${d.region}</span>
        </div>
        <h3>${d.name}</h3>
        <p>${d.description}</p>
        <div class="card-actions">
          <button class="primary" data-action="details" data-name="${d.name}">View details</button>
          <button data-action="favourite" data-name="${d.name}">${favourites.has(d.name) ? "♥ Saved" : "♡ Save"}</button>
        </div>
      </div>
    </article>`).join("");

  resultCount.textContent = `${shown.length} dish${shown.length === 1 ? "" : "es"}`;
  emptyMessage.hidden = shown.length > 0;
}

grid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const dish = dishes.find(d => d.name === button.dataset.name);
  if (button.dataset.action === "favourite") {
    if (favourites.has(dish.name)) favourites.delete(dish.name);
    else favourites.add(dish.name);
    renderDishes();
  } else {
    dialogContent.innerHTML = `<div class="big-emoji">${dish.emoji}</div><span class="tag ${dish.type === "Non-veg" ? "nonveg" : ""}">${dish.type}</span><h3>${dish.name}</h3><p><strong>Region:</strong> ${dish.region} · <strong>Category:</strong> ${dish.category}</p><p>${dish.detail}</p>`;
    dialog.showModal();
  }
});

document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
searchInput.addEventListener("input", renderDishes);
typeFilter.addEventListener("change", renderDishes);
regionFilter.addEventListener("change", renderDishes);
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(item => item.classList.remove("active"));
    chip.classList.add("active");
    quickCategory = chip.dataset.quick;
    renderDishes();
  });
});
renderDishes();
