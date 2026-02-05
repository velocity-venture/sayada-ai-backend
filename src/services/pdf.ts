import puppeteer, { Browser } from 'puppeteer';

const PDF_TIMEOUT_MS = 30_000;

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }
  browserInstance = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  return browserInstance;
}

export class PDFService {
  static async generatePDF(html: string): Promise<Buffer> {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: PDF_TIMEOUT_MS,
      });
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        timeout: PDF_TIMEOUT_MS,
      });
      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }

  /** Close the shared browser instance (call on server shutdown). */
  static async close(): Promise<void> {
    if (browserInstance) {
      await browserInstance.close();
      browserInstance = null;
    }
  }
}
