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

async function GetNews(FeedURL) {
  let feed = await parser.parseURL(FeedURL);

  feed.items.forEach((item) => {
    localDate = Date.parse(item.pubDate);
    const date1 = new Date(localDate);
    screenOutput +=
      date1.toLocaleTimeString() + " - " + removeTags(item.content) + "***";
  });
}

function removeTags(str) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, "");
}

async function DisplayNews(NewsToDisplay) {
  var UsedIndexValues = [];
  var SplitNewsToDisplay = "";
  var ColumnCounter = 0;
  var n = NewsToDisplay.split("***");

  for (let i = 0; i < 25; i++) {
    var ItemIndex = Math.floor(Math.random() * (n.length + 1));

    if (!UsedIndexValues.includes(ItemIndex)) {
      UsedIndexValues.push(ItemIndex);

      var LineBreakCount = Math.floor(Math.random() * 25);

      for (let x = 0; x < LineBreakCount; x++) {
        process.stdout.write("\n");
      }

      SplitNewsToDisplay = n[ItemIndex] + "\n";

      for (let i = 0; i < SplitNewsToDisplay.length; i++) {
        process.stdout.write(SplitNewsToDisplay.substring(i, i + 1));

        ColumnCounter++;
        if (
          ColumnCounter >= 55 &&
          SplitNewsToDisplay.substring(i, i + 1) == " "
        ) {
          process.stdout.write("\n");
          ColumnCounter = 0;
        }
        if (SplitNewsToDisplay.substring(i, i + 1) == "\n") {
          await sleep(7500);
          console.clear();
        } else {
          var sleepTime = 60 + Math.floor(Math.random() * 90);
          await sleep(sleepTime);
        }
      }
    }
  }
}

function sleep(ms) {
  clearInterval(sleepSetTimeout_ctrl);
  return new Promise(
    (resolve) => (sleepSetTimeout_ctrl = setTimeout(resolve, ms))
  );
}
