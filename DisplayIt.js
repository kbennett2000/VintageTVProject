// RSS Feed URLs
const RSS_URLs = [];
RSS_URLs.push("https://rsshub.app/twitter/user/Kabamur_Taygeta");
RSS_URLs.push("https://rsshub.app/twitter/user/UAPJames");
RSS_URLs.push("https://rsshub.app/twitter/user/planethunter56");
RSS_URLs.push("https://rsshub.app/twitter/user/PostDisclosure");
RSS_URLs.push("https://rsshub.app/twitter/user/tinyklaus");
RSS_URLs.push("https://rsshub.app/twitter/user/OMApproach");
RSS_URLs.push("https://rsshub.app/twitter/user/FamilyofTaygeta");

// Used in Sleep function
var sleepSetTimeout_ctrl;

// Output to be displayed to console
var screenOutput = "";

// The local time zone
var localDate;

// The number of items to display before a data refresh
var itemDisplayCount = 25;

// The number of horizontal display lines on the output screen
var MaxHorizontalDisplayLines = 25;

// The maximum number of columns per row on the output screen
var MaxColumnCount = 55;

// Amount of time to sleep between display feed items
var SleepIntervalBetweenItems = 7500;

// The minimum amount of time to sleep between characters
var CharacterSleepIntervalFloor = 60;

// The maximum amount of variable time between characters
// Will be added to the minimum value (CharacterSleepIntervalFloor)
var CharacterSleepIntervalVariableMax = 90;

// RSS-Parser
let Parser = require("rss-parser");
let parser = new Parser();

// Main
(async () => {
  // Clear the console to begin
  console.clear();

  // Infinite loop
  while (1 > 0) {
    // Clear the screen output buffer
    screenOutput = "";
    // Refresh feed data
    for (const element of RSS_URLs) {
      try {
        await GetNews(element);
      } catch (error) {
        // Do Nothing
      }
    }

    // Display updated feed data
    await DisplayNews(screenOutput);
  }
})();

// Gets RSS Data
async function GetNews(FeedURL) {
  // Get Feed data from Feed URL
  let feed = await parser.parseURL(FeedURL);

  // Loop through feed items
  feed.items.forEach((item) => {
    // Get item data
    localDate = Date.parse(item.pubDate);
    const date1 = new Date(localDate);
    // Add date and content to output buffer, insert *** to be used for parsing later
    screenOutput +=
      date1.toLocaleTimeString() + " - " + removeTags(item.content) + "***";
  });
}

// Remove HTML elements from string
function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, "");
}

// Display RSS Data
async function DisplayNews(NewsToDisplay) {
  // Array of index values for previously displayed items. Used to prevent items from being displayed more than once.
  var UsedIndexValues = [];

  var SplitNewsToDisplay = "";

  // The current column position of the cursor
  var ColumnCounter = 0;

  // Split input on ***
  var ParsedData = NewsToDisplay.split("***");

  // If the number of items to display is less that the Item Display Count, adjust it down to match
  if (ParsedData.length < 25) {
    itemDisplayCount = ParsedData.length;
  }

  // Display feed items
  for (let i = 0; i < itemDisplayCount; i++) {
    // Get a random index value
    var ItemIndex = Math.floor(Math.random() * (ParsedData.length + 1));

    // Use this index value if it hasn't already been used
    if (!UsedIndexValues.includes(ItemIndex)) {
      // Add index value to used value collection
      UsedIndexValues.push(ItemIndex);

      // Get a random value for the line break position
      // This will start the output on a random horizontal location
      var LineBreakCount = Math.floor(
        Math.random() * MaxHorizontalDisplayLines
      );

      // Insert line breaks to get to the desired horizontal line
      for (let x = 0; x < LineBreakCount; x++) {
        process.stdout.write("\n");
      }

      // Build string to display news with line break at the end
      SplitNewsToDisplay = ParsedData[ItemIndex] + "\n";

      // Loop through each character in the output string
      for (let i = 0; i < SplitNewsToDisplay.length; i++) {
        // Write the current character
        process.stdout.write(SplitNewsToDisplay.substring(i, i + 1));

        // Increment the current column counter
        ColumnCounter++;

        // If the current column is near the end of the line
        // and we're at a space (between words), then insert a line break
        if (
          ColumnCounter >= MaxColumnCount &&
          SplitNewsToDisplay.substring(i, i + 1) == " "
        ) {
          process.stdout.write("\n");
          // Reset the current column position
          ColumnCounter = 0;
        }

        // At the end of the current feed item pause for a moment
        if (SplitNewsToDisplay.substring(i, i + 1) == "\n") {
          // Sleep...
          await sleep(SleepIntervalBetweenItems);
          // Clear the display
          console.clear();
        }
        // Pause for a short, random interval between characters
        else {
          // Generate a random sleep interval between characters
          var sleepTime =
            CharacterSleepIntervalFloor +
            Math.floor(Math.random() * CharacterSleepIntervalVariableMax);
          // Sleep...
          await sleep(sleepTime);
        }
      }
    }
  }
}

// Go to sleep
function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(
    (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
  );
}
