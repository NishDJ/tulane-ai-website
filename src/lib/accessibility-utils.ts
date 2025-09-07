/**
 * Accessibility utility functions for the Tulane AI website
 */

/**
 * Announces a message to screen readers
 * @param message - The message to announce
 * @param priority - The priority level (polite or assertive)
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
) {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove the announcement after a short delay
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Manages focus for modal dialogs and overlays
 * @param container - The container element to trap focus within
 * @param restoreFocus - Whether to restore focus when the trap is removed
 */
export function trapFocus(container: HTMLElement, restoreFocus = true) {
  const previousActiveElement = document.activeElement as HTMLElement;

  const focusableElements = container.querySelectorAll(
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
  ) as NodeListOf<HTMLElement>;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Set initial focus
  if (firstElement) {
    firstElement.focus();
  }

  container.addEventListener("keydown", handleKeyDown);

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
    if (restoreFocus && previousActiveElement) {
      previousActiveElement.focus();
    }
  };
}

/**
 * Checks if the user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Checks if the user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Gets the user's preferred color scheme
 */
export function getPreferredColorScheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Generates a unique ID for accessibility attributes
 * @param prefix - Optional prefix for the ID
 */
export function generateAccessibilityId(prefix = "a11y"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validates that an element has proper accessibility attributes
 * @param element - The element to validate
 */
export function validateAccessibility(element: HTMLElement): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for missing alt text on images
  if (element.tagName === "IMG" && !element.getAttribute("alt")) {
    issues.push("Image missing alt attribute");
  }

  // Check for buttons without accessible names
  if (
    element.tagName === "BUTTON" &&
    !element.textContent?.trim() &&
    !element.getAttribute("aria-label") &&
    !element.getAttribute("aria-labelledby")
  ) {
    issues.push("Button missing accessible name");
  }

  // Check for form inputs without labels
  if (
    (element.tagName === "INPUT" || element.tagName === "TEXTAREA") &&
    element.getAttribute("type") !== "hidden" &&
    !element.getAttribute("aria-label") &&
    !element.getAttribute("aria-labelledby") &&
    !document.querySelector(`label[for="${element.id}"]`)
  ) {
    issues.push("Form input missing label");
  }

  // Check for proper heading hierarchy
  if (element.tagName.match(/^H[1-6]$/)) {
    const level = parseInt(element.tagName.charAt(1));
    const previousHeading = element.previousElementSibling?.closest("h1, h2, h3, h4, h5, h6");
    
    if (previousHeading) {
      const previousLevel = parseInt(previousHeading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        issues.push(`Heading level ${level} follows heading level ${previousLevel} (skips levels)`);
      }
    }
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Keyboard navigation helper
 * @param event - The keyboard event
 * @param handlers - Object mapping keys to handler functions
 */
export function handleKeyboardNavigation(
  event: KeyboardEvent,
  handlers: Record<string, () => void>
) {
  const handler = handlers[event.key];
  if (handler) {
    event.preventDefault();
    handler();
  }
}

/**
 * Creates a roving tabindex for a group of elements
 * @param container - The container element
 * @param selector - CSS selector for focusable items
 */
export function createRovingTabindex(container: HTMLElement, selector: string) {
  const items = container.querySelectorAll(selector) as NodeListOf<HTMLElement>;
  let currentIndex = 0;

  // Set initial tabindex values
  items.forEach((item, index) => {
    item.setAttribute("tabindex", index === 0 ? "0" : "-1");
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        newIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    // Update tabindex and focus
    items[currentIndex].setAttribute("tabindex", "-1");
    items[newIndex].setAttribute("tabindex", "0");
    items[newIndex].focus();
    currentIndex = newIndex;
  };

  container.addEventListener("keydown", handleKeyDown);

  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}