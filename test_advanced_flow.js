const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = '/Users/kyusdaison/.gemini/antigravity/brain/9bcd8705-ac85-408e-b971-dac8dec30d2f';

async function delay(time) {
  return new Promise(function(resolve) { 
      setTimeout(resolve, time);
  });
}

(async () => {
  console.log("Launching browser to test Advanced Onboarding Flow...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1024 });

  try {
    console.log("Navigating to portal...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // Scroll down to the apply section
    await page.evaluate(() => {
      document.getElementById('apply').scrollIntoView();
    });
    await delay(1000);

    // Step 1: Domain Selection
    console.log("Step 1: Taking screenshot of Step 1 (Domain)...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step1_empty.png') });

    console.log("Typing domain name...");
    await page.type('input[placeholder="Search domain (e.g. satoshi)"]', 'sovereign');
    await delay(1500); // Wait for availability check
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step1_available.png') });

    console.log("Clicking Continue to KYC...");
    const continueBtn = await page.$x("//button[contains(text(), 'Continue to KYC')]");
    if (continueBtn.length > 0) {
      await continueBtn[0].click();
      await delay(1000);
    } else {
      console.log("ERROR: Continue to KYC button not found.");
      return;
    }

    // Step 2: ZKP UI
    console.log("Step 2: Taking screenshot of Step 2 (ZKP Idle)...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step2_idle.png') });
    
    const initZkpBtn = await page.$x("//button[contains(text(), 'Initiate Local')]");
    if (initZkpBtn.length > 0) {
      console.log("Initiating ZKP Scan...");
      await initZkpBtn[0].click();
      await delay(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step2_scanning.png') });

      await delay(2000); // waiting to reach hashing
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step2_hashing.png') });

      await delay(2000); // waiting to reach complete
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step2_complete.png') });
    } else {
      console.log("ERROR: Initiate Local Secure Enclave button not found.");
      return;
    }

    console.log("Clicking Continue to Logistics...");
    const logisticsBtn = await page.$x("//button[contains(text(), 'Continue to Logistics')]");
    if (logisticsBtn.length > 0) {
      await logisticsBtn[0].click();
      await delay(1000);
    } else {
      console.log("ERROR: Continue to Logistics button not found.");
      return;
    }

    // Step 3: Physical Card Logistics
    console.log("Step 3: Taking screenshot of Step 3 (Logistics)...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step3_empty.png') });

    console.log("Filling Logistics...");
    await page.type('input[placeholder="Full Legal Name (For Shipping)"]', 'Alice Sovereign');
    await page.type('input[placeholder="Full Address"]', '123 Crypto Lane, Block City');
    await page.type('input[placeholder="Country"]', 'Montserrat');
    await delay(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step3_filled.png') });

    console.log("Clicking Proceed to Activation...");
    const activationBtn = await page.$x("//button[contains(text(), 'Proceed to Activation')]");
    if (activationBtn.length > 0) {
      await activationBtn[0].click();
      await delay(1000);
    } else {
      console.log("ERROR: Proceed to Activation button not found.");
      return;
    }

    // Step 4: Payment Gateway
    console.log("Step 4: Taking screenshot of Step 4 (Payment)...");
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step4_payment.png') });

    // Try paying via FCC
    console.log("Clicking Pay with FCC...");
    const payBtn = await page.$x("//button[contains(text(), 'Pay')]");
    if (payBtn.length > 0) {
      // It might say Connect Wallet first
      const btnText = await page.evaluate(el => el.textContent, payBtn[0]);
      if (btnText.includes('Connect Wallet')) {
        console.log("Connecting wallet via mock Context...");
        await payBtn[0].click();
        await delay(1000);
        // Look for the mock connect metamask button
        const mmBtn = await page.$x("//button[contains(text(), 'MetaMask')]");
        if (mmBtn.length > 0) {
          await mmBtn[0].click();
          await delay(2000);
        }
      }

      console.log("Initiating Payment...");
      // Click again after connected
      const payActBtn = await page.$x("//button[contains(text(), 'Pay')]");
      if (payActBtn.length > 0) {
        await payActBtn[0].click();
      }
      
      await delay(500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step4_processing.png') });
      
      await delay(3500); // waiting for success
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'onboarding_step4_success.png') });
      
    } else {
      console.log("ERROR: Payment button not found.");
    }

    console.log("Flow completed successfully.");
    
  } catch (error) {
    console.error("Error during flow test:", error);
  } finally {
    await browser.close();
  }
})();
