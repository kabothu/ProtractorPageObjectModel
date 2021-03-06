import { ElementFinder, browser, ExpectedConditions, Config, Locator, element } from 'protractor';
import { Workbook, Row, Cell, Worksheet } from 'exceljs';
import { ITestUtil } from '../Interface/ITestUtil';
let until = ExpectedConditions;
let process = require("process")
const EXCEL_SHEET_PATH = process.cwd() + "\\Projects\\Guru99BankTestAutomation\\TestData\\Guru99Bank.xlsx"
let testUtil: TestUtil;
export class TestUtil implements ITestUtil {

    /**
     * Return the object of TestUtil class.
     */
    public static getInstance(): TestUtil {
        if (testUtil == null) {
            testUtil = new TestUtil();
        }
        return testUtil;
    }

    /**
     * Retrun the element finder 
     * @param locator 
     */
    public async getElement(locator: Locator): Promise<ElementFinder> {
        return await element(locator);
    }

    /**
     * Get the data from the excel sheet on the basis or row and column values provided by the use
     * @param workSheet Name of the worksheet in the excel
     * @param row Row number from which user wants to read data
     * @param cell Cell number in the given row from which user wants to read data
     */
    public async getSingleData(workSheet: string, row: number, cell: number): Promise<string> {
        let book: Workbook = new Workbook();
        try {
            await book.xlsx.readFile(EXCEL_SHEET_PATH);
        } catch (e) {
            console.log("File not found exception " + e + " occured ");
        }
        let sheet: Worksheet = book.getWorksheet(workSheet);
        let data: string = sheet.getRow(row).getCell(cell).value.toString();
        return data;
    }

    /**
     * Return the data from the excel sheet for data provider
     * @param workSheet Worksheet from which user wants to  read dat
     */
    public async getMultipleData(workSheet: string): Promise<string[][]> {
        let book: Workbook = new Workbook();
        try {
            await book.xlsx.readFile(EXCEL_SHEET_PATH);
        } catch (e) {
            console.log("File not found exception " + e + " occured ");
        }
        let sheet: Worksheet = await book.getWorksheet(workSheet);
        let data: string[][] = new Array();
        for (let i = 0; i < sheet.rowCount; i++) {
            for (let j = 0; j < sheet.getRow(0).actualCellCount; j++) {
                data[i][j] = await sheet.getRow(i + 1).getCell(j).value.toString();
                console.log(data)
            }
        }
        return data;
    }

    /**
     * Explicitly wait until the element is clickble the default time is 30 second
     * @param webElement Webelement for which method wait until element is clickable
     * @param time Time for the expected conditions waits the default time is 30 second
     */
    private static async elmentToBeClickableWait(webElement: ElementFinder, time: number = 30) {
        await browser.wait(until.elementToBeClickable(webElement), time, 'Element is not present on page limit was ' + time + ' second');
    }

    /**
     * Explicitly wait until the element is visible the default time is 30 second
     * @param webElement Webelement for which method method wait until element is visible
     * @param time Time for which expected condition waits the default time is 30 second
     */
    private static async elementToBeVisiblePresent(webElement: ElementFinder, time: number = 30) {
        await browser.wait(until.elementToBeClickable(webElement), time, 'Element is not present on page limit was ' + time + ' second');
    }

    /**
     * Performed click action on the webelement
     * @param webElement Webelement on which click action is performed
     */
    public async clickOnElement(locator: Locator) {
        let element:ElementFinder = await this.getElement(locator)
        await TestUtil.elmentToBeClickableWait(element);
        await element.click();
    }

    /**
     * Enter text into element after clearing the text box
     * @param webElement Webelement on which values to be enter
     * @param keyValues Values which user wants to enter
     */
    public async enterTextIntoTextBox(locator: Locator, keyValues: string) {
        let element:ElementFinder = await this.getElement(locator)
        await TestUtil.elmentToBeClickableWait(element);
        await element.clear();
        await element.sendKeys(keyValues);
    }

    /**
     * Enter text into text box without clear 
     * @param WebElement 
     * @param keyValues 
     */
    public async enterTextIntoTextBoxWithoutClear(locator: Locator, keyValues: string): Promise<void> {
        let element:ElementFinder = await this.getElement(locator);
        await TestUtil.elmentToBeClickableWait(element);
        await element.sendKeys(keyValues);
    }

    /**
     * Schedule a command to get the text of web elemnt
     * @param webElement Webelement to get text
     * @returns Return the text of the web element
     */
    public async getWebElementText(locator: Locator): Promise<string> {
        let element:ElementFinder = await this.getElement(locator);
        await TestUtil.elementToBeVisiblePresent(element);
        return element.getText();
    }

    /**
     * Schedule a command to get the attriute value of web elemnt
     * @param webElement Webelement to get attribute
     * @returns Return the attribute of the web element
     */
    public async getAttributeOfElement(locator: Locator, attributeName: string): Promise<string> {
        let element:ElementFinder = await this.getElement(locator);
        await TestUtil.elementToBeVisiblePresent(element);
        return element.getAttribute(attributeName);
    }

    /**
     * Switch to alert and get text of the alerts
     */
    public async getAlertText(): Promise<string> {
        let alertText: string = await browser.switchTo().alert().getText();
        return alertText;
    }

    /**
     * Perform a command to accept the alert
     */
    public async acceptAlert() {
        (await browser.switchTo().alert()).accept();
    }

    /**
     * Perform the command to reject the alert
     */
    public async dimissAlert() {
        (await browser.switchTo().alert()).dismiss();
    }

    /**
     * Clear the text of textbox.
     * @param webElement 
     */
    public async clearTextBox(webElement: ElementFinder) {
        await webElement.clear();
    }

}