const https = require('https');

// Direct Production Bridge to Gemini v1beta (Bypasses buggy SDK versioning)
const callGeminiV1beta = (apiKey, model, prompt) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, topP: 0.8, topK: 40 }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode !== 200) {
            reject(new Error(parsed.error?.message || `API Error ${res.statusCode}`));
          } else {
            resolve(parsed.candidates?.[0]?.content?.parts?.[0]?.text || "");
          }
        } catch (e) { reject(e); }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
};

exports.verifyApiKey = async () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.length < 10) return { ok: false, message: "GEMINI_API_KEY is missing." };
  
  try {
    console.log("🚀 Testing Direct Production Bridge (v1beta)...");
    // Testing with a lightweight request to verify key validity
    await callGeminiV1beta(key, "gemini-2.5-flash", "ping");
    return { ok: true, message: "AI Engine (Gemini Flash) is Online." };
  } catch (err) {
    if (err.message.includes("429") || err.message.toLowerCase().includes("quota")) {
      console.log("⚠️  AI Engine (Gemini) is Online but Rate Limited.");
      return { ok: true, message: "AI Engine is Online (Rate Limited)." };
    }
    console.error("❌ Production Bridge Error:", err.message);
    return { ok: false, message: `AI Model Connection Error: ${err.message}` };
  }
};

exports.analyzeWithAI = async (resumeData, role = "", jobDescription = "") => {
  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System) Auditor. Analyze the resume for the role: "${role}".
      
      CORE AUDIT REQUIREMENTS:
      1. KEYWORD DENSITY: Compare resume text against industry keywords for "${role}".
      2. FORMATTING AUDIT: Check for layout issues (tables, images, non-standard headers).
      3. IMPACT ANALYSIS: Score based on quantified metrics (%, $, numbers).
      4. ROLE CONTEXT: Evaluate seniority and skill relevance.

      RESUME DATA:
      ${JSON.stringify(resumeData)}
      
      ${jobDescription ? `TARGET JOB DESCRIPTION: ${jobDescription}` : ""}

      OUTPUT JSON FORMAT ONLY:
      {
        "score": number (0-100),
        "breakdown": {
          "keywords": number (0-100),
          "formatting": number (0-100),
          "impact": number (0-100),
          "relevance": number (0-100)
        },
        "missing": string[] (Top 10 critical keywords),
        "matched": string[] (Keywords found),
        "suggestions": [
          { "category": "formatting" | "keyword" | "impact", "text": "Specific actionable tip" }
        ]
      }
    `;

    const text = await callGeminiV1beta(process.env.GEMINI_API_KEY, "gemini-2.5-flash", prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      score: 0,
      breakdown: { keywords: 0, formatting: 0, impact: 0, relevance: 0 },
      missing: ["Connection issue"], matched: [],
      suggestions: [{ category: "keyword", text: "Please try again. Connection timed out." }]
    };
  }
};
