
/**
 * Copies text to clipboard
 * @param text The text to copy
 * @returns A promise that resolves when the copy is complete
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    // Use the Clipboard API when available and in a secure context
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback method for older browsers or non-secure contexts
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    return new Promise((resolve, reject) => {
      // Execute copy command and remove the textarea
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve();
      } catch (err) {
        document.body.removeChild(textArea);
        reject(err);
      }
    });
  }
};
