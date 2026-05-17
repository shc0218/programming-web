import React, { useState } from 'react';
import PythonEditor from './PythonEditor';

const ChallengeViewer = ({ challenge, onBack }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  if (!challenge) return null;

  return (
    <div style={{ 
      display: 'flex', 
      height: 'calc(100vh - 100px)', 
      margin: '-10px -20px', 
      borderTop: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      {/* 왼쪽: 지문 영역 */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto', background: '#fff', borderRight: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>← 나가기</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold' }}>Challenge</span>
              <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Level {challenge.level}</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 20px 0', color: '#1e293b' }}>{challenge.title}</h2>
          </div>
          
          {/* 정답 보기 버튼 */}
          <button 
            onClick={() => setShowAnswers(!showAnswers)}
            style={{ 
              padding: '10px 16px', borderRadius: '8px', border: '1px solid #4f46e5', 
              background: showAnswers ? '#4f46e5' : '#fff', 
              color: showAnswers ? '#fff' : '#4f46e5', 
              fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
            }}
          >
            {showAnswers ? "📖 문제 보기" : "🔓 정답 확인"}
          </button>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '20px 0' }} />
        
        {/* 문제 지문 또는 정답 리스트 교체 출력 */}
        {!showAnswers ? (
          <div style={{ lineHeight: '1.8', color: '#334155', fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
            {challenge.description}
          </div>
        ) : (
          <div style={{ animation: 'fadeIn 0.3s' }}>
            <h3 style={{ color: '#4f46e5', marginBottom: '20px' }}>모범 답안 ({challenge.answers?.length || 0})</h3>
            {challenge.answers && challenge.answers.length > 0 ? (
              challenge.answers.map((ans, idx) => (
                <div key={idx} style={{ marginBottom: '30px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#64748b' }}>답안 예시 #{idx + 1}</div>
                  {/* 정답은 수정 불가능하게 readOnly로 표시 */}
                  <PythonEditor initialCode={ans} readOnly={true} />
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8' }}>등록된 정답이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 오른쪽: 실습 영역 (유저는 여기서 계속 코딩 가능) */}
      <div style={{ flex: 1, padding: '20px', background: '#f1f5f9', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: '10px', fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold' }}>MY SOLUTION</div>
        <PythonEditor initialCode={challenge.templateCode || "# 여기에 정답 코드를 작성하세요\n"} />
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ChallengeViewer;