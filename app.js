const BLOCK_SIZE = 8;

// ================= BASIC =================
function textToBytes(text) {
  return Array.from(new TextEncoder().encode(text));
}

function bytesToText(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function xor(a, b) {
  return a.map((v, i) => v ^ b[i % b.length]);
}

// ================= BASE64 =================
function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBytes(base64) {
  const clean = base64.trim();
  const binary = atob(clean);
  const bytes = [];
  for (let i = 0; i < binary.length; i++) {
    bytes.push(binary.charCodeAt(i));
  }
  return bytes;
}

// ================= SUBSTITUSI =================
function sub(bytes) {
  return bytes.map((x) => (x * 7 + 3) % 256);
}

// invers dari x -> (7x + 3) mod 256
// invers 7 mod 256 = 183
function invSub(bytes) {
  return bytes.map((x) => (((x - 3 + 256) % 256) * 183) % 256);
}

// ================= PERMUTASI =================
function perm(bytes) {
  return [...bytes].reverse();
}

// ================= BLOCK =================
function encryptBlock(block, key) {
  return perm(sub(xor(block, key)));
}

function decryptBlock(block, key) {
  return xor(invSub(perm(block)), key);
}

// ================= PADDING =================
function padZero(data) {
  const out = [...data];
  while (out.length % BLOCK_SIZE !== 0) {
    out.push(0);
  }
  return out;
}

function removeTrailingZeros(text) {
  return text.replace(/\0+$/g, "");
}

// ================= MODE =================
function ECB(data, key, encryptMode) {
  const result = [];

  for (let i = 0; i < data.length; i += BLOCK_SIZE) {
    const block = data.slice(i, i + BLOCK_SIZE);
    const out = encryptMode ? encryptBlock(block, key) : decryptBlock(block, key);
    result.push(...out);
  }

  return result;
}

function CBC(data, key, iv, encryptMode) {
  const result = [];
  let prev = [...iv];

  for (let i = 0; i < data.length; i += BLOCK_SIZE) {
    const block = data.slice(i, i + BLOCK_SIZE);

    if (encryptMode) {
      const mixed = xor(block, prev);
      const cipher = encryptBlock(mixed, key);
      result.push(...cipher);
      prev = cipher;
    } else {
      const plainTemp = decryptBlock(block, key);
      const plain = xor(plainTemp, prev);
      result.push(...plain);
      prev = block;
    }
  }

  return result;
}

function CFB(data, key, iv, encryptMode) {
  const result = [];
  let prev = [...iv];

  for (let i = 0; i < data.length; i += BLOCK_SIZE) {
    const block = data.slice(i, i + BLOCK_SIZE);
    const stream = encryptBlock(prev, key);
    const out = xor(block, stream);

    result.push(...out);
    prev = encryptMode ? out : block;
  }

  return result;
}

// ================= UTIL =================
function getMode() {
  return document.getElementById("mode").value;
}

function getKey() {
  const keyText = document.getElementById("key").value.trim();

  if (!keyText) {
    throw new Error("Kunci tidak boleh kosong.");
  }

  const keyBytes = textToBytes(keyText);

  if (keyBytes.length < 8) {
    throw new Error("Kunci minimal 8 karakter.");
  }

  return keyBytes.slice(0, 8);
}

function getIV(mode) {
  if (mode === "ECB") {
    return new Array(8).fill(0);
  }

  const ivText = document.getElementById("iv").value.trim();

  if (!ivText) {
    throw new Error("IV tidak boleh kosong untuk CBC/CFB.");
  }

  const ivBytes = textToBytes(ivText);

  if (ivBytes.length < 8) {
    throw new Error("IV minimal 8 karakter untuk CBC/CFB.");
  }

  return ivBytes.slice(0, 8);
}

// ================= MAIN =================
function run(type) {
  try {
    const mode = getMode();
    const key = getKey();
    const iv = getIV(mode);
    const input = document.getElementById("inputText").value;

    if (!input.trim()) {
      throw new Error("Input tidak boleh kosong.");
    }

    let data;
    let out;

    if (type === "encrypt") {
      data = textToBytes(input);
      data = padZero(data);

      if (mode === "ECB") {
        out = ECB(data, key, true);
      } else if (mode === "CBC") {
        out = CBC(data, key, iv, true);
      } else {
        out = CFB(data, key, iv, true);
      }

      document.getElementById("outputText").value = bytesToBase64(out);
      document.getElementById("info").innerText = "Berhasil enkripsi";
    } else {
      data = base64ToBytes(input);

      if (mode === "ECB") {
        out = ECB(data, key, false);
      } else if (mode === "CBC") {
        out = CBC(data, key, iv, false);
      } else {
        out = CFB(data, key, iv, false);
      }

      const plainText = removeTrailingZeros(bytesToText(out));
      document.getElementById("outputText").value = plainText;
      document.getElementById("info").innerText = "Berhasil dekripsi";
    }
  } catch (e) {
    document.getElementById("outputText").value = "";
    document.getElementById("info").innerText = "Error: " + e.message;
  }
}

// ================= UI =================
function updateIVState() {
  const mode = getMode();
  const ivInput = document.getElementById("iv");
  const ivWrap = document.getElementById("ivWrap");
  const ivInfo = document.getElementById("ivInfo");

  if (mode === "ECB") {
    ivInput.disabled = true;
    ivWrap.classList.add("disabled");
    ivInfo.textContent = "Mode ECB tidak memakai IV.";
  } else {
    ivInput.disabled = false;
    ivWrap.classList.remove("disabled");
    ivInfo.textContent = "IV wajib diisi untuk mode CBC dan CFB.";
  }
}

// ================= EVENT =================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnEncrypt").addEventListener("click", () => run("encrypt"));
  document.getElementById("btnDecrypt").addEventListener("click", () => run("decrypt"));
  document.getElementById("mode").addEventListener("change", updateIVState);

  updateIVState();
});