export function readTravelDates(value=''){
  const match=/^(\d{4}-\d{2}-\d{2})(?: to (\d{4}-\d{2}-\d{2}))?$/.exec(String(value).trim());
  return match?{from:match[1],to:match[2]||''}:{from:'',to:''};
}

export function writeTravelDates(from,to){
  if(!from&&!to)return '';
  if(!from||!to)throw new Error('Choose both travel start and end dates.');
  if(to<from)throw new Error('Travel end date cannot be before the start date.');
  return `${from} to ${to}`;
}
