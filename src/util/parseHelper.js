// For stringyfying arrays with objects for saving in DB
export function normalizeAndStringifyArray(input, schema) {
  if (!input || !Array.isArray(input)) return input;

  const cleaned = input.map(item => {
    const obj = typeof item === 'string' ? JSON.parse(item) : item;

    return Object.fromEntries(
      Object.entries(schema).map(([key, defaultVal]) => [key, String(obj[key] ?? defaultVal ?? '')])
    );
  });

  return JSON.stringify(cleaned);
}

// For parsing stringified arrays, used both to parse initialValues as well as before displaying data
export function parseToObjectArray(input) {
  try {
    if (!input) return [];

    const parsed = Array.isArray(input) ? input : JSON.parse(input);

    if (!Array.isArray(parsed)) return [];

    return parsed.map(item => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch {
          return {};
        }
      }
      return item || {};
    });
  } catch {
    return [];
  }
}
