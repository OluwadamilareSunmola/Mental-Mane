// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const decoyButton = document.getElementById("decoy-button");
const stealthDecoyButton = document.getElementById("stealth-decoy-button");
const clearSessionBtn = document.getElementById("clear-session-btn");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const voiceInputBtn = document.getElementById("voice-input-btn");
const chatMessages = document.getElementById("chat-messages");
const riskLevel = document.getElementById("risk-level");
const riskPercentage = document.getElementById("risk-percentage");
const voiceRecordingModal = document.getElementById("voice-recording-modal");
const stopRecordingBtn = document.getElementById("stop-recording-btn");
const cancelRecordingBtn = document.getElementById("cancel-recording-btn");
const liveTranscript = document.getElementById("live-transcript");
const recordingTime = document.getElementById("recording-time");
const alertWordsBtn = document.getElementById("alert-words-btn");
const alertWordsModal = document.getElementById("alert-words-modal");
const closeAlertWordsBtn = document.getElementById("close-alert-words-btn");
const severity1Words = document.getElementById("severity-1-words");
const severity2Words = document.getElementById("severity-2-words");
const severity3Words = document.getElementById("severity-3-words");
const coverUpButton = document.getElementById("cover-up-button");

// Log all DOM elements for debugging
console.log('DOM Elements:', {
    userInput,
    sendBtn,
    chatMessages,
    voiceInputBtn
});

// State variables
let darkMode = localStorage.getItem("darkMode") === "true";
let riskScore = 0;
const maxRiskScore = 100;
let sessionData = {
  messages: [],
  transcripts: [],
  keywords: {},
  emotionalIndicators: {},
  riskScore: 0,
  lastUpdate: null,
  emergencyTriggers: [],
  ipAddress: null,
  wordFrequency: {},
  contextualAnalysis: [],
  conversationContext: {
    currentTopic: null,
    detectedEntities: {},
    followUpQuestions: [],
  },
};

// Chatbot responses
const chatbotResponses = {
    greet: [
        "Hello! I'm here to listen and support you. How are you feeling today?",
        "Hi there! I'm here to help. How are you doing?"
    ],
    emergency: [
        "I'm concerned about your safety. Are you in immediate danger? If so, please call emergency services right away.",
        "Your safety is the most important thing. Do you need help getting to a safe place?"
    ],
    abuse: [
        "I'm here to listen and support you. Would you like to tell me more about what's happening?",
        "Thank you for sharing this with me. How can I help you stay safe?"
    ],
    emotional: [
        "Your feelings are valid and important. Would you like to talk more about how you're feeling?",
        "I'm here to listen. What kind of support would be most helpful right now?"
    ],
    safety: [
        "Are you in a safe place right now? Do you have someone you can reach out to?",
        "Your safety is my priority. Do you have a plan to stay safe?"
    ],
    resources: [
        "Here are some resources that might help: [National Domestic Violence Hotline: 1-800-799-7233, Crisis Text Line: Text HOME to 741741]",
        "Would you like information about local support services or shelters?"
    ],
    default: [
        "I understand. Would you like to tell me more?",
        "Thank you for sharing. How can I support you?",
        "I'm here to listen. What's on your mind?",
        "Your feelings are important. Would you like to talk more about this?"
    ]
};

// Emergency keywords system
const emergencySeeds = [
    "help", "emergency", "danger", "scared", "afraid", "terrified",
    "hurt", "abuse", "threat", "unsafe", "panic", "anxious", "worried",
    "attack", "violence", "assault", "escape", "trapped"
];

// Initialize with basic keywords as fallback
window.emergencyKeywords = [
    "help", "emergency", "danger", "scared", "afraid", "terrified",
    "hurt", "abuse", "threat", "unsafe", "panic", "anxious", "worried",
    "attack", "violence", "assault", "escape", "trapped",
    "please", "now", "urgent", "911", "police", "fire", "ambulance",
    "scream", "bleed", "bleeding", "blood", "kidnap", "abduct",
    "gun", "knife", "weapon", "bomb", "flee", "save", "safe", "injured",
    "wound", "broken", "pain", "helpme", "sendhelp", "hostage",
    "attacked", "hiding", "sos", "mayday", "mercy", "mercyme"
];

// Function to fetch synonyms from Datamuse & merge with manual overrides
async function loadEmergencyKeywords() {
    const all = new Set(emergencySeeds);

    // Fetch up to 200 synonyms per seed
    for (const seed of emergencySeeds) {
        try {
            const res = await fetch(
                `https://api.datamuse.com/words?rel_syn=${encodeURIComponent(seed)}&max=200`
            );
            const words = await res.json();
            for (const w of words) {
                all.add(w.word.toLowerCase().replace(/[^a-z\-]/g, ""));
            }
        } catch (e) {
            console.warn("Datamuse error for", seed, e);
        }
    }

    // Hard-include any extra short tokens
    [
        "please", "now", "urgent", "911", "police", "fire", "ambulance",
        "scream", "bleed", "bleeding", "blood", "kidnap", "abduct",
        "gun", "knife", "weapon", "bomb", "flee", "save", "safe", "injured",
        "wound", "broken", "pain", "helpme", "sendhelp", "hostage",
        "attacked", "hiding", "sos", "mayday", "mercy", "mercyme"
    ].forEach(w => all.add(w));

    // Update the global array with new terms
    window.emergencyKeywords = Array.from(all);
    console.log("🔴 Emergency keywords loaded:", window.emergencyKeywords.length, "terms");
}

// Initialize emergency keywords on page load
document.addEventListener("DOMContentLoaded", loadEmergencyKeywords);

// Alert words for stealth mode
const ALERT_WORDS = {
  A1: { word: "alpha7", severity: 3 },
  B2: { word: "delta9", severity: 3 },
  C3: { word: "echo12", severity: 3 },
  D4: { word: "lock42", severity: 3 },
  E5: { word: "safe11", severity: 2 },
  F6: { word: "glass31", severity: 3 },
  G7: { word: "zeta88", severity: 3 },
  H8: { word: "unit5", severity: 2 },
  I9: { word: "node3", severity: 2 },
  J0: { word: "blue4", severity: 1 },
  K1: { word: "click9", severity: 3 },
  L2: { word: "exit17", severity: 2 },
  M3: { word: "fast13", severity: 2 },
  N4: { word: "quiet22", severity: 1 },
  O5: { word: "code23", severity: 3 },
  P6: { word: "vault6", severity: 3 },
  Q7: { word: "line7", severity: 2 },
  R8: { word: "jump55", severity: 2 },
  S9: { word: "gate99", severity: 3 },
  T0: { word: "track41", severity: 3 },
  U1: { word: "floor2", severity: 2 },
  V2: { word: "grid10", severity: 1 },
  W3: { word: "key27", severity: 2 },
  X4: { word: "flag19", severity: 2 },
  Y5: { word: "safezero", severity: 1 },
  Z6: { word: "flash18", severity: 3 },
};

// Emergency keywords with count tracking
const EMERGENCY_KEYWORDS = {};
emergencyKeywords.forEach(keyword => {
    EMERGENCY_KEYWORDS[keyword] = { count: 0 };
});

// DSM indicators and severity levels
const dsmIndicators = {
  // Isolation indicators (severity 1)
  alone: 1,
  isolated: 1,
  "no friends": 1,
  "can't see family": 1,
  "won't let me": 1,
  controls: 1,
  monitors: 1,
  checks: 1,
  tracks: 1,
  confused: 1,
  anxious: 1,
  nervous: 1,
  hypervigilant: 1,
  scared: 1,

  // Gaslighting indicators (severity 2)
  crazy: 2,
  imagining: 2,
  overreacting: 2,
  sensitive: 2,
  paranoid: 2,
  "making it up": 2,
  "my fault": 2,
  blame: 2,
  "deserved it": 2,
  provoked: 2,
  "made them": 2,

  // Threat indicators (severity 3)
  hurt: 3,
  hit: 3,
  punch: 3,
  kill: 3,
  threat: 3,
  threatened: 3,
  afraid: 3,
  terrified: 3,
  weapon: 3,
  knife: 3,
  gun: 3,
  die: 3,
  suicide: 3,
  children: 3,
  "take away": 3,
};

// Emotional indicators for NLP analysis
const emotionalIndicators = {
  fear: ["scared", "afraid", "terrified", "frightened", "fearful", "panic", "anxious", "worried"],
  anger: ["angry", "mad", "furious", "rage", "outraged", "irritated", "annoyed"],
  sadness: ["sad", "depressed", "unhappy", "miserable", "heartbroken", "devastated", "down"],
  helplessness: ["helpless", "trapped", "stuck", "hopeless", "powerless", "desperate"],
  shame: ["ashamed", "embarrassed", "humiliated", "guilty", "worthless"],
};

// Contextual patterns for NLP analysis
const contextualPatterns = [
  {
    pattern: "physical abuse",
    keywords: ["hit", "punch", "slap", "kick", "beat", "push", "shove", "throw", "hurt"],
    severity: 3,
    followUp: "Can you tell me more about what happened? Are you physically safe right now?",
  },
  {
    pattern: "emotional abuse",
    keywords: ["yell", "scream", "insult", "belittle", "humiliate", "criticize", "blame", "manipulate"],
    severity: 2,
    followUp: "How often does this happen? How does it make you feel?",
  },
  {
    pattern: "isolation",
    keywords: ["alone", "isolated", "can't see", "won't let", "control", "monitor", "track", "check"],
    severity: 2,
    followUp: "Are you able to contact friends or family? Do you have anyone you can reach out to?",
  },
  {
    pattern: "threats",
    keywords: ["threaten", "warning", "promise", "kill", "hurt", "harm", "weapon", "gun", "knife"],
    severity: 3,
    followUp: "Are you in immediate danger? Do you need emergency assistance?",
  },
  {
    pattern: "financial abuse",
    keywords: ["money", "spend", "account", "debt", "control", "job", "work", "quit", "bills"],
    severity: 2,
    followUp: "Do you have access to your own money? Are you financially dependent on someone?",
  },
  {
    pattern: "sexual abuse",
    keywords: ["force", "touch", "sex", "consent", "pressure", "uncomfortable"],
    severity: 3,
    followUp: "I'm sorry you're experiencing this. Would you like information about support resources?",
  },
  {
    pattern: "children at risk",
    keywords: ["child", "children", "kid", "son", "daughter", "hurt", "scared", "witness", "see"],
    severity: 3,
    followUp: "Are there children involved in this situation? Are they safe?",
  },
];

// Helper functions
function autoResizeTextarea() {
  console.log('Auto-resizing textarea');
  userInput.style.height = "auto";
  userInput.style.height = userInput.scrollHeight + "px";
}

function generatePDFReport() {
  try {
    // Create a new PDF document
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Wellness Check-in Report', 20, 20);
    
    // Add timestamp
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add IP address
    const ipAddress = sessionData.ipAddress || "Fetching...";
    console.log("Using IP Address in PDF:", ipAddress); // Debug log
    doc.text(`IP Address: ${ipAddress}`, 20, 40);
    
    // Add risk assessment
    doc.setFontSize(16);
    doc.text('Risk Assessment', 20, 50);
    doc.setFontSize(12);
    doc.text(`Current Risk Level: ${sessionData.riskScore}%`, 20, 60);
    doc.text(`Escalation Level: ${sessionData.riskScore < 30 ? 'Low' : sessionData.riskScore < 70 ? 'Medium' : 'High'}`, 20, 70);
    
    // Add conversation history
    doc.setFontSize(16);
    doc.text('Conversation History', 20, 90);
    doc.setFontSize(12);
    let y = 100;
    sessionData.messages.forEach((msg) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${msg.sender}: ${msg.text}`, 20, y);
      doc.text(new Date(msg.timestamp).toLocaleString(), 20, y + 5);
      y += 15;
    });
    
    // Save the PDF
    doc.save('wellness-report.pdf');
  } catch (error) {
    console.error('Error generating PDF report:', error);
  }
}

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Initialize the application
function init() {
    console.log("Initializing application...");
    
  // Set initial theme
    updateTheme();

    // Load session data
    loadSessionData();

    // Get IP address immediately
    getIPAddress().then(ip => {
        console.log("IP Address initialized:", ip); // Debug log
    });

    // Auto-resize textarea
    userInput.addEventListener("input", autoResizeTextarea);

  // Event listeners
    console.log("Setting up event listeners...");
    
    // Chat input event listeners
    sendBtn.addEventListener("click", sendMessage);

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
            console.log("Enter key pressed");
            e.preventDefault();
            sendMessage();
        }
    });

    // Voice recording event listeners
    voiceInputBtn.addEventListener("click", startVoiceRecording);

    stopRecordingBtn.addEventListener("click", stopVoiceRecording);

    cancelRecordingBtn.addEventListener("click", cancelVoiceRecording);

    // Theme toggle
    themeToggle.addEventListener("click", () => {
        console.log("Theme toggle clicked");
        toggleTheme();
    });

    // Emergency buttons
    decoyButton.addEventListener("click", () => {
        console.log("Decoy button clicked");
        activateDecoy();
    });

    stealthDecoyButton.addEventListener("click", () => {
        console.log("Stealth decoy button clicked");
        activateStealthDecoy();
    });

    coverUpButton.addEventListener("click", () => {
        console.log("Cover up button clicked");
        activateCoverUp();
    });

    // Alert words modal
    alertWordsBtn.addEventListener("click", () => {
        console.log("Alert words button clicked");
        showAlertWordsModal();
    });

    closeAlertWordsBtn.addEventListener("click", () => {
        console.log("Close alert words button clicked");
        hideAlertWordsModal();
    });

    // Clear session
    clearSessionBtn.addEventListener("click", () => {
        console.log("Clear session button clicked");
        clearSession();
    });

  // Add escape key listener for emergency exit
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
            activateDecoy();
        }
    });

    // Initialize alert words
    populateAlertWords();

    console.log("Initialization complete");
}

// Get IP address
async function getIPAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    sessionData.ipAddress = data.ip;
    console.log("IP Address fetched:", sessionData.ipAddress); // Debug log
    saveSessionData();
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    sessionData.ipAddress = "Unable to detect";
    return "Unable to detect";
  }
}

// Theme functions
function toggleTheme() {
  darkMode = !darkMode;
  localStorage.setItem("darkMode", darkMode);
  updateTheme();
}

function updateTheme() {
  if (darkMode) {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

// Emergency decoy functions
function activateDecoy() {
  // Generate report before redirecting
  generatePDFReport();

  // Redirect to Google or another benign site
  window.location.href = "https://www.google.com";
}

function activateStealthDecoy() {
  // Log the stealth exit
  sessionData.emergencyTriggers.push({
    type: "stealth_button",
    timestamp: new Date().toISOString(),
  });

  // Generate report before redirecting
  generatePDFReport();

  // Redirect to Google or another benign site
  window.location.href = "https://www.google.com";
}

function activateCoverUp() {
  // Log the cover up exit
  sessionData.emergencyTriggers.push({
    type: "cover_up_button",
    timestamp: new Date().toISOString(),
  });

  // Save session data
  saveSessionData();

  // Generate report before redirecting
  generatePDFReport();

  // Redirect to Google or another benign site
  window.location.href = "https://www.google.com";
}

// Session management
function saveSessionData() {
    console.log("Saving session data...");
    sessionData.lastUpdate = new Date().toISOString();
    try {
        localStorage.setItem('abuseDetectionSession', JSON.stringify(sessionData));
        console.log("Session data saved successfully");
    } catch (error) {
        console.error("Error saving session data:", error);
    }
}

function loadSessionData() {
  const savedData = localStorage.getItem("abuseDetectionSession");
  if (savedData) {
    sessionData = JSON.parse(savedData);

    // Render saved messages
    chatMessages.innerHTML = ""; // Clear existing messages
    sessionData.messages.forEach((msg) => {
      addMessageToChat(msg.text, msg.sender, msg.timestamp, msg.highlighted, msg.severeHighlighted);
    });

    // Update risk score
    riskScore = sessionData.riskScore;
    updateRiskMeter();
  }
}

function clearSession() {
  if (confirm("Are you sure you want to clear all session data? This cannot be undone.")) {
    localStorage.removeItem("abuseDetectionSession");
    sessionData = {
      messages: [],
      transcripts: [],
      keywords: {},
      emotionalIndicators: {},
      riskScore: 0,
      lastUpdate: null,
      emergencyTriggers: [],
      ipAddress: sessionData.ipAddress,
      wordFrequency: {},
      contextualAnalysis: [],
      conversationContext: {
        currentTopic: null,
        detectedEntities: {},
        followUpQuestions: [],
      },
    };
    riskScore = 0;
    updateRiskMeter();
    chatMessages.innerHTML = "";

    // Reset emergency keyword counts
    Object.keys(EMERGENCY_KEYWORDS).forEach((keyword) => {
      EMERGENCY_KEYWORDS[keyword].count = 0;
    });

    // Add initial bot message
    addMessageToChat("Hello, I'm here to listen and support you. How are you feeling today?", "bot");
  }
}

// Chat functions
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, "user");

    // Clear input
    userInput.value = "";
    autoResizeTextarea();

    // Process message for risk assessment
    const analysisResult = processMessage(message);

    // Generate bot response
    const botResponse = generateBotResponse(message, analysisResult);

    // Add bot response to chat
    addMessageToChat(botResponse, "bot");

    // Save session data
    saveSessionData();
}

function addMessageToChat(
  text,
  sender,
  timestamp = new Date().toISOString(),
  highlighted = false,
  severeHighlighted = false,
) {
  console.log("addMessageToChat called with:", { text, sender, timestamp, highlighted, severeHighlighted });
  
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  if (highlighted) {
    messageDiv.classList.add("highlighted");
  }

  if (severeHighlighted) {
    messageDiv.classList.add("severe-highlighted");
  }

  const messageContent = document.createElement("div");
  messageContent.className = "message-content";

  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = text;

  const messageTimestamp = document.createElement("div");
  messageTimestamp.className = "message-timestamp";
  messageTimestamp.textContent = formatTimestamp(timestamp);

  messageContent.appendChild(messageParagraph);
  messageDiv.appendChild(messageContent);
  messageDiv.appendChild(messageTimestamp);

  console.log("Appending message to chat messages container");
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Save message to session data
  if (!sessionData.messages.some((msg) => msg.text === text && msg.sender === sender && msg.timestamp === timestamp)) {
    sessionData.messages.push({
      text,
      sender,
      timestamp,
      highlighted,
      severeHighlighted,
    });

    // Save session data after adding message
    saveSessionData();
  }
}

function processMessage(message) {
    console.log("Processing message:", message);
    const lowerMessage = message.toLowerCase();
    let newScore = 0;
    const detectedKeywords = {};
    let highlightMessage = false;
    let severeHighlightMessage = false;
    const detectedPatterns = [];
    const detectedEmotions = [];

    // Try to use NLP if available
    let nlp;
    try {
        nlp = window.nlp;
    } catch (error) {
        console.warn("NLP not available:", error);
        nlp = null;
    }

    // Basic keyword matching if NLP is not available
    if (!nlp) {
        console.log("Using basic keyword matching");
  // Check for regular DSM indicators
        Object.keys(dsmIndicators).forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
                const severity = dsmIndicators[keyword];
                newScore += severity;
                detectedKeywords[keyword] = severity;
                
                if (severity >= 2) highlightMessage = true;
                if (severity >= 3) severeHighlightMessage = true;
            }
        });

        // Check for emotional indicators
        Object.entries(emotionalIndicators).forEach(([emotion, keywords]) => {
            keywords.forEach(keyword => {
                if (lowerMessage.includes(keyword)) {
                    detectedEmotions.push({
                        emotion,
                        keyword,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });

        // Check for contextual patterns
        contextualPatterns.forEach(pattern => {
            let matchCount = 0;
            pattern.keywords.forEach(keyword => {
    if (lowerMessage.includes(keyword)) {
                    matchCount++;
                }
            });

            if (matchCount >= 2) {
                detectedPatterns.push({
                    pattern: pattern.pattern,
                    severity: pattern.severity,
                    matchedKeywords: pattern.keywords.filter(k => lowerMessage.includes(k)),
                    followUp: pattern.followUp,
                    timestamp: new Date().toISOString()
                });
            }
        });
    } else {
        // Use NLP if available
        console.log("Using NLP for message processing");
        const doc = nlp(message);
        
        // Track word frequency
        const words = doc.terms().out('array');
        words.forEach(word => {
            if (word.length > 2) {
                const lowerWord = word.toLowerCase();
                if (!sessionData.wordFrequency[lowerWord]) {
                    sessionData.wordFrequency[lowerWord] = 1;
      } else {
                    sessionData.wordFrequency[lowerWord]++;
                }
            }
        });

        // Check for DSM indicators
        Object.keys(dsmIndicators).forEach(keyword => {
            if (doc.match(keyword).found) {
                const severity = dsmIndicators[keyword];
                newScore += severity;
                detectedKeywords[keyword] = severity;
                
                if (severity >= 2) highlightMessage = true;
                if (severity >= 3) severeHighlightMessage = true;
            }
        });

  // Check for emotional indicators
  Object.entries(emotionalIndicators).forEach(([emotion, keywords]) => {
            keywords.forEach(keyword => {
                if (doc.match(keyword).found) {
        detectedEmotions.push({
                        emotion,
                        keyword,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        });

  // Check for contextual patterns
        contextualPatterns.forEach(pattern => {
            let matchCount = 0;
            pattern.keywords.forEach(keyword => {
                if (doc.match(keyword).found) {
                    matchCount++;
                }
            });

    if (matchCount >= 2) {
      detectedPatterns.push({
        pattern: pattern.pattern,
        severity: pattern.severity,
                    matchedKeywords: pattern.keywords.filter(k => doc.match(k).found),
        followUp: pattern.followUp,
                    timestamp: new Date().toISOString()
                });
            }
        });
    }

    // Check for emergency keywords
    emergencyKeywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            EMERGENCY_KEYWORDS[keyword].count++;
            
            // If high-risk keyword is detected multiple times, increase score significantly
            if (EMERGENCY_KEYWORDS[keyword].count > 1) {
                newScore += 10 * EMERGENCY_KEYWORDS[keyword].count;
                severeHighlightMessage = true;
      } else {
                newScore += 5;
                highlightMessage = true;
            }
        }
    });

  // Update risk score
    riskScore += newScore;
    sessionData.riskScore = riskScore;

  // Update risk meter
    updateRiskMeter();

    // Update keywords in session data
    Object.entries(detectedKeywords).forEach(([keyword, severity]) => {
        if (!sessionData.keywords[keyword]) {
            sessionData.keywords[keyword] = {
                count: 1,
                severity: severity,
                category: determineCategory(keyword),
                timestamp: new Date().toISOString()
            };
        } else {
            sessionData.keywords[keyword].count++;
            sessionData.keywords[keyword].lastSeen = new Date().toISOString();
        }
    });

    // Update emotional indicators
    detectedEmotions.forEach(emotion => {
        const emotionName = emotion.emotion;
        if (!sessionData.emotionalIndicators[emotionName]) {
            sessionData.emotionalIndicators[emotionName] = {
                count: 1,
                intensity: determineIntensity(emotion.keyword)
            };
        } else {
            sessionData.emotionalIndicators[emotionName].count++;
        }
    });

    // Update contextual analysis
    detectedPatterns.forEach(pattern => {
        sessionData.contextualAnalysis.push(pattern);
    });

    // Save session data
    saveSessionData();

  return {
    detectedKeywords,
    detectedPatterns,
    detectedEmotions,
    highlightMessage,
    severeHighlightMessage,
        newScore
    };
}

// Helper function to determine category of a keyword
function determineCategory(keyword) {
    // Check each category
    for (const [category, words] of Object.entries(emotionalIndicators)) {
        if (words.includes(keyword)) return "emotional";
    }
    
    // Check contextual patterns
    for (const pattern of contextualPatterns) {
        if (pattern.keywords.includes(keyword)) {
            if (pattern.pattern.includes("physical")) return "physical";
            if (pattern.pattern.includes("emotional")) return "emotional";
            if (pattern.pattern.includes("isolation")) return "social";
            if (pattern.pattern.includes("threat")) return "safety";
            if (pattern.pattern.includes("financial")) return "financial";
            if (pattern.pattern.includes("sexual")) return "safety";
            if (pattern.pattern.includes("children")) return "family";
        }
    }
    
    // Default category
    return "general";
}

// Helper function to determine intensity of an emotion
function determineIntensity(keyword) {
    // High intensity words
    const highIntensity = ["terrified", "furious", "devastated", "desperate", "humiliated"];
    if (highIntensity.includes(keyword)) return 3;
    
    // Medium intensity words
    const mediumIntensity = ["afraid", "angry", "sad", "trapped", "ashamed"];
    if (mediumIntensity.includes(keyword)) return 2;
    
    // Default to low intensity
    return 1;
}

// Generate bot response based on message content
function generateBotResponse(message, analysisResult) {
    const lowerMessage = message.toLowerCase();
    
    // Check for emergency keywords
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
        return getRandomResponse(chatbotResponses.emergency);
    }
    
    // Check for abuse-related content
    if (lowerMessage.includes('abuse') || lowerMessage.includes('hurt') || 
        lowerMessage.includes('threat') || lowerMessage.includes('control')) {
        return getRandomResponse(chatbotResponses.abuse);
    }
    
    // Check for emotional content
    if (lowerMessage.includes('feel') || lowerMessage.includes('emotion') || 
        lowerMessage.includes('sad') || lowerMessage.includes('anxious')) {
        return getRandomResponse(chatbotResponses.emotional);
    }
    
    // Check for safety concerns
    if (lowerMessage.includes('safe') || lowerMessage.includes('danger') || 
        lowerMessage.includes('protect')) {
        return getRandomResponse(chatbotResponses.safety);
    }
    
    // Check for resource requests
    if (lowerMessage.includes('help') || lowerMessage.includes('resource') || 
        lowerMessage.includes('support') || lowerMessage.includes('service')) {
        return getRandomResponse(chatbotResponses.resources);
    }
    
    // Default response
    return getRandomResponse(chatbotResponses.default);
}

// Helper function to get random response
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Voice recording functions
let mediaRecorder;
let audioChunks = [];
let recordingInterval;
let recordingSeconds = 0;
let recognition;

// Check if SpeechRecognition API is available
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

async function startVoiceRecording() {
  try {
  // Reset recording state
    audioChunks = [];
    recordingSeconds = 0;
    liveTranscript.textContent = "";
    recordingTime.textContent = "0:00";

  // Show modal
    voiceRecordingModal.style.display = "flex";

  // Start recording timer
    recordingInterval = setInterval(updateRecordingTime, 1000);

  // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.start();

    // Set up speech recognition
      if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

        recognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
            processTranscriptSegment(event.results[i][0].transcript);
            } else {
            interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
          liveTranscript.textContent += finalTranscript;
          }

          if (interimTranscript !== "") {
          const finalText = liveTranscript.textContent;
          liveTranscript.innerHTML = finalText + '<span style="color: var(--text-light);">' + interimTranscript + "</span>";
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        cancelVoiceRecording();
      };

      recognition.start();
    }
  } catch (error) {
    console.error('Error starting voice recording:', error);
    alert("Unable to access microphone. Please check your permissions.");
    cancelVoiceRecording();
  }
}

function processTranscriptSegment(transcript) {
  const lowerTranscript = transcript.toLowerCase();
  let emergencyDetected = false;

  // Use NLP to analyze the transcript if available
  let doc;
  try {
    doc = window.nlp(transcript);
  } catch (error) {
    console.warn("NLP not available for transcript processing");
  }

  // Track word frequency for visualization
  const words = transcript.split(/\s+/);
  words.forEach((word) => {
    if (word.length > 2) {
      // Skip very short words
      const lowerWord = word.toLowerCase();
      if (!sessionData.wordFrequency[lowerWord]) {
        sessionData.wordFrequency[lowerWord] = 1;
      } else {
        sessionData.wordFrequency[lowerWord]++;
      }
    }
  });

  // Check for emergency keywords in real-time
  Object.keys(EMERGENCY_KEYWORDS).forEach((keyword) => {
    if (lowerTranscript.includes(keyword)) {
      const keywordData = EMERGENCY_KEYWORDS[keyword];
      keywordData.count++;

      // Check for help repeated
      if (keyword === "help" && keywordData.count >= 2) {
        emergencyDetected = true;
        sessionData.emergencyTriggers.push({
          type: "help_repeated_voice",
          timestamp: new Date().toISOString(),
          count: keywordData.count,
          transcript: transcript,
        });
      }
    }
  });

  // Check for contextual patterns
  contextualPatterns.forEach((pattern) => {
    let matchCount = 0;
    pattern.keywords.forEach((keyword) => {
      if (lowerTranscript.includes(keyword)) {
        matchCount++;
      }
    });

    // If we have at least 2 keywords matching, consider it a pattern match
    if (matchCount >= 2) {
      // Add to contextual analysis in session data
      sessionData.contextualAnalysis.push({
        pattern: pattern.pattern,
        severity: pattern.severity,
        matchedKeywords: pattern.keywords.filter((k) => lowerTranscript.includes(k)),
        message: transcript,
        timestamp: new Date().toISOString(),
      });

      // If high severity pattern detected, consider it an emergency
      if (pattern.severity >= 3) {
        emergencyDetected = true;
      }
    }
  });

  // If emergency detected, prepare to exit
  if (emergencyDetected) {
    // Stop recording
    if (recognition) {
      recognition.stop();
    }

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    clearInterval(recordingInterval);

    // Hide modal
    voiceRecordingModal.style.display = "none";

    // Save transcript
    const fullTranscript = liveTranscript.textContent.trim();
    if (fullTranscript) {
      addMessageToChat(fullTranscript, "user", new Date().toISOString(), true, true);
      processMessage(fullTranscript);

      sessionData.transcripts.push({
        text: fullTranscript,
        timestamp: new Date().toISOString(),
        duration: recordingSeconds,
        emergency: true,
      });

      saveSessionData();
    }

    // Generate report and exit
    setTimeout(() => {
      generatePDFReport();
      window.location.href = "https://www.google.com";
    }, 500);
  }
}

async function stopVoiceRecording() {
    try {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
            clearInterval(recordingInterval);

    if (recognition) {
                recognition.stop();
    }

    // Get final transcript
            const transcript = liveTranscript.textContent.trim();

    // Hide modal
            voiceRecordingModal.style.display = "none";

            // Add transcript to chat and get response
    if (transcript) {
                const analysisResult = processMessage(transcript);
      addMessageToChat(
        transcript,
        "user",
        new Date().toISOString(),
        analysisResult.highlightMessage,
                    analysisResult.severeHighlightMessage
                );

      // Save transcript
      sessionData.transcripts.push({
        text: transcript,
        timestamp: new Date().toISOString(),
        duration: recordingSeconds,
                });

                saveSessionData();

                // Generate bot response using local system
                const botResponse = generateBotResponse(transcript, analysisResult);
                addMessageToChat(botResponse, "bot");
    }

    // Stop all tracks in the stream
    if (mediaRecorder.stream) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
        }
    } catch (error) {
        console.error('Error stopping voice recording:', error);
        cancelVoiceRecording();
  }
}

function cancelVoiceRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();

    if (recognition) {
      recognition.stop();
    }

    // Stop all tracks in the stream
    if (mediaRecorder.stream) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  }

  clearInterval(recordingInterval);
  voiceRecordingModal.style.display = "none";
}

function updateRecordingTime() {
  recordingSeconds++;
  const minutes = Math.floor(recordingSeconds / 60);
  const seconds = recordingSeconds % 60;
  recordingTime.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Risk meter functions
function updateRiskMeter() {
  // Calculate percentage (capped at 100%)
  const percentage = Math.min(Math.round((riskScore / maxRiskScore) * 100), 100);

  // Update width and text
  riskLevel.style.width = `${percentage}%`;
  riskPercentage.textContent = `${percentage}%`;

  // Update color based on risk level
  if (percentage < 30) {
    riskLevel.style.backgroundColor = "var(--success-color)";
  } else if (percentage < 70) {
    riskLevel.style.backgroundColor = "var(--warning-color)";
  } else {
    riskLevel.style.backgroundColor = "var(--danger-color)";
  }
}

// Alert words functions
function showAlertWordsModal() {
  alertWordsModal.style.display = "flex";
}

function hideAlertWordsModal() {
  alertWordsModal.style.display = "none";
}

function populateAlertWords() {
  // Clear existing content
  severity1Words.innerHTML = "";
  severity2Words.innerHTML = "";
  severity3Words.innerHTML = "";

  // Group alert words by severity
  Object.entries(ALERT_WORDS).forEach(([code, data]) => {
    const wordItem = document.createElement("div");
    wordItem.className = "alert-word-item";

    const wordCode = document.createElement("div");
    wordCode.className = "alert-word-code";
    wordCode.textContent = code;

    const wordText = document.createElement("div");
    wordText.className = "alert-word-text";
    wordText.textContent = data.word;

    wordItem.appendChild(wordCode);
    wordItem.appendChild(wordText);

    // Add to appropriate severity container
    if (data.severity === 1) {
      severity1Words.appendChild(wordItem);
    } else if (data.severity === 2) {
      severity2Words.appendChild(wordItem);
    }
    else if (data.severity === 3) {
      severity3Words.appendChild(wordItem);
    }
  });
}

// Function to send emergency report via email
async function sendEmergencyReport(pdfBlob) {
    try {
        // Simulate sending the report
        console.log('Simulating emergency report...');
        console.log('Report details:', {
            timestamp: new Date().toISOString(),
            location: sessionData.location || 'Not available',
            userAgent: navigator.userAgent,
            ipAddress: sessionData.ipAddress || 'Not available',
            riskLevel: `${sessionData.riskScore}%`,
            conversationHistory: sessionData.conversationHistory || []
        });

        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate successful report
        console.log('Emergency report simulation complete');
        return { 
            success: true, 
            message: 'Emergency report processed successfully',
            simulated: true
        };
    } catch (error) {
        console.error('Error in emergency report simulation:', error);
        throw error;
    }
}

// Update the emergency button click handler
document.addEventListener('DOMContentLoaded', () => {
    const emergencyButton = document.getElementById('emergencyButton');
    if (emergencyButton) {
        emergencyButton.addEventListener('click', async () => {
            try {
                // Generate PDF report
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                
                // Add title
                doc.setFontSize(20);
                doc.text('Emergency Report', 20, 20);
                
                // Add timestamp
                doc.setFontSize(12);
                doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
                
                // Add IP address
                const ipAddress = sessionData.ipAddress || "Fetching...";
                doc.text(`IP Address: ${ipAddress}`, 20, 40);
                
                // Add risk assessment
                doc.setFontSize(16);
                doc.text('Risk Assessment', 20, 50);
                doc.setFontSize(12);
                doc.text(`Current Risk Level: ${sessionData.riskScore}%`, 20, 60);
                doc.text(`Escalation Level: ${sessionData.riskScore < 30 ? 'Low' : sessionData.riskScore < 70 ? 'Medium' : 'High'}`, 20, 70);
                
                // Add conversation history
                doc.setFontSize(16);
                doc.text('Conversation History', 20, 90);
                doc.setFontSize(12);
                let y = 100;
                sessionData.messages.forEach((msg) => {
                    if (y > 250) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.text(`${msg.sender}: ${msg.text}`, 20, y);
                    doc.text(new Date(msg.timestamp).toLocaleString(), 20, y + 5);
                    y += 15;
                });

                // Convert PDF to blob
                const pdfBlob = doc.output('blob');

                // Simulate sending the report
                await sendEmergencyReport(pdfBlob);

                // Create and show message
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-size: 24px;
                    z-index: 9999;
                    text-align: center;
                    padding: 20px;
                `;
                messageDiv.innerHTML = `
                    <p style="margin-bottom: 20px;">Report has been sent to emergency services.</p>
                    <p>Do not worry, help is on the way.</p>
                `;
                document.body.appendChild(messageDiv);

                // Clear session data
                localStorage.clear();
                sessionStorage.clear();

                // Push a dummy state to sandwich our page in history
                history.pushState(null, null, location.href);

                // Intercept any back-press while still here
                window.addEventListener('popstate', () => {
                    // Force them forward again
                    history.go(1);
                });

                // After 3 seconds, replace current page with Amazon
                setTimeout(() => {
                    window.location.replace('https://www.amazon.com');
                }, 3000);

            } catch (error) {
                console.error('Error in emergency procedure:', error);
                alert('Emergency report could not be processed. Please try again or contact emergency services directly.');
            }
        });
    } else {
        console.error('Emergency button not found in the DOM');
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', init);