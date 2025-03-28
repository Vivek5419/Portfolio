/**
 * Vibrates the device for the specified duration
 * @param duration Duration in milliseconds
 * @returns boolean indicating whether vibration was successful
 */
export function vibrateDevice(duration = 42): boolean {
  try {
    // Check if vibration API is supported
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
      return navigator.vibrate(duration)
    }
    return false
  } catch (error) {
    // Silently fail if vibration is not supported or fails
    console.debug("Vibration not supported or failed:", error)
    return false
  }
}

