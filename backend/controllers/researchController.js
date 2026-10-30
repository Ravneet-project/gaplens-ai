
const { extractSource } = require('../services/sourceExtractor');
const { analyzeWithAI } = require('../services/aiAnalyzer');

// ============================================
// GapLens AI - Research Analysis Controller
// ============================================

async function analyzeResearch(req, res) {
  try {
    const { question, urls } = req.body || {};

    // ============================================
    // 1. Validate Research Input
    // ============================================

    if (
      typeof question !== 'string' ||
      question.trim().length < 10 ||
      question.length > 1000 ||
      !Array.isArray(urls) ||
      urls.length < 1 ||
      urls.length > 5 ||
      urls.some(
        url =>
          typeof url !== 'string' ||
          url.length > 2048 ||
          !url.trim()
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a research question and 1–5 valid source URLs.'
      });
    }

    console.log('\n======================================');
    console.log('GapLens AI - New Research Request');
    console.log('======================================');
    console.log('Question:', question.trim());
    console.log('Total URLs:', urls.length);

    // ============================================
    // 2. Extract Website Information
    // ============================================

    console.log('\n[STEP 1] Extracting research sources...');

    const sources = await Promise.all(
      urls.map(async (url, index) => {
        const source = await extractSource(url.trim());

        return {
          ...source,
          sourceId: index + 1
        };
      })
    );

    const validSources = sources.filter(
      source => source.status === 'success'
    );

    const failedSources = sources.filter(
      source => source.status !== 'success'
    );

    console.log('Total sources:', sources.length);
    console.log('Successful sources:', validSources.length);
    console.log('Failed sources:', failedSources.length);

    failedSources.forEach(source => {
      console.warn(
        `Source ${source.sourceId} failed:`,
        source.error || 'Unknown extraction error'
      );
    });

    // Remove extracted page content from API response
    const sourceMetadata = sources.map(
      ({ content, ...metadata }) => metadata
    );

    // ============================================
    // 3. Check Available Sources
    // ============================================

    if (!validSources.length) {
      console.error('No readable research sources found.');

      return res.status(422).json({
        success: false,
        message:
          'Unable to read the provided websites. Please try a publicly accessible HTTPS article.',
        sources: sourceMetadata
      });
    }

    // ============================================
    // 4. Analyze Sources Using Groq AI
    // ============================================

    console.log('\n[STEP 2] Sending sources to Groq AI...');

    const analysis = await analyzeWithAI(
      question.trim(),
      validSources
    );

    if (!analysis || typeof analysis !== 'object') {
      throw new Error('Groq AI returned an invalid analysis object.');
    }

    console.log('[STEP 3] AI analysis received successfully.');

    // ============================================
    // 5. Validate Source References
    // ============================================

    const validIds = new Set(
      validSources.map(source => source.sourceId)
    );

    const cleanIds = ids => {
      if (!Array.isArray(ids)) {
        return [];
      }

      return [
        ...new Set(
          ids
            .map(Number)
            .filter(id =>
              Number.isInteger(id) &&
              validIds.has(id)
            )
        )
      ];
    };

    const cleanFindings = (items, minimumSources = 0) => {
      if (!Array.isArray(items)) {
        return [];
      }

      return items
        .filter(
          item =>
            item &&
            typeof item === 'object' &&
            !Array.isArray(item)
        )
        .map(item => ({
          ...item,
          sourceIds: cleanIds(item.sourceIds)
        }))
        .filter(
          item => item.sourceIds.length >= minimumSources
        );
    };

    // ============================================
    // 6. Prepare Safe AI Analysis
    // ============================================

    const safeAnalysis = {
      summary: String(analysis.summary || ''),

      keyFacts: cleanFindings(
        analysis.keyFacts,
        1
      ),

      gaps: cleanFindings(
        analysis.gaps,
        0
      ),

      conflicts: cleanFindings(
        analysis.conflicts,
        2
      ),

      outdatedWarnings: cleanFindings(
        analysis.outdatedWarnings,
        1
      ),

      checklist: Array.isArray(analysis.checklist)
        ? analysis.checklist.filter(
            item =>
              item &&
              typeof item === 'object' &&
              typeof item.task === 'string'
          )
        : [],

      uncertainty: String(
        analysis.uncertainty ||
        'AI findings may be incomplete. Verify important claims against original sources.'
      )
    };

    // ============================================
    // 7. Log Analysis Summary
    // ============================================

    console.log('\n========== ANALYSIS SUMMARY ==========');
    console.log('Key facts:', safeAnalysis.keyFacts.length);
    console.log('Potential gaps:', safeAnalysis.gaps.length);
    console.log('Possible conflicts:', safeAnalysis.conflicts.length);
    console.log(
      'Outdated warnings:',
      safeAnalysis.outdatedWarnings.length
    );
    console.log(
      'Verification tasks:',
      safeAnalysis.checklist.length
    );
    console.log('======================================\n');

    // ============================================
    // 8. Return Results to React Frontend
    // ============================================

    return res.status(200).json({
      success: true,
      message: 'Research analysis completed successfully.',
      question: question.trim(),
      sources: sourceMetadata,
      analysis: safeAnalysis,
      analyzedAt: new Date().toISOString()
    });

  } catch (error) {

    // ============================================
    // 9. Detailed Error Logging
    // ============================================

    const status =
      error.status ||
      error.response?.status ||
      null;

    console.error('\n========== GAPLENS AI ERROR ==========');
    console.error('Message:', error.message);
    console.error('Status:', status || 'N/A');

    if (error.error) {
      console.error('Groq details:', error.error);
    }

    if (error.response?.data) {
      console.error('Response details:', error.response.data);
    }

    console.error('======================================\n');

    // ============================================
    // 10. User-Friendly Error Messages
    // ============================================

    let message = 'Unable to complete research analysis.';

    let responseStatus = 500;

    if (status === 401 || status === 403) {
      message =
        'Groq API authentication failed. Please verify your API key and permissions.';

      responseStatus = 502;

    } else if (status === 404) {
      message =
        'The configured Groq AI model was not found. Check GROQ_MODEL in your .env file.';

      responseStatus = 502;

    } else if (status === 429) {
      message =
        'Groq API rate limit reached. Please wait and try again.';

      responseStatus = 429;

    } else if (status === 400) {
      message =
        'Groq rejected the analysis request. Check the backend terminal for details.';

      responseStatus = 502;

    } else if (error instanceof SyntaxError) {
      message =
        'Groq AI returned an invalid JSON response. Please retry the analysis.';

      responseStatus = 502;

    } else if (
      error.message?.includes('GROQ_API_KEY') ||
      error.message?.includes('Groq API key')
    ) {
      message =
        'Groq API key is missing or not configured in the backend .env file.';

      responseStatus = 500;
    }

    return res.status(responseStatus).json({
      success: false,
      message
    });
  }
}

module.exports = {
  analyzeResearch
};
