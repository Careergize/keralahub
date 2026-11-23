export function itineraryText(days) {
  return days.filter(day=>Object.values(day).some(Boolean)).map((day,index)=>[
    `DAY ${String(index+1).padStart(2,'0')}${day.title?': '+day.title:''}`,
    day.description,day.stay?'Overnight stay: '+day.stay:'',day.meals?'Meals: '+day.meals:''
  ].filter(Boolean).join('\n')).join('\n\n');
}
export function accommodationText(hotels) {
  return hotels.filter(hotel=>Object.values(hotel).some(Boolean)).map(hotel=>[
    hotel.destination,hotel.name,hotel.nights?hotel.nights+' night(s)':'',hotel.room,hotel.meals
  ].filter(Boolean).join(' | ')).join('\n');
}

export default function QuotationTripEditor({days,hotels,onDays,onHotels,busy}) {
  function input(rows,onRows,index,key,label,{area=false,...props}={}) {
    const attrs={'aria-label':label,value:rows[index][key]||'',onChange:e=>onRows(rows.map((row,i)=>i===index?{...row,[key]:e.target.value}:row)),disabled:busy,...props};
    return <label className={'invoice-field'+(area?' invoice-field-wide':'')}><span>{label}</span>{area?<textarea {...attrs} rows={4} maxLength={6000}/>:<input {...attrs} maxLength={500}/>}</label>;
  }
  return <div className="quotation-trip-builder invoice-field-wide">
    <div className="quotation-builder-heading"><div><h3>Day-by-day itinerary</h3><p>Add the route, activities, overnight stay and meals for each day.</p></div><span>{days.length} {days.length===1?'day':'days'}</span></div>
    <div className="quotation-entry-list">{days.map((day,index)=><article className="quotation-entry" key={index} aria-label={'Itinerary day '+(index+1)}><header><h4><span>{String(index+1).padStart(2,'0')}</span> Day {index+1}</h4><button type="button" disabled={busy} aria-label={'Remove day '+(index+1)} onClick={()=>onDays(days.filter((_,i)=>i!==index))}>Remove</button></header><div className="invoice-field-grid">
      {input(days,onDays,index,'title','Day '+(index+1)+' title',{placeholder:'e.g. Arrival in Kochi & sightseeing'})}
      {input(days,onDays,index,'stay','Day '+(index+1)+' overnight stay',{placeholder:'e.g. Hotel in Kochi / no overnight stay'})}
      {input(days,onDays,index,'description','Day '+(index+1)+' activities & transfers',{area:true,placeholder:'Describe sightseeing, pickup, transfers and the day’s highlights.'})}
      {input(days,onDays,index,'meals','Day '+(index+1)+' meals',{placeholder:'e.g. Breakfast & dinner'})}
      {input(days,onDays,index,'image','Day '+(index+1)+' destination image URL',{type:'url',pattern:'https?://.+',placeholder:'https://example.com/destination.jpg'})}
      {/^https?:\/\//i.test(day.image||'')&&<img key={day.image} className="quotation-image-preview invoice-field-wide" src={day.image} alt={'Day '+(index+1)+' destination preview'} onError={e=>{e.currentTarget.style.display='none';}}/>}
    </div></article>)}</div>
    <button className="quotation-add-entry" type="button" disabled={busy} onClick={()=>onDays([...days,{title:'',description:'',stay:'',meals:''}])}>+ Add day</button>
    <div className="quotation-builder-heading"><div><h3>Hotels & accommodation</h3><p>Add a stay for each destination, including the room type and meal plan.</p></div><span>{hotels.length} {hotels.length===1?'stay':'stays'}</span></div>
    <div className="quotation-entry-list">{hotels.map((hotel,index)=><article className="quotation-entry" key={index} aria-label={'Accommodation '+(index+1)}><header><h4><span>{String(index+1).padStart(2,'0')}</span> Hotel / stay {index+1}</h4><button type="button" disabled={busy} aria-label={'Remove hotel '+(index+1)} onClick={()=>onHotels(hotels.filter((_,i)=>i!==index))}>Remove</button></header><div className="invoice-field-grid">
      {input(hotels,onHotels,index,'destination','Stay '+(index+1)+' destination',{placeholder:'e.g. Munnar'})}
      {input(hotels,onHotels,index,'name','Stay '+(index+1)+' hotel name',{placeholder:'Hotel / resort name or similar'})}
      {input(hotels,onHotels,index,'nights','Stay '+(index+1)+' nights',{type:'number',min:1,max:365,step:1,placeholder:'2'})}
      {input(hotels,onHotels,index,'room','Stay '+(index+1)+' room type',{placeholder:'e.g. Deluxe AC, twin sharing'})}
      {input(hotels,onHotels,index,'meals','Stay '+(index+1)+' meal plan',{placeholder:'e.g. Breakfast included'})}
    </div></article>)}</div>
    <button className="quotation-add-entry" type="button" disabled={busy} onClick={()=>onHotels([...hotels,{destination:'',name:'',nights:'',room:'',meals:''}])}>+ Add hotel</button>
  </div>;
}
