import assert from 'node:assert/strict';
import {publishedRows,settingValue,pageSections,navigationRows,validateSiteResponse,safeUrl,mediaUrl} from '../src/contentModel.js';
const collections={
  Pages:[{ID:'p',Path:'/transport/',Title:'Transport'}],
  PageSections:[{ID:'s',Page:'/transport/',Key:'vehicles',Type:'Collection',Collection:'Vehicles'}],
  Vehicles:[{ID:'v',Name:'Sheet-only vehicle',Seats:'7'}],
  SiteSettings:[{Key:'brandName',Value:'Sheet-only brand'}],
  Navigation:[{Location:'Header',Label:'Fleet',Link:'/transport/'},{Location:'Header',Label:'Vehicles',Link:'/transport/#vehicles'}],
};
assert.equal(publishedRows(collections,'Vehicles')[0].Name,'Sheet-only vehicle');
assert.equal(settingValue(collections,'brandName'),'Sheet-only brand');
assert.equal(settingValue(collections,'missing'),'');
assert.deepEqual(publishedRows({},'Vehicles'),[]);
assert.deepEqual(publishedRows({Vehicles:[]},'Vehicles'),[]);
assert.equal(navigationRows(collections,'Header').length,2);
assert.equal(pageSections(collections,'/transport/').length,1);
assert.deepEqual(pageSections({...collections,PageSections:[]},'/transport/'),[]);
assert.equal(navigationRows({...collections,PageSections:[]},'Header').length,1);
assert.equal(navigationRows({...collections,Pages:[]},'Header').length,0);
assert.deepEqual(publishedRows({...collections,Vehicles:[]},'Vehicles'),[]);
assert.equal(safeUrl('javascript:alert(1)'), '');
assert.equal(safeUrl('//evil.example'),'');
assert.equal(mediaUrl('tel:123'),'');
assert.equal(mediaUrl('/image.jpg'),'/image.jpg');
assert.throws(()=>validateSiteResponse({collections,schemaVersion:3}),/version 4/);
assert.equal(validateSiteResponse({collections,schemaVersion:4}).collections,collections);
console.log('Passed: sheet-only data, empty/missing collections, deletion visibility, page/menu references, unsafe URLs and API-version validation.');

const {vehicleDailyRate}=await import('../src/contentModel.js');
for(const value of ['2500','2,500','₹2,500.00','INR 2,500','Rs. 2,500'])assert.equal(vehicleDailyRate({'Daily rate':value}),2500);
assert.equal(vehicleDailyRate({'Daily rate':0}),0);
for(const value of ['',null,'ask for quote'])assert.equal(vehicleDailyRate({'Daily rate':value}),null);
console.log('Passed: formatted sheet vehicle rates, zero and missing rates.');
