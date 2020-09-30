
const fs = require('fs')
const assert = require('assert')
const path = require('path')
const code = fs.readFileSync(path.resolve(process.env.USER_CODE_DIR, 'index.html'), 'utf8')
const puppeteer = require('puppeteer')

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
assert(($("h1").length === 0));;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
assert(($("h2").length > 0));;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
assert(($("p").length === 0));;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
assert(code.match(/[^fc]-->/g).length > 1);;
return true
}, code)
assert(test)
results.push(true)
} catch(error) {
results.push(false)
}
try {
const test = await page.evaluate((code) => {
assert((code.match(/<([a-z0-9]){1,2}>/g)[0]==="<h1>" && code.match(/<([a-z0-9]){1,2}>/g)[1]==="<h2>" && code.match(/<([a-z0-9]){1,2}>/g)[2]==="<p>") );;
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
		