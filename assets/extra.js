(()=>{
 const $=s=>document.querySelector(s);
 const note=$('#quickNote'),dock=$('#noteDock');let installPrompt=null;
 const openNote=()=>{dock.classList.add('open');dock.setAttribute('aria-hidden','false');note.focus()};
 const closeNote=()=>{dock.classList.remove('open');dock.setAttribute('aria-hidden','true')};
 $('#heroNote')?.addEventListener('click',openNote);$('#closeNote')?.addEventListener('click',closeNote);
 note.value=localStorage.getItem('vexakit_quick_note')||'';
 let saveTimer;note.addEventListener('input',()=>{clearTimeout(saveTimer);$('#noteStatus').textContent='Saving…';saveTimer=setTimeout(()=>{localStorage.setItem('vexakit_quick_note',note.value);$('#noteStatus').textContent='Saved on this device';},250)});
 $('#copyNote')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(note.value);$('#noteStatus').textContent='Copied to clipboard';}catch(e){note.select();document.execCommand('copy');$('#noteStatus').textContent='Copied to clipboard';}});
 $('#heroExplore')?.addEventListener('click',()=>document.querySelector('#allToolsSection')?.scrollIntoView({behavior:'smooth'}));
 // A portable backup of this browser's VexaKit preferences and notes.
 const backup=document.createElement('button');backup.className='icon-btn';backup.type='button';backup.title='Export workspace backup';backup.setAttribute('aria-label','Export workspace backup');backup.textContent='⇩';
 const actions=document.querySelector('.top-actions');if(actions)actions.insertBefore(backup,$('#themeToggle'));
 const picker=document.createElement('input');picker.type='file';picker.accept='application/json,.json';picker.hidden=true;document.body.appendChild(picker);
 backup.addEventListener('click',()=>{const data={app:'VexaKit',version:2,exportedAt:new Date().toISOString(),preferences:{theme:localStorage.getItem('vexakit_theme'),favorites:localStorage.getItem('vexakit_favorites'),recent:localStorage.getItem('vexakit_recent'),note:localStorage.getItem('vexakit_quick_note')}};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='vexakit-workspace-backup.json';a.click();URL.revokeObjectURL(a.href);window.dispatchEvent(new CustomEvent('vexakit-toast',{detail:'Workspace backup exported'}));});
 const restore=document.createElement('button');restore.className='hero-quiet';restore.type='button';restore.textContent='Restore backup';restore.title='Restore a VexaKit workspace backup';document.querySelector('.hero-buttons')?.appendChild(restore);
 restore.addEventListener('click',()=>picker.click());picker.addEventListener('change',()=>{const file=picker.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(data.app!=='VexaKit'||!data.preferences)throw new Error('Invalid backup');const p=data.preferences;[['theme','theme'],['favorites','favorites'],['recent','recent'],['quick_note','note']].forEach(([key,prop])=>{if(p[prop]!=null)localStorage.setItem('vexakit_'+key,p[prop])});window.dispatchEvent(new CustomEvent('vexakit-toast',{detail:'Backup restored. Refreshing…'}));setTimeout(()=>location.reload(),700)}catch(e){window.dispatchEvent(new CustomEvent('vexakit-toast',{detail:'That backup file is not valid',kind:'error'}))}};reader.readAsText(file);picker.value=''});
 // PWA install prompt is only offered by browsers that support it.
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;const b=$('#installApp');if(b)b.hidden=false});
 $('#installApp')?.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installApp').hidden=true});
 window.addEventListener('appinstalled',()=>{$('#installApp').hidden=true;window.dispatchEvent(new CustomEvent('vexakit-toast',{detail:'VexaKit installed'}))});
 window.addEventListener('vexakit-toast',e=>{const region=$('#toastRegion');if(!region)return;const el=document.createElement('div');el.className='toast '+(e.detail.kind||'');el.textContent=e.detail;region.append(el);setTimeout(()=>el.remove(),2800)});
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='n'){e.preventDefault();openNote()}});
})();
