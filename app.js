const BLOCK_SIZE = 8;

// ================= BASIC =================
function textToBytes(t){
  return Array.from(new TextEncoder().encode(t));
}

function bytesToText(b){
  return new TextDecoder().decode(new Uint8Array(b));
}

function xor(a,b){
  return a.map((v,i)=>v ^ b[i % b.length]);
}

// ================= BASE64 =================
function bytesToBase64(bytes){
  let binary="";
  bytes.forEach(b=>binary+=String.fromCharCode(b));
  return btoa(binary);
}

function base64ToBytes(base64){
  let binary=atob(base64.trim());
  return Array.from(binary).map(c=>c.charCodeAt(0));
}

// ================= LOGIC =================
function sub(b){
  return b.map(x=>(x*7+3)%256);
}

function invSub(b){
  return b.map(x=>((x-3+256)*183)%256);
}

function perm(b){
  return [...b].reverse();
}

// ================= BLOCK =================
function encryptBlock(b,k){
  return perm(sub(xor(b,k)));
}

function decryptBlock(b,k){
  return xor(invSub(perm(b)),k);
}

// ================= MODE =================
function ECB(d,k,e){
  let r=[];
  for(let i=0;i<d.length;i+=BLOCK_SIZE){
    let b=d.slice(i,i+BLOCK_SIZE);
    r.push(...(e?encryptBlock(b,k):decryptBlock(b,k)));
  }
  return r;
}

function CBC(d,k,iv,e){
  let r=[],prev=iv;
  for(let i=0;i<d.length;i+=BLOCK_SIZE){
    let b=d.slice(i,i+BLOCK_SIZE);
    if(e){
      let c=encryptBlock(xor(b,prev),k);
      r.push(...c);
      prev=c;
    }else{
      let p=xor(decryptBlock(b,k),prev);
      r.push(...p);
      prev=b;
    }
  }
  return r;
}

function CFB(d,k,iv,e){
  let r=[],prev=iv;
  for(let i=0;i<d.length;i+=BLOCK_SIZE){
    let b=d.slice(i,i+BLOCK_SIZE);
    let o=xor(b,encryptBlock(prev,k));
    r.push(...o);
    prev=e?o:b;
  }
  return r;
}

// ================= MAIN =================
function run(type){
  try{
    let mode=document.getElementById("mode").value;
    let key=textToBytes(document.getElementById("key").value || "key");
    let iv=textToBytes(document.getElementById("iv").value || "iv");
    let input=document.getElementById("inputText").value;

    if(!input){
      alert("Input kosong!");
      return;
    }

    let data;
    let out;

    if(type==="encrypt"){
      data=textToBytes(input);

      while(data.length % BLOCK_SIZE !== 0){
        data.push(0);
      }

      if(mode==="ECB") out=ECB(data,key,true);
      else if(mode==="CBC") out=CBC(data,key,iv,true);
      else out=CFB(data,key,iv,true);

      document.getElementById("outputText").value=bytesToBase64(out);
      document.getElementById("info").innerText="Berhasil enkripsi";

    }else{
      data=base64ToBytes(input);

      if(mode==="ECB") out=ECB(data,key,false);
      else if(mode==="CBC") out=CBC(data,key,iv,false);
      else out=CFB(data,key,iv,false);

      document.getElementById("outputText").value=bytesToText(out).replace(/\0+$/g,"");
      document.getElementById("info").innerText="Berhasil dekripsi";
    }

  }catch(e){
    document.getElementById("info").innerText="Error: "+e.message;
  }
}

// ================= FIX BUTTON =================
document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("btnEncrypt").onclick=()=>run("encrypt");
  document.getElementById("btnDecrypt").onclick=()=>run("decrypt");
});