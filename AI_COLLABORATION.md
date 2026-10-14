First time using Claude Code, and I entered this into the chat for the basics to appear for my app:
"Based on this zed plan template for a recipe app, I am building an app and want the recipes to be left blank so I can entire them, but make it clear where I enter the name of the recipe, the ingredients, the amounts, and the amount of "gray area". Create this using vanilla code, im in a beginners class."
Then I also inserted my zed plan template which included a mock up image of my app which I felt helped to show what it should look like.

I had Claude add checkboxes next to the ingredients in my app so that a user can select a box and check off the ingredient. 
It created the element of a checkbox, and then it also created <label> that allows for the user to click anywhere on the word and it checks off the box, too. 
It replaced "words" in this code:
		row.append(words, makeGrayAreaBadge(ingredient.grayArea));
with label.append(checkbox, box, words); as well as "label" instead of words. 
It also added an accessibility component where tab moves to the next box, and space can check or uncheck it. 

Asked Claude to add a search bar and category filter (Drinks, Desserts, Meals). It added applyFilters(), which uses .filter() to keep recipes that match both the chosen category and the typed text, using .toLowerCase() so capitals don't matter.

Asked Claude to go through all my code and see if there were any bugs or errors. I fixed two organization issues in my code as well as a line I accidentally left in after deleting other code. 

Asked Claude to teach me some of the more advanced concepts used in my code. It gave me five options, each with a self-test question: event delegation, async/await with fetch, keyboard focus management (tabindex), the custom checkbox, and the self-adjusting grid (auto-fill). I asked it to explain the first two in depth, and use real-world comparisons.

What I learned:
- async/await and fetch: fetch loads recipes.json in the background so the page doesn't freeze. A 404 error does NOT make fetch throw an error by itself, so my code has to check response.ok. The comparison was a coffee shop buzzer: the buzzer going off doesn't mean you got what you ordered, so you still have to check the tray.
- tabindex="-1" lets code move focus to the recipe title without adding it to the Tab order.