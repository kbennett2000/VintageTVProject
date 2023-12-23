const RSS_URL01 = "https://rss.app/feeds/de76IDxKSxVmsmk0.xml";
const RSS_URL02 = "https://rss.app/feeds/gc1kAu4fXQue2ivy.xml";
const RSS_URL03 = "https://rss.app/feeds/ki0CDDCG8YeqtEqI.xml";
const RSS_URL04 = "https://rss.app/feeds/ZSRfLTLXc3m7Uj2y.xml";

var sleepSetTimeout_ctrl;
var screenOutput = "";
var localDate;

let Parser = require("rss-parser");
let parser = new Parser();

(async () => {
  console.clear();

  while (1 > 0) {
    screenOutput = "";
    await GetNews(RSS_URL01);
    await GetNews(RSS_URL02);
    await GetNews(RSS_URL03);
    await GetNews(RSS_URL04);
    await DisplayNews(screenOutput);
  }
})();

async function GetNews(FeedURL) {
  let feed = await parser.parseURL(FeedURL);

  feed.items.forEach((item) => {
    localDate = Date.parse(item.pubDate);
    const date1 = new Date(localDate);
    //screenOutput += date1.toLocaleTimeString() + " - " + item.title + " - " + removeTags(item.content) + "***";
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

      var LineBreakCount = Math.floor(Math.random() * 35);

      for (let x = 0; x < LineBreakCount; x++) {
        process.stdout.write("\n");
      }

      SplitNewsToDisplay = n[ItemIndex] + "\n";

      for (let i = 0; i < SplitNewsToDisplay.length; i++) {
        process.stdout.write(SplitNewsToDisplay.substring(i, i + 1));
        ColumnCounter++;
        if (
          ColumnCounter >= 65 &&
          SplitNewsToDisplay.substring(i, i + 1) == " "
        ) {
          process.stdout.write("\n");
          ColumnCounter = 0;
        }
        if (SplitNewsToDisplay.substring(i, i + 1) == "\n") {
          await sleep(7500);
          console.clear();
        } else {
          await sleep(100);
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
