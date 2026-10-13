// The Gray Area Kitchen
// Loads recipes from recipes.json, shows them as cards,
// and opens one recipe when its card is clicked.

// ---------- 1. Settings and page elements ----------

// What each "grayArea" value in recipes.json looks like on the page.
// Every label has words AND a circle drawn by the CSS (empty, half, or full),
// so it doesn't rely on color alone.
const GRAY_AREA_LABELS = {
	exact: { text: "Exact", className: "gray-exact" },
	some: { text: "Some gray area", className: "gray-some" },
	very: { text: "Lots of gray area", className: "gray-very" }
};

// The list of recipes. It starts empty and gets filled by loadRecipes().
let recipes = [];

// Grab the parts of index.html we need to change.
const listView = document.querySelector("#list-view");
const recipeList = document.querySelector("#recipe-list");
const statusMessage = document.querySelector("#status-message");
const detailView = document.querySelector("#detail-view");

// ---------- 2. Small helpers ----------

// Makes an HTML element with an optional class and text.
// Using textContent (not innerHTML) means anything you type in
// recipes.json shows up as plain text and can't break the page.
function makeElement(tag, className, text) {
	const element = document.createElement(tag);
	if (className) {
		element.className = className;
	}
	if (text) {
		element.textContent = text;
	}
	return element;
}

// Makes the little "Exact" / "Some gray area" / "Lots of gray area" badge.
function makeGrayAreaBadge(grayArea) {
	const label = GRAY_AREA_LABELS[grayArea];

	// If the value is missing or misspelled, say so instead of breaking.
	if (!label) {
		return makeElement("span", "gray-badge gray-unknown", "? Not set");
	}

	return makeElement("span", "gray-badge " + label.className, label.text);
}

// Shows a message above the cards (or hides it if the text is empty).
function showStatus(text) {
	statusMessage.textContent = text;
	statusMessage.hidden = !text;
}

// Turns "desserts" into "Desserts".
function capitalize(word) {
	if (!word) {
		return "";
	}
	return word.charAt(0).toUpperCase() + word.slice(1);
}

// ---------- 3. Load the recipes file ----------

async function loadRecipes() {
	try {
		const response = await fetch("recipes.json");

		// response.ok is false for errors like "404 file not found".
		if (!response.ok) {
			throw new Error("Could not find recipes.json (status " + response.status + ")");
		}

		const data = await response.json();
		recipes = data.recipes;

		if (!Array.isArray(recipes)) {
			throw new Error('recipes.json needs a "recipes" list');
		}

		renderRecipeCards(recipes);
	} catch (error) {
		// Shows the real problem in the browser's console (for you),
		// and a friendly message on the page (for the reader).
		console.error(error);
		showStatus("Sorry, the recipes couldn't load. Please refresh the page and try again.");
	}
}

// ---------- 4. Draw the recipe cards ----------

function renderRecipeCards(listToShow) {
	// Clear out any old cards first.
	recipeList.innerHTML = "";

	if (listToShow.length === 0) {
		showStatus("No recipes match. Try a different choice.");
		return;
	}

	showStatus("");

	listToShow.forEach(function (recipe) {
		// Remember where this recipe sits in the full list,
		// so the click handler knows which one to open.
		const index = recipes.indexOf(recipe);

		const item = makeElement("li");

		// The whole card is a real <button>, so it works with Tab + Enter.
		const card = makeElement("button", "recipe-card");
		card.type = "button";
		card.dataset.index = index;

		card.append(
			makeElement("span", "card-category", capitalize(recipe.category) || "No category"),
			makeElement("span", "card-name", recipe.name || "(Missing recipe name)"),
			makeElement("span", "card-blurb", recipe.blurb || "")
		);

		item.append(card);
		recipeList.append(item);
	});
}

// ---------- 5. Open and close one recipe ----------

function openRecipe(index) {
	const recipe = recipes[index];
	if (!recipe) {
		return;
	}

	detailView.innerHTML = "";

	const backButton = makeElement("button", "back-button", "← Back to recipes");
	backButton.type = "button";

	// tabindex -1 lets us move keyboard focus to the heading when the recipe opens.
	const title = makeElement("h2", "", recipe.name || "(Missing recipe name)");
	title.tabIndex = -1;

	const subtitle = makeElement("p", "detail-subtitle", capitalize(recipe.category) + ". " + (recipe.blurb || ""));

	// Ingredients: a checkbox, amount, ingredient, and its gray area badge.
	const ingredientsList = makeElement("ul", "detail-list");
	const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

	if (ingredients.length === 0) {
		ingredientsList.append(makeElement("li", "", "No ingredients listed yet."));
	}

	ingredients.forEach(function (ingredient) {
		const row = makeElement("li");

		// A <label> wrapped around the checkbox means clicking the words
		// checks the box too. The real checkbox is hidden by the CSS, and
		// the "check-box" span is the box you see (with the hand-drawn X).
		const label = makeElement("label", "ingredient-check");
		const checkbox = makeElement("input", "check-input");
		checkbox.type = "checkbox";
		const box = makeElement("span", "check-box");
		box.setAttribute("aria-hidden", "true");

		const words = makeElement("span");
		words.append(
			makeElement("span", "amount", ingredient.amount || "(no amount)"),
			" " + (ingredient.item || "(no ingredient)")
		);

		label.append(checkbox, box, words);
		row.append(label, makeGrayAreaBadge(ingredient.grayArea));
		ingredientsList.append(row);
	});

	// Instructions: numbered steps with a gray area badge on each.
	const stepsList = makeElement("ol", "detail-list");
	const steps = Array.isArray(recipe.instructions) ? recipe.instructions : [];

	if (steps.length === 0) {
		stepsList.append(makeElement("li", "", "No steps listed yet."));
	}

	steps.forEach(function (step) {
		const row = makeElement("li");
		row.append(makeGrayAreaBadge(step.grayArea), step.step || "(empty step)");
		stepsList.append(row);
	});

	detailView.append(
		backButton,
		title,
		subtitle,
		makeElement("h3", "", "Ingredients"),
		ingredientsList,
		makeElement("h3", "", "Instructions"),
		stepsList
	);

	// Swap views: hide the cards, show the recipe.
	listView.hidden = true;
	detailView.hidden = false;
	detailView.dataset.openIndex = index;
	title.focus();
}

function closeRecipe() {
	const index = detailView.dataset.openIndex;

	detailView.hidden = true;
	listView.hidden = false;

	// Put keyboard focus back on the card the user came from.
	const card = recipeList.querySelector('[data-index="' + index + '"]');
	if (card) {
		card.focus();
	}
}

// ---------- 6. Event delegation ----------

// ONE listener on the whole card list, instead of one on every card.
// event.target is the exact thing clicked (maybe the name or blurb text).
// closest(".recipe-card") walks up from there to find the card it's inside.
// If the click landed in the gap between cards, closest() returns null,
// and we ignore the click.
recipeList.addEventListener("click", function (event) {
	const card = event.target.closest(".recipe-card");
	if (!card) {
		return;
	}
	openRecipe(Number(card.dataset.index));
});

// Same idea for the opened recipe: it gets rebuilt every time,
// so we listen on the container that always stays on the page.
detailView.addEventListener("click", function (event) {
	if (event.target.closest(".back-button")) {
		closeRecipe();
	}
});

// The Escape key also closes an open recipe.
document.addEventListener("keydown", function (event) {
	if (event.key === "Escape" && !detailView.hidden) {
		closeRecipe();
	}
});

// ---------- 7. Start the app ----------

loadRecipes();
