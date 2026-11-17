export function whatsappUrl(message){
  return 'https://wa.me/918281302520?text=' + encodeURIComponent(message);
}

export function openWhatsAppEnquiry(title, fields){
  const lines = Array.from(fields)
    .filter(([, value])=>value.trim())
    .map(([label, value])=>label + ': ' + value.trim());
  window.location.assign(whatsappUrl([title, '', ...lines].join('\n')));
}
