'use strict';
// Pure IPv4 hierarchy validation. No DOM, storage, or network dependencies.
// This file is the testable foundation for the upcoming app integration.
function ipNumber(ip) {
  const parts=String(ip).split('.');
  if(parts.length!==4 || !parts.every(p=>/^\d{1,3}$/.test(p)&&Number(p)<=255)) return null;
  return parts.reduce((n,p)=>n*256+Number(p),0);
}
function ipString(n) { return [24,16,8,0].map(k=>Math.floor(n/2**k)%256).join('.'); }
function parseCidr(value,{minPrefix=0,maxPrefix=32}={}) {
  const m=/^([^/]+)\/(\d{1,2})$/.exec(String(value));
  if(!m) return null;
  const raw=ipNumber(m[1]),prefix=Number(m[2]);
  if(raw===null||prefix<minPrefix||prefix>maxPrefix) return null;
  const size=2**(32-prefix),start=Math.floor(raw/size)*size;
  return {prefix,start,end:start+size-1,size,aligned:raw===start,canonical:ipString(start)+'/'+prefix};
}
function validateHierarchy(subnets) {
  const errors=[];
  if(!Array.isArray(subnets)) return ['Subnets must be an array.'];
  const ids=new Map(),cidrs=new Set(),ranges=new Map();
  for(const s of subnets) {
    if(!s||typeof s!=='object'||typeof s.id!=='string'||!s.id.trim()) {errors.push('Subnet ID is missing.');continue;}
    if(ids.has(s.id)) errors.push('Duplicate subnet ID: '+s.id);
    ids.set(s.id,s);
    const kind=s.kind===undefined?'network':s.kind;
    if(kind!=='network'&&kind!=='container') errors.push('Invalid subnet kind: '+s.id);
    const range=parseCidr(s.cidr,{minPrefix:kind==='container'?0:23,maxPrefix:kind==='container'?32:30});
    if(!range) errors.push('Invalid CIDR for '+s.id+': '+s.cidr);
    else if(!range.aligned) errors.push('Misaligned CIDR '+s.cidr+'; use '+range.canonical);
    else {
      ranges.set(s.id,range);
      if(cidrs.has(range.canonical)) errors.push('Duplicate CIDR: '+range.canonical);
      cidrs.add(range.canonical);
    }
  }
  for(const s of subnets) {
    if(!s||!s.id||!ranges.has(s.id)) continue;
    const parentId=s.parentId||null;
    if(!parentId) continue;
    if(parentId===s.id) {errors.push('Subnet cannot parent itself: '+s.id);continue;}
    const p=ids.get(parentId);
    if(!p) {errors.push('Missing parent '+parentId+' for '+s.id);continue;}
    if(p.kind!=='container') errors.push('Parent must be a container: '+parentId);
    const child=ranges.get(s.id),parent=ranges.get(parentId);
    if(parent&&!(parent.start<=child.start&&child.end<=parent.end&&child.size<parent.size))
      errors.push('Child '+s.id+' is not strictly inside parent '+parentId);
    const seen=new Set([s.id]);
    let cursor=p;
    while(cursor) {
      if(seen.has(cursor.id)) {errors.push('Parent cycle involving '+s.id);break;}
      seen.add(cursor.id);
      cursor=cursor.parentId?ids.get(cursor.parentId):null;
    }
  }
  // Every intersecting pair must have an explicit ancestor relationship.
  function ancestor(ancestorId,childId) {
    const seen=new Set();
    let s=ids.get(childId);
    while(s&&s.parentId&&!seen.has(s.id)) {
      seen.add(s.id);
      if(s.parentId===ancestorId) return true;
      s=ids.get(s.parentId);
    }
    return false;
  }
  for(let i=0;i<subnets.length;i++) for(let j=i+1;j<subnets.length;j++) {
    const a=subnets[i],b=subnets[j];
    if(!a||!b||a.id===b.id) continue;
    const x=ranges.get(a.id),y=ranges.get(b.id);
    if(x&&y&&x.start<=y.end&&y.start<=x.end&&!ancestor(a.id,b.id)&&!ancestor(b.id,a.id))
      errors.push('Overlapping unrelated subnets: '+a.cidr+' and '+b.cidr);
  }
  return errors;
}
module.exports={ipNumber,ipString,parseCidr,validateHierarchy};
