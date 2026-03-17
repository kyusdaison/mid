const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1800 });

    console.log('Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Wait for the input field to be available
    console.log('Waiting for input field...');
    const inputSelector = 'input[placeholder="Search domain (e.g. satoshi)"]';
    await page.waitForSelector(inputSelector);
    
    // Type dante
    await page.type(inputSelector, 'dante');
    await page.waitForTimeout(1000); // Wait for debounce and state update
    
    // Scroll to section
    await page.evaluate(() => {
        const elm = document.getElementById('apply');
        if (elm) elm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1000);

    // Capture the initial registration form
    await page.screenshot({ path: '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f/screenshot_test_01_form.png' });
    console.log('Saved screenshot_test_01_form.png');

    // Find and click the button
    const buttons = await page.$$('button');
    let targetBtn = null;
    for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('CONNECT WALLET') || text.includes('MINT YOUR'))) {
            targetBtn = btn;
            break;
        }
    }

    if (targetBtn) {
        console.log('Clicking to connect wallet...');
        await targetBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f/screenshot_test_02_connecting.png' });
        
        console.log('Clicking to mint...');
        // Need to refetch button as it might have remounted
        const newButtons = await page.$$('button');
        let mintBtn = null;
        for (const btn of newButtons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text && text.includes('MINT YOUR')) {
                mintBtn = btn;
                break;
            }
        }
        if (mintBtn) {
            await mintBtn.click();
            await page.waitForTimeout(2500); // Committing
            await page.screenshot({ path: '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f/screenshot_test_03_committing.png' });
            
            await page.waitForTimeout(3000); // Registering
            await page.screenshot({ path: '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f/screenshot_test_04_success.png' });

            // Now scroll back to top to check the ID Card
            console.log('Scrolling up to ID card...');
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
            await page.waitForTimeout(1000);
            await page.screenshot({ path: '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f/screenshot_test_05_id_card.png' });
            console.log('Saved screenshot_test_05_id_card.png');
        } else {
            console.log('Mint button not found after connecting wallet.');
        }
    } else {
        console.log('Initial connect wallet button not found.');
    }

    await browser.close();
})();
