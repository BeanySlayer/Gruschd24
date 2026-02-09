(function(){
  "use strict";

  function initContact(){
    var form = document.getElementById('cform');
    var dl = document.getElementById('download');
    var file = document.getElementById('cfile');
    var hint = document.getElementById('filehint');

    var fileDataUrl = null;
    var fileMeta = null;

    file.addEventListener('change', function(){
      var f = file.files && file.files[0];
      if (!f){
        fileDataUrl = null;
        fileMeta = null;
        hint.textContent = 'Hinweis: Browser kann Dateien nicht automatisch an eine E‑Mail anhängen. Du kannst aber eine Anfrage‑Datei herunterladen und uns separat schicken.';
        return;
      }
      fileMeta = { name: f.name, type: f.type || 'application/octet-stream', size: f.size };
      readAsDataURL(f).then(function(url){
        fileDataUrl = url;
        hint.textContent = 'Ausgewählt: '+f.name+' ('+Math.round(f.size/1024)+' KB). Du kannst jetzt „Anfrage herunterladen“ nutzen.';
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var payload = buildPayload(fileDataUrl, fileMeta);
      var to = 'kontakt@gruschd24.de';
      var subject = encodeURIComponent(payload.subject);
      var body = encodeURIComponent(mailBody(payload));
      window.location.href = 'mailto:'+to+'?subject='+subject+'&body='+body;
    });

    dl.addEventListener('click', function(){
      var payload = buildPayload(fileDataUrl, fileMeta);
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'gruschd24_anfrage_'+new Date().toISOString().slice(0,10)+'.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  function buildPayload(fileDataUrl, fileMeta){
    var name = document.getElementById('cname').value.trim();
    var email = document.getElementById('cemail').value.trim();
    var subject = document.getElementById('csubject').value.trim() || 'Anfrage';
    var message = document.getElementById('cmsg').value.trim();
    return {
      createdAt: new Date().toISOString(),
      channel: 'webshop',
      name: name,
      email: email,
      subject: subject,
      message: message,
      file: fileDataUrl ? { meta: fileMeta, dataUrl: fileDataUrl } : null,
    };
  }

  function mailBody(payload){
    var lines = [
      'Name: '+payload.name,
      'E-Mail: '+payload.email,
      '',
      payload.message,
      '',
      'Optionaler Upload:',
      payload.file ? ('- '+payload.file.meta.name+' ('+Math.round(payload.file.meta.size/1024)+' KB) – bitte separat anhängen oder Anfrage-Datei mitschicken.') : '- keiner',
      '',
      '—',
      'Tipp: „Anfrage herunterladen“ erzeugt eine JSON-Datei (inkl. Upload als Data-URL), die du uns schicken kannst.',
    ];
    return lines.join('\n');
  }

  function readAsDataURL(file){
    return new Promise(function(resolve, reject){
      var r = new FileReader();
      r.onload = function(){ resolve(String(r.result)); };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  window.Gruschd = window.Gruschd || {};
  window.Gruschd.initContact = initContact;

  document.addEventListener('DOMContentLoaded', function(){
    if (document.getElementById('cform')) initContact();
  });
})();
