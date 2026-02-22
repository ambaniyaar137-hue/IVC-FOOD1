
/**
 * Google Sheets Sync Service
 * Note: In a real production app, this should be handled via a backend proxy
 * to keep Service Account credentials secure.
 */

export const syncToGoogleSheets = async (type: 'ORDERS' | 'USERS' | 'TRANSACTIONS' | 'RIDERS', data: any) => {
  const isSyncEnabled = localStorage.getItem('admin_gsheet_sync') === 'true';
  if (!isSyncEnabled) return;

  console.log(`[GoogleSheets] Syncing ${type} data...`, data);
  
  // Simulated API call
  try {
    // In reality, you'd fetch your backend endpoint which uses googleapis
    // await fetch('/api/admin/sync-sheet', { method: 'POST', body: JSON.stringify({ type, data }) });
    return { success: true };
  } catch (error) {
    console.error('Google Sheets Sync Failed:', error);
    return { success: false };
  }
};

export const toggleGSheetSync = (enabled: boolean) => {
  localStorage.setItem('admin_gsheet_sync', String(enabled));
};
