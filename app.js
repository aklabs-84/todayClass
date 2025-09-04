document.addEventListener('DOMContentLoaded', () => {
  // 사용방법 안내 모달 관련
  const guideButton = document.getElementById('guide-button');
  if (guideButton) {
    guideButton.addEventListener('click', () => {
      const popup = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
      if (popup) {
        popup.document.write(`
          <html>
            <head>
              <title>사용방법</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { font-size: 24px; }
                ol { list-style-type: decimal; margin-left: 20px; }
                li { margin-bottom: 10px; }
              </style>
            </head>
            <body>
              <h1>사용방법</h1>
              <ol>
                <li>홈 화면에서 "기록하기" 버튼을 클릭합니다.</li>
                <li>학교 이름과 반 이름을 입력합니다.</li>
                <li>학생 이름을 입력하고 "추가" 버튼을 눌러 학생을 추가합니다.</li>
                <li>학생 배치를 원형 또는 격자 형태로 정렬할 수 있습니다.</li>
                <li>"삭제 모드"를 활성화하여 학생을 삭제할 수 있습니다.</li>
                <li>"캡처" 버튼을 눌러 현재 보드를 이미지로 저장합니다.</li>
                <li>필터를 사용하여 특정 학교와 날짜의 기록을 조회합니다.</li>
                <li>기록을 선택하여 CSV 파일로 내보낼 수 있습니다.</li>
              </ol>
              <p>* 언제든 상단 '사용방법' 버튼을 눌러 확인할 수 있습니다.</p>
            </body>
          </html>
        `);
        popup.document.close();
      }
    });
  }
  // ===== 홈 화면 토글 =====
  const home = document.getElementById('home-view');
  const nav  = document.getElementById('top-nav');
  const app  = document.getElementById('app');
  const enterBtn = document.getElementById('enter-app-button');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      if (home && nav && app) {
        home.style.display = 'none';
        nav.style.display = '';
        app.style.display = '';
        // 보드 기본 노출 상태 보장
        const boardView  = document.getElementById('board-view');
        const rosterView = document.getElementById('roster-view');
        const boardBtn   = document.getElementById('board-button');
        const rosterBtn  = document.getElementById('roster-button');
        boardView.classList.remove('hidden');
        rosterView.classList.add('hidden');
        boardBtn.classList.add('hidden');
        rosterBtn.classList.remove('hidden');
      }
    });
  }

  // ===== 메인 앱 로직 =====
  // Elements
  const dateInput          = document.getElementById('date-input');
  const schoolNameInput    = document.getElementById('school-name-input');
  const classNameInput     = document.getElementById('class-name-input');
  const studentNameInput   = document.getElementById('student-name-input');
  const addStudentForm     = document.getElementById('add-student-form');

  const captureButton      = document.getElementById('capture-button');
  const deleteModeBtn      = document.getElementById('delete-mode-button');
  const circularBtn        = document.getElementById('circular-layout-button');
  const gridBtn            = document.getElementById('grid-layout-button');
  const copyNamesBtn       = document.getElementById('copy-names-button');
  const rosterBtn          = document.getElementById('roster-button');
  const boardBtn           = document.getElementById('board-button');
  const clearBoardBtn      = document.getElementById('clear-board-button');

  const studentContainer   = document.getElementById('student-container');
  const schoolInfoDisplay  = document.getElementById('school-info');
  const navSchoolInfo      = document.getElementById('nav-school-info');
  const placeholderMessage = document.getElementById('placeholder-message');

  const boardView          = document.getElementById('board-view');
  const rosterView         = document.getElementById('roster-view');
  const rosterTbody        = document.getElementById('roster-tbody');

  const filterSchoolSelect = document.getElementById('filter-school');
  const filterDateSelect   = document.getElementById('filter-date');
  const loadFromFilterBtn  = document.getElementById('load-from-filter-button');
  const deleteSelectedBtn  = document.getElementById('delete-selected-button');
  const exportSelectedBtn  = document.getElementById('export-selected-button');
  const exportCurrentBtn   = document.getElementById('export-current-button');

  // State & constants
  let deleteMode = false;
  let currentDraggingElement = null;
  let offset = { x:0, y:0 };
  const emojis = ['😃','😇','🤩','🥳','😎','😜','🤓','🤠'];
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

  // LocalStorage utils
  const STORAGE_KEY = 'attendanceRecords';
  const loadRecords = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
  const saveRecords = (records) => localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  const addRecord = (rec) => { const r = loadRecords(); r.push(rec); saveRecords(r); };

  const distinct = (arr) => [...new Set(arr)];
  const getSchools = () => distinct(loadRecords().map(r => r.school).filter(Boolean)).sort();
  const getDates = (school = '') => {
    const rows = loadRecords().filter(r => !school || r.school === school);
    return distinct(rows.map(r => r.date).filter(Boolean)).sort().reverse();
  };

  // Helpers
  const todayStr = () => {
    const d = new Date();
    const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,'0'); const dd = String(d.getDate()).padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  };
  dateInput.value = todayStr();

  const getItems = () => [...studentContainer.querySelectorAll('.student-item')];
  const updatePlaceholder = () => placeholderMessage.classList.toggle('hidden', getItems().length !== 0);

  const updateSchoolInfo = () => {
    const s = schoolNameInput.value.trim();
    const c = classNameInput.value.trim();
    const text = (s || c) ? `${s} ${c}`.trim() : '';
    schoolInfoDisplay.textContent = text;
    navSchoolInfo.textContent = text ? `· ${text}` : '';
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(v, max));
  const sanitize = (s) => (s || '').replace(/[\\/:*?"<>|]/g,'').replace(/\s+/g,'').trim();

  const computeCenterPositionByIndex = (idx, w, h) => {
    const cRect = studentContainer.getBoundingClientRect();
    const centerX = cRect.width / 2, centerY = cRect.height / 2;
    const angle = idx * GOLDEN_ANGLE;
    const baseR = 48, stepR = 26;
    const radius = baseR + stepR * Math.sqrt(idx);
    let x = Math.round(centerX + radius * Math.cos(angle) - w/2);
    let y = Math.round(centerY + radius * Math.sin(angle) - h/2);
    x = clamp(x, 0, cRect.width - w);
    y = clamp(y, 0, cRect.height - h);
    return { x, y };
  };
  const computeNextCenterPosition = (w, h) => computeCenterPositionByIndex(getItems().length, w, h);

  const arrangeCircularAll = () => {
    const items = getItems();
    items.forEach((el, i) => {
      const r = el.getBoundingClientRect();
      const { x, y } = computeCenterPositionByIndex(i, r.width, r.height);
      el.style.left = `${x}px`;
      el.style.top  = `${y}px`;
    });
  };

  const arrangeGridAll = () => {
    const items = getItems();
    if (items.length === 0) return;
    const cRect = studentContainer.getBoundingClientRect();

    let maxW = 0, maxH = 0;
    items.forEach(el => { const r = el.getBoundingClientRect(); maxW = Math.max(maxW, r.width); maxH = Math.max(maxH, r.height); });
    const gap = 16; const cellW = Math.ceil(maxW) + gap; const cellH = Math.ceil(maxH) + gap;
    const cols = Math.max(1, Math.floor((cRect.width + gap) / cellW));
    const rows = Math.ceil(items.length / cols);
    const gridW = cols * cellW - gap; const gridH = rows * cellH - gap;
    const startX = Math.max(0, Math.round((cRect.width  - gridW) / 2));
    const startY = Math.max(0, Math.round((cRect.height - gridH) / 2));

    items.forEach((el, i) => {
      const col = i % cols; const row = Math.floor(i / cols);
      const r = el.getBoundingClientRect();
      const x = startX + col * cellW + Math.round((cellW - r.width)/2);
      const y = startY + row * cellH + Math.round((cellH - r.height)/2);
      el.style.left = `${clamp(x, 0, cRect.width  - r.width)}px`;
      el.style.top  = `${clamp(y, 0, cRect.height - r.height)}px`;
    });
  };

  // Student badge
  const makeStudent = (name) => {
  const div = document.createElement('div');
  div.className = 'student-item absolute px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-lg border border-gray-200 flex items-center transition-transform select-none';
  div.style.zIndex = '1'; div.style.left = '0px'; div.style.top = '0px'; div.style.visibility = 'hidden';

  // 데이터 속성 추가: 보드 <-> 출석부 연동을 위해 현재 입력값 사용
  const currentDate = (typeof dateInput !== 'undefined' && dateInput) ? (dateInput.value || todayStr()) : todayStr();
  const currentSchool = (typeof schoolNameInput !== 'undefined' && schoolNameInput) ? schoolNameInput.value.trim() : '';
  const currentClass  = (typeof classNameInput !== 'undefined' && classNameInput) ? classNameInput.value.trim() : '';
  div.dataset.student = name;
  div.dataset.date = currentDate;
  div.dataset.school = currentSchool;
  div.dataset.klass = currentClass; // 'class'는 JS 예약어 혼동을 피하기 위해 'klass' 사용

  const badge = document.createElement('div');
  badge.className = 'delete-badge';
  badge.textContent = '×';
  badge.style.display = 'none'; // 학생 추가 시 x버튼 숨김
  div.appendChild(badge);

    const emojiSpan = document.createElement('span');
emojiSpan.className = 'emoji text-xl sm:text-2xl mr-2';
emojiSpan.textContent = emojis[Math.floor(Math.random() * emojis.length)];
div.appendChild(emojiSpan);

    const nameSpan = document.createElement('span');
nameSpan.className = 'name text-sm sm:text-base font-medium whitespace-nowrap';
nameSpan.textContent = name;
div.appendChild(nameSpan);

    // 이름/이모지 클릭 시 드래그 (삭제모드 아닐 때만)
    [emojiSpan, nameSpan].forEach(span => {
      span.addEventListener('mousedown', (e) => {
        if (deleteMode) return;
        e.preventDefault();
        startDrag(div, e.clientX, e.clientY);
      });
      span.addEventListener('touchstart', (e) => {
        if (deleteMode) return;
        const t = e.touches[0];
        if (!t) return;
        e.preventDefault();
        startDrag(div, t.clientX, t.clientY);
      }, { passive: false });
    });

    // x버튼 클릭 시 localStorage와 화면에서 삭제
    const attemptDelete = (ev) => {
      if (!deleteMode) return false;
      ev.stopPropagation();

      const currentName   = nameSpan.textContent.trim();
      const currentDate   = dateInput.value || todayStr();
      const currentSchool = schoolNameInput.value.trim();
      const currentClass  = classNameInput.value.trim();

      const before = loadRecords();
      const after  = before.filter(r =>
        !(r.date === currentDate && r.school === currentSchool && r.class === currentClass && r.student === currentName)
      );
      if (after.length !== before.length) {
        saveRecords(after);
        if (!rosterView.classList.contains('hidden')) {
          populateFilters();
          renderRosterTable();
        }
      }

      div.remove();
      updatePlaceholder();
      return true;
    };

    badge.addEventListener('click', attemptDelete, { passive: false });
    badge.addEventListener('touchend', attemptDelete, { passive: false });

    div.addEventListener('mousedown', (e) => { if (deleteMode) return; e.preventDefault(); startDrag(div, e.clientX, e.clientY); });
    div.addEventListener('touchstart', (e) => { if (deleteMode) return; const t = e.touches[0]; if (!t) return; e.preventDefault(); startDrag(div, t.clientX, t.clientY); }, { passive: false });

    studentContainer.appendChild(div);

    const r = div.getBoundingClientRect(); const { x, y } = computeNextCenterPosition(r.width, r.height);
    div.style.left = `${x}px`; div.style.top = `${y}px`; div.style.visibility = 'visible';
    updatePlaceholder();
  };

  // Drag
  const startDrag = (el, clientX, clientY) => {
    currentDraggingElement = el;
    const rect = el.getBoundingClientRect();
    offset.x = clientX - rect.left;
    offset.y = clientY - rect.top;
    el.style.zIndex = '10';
    el.style.cursor = 'grabbing';
  };
  const moveDragTo = (clientX, clientY) => {
    if (!currentDraggingElement) return;
    const cont = studentContainer.getBoundingClientRect();
    const w = currentDraggingElement.offsetWidth;
    const h = currentDraggingElement.offsetHeight;
    let newX = clientX - cont.left - offset.x;
    let newY = clientY - cont.top  - offset.y;
    newX = clamp(newX, 0, cont.width  - w);
    newY = clamp(newY, 0, cont.height - h);
    currentDraggingElement.style.left = `${newX}px`;
    currentDraggingElement.style.top  = `${newY}px`;
  };
  const endDrag = () => {
    if (!currentDraggingElement) return;
    currentDraggingElement.style.zIndex = '1';
    currentDraggingElement.style.cursor = deleteMode ? 'pointer' : 'grab';
    currentDraggingElement = null;
  };
  document.addEventListener('mousemove', (e) => moveDragTo(e.clientX, e.clientY));
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (!t) return;
    if (currentDraggingElement) e.preventDefault();
    moveDragTo(t.clientX, t.clientY);
  }, { passive: false });
  document.addEventListener('touchend', endDrag, { passive: false });
  document.addEventListener('touchcancel', endDrag, { passive: false });

  // Add Student + Save (여기서 404 방지: preventDefault!)
  const addStudent = () => {
    const name = studentNameInput.value.trim();
    const school = schoolNameInput.value.trim();
    const klass  = classNameInput.value.trim();
    const date   = dateInput.value || todayStr();
    if (!name) return;
    if (!school || !klass) { alert('학교와 반을 먼저 입력해 주세요.'); return; }

    makeStudent(name);
    studentNameInput.value = '';

    addRecord({ date, school, class: klass, student: name, createdAt: new Date().toISOString() });
    if (!rosterView.classList.contains('hidden')) { populateFilters(); renderRosterTable(); }
  };
  addStudentForm.addEventListener('submit', (e) => { e.preventDefault(); addStudent(); });

  // Clipboard
  const getAllNames = () => [...studentContainer.querySelectorAll('.student-item span:last-of-type')]
    .map(s => s.textContent.trim()).filter(Boolean);
  const copyAllNames = async () => {
    const names = getAllNames();
    if (names.length === 0) { alert('복사할 이름이 없어요.'); return; }
    const text = names.join('\n');
    try { await navigator.clipboard.writeText(text); alert(`이름 ${names.length}명 복사 완료!`); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      alert(`이름 ${names.length}명 복사 완료!`);
    }
  };
  copyNamesBtn.addEventListener('click', copyAllNames);

  // Capture (파일명: 현재 보드 날짜)
  const captureAndDownload = () => {
  const el = studentContainer;
  const school = sanitize(schoolNameInput.value) || '학교';
  const klass  = sanitize(classNameInput.value)  || '반';
  const dateStr = (dateInput.value || todayStr());
  const filename = `${school}_${klass}_${dateStr}.png`;

  html2canvas(el, {
    backgroundColor: '#ffffff',                     // 항상 흰 배경
    scale: Math.max(2, window.devicePixelRatio || 1),
    useCORS: true,
    foreignObjectRendering: false,
    removeContainer: true,
    logging: false,
    width: el.scrollWidth,
    height: el.scrollHeight,
    onclone: (doc) => {
      const cloneEl = doc.getElementById('student-container');
      if (cloneEl) {
        cloneEl.style.transform = 'none';
        cloneEl.style.backfaceVisibility = 'visible';
        cloneEl.classList.add('capture-safe');      // 캡처 전용 스타일 적용
      }
    }
  }).then((canvas) => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

  captureButton.addEventListener('click', captureAndDownload);

  // Delete mode toggle
  deleteModeBtn.addEventListener('click', () => {
    deleteMode = !deleteMode;
    studentContainer.classList.toggle('delete-mode', deleteMode);
    deleteModeBtn.textContent = `삭제 모드: ${deleteMode ? 'ON' : 'OFF'}`;
    // 삭제모드일 때만 x버튼 보이게
    getItems().forEach(item => {
      const badge = item.querySelector('.delete-badge');
      if (badge) badge.style.display = deleteMode ? 'block' : 'none';
    });
  });

  // Layout buttons
  circularBtn.addEventListener('click', arrangeCircularAll);
  gridBtn.addEventListener('click', arrangeGridAll);

  schoolNameInput.addEventListener('input', updateSchoolInfo);
  classNameInput.addEventListener('input', updateSchoolInfo);

  const clearBoard = () => { getItems().forEach(el => el.remove()); updatePlaceholder(); };
  clearBoardBtn.addEventListener('click', clearBoard);

  // Roster view (filters + table + selection delete)
  let selectedKeys = new Set(); // for checkbox selection
  const makeKey = (r) => [r.date, r.school, r.class, r.student, r.createdAt].map(v => encodeURIComponent(v||'')).join('|');

  const populateFilters = () => {
    const keepSchool = filterSchoolSelect.value;
    filterSchoolSelect.innerHTML = '<option value="">전체</option>' + getSchools().map(s=>`<option value="${s}">${s}</option>`).join('');
    if ([...filterSchoolSelect.options].some(o=>o.value===keepSchool)) filterSchoolSelect.value=keepSchool;

    const keepDate = filterDateSelect.value;
    const dates = getDates(filterSchoolSelect.value);
    filterDateSelect.innerHTML = '<option value="">전체</option>' + dates.map(d=>`<option value="${d}">${d}</option>`).join('');
    if ([...filterDateSelect.options].some(o=>o.value===keepDate)) filterDateSelect.value=keepDate;
  };

  const getSelectAll = () => document.getElementById('select-all');
  const updateSelectAllState = () => {
    const selectAll = getSelectAll();
    if (!selectAll) return;
    const visibleKeys = Array.from(rosterTbody.querySelectorAll('input.row-check')).map(cb=>cb.dataset.key);
    const checkedCount = visibleKeys.filter(k => selectedKeys.has(k)).length;
    if (visibleKeys.length === 0){ selectAll.indeterminate = false; selectAll.checked = false; return; }
    if (checkedCount === 0){ selectAll.indeterminate = false; selectAll.checked = false; }
    else if (checkedCount === visibleKeys.length){ selectAll.indeterminate = false; selectAll.checked = true; }
    else { selectAll.indeterminate = true; selectAll.checked = false; }
  };

  const renderRosterTable = () => {
    const fSchool = filterSchoolSelect.value; // '' = 전체
    const fDate = filterDateSelect.value;     // '' = 전체
    let rows = loadRecords();
    if (fSchool) rows = rows.filter(r => r.school === fSchool);
    if (fDate) rows = rows.filter(r => r.date === fDate);
    rows = rows.slice().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    rosterTbody.innerHTML = '';
    if (rows.length === 0){
      const tr = document.createElement('tr'); const td = document.createElement('td');
      td.colSpan = 6; td.className = 'px-4 py-6 text-center text-gray-400'; td.textContent = '필터 조건에 해당하는 출석부 기록이 없습니다.';
      tr.appendChild(td); rosterTbody.appendChild(tr); updateSelectAllState(); return;
    }

    rows.forEach((r) => {
      const key = makeKey(r);
      const tr = document.createElement('tr'); tr.className = 'hover:bg-amber-50';
      tr.innerHTML = `
        <td class="px-3 sm:px-4 py-2"><input type="checkbox" class="row-check w-4 h-4" data-key="${key}" ${selectedKeys.has(key)?'checked':''}></td>
        <td class="px-3 sm:px-4 py-2">${r.date}</td>
        <td class="px-3 sm:px-4 py-2">${r.school}</td>
        <td class="px-3 sm:px-4 py-2">${r.class}</td>
        <td class="px-3 sm:px-4 py-2">${r.student}</td>
        <td class="px-3 sm:px-4 py-2 text-gray-500">${new Date(r.createdAt).toLocaleString()}</td>`;
      rosterTbody.appendChild(tr);
    });

    rosterTbody.querySelectorAll('.row-check').forEach(cb => {
      cb.addEventListener('change', (e)=>{
        const k = e.currentTarget.dataset.key;
        if (e.currentTarget.checked) selectedKeys.add(k); else selectedKeys.delete(k);
        updateSelectAllState();
      });
    });

    const selectAll = getSelectAll();
    if (selectAll){
      selectAll.onchange = (e) => {
        const check = e.currentTarget.checked;
        rosterTbody.querySelectorAll('.row-check').forEach(cb => {
          cb.checked = check; const k = cb.dataset.key; if (check) selectedKeys.add(k); else selectedKeys.delete(k);
        });
        updateSelectAllState();
      };
    }

    updateSelectAllState();
  };

  deleteSelectedBtn.addEventListener('click', () => {
    if (selectedKeys.size === 0){ alert('삭제할 행을 먼저 선택해 주세요.'); return; }
    if (!confirm(`선택한 ${selectedKeys.size}개 기록을 삭제할까요?`)) return;

    // 현재 저장된 레코드와 삭제 대상 계산
    const before = loadRecords();
    const deleted = before.filter(r => selectedKeys.has(makeKey(r)));
    const kept = before.filter(r => !selectedKeys.has(makeKey(r)));

    // 저장소에 반영
    saveRecords(kept);

    // 보드 상에서도 동일한 레코드(날짜/학교/반/학생)가 있으면 제거
    if (deleted.length > 0) {
      deleted.forEach(r => {
        const els = [...studentContainer.querySelectorAll('.student-item')];
        els.forEach(el => {
          if (el.dataset.student === r.student && el.dataset.date === r.date && el.dataset.school === r.school && el.dataset.klass === r.class) {
            el.remove();
          }
        });
      });
      updatePlaceholder();
    }

    selectedKeys = new Set();
    populateFilters();
    renderRosterTable();
  });

  // CSV Export
  const escapeCSV = (val) => {
    const s = String(val ?? '');
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return `"${s.replace(/"/g,'""')}"`;
    }
    return s;
  };
  const downloadCSV = (rows, filenameBase) => {
    if (!rows || rows.length === 0) { alert('내보낼 데이터가 없습니다.'); return; }
    const header = ['날짜','학교','반','학생 이름','생성시간'];
    const lines = [header.join(',')];
    rows.forEach(r => {
      lines.push([
        escapeCSV(r.date),
        escapeCSV(r.school),
        escapeCSV(r.class),
        escapeCSV(r.student),
        escapeCSV(new Date(r.createdAt).toLocaleString())
      ].join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const ts = new Date();
    const tsStr = `${ts.getFullYear()}${String(ts.getMonth()+1).padStart(2,'0')}${String(ts.getDate()).padStart(2,'0')}_${String(ts.getHours()).padStart(2,'0')}${String(ts.getMinutes()).padStart(2,'0')}${String(ts.getSeconds()).padStart(2,'0')}`;
    a.href = url;
    a.download = `${filenameBase}_${tsStr}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentFilteredRows = () => {
    const fSchool = filterSchoolSelect.value; // '' = 전체
    const fDate = filterDateSelect.value;     // '' = 전체
    let rows = loadRecords();
    if (fSchool) rows = rows.filter(r => r.school === fSchool);
    if (fDate) rows = rows.filter(r => r.date === fDate);
    return rows.slice().sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
  };

  exportSelectedBtn.addEventListener('click', () => {
    if (selectedKeys.size === 0) { alert('먼저 내보낼 행(체크박스)을 선택해 주세요.'); return; }
    const selectedRows = loadRecords().filter(r => selectedKeys.has(makeKey(r)));
    downloadCSV(selectedRows, 'attendance_selected');
  });

  exportCurrentBtn.addEventListener('click', () => {
    const rows = currentFilteredRows();
    const sch = filterSchoolSelect.value || 'all-schools';
    const d   = filterDateSelect.value   || 'all-dates';
    downloadCSV(rows, `attendance_${sch}_${d}`);
  });

  // Load to board
  const showBoardView  = () => { rosterView.classList.add('hidden'); boardView.classList.remove('hidden'); boardBtn.classList.add('hidden'); rosterBtn.classList.remove('hidden'); };
  const showRosterView = () => { boardView.classList.add('hidden'); rosterView.classList.remove('hidden'); rosterBtn.classList.add('hidden'); boardBtn.classList.remove('hidden'); populateFilters(); renderRosterTable(); };

  const clearBoardAndLoad = (date, school, klass) => {
    dateInput.value = date; schoolNameInput.value = school; classNameInput.value = klass; updateSchoolInfo();
    showBoardView(); clearBoard();
    const rows = loadRecords().filter(r => r.date === date && r.school === school && r.class === klass);
    if (rows.length === 0) { alert('해당 조건의 기록이 없습니다.'); return; }
    rows.forEach(r => makeStudent(r.student)); arrangeGridAll();
  };

  loadFromFilterBtn.addEventListener('click', () => {
    const school = filterSchoolSelect.value; const date = filterDateSelect.value;
    if (!school || !date) { alert('학교와 날짜를 모두 선택해 주세요.'); return; }
    const rows = loadRecords().filter(r => r.school === school && r.date === date);
    if (rows.length === 0) { alert('해당 조건의 기록이 없습니다.'); return; }
    const klass = rows[0].class;
    clearBoardAndLoad(date, school, klass);
  });

  // View toggles
  rosterBtn.addEventListener('click', showRosterView);
  boardBtn.addEventListener('click', showBoardView);

  // 메뉴 버튼 active 스타일 토글
  function updateMenuActive() {
    [rosterBtn, boardBtn, circularBtn, gridBtn, copyNamesBtn, captureButton, deleteModeBtn].forEach(btn => {
      btn.classList.remove('active-menu');
    });
    if (!boardView.classList.contains('hidden')) {
      boardBtn.classList.add('active-menu');
    }
    if (!rosterView.classList.contains('hidden')) {
      rosterBtn.classList.add('active-menu');
    }
  }
  rosterBtn.addEventListener('click', updateMenuActive);
  boardBtn.addEventListener('click', updateMenuActive);
  circularBtn.addEventListener('click', () => {
    updateMenuActive();
    circularBtn.classList.add('active-menu');
  });
  gridBtn.addEventListener('click', () => {
    updateMenuActive();
    gridBtn.classList.add('active-menu');
  });
  copyNamesBtn.addEventListener('click', () => {
    updateMenuActive();
    copyNamesBtn.classList.add('active-menu');
  });
  captureButton.addEventListener('click', () => {
    updateMenuActive();
    captureButton.classList.add('active-menu');
  });
  deleteModeBtn.addEventListener('click', () => {
    updateMenuActive();
    deleteModeBtn.classList.add('active-menu');
  });
  // 최초 상태 반영
  updateMenuActive();

  // 드롭다운 변경 시 즉시 테이블 갱신
  filterSchoolSelect.addEventListener('change', () => { populateFilters(); renderRosterTable(); });
  filterDateSelect.addEventListener('change', () => { renderRosterTable(); });

  // Init
  deleteMode = false; studentContainer.classList.remove('delete-mode'); updateSchoolInfo();
  (function initPlaceholder(){ const has = getItems().length !== 0; placeholderMessage.classList.toggle('hidden', has); })();
});
