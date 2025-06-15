(() => {
    const suspiciousKeywords = [
      "huge discount", "limited offer", "flash sale", "cheap prices",
      "paypal only", "no refund", "no returns", "final sale", "closing down sale", "we are closing", "sale ends today"
    ];
  
    const reportedDomains = [
      "grayclothing.co.uk"
    ]; // only for hardcoded initial block list
  
    const getFlaggedKeywords = (keywords) => {
        const bodyText = document.body.innerText.toLowerCase();
        return keywords.filter(word => bodyText.includes(word));
      };
      
    const flaggedKeywords = getFlaggedKeywords(suspiciousKeywords);
    const isScam = flaggedKeywords.length > 0 || reportedDomains.some(domain => window.location.hostname.includes(domain));
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request === "getScamStatus" || request.action === "getScamStatus") {
        sendResponse({ isScam, flaggedKeywords });
        return true;
      }
    });
  })();
  