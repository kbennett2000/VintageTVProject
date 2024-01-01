// Used in Sleep function
var sleepSetTimeout_ctrl;

// The number of horizontal display lines on the output screen
var MaxHorizontalDisplayLines = 25;

// The maximum number of columns per row on the output screen
var MaxColumnCount = 45;

// Amount of time to sleep between display feed items
var SleepIntervalBetweenItems = 7500;

// The minimum amount of time to sleep between characters
var CharacterSleepIntervalFloor = 45; //60;

// The maximum amount of variable time between characters
// Will be added to the minimum value (CharacterSleepIntervalFloor)
var CharacterSleepIntervalVariableMax = 120; //90;

const axios = require("axios");
const cheerio = require("cheerio");

const blogPosts = [];

async function getWebPage() {
  try {
    // Make a GET request to the web page
    const response = await axios.get("https://familyoftaygeta.com/messages/");

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Select and retrieve items in the .t-entry-title class
    const titles = [];
    $(".t-entry-title").each((index, element) => {
      titles.push($(element).text().trim());
      titles.push($(element).find("a").attr("href"));
    });

    // Return the titles
    return titles;
  } catch (error) {
    console.error("Error fetching web page:", error.message);
    throw error;
  }
}

async function getBlogPost(PostUrl) {
  try {
    // Make a GET request to the web page
    const response = await axios.get(PostUrl);

    // Load the HTML content into Cheerio
    const $ = cheerio.load(response.data);

    // Select and retrieve items in the .t-entry-title class
    const thePost = $(".uncode_text_column").text();

    // Return the post
    return thePost;
  } catch (error) {
    console.error("Error fetching web page:", error.message);
    throw error;
  }
}

// Display RSS Data
async function DisplayPosts(PostsToDisplay) {
  var SplitNewsToDisplay = "";

  // The current column position of the cursor
  var ColumnCounter = 0;

  // Display feed items
  for (let i = 0; i < PostsToDisplay.length / 2; i += 2) {
    // Get a random value for the line break position
    // This will start the output on a random horizontal location
    var LineBreakCount = Math.floor(Math.random() * MaxHorizontalDisplayLines);

    // Insert line breaks to get to the desired horizontal line
    for (let x = 0; x < LineBreakCount; x++) {
      process.stdout.write("\n");
    }

    // Build string to display news with line break at the end
    SplitNewsToDisplay =
      PostsToDisplay[i] + "\n" + PostsToDisplay[i + 1] + "\\";

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
      if (SplitNewsToDisplay.substring(i, i + 1) == "\\") {
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

// Go to sleep
function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(
    (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
  );
}

// *********************************************************************
// Call the function and log the result
getWebPage()
  .then(async (titles) => {
    for (let i = 0; i < titles.length; i += 2) {
      blogPosts.push(titles[i]);
      const postBody = "";

      await getBlogPost(titles[i + 1]).then((thePost) => {
        blogPosts.push(thePost);
      });
    }

    // console.log(blogPosts);

    DisplayPosts(blogPosts);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
