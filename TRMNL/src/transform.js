// Dictionary of all supported APIs
const PET_CONFIGS = {
  cats:     { name: 'HTTP Cats',  baseUrl: 'https://httpcats.com/' },
  httpcats: { name: 'HTTP Cats',  baseUrl: 'https://http.cat/' },
  dogs:     { name: 'HTTP Dogs',  baseUrl: 'https://http.dog/' },
  goats:    { name: 'HTTP Goats', baseUrl: 'https://httpgoats.com/' },
  ducks:    { name: 'HTTP Ducks', baseUrl: 'https://httpducks.com/' },
  fish:     { name: 'HTTP Fish',  baseUrl: 'https://http.fish/' }
};

const PET_KEYS = Object.keys(PET_CONFIGS);

// 77 universal status codes guaranteed across all APIs
const STATUSES = [
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

// BEGIN GENERATED IMAGE TONES
// Entries equal to the default [1, 1] are omitted: the lookup below falls back to [1, 1].
const IMAGE_TONES = {
  cats: {"100":[0.85,1],"101":[0.85,1],"102":[1.06,1],"203":[1.11,1],"204":[1.17,1],"205":[1.04,1],"208":[1.14,1],"226":[0.91,1],"302":[1.09,1],"303":[1.1,1],"404":[0.93,1],"405":[1.09,1],"407":[0.85,1],"408":[0.91,1],"409":[1.1,1],"410":[1.01,1],"411":[1.05,1],"412":[0.88,1],"413":[1.04,1],"414":[1.01,1],"415":[0.85,1],"416":[1.25,1],"417":[1.01,1],"418":[0.85,1],"419":[1.01,1],"421":[0.92,1],"422":[0.91,1],"425":[0.92,1],"426":[0.92,1],"450":[1.12,1],"495":[0.87,1],"497":[1.08,1],"500":[0.89,1],"503":[0.87,1],"506":[0.89,1],"508":[0.85,1],"509":[1.1,1],"511":[0.92,1],"521":[1.01,1],"522":[1.01,1],"523":[1.02,1],"525":[1.01,1],"530":[0.85,1]},
  httpcats: {"100":[0.9,1],"101":[1.25,1],"102":[1.25,1],"202":[1.04,1],"205":[1.09,1],"206":[1.02,1],"207":[1.09,1],"226":[1.11,1],"303":[0.93,1],"304":[1.07,1],"400":[1.01,1],"401":[1.05,1],"402":[1.1,1],"409":[1.12,1],"410":[1.02,1],"412":[1.18,1],"413":[1.17,1],"414":[1.25,1],"415":[1.11,1],"416":[0.91,1],"417":[1.07,1],"418":[0.93,1],"419":[0.85,1],"420":[1.22,1],"423":[1.09,1],"425":[0.92,1],"428":[1.03,1],"429":[1.15,1],"444":[0.9,1],"450":[1.16,1],"451":[1.07,1],"495":[1.25,1],"496":[1.15,1],"497":[0.92,1],"502":[1.09,1],"503":[1.03,1],"504":[1.11,1],"506":[1.09,1],"507":[1.01,1],"508":[1.17,1],"511":[1.23,1],"521":[1.08,1],"522":[1.16,1],"525":[1.1,1],"530":[0.87,1],"599":[0.93,1]},
  dogs: {"100":[0.89,1],"101":[1.09,1],"102":[0.91,1],"200":[0.9,1],"203":[1.01,1],"205":[0.89,1],"207":[0.89,1],"208":[1.04,1],"226":[0.87,1],"301":[0.85,1],"304":[0.93,1],"305":[0.92,1],"307":[0.91,1],"308":[0.88,1],"401":[1.12,1],"403":[1.1,1],"404":[1.13,1],"405":[0.89,1],"408":[1.08,1],"409":[1.05,1],"410":[1.22,1],"414":[0.9,1],"416":[0.93,1],"420":[0.89,1],"421":[0.86,1],"422":[1.08,1],"425":[1.15,1],"426":[1.08,1],"428":[0.93,1],"429":[1.08,1],"431":[1.03,1],"450":[1.11,1],"496":[1.05,1],"497":[1.03,1],"499":[0.86,1],"501":[0.92,1],"502":[1.08,1],"508":[0.85,1],"509":[0.91,1],"523":[1.12,1],"530":[0.85,1]},
  goats: {"100":[1.09,1],"101":[0.9,1],"102":[0.85,1],"200":[0.91,1],"201":[0.9,1],"203":[0.86,1],"204":[0.85,1],"205":[1.15,1],"207":[0.87,1],"208":[0.91,1],"300":[1.09,1],"301":[0.85,1],"302":[1.01,1],"303":[1.05,1],"307":[0.91,1],"402":[1.11,1],"406":[1.02,1],"408":[0.89,1],"409":[1.08,1],"410":[0.85,1],"413":[0.91,1],"414":[0.92,1],"416":[0.89,1],"421":[0.86,1],"422":[0.89,1],"424":[1.01,1],"425":[0.85,1],"429":[0.85,1],"444":[0.85,1],"450":[1.08,1],"495":[0.85,1],"499":[0.91,1],"501":[0.91,1],"503":[0.91,1],"506":[0.92,1],"508":[0.92,1],"522":[0.91,1],"525":[0.89,1],"530":[0.85,1],"599":[0.85,1]},
  ducks: {"100":[1.1,1],"101":[0.87,1],"102":[0.9,1],"103":[0.86,1],"201":[0.91,1],"203":[0.88,1],"204":[0.85,1],"205":[0.93,1],"206":[0.85,1],"207":[1.01,1],"226":[0.85,1],"300":[1.01,1],"301":[0.86,1],"305":[0.85,1],"400":[0.92,1],"401":[1.08,1],"402":[0.85,1],"403":[0.91,1],"405":[0.85,1],"406":[0.88,1],"408":[0.87,1],"414":[0.93,1],"415":[0.93,1],"416":[1.02,1],"420":[1.03,1],"422":[0.87,1],"425":[1.02,1],"429":[0.92,1],"431":[0.87,1],"444":[0.9,1],"450":[0.9,1],"451":[0.85,1],"495":[1.09,1],"496":[0.85,1],"497":[0.85,1],"498":[0.92,1],"500":[0.85,1],"501":[1.12,1],"503":[1.06,1],"504":[0.9,1],"506":[0.88,1],"507":[0.89,1],"508":[0.91,1],"509":[0.85,1],"510":[0.89,1],"511":[0.92,1],"525":[0.85,1],"530":[0.9,1],"599":[0.91,1]},
  fish: {"100":[1.15,1],"101":[0.85,1],"201":[0.86,1],"202":[1.24,1],"205":[1.07,1],"208":[1.1,1],"226":[0.88,1],"300":[1.07,1],"302":[0.89,1],"303":[1.08,1],"307":[1.12,1],"402":[0.92,1],"403":[0.9,1],"404":[0.85,1],"405":[0.85,1],"406":[1.01,1],"408":[1.07,1],"411":[1.25,1],"412":[0.88,1],"414":[1.16,1],"417":[1.08,1],"419":[0.91,1],"420":[1.05,1],"421":[1.1,1],"422":[1.01,1],"424":[1.04,1],"425":[1.1,1],"426":[0.93,1],"429":[1.16,1],"431":[1.06,1],"450":[0.93,1],"451":[1.12,1],"496":[1.04,1],"497":[1.11,1],"501":[0.88,1],"504":[1.1,1],"506":[1.25,1],"507":[0.89,1],"509":[1.02,1],"511":[1.02,1],"521":[0.87,1],"522":[1.01,1],"530":[0.85,1],"599":[1.01,1]}
};
// END GENERATED IMAGE TONES

function run(input) {
  // Extract the pet type option with a fallback to 'all'
  const petType = String(input?.trmnl?.plugin_settings?.custom_fields_values?.pet_type || input?.pet_type || 'all').trim().toLowerCase();

  let activeKey = petType;
  // "All" mode logic: pick a random API
  if (activeKey === 'all') {
    activeKey = PET_KEYS[Math.floor(Math.random() * PET_KEYS.length)];
  }

  // Safe fallback for invalid values
  if (!PET_KEYS.includes(activeKey)) activeKey = 'cats';
  const activePet = PET_CONFIGS[activeKey];
  const [statusCode, statusTitle] = STATUSES[Math.floor(Math.random() * STATUSES.length)];

  // Missing tones fall back to neutral: no brightness or contrast adjustment
  const [brightness, contrast] = IMAGE_TONES[activeKey]?.[statusCode] || [1, 1];

  return {
    brightness,
    contrast,
    image_url: `${activePet.baseUrl}${statusCode}.jpg`,
    code: statusCode,
    title: statusTitle,
    plugin_name: activePet.name
  };
}
