
const fs = require('fs')
const assert = require('assert')
const path = require('path')
const code = fs.readFileSync(path.resolve(process.env.USER_CODE_DIR, 'index.html'), 'utf8')
const puppeteer = require('puppeteer')
const { spawn } = require('child_process')

async function retry(fn, ms) {
	try {
		await fn()
	} catch (error) {
		await delay(ms)
		return await retry(fn, ms)
	}
}

;(async () => {
const results = []

// start server
spawn('bash', ['-c', `cd ${process.env.USER_CODE_DIR} && static-server -p ${process.env.PUBLIC_PORT}`])
// wait for app to attach port

const browser = await puppeteer.launch({
	executablePath: '/usr/bin/google-chrome',
	headless: true,
	args: [
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--no-first-run',
		'--no-zygote',
		'--single-process',
		'--disable-gpu'
	]
})
page = await browser.newPage()
await retry(() => page.goto('http://localhost:' + process.env.PUBLIC_PORT), 500)	
await Promise.all([page.addScriptTag({url: 'https://code.jquery.com/jquery-3.5.1.slim.min.js'}), page.addScriptTag({url: 'https://cdnjs.cloudflare.com/ajax/libs/chai/4.2.0/chai.min.js'})])

		try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const headElems = code.replace(/\n/g,'').match(/\<head\s*>.*?\<\/head\s*>/g);
assert(headElems && headElems.length === 1);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const bodyElems = code.replace(/\n/g,'').match(/<body\s*>.*?<\/body\s*>/g);
assert(bodyElems && bodyElems.length === 1);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const htmlChildren = code.replace(/\n/g,'').match(/<html\s*>(?<children>.*)<\/html\s*>/);
let foundHead;
if(htmlChildren) {
  const { children } = htmlChildren.groups;

  foundHead = children.match(/<head\s*>.*<\/head\s*>/);
}
assert(foundHead);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const htmlChildren = code.replace(/\n/g,'').match(/<html\s*>(?<children>.*?)<\/html\s*>/);
let foundBody;
if(htmlChildren) {
  const { children } = htmlChildren.groups;
  foundBody = children.match(/<body\s*>.*<\/body\s*>/);
}
assert(foundBody);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const headChildren = code.replace(/\n/g,'').match(/<head\s*>(?<children>.*?)<\/head\s*>/);
let foundTitle;
if(headChildren) {
  const { children } = headChildren.groups;
  foundTitle = children.match(/<title\s*>.*?<\/title\s*>/);
}
assert(foundTitle);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
window.assert = chai.assert;
const bodyChildren = code.replace(/\n/g,'').match(/<body\s*>(?<children>.*?)<\/body\s*>/);
let foundElems;
if(bodyChildren) {
  const { children } = bodyChildren.groups;
  const h1s = children.match(/<h1\s*>.*<\/h1\s*>/g);
  const ps = children.match(/<p\s*>.*<\/p\s*>/g);
  const numH1s = h1s ? h1s.length : 0;
  const numPs = ps ? ps.length : 0;
  foundElems = numH1s === 1 && numPs === 1;
}
assert(foundElems);
;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}

fs.writeFileSync(process.env.UNIT_TEST_OUTPUT_FILE, JSON.stringify(results))
process.exit(0)
})();
		