"""Create isolated demonstration inventory for approved-source visual comparisons."""
from pathlib import Path
import json,re,sqlite3,time,sys
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from enabled_inventory import enable_inventory_features
from backend.schema import initialise_database
from backend.accounts import bootstrap_first_admin,confirm_admin_mfa
from backend.mfa import code_at
from backend.inventory import stage_inventory
folder=Path(sys.argv[1]);folder.mkdir(parents=True,exist_ok=True)
p=folder/'inventory.sqlite3'
if p.exists():p.unlink()
import subprocess
source=subprocess.check_output(['git','show','c26db4a56bbc30f95b56201e81a7a76d13c6037b:future-design/approved/devices-overview-draft-03.html'],cwd=ROOT,text=True)
raw=json.loads(re.search(r'const inventoryDevices = (\[.*?\]);',source).group(1))
devices=[]
for i,d in enumerate(raw):
 r={**d,'id':'visual-device-'+str(i),'primaryIp':d.get('ip',''),'mountType':('Rack Mounted' if d.get('mount')=='racked' else 'Not Applicable' if d['type']=='Server - Virtual' else 'Desktop'),'serialNumber':d.get('serial',''),'typeDetails':{}}
 r.pop('ip',None);r.pop('mount',None)
 if d.get('mount')=='racked':r.update(rackId='rack-0',rackUStart=2+i*3,rackUEnd=2+i*3,rackUHeight=1,face='front')
 if r['name']=='Hypervisor-01':r['typeDetails']={'serverService_Hypervisor':True};r['os']='VMware ESXi'
 if r['name']=='App-VM-01':r['virtualHostId']='visual-device-0';r['isVirtual']=True
 devices.append(r)
subnets=[{'id':'net-'+str(i),'name':name,'cidr':cidr,'gateway':cidr.rsplit('.',1)[0]+'.1','vlan':10+i*10} for i,(name,cidr) in enumerate([('Management','10.0.10.0/24'),('Workstations','10.0.20.0/24'),('Guest','10.0.30.0/24')])]
racks=[{'id':'rack-'+str(i),'name':'Rack '+chr(65+i),'heightU':42,'location':'Server Room','type':'Floor Standing'}for i in range(3)]
state={'devices':devices,'subnets':subnets,'vlans':[],'racks':racks,'rackAccessories':[],'ipAllocations':{d['primaryIp']:{'status':'Assigned','deviceId':d['id'],'hostname':d['name']}for d in devices if d['primaryIp']},'deviceLocations':['Unknown','Server Room','Office'],'deviceTypes':['Server - Physical','Server - Virtual','Desktop','Switch','NAS','Router','Firewall','Unknown']}
with sqlite3.connect(p) as db:
 initialise_database(db)
 enable_inventory_features(db)
 user,secret=bootstrap_first_admin(db,'owner','Visual-Acceptance-Password-2026!')
 confirm_admin_mfa(db,user,code_at(secret,time.time()))
 stage_inventory(db,state)
(folder/'test-credentials.json').write_text(json.dumps({'username':'owner','password':'Visual-Acceptance-Password-2026!','secret':secret}))
