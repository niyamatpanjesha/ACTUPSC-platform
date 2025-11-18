// Application State
const appState = {
  user: null,
  currentWeek: 0,
  tasks: [],
  notes: [],
  evaluations: [],
  tests: [],
  libraryResources: [],
  currentView: 'dashboard'
};

// Initialize App
function initApp() {
  initializeSampleData();
}

// Show Toast Notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Update Hours Display
function updateHoursDisplay(value) {
  document.getElementById('hours-display').textContent = value;
}

// Show Onboarding
function showOnboarding() {
  document.getElementById('landing-page').classList.remove('active');
  document.getElementById('onboarding-page').classList.add('active');
}

// Complete Onboarding
function completeOnboarding(event) {
  event.preventDefault();
  
  appState.user = {
    name: document.getElementById('user-name').value,
    examYear: document.getElementById('exam-year').value,
    examStage: document.getElementById('exam-stage').value,
    optionalSubject: document.getElementById('optional-subject').value,
    studyHours: document.getElementById('study-hours').value,
    prepLevel: document.getElementById('prep-level').value
  };
  
  generateStudyPlan();
  
  document.getElementById('onboarding-page').classList.remove('active');
  document.getElementById('main-app').classList.add('active');
  document.getElementById('user-display-name').textContent = appState.user.name;
  
  showToast('Welcome! Your personalized study plan has been generated.');
}

// Generate Study Plan
function generateStudyPlan() {
  const weeks = 12;
  appState.tasks = [];
  
  for (let week = 0; week < weeks; week++) {
    const weekTasks = generateWeeklyTasks(week);
    appState.tasks.push(weekTasks);
  }
}

// Generate Weekly Tasks
function generateWeeklyTasks(weekNum) {
  const stage = appState.user.examStage;
  const level = appState.user.prepLevel;
  const optional = appState.user.optionalSubject;
  
  const tasks = [];
  
  // Prelims focused tasks
  if (stage === 'Prelims' || stage === 'Both') {
    tasks.push({
      id: `task-${weekNum}-1`,
      title: level === 'Beginner' ? 'Read NCERT History (Class 11-12)' : 'Advanced History Analysis - Ancient India',
      type: 'Reading',
      subject: 'History',
      duration: '2 hours',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
    
    tasks.push({
      id: `task-${weekNum}-2`,
      title: 'Solve 100 Polity MCQs',
      type: 'Practice',
      subject: 'Polity',
      duration: '1.5 hours',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
    
    tasks.push({
      id: `task-${weekNum}-3`,
      title: 'Geography - Physical Features of India',
      type: 'Reading',
      subject: 'Geography',
      duration: '2 hours',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
  }
  
  // Mains focused tasks
  if (stage === 'Mains' || stage === 'Both') {
    tasks.push({
      id: `task-${weekNum}-4`,
      title: 'Write answer: Role of Civil Services in governance',
      type: 'Answer Writing',
      subject: 'GS2',
      duration: '30 mins',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
    
    tasks.push({
      id: `task-${weekNum}-5`,
      title: 'GS3: Economic Development - Agriculture sector',
      type: 'Reading',
      subject: 'GS3',
      duration: '2 hours',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
    
    tasks.push({
      id: `task-${weekNum}-6`,
      title: `${optional} - Chapter ${weekNum + 1}`,
      type: 'Reading',
      subject: optional,
      duration: '3 hours',
      completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
    });
  }
  
  // Common tasks
  tasks.push({
    id: `task-${weekNum}-7`,
    title: 'Current Affairs - The Hindu Editorial Analysis',
    type: 'Current Affairs',
    subject: 'Current Affairs',
    duration: '1 hour',
    completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
  });
  
  tasks.push({
    id: `task-${weekNum}-8`,
    title: `PYQ Test ${2024 - weekNum}`,
    type: 'Tests',
    subject: 'General Studies',
    duration: '2 hours',
    completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
  });
  
  tasks.push({
    id: `task-${weekNum}-9`,
    title: 'Revise previous week topics',
    type: 'Revision',
    subject: 'All Subjects',
    duration: '1.5 hours',
    completed: weekNum < appState.currentWeek ? Math.random() > 0.3 : false
  });
  
  return tasks;
}

// Navigate to View
function navigateTo(view) {
  // Update navbar
  document.querySelectorAll('.navbar-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update views
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('active');
  });
  
  appState.currentView = view;
  
  switch(view) {
    case 'dashboard':
      document.getElementById('dashboard-view').classList.add('active');
      break;
    case 'study-plan':
      renderStudyPlan();
      document.getElementById('study-plan-view').classList.add('active');
      break;
    case 'answer-evaluation':
      renderAnswerEvaluation();
      document.getElementById('answer-evaluation-view').classList.add('active');
      break;
    case 'performance':
      renderPerformance();
      document.getElementById('performance-view').classList.add('active');
      break;
    case 'notebook':
      renderNotebook();
      document.getElementById('notebook-view').classList.add('active');
      break;
    case 'library':
      renderLibrary();
      document.getElementById('library-view').classList.add('active');
      break;
    case 'test-series':
      renderTestSeries();
      document.getElementById('test-series-view').classList.add('active');
      break;
  }
}

// Render Study Plan
function renderStudyPlan() {
  const view = document.getElementById('study-plan-view');
  const currentWeekTasks = appState.tasks[appState.currentWeek] || [];
  
  const completed = currentWeekTasks.filter(t => t.completed).length;
  const total = currentWeekTasks.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - startDate.getDay() + (appState.currentWeek * 7));
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);
  
  view.innerHTML = `
    <div class="container">
      <h2 class="view-title">Study Plan</h2>
      
      <div class="week-navigation">
        <button class="btn btn--secondary" onclick="changeWeek(-1)" ${appState.currentWeek === 0 ? 'disabled' : ''}>
          ← Previous Week
        </button>
        <div class="week-info">
          <div class="week-title">Week ${appState.currentWeek + 1}</div>
          <div class="week-dates">${formatDate(startDate)} - ${formatDate(endDate)}</div>
        </div>
        <button class="btn btn--secondary" onclick="changeWeek(1)" ${appState.currentWeek >= appState.tasks.length - 1 ? 'disabled' : ''}>
          Next Week →
        </button>
      </div>
      
      <div class="card" style="margin-bottom: 24px;">
        <div class="card__body">
          <h3>Weekly Progress</h3>
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progress}%;"></div>
            </div>
            <span class="progress-text">${completed} of ${total} tasks completed</span>
          </div>
        </div>
      </div>
      
      <div id="tasks-container">
        ${currentWeekTasks.map(task => renderTask(task)).join('')}
      </div>
    </div>
  `;
}

// Render Task
function renderTask(task) {
  const icons = {
    'Reading': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"></path></svg>',
    'Practice': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path></svg>',
    'Current Affairs': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path></svg>',
    'Answer Writing': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path><path d="M14 2v6h6"></path></svg>',
    'Tests': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>',
    'Revision': '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2"></path></svg>'
  };
  
  const colors = {
    'Reading': 'var(--color-bg-1)',
    'Practice': 'var(--color-bg-2)',
    'Current Affairs': 'var(--color-bg-3)',
    'Answer Writing': 'var(--color-bg-5)',
    'Tests': 'var(--color-bg-4)',
    'Revision': 'var(--color-bg-8)'
  };
  
  return `
    <div class="task-item ${task.completed ? 'completed' : ''}">
      <div class="task-icon" style="background: ${colors[task.type]};">
        ${icons[task.type]}
      </div>
      <div class="task-content">
        <div class="task-title">${task.title}</div>
        <div class="task-meta">
          <span>📚 ${task.subject}</span>
          <span>⏱️ ${task.duration}</span>
          <span>📝 ${task.type}</span>
        </div>
      </div>
      <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')"></div>
    </div>
  `;
}

// Toggle Task
function toggleTask(taskId) {
  const task = appState.tasks[appState.currentWeek].find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    renderStudyPlan();
    showToast(task.completed ? 'Task completed! 🎉' : 'Task marked as incomplete');
  }
}

// Change Week
function changeWeek(delta) {
  appState.currentWeek = Math.max(0, Math.min(appState.tasks.length - 1, appState.currentWeek + delta));
  renderStudyPlan();
}

// Format Date
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

// Render Answer Evaluation
function renderAnswerEvaluation() {
  const view = document.getElementById('answer-evaluation-view');
  
  view.innerHTML = `
    <div class="container">
      <h2 class="view-title">Answer Evaluation</h2>
      
      <div class="card">
        <div class="card__body">
          <h3>Submit Your Answer</h3>
          <form onsubmit="evaluateAnswer(event)">
            <div class="form-group">
              <label class="form-label">Question</label>
              <textarea class="form-control" id="question-text" rows="3" placeholder="Enter the question you're answering" required></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Your Answer</label>
              <textarea class="form-control" id="answer-text" rows="10" placeholder="Write your answer here (150-250 words recommended)" required></textarea>
            </div>
            <button type="submit" class="btn btn--primary">Evaluate Answer</button>
          </form>
        </div>
      </div>
      
      <div id="evaluation-results"></div>
      
      ${appState.evaluations.length > 0 ? `
        <h3 style="margin-top: 32px; margin-bottom: 16px;">Previous Evaluations</h3>
        ${appState.evaluations.map(renderEvaluationSummary).join('')}
      ` : ''}
    </div>
  `;
}

// Evaluate Answer
function evaluateAnswer(event) {
  event.preventDefault();
  
  const question = document.getElementById('question-text').value;
  const answer = document.getElementById('answer-text').value;
  
  // AI Evaluation Logic
  const wordCount = answer.trim().split(/\s+/).length;
  const hasIntro = answer.toLowerCase().includes('introduction') || answer.split('\n\n').length >= 2;
  const hasConclusion = answer.toLowerCase().includes('conclusion') || answer.toLowerCase().includes('thus') || answer.toLowerCase().includes('therefore');
  const hasExamples = answer.match(/for example|for instance|such as|like|case of/gi)?.length || 0;
  
  let contentScore = Math.min(5, Math.floor(wordCount / 40) + hasExamples);
  let structureScore = (hasIntro ? 2 : 1) + (hasConclusion ? 2 : 1) + (wordCount >= 150 ? 1 : 0);
  let analysisScore = Math.min(5, hasExamples + (wordCount > 200 ? 2 : 1) + 1);
  let languageScore = Math.min(5, wordCount >= 150 ? 4 : 3);
  
  const totalScore = contentScore + structureScore + analysisScore + languageScore;
  
  const evaluation = {
    id: `eval-${Date.now()}`,
    question,
    answer,
    date: new Date(),
    scores: {
      content: contentScore,
      structure: structureScore,
      analysis: analysisScore,
      language: languageScore,
      total: totalScore
    },
    strengths: generateStrengths(contentScore, structureScore, analysisScore, languageScore),
    improvements: generateImprovements(contentScore, structureScore, analysisScore, languageScore),
    modelAnswer: generateModelAnswer(question)
  };
  
  appState.evaluations.unshift(evaluation);
  
  displayEvaluationResult(evaluation);
  showToast('Answer evaluated successfully!');
}

// Generate Strengths
function generateStrengths(content, structure, analysis, language) {
  const strengths = [];
  
  if (content >= 4) strengths.push('Good coverage of relevant content and facts');
  if (structure >= 4) strengths.push('Well-structured answer with clear flow');
  if (analysis >= 4) strengths.push('Strong analytical and critical thinking');
  if (language >= 4) strengths.push('Clear and concise language');
  
  if (strengths.length === 0) {
    strengths.push('Answer shows basic understanding of the topic');
  }
  
  return strengths;
}

// Generate Improvements
function generateImprovements(content, structure, analysis, language) {
  const improvements = [];
  
  if (content < 4) improvements.push('Include more relevant facts, data, and examples to support your arguments');
  if (structure < 4) improvements.push('Follow Introduction-Body-Conclusion structure more clearly');
  if (analysis < 4) improvements.push('Add deeper critical analysis and multiple perspectives');
  if (language < 4) improvements.push('Improve clarity and reduce wordiness');
  
  improvements.push('Ensure answer stays within 150-250 word limit');
  improvements.push('Use more case studies and recent examples');
  
  return improvements;
}

// Generate Model Answer
function generateModelAnswer(question) {
  return `A model answer would include: (1) A brief introduction setting the context, (2) Multiple dimensions of the issue with relevant facts and examples, (3) Both positive and negative aspects showing balanced understanding, (4) References to government policies, committees, or constitutional provisions where relevant, (5) Recent examples or case studies, and (6) A brief conclusion with forward-looking perspective. The answer should be within 150-250 words, demonstrate critical analysis, and maintain coherent structure throughout.`;
}

// Display Evaluation Result
function displayEvaluationResult(evaluation) {
  const resultsDiv = document.getElementById('evaluation-results');
  
  resultsDiv.innerHTML = `
    <div class="evaluation-result">
      <div class="score-circle">
        <div class="score-value">${evaluation.scores.total}/20</div>
        <div class="score-label">Total Score</div>
      </div>
      
      <div class="score-breakdown">
        <div class="score-item">
          <div class="score-item-label">Content &amp; Relevance</div>
          <div class="score-item-value">${evaluation.scores.content}/5</div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Structure &amp; Organization</div>
          <div class="score-item-value">${evaluation.scores.structure}/5</div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Analysis &amp; Critical Thinking</div>
          <div class="score-item-value">${evaluation.scores.analysis}/5</div>
        </div>
        <div class="score-item">
          <div class="score-item-label">Language &amp; Clarity</div>
          <div class="score-item-value">${evaluation.scores.language}/5</div>
        </div>
      </div>
      
      <div class="feedback-section">
        <h4>✅ Strengths</h4>
        <ul class="feedback-list">
          ${evaluation.strengths.map(s => `<li>${s}</li>`).join('')}
        </ul>
      </div>
      
      <div class="feedback-section">
        <h4>📈 Areas for Improvement</h4>
        <ul class="feedback-list">
          ${evaluation.improvements.map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      
      <div class="feedback-section">
        <h4>📝 Model Answer Approach</h4>
        <div class="model-answer">
          ${evaluation.modelAnswer}
        </div>
      </div>
    </div>
  `;
}

// Render Evaluation Summary
function renderEvaluationSummary(evaluation) {
  return `
    <div class="card" style="margin-bottom: 16px;">
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="flex: 1;">
            <strong>${evaluation.question.substring(0, 100)}...</strong>
            <div style="margin-top: 8px; font-size: 12px; color: var(--color-text-secondary);">
              ${evaluation.date.toLocaleDateString()}
            </div>
          </div>
          <div class="badge" style="margin-left: 16px;">
            ${evaluation.scores.total}/20
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Performance
function renderPerformance() {
  const view = document.getElementById('performance-view');
  
  const subjects = ['History', 'Geography', 'Polity', 'Economy', 'Environment', 'Science & Tech'];
  const scores = subjects.map(() => Math.floor(Math.random() * 30) + 60);
  
  view.innerHTML = `
    <div class="container">
      <h2 class="view-title">Performance Analytics</h2>
      
      <div class="card" style="margin-bottom: 24px;">
        <div class="card__body">
          <h3>Weekly Performance Report</h3>
          
          <div class="feedback-section">
            <h4>💪 Your Strengths</h4>
            <ul class="feedback-list">
              <li>Consistent performance in Polity and Governance topics</li>
              <li>Good answer writing structure and presentation</li>
              <li>Regular completion of current affairs tasks</li>
              <li>Strong performance in prelims mock tests</li>
            </ul>
          </div>
          
          <div class="feedback-section">
            <h4>🎯 Areas to Focus</h4>
            <ul class="feedback-list">
              <li>Need more practice in Geography map-based questions</li>
              <li>Improve speed in CSAT quantitative sections</li>
              <li>Add more examples and case studies in mains answers</li>
              <li>Spend more time on optional subject preparation</li>
            </ul>
          </div>
          
          <div class="feedback-section">
            <h4>🚀 AI Recommendations</h4>
            <ul class="feedback-list">
              <li>Take at least 2 full-length mock tests per week</li>
              <li>Focus on Environment & Ecology - recent exam trends show increasing weightage</li>
              <li>Practice answer writing daily - target 5 answers per day</li>
              <li>Revise previous months' current affairs every weekend</li>
              <li>Work on time management - practice completing papers within time limit</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card__body">
          <h3>Subject-wise Performance</h3>
          <div style="margin-top: 24px;">
            ${subjects.map((subject, i) => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span>${subject}</span>
                  <span style="font-weight: 600;">${scores[i]}%</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${scores[i]}%;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Render Notebook
function renderNotebook() {
  const view = document.getElementById('notebook-view');
  
  view.innerHTML = `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <h2 class="view-title" style="margin: 0;">My Notebook</h2>
        <button class="btn btn--primary" onclick="showNoteEditor()">+ Create New Note</button>
      </div>
      
      <div class="search-bar">
        <input type="text" class="search-input" placeholder="Search notes..." oninput="filterNotes(this.value)">
      </div>
      
      <div id="notes-list">
        ${appState.notes.length === 0 ? '<p style="text-align: center; color: var(--color-text-secondary); padding: 48px;">No notes yet. Create your first note to get started!</p>' : appState.notes.map(renderNoteItem).join('')}
      </div>
      
      <div id="note-editor" style="display: none;"></div>
    </div>
  `;
}

// Render Note Item
function renderNoteItem(note) {
  return `
    <div class="note-item" onclick="editNote('${note.id}')">
      <div class="note-header">
        <div class="note-title">${note.title}</div>
        <div class="note-date">${note.date.toLocaleDateString()}</div>
      </div>
      <div class="note-preview">${note.content.replace(/<[^>]*>/g, '').substring(0, 150)}...</div>
      ${note.category ? `<div class="badge" style="margin-top: 12px;">${note.category}</div>` : ''}
    </div>
  `;
}

// Show Note Editor
function showNoteEditor(noteId = null) {
  const editor = document.getElementById('note-editor');
  const notesList = document.getElementById('notes-list');
  
  const note = noteId ? appState.notes.find(n => n.id === noteId) : null;
  
  notesList.style.display = 'none';
  editor.style.display = 'block';
  editor.innerHTML = `
    <div class="card">
      <div class="card__body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3>${note ? 'Edit Note' : 'Create New Note'}</h3>
          <button class="btn btn--secondary btn--sm" onclick="closeNoteEditor()">✕ Close</button>
        </div>
        
        <div class="form-group">
          <input type="text" class="form-control" id="note-title" placeholder="Note title" value="${note ? note.title : ''}">
        </div>
        
        <div class="form-group">
          <select class="form-control" id="note-category">
            <option value="">Select category</option>
            <option value="History" ${note?.category === 'History' ? 'selected' : ''}>History</option>
            <option value="Geography" ${note?.category === 'Geography' ? 'selected' : ''}>Geography</option>
            <option value="Polity" ${note?.category === 'Polity' ? 'selected' : ''}>Polity</option>
            <option value="Economy" ${note?.category === 'Economy' ? 'selected' : ''}>Economy</option>
            <option value="Environment" ${note?.category === 'Environment' ? 'selected' : ''}>Environment</option>
            <option value="Current Affairs" ${note?.category === 'Current Affairs' ? 'selected' : ''}>Current Affairs</option>
          </select>
        </div>
        
        <div class="editor-toolbar">
          <button class="toolbar-btn" onclick="formatText('bold')" title="Bold"><strong>B</strong></button>
          <button class="toolbar-btn" onclick="formatText('italic')" title="Italic"><em>I</em></button>
          <button class="toolbar-btn" onclick="formatText('underline')" title="Underline"><u>U</u></button>
          <button class="toolbar-btn" onclick="formatText('insertUnorderedList')" title="Bullet List">•</button>
          <button class="toolbar-btn" onclick="formatText('insertOrderedList')" title="Numbered List">1.</button>
        </div>
        <div class="editor-content" contenteditable="true" id="note-content">${note ? note.content : ''}</div>
        
        <div style="display: flex; gap: 12px; margin-top: 16px;">
          <button class="btn btn--primary" onclick="saveNote('${note ? note.id : ''}')">💾 Save Note</button>
          <button class="btn btn--secondary" onclick="summarizeNote()">🤖 AI Summarize</button>
          ${note ? `<button class="btn btn--outline" onclick="deleteNote('${note.id}')" style="margin-left: auto; color: var(--color-error);">🗑️ Delete</button>` : ''}
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('note-content').focus();
}

// Format Text
function formatText(command) {
  document.execCommand(command, false, null);
  document.getElementById('note-content').focus();
}

// Save Note
function saveNote(noteId) {
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').innerHTML;
  const category = document.getElementById('note-category').value;
  
  if (!title || !content) {
    showToast('Please enter both title and content');
    return;
  }
  
  if (noteId) {
    const note = appState.notes.find(n => n.id === noteId);
    note.title = title;
    note.content = content;
    note.category = category;
    note.date = new Date();
  } else {
    appState.notes.unshift({
      id: `note-${Date.now()}`,
      title,
      content,
      category,
      date: new Date()
    });
  }
  
  showToast('Note saved successfully!');
  closeNoteEditor();
  renderNotebook();
}

// Delete Note
function deleteNote(noteId) {
  if (confirm('Are you sure you want to delete this note?')) {
    appState.notes = appState.notes.filter(n => n.id !== noteId);
    showToast('Note deleted');
    closeNoteEditor();
    renderNotebook();
  }
}

// Close Note Editor
function closeNoteEditor() {
  document.getElementById('note-editor').style.display = 'none';
  document.getElementById('notes-list').style.display = 'block';
}

// Edit Note
function editNote(noteId) {
  showNoteEditor(noteId);
}

// Summarize Note
function summarizeNote() {
  const content = document.getElementById('note-content').innerText;
  if (!content.trim()) {
    showToast('Please write some content first');
    return;
  }
  
  // AI Summarization
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const summary = sentences.slice(0, 3).join('. ') + '.';
  
  const summaryText = `\n\n<strong>AI Summary:</strong>\n<div style="background: var(--color-bg-1); padding: 12px; border-radius: 8px; margin-top: 8px;">${summary}</div>`;
  
  document.getElementById('note-content').innerHTML += summaryText;
  showToast('Summary generated!');
}

// Filter Notes
function filterNotes(query) {
  const filtered = appState.notes.filter(note => 
    note.title.toLowerCase().includes(query.toLowerCase()) ||
    note.content.toLowerCase().includes(query.toLowerCase())
  );
  
  document.getElementById('notes-list').innerHTML = filtered.length === 0 
    ? '<p style="text-align: center; color: var(--color-text-secondary); padding: 48px;">No notes found</p>'
    : filtered.map(renderNoteItem).join('');
}

// Render Library
function renderLibrary() {
  const view = document.getElementById('library-view');
  
  view.innerHTML = `
    <div class="container">
      <h2 class="view-title">Digital Library</h2>
      
      <div class="tabs">
        <button class="tab active" onclick="filterLibrary('all')">All Resources</button>
        <button class="tab" onclick="filterLibrary('current-affairs')">Current Affairs</button>
        <button class="tab" onclick="filterLibrary('polity')">Polity &amp; Governance</button>
        <button class="tab" onclick="filterLibrary('history')">History &amp; Culture</button>
        <button class="tab" onclick="filterLibrary('economy')">Economy</button>
        <button class="tab" onclick="filterLibrary('environment')">Environment</button>
        <button class="tab" onclick="filterLibrary('science')">Science &amp; Tech</button>
      </div>
      
      <div class="search-bar">
        <input type="text" class="search-input" placeholder="Search library resources...">
      </div>
      
      <div id="library-resources">
        ${appState.libraryResources.map(renderResourceCard).join('')}
      </div>
    </div>
  `;
}

// Render Resource Card
function renderResourceCard(resource) {
  return `
    <div class="resource-card">
      <div class="resource-header">
        <div style="flex: 1;">
          <div class="resource-title">${resource.title}</div>
          <div class="badge">${resource.category}</div>
        </div>
      </div>
      <div class="resource-description">${resource.description}</div>
      <div class="resource-footer">
        <div class="resource-date">${resource.date}</div>
        <div class="resource-actions">
          <button class="btn btn--sm btn--secondary" onclick="addToNotes('${resource.id}')">📝 Add to Notes</button>
          <button class="btn btn--sm btn--primary">📖 Read</button>
        </div>
      </div>
    </div>
  `;
}

// Filter Library
function filterLibrary(category) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  const filtered = category === 'all' 
    ? appState.libraryResources 
    : appState.libraryResources.filter(r => r.category.toLowerCase().replace(/\s+/g, '-') === category);
  
  document.getElementById('library-resources').innerHTML = filtered.map(renderResourceCard).join('');
}

// Add to Notes
function addToNotes(resourceId) {
  const resource = appState.libraryResources.find(r => r.id === resourceId);
  if (resource) {
    appState.notes.unshift({
      id: `note-${Date.now()}`,
      title: resource.title,
      content: `<p>${resource.description}</p>\n<p><strong>Source:</strong> ${resource.category}</p>`,
      category: resource.category,
      date: new Date()
    });
    showToast('Added to notes!');
  }
}

// Render Test Series
function renderTestSeries() {
  const view = document.getElementById('test-series-view');
  
  view.innerHTML = `
    <div class="container">
      <h2 class="view-title">Test Series</h2>
      
      <div class="tabs">
        <button class="tab active" onclick="filterTests('all')">All Tests</button>
        <button class="tab" onclick="filterTests('pyq')">PYQ</button>
        <button class="tab" onclick="filterTests('prelims')">Prelims Mock</button>
        <button class="tab" onclick="filterTests('mains')">Mains Mock</button>
        <button class="tab" onclick="filterTests('topic')">Topic-wise</button>
        <button class="tab" onclick="filterTests('current')">Current Affairs</button>
      </div>
      
      <div id="test-list">
        ${appState.tests.map(renderTestCard).join('')}
      </div>
    </div>
  `;
}

// Render Test Card
function renderTestCard(test) {
  return `
    <div class="test-card">
      <div class="test-header">
        <div>
          <div class="test-name">${test.name}</div>
          <div class="badge">${test.type}</div>
        </div>
        ${test.completed ? `<div class="badge" style="background: var(--color-bg-3); color: var(--color-success);">Completed: ${test.score}%</div>` : ''}
      </div>
      
      <div class="test-details">
        <div class="test-detail-item">
          <div class="test-detail-label">Questions</div>
          <div class="test-detail-value">${test.questions}</div>
        </div>
        <div class="test-detail-item">
          <div class="test-detail-label">Duration</div>
          <div class="test-detail-value">${test.duration}</div>
        </div>
        <div class="test-detail-item">
          <div class="test-detail-label">Marks</div>
          <div class="test-detail-value">${test.marks}</div>
        </div>
      </div>
      
      <button class="btn btn--primary btn--full-width" onclick="${test.completed ? `reviewTest('${test.id}')` : `startTest('${test.id}')`}">
        ${test.completed ? '📊 Review Test' : '▶️ Start Test'}
      </button>
    </div>
  `;
}

// Filter Tests
function filterTests(type) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  event.target.classList.add('active');
  
  const filtered = type === 'all'
    ? appState.tests
    : appState.tests.filter(t => t.category === type);
  
  document.getElementById('test-list').innerHTML = filtered.map(renderTestCard).join('');
}

// Start Test
function startTest(testId) {
  showToast('Starting test... (Feature demo)');
}

// Review Test
function reviewTest(testId) {
  showToast('Opening test review... (Feature demo)');
}

// Logout
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    appState.user = null;
    document.getElementById('main-app').classList.remove('active');
    document.getElementById('landing-page').classList.add('active');
    showToast('Logged out successfully');
  }
}

// Initialize Sample Data
function initializeSampleData() {
  // Library Resources
  appState.libraryResources = [
    {
      id: 'res-1',
      title: 'Indian Polity: Constitutional Framework',
      category: 'Polity & Governance',
      description: 'Comprehensive coverage of Indian Constitution, fundamental rights, directive principles, and constitutional amendments. Essential reading for GS2 preparation.',
      date: 'Nov 15, 2025'
    },
    {
      id: 'res-2',
      title: 'Economic Survey 2024-25 Key Highlights',
      category: 'Economy',
      description: 'Analysis of major economic trends, sectoral performance, fiscal policy changes, and policy recommendations from the latest Economic Survey.',
      date: 'Nov 10, 2025'
    },
    {
      id: 'res-3',
      title: 'Climate Change and COP29 Outcomes',
      category: 'Environment',
      description: 'Detailed analysis of COP29 summit outcomes, India\'s commitments, global climate action framework, and implications for sustainable development.',
      date: 'Nov 18, 2025'
    },
    {
      id: 'res-4',
      title: 'Ancient Indian History: Indus Valley to Mauryas',
      category: 'History & Culture',
      description: 'Comprehensive study material covering Harappan civilization, Vedic period, Mahajanapadas, and the Mauryan Empire with archaeological evidence.',
      date: 'Nov 5, 2025'
    },
    {
      id: 'res-5',
      title: 'India-US Strategic Partnership: Recent Developments',
      category: 'Current Affairs',
      description: 'Analysis of recent India-US bilateral meetings, defense cooperation, trade agreements, and geopolitical implications in Indo-Pacific region.',
      date: 'Nov 17, 2025'
    },
    {
      id: 'res-6',
      title: 'Artificial Intelligence and Ethics',
      category: 'Science & Technology',
      description: 'Examination of AI applications, ethical considerations, regulatory frameworks, and India\'s AI strategy for governance and development.',
      date: 'Nov 12, 2025'
    }
  ];
  
  // Tests
  appState.tests = [
    {
      id: 'test-1',
      name: 'UPSC Prelims 2023 - GS Paper I',
      type: 'PYQ',
      category: 'pyq',
      questions: 100,
      duration: '2 hours',
      marks: 200,
      completed: true,
      score: 68
    },
    {
      id: 'test-2',
      name: 'Full Length Prelims Mock Test #5',
      type: 'Prelims Mock',
      category: 'prelims',
      questions: 100,
      duration: '2 hours',
      marks: 200,
      completed: true,
      score: 72
    },
    {
      id: 'test-3',
      name: 'Mains GS2 - Governance & Polity',
      type: 'Mains Mock',
      category: 'mains',
      questions: 20,
      duration: '3 hours',
      marks: 250,
      completed: false
    },
    {
      id: 'test-4',
      name: 'Indian Polity - Topic Test',
      type: 'Topic-wise',
      category: 'topic',
      questions: 50,
      duration: '1 hour',
      marks: 100,
      completed: true,
      score: 78
    },
    {
      id: 'test-5',
      name: 'Current Affairs - November 2025',
      type: 'Current Affairs Quiz',
      category: 'current',
      questions: 50,
      duration: '45 mins',
      marks: 100,
      completed: false
    },
    {
      id: 'test-6',
      name: 'UPSC Prelims 2022 - GS Paper I',
      type: 'PYQ',
      category: 'pyq',
      questions: 100,
      duration: '2 hours',
      marks: 200,
      completed: false
    }
  ];
  
  // Sample Notes
  appState.notes = [
    {
      id: 'note-1',
      title: 'Fundamental Rights - Article 12 to 35',
      content: '<p>Fundamental Rights are enshrined in Part III of the Indian Constitution. They guarantee civil liberties and ensure that individuals can live their life in peace.</p><ul><li>Right to Equality (Articles 14-18)</li><li>Right to Freedom (Articles 19-22)</li><li>Right against Exploitation (Articles 23-24)</li><li>Right to Freedom of Religion (Articles 25-28)</li><li>Cultural and Educational Rights (Articles 29-30)</li><li>Right to Constitutional Remedies (Article 32)</li></ul>',
      category: 'Polity',
      date: new Date('2025-11-10')
    },
    {
      id: 'note-2',
      title: 'Green Revolution in India',
      content: '<p>The Green Revolution was a period of increased agricultural productivity in India during the 1960s and 1970s. It involved the use of high-yielding variety seeds, irrigation, fertilizers, and pesticides.</p><p><strong>Key Features:</strong></p><ul><li>Introduction of HYV seeds by Dr. M.S. Swaminathan</li><li>Focus on wheat and rice production</li><li>Major impact in Punjab, Haryana, and Western UP</li><li>Resulted in self-sufficiency in food grains</li></ul>',
      category: 'Economy',
      date: new Date('2025-11-08')
    }
  ];
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initApp);