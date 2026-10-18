'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),os=require('node:os');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),dist=path.join(__dirname,'dist');
const sourceHtml=fs.readFileSync(path.join(__dirname,'caffoot-lite.html'),'utf8');
const versionMatch=sourceHtml.match(/const CAFFOOT_LITE_VERSION = '([^']+)';/);
assert(versionMatch,'App release version missing');
const version=versionMatch[1]; // Public release version; npm metadata may use a SemVer-compatible variant.
assert(/^[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?(?:-[A-Za-z0-9.-]+)?$/.test(version));
const html=fs.readFileSync(path.join(dist,'Caffoot-Lite.html'),'utf8');
assert(html.includes("const CAFFOOT_LITE_VERSION = '"+version+"'"),'App and package versions differ');
for(const marker of ['MIT License','SIL OPEN FONT LICENSE','CC BY 4.0','Tailwind Labs'])assert(html.includes(marker),'Embedded notice missing: '+marker);
for(const [copy,installed] of [['licenses/FONT-AWESOME-6.4.0.txt','@fortawesome/fontawesome-free/LICENSE.txt'],['licenses/TAILWIND-CSS-3.4.17.txt','tailwindcss/LICENSE']]){
 assert.equal(fs.readFileSync(path.join(root,copy),'utf8').trim(),fs.readFileSync(path.join(__dirname,'node_modules',installed),'utf8').trim(),'Pinned dependency notice mismatch: '+copy);
}
const files=['RELEASE-NOTES-'+version+'.md','LICENSE','THIRD-PARTY-NOTICES.md','INSTALLATION.md','USER-GUIDE.md','BACKUP-FORMAT.md','licenses/FONT-AWESOME-6.4.0.txt','licenses/TAILWIND-CSS-3.4.17.txt','app/fixtures/lite-schema-v1.example.json','app/fixtures/lite-legacy.example.json'];
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-package-'));
try{
 fs.copyFileSync(path.join(dist,'Caffoot-Lite.html'),path.join(temp,'Caffoot-Lite.html'));
 for(const name of files){const target=path.join(temp,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,name),target);}
 const members=['Caffoot-Lite.html',...files];
 const sum=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
 fs.writeFileSync(path.join(temp,'SHA256SUMS'),members.map(name=>sum(fs.readFileSync(path.join(temp,name)))+'  '+name).join('\n')+'\n');
 members.push('SHA256SUMS');
 const archive=path.join(dist,'Caffoot-Lite-'+version+'.zip');fs.rmSync(archive,{force:true});
 if(process.platform==='win32'){
  // Windows has PowerShell's built-in ZIP support; no Unix zip/unzip required.
  const runPS=script=>{
   const encoded=Buffer.from(script,'utf16le').toString('base64');
   const result=spawnSync('powershell.exe',['-NoProfile','-NonInteractive','-EncodedCommand',encoded],{encoding:'utf8'});
   if(result.error||result.status!==0)throw Error(result.error?.message||result.stderr||result.stdout||'PowerShell ZIP command failed');
  };
  const quote=value=>"'"+value.replace(/'/g,"''")+"'";
  runPS('Compress-Archive -Path '+quote(path.join(temp,'*'))+' -DestinationPath '+quote(archive)+' -Force');
  const extracted=fs.mkdtempSync(path.join(os.tmpdir(),'caffoot-verify-'));
  try{
   runPS('Expand-Archive -LiteralPath '+quote(archive)+' -DestinationPath '+quote(extracted)+' -Force');
   const list=(dir,prefix='')=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?list(path.join(dir,entry.name),prefix+entry.name+'/'):[prefix+entry.name]);
   assert.deepEqual(list(extracted).sort(),members.slice().sort(),'ZIP must contain exactly reviewed files');
   for(const name of members)assert.equal(sum(fs.readFileSync(path.join(extracted,name))),sum(fs.readFileSync(path.join(temp,name))),'ZIP bytes mismatch: '+name);
  }finally{fs.rmSync(extracted,{recursive:true,force:true});}
 }else{
  const zip=spawnSync('zip',['-q',archive,...members],{cwd:temp,encoding:'utf8'});if(zip.status!==0)throw Error(zip.stderr||'ZIP creation failed');
  const listing=spawnSync('unzip',['-Z1',archive],{encoding:'utf8'});assert.equal(listing.status,0);assert.deepEqual(listing.stdout.trim().split('\\n').sort(),members.slice().sort(),'ZIP must contain exactly reviewed files');
  for(const name of members){const read=spawnSync('unzip',['-p',archive,name],{maxBuffer:20*1024*1024});assert.equal(read.status,0);assert.equal(sum(read.stdout),sum(fs.readFileSync(path.join(temp,name))),'ZIP bytes mismatch: '+name);}
 }
 fs.writeFileSync(path.join(dist,'SHA256SUMS'),['Caffoot-Lite.html',path.basename(archive)].map(name=>sum(fs.readFileSync(path.join(dist,name)))+'  '+name).join('\n')+'\n');
 console.log('PASS: pinned runtime licence copies, app/package version, complete embedded notices, exact ZIP members and extracted byte hashes.');
 console.log('Prepared '+archive+'; no publication performed.');
}finally{fs.rmSync(temp,{recursive:true,force:true});}
