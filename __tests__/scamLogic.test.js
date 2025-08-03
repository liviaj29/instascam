describe('Scam Logic Tests', () => {
    const suspiciousKeywords = [
    "huge discount", "limited offer", "flash sale"
    ];
    const reportedDomains = ["grayclothing.co.uk"];

    // 1. Test keyword detection
    test('detects suspicious keywords in text', () => {
    const bodyText = "This is a huge discount and a flash sale!";
    const getFlaggedKeywords = (keywords, text) =>
        keywords.filter(word => text.toLowerCase().includes(word));
    expect(getFlaggedKeywords(suspiciousKeywords, bodyText)).toEqual([
        "huge discount", "flash sale"
    ]);
    });

    // 2. Test domain detection
    test('flags reported domain', () => {
    const hostname = "shop.grayclothing.co.uk";
    const isReported = reportedDomains.some(domain => hostname.includes(domain));
    expect(isReported).toBe(true);
    });

        // 3. No keywords found
    test('returns empty array when no suspicious keywords are found', () => {
        const bodyText = "Welcome to our official store!";
        const getFlaggedKeywords = (keywords, text) =>
            keywords.filter(word => text.toLowerCase().includes(word));
        expect(getFlaggedKeywords(suspiciousKeywords, bodyText)).toEqual([]);
    });

    // 4. No reported domains matched
    test('returns false when no reported domains are matched', () => {
        const hostname = "legitshop.com";
        const isReported = reportedDomains.some(domain => hostname.includes(domain));
        expect(isReported).toBe(false);
    });

    // 5. Empty body text
    test('returns empty array when body text is empty', () => {
        const bodyText = "";
        const getFlaggedKeywords = (keywords, text) =>
            keywords.filter(word => text.toLowerCase().includes(word));
        expect(getFlaggedKeywords(suspiciousKeywords, bodyText)).toEqual([]);
    });
});