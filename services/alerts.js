// Live Alert Sources for India
const IMD_BASE_URL = 'https://mausam.imd.gov.in/api';
const SACHET_CAP_BASE = 'https://sachet.ndma.gov.in';

// IMD District Warning API
export async function fetchIMDWarnings({ districtId = null, stateId = null } = {}) {
  try {
    let url = `${IMD_BASE_URL}/warnings_district_api.php`;
    if (districtId) {
      url += `?id=${districtId}`;
    } else if (stateId) {
      url += `?state_id=${stateId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'DisasterPrepApp/1.0'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`IMD API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      source: 'IMD',
      items: data.map(item => ({
        id: `imd_${item.id || Date.now()}`,
        title: `🌦️ ${item.warning_type || 'Weather Warning'}`,
        summary: item.warning_message || item.description || 'Weather alert from IMD',
        severity: item.severity || 'moderate',
        area: item.district_name || item.area,
        validFrom: item.valid_from,
        validTo: item.valid_to,
        source: 'India Meteorological Department'
      }))
    };
  } catch (error) {
    console.log('IMD API error:', error);
    return null;
  }
}

// NDMA CAP Alerts
export async function fetchCAPAlerts(state = null) {
  try {
    // CAP RSS feeds by state
    const rssUrls = {
      'punjab': 'https://sachet.ndma.gov.in/cap_public_website/FeedCapRss.do?state=Punjab',
      'delhi': 'https://sachet.ndma.gov.in/cap_public_website/FeedCapRss.do?state=Delhi',
      'maharashtra': 'https://sachet.ndma.gov.in/cap_public_website/FeedCapRss.do?state=Maharashtra',
      'karnataka': 'https://sachet.ndma.gov.in/cap_public_website/FeedCapRss.do?state=Karnataka',
      'all': 'https://sachet.ndma.gov.in/cap_public_website/FeedCapRss.do'
    };

    const rssUrl = rssUrls[state?.toLowerCase()] || rssUrls['all'];
    
    const response = await fetch(rssUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/rss+xml, application/xml, text/xml',
        'User-Agent': 'DisasterPrepApp/1.0'
      },
      timeout: 15000
    });

    if (!response.ok) {
      throw new Error(`CAP RSS error: ${response.status}`);
    }

    const xmlText = await response.text();
    const alerts = parseCapRSS(xmlText);
    
    return {
      source: 'NDMA_CAP',
      items: alerts
    };
  } catch (error) {
    console.log('CAP API error:', error);
    return null;
  }
}

// Parse CAP RSS XML
function parseCapRSS(xmlText) {
  try {
    const alerts = [];
    
    // Simple XML parsing for RSS items
    const itemRegex = /<item>(.*?)<\/item>/gs;
    const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/s;
    const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>/s;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/s;
    const linkRegex = /<link>(.*?)<\/link>/s;

    let match;
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemXml = match[1];
      
      const titleMatch = titleRegex.exec(itemXml);
      const descMatch = descRegex.exec(itemXml);
      const pubDateMatch = pubDateRegex.exec(itemXml);
      const linkMatch = linkRegex.exec(itemXml);
      
      if (titleMatch) {
        alerts.push({
          id: `cap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: `⚠️ ${titleMatch[1].trim()}`,
          summary: descMatch ? descMatch[1].trim().substring(0, 200) + '...' : 'Disaster alert from NDMA',
          publishedAt: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
          link: linkMatch ? linkMatch[1] : null,
          source: 'National Disaster Management Authority'
        });
      }
    }
    
    return alerts.slice(0, 10); // Return latest 10 alerts
  } catch (error) {
    console.log('RSS parsing error:', error);
    return [];
  }
}

// Combined live alerts function - NO MORE DEMO ALERTS
export async function fetchAllLiveAlerts(userLocation = 'Punjab') {
  try {
    const [imdWarnings, capAlerts] = await Promise.all([
      fetchIMDWarnings().catch(() => null),
      fetchCAPAlerts(userLocation).catch(() => null)
    ]);

    const allAlerts = [];
    
    if (imdWarnings?.items?.length) allAlerts.push(...imdWarnings.items);
    if (capAlerts?.items?.length) allAlerts.push(...capAlerts.items);

    // Sort by date/time, most recent first
    return allAlerts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.validFrom || a.validTime);
      const dateB = new Date(b.publishedAt || b.validFrom || b.validTime);
      return dateB - dateA;
    }).slice(0, 15); // Return latest 15 alerts

  } catch (error) {
    console.log('Combined alerts error:', error);
    return []; // Return empty array instead of demo alerts
  }
}

// Auto-refresh alerts function
export function setupAlertPolling(callback, intervalMinutes = 5) {
  const pollAlerts = async () => {
    try {
      const alerts = await fetchAllLiveAlerts();
      callback(alerts);
    } catch (error) {
      console.log('Alert polling error:', error);
      callback([]); // Return empty array instead of demo alerts
    }
  };

  // Initial fetch
  pollAlerts();

  // Set up interval polling
  const intervalId = setInterval(pollAlerts, intervalMinutes * 60 * 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

// Keep demo alerts function for testing only (not used in production)
export function demoAlerts() {
  return [
    {
      id: 'demo-imd-1',
      title: '🌧️ Heavy Rainfall Warning - Punjab',
      summary: 'IMD has issued heavy to very heavy rainfall warning for Punjab. Expected rainfall: 65-115mm. Avoid low-lying areas and waterlogged roads.',
      source: 'India Meteorological Department',
      validFrom: new Date().toISOString(),
      severity: 'high'
    }
  ];
}
