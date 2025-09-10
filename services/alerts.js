// --- CONFIGURATION ---

// The original feed URL from the National Disaster Management Authority.
const ORIGINAL_URL = 'https://cap-feeds.s3.amazonaws.com/in.xml';

// The previous proxy (cors.sh) was causing 429 "Too Many Requests" errors.
// We are switching to allorigins.win, a more stable public proxy for this purpose.
// It fetches the data on its server and forwards it to us, bypassing browser CORS restrictions.
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(ORIGINAL_URL)}`;
const CAP_RSS_URL = PROXY_URL;


// --- HELPER FUNCTIONS ---

/**
 * A simple regex-based parser for CAP XML feeds.
 * @param {string} xmlString The XML content from the RSS feed.
 * @returns {Array} An array of parsed alert objects.
 */
function parseCapXml(xmlString) {
  const alerts = [];
  // Regex to find each <entry> block in the Atom feed
  const itemRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;

  while ((match = itemRegex.exec(xmlString)) !== null) {
    const entry = match[1];
    
    // Extract relevant fields from the entry
    const titleMatch = /<title>([\s\S]*?)<\/title>/.exec(entry);
    const summaryMatch = /<summary>([\s\S]*?)<\/summary>/.exec(entry);
    const idMatch = /<id>([\s\S]*?)<\/id>/.exec(entry);
    const severityMatch = /<cap:severity>([\s\S]*?)<\/cap:severity>/.exec(entry);
    const areaDescMatch = /<cap:areaDesc>([\s\S]*?)<\/cap:areaDesc>/.exec(entry);

    if (titleMatch && summaryMatch && idMatch) {
      alerts.push({
        id: idMatch[1],
        title: titleMatch[1].replace(/&amp;/g, '&'),
        summary: summaryMatch[1].replace(/&amp;/g, '&'),
        severity: severityMatch ? severityMatch[1] : 'Unknown',
        area: areaDescMatch ? areaDescMatch[1] : 'Multiple Regions',
        source: 'NDMA', // National Disaster Management Authority
      });
    }
  }
  return alerts;
}

// --- API FETCHING FUNCTIONS ---

/**
 * Fetches and combines alerts from all available sources.
 * Now only uses the public CAP feed via a CORS proxy.
 */
export async function fetchAllLiveAlerts() {
  try {
    const response = await fetch(CAP_RSS_URL);
    
    if (!response.ok) {
      // allorigins.win passes through the original status, so we can check it.
      throw new Error(`CAP RSS error: ${response.status} ${response.statusText}`);
    }
    const xmlText = await response.text();
    return parseCapXml(xmlText);
  } catch (error) {
    console.error("CAP API error:", error);
    // Provide a user-friendly mock error so the app doesn't crash.
    return [
      {
        id: 'error-1',
        title: 'Alerts Currently Unavailable',
        summary: 'Could not fetch live alerts at this time. Please check your internet connection or try again later.',
        severity: 'Moderate',
        area: 'All Regions',
        source: 'System',
      }
    ];
  }
}

/**
 * Sets up a polling interval to periodically refresh alerts.
 * @param {Function} onUpdate Callback function to execute with new alerts.
 * @param {number} intervalMinutes The interval in minutes to poll for new data.
 * @returns {Function} A cleanup function to stop the polling.
 */
export function setupAlertPolling(onUpdate, intervalMinutes = 5) {
  const intervalId = setInterval(async () => {
    console.log("Polling for new alerts via proxy...");
    const alerts = await fetchAllLiveAlerts();
    if (onUpdate) {
      onUpdate(alerts);
    }
  }, intervalMinutes * 60 * 1000);

  // Return a cleanup function to be used in useEffect
  return () => clearInterval(intervalId);
}
