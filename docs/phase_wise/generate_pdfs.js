const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function getHtmlFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, files);
    } else if (filePath.endsWith('.html') && !filePath.endsWith('index.html')) {
      files.push(filePath);
    }
  }
  return files;
}

async function convertHtmlToPdf() {
  const docsDir = path.join(__dirname);
  const htmlFiles = getHtmlFiles(docsDir);
  console.log(`Found ${htmlFiles.length} HTML files to convert.`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const htmlFile of htmlFiles) {
    const pdfFile = htmlFile.replace(/\.html$/, '.pdf');
    console.log(`Converting: ${path.basename(htmlFile)} -> ${path.basename(pdfFile)}`);

    const page = await browser.newPage();
    
    // Convert to file URL format
    const fileUrl = 'file:///' + htmlFile.replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    // Check if page contains Mermaid diagrams
    const hasMermaid = await page.evaluate(() => document.querySelectorAll('.mermaid').length > 0);
    if (hasMermaid) {
      console.log('  Waiting for Mermaid diagrams to render...');
      try {
        await page.waitForFunction(() => {
          const elements = document.querySelectorAll('.mermaid');
          return Array.from(elements).every(el => {
            return el.querySelector('svg') !== null || el.getAttribute('data-processed') === 'true';
          });
        }, { timeout: 10000 });
        // Small buffer to guarantee CSS/layout stabilization
        await new Promise(r => setTimeout(r, 1000));
      } catch (err) {
        console.warn('  Warning: Timeout waiting for Mermaid diagrams rendering, proceeding anyway.');
      }
    }

    // Print to PDF
    // Note: We leave margins empty/undefined in page.pdf to let the CSS @page { margin: 20mm; } control it
    await page.pdf({
      path: pdfFile,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });

    await page.close();
    console.log(`  Done: ${path.basename(pdfFile)}`);
  }

  await browser.close();
  console.log('All PDF conversions completed successfully!');
}

convertHtmlToPdf().catch(err => {
  console.error('Error during conversion:', err);
  process.exit(1);
});
