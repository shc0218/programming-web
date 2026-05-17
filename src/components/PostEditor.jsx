import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const PostEditor = ({ post, onComplete }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [pages, setPages] = useState(post?.pages || [
    { pageTitle: '첫 번째 단원', elements: [{ type: 'text', content: '' }] }
  ]);

  // 각 페이지의 접힘(collapsed) 상태 관리 (true = 접힘, false = 펼침)
  const [collapsedStates, setCollapsedStates] = useState(
    pages.map((_, index) => index !== 0)
  );

  // 확실하게 접고 펼치기 위한 토글 함수
  const toggleCollapse = (index) => {
    setCollapsedStates(prev => prev.map((state, i) => i === index ? !state : state));
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("강의 제목을 입력하세요.");
    
    const data = {
      title,
      pages,
      updatedAt: new Date()
    };

    if (post?.id) {
      await updateDoc(doc(db, "posts", post.id), data);
    } else {
      await addDoc(collection(db, "posts"), { ...data, createdAt: new Date() });
    }
    onComplete();
  };

  const addPage = () => {
    setPages([...pages, { pageTitle: `새 단원 ${pages.length + 1}`, elements: [{ type: 'text', content: '' }] }]);
    setCollapsedStates([...collapsedStates.map(() => true), false]);
  };

  const removePage = (pageIdx) => {
    if (pages.length === 1) return alert("최소 한 개의 단원이 필요합니다.");
    setPages(pages.filter((_, i) => i !== pageIdx));
    setCollapsedStates(collapsedStates.filter((_, i) => i !== pageIdx));
  };

  const updatePageTitle = (pageIdx, value) => {
    const newPages = [...pages];
    newPages[pageIdx].pageTitle = value;
    setPages(newPages);
  };

  const addElement = (pageIdx, type) => {
    const newPages = [...pages];
    newPages[pageIdx].elements.push({ type, content: '' });
    setPages(newPages);
  };

  const updateElement = (pageIdx, elIdx, value) => {
    const newPages = [...pages];
    newPages[pageIdx].elements[elIdx].content = value;
    setPages(newPages);
  };

  const removeElement = (pageIdx, elIdx) => {
    const newPages = [...pages];
    newPages[pageIdx].elements = newPages[pageIdx].elements.filter((_, i) => i !== elIdx);
    setPages(newPages);
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 25px 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b' }}>
        {post ? '강의 수정하기' : '새로운 강의 작성'}
      </h3>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#475569' }}>강의 대제목</label>
        <input 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '1.05rem' }} 
          placeholder="예: 파이썬 기초 문법 뽀개기" 
        />
      </div>

      <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: '#475569', fontWeight: 'bold' }}>단원 편집 ({pages.length}개)</h4>
        <button onClick={addPage} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          + 새 단원(페이지) 추가
        </button>
      </div>

      {pages.map((page, pageIdx) => {
        const isCollapsed = collapsedStates[pageIdx];

        return (
          <div key={pageIdx} style={{ 
            background: '#f8fafc', 
            borderRadius: '16px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '20px',
            overflow: 'hidden'
          }}>
            {/* 아코디언 헤더 구역 */}
            <div 
              style={{ 
                padding: '16px 20px', 
                background: isCollapsed ? '#f1f5f9' : '#e2e8f0', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                userSelect: 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem' }}>PAGE {pageIdx + 1}</span>
                <span style={{ fontWeight: 'bold', color: '#1e293b', fontSize: '1rem' }}>
                  {page.pageTitle || '제목 없는 단원'}
                </span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => removePage(pageIdx)} 
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  단원 삭제
                </button>
                
                {/* [수정] 명시적인 버튼 태그로 변경하고 onClick 이벤트를 직접 바인딩했습니다. */}
                <button 
                  onClick={() => toggleCollapse(pageIdx)}
                  style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold', 
                    color: '#475569', 
                    background: '#fff', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                >
                  {isCollapsed ? '▼ 펼치기' : '▲ 접기'}
                </button>
              </div>
            </div>

            {/* 내부 콘텐츠 구역 */}
            {!isCollapsed && (
              <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 'bold', color: '#64748b' }}>단원 제목</label>
                  <input 
                    value={page.pageTitle} 
                    onChange={e => updatePageTitle(pageIdx, e.target.value)} 
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} 
                    placeholder="단원의 세부 제목을 입력하세요"
                  />
                </div>

                {page.elements.map((el, elIdx) => (
                  <div key={elIdx} style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '15px', border: '1px solid #f1f5f9', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: el.type === 'text' ? '#3b82f6' : '#10b981' }}>
                        {el.type === 'text' ? '📝 설명 텍스트' : '💻 실행용 예제 코드'}
                      </span>
                      <button onClick={() => removeElement(pageIdx, elIdx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>삭제</button>
                    </div>

                    <textarea
                      value={el.content}
                      onChange={e => updateElement(pageIdx, elIdx, e.target.value)}
                      style={{ 
                        width: '100%', 
                        height: el.type === 'text' ? '100px' : '140px', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        border: '1px solid #cbd5e1',
                        fontFamily: el.type === 'code' ? 'monospace' : 'inherit',
                        backgroundColor: el.type === 'code' ? '#fafafa' : '#fff'
                      }}
                      placeholder={el.type === 'text' ? "이론 설명을 입력하세요." : "# 여기에 파이썬 예제 코드를 입력하세요."}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button onClick={() => addElement(pageIdx, 'text')} style={{ flex: 1, padding: '10px', background: '#eff6ff', color: '#1d4ed8', border: '1px dashed #3b82f6', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ 설명 텍스트 추가</button>
                  <button onClick={() => addElement(pageIdx, 'code')} style={{ flex: 1, padding: '10px', background: '#ecfdf5', color: '#047857', border: '1px dashed #10b981', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>+ 실행용 예제 코드 추가</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
        <button onClick={onComplete} style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: '600' }}>취소</button>
        <button onClick={handleSave} style={{ padding: '12px 30px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>강의 저장 및 발행</button>
      </div>
    </div>
  );
};

export default PostEditor;