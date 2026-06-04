function run(input) {
  // Extract the pet type option with a fallback to 'all'
  const petType = String(input?.trmnl?.plugin_settings?.custom_fields_values?.pet_type || input?.pet_type || 'all').trim().toLowerCase();

  // Dictionary of all supported APIs
  const petConfigs = {
    cats:     { name: 'HTTP Cats',        baseUrl: 'https://httpcats.com/',    favicon: 'https://httpcats.com/favicon.ico' },
    httpcats: { name: 'HTTP Cats',        baseUrl: 'https://http.cat/',        favicon: 'https://http.cat/favicon.ico' },
    dogs:     { name: 'HTTP Dogs',        baseUrl: 'https://http.dog/',        favicon: 'https://http.dog/favicon.ico' },
    goats:    { name: 'HTTP Goats',       baseUrl: 'https://httpgoats.com/',   favicon: 'https://httpgoats.com/favicon.ico' },
    ducks:    { name: 'HTTP Ducks',       baseUrl: 'https://httpducks.com/',   favicon: 'https://httpducks.com/favicon.ico' },
    fish:     { name: 'HTTP Fish',        baseUrl: 'https://http.fish/',       favicon: 'https://http.fish/favicon.ico' }
  };

  // "All" mode logic: pick a random API
  let activeKey = petType;
  if (activeKey === 'all') {
    const keys = Object.keys(petConfigs);
    activeKey = keys[Math.floor(Math.random() * keys.length)];
  }

  // Safe fallback for invalid values
  const activePet = petConfigs[activeKey] || petConfigs.cats;

  // 77 universal status codes guaranteed across all APIs
  const statuses = [
    [100, "Continue"], [101, "Switching Protocols"], [102, "Processing"], [103, "Early Hints"],
    [200, "OK"], [201, "Created"], [202, "Accepted"], [203, "Non-Authoritative Information"],
    [204, "No Content"], [205, "Reset Content"], [206, "Partial Content"], [207, "Multi-Status"],
    [208, "Already Reported"], [226, "IM Used"], [300, "Multiple Choices"], [301, "Moved Permanently"],
    [302, "Found"], [303, "See Other"], [304, "Not Modified"], [305, "Use Proxy"],
    [307, "Temporary Redirect"], [308, "Permanent Redirect"], [400, "Bad Request"],
    [401, "Unauthorized"], [402, "Payment Required"], [403, "Forbidden"], [404, "Not Found"],
    [405, "Method Not Allowed"], [406, "Not Acceptable"], [407, "Proxy Authentication Required"],
    [408, "Request Timeout"], [409, "Conflict"], [410, "Gone"], [411, "Length Required"],
    [412, "Precondition Failed"], [413, "Payload Too Large"], [414, "URI Too Long"],
    [415, "Unsupported Media Type"], [416, "Range Not Satisfiable"], [417, "Expectation Failed"],
    [418, "I'm a teapot"], [419, "Page Expired"], [420, "Enhance Your Calm"],
    [421, "Misdirected Request"], [422, "Unprocessable Entity"], [423, "Locked"],
    [424, "Failed Dependency"], [425, "Too Early"], [426, "Upgrade Required"],
    [428, "Precondition Required"], [429, "Too Many Requests"], [431, "Request Header Fields Too Large"],
    [444, "Connection Closed Without Response"], [450, "Blocked by Windows Parental Controls"],
    [451, "Unavailable For Legal Reasons"], [495, "SSL Certificate Error"],
    [496, "SSL Certificate Required"], [497, "HTTP Request Sent to HTTPS Port"],
    [498, "Invalid Token"], [499, "Client Closed Request"], [500, "Internal Server Error"],
    [501, "Not Implemented"], [502, "Bad Gateway"], [503, "Service Unavailable"],
    [504, "Gateway Timeout"], [506, "Variant Also Negotiates"], [507, "Insufficient Storage"],
    [508, "Loop Detected"], [509, "Bandwidth Limit Exceeded"], [510, "Not Extended"],
    [511, "Network Authentication Required"], [521, "Web Server Is Down"],
    [522, "Connection Timed Out"], [523, "Origin Is Unreachable"], [525, "SSL Handshake Failed"],
    [530, "Origin Hostname Resolution Error"], [599, "Network Connect Timeout Error"]
  ];

  const randomIndex = Math.floor(Math.random() * statuses.length);
  const [statusCode, statusTitle] = statuses[randomIndex];

  return {
    image_url: `${activePet.baseUrl}${statusCode}.jpg`,
    code: statusCode,
    title: statusTitle,
    favicon: activePet.favicon,
    plugin_name: activePet.name
  };
}
