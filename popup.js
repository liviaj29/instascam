import { reportDomain, isDomainReported } from './db.js';

const statusEl = document.getElementById("status");
const reportBtn = document.getElementById("reportBtn");
const flaggedKeywordsSection = document.getElementById("flaggedKeywordsSection");
const flaggedKeywordsList = document.getElementById("flaggedKeywordsList");
const tipsSection = document.getElementById("tipsSection");

chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const tab = tabs[0];
  const domain = new URL(tab.url).hostname;

  // Optional: Inject if needed
  chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });

  const reported = await isDomainReported(domain);

  chrome.tabs.sendMessage(tab.id, "getScamStatus", (response) => {
    if (chrome.runtime.lastError) {
      statusEl.textContent = "Unable to check this site.";
      return;
    }

    if (reported) {
      statusEl.textContent = "⚠️ This site has been reported as suspicious.";
    } else if (response?.isScam) {
      statusEl.textContent = "⚠️ This site looks suspicious.";

      // Show flagged keywords
      if (response.flaggedKeywords?.length) {
        response.flaggedKeywords.forEach(keyword => {
          const li = document.createElement("li");
          li.textContent = keyword;
          flaggedKeywordsList.appendChild(li);
        });
        flaggedKeywordsSection.style.display = "block";
      }

      // Show educational tips
      tipsSection.style.display = "block";
    } else {
      statusEl.textContent = "✅ No obvious scam signs detected.";
    }

    reportBtn.style.display = "block";
  });
});

reportBtn.addEventListener("click", async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const domain = new URL(tabs[0].url).hostname;
    await reportDomain(domain);
    alert("Site reported!");
  });
});
