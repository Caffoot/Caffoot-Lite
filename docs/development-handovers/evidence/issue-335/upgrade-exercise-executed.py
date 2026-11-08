"""One explicit disposable upgrade exercise; never use an existing volume or installation."""
import argparse, hashlib, json, os, socket, ssl, subprocess, tempfile, time, urllib.request, uuid
from pathlib import Path

OLD='ghcr.io/caffoot/caffoot-lite@sha256:e3606870dfafd9178fd622727dd753f3cf2439574ab45f18807330ccaee5c116'
DOCKER=['env','-u','DOCKER_HOST','-u','DOCKER_CONTEXT','-u','DOCKER_TLS','-u','DOCKER_TLS_VERIFY','-u','DOCKER_CERT_PATH','docker','--host=unix:///var/run/docker.sock']
parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--candidate-image',required=True);parser.add_argument('--expected-revision',required=True);parser.add_argument('--output',required=True);args=parser.parse_args()
result={'oldImage':OLD,'candidateImage':args.candidate_image,'candidateRevision':args.expected_revision,'architecture':'amd64','syntheticData':True,'upgradeCount':0,'checks':{}}
prefix='caffoot-335-'+uuid.uuid4().hex[:12];volumes=[];containers=[]
def run(*parts,input=None,check=True):
 p=subprocess.run(DOCKER+list(parts),input=input,text=True,capture_output=True)
 if check and p.returncode:raise RuntimeError('Disposable Docker operation failed: '+p.stderr[-1500:])
 return p.stdout.strip()
def inside(name,code):return run('exec','-i',name,'python','-',input=code)
def volume(suffix):
 name=prefix+'-'+suffix;run('volume','create',name);volumes.append(name);return name
def helper(image,mounts,code):
 parts=['run','--rm','--user','0:0']
 for source,target,readonly in mounts:parts+=['--mount',f'type=volume,src={source},dst={target}'+(',readonly' if readonly else '')]
 return run(*parts,'--entrypoint','python',image,'-c',code)
def port():
 with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
listen=port();origin=f'https://127.0.0.1:{listen}'
def start(image,data,suffix):
 name=prefix+'-'+suffix;containers.append(name)
 run('run','-d','--name',name,'--mount',f'type=volume,src={data},dst=/data','-p',f'127.0.0.1:{listen}:8080','-e','CAFFOOT_WEB_ADDRESS='+origin,'-e','CAFFOOT_SERVER_ADDRESS=127.0.0.1','-e','CAFFOOT_PORT=8080',image)
 for attempt in range(60):
  try:
   inside(name,"import ssl,urllib.request;urllib.request.urlopen('https://127.0.0.1:8080/health',context=ssl.create_default_context(cafile='/data/tls/server.crt'),timeout=2).read()")
   return name
  except RuntimeError:
   if attempt==59:raise
   time.sleep(.5)
def remove(name):run('rm','-f',name)
SNAPSHOT="""import json,sqlite3,pathlib,hashlib,stat
root=pathlib.Path('/data');db=sqlite3.connect(root/'caffoot.sqlite3');tables={}
for (table,) in db.execute(\"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'\"):
 columns=[r[1] for r in db.execute('PRAGMA table_info('+table+')')]
 rows=[list(r) for r in db.execute('SELECT * FROM '+table)]
 tables[table]={'columns':columns,'rows':sorted(rows,key=repr)}
files={str(p.relative_to(root)):{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'mode':stat.S_IMODE(p.stat().st_mode),'uid':p.stat().st_uid,'gid':p.stat().st_gid} for p in root.rglob('*') if p.is_file() and not p.name.startswith('caffoot.sqlite3')}
print(json.dumps({'schema':db.execute('SELECT max(version) FROM schema_migrations').fetchone()[0],'tables':tables,'files':files}))
"""
def snapshot(name):return json.loads(inside(name,SNAPSHOT))
def preserve(old,new):
 for table,record in old['tables'].items():
  current=new['tables'][table];indices=[current['columns'].index(c) for c in record['columns']]
  rows=sorted([[r[i] for i in indices] for r in current['rows']],key=repr)
  if table=='schema_migrations':assert all(r in rows for r in record['rows']),table
  else:assert rows==record['rows'],'Old rows changed in '+table
 assert old['files']==new['files'],'Persistent file identity or permissions changed'
def requests(name,tokens,trust):
 context=ssl.create_default_context(cafile=trust)
 for role,token in tokens.items():
  request=urllib.request.Request(origin+'/api/inventory/state',headers={'Cookie':'caffoot_session='+token})
  with urllib.request.urlopen(request,context=context) as response:data=json.load(response)
  assert data['editPermissions']['IPAM']==(role!='fixture-reader')
  if role=='fixture-reader':assert data['editPermissions']['Devices'] is False
 code=inside(name,"import sqlite3,time;from backend.mfa import code_at;db=sqlite3.connect('/data/caffoot.sqlite3');print(code_at(db.execute(\"SELECT mfa_secret FROM accounts WHERE username='fixture-owner'\").fetchone()[0],time.time()))")
 payload=json.dumps({'username':'fixture-owner','password':'Fictional-Upgrade-Password','mfa_code':code}).encode()
 request=urllib.request.Request(origin+'/api/login',data=payload,headers={'Origin':origin,'Content-Type':'application/json'})
 with urllib.request.urlopen(request,context=context) as response:assert response.status==200
 return True
try:
 label=run('image','inspect',args.candidate_image,'--format','{{index .Config.Labels "org.opencontainers.image.revision"}}');assert label==args.expected_revision
 assert run('image','inspect',args.candidate_image,'--format','{{.Architecture}}')=='amd64'
 data=volume('data');backup=volume('backup');restore=volume('restore');reject=volume('reject')
 old=start(OLD,data,'old')
 seed="""import sqlite3,time,json,os,secrets,pathlib
from backend.accounts import bootstrap_first_admin,confirm_admin_mfa
from backend.permissions import create_user,set_permission
from backend.mfa import new_secret,code_at
from backend.sessions import login_session
from backend.inventory import stage_inventory
from backend.application_integrity import validate_detached_application_state
from backend.rack_validation import find_rack_import_conflicts
from backend.collection_saves import change_inventory_record
from backend.normalisation_validation import validate_normalisation_devices,validate_normalisation_vlans
p=pathlib.Path('/data');db=sqlite3.connect(p/'caffoot.sqlite3');owner,secret=bootstrap_first_admin(db,'fixture-owner','Fictional-Upgrade-Password');confirm_admin_mfa(db,owner,code_at(secret,time.time()))
for username,level in [('fixture-editor','edit'),('fixture-reader','read')]:
 user=create_user(db,owner,username,'Fictional-Upgrade-Password')
 if level=='edit':db.execute('UPDATE accounts SET mfa_secret=?,mfa_confirmed=1 WHERE id=?',(new_secret(),user));db.commit()
 for section in ['Devices','IPAM','Racks']:set_permission(db,owner,user,section,level)
state={'devices':[{'id':'router','name':'Fictional router','type':'Router','mountType':'Rack Mounted','location':'Fictional lab','rackId':'rack','rackUStart':2,'rackUHeight':1,'rackUEnd':2,'face':'front','primaryIp':'10.77.1.10','notes':'Preserved fictional notes','customField':'Historical value'}], 'subnets':[{'id':'network','name':'Fictional legacy network','cidr':'10.77.1.0/24','vlan':10,'gateway':'10.77.1.1'}], 'vlans':[{'id':'vlan','name':'Fictional legacy network','vlanId':10}], 'racks':[{'id':'rack','name':'Fictional rack','type':'Floor Standing','heightU':12,'widthMm':600,'depthMm':800,'location':'Fictional lab'}], 'rackAccessories':[{'id':'panel','rackId':'rack','type':'blank','face':'front','startU':6,'heightU':1,'name':'Fictional blank panel'}], 'ipAllocations':{'10.77.1.10':{'status':'Assigned','deviceId':'router','hostname':'Fictional router'},'10.77.1.11':{'status':'Reserved','notes':'Independent reserved address'}},'deviceLocations':['Unknown','Fictional lab'],'deviceTypes':['Router']}
validate_normalisation_devices(state);validate_normalisation_vlans(state);assert not validate_detached_application_state(state),validate_detached_application_state(state);assert not find_rack_import_conflicts(state),find_rack_import_conflicts(state);stage_inventory(db,state)
rack=dict(state['racks'][0],name='Fictional recorded rack');change_inventory_record(db,owner,'racks','rack',rack)
# This private fixture key is operator-supplied test material; v2.0.3 does not generate email keys.
with os.fdopen(os.open(p/'account-email-secret.key',os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600),'wb') as f:f.write(secrets.token_bytes(32))
(p/'fixture-marker.txt').write_text('Preserve the entire data mount, not only SQLite.')
tokens={}
for username in ['fixture-owner','fixture-editor','fixture-reader']:
 secret,confirmed=db.execute('SELECT mfa_secret,mfa_confirmed FROM accounts WHERE username=?',(username,)).fetchone();tokens[username]=login_session(db,username,'Fictional-Upgrade-Password',mfa_code=code_at(secret,time.time()) if confirmed else None)
assert all(tokens.values());print(json.dumps(tokens))
"""
 tokens=json.loads(inside(old,seed));before=snapshot(old);assert before['schema']==7
 with tempfile.TemporaryDirectory(prefix='caffoot-335-trust-') as directory:
  trust=str(Path(directory)/'certificate.pem');run('cp',old+':/data/tls/server.crt',trust)
  result['checks']['oldAuthenticatedRolesAndMfa']=requests(old,tokens,trust)
  # Take the authoritative snapshot after the deliberate successful old login.
  before=snapshot(old);run('stop',old)
  helper(OLD,[(data,'/source',True),(backup,'/backup',False)],"import tarfile; t=tarfile.open('/backup/full-data.tar','w');t.add('/source',arcname='data');t.close()")
  remove(old)
  candidate=start(args.candidate_image,data,'candidate');result['upgradeCount']+=1
  after=snapshot(candidate);assert after['schema']==10;preserve(before,after)
  result['checks']['schema7To10AndEveryOldTableColumnRowPreserved']=True
  result['checks']['allNonDatabaseFilesHashesOwnersModesPreserved']=True
  result['checks']['existingSessionsRolesAndNewMfaLogin']=requests(candidate,tokens,trust)
  assert inside(candidate,"import sqlite3,hashlib;from backend.account_email import email_proof_secret;db=sqlite3.connect('/data/caffoot.sqlite3');print(hashlib.sha256(email_proof_secret(db)).hexdigest())")==before['files']['account-email-secret.key']['sha256']
  runtime_before=snapshot(candidate)
  run('restart',candidate)
  for attempt in range(30):
   try:snap=snapshot(candidate);assert snap['schema']==10;break
   except RuntimeError:time.sleep(.5)
  preserve(runtime_before,snapshot(candidate));result['checks']['restartPreservesFullStateAndPrivateKey']=True
  remove(candidate);candidate=start(args.candidate_image,data,'recreated');preserve(runtime_before,snapshot(candidate));result['checks']['recreationPreservesFullStateAndPrivateKey']=True
  requests(candidate,tokens,trust);run('stop',candidate)
  # Refusal is checked only on a separate throwaway copy of the upgraded state.
  helper(OLD,[(data,'/source',True),(reject,'/reject',False)],"import tarfile;t=tarfile.open('/tmp/copy.tar','w');t.add('/source',arcname='.');t.close();t=tarfile.open('/tmp/copy.tar');t.extractall('/reject',numeric_owner=True,filter='fully_trusted')")
  refused=helper(OLD,[(reject,'/data',False)],"import sqlite3;from backend.schema import initialise_database;db=sqlite3.connect('/data/caffoot.sqlite3');\ntry: initialise_database(db)\nexcept RuntimeError as e: print(str(e))")
  assert 'newer than this application' in refused;result['checks']['oldBinaryRejectsNewerSchemaOnThrowawayCopy']=True
  remove(candidate)
  helper(OLD,[(backup,'/backup',True),(restore,'/restore',False)],"import tarfile;t=tarfile.open('/backup/full-data.tar');t.extractall('/restore',numeric_owner=True,filter='fully_trusted')")
  restored=start(OLD,restore,'restored');restored_state=snapshot(restored);assert restored_state==before;requests(restored,tokens,trust)
  result['checks']['completePreUpgradeBackupRestoresOldApplication']=True
 result.update(schemaBefore=7,schemaAfter=10,oldTableCounts={t:len(v['rows']) for t,v in before['tables'].items()},persistentFiles=before['files'],operatorSuppliedFixtureKey=True,status='passed')
except BaseException as error:
 result.update(status='failed',failureType=type(error).__name__,failure=str(error));raise
finally:
 for name in reversed(containers):run('rm','-f',name,check=False)
 for name in reversed(volumes):run('volume','rm',name,check=False)
 result['cleanup']={'containersAbsent':all(not run('ps','-aq','--filter','name='+name) for name in containers),'volumesAbsent':all(not run('volume','ls','-q','--filter','name='+name) for name in volumes)}
 Path(args.output).write_text(json.dumps(result,indent=2));print(json.dumps({k:result[k] for k in ['status','upgradeCount','checks','cleanup']}))
