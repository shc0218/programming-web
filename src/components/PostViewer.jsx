import React, { useState, useEffect } from 'react';
import PythonEditor from './PythonEditor';

const PostViewer = ({ post, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState('text'); // 'text' (설명+예제실행), 'code' (자유실습)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!post || !post.pages || post.pages.length === 0) return null;

  const page = post.pages[currentPage];
  const isLastPage = currentPage === post.pages.length - 1;

  const movePage = (dir) => {
    if (dir === 'next') {
      if (isLastPage) onBack();
      else setCurrentPage(currentPage + 1);
    } else if (dir === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    setActiveTab('text'); 
    window.scrollTo(0, 0);
  };

  const tabButtonStyle = (type) => ({
    flex: 1,
    padding: '14px',
    border: 'none',
    background: activeTab === type ? '#4f46e5' : '#f1f5f9',
    color: activeTab === type ? '#fff' : '#64748b',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.3s all'
  });

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: isMobile ? '0 10px' : '0 15px' }}>
      {/* 상단 프로그레스 및 닫기 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1, height: '4px', background: '#e2e8f0', margin: '0 15px', borderRadius: '2px' }}>
          <div style={{ width: `${((currentPage + 1) / post.pages.length) * 100}%`, height: '100%', background: '#4f46e5', transition: 'width 0.3s' }}></div>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{currentPage + 1} / {post.pages.length}</span>
      </div>

      {/* 탭 스위치 (모바일 전용) */}
      {isMobile && (
        <div style={{ display: 'flex', borderRadius: '12px', overflow: 'hidden', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <button style={tabButtonStyle('text')} onClick={() => setActiveTab('text')}>📖 학습 및 예제</button>
          <button style={tabButtonStyle('code')} onClick={() => setActiveTab('code')}>💻 자유 실습</button>
        </div>
      )}

      <div style={{ 
        background: '#fff', 
        padding: isMobile ? '20px' : '40px', 
        borderRadius: '24px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
        minHeight: '60vh' 
      }}>
        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', marginBottom: '30px', color: '#1e293b' }}>{page.pageTitle}</h2>

        {/* --- 1. 학습 및 예제 탭 --- */}
        {(!isMobile || activeTab === 'text') && (
          <div>
            {page.elements.map((el, i) => (
              <div key={`content-${currentPage}-${i}`} style={{ marginBottom: '30px' }}>
                {el.type === 'text' ? (
                  <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>{el.content}</p>
                ) : (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#475569' }}>EXAMPLE</span>
                    </div>
                    {/* 예제 코드 에디터 (여기서도 실행 가능!) */}
                    <PythonEditor 
                      key={`example-editor-${currentPage}-${i}`} 
                      initialCode={el.content} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- 2. 자유 실습 탭 (백지 상태의 연습장) --- */}
        {(!isMobile || activeTab === 'code') && (
          <div style={{ marginTop: isMobile ? '0' : '50px', borderTop: isMobile ? 'none' : '2px dashed #e2e8f0', paddingTop: isMobile ? '0' : '40px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#4f46e5', margin: '0 0 8px 0' }}>⚡ 자유 연습장</h3>
              <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>배운 내용을 토대로 나만의 코드를 만들어보세요.</p>
            </div>
            
            <PythonEditor 
              key={`free-practice-${currentPage}`} 
              initialCode={"# 여기에 자유롭게 코딩해보세요\n"} 
            />
          </div>
        )}
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', paddingBottom: '50px' }}>
        <button onClick={() => movePage('prev')} disabled={currentPage === 0} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 'bold', cursor: 'pointer' }}>이전</button>
        <button 
          onClick={() => movePage('next')} 
          style={{ flex: 2, padding: '16px', borderRadius: '14px', border: 'none', background: isLastPage ? '#22c55e' : '#4f46e5', color: '#fff', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}
        >
          {isLastPage ? '🎉 모든 학습 완료' : '다음 페이지로'}
        </button>
      </div>
    </div>
  );
};

export default PostViewer;