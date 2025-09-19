// Simple local storage service with error handling

export interface StorageItem<T = any> {
  data: T
  timestamp: string
  version: string
  checksum?: string
}

export interface StorageOptions {
  version?: string
  encrypt?: boolean
  compress?: boolean
  ttl?: number // Time to live in milliseconds
}

export class LocalStorageService {
  private static readonly DEFAULT_VERSION = '1.0.0'
  private static readonly STORAGE_PREFIX = 'innovo_'

  /**
   * Save data to localStorage with metadata
   */
  static save<T>(key: string, data: T, options: StorageOptions = {}): boolean {
    try {
      const storageKey = this.getStorageKey(key)
      const storageItem: StorageItem<T> = {
        data,
        timestamp: new Date().toISOString(),
        version: options.version || this.DEFAULT_VERSION,
        checksum: options.encrypt ? this.generateChecksum(data) : undefined
      }

      const serializedData = JSON.stringify(storageItem)
      localStorage.setItem(storageKey, serializedData)
      
      console.log(`Data saved to localStorage: ${key}`)
      return true
    } catch (error) {
      console.error(`Error saving data to localStorage (${key}):`, error)
      return false
    }
  }

  /**
   * Load data from localStorage with validation
   */
  static load<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const storageKey = this.getStorageKey(key)
      const serializedData = localStorage.getItem(storageKey)
      
      if (!serializedData) {
        return null
      }

      const storageItem: StorageItem<T> = JSON.parse(serializedData)
      
      // Check if data has expired
      if (options.ttl && this.isExpired(storageItem.timestamp, options.ttl)) {
        this.remove(key)
        return null
      }

      // Validate checksum if encryption was used
      if (options.encrypt && storageItem.checksum) {
        const currentChecksum = this.generateChecksum(storageItem.data)
        if (currentChecksum !== storageItem.checksum) {
          console.warn(`Data integrity check failed for key: ${key}`)
          this.remove(key)
          return null
        }
      }

      return storageItem.data
    } catch (error) {
      console.error(`Error loading data from localStorage (${key}):`, error)
      this.remove(key) // Remove corrupted data
      return null
    }
  }

  /**
   * Remove data from localStorage
   */
  static remove(key: string): boolean {
    try {
      const storageKey = this.getStorageKey(key)
      localStorage.removeItem(storageKey)
      console.log(`Data removed from localStorage: ${key}`)
      return true
    } catch (error) {
      console.error(`Error removing data from localStorage (${key}):`, error)
      return false
    }
  }

  /**
   * Check if data exists in localStorage
   */
  static exists(key: string): boolean {
    const storageKey = this.getStorageKey(key)
    return localStorage.getItem(storageKey) !== null
  }

  /**
   * Get all keys with the prefix
   */
  static getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(this.STORAGE_PREFIX)) {
        keys.push(key.replace(this.STORAGE_PREFIX, ''))
      }
    }
    return keys
  }

  /**
   * Clear all data with the prefix
   */
  static clearAll(): boolean {
    try {
      const keys = this.getAllKeys()
      keys.forEach(key => this.remove(key))
      console.log('All localStorage data cleared')
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: number; total: number } {
    try {
      let used = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(this.STORAGE_PREFIX)) {
          const value = localStorage.getItem(key)
          if (value) {
            used += key.length + value.length
          }
        }
      }

      // Estimate available space (most browsers have 5-10MB limit)
      const total = 5 * 1024 * 1024 // 5MB estimate
      const available = total - used

      return { used, available, total }
    } catch (error) {
      console.error('Error getting storage info:', error)
      return { used: 0, available: 0, total: 0 }
    }
  }

  /**
   * Backup data to JSON string
   */
  static backup(): string {
    try {
      const backup: Record<string, any> = {}
      const keys = this.getAllKeys()
      
      keys.forEach(key => {
        const data = this.load(key)
        if (data !== null) {
          backup[key] = data
        }
      })

      return JSON.stringify({
        timestamp: new Date().toISOString(),
        version: this.DEFAULT_VERSION,
        data: backup
      }, null, 2)
    } catch (error) {
      console.error('Error creating backup:', error)
      return '{}'
    }
  }

  /**
   * Restore data from JSON string
   */
  static restore(backupData: string): boolean {
    try {
      const parsed = JSON.parse(backupData)
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid backup format')
      }

      Object.entries(parsed.data).forEach(([key, value]) => {
        this.save(key, value)
      })

      console.log('Data restored from backup')
      return true
    } catch (error) {
      console.error('Error restoring backup:', error)
      return false
    }
  }

  // Private helper methods
  private static getStorageKey(key: string): string {
    return `${this.STORAGE_PREFIX}${key}`
  }

  private static generateChecksum(data: any): string {
    // Simple checksum implementation - in production, use a proper hash function
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }

  private static isExpired(timestamp: string, ttl: number): boolean {
    const now = new Date().getTime()
    const itemTime = new Date(timestamp).getTime()
    return (now - itemTime) > ttl
  }
}

// Convenience functions for common use cases
export const saveOnboardingData = (data: any): boolean => {
  return LocalStorageService.save('onboarding_data', data, {
    version: '1.0.0',
    ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

export const loadOnboardingData = (): any => {
  return LocalStorageService.load('onboarding_data', {
    version: '1.0.0',
    ttl: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

export const saveInviteCode = (code: string): boolean => {
  return LocalStorageService.save('invite_code', code, {
    version: '1.0.0',
    ttl: 24 * 60 * 60 * 1000 // 24 hours
  })
}

export const loadInviteCode = (): string | null => {
  return LocalStorageService.load('invite_code', {
    version: '1.0.0',
    ttl: 24 * 60 * 60 * 1000 // 24 hours
  })
}

export const clearOnboardingData = (): boolean => {
  LocalStorageService.remove('onboarding_data')
  LocalStorageService.remove('invite_code')
  return true
}
