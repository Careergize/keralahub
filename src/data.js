const uploads = 'https://atlastrip-wp.egenstheme.com/travel-agency/wp-content/uploads/sites/2/2026/08/';
export const asset = (name) => uploads + name;

export const tours = [
  {title:'Kerala at a Glance', places:['Kochi','Munnar','Alappuzha'], days:5, type:'Family Tour', image:1, detail:'Walk through Fort Kochi, explore Munnar’s tea gardens and spend a night on the backwaters.'},
  {title:'Romantic Kerala Escape', places:['Munnar','Alappuzha'], days:4, type:'Honeymoon', image:2, detail:'Pair quiet hill-station stays with a private houseboat cruise.'},
  {title:'Wild Kerala Adventure', places:['Thekkady','Munnar'], days:6, type:'Adventure Tour', image:4, detail:'Spend time in spice gardens and discover the forests around Periyar.'},
  {title:'Backwaters & Beaches', places:['Alappuzha','Varkala'], days:5, type:'Family Tour', image:5, detail:'Cruise past backwater villages before heading to Varkala’s cliffside beaches.'},
  {title:'A Slow Journey Through Wayanad', places:['Wayanad'], days:4, type:'Adventure Tour', image:7, detail:'Explore forest trails, waterfalls and the rock carvings at Edakkal Caves.'},
  {title:'Culture & Coast of Kerala', places:['Kochi','Varkala'], days:7, type:'Family Tour', image:8, detail:'Take in colonial streets, local performances and Kerala’s southern coastline.'},
];

export const regions = {
  'Hill Stations':['Munnar','Wayanad','Thekkady'],
  Backwaters:['Alappuzha'],
  Beaches:['Varkala'],
  Heritage:['Kochi'],
};

export const experiences = [
  {title:'Alappuzha Houseboat Cruise', places:['Alappuzha'], type:'Backwaters', days:1, image:5, detail:'Cruise through palm-lined canals and watch life along the banks.'},
  {title:'Munnar Tea Trail', places:['Munnar'], type:'Hill Stations', days:1, image:2, detail:'Follow the trails through Munnar’s tea estates.'},
  {title:'Fort Kochi Heritage Walk', places:['Kochi'], type:'Heritage', days:1, image:4, detail:'Explore the lanes, waterfront and architecture of Fort Kochi on foot.'},
];
