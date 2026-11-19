export function whatsappUrl(message, number='918281302520'){
  return 'https://wa.me/' + number.replace(/\D/g,'') + '?text=' + encodeURIComponent(message);
}

export function openWhatsAppEnquiry(title, fields){
  const lines = Array.from(fields)
    .filter(([, value])=>value.trim())
    .map(([label, value])=>label + ': ' + value.trim());
  window.location.assign(whatsappUrl([title, '', ...lines].join('\n')));
}
