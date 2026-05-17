import React, { useState, useEffect } from 'react';
import PythonEditor from './PythonEditor'; 

const PostViewer = ({ post, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);

  // [수정] useEffect를 컴포넌트 최상단(조건문보다 위)으로 올렸습니다.
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  }, [currentPage]);

  // 예외 처리 조건문은 훅 선언들이 모두 끝난 '이후'에 위치해야 합니다.
  if (!post || !post.pages || post.pages.length === 0) return null;
  
  const page = post.pages[currentPage];
  const isLastPage = currentPage === post.pages.length - 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      
      {/* 상단 헤더 영역 (목록 가기 및 현재 페이지 표시) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={onBack} 
          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          ← 목록으로
        </button>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 'bold' }}>
          {currentPage + 1} / {post.pages.length}
        </span>
      </div>

      {/* 메인 강의 본문 카드 슬롯 */}
      <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', minHeight: '50vh', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px', color: '#1e293b' }}>
          {page.pageTitle}
        </h2>
        
        {/* 단원 내부 구성 요소들(텍스트 및 읽기 전용 예제 코드) 렌더링 */}
        {page.elements.map((el, i) => (
          <div key={`lecture-${currentPage}-${i}`} style={{ marginBottom: '30px' }}>
            {el.type === 'text' ? (
              <p style={{ lineHeight: '1.9', fontSize: '1.1rem', color: '#334155', whiteSpace: 'pre-wrap', margin: 0 }}>
                {el.content}
              </p>
            ) : (
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold', color: '#475569' }}>
                    EXAMPLE CODE
                  </span>
                </div>
                <PythonEditor 
                  key={`lecture-editor-${currentPage}-${i}`} 
                  initialCode={el.content} 
                  readOnly={true} 
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 페이지 이동 네비게이터 바 */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '25px', paddingBottom: '40px' }}>
        <button 
          onClick={() => { if(currentPage > 0) setCurrentPage(currentPage - 1) }} 
          disabled={currentPage === 0} 
          style={{ 
            flex: 1, 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            background: currentPage === 0 ? '#f1f5f9' : '#fff', 
            color: currentPage === 0 ? '#94a3b8' : '#475569', 
            fontWeight: 'bold', 
            cursor: currentPage === 0 ? 'default' : 'pointer' 
          }}
        >
          이전 단원
        </button>
        <button 
          onClick={() => { if(isLastPage) onBack(); else setCurrentPage(currentPage + 1); }} 
          style={{ 
            flex: 2, 
            padding: '16px', 
            borderRadius: '12px', 
            border: 'none', 
            background: isLastPage ? '#22c55e' : '#4f46e5', 
            color: '#fff', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          {isLastPage ? '🎉 모든 학습 완료! (목록으로)' : '다음 단원으로'}
        </button>
      </div>
    </div>
  );
};

export default PostViewer;