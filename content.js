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

    // const extractPrices = () => {
    //   const priceRegex = /\$\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)|£\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)|€\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/g;
    //   const prices = document.body.innerText.match(priceRegex) || [];
    //   return prices;
    // }

    // ...existing code...

  const extractLabeledPrices = () => {
    // Try common class names used by Shopify, WooCommerce, etc.
    const regularSelectors = [
      'grid-product__price--original', '.price--regular', '.product__price--compare', '.compare-at-price'
    ];
    const saleSelectors = [
      'grid-product__price--savings', '.price--sale', '.product__price--sale', '.sale'
    ];

    let regularPrice = regularSelectors.reduce((s, sel) => document.querySelector(sel)?.innerText.match(/[\d,.]+/) || s, null);
    let salePrice = saleSelectors.reduce((s, sel) => document.querySelector(sel)?.innerText.match(/[\d,.]+/) || s, null);;

    return { 
      regular: regularPrice ? parseFloat(regularPrice[0].replace(/,/g, '')) : null, 
      sale: salePrice ? parseFloat(salePrice[0].replace(/,/g, '')) : null 
    };
  };

      
    const flaggedKeywords = getFlaggedKeywords(suspiciousKeywords);
    const priceExample = extractLabeledPrices();
    const priceDifference = priceExample.regular && priceExample.sale
      ? ((priceExample.regular - priceExample.sale) / priceExample.regular) * 100
      : null;
    const isScam = (flaggedKeywords.length > 0 && priceDifference >= 70 ) || reportedDomains.some(domain => window.location.hostname.includes(domain));

    // TODO: Send in price pattern too
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request === "getScamStatus" || request.action === "getScamStatus") {
        sendResponse({ isScam, flaggedKeywords });
        return true;
      }
    });
  })();
  