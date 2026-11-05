// Compare real first-run and conditional MFA screens with the pinned authentication design.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),http=require('node:http');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-auth-visual-'));
const out=process.env.CAFFOOT_VISUAL_OUTPUT||path.join(root,'work','acceptance');fs.mkdirSync(out,{recursive:true});
const approved=spawnSync('git',['show','c26db4a56bbc30f95b56201e81a7a76d13c6037b:future-design/approved/sign-in-first-run-draft-03.html'],{cwd:root}).stdout;
const refServer=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html'});res.end(approved);});
const address='https://127.0.0.1:8080';
const server=spawn('python3',['-m','backend.server'],{cwd:root,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1',CAFFOOT_DB_PATH:path.join(tmp,'inventory.sqlite3'),CAFFOOT_TLS_DIR:path.join(tmp,'tls'),CAFFOOT_WEB_ADDRESS:address,CAFFOOT_SERVER_ADDRESS:'127.0.0.1',CAFFOOT_HOST:'127.0.0.1'},stdio:'ignore'});
let browser;
async function main(){
 await new Promise(resolve=>refServer.listen(0,'127.0.0.1',resolve));
 browser=await chromium.launch({headless:true,executablePath:process.env.CAFFOOT_CHROMIUM_PATH||undefined,args:['--no-sandbox']});
 const context=await browser.newContext({ignoreHTTPSErrors:true});
 await context.route('https://raw.githubusercontent.com/**',r=>r.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(root,'assets/caffoot-icon-1024.png'))}));
 const page=await context.newPage(),reference=await context.newPage();
 for(let i=0;i<40;i++){
  try{if((await context.request.get(address+'/health')).ok())break;}catch{}
  await page.waitForTimeout(100);
 }
 await reference.goto('http://127.0.0.1:'+refServer.address().port);
 await page.goto(address+'/setup');await page.locator('#welcome-flow:not([hidden])').waitFor();
 const results=[];
 async function capture(name,screen){
  await reference.evaluate(screen=>show(screen),screen);
  for(const [width,height]of [[1440,950],[390,844]]){
   await page.setViewportSize({width,height});await reference.setViewportSize({width,height});
   await page.screenshot({path:path.join(out,name+'-'+width+'-live.png'),fullPage:true,mask:[page.locator('#setup-qr'),page.locator('#secret'),page.locator('#code')]});
   await reference.screenshot({path:path.join(out,name+'-'+width+'-approved.png'),fullPage:true,mask:[reference.locator('.qr-placeholder')]});
   results.push({screen:name,width,status:'captured; live test authenticator material masked'});
  }
  console.log('Captured',name);
 }
 await capture('first-run-welcome','welcome');
 await page.locator('#get-started').click();await capture('first-run-administrator','create');
 const password='Isolated-Visual-Administrator-2026!';
 await page.locator('#username').fill('visual-owner');await page.locator('#password').fill(password);await page.locator('#confirm-password').fill(password);
 await page.locator('#submit').click();await page.locator('#enrolment:not([hidden])').waitFor();
 const secret=await page.locator('#secret').textContent();
 await capture('first-run-enrolment','enrol');
 await page.reload();await page.getByRole('heading',{name:'Finish Administrator Setup'}).waitFor();await capture('first-run-resume','resume');
 await page.locator('#username').fill('visual-owner');await page.locator('#password').fill(password);await page.locator('#submit').click();
 await page.locator('#enrolment:not([hidden])').waitFor();assert.equal(await page.locator('#secret').textContent(),secret);
 const code=spawnSync('python3',['-c','from backend.mfa import code_at;import sys,time;print(code_at(sys.argv[1],time.time()))',secret],{cwd:root,encoding:'utf8'}).stdout.trim();
 await page.locator('#code').fill(code);await page.locator('#submit').click();await page.locator('#setup-complete:not([hidden])').waitFor();await capture('first-run-complete','complete');
 await page.locator('#setup-continue-sign-in').click();await page.locator('#submit').click();await page.locator('#code-field:not([hidden])').waitFor();await capture('sign-in-mfa','mfa');
 fs.writeFileSync(path.join(out,'authentication-visual-results.json'),JSON.stringify(results,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server.kill('SIGTERM');refServer.close();fs.rmSync(tmp,{recursive:true,force:true});});
