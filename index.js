const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const user_data = "/Users/arnavjindal/Library/Application Support/Google/Chrome"
const profile = "Profile 2"
const allTextItems = [];
 const profilePath = `${user_data}/${profile}`;
let pageIndex = 0;
let currInd = 1;


function roundDownToNearestTen(num) {
    return num - (num % 10);
}


(async () => {
  // Launch a new browser instance

  const browser = await chromium.connectOverCDP("http://localhost:9222")
  const contexts = browser.contexts();
  // Assuming the first context is the one you're interested in
  const pages = contexts[0].pages();
  const page = pages[0];
  const url = page.url();
  if (url !== "https://duke-sp.transactcampus.com/eAccounts/AccountTransaction.aspx") {
    console.error("FIRST TAB IS NOT TRANSACT. CLOSE ALL TABS AND OPEN BROWSER.LOGIN AND MAKE SURE IT IS AT THIS PAGE.");
    return;
  }

  const folderPath = path.join(__dirname, 'textItems');
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const ssPath = path.join(__dirname, 'ss');
     if (!fs.existsSync(ssPath)) {
        fs.mkdirSync(ssPath);
    }
  // Now, let's print the URL and title of each page (tab)
  console.log(url)
  await page.reload();

  const setDate = async () => {
    await page.click('#ctl00_MainContent_BeginRadDateTimePicker_dateInput');
    await page.fill('#ctl00_MainContent_BeginRadDateTimePicker_dateInput', '');
    await page.type('#ctl00_MainContent_BeginRadDateTimePicker_dateInput', '8/01/2021');
    await page.click('#MainContent_ContinueButton');
    await page.waitForTimeout(10000);
  };


  console.log("Folder made");
  console.log("Setting initial date...");
  await setDate();
  console.log("UWU?")
  const element = await page.locator('strong:nth-child(2)');
  const text = await element.innerText();
  const pre_target = parseInt(text,10);
  const target = roundDownToNearestTen(pre_target)
  console.log(`TARGET NO OF PAGES IS ${target} (processed from ${pre_target})`);
  const innerHTML = await page.innerHTML('#MainContent_ResultPanel');
   allTextItems.push(innerHTML)
   pageIndex++;
  currInd++;
  console.log("STARTING LOOP");

  try {
  while (true) {

      if (pageIndex >= 27) {
        break;
      }

      if (pageIndex === 10) {
            console.log(`[LOG] WRITING FILE`);
           const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
            fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
            allTextItems.length = 0; // Clear the list for the next batch
            currInd = 2;
            console.log(`[LOG] Getting Data for Page ${pageIndex}`);
            await page.click(`a:nth-child(11) > span`);
            await page.waitForTimeout(7000);
            const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
            allTextItems.push(innerHTMLB);
            await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
      } else if (pageIndex % 10 === 0) {
            console.log(`[LOG] WRITING FILE`);
           const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
            fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
            allTextItems.length = 0; // Clear the list for the next batch
            currInd = 2;
            console.log(`[LOG] Getting Data for Page ${pageIndex}`);
            await page.click(`a:nth-child(12) > span`);
            console.log(`[LOG] TAKING A 20S BREAK TO LET SHIT COOLDOWN ${pageIndex}`);
            await page.waitForTimeout(20000);
            const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
            allTextItems.push(innerHTMLB);
            await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
            currInd++;
      } else {

          await page.click(`a:nth-child(${currInd}) > span`);
          await page.waitForTimeout(5000);
          const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
          allTextItems.push(innerHTMLB);
          console.log(`[LOG] Getting Data for Page ${pageIndex}`);
          await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
          currInd++;
  }
  pageIndex++;
}
} catch (err) {
  console.log(`[LOG] ERROR OCCURED. SAVING PROGRESS AND QUITTING.`);
  const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
  fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
  return;
}

console.log("[LOG] Scraper must now reload to prevent campus bottlenecking me.")
await page.reload();
await setDate();
console.log(`[LOG] SKIPPING TO 11 yay`);
await page.click(`a:nth-child(11) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 21 because blackjack`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
currInd = 8;
 try {
  while (true) {
      if (pageIndex >= 53 ||pageIndex >= target) {
        break;
      }
      if (pageIndex % 10 === 0) {
            console.log(`[LOG] WRITING FILE`);
           const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
            fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
            allTextItems.length = 0; // Clear the list for the next batch
            currInd = 2;
            console.log(`[LOG] Getting Data for Page ${pageIndex}`);
            await page.click(`a:nth-child(12) > span`);
            console.log(`[LOG] TAKING A 20S BREAK TO LET SHIT COOLDOWN ${pageIndex}`);
            await page.waitForTimeout(20000);
            const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
            allTextItems.push(innerHTMLB);
            await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
            currInd++;
      } else {

          await page.click(`a:nth-child(${currInd}) > span`);
          await page.waitForTimeout(5000);
          const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
          allTextItems.push(innerHTMLB);
          console.log(`[LOG] Getting Data for Page ${pageIndex}`);
          await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
          currInd++;
  }
  pageIndex++;
}
  if (pageIndex >= target) {
    console.log(`[LOG] COMPLETED SCRAPE.`);
    const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
    fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
    await browser.close()
    return;
  }

} catch (err) {
  console.log(`[LOG] ERROR OCCURED. SAVING PROGRESS AND QUITTING.`);
  const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
  fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
  return;
}
  console.log("[LOG] Scraper must now reload to prevent campus bottlenecking me PART 2 AHHHHH.")
await page.reload();
await setDate();
console.log(`[LOG] SKIPPING TO 11 yay`);
await page.click(`a:nth-child(11) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 21 because blackjack`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 31 because old man`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 41 because dads`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 51 because ded`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
currInd = 4;
 try {
  while (true) {
      if (pageIndex >= 71 || pageIndex >= target) {
        break;
      }
      if (pageIndex % 10 === 0) {
            console.log(`[LOG] WRITING FILE`);
           const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
            fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
            allTextItems.length = 0; // Clear the list for the next batch
            currInd = 2;
            console.log(`[LOG] Getting Data for Page ${pageIndex}`);
            await page.click(`a:nth-child(12) > span`);
            console.log(`[LOG] TAKING A 20S BREAK TO LET SHIT COOLDOWN ${pageIndex}`);
            await page.waitForTimeout(20000);
            const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
            allTextItems.push(innerHTMLB);
            await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
            currInd++;
      } else {

          await page.click(`a:nth-child(${currInd}) > span`);
          await page.waitForTimeout(5000);
          const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
          allTextItems.push(innerHTMLB);
          console.log(`[LOG] Getting Data for Page ${pageIndex}`);
          await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
          currInd++;
  }
  pageIndex++;
}
if (pageIndex >= target) {
    console.log(`[LOG] COMPLETED SCRAPE.`);
    const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
    fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
    await browser.close()
    return;
  }
} catch (err) {
  console.log(`[LOG] ERROR OCCURED. SAVING PROGRESS AND QUITTING.`);
  const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
  fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
  return;
}
await page.reload();
await setDate();
console.log(`[LOG] SKIPPING TO 11 yay`);
await page.click(`a:nth-child(11) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 21 because blackjack`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 31 because old man`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 41 because dads`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 51 because ded`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 61 because senior citizens`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
console.log(`[LOG] SKIPPING TO 71 because FATASS`);
await page.click(`a:nth-child(12) > span`);
await page.waitForTimeout(7000);
currInd = 3;
 try {
  while (true) {
      if (pageIndex >= 95 || pageIndex >= target)  {
        break;
      }
      if (pageIndex % 10 === 0) {
            console.log(`[LOG] WRITING FILE`);
           const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
            fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
            allTextItems.length = 0; // Clear the list for the next batch
            currInd = 2;
            console.log(`[LOG] Getting Data for Page ${pageIndex}`);
            await page.click(`a:nth-child(12) > span`);
            console.log(`[LOG] TAKING A 20S BREAK TO LET SHIT COOLDOWN ${pageIndex}`);
            await page.waitForTimeout(20000);
            const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
            allTextItems.push(innerHTMLB);
            await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
            currInd++;
      } else {

          await page.click(`a:nth-child(${currInd}) > span`);
          await page.waitForTimeout(5000);
          const innerHTMLB = await page.innerHTML('#MainContent_ResultPanel');
          allTextItems.push(innerHTMLB);
          console.log(`[LOG] Getting Data for Page ${pageIndex}`);
          await page.screenshot({ path: `ss/screenshot_${pageIndex}.png` });
          currInd++;
  }
  pageIndex++;
}
if (pageIndex >= target) {
    console.log(`[LOG] COMPLETED SCRAPE.`);
    const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
    fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
    await browser.close()
    return;
  }
} catch (err) {
  console.log(`[LOG] ERROR OCCURED. SAVING PROGRESS AND QUITTING.`);
  const filePath = path.join(folderPath, `textItems-${pageIndex / 10}.json`);
  fs.writeFileSync(filePath, JSON.stringify({data: allTextItems}, null, 2), { encoding: 'utf-8' });
  return;
}
  await browser.close();
  
})();
