(()=>{
 const $=s=>document.querySelector(s);
 const note=$('#quickNote'),dock=$('#noteDock');
 const openNote=()=>{dock.classList.add('open');dock.setAttribute('aria-hidden','false');note.focus()};
 const closeNote=()=>{dock.classList.remove('open');dock.setAttribute('aria-hidden','true')};
 $('#heroNote')?.addEventListener('click',openNote);
 $('#closeNote')?.addEventListener('click',closeNote);
 note.value=localStorage.getItem('vexakit_quick_note')||'';
 let saveTimer;
 note.addEventListener('input',()=>{clearTimeout(saveTimer);$('#noteStatus').textContent='Saving…';saveTimer=setTimeout(()=>{localStorage.setItem('vexakit_quick_note',note.value);$('#noteStatus').textContent='Saved on this device';},250)});
 $('#copyNote')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(note.value);$('#noteStatus').textContent='Copied to clipboard';}catch(e){note.select();document.execCommand('copy');$('#noteStatus').textContent='Copied to clipboard';}});
 $('#heroExplore')?.addEventListener('click',()=>document.querySelector('#allToolsSection')?.scrollIntoView({behavior:'smooth'}));
 window.addEventListener('vexakit-toast',e=>{const region=$('#toastRegion');if(!region)return;const el=document.createElement('div');el.className='toast '+(e.detail.kind||'');el.textContent=e.detail;region.append(el);setTimeout(()=>el.remove(),2800)});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();openNote()}});
})();
