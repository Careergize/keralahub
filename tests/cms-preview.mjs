// Isolated browser fixture. Never calls Google or writes business records.
// Run: node tests/cms-preview.mjs from UI, then open http://localhost:5187.
import {createServer} from 'vite';
import tailwindcss from '@tailwindcss/vite';
import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const fixture=JSON.parse(readFileSync(new URL('../../AppsScript/website-seed.json',import.meta.url),'utf8'));
fixture.SiteSettings.find(row=>row.Key==='welcomeEnabled').Value='No';
fixture.Vehicles=[{ID:'fixture-live-vehicle',Name:'Sheet-driven Test Vehicle',Seats:'7','Daily rate':'3200',Description:'This vehicle is supplied by the isolated API fixture.',Status:'Published','Sort order':'1'}];
const server=await createServer({root,configFile:false,plugins:[tailwindcss(),{
  name:'isolated-cms-fixture',configureServer(server){
    server.middlewares.use('/api/admin',async(req,res)=>{
      let body='';for await(const part of req)body+=part;
      const data=JSON.parse(body||'{}');
      res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
      if(data.action!=='getSiteContent'){res.end(JSON.stringify({ok:false,error:'This isolated fixture is read-only.'}));return;}
      const collections=structuredClone(fixture);
      const statePath=new URL('./fixture-state.json',import.meta.url);
      const state=existsSync(statePath)?JSON.parse(readFileSync(statePath,'utf8')):{};
      if(state.emptyVehicles)collections.Vehicles=[];
      if(state.emptyAll)for(const key of Object.keys(collections))collections[key]=[];
      if(state.heading){collections.PageSections.find(row=>row.Page==='/'&&row.Key==='hero').Title=state.heading;}
      for(const key of Object.keys(collections))collections[key]=collections[key].filter(row=>row.Status==='Published').sort((a,b)=>Number(a['Sort order']||0)-Number(b['Sort order']||0));
      res.end(JSON.stringify({ok:true,result:{schemaVersion:4,collections}}));
    });
  },
}] ,server:{host:'localhost',port:5187,strictPort:true}});
await server.listen();console.log('Isolated sheet-content fixture: http://localhost:5187');
