/**
 * @param value {any || {toHexString}}
 *
 * @return boolean
 */
function isHexable(value) {
  return !!(value.toHexString);
}

/**
 * @param array {Uint8Array}
 *
 * @return {Uint8Array}
 * */
function addSlice(array) {
  if (array.slice) return array;

  array.slice = function() {
    const args = Array.prototype.slice.call(arguments);
    return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
  }

  return array;
}

/**
 * @param value {any}
 *
 * @return {boolean}
 */
export function isBytesLike(value){
  return ((isHexString(value) && !(value.length % 2)) || isBytes(value));
}

/**
 * @param value {number}
 *
 * @return {boolean}
 * */
function isInteger(value) {
  return (typeof(value) === "number" && value == value && (value % 1) === 0);
}

/**
 * @param value {any}
 *
 * @return {boolean}
 */
export function isBytes(value) {
  if (value == null) { return false; }

  if (value.constructor === Uint8Array) { return true; }
  if (typeof(value) === "string") { return false; }
  if (!isInteger(value.length) || value.length < 0) { return false; }

  for (let i = 0; i < value.length; i++) {
    const v = value[i];
    if (!isInteger(v) || v < 0 || v >= 256) { return false; }
  }
  return true;
}

/**
 * @param value {any || {toHexString}}
 * @param options {{
 *   allowMissingPrefix?: boolean;
 *   hexPad?: "left" | "right" | null;
 * }=}
 *
 * @return {Uint8Array}
 * */
export function arrayify(value, options) {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    console.info("invalid arrayify value", value);

    const result = [];
    while (value) {
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256));
    }
    if (result.length === 0) { result.push(0); }

    return addSlice(new Uint8Array(result));
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { value = value.toHexString(); }

  if (isHexString(value)) {
    let hex = (value).substring(2);
    if (hex.length % 2) {
      if (options.hexPad === "left") {
        hex = "0" + hex;
      } else if (options.hexPad === "right") {
        hex += "0";
      } else {
        logAndThrow("hex data is odd-length", value);
      }
    }

    const result = [];
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return addSlice(new Uint8Array(result));
  }

  if (isBytes(value)) {
    return addSlice(new Uint8Array(value));
  }

  logAndThrow("invalid arrayify value", value);
}

/**
 * @param items {number[] || string[]}
 *
 * @return {Uint8Array}
 * */
export function concat(items) {
  const objects = items.map(item => arrayify(item));
  const length = objects.reduce((accum, item) => (accum + item.length), 0);

  const result = new Uint8Array(length);

  objects.reduce((offset, object) => {
    result.set(object, offset);
    return offset + object.length;
  }, 0);

  return addSlice(result);
}

/**
 * @param value {number[]}
 *
 * @return {Uint8Array}
 * */
export function stripZeros(value) {
  let result = arrayify(value);

  if (result.length === 0) { return result; }

  // Find the first non-zero entry
  let start = 0;
  while (start < result.length && result[start] === 0) { start++ }

  // If we started with zeros, strip them
  if (start) {
    result = result.slice(start);
  }

  return result;
}

/**
 * @param value {number[] || Uint8Array}
 * @param length {number}
 *
 * @return {Uint8Array}
 * */
export function zeroPad(value, length) {
  value = arrayify(value);

  if (value.length > length) {
    logAndThrow("value out of range", arguments[0]);
  }

  const result = new Uint8Array(length);
  result.set(value, length - value.length);
  return addSlice(result);
}

/**
 * @param value {any}
 * @param length {number=}
 *
 * @return {boolean}
 * */
export function isHexString(value, length) {
  if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) return false;

  return !(length && value.length !== 2 + 2 * length);
}

const HexCharacters = "0123456789abcdef";

/**
 * @param value {number[] || string || number || bigint || Uint8Array || {toHexString}}
 * @param options {{
 *   allowMissingPrefix?: boolean;
 *   hexPad?: "left" | "right" | null;
 * }=}
 *
 * @return {string}
 * */
export function hexlify(value, options) {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    console.info("invalid hexlify value", value);

    let hex = "";
    while (value) {
      hex = HexCharacters[value & 0xf] + hex;
      value = Math.floor(value / 16);
    }

    if (hex.length) {
      if (hex.length % 2) hex = "0" + hex;

      return "0x" + hex;
    }

    return "0x00";
  }

  if (typeof(value) === "bigint") {
    value = value.toString(16);
    if (value.length % 2) { return ("0x0" + value); }
    return "0x" + value;
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { return value.toHexString(); }

  if (isHexString(value)) {
    if ((String(value)).length % 2) {
      if (options.hexPad === "left") {
        value = "0x0" + value.substring(2);
      } else if (options.hexPad === "right") {
        value += "0";
      } else {
        logAndThrow("hex data is odd-length", value);
      }
    }
    return (value).toLowerCase();
  }

  if (isBytes(value)) {
    let result = "0x";
    for (let i = 0; i < value.length; i++) {
      let v = value[i];
      result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
  }

  return logAndThrow("invalid hexlify value", value);
}

/**
 * @param data {string | number[]}
 *
 * @return {number|null}
 * */
export function hexDataLength(data) {
  if (typeof(data) !== "string") {
    data = hexlify(data);
  } else if (!isHexString(data) || (data.length % 2)) {
    return null;
  }

  return (data.length - 2) / 2;
}

/**
 * @param data {number[] | string}
 * @param offset {number}
 * @param endOffset {number=}
 *
 * @return {string}
 * */
export function hexDataSlice(data, offset, endOffset) {
  if (typeof(data) !== "string") {
    data = hexlify(data);
  } else if (!isHexString(data) || (data.length % 2)) {
    logAndThrow("invalid hexData", data );
  }

  offset = 2 + 2 * offset;

  if (endOffset != null) {
    return "0x" + data.substring(offset, 2 + 2 * endOffset);
  }

  return "0x" + data.substring(offset);
}

/**
 * @param items {number[]}
 *
 * @return {string}
 * */
export function hexConcat(items) {
  let result = "0x";
    items.forEach((item) => {
    result += hexlify(item).substring(2);
  });

  return result;
}

/**
 * @param value {number[] || number || bigint}
 *
 * @return {string}
 * */
export function hexValue(value) {
  const trimmed = hexStripZeros(hexlify(value, { hexPad: "left" }));
  if (trimmed === "0x") { return "0x0"; }
  return trimmed;
}

/**
 * @param value {number[] | string}
 *
 * @return {string}
 * */
export function hexStripZeros(value) {
  if (typeof(value) !== "string") { value = hexlify(value); }

  if (!isHexString(value)) {
    logAndThrow("invalid hex string", value);
  }
  value = value.substring(2);
  let offset = 0;
  while (offset < value.length && value[offset] === "0") { offset++; }
  return "0x" + value.substring(offset);
}

/**
 * @param value {number[] || string}
 * @param length {number}
 *
 * @return {string}
 * */
export function hexZeroPad(value, length) {
  if (typeof(value) !== "string") {
    value = hexlify(value);
  } else if (!isHexString(value)) {
    logAndThrow("invalid hex string", value);
  }

  if (value.length > 2 * length + 2) {
    logAndThrow("value out of range", arguments[1]);
  }

  while (value.length < 2 * length + 2) {
    value = "0x0" + value.substring(2);
  }

  return value;
}

/**
 * @param signature {{
 *     r: string;
 *     s?: string;
 *     _vs?: string,
 *     recoveryParam?: number;
 *     v?: number;
 * } || number[]}
 *
 * @return {{
 *     r: string;
 *     s?: string;
 *     _vs?: string,
 *     recoveryParam?: number;
 *     v?: number;
 * } || number[]}
 * */
export function splitSignature(signature) {

  const result = {
    r: "0x",
    s: "0x",
    _vs: "0x",
    recoveryParam: 0,
    v: 0,
    yParityAndS: "0x",
    compact: "0x"
  };

  if (isBytesLike(signature)) {
    let bytes = arrayify(signature);

    // Get the r, s and v
    if (bytes.length === 64) {
      // EIP-2098; pull the v from the top bit of s and clear it
      result.v = 27 + (bytes[32] >> 7);
      bytes[32] &= 0x7f;

      result.r = hexlify(bytes.slice(0, 32));
      result.s = hexlify(bytes.slice(32, 64));

    } else if (bytes.length === 65) {
      result.r = hexlify(bytes.slice(0, 32));
      result.s = hexlify(bytes.slice(32, 64));
      result.v = bytes[64];
    } else {
      logAndThrow("invalid signature string", signature);
    }


    // Allow a recid to be used as the v
    if (result.v < 27) {
      if (result.v === 0 || result.v === 1) {
        result.v += 27;
      } else {
        logAndThrow("signature invalid v byte", signature);
      }
    }

    // Compute recoveryParam from v
    result.recoveryParam = 1 - (result.v % 2);

    // Compute _vs from recoveryParam and s
    if (result.recoveryParam) { bytes[32] |= 0x80; }
    result._vs = hexlify(bytes.slice(32, 64))

  } else {
    result.r = signature.r;
    result.s = signature.s;
    result.v = signature.v;
    result.recoveryParam = signature.recoveryParam;
    result._vs = signature._vs;

    // If the _vs is available, use it to populate missing s, v and recoveryParam
    // and verify non-missing s, v and recoveryParam
    if (result._vs != null) {
      const vs = zeroPad(arrayify(result._vs), 32);
      result._vs = hexlify(vs);

      // Set or check the recid
      const recoveryParam = ((vs[0] >= 128) ? 1: 0);
      if (result.recoveryParam == null) {
        result.recoveryParam = recoveryParam;
      } else if (result.recoveryParam !== recoveryParam) {
        logAndThrow("signature recoveryParam mismatch _vs", signature);
      }

      // Set or check the s
      vs[0] &= 0x7f;
      const s = hexlify(vs);
      if (result.s == null) {
        result.s = s;
      } else if (result.s !== s) {
        logAndThrow("signature v mismatch _vs", signature);
      }
    }

    // Use recid and v to populate each other
    if (result.recoveryParam == null) {
      if (result.v == null) {
        logAndThrow("signature missing v and recoveryParam", signature);
      } else if (result.v === 0 || result.v === 1) {
        result.recoveryParam = result.v;
      } else {
        result.recoveryParam = 1 - (result.v % 2);
      }
    } else {
      if (result.v == null) {
        result.v = 27 + result.recoveryParam;
      } else {
        const recId = (result.v === 0 || result.v === 1) ? result.v :(1 - (result.v % 2));
        if (result.recoveryParam !== recId) {
          logAndThrow("signature recoveryParam mismatch v", signature);
        }
      }
    }

    if (result.r == null || !isHexString(result.r)) {
      logAndThrow("signature missing or invalid r", signature);
    } else {
      result.r = hexZeroPad(result.r, 32);
    }

    if (result.s == null || !isHexString(result.s)) {
      logAndThrow("signature missing or invalid s", signature);
    } else {
      result.s = hexZeroPad(result.s, 32);
    }

    const vs = arrayify(result.s);
    if (vs[0] >= 128) {
      logAndThrow("signature s out of range", signature);
    }
    if (result.recoveryParam) { vs[0] |= 0x80; }
    const _vs = hexlify(vs);

    if (result._vs) {
      if (!isHexString(result._vs)) {
        logAndThrow("signature invalid _vs", signature);
      }
      result._vs = hexZeroPad(result._vs, 32);
    }

    // Set or check the _vs
    if (result._vs == null) {
      result._vs = _vs;
    } else if (result._vs !== _vs) {
      logAndThrow("signature _vs mismatch v and s", signature);
    }
  }

  result.yParityAndS = result._vs;
  result.compact = result.r + result.yParityAndS.substring(2);

  return result;
}

/**
 * @param signature {{
 *     r: string;
 *     s?: string;
 *     _vs?: string,
 *     recoveryParam?: number;
 *     v?: number;
 * } || number[]}
 *
 * @return {string}
 * */
export function joinSignature(signature) {
  signature = splitSignature(signature);

  return hexlify(concat([
    signature.r,
    signature.s,
    (signature.recoveryParam ? "0x1c": "0x1b")
  ]));
}

/**
 * @param message {string}
 * @param value {any=}
 *
 * @throws {Error}
 * */
function logAndThrow(message, value) {
  console.error(message, {value});
  throw Error(JSON.stringify({ message, value }));
}