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
                body { 
                  font-family: 'Inter', 'Malgun Gothic', sans-serif; 
                  margin: 40px; 
                  line-height: 1.8;
                  color: #333;
                }
                h1 { 
                  font-size: 28px; 
                  color: #d97706;
                  margin-bottom: 30px;
                  border-bottom: 3px solid #fbbf24;
                  padding-bottom: 10px;
                }
                h2 {
                  font-size: 20px;
                  color: #0ea5e9;
                  margin-top: 30px;
                  margin-bottom: 15px;
                }
                ol { 
                  list-style-type: decimal; 
                  margin-left: 20px; 
                }
                li { 
                  margin-bottom: 12px; 
                  font-size: 15px;
                }
                .tip {
                  background: #fef3c7;
                  border-left: 4px solid #f59e0b;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .tip strong {
                  color: #d97706;
                }
                .important {
                  background: #dbeafe;
                  border-left: 4px solid #3b82f6;
                  padding: 15px;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .important strong {
                  color: #1e40af;
                }
              </style>
            </head>
            <body>
              <h1>📒 오늘의 수업 기록 - 사용방법</h1>
              
              <h2>📝 기본 설정</h2>
              <ol>
                <li><strong>학교, 반, 날짜 입력:</strong> 왼쪽 상단 "기본 정보" 섹션에서 학교명, 반 이름, 날짜를 입력하세요.</li>
                <li><strong>날짜 자동 설정:</strong> 날짜는 오늘 날짜로 자동 설정되지만 변경 가능합니다.</li>
              </ol>

              <h2>👥 학생 관리</h2>
              <ol>
                <li><strong>학생 추가:</strong> "학생 추가" 섹션에서 학생 이름을 입력하고 "추가" 버튼을 클릭하세요.</li>
                <li><strong>자동 배치:</strong> 추가된 학생은 오른쪽 보드 화면에 랜덤한 위치에 자동 배치됩니다.</li>
                <li><strong>원형 정렬:</strong> "원형 정렬" 버튼을 눌러 학생들을 원형으로 정렬할 수 있습니다.</li>
                <li><strong>격자 정렬:</strong> "격자 정렬" 버튼을 눌러 학생들을 격자 형태로 정렬할 수 있습니다.</li>
              </ol>

              <h2>🗑️ 학생 삭제</h2>
              <ol>
                <li><strong>삭제 모드 활성화:</strong> "삭제 모드: OFF" 버튼을 클릭하여 ON으로 변경하세요.</li>
                <li><strong>학생 삭제:</strong> 삭제 모드가 활성화되면 각 학생 아이콘 우상단에 빨간 X 버튼이 나타납니다.</li>
                <li><strong>X 버튼 클릭:</strong> 삭제하고 싶은 학생의 X 버튼을 클릭하여 제거하세요.</li>
                <li><strong>삭제 모드 종료:</strong> 작업 완료 후 다시 버튼을 눌러 삭제 모드를 OFF로 변경하세요.</li>
              </ol>

              <h2>📸 화면 캡처</h2>
              <ol>
                <li><strong>캡처 저장:</strong> "캡처 저장" 버튼을 클릭하면 현재 보드 화면이 PNG 이미지로 저장됩니다.</li>
                <li><strong>파일명:</strong> 이미지는 "학교명_반명_날짜.png" 형식으로 자동 저장됩니다.</li>
              </ol>

              <h2>📋 출석부 관리</h2>
              <ol>
                <li><strong>출석부 보기:</strong> "출석부 보기" 버튼을 클릭하여 기록된 모든 학생 정보를 확인하세요.</li>
                <li><strong>필터 선택:</strong> "출석부 조회" 섹션에서 학교와 날짜 드롭다운을 원하는 값으로 선택하세요.</li>
                <li><strong>필터 적용:</strong> 학교와 날짜를 선택한 후 <strong>"출석부 보기"</strong> 버튼을 다시 클릭해야 필터링된 결과가 표시됩니다.</li>
                <li><strong>기록 삭제:</strong> 삭제하고 싶은 기록의 체크박스를 선택하고 "선택 삭제" 버튼을 클릭하세요.</li>
                <li><strong>전체 선택:</strong> 테이블 헤더의 체크박스를 클릭하면 현재 표시된 모든 항목을 선택/해제할 수 있습니다.</li>
                <li><strong>보드 보기:</strong> "보드 보기" 버튼을 클릭하여 다시 학생 배치 화면으로 돌아갈 수 있습니다.</li>
              </ol>

              <div class="important">
                <strong>📌 중요:</strong> 출석부 필터링을 적용하려면 학교와 날짜를 선택한 후 반드시 "출석부 보기" 버튼을 다시 클릭해야 합니다!
              </div>

              <h2>💾 CSV 파일로 저장</h2>
              <ol>
                <li><strong>필터 선택:</strong> "출석부 조회" 섹션에서 내보내고 싶은 학교와 날짜를 드롭다운에서 선택하세요.</li>
                <li><strong>필터 확인:</strong> "출석부 보기" 버튼을 클릭하여 내보낼 데이터를 확인하세요.</li>
                <li><strong>CSV 내보내기:</strong> "CSV 내보내기" 버튼을 클릭하면 선택된 필터에 맞는 데이터만 저장됩니다.</li>
                <li><strong>파일명 형식:</strong> 
                  <ul style="margin-top: 8px;">
                    <li>학교 + 날짜 선택: "학교명_반명_날짜.csv"</li>
                    <li>학교만 선택: "학교명_반명.csv"</li>
                    <li>날짜만 선택: "attendance_날짜.csv"</li>
                    <li>필터 없음: "attendance.csv"</li>
                  </ul>
                </li>
              </ol>

              <div class="important">
                <strong>📌 중요:</strong> CSV 파일명은 드롭다운에서 선택한 학교와 날짜를 기반으로 자동 생성됩니다. 원하는 학교와 날짜를 선택한 후 "CSV 내보내기" 버튼을 클릭하세요!
              </div>

              <h2>📱 추가 기능</h2>
              <ol>
                <li><strong>이름 복사:</strong> "이름 복사" 버튼을 클릭하면 현재 보드의 모든 학생 이름이 클립보드에 복사됩니다.</li>
                <li><strong>자동 저장:</strong> 추가된 모든 학생 정보는 브라우저에 자동으로 저장되어 다음 방문 시에도 확인할 수 있습니다.</li>
              </ol>

              <div class="tip">
                <strong>💡 팁:</strong> 학생을 추가한 후 원형 정렬 또는 격자 정렬을 사용하면 더 깔끔하게 정리할 수 있어요!
              </div>
            </body>
          </html>
        `);
        popup.document.close();
      }
    });
  }

  // 엘리먼트 참조
  const schoolNameInput   = document.getElementById('school-name');
  const classNameInput    = document.getElementById('class-name');
  const dateInput         = document.getElementById('board-date');
  const studentNameInput  = document.getElementById('student-name');

  const addStudentForm    = document.getElementById('add-student-form');
  const studentContainer  = document.getElementById('student-container');
  const schoolInfo        = document.getElementById('school-info');
  const placeholder       = document.getElementById('placeholder-message');

  const circularBtn       = document.getElementById('circular-btn');
  const gridBtn           = document.getElementById('grid-btn');
  const copyNamesBtn      = document.getElementById('copy-names-btn');
  const captureButton     = document.getElementById('capture-button');
  const deleteModeBtn     = document.getElementById('delete-mode-btn');

  const rosterBtn         = document.getElementById('roster-btn');
  const boardBtn          = document.getElementById('board-btn');
  const rosterView        = document.getElementById('roster-view');
  const boardView         = document.getElementById('board-view');

  const filterSchoolSelect = document.getElementById('filter-school');
  const filterDateSelect   = document.getElementById('filter-date');
  const exportCsvBtn       = document.getElementById('export-csv');
  const rosterTbody        = document.getElementById('roster-tbody');
  const selectAllCheckbox  = document.getElementById('select-all');
  const deleteSelectedBtn  = document.getElementById('delete-selected-btn');

  let deleteMode = false;

  // 유틸
  const sanitize = (s='') => (s||'').toString().trim().replace(/[\\/:*?"<>|]/g, '_');
  const todayStr = () => new Date().toISOString().slice(0,10);

  // 초기 날짜
  if (dateInput && !dateInput.value) dateInput.value = todayStr();

  // 학교/반 표시
  const updateSchoolInfo = () => {
    const s = (schoolNameInput.value || '').trim();
    const c = (classNameInput.value  || '').trim();
    schoolInfo.textContent = [s, c].filter(Boolean).join(' ');
  };
  [schoolNameInput, classNameInput].forEach(inp => {
    if (inp) inp.addEventListener('input', updateSchoolInfo);
  });
  updateSchoolInfo();

  // 보조 유틸 함수들을 먼저 정의
  const getItems = () => [...studentContainer.querySelectorAll('.student-item')];

  // Placeholder 표시 제어
  const togglePlaceholder = () => {
    const hasStudent = studentContainer.querySelector('.student-item');
    placeholder.style.display = hasStudent ? 'none' : 'flex';
  };

  // 학생 아이템 DOM
  const emojis = ['😀','😄','😊','🦊','🐻','🐼','🦁','🐯','🐶','🐱','🐵','🐸','🐨','🐰','🐹','🦄','🐷','🐮'];
  const createStudentItem = (name) => {
    const div = document.createElement('div');
    div.className = 'student-item select-none shadow ring-1 ring-gray-200 text-gray-800';
    div.style.position = 'absolute';

    // 랜덤 위치 생성 (컨테이너 영역 내에서)
    const containerRect = studentContainer.getBoundingClientRect();
    const margin = 80; // 가장자리 여백
    const randomX = margin + Math.random() * (containerRect.width - margin * 2);
    const randomY = margin + Math.random() * (containerRect.height - margin * 2);

    div.style.left = `${randomX}px`;
    div.style.top = `${randomY}px`;
    div.style.transform = 'translate(-50%, -50%)';
    div.style.minWidth = '110px';

    const del = document.createElement('div');
    del.className = 'delete-badge'; 
    del.textContent = '×';
    del.title = '삭제';
    del.style.display = deleteMode ? 'flex' : 'none'; // 현재 삭제 모드 상태 반영
    div.appendChild(del);

    const emojiSpan = document.createElement('span');
    emojiSpan.className = 'emoji mr-2';
    emojiSpan.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    div.appendChild(emojiSpan);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = name;
    div.appendChild(nameSpan);

    // 삭제 버튼 클릭 이벤트
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!deleteMode) return;
      div.remove();
      togglePlaceholder();
    });

    return div;
  };

  // Delete mode toggle - 한 번만 등록!
  deleteModeBtn.addEventListener('click', () => {
    deleteMode = !deleteMode;
    studentContainer.classList.toggle('delete-mode', deleteMode);
    deleteModeBtn.textContent = `삭제 모드: ${deleteMode ? 'ON' : 'OFF'}`;
    deleteModeBtn.classList.toggle('bg-rose-500', deleteMode);
    deleteModeBtn.classList.toggle('text-white', deleteMode);
    deleteModeBtn.classList.toggle('bg-rose-100', !deleteMode);
    deleteModeBtn.classList.toggle('text-rose-700', !deleteMode);

    // 삭제모드일 때만 x버튼 보이게
    getItems().forEach(item => {
      const badge = item.querySelector('.delete-badge');
      if (badge) badge.style.display = deleteMode ? 'flex' : 'none';
    });
  });

  // 학생 추가
  const addStudent = () => {
    const name = (studentNameInput.value || '').trim();
    if (!name) return;
    const item = createStudentItem(name);
    studentContainer.appendChild(item);
    togglePlaceholder();
    studentNameInput.value = '';

    addRecord({ date: dateInput.value || todayStr(), school: schoolNameInput.value, class: classNameInput.value, student: name, createdAt: new Date().toISOString() });
    if (!rosterView.classList.contains('hidden')) { populateFilters(); rosterTbodyRender(); }
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
    catch { alert('복사에 실패했어요. 브라우저 권한을 확인해주세요.'); }
  };
  copyNamesBtn.addEventListener('click', copyAllNames);

  // Capture (학교/반 + 학생영역을 함께 캡처)
  const captureAndDownload = async () => {
    // 1) 웹폰트 로딩 보장
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch (e) {}
    }

    // 2) 캡처 대상: capture-area 우선, 없으면 student-container
    const el = document.getElementById('capture-area') || studentContainer;
    const school = sanitize(schoolNameInput.value) || '학교';
    const klass  = sanitize(classNameInput.value)  || '반';
    const dateStr = (dateInput.value || todayStr());
    const filename = `${school}_${klass}_${dateStr}.png`;

    html2canvas(el, {
      backgroundColor: '#ffffff',
      scale: Math.max(2, window.devicePixelRatio || 1),
      useCORS: true,
      foreignObjectRendering: false,
      removeContainer: true,
      logging: false,
      width: el.scrollWidth,
      height: el.scrollHeight,
      onclone: (doc) => {
        // 캡처 전용 스타일
        doc.body.classList.add('capture-safe');

        // 안내 문구 텍스트 제거(혹시 남아있다면)
        const sc = doc.getElementById('student-container');
        if (sc) {
          sc.querySelectorAll('*').forEach(node => {
            if (node.childNodes?.length === 1 && node.textContent?.trim() === '학생 아이콘이 여기에 나타납니다.') {
              node.remove();
            }
          });
        }

        // 중앙정렬 보정(우선순위 충돌 대비 인라인 강제)
        doc.querySelectorAll('.student-item').forEach(badge => {
          Object.assign(badge.style, {
            display:'inline-flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'8px',
            height:'48px',
            padding:'8px 14px',
            background:'#ffffff',
            borderRadius:'9999px',
            boxShadow:'0 4px 14px rgba(0,0,0,.12)'
          });
        });
        doc.querySelectorAll('.student-item .emoji, .student-item .name').forEach(n => {
          Object.assign(n.style, {
            display:'inline-flex',
            alignItems:'center',
            justifyContent:'center',
            lineHeight:'1'
          });
        });

        // transform 영향 제거
        const root = doc.getElementById('capture-area') || doc.getElementById('student-container');
        if (root) { root.style.transform = 'none'; root.style.backfaceVisibility = 'visible'; }
      }
    }).then((canvas) => {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }).catch(console.error);
  };
  captureButton.addEventListener('click', captureAndDownload);

  // 정렬 함수들을 먼저 정의
  const arrangeCircularAll = () => {
    const items = getItems();
    const rect = studentContainer.getBoundingClientRect();
    const cx = rect.width/2, cy = rect.height/2, r = Math.min(cx, cy) - 60;
    items.forEach((el, i) => {
      const t = (i / Math.max(1, items.length)) * Math.PI * 2;
      const x = cx + r * Math.cos(t), y = cy + r * Math.sin(t);
      el.style.left = `${x}px`; el.style.top = `${y}px`;
      el.style.transform = `translate(-50%, -50%)`;
    });
  };

  const arrangeGridAll = () => {
    const items = getItems();
    const cols = Math.max(2, Math.ceil(Math.sqrt(items.length)));
    const gap = 16;
    const w = 140, h = 56;
    const rect = studentContainer.getBoundingClientRect();
    const startX = (rect.width - (cols*w + (cols-1)*gap)) / 2;
    let x = startX, y = 80, col = 0;

    items.forEach((el, i) => {
      el.style.left = `${x + w/2}px`;
      el.style.top  = `${y + h/2}px`;
      el.style.transform = `translate(-50%, -50%)`;
      col++;
      if (col >= cols) { col = 0; x = startX; y += (h + gap); }
      else { x += (w + gap); }
    });
  };

  // Layout buttons
  circularBtn.addEventListener('click', arrangeCircularAll);
  gridBtn.addEventListener('click', arrangeGridAll);

  // 출석부·CSV 관련
  const recordsKey = 'attendance-records:v1';
  const readRecords = () => JSON.parse(localStorage.getItem(recordsKey) || '[]');
  const writeRecords = (arr) => localStorage.setItem(recordsKey, JSON.stringify(arr));

  const addRecord = (r) => {
    const arr = readRecords();
    arr.push(r); writeRecords(arr);
  };

  const getSchools = () => [...new Set(readRecords().map(r => r.school).filter(Boolean))].sort();
  const getDates   = (school) => {
    const arr = readRecords().filter(r => !school || r.school === school);
    return [...new Set(arr.map(r => r.date))].sort();
  };

  const populateFilters = () => {
    const keepSchool = filterSchoolSelect.value;
    filterSchoolSelect.innerHTML = '<option value="">전체</option>' + getSchools().map(s=>`<option value="${s}">${s}</option>`).join('');
    if ([...filterSchoolSelect.options].some(o=>o.value===keepSchool)) filterSchoolSelect.value=keepSchool;

    const keepDate = filterDateSelect.value;
    const dates = getDates(filterSchoolSelect.value);
    filterDateSelect.innerHTML = '<option value="">전체</option>' + dates.map(d=>`<option value="${d}">${d}</option>`).join('');
    if ([...filterDateSelect.options].some(o=>o.value===keepDate)) filterDateSelect.value=keepDate;
  };

  const rosterTbodyRender = () => {
    const school = filterSchoolSelect.value;
    const date   = filterDateSelect.value;
    const arr = readRecords().filter(r => (!school || r.school===school) && (!date || r.date===date));
    rosterTbody.innerHTML = '';
    arr.forEach((r, idx) => {
      const tr = document.createElement('tr'); 
      tr.className = 'hover:bg-amber-50';
      tr.dataset.recordIndex = idx; // 전역 인덱스 저장
      tr.innerHTML = `
        <td class="px-3 sm:px-4 py-2">
          <input type="checkbox" class="record-checkbox rounded border-gray-300 text-amber-600 focus:ring-amber-500" data-record='${JSON.stringify(r)}'/>
        </td>
        <td class="px-3 sm:px-4 py-2">${r.date}</td>
        <td class="px-3 sm:px-4 py-2">${r.school}</td>
        <td class="px-3 sm:px-4 py-2">${r.class}</td>
        <td class="px-3 sm:px-4 py-2">${r.student}</td>
        <td class="px-3 sm:px-4 py-2 text-gray-500">${new Date(r.createdAt).toLocaleString()}</td>`;
      rosterTbody.appendChild(tr);
    });
  };

  exportCsvBtn.addEventListener('click', () => {
    const rows = [['날짜','학교','반','학생','생성시간']];
    const allRecords = readRecords();
    const school = filterSchoolSelect.value;
    const date = filterDateSelect.value;
    
    // 필터링된 데이터 가져오기
    const filteredRecords = allRecords.filter(r => (!school || r.school===school) && (!date || r.date===date));
    
    if (filteredRecords.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }
    
    filteredRecords.forEach(r => rows.push([r.date, r.school, r.class, r.student, new Date(r.createdAt).toLocaleString()]));
    
    const csv = rows.map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    
    // 파일명 생성: 학교이름_반_날짜.csv
    let filename = 'attendance';
    if (school) {
      filename = sanitize(school);
      // 반 정보 추가 (필터링된 데이터에서 가장 많이 나온 반 사용)
      const classes = filteredRecords.map(r => r.class).filter(Boolean);
      if (classes.length > 0) {
        // 가장 빈번한 반 찾기
        const classCount = {};
        classes.forEach(c => classCount[c] = (classCount[c] || 0) + 1);
        const mostFrequentClass = Object.keys(classCount).reduce((a, b) => classCount[a] > classCount[b] ? a : b);
        filename += '_' + sanitize(mostFrequentClass);
      }
    }
    if (date) {
      filename += '_' + date;
    }
    filename += '.csv';
    
    a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });

  // 전체 선택/해제
  selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = rosterTbody.querySelectorAll('.record-checkbox');
    checkboxes.forEach(cb => cb.checked = e.target.checked);
  });

  // 선택 항목 삭제
  deleteSelectedBtn.addEventListener('click', () => {
    const checkboxes = rosterTbody.querySelectorAll('.record-checkbox:checked');
    if (checkboxes.length === 0) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${checkboxes.length}개의 기록을 삭제하시겠습니까?`)) {
      return;
    }

    // 선택된 기록들을 수집
    const recordsToDelete = [];
    checkboxes.forEach(cb => {
      try {
        const record = JSON.parse(cb.dataset.record);
        recordsToDelete.push(record);
      } catch (e) {
        console.error('Failed to parse record:', e);
      }
    });

    // 전체 기록에서 선택된 항목들 제거
    let allRecords = readRecords();
    recordsToDelete.forEach(delRecord => {
      allRecords = allRecords.filter(r => 
        !(r.date === delRecord.date && 
          r.school === delRecord.school && 
          r.class === delRecord.class && 
          r.student === delRecord.student && 
          r.createdAt === delRecord.createdAt)
      );
    });
    
    writeRecords(allRecords);
    
    // 전체 선택 체크박스 해제
    selectAllCheckbox.checked = false;
    
    // 필터와 테이블 다시 로드
    populateFilters();
    rosterTbodyRender();
    
    alert(`${recordsToDelete.length}개의 기록이 삭제되었습니다.`);
  });

  // 뷰 전환
  rosterBtn.addEventListener('click', () => {
    rosterView.classList.remove('hidden');
    boardView.classList.add('hidden');
    populateFilters(); 
    rosterTbodyRender();
    selectAllCheckbox.checked = false; // 전체 선택 해제
  });
  boardBtn.addEventListener('click', () => {
    rosterView.classList.add('hidden');
    boardView.classList.remove('hidden');
  });

  // 필터 변경 시 전체 선택 해제 및 테이블 갱신
  filterSchoolSelect.addEventListener('change', () => {
    selectAllCheckbox.checked = false;
    populateFilters();
    rosterTbodyRender();
  });
  
  filterDateSelect.addEventListener('change', () => {
    selectAllCheckbox.checked = false;
    rosterTbodyRender();
  });

  // 상단 메뉴 active 스타일 핸들링
  const updateMenuActive = () => {
    [rosterBtn, boardBtn, circularBtn, gridBtn, copyNamesBtn, captureButton, deleteModeBtn].forEach(btn => {
      btn?.classList.remove('active-menu');
    });
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
});
