import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', err => {
    console.log('Page error: ', err.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('Console error: ', msg.text());
    }
  });

  await page.goto('http://localhost:5173');
  
  await page.type('#startup-idea-input', 'An AI platform that helps restaurants reduce food waste by predicting daily demand');
  await page.click('#validate-button');
  
  await page.waitForNavigation({ timeout: 15000 }).catch(() => {});
  
  await new Promise(r => setTimeout(r, 5000));
  
  await browser.close();
})();
