import puppeteer from 'puppeteer';

export class PDFService {
    static async generatePDF(html: string): Promise<Buffer> {
        const browser = await puppeteer.launch({
            headless: true,  // Uses modern "new" headless mode in v22+
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // Required for Render/container envs
        });
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        return Buffer.from(pdf);
    }
}