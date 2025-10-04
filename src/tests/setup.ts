// Mock localStorage for tests
const storage: Record<string, string> = {}

const localStorageMock = {
  getItem: (key: string): string | null => {
    return storage[key] || null
  },
  setItem: (key: string, value: string): void => {
    storage[key] = value
  },
  removeItem: (key: string): void => {
    delete storage[key]
  },
  clear: (): void => {
    Object.keys(storage).forEach(key => {
      delete storage[key]
    })
  }
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console methods to reduce noise in tests
const originalConsoleLog = console.log
const originalConsoleError = console.error

console.log = (...args: any[]) => {
  // Only show test-related logs
  if (args.some(arg => typeof arg === 'string' && (arg.includes('🔍') || arg.includes('✅') || arg.includes('❌')))) {
    originalConsoleLog(...args)
  }
}

console.error = (...args: any[]) => {
  // Always show errors
  originalConsoleError(...args)
}
