import React, {createContext,useContext,useEffect,useState} from 'react';
import {adminApi} from './adminApi';
import {publishedRows,settingValue,validateSiteResponse} from './contentModel';
export {safeUrl,mediaUrl} from './contentModel';
const SiteContext=createContext({collections:{},loading:true,error:'',refresh:()=>{}});
export function SiteContentProvider({children}) {
  const [state,setState]=useState({collections:{},loading:true,error:''});
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    let active=true,timer,pending=false;
    const refresh=async()=>{
      if(pending)return;
      pending=true;clearTimeout(timer);
      try{
        const result=validateSiteResponse(await adminApi('getSiteContent'));
        if(active)setState({collections:result.collections,loading:false,error:''});
      }catch(error){
        if(active)setState(previous=>({...previous,loading:false,error:error.message||'Website content could not be loaded.'}));
      }finally{pending=false;if(active)timer=setTimeout(refresh,30000);}
    };
    refresh();
    window.addEventListener('focus',refresh);
    window.addEventListener('kerala-content-changed',refresh);
    return()=>{active=false;clearTimeout(timer);window.removeEventListener('focus',refresh);window.removeEventListener('kerala-content-changed',refresh);};
  },[revision]);
  return <SiteContext.Provider value={{...state,refresh:()=>setRevision(n=>n+1)}}>{children}</SiteContext.Provider>;
}
export function useSiteContent(){return useContext(SiteContext);}
export function useCollection(name){return publishedRows(useSiteContent().collections,name);}
export function useSetting(key){return settingValue(useSiteContent().collections,key);}
export function usePageText(path){
  const sections=useCollection('PageSections');
  return(key,field)=>sections.find(row=>row.Page===path&&row.Key===key)?.[field]??'';
}
