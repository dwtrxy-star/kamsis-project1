function encrypt(){

let text=document.getElementById("text").value.toUpperCase();
let key=document.getElementById("key").value.toUpperCase();
let method=document.getElementById("method").value;

let result="";

if(method==="caesar"){

let shift=parseInt(key);

for(let i=0;i<text.length;i++){

let c=text.charCodeAt(i);

if(c>=65 && c<=90){
result+=String.fromCharCode(((c-65+shift)%26)+65);
}else{
result+=text[i];
}

}

}

else if(method==="vigenere"){

for(let i=0;i<text.length;i++){

let t=text.charCodeAt(i)-65;
let k=key.charCodeAt(i%key.length)-65;

result+=String.fromCharCode(((t+k)%26)+65);

}

}

else if(method==="rail"){

let rails=parseInt(key);

let fence=[];
for(let i=0;i<rails;i++){
fence[i]="";
}

let rail=0;
let dir=1;

for(let char of text){

fence[rail]+=char;

rail+=dir;

if(rail===0 || rail===rails-1){
dir*=-1;
}

}

result=fence.join("");

}

document.getElementById("result").value=result;

}



function decrypt(){

let text=document.getElementById("text").value.toUpperCase();
let key=document.getElementById("key").value.toUpperCase();
let method=document.getElementById("method").value;

let result="";

if(method==="caesar"){

let shift=parseInt(key);

for(let i=0;i<text.length;i++){

let c=text.charCodeAt(i);

if(c>=65 && c<=90){
result+=String.fromCharCode(((c-65-shift+26)%26)+65);
}else{
result+=text[i];
}

}

}

else if(method==="vigenere"){

for(let i=0;i<text.length;i++){

let t=text.charCodeAt(i)-65;
let k=key.charCodeAt(i%key.length)-65;

result+=String.fromCharCode(((t-k+26)%26)+65);

}

}

else if(method==="rail"){

result="Decrypt Rail Fence belum dibuat";

}

document.getElementById("result").value=result;

}