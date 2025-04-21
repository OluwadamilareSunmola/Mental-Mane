// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const decoyButton = document.getElementById("decoy-button");
const exportDataBtn = document.getElementById("export-data-btn");
const riskLevelDashboard = document.getElementById("risk-level-dashboard");
const riskPercentageDashboard = document.getElementById("risk-percentage-dashboard");
const escalationLevel = document.getElementById("escalation-level");
const detectedPatterns = document.getElementById("detected-patterns");
const lastUpdate = document.getElementById("last-update");
const keywordContainer = document.getElementById("keyword-container");
const conversationHistory = document.getElementById("conversation-history");
const emotionalIndicators = document.getElementById("emotional-indicators");
const transcriptFlags = document.getElementById("transcript-flags");
const coverUpButton = document.getElementById("cover-up-button");
const ipAddress = document.getElementById("ip-address");
const graphContainer = document.getElementById("graph-container");

// State variables
let darkMode = localStorage.getItem("darkMode") === "true";
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
  sentimentAnalysis: {},
  conversationContext: {
    currentTopic: null,
    detectedEntities: {},
    followUpQuestions: [],
  },
};

// Emergency keywords
const emergencyKeywords = [
  'help', 'emergency', 'danger', 'scared', 'afraid', 'terrified', 'hurt', 'abuse',
  'threat', 'unsafe', 'dangerous', 'fear', 'panic', 'anxious', 'worried'
];

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
const emotionalIndicatorsList = {
  fear: ["scared", "afraid", "terrified", "frightened", "fearful", "panic", "anxious", "worried"],
  anger: ["angry", "mad", "furious", "rage", "outraged", "irritated", "annoyed"],
  sadness: ["sad", "depressed", "unhappy", "miserable", "heartbroken", "devastated", "down"],
  helplessness: ["helpless", "trapped", "stuck", "hopeless", "powerless", "desperate", "please", "help"],
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
  {
    pattern: "distress signals",
    keywords: ["help", "please", "need", "emergency", "urgent", "now", "immediately"],
    severity: 3,
    followUp: "I'm concerned about your safety. Are you in immediate danger?",
  },
];

// Initialize the dashboard
function init() {
  console.log("Initializing dashboard...");
  
  // Set initial theme
  updateTheme();

  // Load session data
  loadSessionData();

  // Get IP address
  getIPAddress();

  // Event listeners
  themeToggle.addEventListener("click", toggleTheme);
  decoyButton.addEventListener("click", activateDecoy);
  exportDataBtn.addEventListener("click", exportData);
  coverUpButton.addEventListener("click", activateCoverUp);

  // Add escape key listener for emergency exit
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      activateDecoy();
    }
  });

  // Analyze conversation history
  analyzeConversationHistory();

  // Update all dashboard components
  updateDashboard();

  // Set up event listeners
  setupEventListeners();
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

// Emergency decoy function
function activateDecoy() {
  // Generate report before redirecting
  generatePDFReport();

  // Redirect to Google or another benign site
  window.location.href = "https://www.google.com";
}

function activateCoverUp() {
  // Log the cover up exit
  if (sessionData.emergencyTriggers) {
    sessionData.emergencyTriggers.push({
      type: "cover_up_button",
      timestamp: new Date().toISOString(),
    });
  }

  // Generate report before redirecting
  generatePDFReport();

  // Redirect to Google or another benign site
  window.location.href = "https://www.google.com";
}

// Session management
function loadSessionData() {
  console.log("Loading session data...");
  const savedData = localStorage.getItem("abuseDetectionSession");
  if (savedData) {
    try {
      sessionData = JSON.parse(savedData);
      console.log("Session data loaded:", sessionData);
    } catch (error) {
      console.error("Error parsing session data:", error);
      showNoDataMessage();
    }
  } else {
    showNoDataMessage();
  }
}

// Get IP address
async function getIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    sessionData.ipAddress = data.ip;
    ipAddress.textContent = data.ip;
    saveSessionData();
  } catch (error) {
    console.error("Error fetching IP address:", error);
    ipAddress.textContent = "Unable to detect";
  }
}

function showNoDataMessage() {
  keywordContainer.innerHTML = '<div class="placeholder-text">No session data available</div>';
  conversationHistory.innerHTML = '<div class="placeholder-text">No conversation history available</div>';
  emotionalIndicators.innerHTML = '<div class="placeholder-text">No emotional indicators detected</div>';
  transcriptFlags.innerHTML = '<div class="placeholder-text">No transcript flags detected</div>';
  graphContainer.innerHTML = '<div class="placeholder-text">No data available for visualization</div>';

  // Set risk level to 0
  riskLevelDashboard.style.width = "0%";
  riskPercentageDashboard.textContent = "0%";
  escalationLevel.textContent = "None";
  detectedPatterns.textContent = "None detected";
  lastUpdate.textContent = "Never";
  ipAddress.textContent = "Unknown";
}

// Analyze conversation history to update risk assessment
function analyzeConversationHistory() {
  if (!sessionData.messages || sessionData.messages.length === 0) {
    return;
  }

  // Reset analysis data
  sessionData.keywords = {};
  sessionData.emotionalIndicators = {};
  sessionData.contextualAnalysis = [];
  sessionData.wordFrequency = {};
  let riskScore = 0;

  // Count word frequency across all messages
  const wordCounts = {};

  // Analyze each message
  sessionData.messages.forEach(message => {
    if (message.sender === "user") {
      const text = message.text.toLowerCase();
      
      // Count words for frequency analysis
      const words = text.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) {
          if (!wordCounts[word]) {
            wordCounts[word] = 1;
          } else {
            wordCounts[word]++;
          }
        }
      });

      // Check for emergency keywords
      emergencyKeywords.forEach(keyword => {
        if (text.includes(keyword)) {
          // Add to keywords with appropriate severity
          if (!sessionData.keywords[keyword]) {
            sessionData.keywords[keyword] = {
              count: 1,
              severity: 3,  // Emergency keywords are high severity
              category: "emergency",
              timestamp: message.timestamp
            };
          } else {
            sessionData.keywords[keyword].count++;
            sessionData.keywords[keyword].lastSeen = message.timestamp;
          }
          
          // Increase risk score based on frequency
          riskScore += 5 * sessionData.keywords[keyword].count;
        }
      });

      // Check for DSM indicators
      Object.keys(dsmIndicators).forEach(keyword => {
        if (text.includes(keyword)) {
          const severity = dsmIndicators[keyword];
          
          if (!sessionData.keywords[keyword]) {
            sessionData.keywords[keyword] = {
              count: 1,
              severity: severity,
              category: getCategoryForKeyword(keyword),
              timestamp: message.timestamp
            };
          } else {
            sessionData.keywords[keyword].count++;
            sessionData.keywords[keyword].lastSeen = message.timestamp;
          }
          
          riskScore += severity * 2;
        }
      });

      // Check for emotional indicators
      Object.entries(emotionalIndicatorsList).forEach(([emotion, keywords]) => {
        keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            if (!sessionData.emotionalIndicators[emotion]) {
              sessionData.emotionalIndicators[emotion] = {
                count: 1,
                intensity: getEmotionIntensity(emotion)
              };
            } else {
              sessionData.emotionalIndicators[emotion].count++;
            }
            
            riskScore += getEmotionIntensity(emotion);
          }
        });
      });

      // Check for contextual patterns
      contextualPatterns.forEach(pattern => {
        let matchCount = 0;
        const matchedKeywords = [];
        
        pattern.keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            matchCount++;
            matchedKeywords.push(keyword);
          }
        });
        
        if (matchCount >= 2 || (matchCount === 1 && pattern.pattern === "distress signals")) {
          sessionData.contextualAnalysis.push({
            pattern: pattern.pattern,
            severity: pattern.severity,
            matchedKeywords: matchedKeywords,
            message: message.text,
            timestamp: message.timestamp
          });
          
          riskScore += pattern.severity * 5;
        }
      });

      // Special case for repeated help messages
      if (text.includes("help") && sessionData.keywords["help"] && sessionData.keywords["help"].count >= 2) {
        if (!sessionData.contextualAnalysis.some(a => a.pattern === "repeated help requests")) {
          sessionData.contextualAnalysis.push({
            pattern: "repeated help requests",
            severity: 3,
            matchedKeywords: ["help"],
            message: "Multiple help requests detected",
            timestamp: message.timestamp
          });
          
          riskScore += 15; // Significant risk increase for repeated help
        }
      }
    }
  });

  // Update word frequency
  sessionData.wordFrequency = wordCounts;
  
  // Cap risk score at 100
  sessionData.riskScore = Math.min(riskScore, 100);
  
  // Save updated session data
  saveSessionData();
}

// Helper function to get category for keyword
function getCategoryForKeyword(keyword) {
  // Physical abuse keywords
  if (["hurt", "hit", "punch", "slap", "kick", "beat", "push", "shove", "throw"].includes(keyword)) {
    return "physical";
  }
  
  // Emotional keywords
  if (["scared", "afraid", "terrified", "frightened", "fearful", "panic", "anxious", "worried"].includes(keyword)) {
    return "emotional";
  }
  
  // Isolation keywords
  if (["alone", "isolated", "control", "monitor", "track", "check"].includes(keyword)) {
    return "social";
  }
  
  // Threat keywords
  if (["threat", "threatened", "weapon", "knife", "gun", "die", "suicide", "kill"].includes(keyword)) {
    return "safety";
  }
  
  // Emergency keywords
  if (["help", "emergency", "danger", "unsafe"].includes(keyword)) {
    return "emergency";
  }
  
  // Default
  return "general";
}

// Helper function to get emotion intensity
function getEmotionIntensity(emotion) {
  if (["fear", "helplessness"].includes(emotion)) {
    return 3;
  } else if (["anger", "shame"].includes(emotion)) {
    return 2;
  } else {
    return 1;
  }
}

// Update dashboard with session data
function updateDashboard() {
  console.log("Updating dashboard...");
  
  // Update risk meter
  updateRiskMeter();

  // Update keywords
  updateKeywords();

  // Update conversation history
  updateConversationHistory();

  // Update emotional indicators
  updateEmotionalIndicators();

  // Update transcript flags
  updateTranscriptFlags();

  // Update word frequency graph
  updateWordFrequencyGraph();

  // Update detected patterns
  updateDetectedPatterns();

  // Update last update time
  if (sessionData.lastUpdate) {
    lastUpdate.textContent = new Date(sessionData.lastUpdate).toLocaleString();
  } else {
    lastUpdate.textContent = "Never";
  }
}

// Update detected patterns text
function updateDetectedPatterns() {
  if (sessionData.contextualAnalysis && sessionData.contextualAnalysis.length > 0) {
    const patterns = [...new Set(sessionData.contextualAnalysis.map(a => a.pattern))];
    detectedPatterns.textContent = patterns.join(", ");
  } else {
    detectedPatterns.textContent = "None detected";
  }
}

// Update risk meter
function updateRiskMeter() {
  const percentage = Math.min(Math.round(sessionData.riskScore), 100);
  riskLevelDashboard.style.width = `${percentage}%`;
  riskPercentageDashboard.textContent = `${percentage}%`;
  
  // Update escalation level based on risk score
  if (percentage < 30) {
    escalationLevel.textContent = "Low";
    riskLevelDashboard.style.backgroundColor = "var(--success-color)";
  } else if (percentage < 70) {
    escalationLevel.textContent = "Medium";
    riskLevelDashboard.style.backgroundColor = "var(--warning-color)";
  } else {
    escalationLevel.textContent = "High";
    riskLevelDashboard.style.backgroundColor = "var(--danger-color)";
  }
}

// Update keywords section
function updateKeywords() {
  keywordContainer.innerHTML = "";
  
  if (Object.keys(sessionData.keywords).length === 0) {
    keywordContainer.innerHTML = '<div class="placeholder-text">No keywords detected yet</div>';
    return;
  }
  
  // Group keywords by category and severity
  const groupedKeywords = {};
  Object.entries(sessionData.keywords).forEach(([keyword, data]) => {
    if (!groupedKeywords[data.category]) {
      groupedKeywords[data.category] = [];
    }
    groupedKeywords[data.category].push({
      keyword,
      severity: data.severity,
      frequency: data.count
    });
  });

  // Display grouped keywords
  Object.entries(groupedKeywords).forEach(([category, keywords]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'keyword-category';
    categoryDiv.innerHTML = `<h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>`;
    
    keywords.forEach(({ keyword, severity, frequency }) => {
      const keywordElement = document.createElement('div');
      keywordElement.className = `keyword-tag severity-${severity}`;
      keywordElement.textContent = `${keyword} (${frequency})`;
      categoryDiv.appendChild(keywordElement);
    });
    
    keywordContainer.appendChild(categoryDiv);
  });
}

// Update conversation history
function updateConversationHistory() {
  conversationHistory.innerHTML = "";
  
  if (sessionData.messages.length === 0) {
    conversationHistory.innerHTML = '<div class="placeholder-text">No conversation history available</div>';
    return;
  }
  
  sessionData.messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.className = `history-item ${message.sender}`;
    if (message.highlighted) messageElement.classList.add("highlighted");
    if (message.severeHighlighted) messageElement.classList.add("severe-highlighted");
    
    // Check for emergency keywords in user messages
    if (message.sender === "user") {
      const text = message.text.toLowerCase();
      if (emergencyKeywords.some(keyword => text.includes(keyword))) {
        messageElement.classList.add("highlighted");
        
        // If "help" appears multiple times or with "please", mark as severe
        if ((text.includes("help") && text.includes("please")) || 
            (text.includes("help") && sessionData.keywords["help"] && sessionData.keywords["help"].count >= 2)) {
          messageElement.classList.add("severe-highlighted");
        }
      }
    }
    
    messageElement.innerHTML = `
      <div class="history-meta">
        <span class="sender">${message.sender.charAt(0).toUpperCase() + message.sender.slice(1)}:</span>
        <span class="timestamp">${new Date(message.timestamp).toLocaleString()}</span>
      </div>
      <div class="message-content">
        <p>${message.text}</p>
      </div>
    `;
    
    conversationHistory.appendChild(messageElement);
  });
}

// Update emotional indicators
function updateEmotionalIndicators() {
  emotionalIndicators.innerHTML = "";
  
  if (Object.keys(sessionData.emotionalIndicators).length === 0) {
    emotionalIndicators.innerHTML = '<div class="placeholder-text">No emotional indicators detected yet</div>';
    return;
  }
  
  // Create emotion list
  Object.entries(sessionData.emotionalIndicators).forEach(([emotion, data]) => {
    const emotionElement = document.createElement("div");
    emotionElement.className = `indicator-item`;
    
    // Determine intensity text
    let intensityText = "Low";
    if (data.intensity === 2) intensityText = "Medium";
    if (data.intensity === 3) intensityText = "High";
    
    emotionElement.innerHTML = `
      <span class="emotion-name">${emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
      <span class="emotion-count">${intensityText} (${data.count})</span>
    `;
    emotionalIndicators.appendChild(emotionElement);
  });
}

// Update transcript flags
function updateTranscriptFlags() {
  transcriptFlags.innerHTML = "";
  
  if (sessionData.contextualAnalysis.length === 0) {
    transcriptFlags.innerHTML = '<div class="placeholder-text">No transcript flags detected yet</div>';
    return;
  }
  
  sessionData.contextualAnalysis.forEach(analysis => {
    const flagElement = document.createElement("div");
    flagElement.className = `flag-item`;
    
    // Add severity class
    if (analysis.severity === 3) {
      flagElement.classList.add("severe-highlighted");
    } else if (analysis.severity === 2) {
      flagElement.classList.add("highlighted");
    }
    
    flagElement.innerHTML = `
      <span class="pattern">${analysis.pattern}</span>
      <span class="keywords">${analysis.matchedKeywords.join(", ")}</span>
    `;
    transcriptFlags.appendChild(flagElement);
  });
}

// Update word frequency graph
function updateWordFrequencyGraph() {
  graphContainer.innerHTML = "";
  
  if (Object.keys(sessionData.wordFrequency).length === 0) {
    graphContainer.innerHTML = '<div class="placeholder-text">No data available for visualization</div>';
    return;
  }
  
  // Create a simple bar chart for word frequency
  const wordFreqDiv = document.createElement("div");
  wordFreqDiv.className = "word-frequency-chart";
  
  // Get top 15 words by frequency
  const topWords = Object.entries(sessionData.wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);
  
  // Create bars for each word
  topWords.forEach(([word, count]) => {
    const barContainer = document.createElement("div");
    barContainer.className = "freq-bar-container";
    
    const label = document.createElement("div");
    label.className = "freq-label";
    label.textContent = word;
    
    const bar = document.createElement("div");
    bar.className = "freq-bar";
    
    // Calculate percentage (max is the highest count)
    const maxCount = topWords[0][1];
    const percentage = (count / maxCount) * 100;
    bar.style.width = `${percentage}%`;
    
    // Color high-risk words differently
    if (emergencyKeywords.includes(word)) {
      bar.style.backgroundColor = "var(--danger-color)";
    }
    
    const countLabel = document.createElement("div");
    countLabel.className = "freq-count";
    countLabel.textContent = count;
    
    barContainer.appendChild(label);
    barContainer.appendChild(bar);
    barContainer.appendChild(countLabel);
    
    wordFreqDiv.appendChild(barContainer);
  });
  
  graphContainer.appendChild(wordFreqDiv);
  
  // Add some basic styling for the chart
  const style = document.createElement("style");
  style.textContent = `
    .word-frequency-chart {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
      overflow-y: auto;
      padding: 10px;
    }
    .freq-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .freq-label {
      width: 100px;
      text-align: right;
      font-size: 0.9rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .freq-bar {
      height: 20px;
      background-color: var(--primary-color);
      border-radius: 4px;
      flex-grow: 1;
    }
    .freq-count {
      width: 40px;
      text-align: right;
      font-size: 0.9rem;
    }
  `;
  document.head.appendChild(style);
}

// Save session data to localStorage
function saveSessionData() {
  sessionData.lastUpdate = new Date().toISOString();
  localStorage.setItem("abuseDetectionSession", JSON.stringify(sessionData));
}

// Set up event listeners
function setupEventListeners() {
  // Listen for storage events to sync data between tabs
  window.addEventListener("storage", (event) => {
    if (event.key === "abuseDetectionSession") {
      loadSessionData();
      analyzeConversationHistory();
      updateDashboard();
    }
  });
}

// Export data function
function exportData() {
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
        doc.text(`IP Address: ${sessionData.ipAddress || 'Not available'}`, 20, 40);
        
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
        sessionData.messages.forEach((message, index) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.text(`${message.sender}: ${message.text}`, 20, y);
            doc.text(new Date(message.timestamp).toLocaleString(), 20, y + 5);
            y += 15;
        });
        
        // Add detected patterns
        doc.setFontSize(16);
        doc.text('Detected Patterns', 20, y + 10);
        doc.setFontSize(12);
        y += 20;
        sessionData.contextualAnalysis.forEach(analysis => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }
            doc.text(`Pattern: ${analysis.pattern}`, 20, y);
            doc.text(`Severity: ${analysis.severity}`, 20, y + 5);
            y += 15;
        });
        
        // Save the PDF
        doc.save('wellness-report.pdf');
    } catch (error) {
        console.error('Error exporting data:', error);
        alert('Error generating report. Please try again.');
    }
}

// Generate PDF report
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
    doc.text(`IP Address: ${sessionData.ipAddress || 'Not available'}`, 20, 40);
    
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

// Initialize the dashboard when the DOM is loaded
document.addEventListener("DOMContentLoaded", init);