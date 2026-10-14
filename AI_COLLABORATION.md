//First time using Claude Code, and I entered this into the chat for the basics to appear for my app:
"Based on this zed plan template for a recipe app, I am building an app and want the recipes to be left blank so I can entire them, but make it clear where I enter the name of the recipe, the ingredients, the amounts, and the amount of "gray area". Create this using vanilla code, im in a beginners class."
Then I also inserted my zed plan template which included a mock up image of my app which I felt helped to show what it should look like.//

//I had Claude add checkboxes next to the ingredients in my app so that a user can select a box and check off the ingredient. 
It created the element of a checkbox, and then it also created <label> that allows for the user to click anywhere on the word and it checks off the box, too. 
It replaced "words" in this code:
		row.append(words, makeGrayAreaBadge(ingredient.grayArea));
with label.append(checkbox, box, words); as well as "label" instead of words. 
It also added an accessibility component where tab moves to the next box, and space can check or uncheck it. //

Asked AI to help me create the rest of the code for my recipes based on the 5 I had already created

Asked Claude to add a search bar and category filter (Drinks, Desserts, Meals). It added applyFilters(), which uses .filter() to keep recipes that match both the chosen category and the typed text, using .toLowerCase() so capitals don't matter.