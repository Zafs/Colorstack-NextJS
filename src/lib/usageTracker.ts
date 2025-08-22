export interface UsageData {
  exportCount: number;
  lastReset: string; // ISO date string
}

export class UsageTracker {
  private static getStorageKey(visitorId: string): string {
    return `cs_usage_${visitorId}`;
  }

  private static isNewDay(lastReset: string): boolean {
    const lastResetDate = new Date(lastReset);
    const now = new Date();
    
    // Reset if it's a different day (ignoring time)
    return (
      lastResetDate.getFullYear() !== now.getFullYear() ||
      lastResetDate.getMonth() !== now.getMonth() ||
      lastResetDate.getDate() !== now.getDate()
    );
  }

  static getCurrentUsage(visitorId: string): UsageData {
    if (!visitorId) {
      return { exportCount: 0, lastReset: new Date().toISOString() };
    }

    try {
      const key = this.getStorageKey(visitorId);
      const stored = localStorage.getItem(key);
      
      if (!stored) {
        const initialData: UsageData = {
          exportCount: 0,
          lastReset: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(initialData));
        return initialData;
      }

      const data: UsageData = JSON.parse(stored);
      
      // Check if we need to reset for a new day
      if (this.isNewDay(data.lastReset)) {
        const resetData: UsageData = {
          exportCount: 0,
          lastReset: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(resetData));
        return resetData;
      }

      return data;
    } catch (error) {
      console.error('Error reading usage data:', error);
      return { exportCount: 0, lastReset: new Date().toISOString() };
    }
  }

  static incrementExportCount(visitorId: string): void {
    if (!visitorId) return;

    try {
      const currentUsage = this.getCurrentUsage(visitorId);
      const key = this.getStorageKey(visitorId);
      
      const updatedUsage: UsageData = {
        ...currentUsage,
        exportCount: currentUsage.exportCount + 1
      };
      
      localStorage.setItem(key, JSON.stringify(updatedUsage));
    } catch (error) {
      console.error('Error incrementing export count:', error);
    }
  }

  static resetUsage(visitorId: string): void {
    if (!visitorId) return;

    try {
      const key = this.getStorageKey(visitorId);
      const resetData: UsageData = {
        exportCount: 0,
        lastReset: new Date().toISOString()
      };
      localStorage.setItem(key, JSON.stringify(resetData));
    } catch (error) {
      console.error('Error resetting usage:', error);
    }
  }
}
