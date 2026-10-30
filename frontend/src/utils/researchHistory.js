
const STORAGE_KEY = 'gaplens_research_history';
const MAX_HISTORY = 50;

// ========================================
// Get All Saved Research
// ========================================

export function getResearchHistory() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];

  } catch (error) {
    console.error(
      '[GapLens] Unable to load history:',
      error
    );

    return [];
  }
}

// ========================================
// Save Completed Research
// ========================================

export function saveResearchHistory(result) {
  if (
    !result ||
    result.success !== true ||
    !result.question ||
    !result.analysis
  ) {
    console.warn(
      '[GapLens] Invalid research result. Not saved.'
    );

    return null;
  }

  try {
    const history = getResearchHistory();

    const entry = {
      ...result,

      id: crypto.randomUUID(),

      savedAt: new Date().toISOString()
    };

    const updated = [
      entry,
      ...history
    ].slice(0, MAX_HISTORY);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event('gaplens:history-updated')
    );

    console.log(
      '[GapLens] Research saved successfully.'
    );

    return entry;

  } catch (error) {
    console.error(
      '[GapLens] Failed to save research:',
      error
    );

    return null;
  }
}

// ========================================
// Get Single Investigation
// ========================================

export function getResearchById(id) {
  return getResearchHistory().find(
    item => String(item.id) === String(id)
  ) || null;
}

// ========================================
// Delete One Investigation
// ========================================

export function deleteResearchHistory(id) {
  try {
    const history = getResearchHistory();

    const updated = history.filter(
      item => String(item.id) !== String(id)
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event('gaplens:history-updated')
    );

    return true;

  } catch (error) {
    console.error(
      '[GapLens] Failed to delete research:',
      error
    );

    return false;
  }
}

// ========================================
// Clear All Research History
// ========================================

export function clearResearchHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);

    window.dispatchEvent(
      new Event('gaplens:history-updated')
    );

    return true;

  } catch (error) {
    console.error(
      '[GapLens] Failed to clear history:',
      error
    );

    return false;
  }
}
