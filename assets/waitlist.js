(async function () {
  'use strict';
  const API = 'https://dream-sim-production.up.railway.app/public/waitlist';
  const form=document.querySelector('#wl'), button=document.querySelector('#wlBtn'), status=document.querySelector('#wlStatus');
  if (!form) return;
  button.disabled=true;
  let config;
  const el=(tag,text)=>{const node=document.createElement(tag); if(text)node.textContent=text; return node;};
  try {
    const response=await fetch(API+'/config');
    if (!response.ok) throw new Error();
    config=await response.json();
  } catch (_) { status.textContent='The waitlist is temporarily unavailable. Please try later.'; return; }
  function choices(name,options) {
    const box=form.querySelector('[data-name="'+name+'"]'); box.replaceChildren();
    options.forEach(value=>{const label=el('label');label.className='choice'; const radio=el('input');
      radio.type='radio';radio.name=name;radio.value=value;radio.required=true;
      label.append(radio,el('span',value));box.append(label);});
  }
  choices('city',config.markets.map(m=>m.city));
  choices('gender',['A woman','A man','Prefer not to say']);
  choices('age',['25–29','30–34','35–39','40–44','45–50','Over 50']);
  const neighbourhoods=el('fieldset');neighbourhoods.append(el('legend','Preferred dating neighbourhoods (optional, maximum 3)'));
  const areas=el('div'); neighbourhoods.append(areas);
  const other=el('input');other.name='other_location';other.maxLength=160;other.placeholder='Your country and city';other.hidden=true;
  const consentLabel=el('label');const consent=el('input');consent.type='checkbox';consent.required=true;
  consentLabel.append(consent,document.createTextNode(' '+config.consent_text));
  const trap=el('input');trap.name='website';trap.tabIndex=-1;trap.autocomplete='off';trap.hidden=true;
  const shareLabel=el('label'), share=el('input');share.type='checkbox';share.checked=false;
  shareLabel.append(share,document.createTextNode(' Include my introductory story answers to help plan DhaShu.'));
  button.before(neighbourhoods,other,shareLabel,el('br'),consentLabel,trap);
  form.querySelector('.form-note').textContent='Your details are saved privately for launch planning and early-access updates. Joining does not create an app account.';
  form.addEventListener('change',event=>{
    if(event.target.name==='city'){
      areas.replaceChildren();const market=config.markets.find(m=>m.city===event.target.value);
      other.hidden=!['IN-OTHER','GLOBAL-INTEREST'].includes(market.id);other.required=!other.hidden;
      market.neighbourhoods.forEach(n=>{const label=el('label'),check=el('input');check.type='checkbox';check.name='neighbourhood';check.value=n.id;
        label.append(check,document.createTextNode(n.name));areas.append(label);});
      if(!market.neighbourhoods.length)areas.append(el('p','Neighbourhood choices will be available later for this city.'));
    }
    if(event.target.name==='neighbourhood'&&form.querySelectorAll('[name="neighbourhood"]:checked').length>3){event.target.checked=false;status.textContent='Choose up to three neighbourhoods.';}
  });
  form.querySelector('[name="email"]').required=true;
  form.querySelector('[name="name"]')?.addEventListener('input',e=>{document.querySelector('#ink').textContent=e.target.value||'Your name';});
  button.disabled=false;
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(!form.reportValidity())return;
    const fd=new FormData(form),market=config.markets.find(m=>m.city===fd.get('city'));
    if(!market)return;
    let answers={};
    if(share.checked)try{answers=JSON.parse(sessionStorage.getItem('dhashu_waitlist_answers_v1')||'{}');}catch(_){}
    button.disabled=true;status.textContent='Saving…';
    try {
      const response=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:String(fd.get('name')||'').trim(),email:String(fd.get('email')||'').trim(),market_id:market.id,
        gender:fd.get('gender'),age_band:fd.get('age'),neighbourhoods:fd.getAll('neighbourhood'),
        other_location:other.hidden?'':other.value,answers,survey_version:'story-v1',
        source:(new URLSearchParams(location.search).get('utm_source')||'website').slice(0,300),
        consent:consent.checked,consent_version:config.consent_version,website:fd.get('website')||''})});
      const body=await response.json();if(!response.ok||body.saved!==true)throw new Error(body.error||'Could not save. Please try again.');
      document.querySelector('#doneTitle').textContent='Your interest is recorded';
      document.querySelector('#doneSub').textContent=body.message;
      document.querySelector('#previewTag').hidden=true;form.hidden=true;document.querySelector('#done').hidden=false;
      try{sessionStorage.removeItem('dhashu_waitlist_answers_v1');}catch(_){}
      status.textContent='';
    }catch(error){status.textContent=error.message||'Could not save. Please try again.';}
    finally{button.disabled=false;}
  });
  document.querySelector('#back')?.addEventListener('click',()=>{document.querySelector('#done').hidden=true;form.hidden=false;});
})();
