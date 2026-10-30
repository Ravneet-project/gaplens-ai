
const axios = require('axios');
const cheerio = require('cheerio');
const dns = require('node:dns').promises;
const net = require('node:net');
const https = require('node:https');

// =============================================
// GapLens AI - Secure Source Extractor
// =============================================

const MAX_REDIRECTS = 3;
const MAX_CONTENT_LENGTH = 2 * 1024 * 1024;
const REQUEST_TIMEOUT = 15000;

// =============================================
// Check Public IP Address
// =============================================

function isPublicIP(ip) {
  const version = net.isIP(ip);

  if (version === 4) {
    const [a, b, c] = ip.split('.').map(Number);

    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0 && c === 0) ||
      (a === 192 && b === 0 && c === 2) ||
      (a === 198 && (b === 18 || b === 19)) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    ) {
      return false;
    }

    return true;
  }

  if (version === 6) {
    const value = ip.toLowerCase();

    if (
      value === '::' ||
      value === '::1' ||
      value.startsWith('fc') ||
      value.startsWith('fd') ||
      /^fe[89ab]/.test(value) ||
      value.startsWith('2001:db8:') ||
      value.includes('.')
    ) {
      return false;
    }

    return true;
  }

  return false;
}

// =============================================
// Validate Website URL
// =============================================

function validateURL(input) {
  const url = new URL(input);

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    url.port ||
    !url.hostname.includes('.') ||
    url.hostname.endsWith('.local') ||
    net.isIP(url.hostname)
  ) {
    throw new Error(
      'Only public HTTPS website URLs are supported.'
    );
  }

  return url;
}

// =============================================
// Create DNS-Pinned HTTPS Agent
// =============================================

async function createSecureAgent(hostname) {
  const addresses = await dns.lookup(hostname, {
    all: true
  });

  if (
    !addresses.length ||
    addresses.some(
      item => !isPublicIP(item.address)
    )
  ) {
    throw new Error(
      'Website does not resolve to an allowed public IP.'
    );
  }

  const selected = addresses[0];

  const secureLookup = (requestedHost, options, callback) => {
    if (requestedHost !== hostname) {
      return callback(
        new Error('Unexpected DNS hostname.')
      );
    }

    // IMPORTANT FIX:
    // Node may request all addresses.
    if (options && options.all) {
      return callback(null, [
        {
          address: selected.address,
          family: selected.family
        }
      ]);
    }

    return callback(
      null,
      selected.address,
      selected.family
    );
  };

  return new https.Agent({
    keepAlive: false,
    lookup: secureLookup
  });
}

// =============================================
// Fetch HTML With Validated Redirects
// =============================================

async function fetchHTML(inputURL) {
  let currentURL = inputURL;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount++
  ) {
    const parsed = validateURL(currentURL);

    const agent = await createSecureAgent(
      parsed.hostname
    );

    const response = await axios.get(
      parsed.href,
      {
        timeout: REQUEST_TIMEOUT,
        maxRedirects: 0,
        maxContentLength: MAX_CONTENT_LENGTH,
        responseType: 'text',
        httpsAgent: agent,
        proxy: false,

        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; GapLensAI/1.0)',
          Accept:
            'text/html,application/xhtml+xml'
        },

        validateStatus: status =>
          (status >= 200 && status < 300) ||
          [301, 302, 303, 307, 308].includes(status)
      }
    );

    // Handle redirects safely.
    if (
      [301, 302, 303, 307, 308].includes(
        response.status
      )
    ) {
      const location = response.headers.location;

      if (!location) {
        throw new Error(
          'Redirect response has no destination.'
        );
      }

      if (redirectCount >= MAX_REDIRECTS) {
        throw new Error(
          'Too many website redirects.'
        );
      }

      const nextURL = new URL(
        location,
        parsed.href
      );

      // Destination is validated again
      // on the next loop iteration.
      validateURL(nextURL.href);

      console.log(
        '[EXTRACTOR] Redirect:',
        parsed.href,
        '->',
        nextURL.href
      );

      currentURL = nextURL.href;
      continue;
    }

    return {
      response,
      finalURL: parsed.href
    };
  }

  throw new Error(
    'Maximum redirects exceeded.'
  );
}

// =============================================
// Extract Website Content
// =============================================

async function extractSource(inputURL) {
  try {
    console.log(
      '\n[EXTRACTOR] Processing:',
      inputURL
    );

    const { response, finalURL } =
      await fetchHTML(inputURL);

    const contentType = String(
      response.headers['content-type'] || ''
    ).toLowerCase();

    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml+xml')
    ) {
      throw new Error(
        'The website did not return an HTML document.'
      );
    }

    const $ = cheerio.load(response.data);

    const title =
      $('title').first().text().trim() ||
      new URL(finalURL).hostname;

    const publishedAt =
      $('meta[property="article:published_time"]')
        .attr('content') ||
      $('meta[name="date"]').attr('content') ||
      null;

    const updatedAt =
      $('meta[property="article:modified_time"]')
        .attr('content') ||
      $('meta[name="last-modified"]')
        .attr('content') ||
      null;

    $(
      'script, style, nav, footer, header, iframe, noscript, svg'
    ).remove();

    const mainText =
      $('main').text().trim();

    const articleText =
      $('article').text().trim();

    const bodyText =
      $('body').text().trim();

    const rawText =
      mainText.length >= 80
        ? mainText
        : articleText.length >= 80
          ? articleText
          : bodyText;

    const content = rawText
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 12000);

    if (content.length < 50) {
      throw new Error(
        'Not enough readable content was found.'
      );
    }

    console.log(
      '[EXTRACTOR] SUCCESS:',
      title
    );

    console.log(
      '[EXTRACTOR] Characters:',
      content.length
    );

    return {
      url: finalURL,
      title,
      content,
      publishedAt,
      updatedAt,
      status: 'success'
    };

  } catch (error) {
    console.error(
      '[EXTRACTOR] FAILED:',
      inputURL,
      '|',
      error.message
    );

    return {
      url: inputURL,
      title: 'Unavailable source',
      content: '',
      publishedAt: null,
      updatedAt: null,
      status: 'failed',
      error: error.message
    };
  }
}

// =============================================
// Export
// =============================================

module.exports = {
  extractSource
};
