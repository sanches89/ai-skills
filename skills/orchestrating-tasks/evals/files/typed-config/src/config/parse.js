const parsers = {
  string: (raw) => raw,
  number: (raw) => {
    const value = Number(raw);
    if (raw.trim() === "" || Number.isNaN(value)) throw invalid("number", raw);
    return value;
  },
  boolean: (raw) => {
    if (raw === "true") return true;
    if (raw === "false") return false;
    throw invalid("boolean", raw);
  },
};

function invalid(type, raw) {
  return new TypeError(`Expected a ${type}, got "${raw}"`);
}

export function parseValue(raw, type) {
  return parsers[type](raw);
}
