import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import PostEditor from './components/PostEditor';
import PostViewer from './components/PostViewer';
import ChallengeEditor from './components/ChallengeEditor';
import ChallengeViewer from './components/ChallengeViewer';

const ADMIN_PASSWORD = "1234"; // 관리자 비밀번호

function App() {
  const [activeTab, setActiveTab] = useState('study'); // 'study' 또는 'solve'
  const [view, setView] = useState('list'); // 'list', 'edit', 'detail'
  const [posts, setPosts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = async () => {
    if (activeTab === 'study') {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } else {
      const q = query(collection(db, "challenges"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  };

  useEffect(() => { fetchData(); setView('list'); }, [activeTab]);

  // 관리자 인증용 공통 래퍼 함수
  const checkAdminAuth = (action) => {
    const userInput = prompt("관리자 비밀번호를 입력하세요:");
    if (userInput === ADMIN_PASSWORD) action();
    else if (userInput !== null) alert("비밀번호가 일치하지 않습니다.");
  };

  // 챌린지(문제) 삭제 처리 함수
  const handleDeleteChallenge = async (challengeId, challengeTitle) => {
    if (window.confirm(`"${challengeTitle}" 문제를 정말 삭제하시겠습니까?`)) {
      try {
        await deleteDoc(doc(db, "challenges", challengeId));
        alert("문제가 성공적으로 삭제되었습니다.");
        fetchData(); // 삭제 후 목록 갱신
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: view === 'detail' && activeTab === 'solve' ? '100%' : '1100px', margin: '0 auto', padding: '20px' }}>
        
        {/* 상단 네비게이션 바 */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #e2e8f0', marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>PyDev Academy</h1>
            {view === 'list' && (
              <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '4px' }}>
                <button onClick={() => setActiveTab('study')} style={{ border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: activeTab === 'study' ? '#fff' : 'transparent', color: activeTab === 'study' ? '#4f46e5' : '#64748b', cursor: 'pointer' }}>📚 학습 공간</button>
                <button onClick={() => setActiveTab('solve')} style={{ border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', background: activeTab === 'solve' ? '#fff' : 'transparent', color: activeTab === 'solve' ? '#4f46e5' : '#64748b', cursor: 'pointer' }}>💡 문제 해결 공간</button>
              </div>
            )}
          </div>
          {view === 'list' && (
            <button 
              onClick={() => checkAdminAuth(() => { setSelectedItem(null); setView('edit'); })}
              style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              {activeTab === 'study' ? '+ 새 강의 등록' : '+ 새 문제 등록'}
            </button>
          )}
        </nav>

        {/* --- 1. 학습 공간 리스트 --- */}
        {view === 'list' && activeTab === 'study' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{p.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>총 {p.pages?.length || 0}개 단원</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => { setSelectedItem(p); setView('detail'); }} style={{ flex: 2, padding: '10px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>학습하기</button>
                  <button onClick={() => checkAdminAuth(() => { setSelectedItem(p); setView('edit'); })} style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>수정</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 2. 문제 해결 공간 리스트 (삭제 버튼 추가됨) --- */}
        {view === 'list' && activeTab === 'solve' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {challenges.map(c => (
              <div key={c.id} style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>{c.title}</h3>
                  <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold' }}>Lv.{c.level || 1}</span>
                </div>
                
                {/* 하단 제어 버튼들 */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                  <button onClick={() => { setSelectedItem(c); setView('detail'); }} style={{ flex: 2, padding: '10px', background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>문제 풀기</button>
                  <button onClick={() => checkAdminAuth(() => { setSelectedItem(c); setView('edit'); })} style={{ flex: 1, background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>수정</button>
                  
                  {/* [새로 추가] 삭제 버튼 */}
                  <button 
                    onClick={() => checkAdminAuth(() => handleDeleteChallenge(c.id, c.title))} 
                    style={{ flex: 1, background: '#fef2f2', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#ef4444' }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 컴포넌트 라우팅 --- */}
        {view === 'edit' && activeTab === 'study' && <PostEditor post={selectedItem} onComplete={() => { setView('list'); fetchData(); }} />}
        {view === 'detail' && activeTab === 'study' && <PostViewer post={selectedItem} onBack={() => setView('list')} />}
        
        {view === 'edit' && activeTab === 'solve' && <ChallengeEditor challenge={selectedItem} onComplete={() => { setView('list'); fetchData(); }} />}
        {view === 'detail' && activeTab === 'solve' && <ChallengeViewer challenge={selectedItem} onBack={() => setView('list')} />}

      </div>
    </div>
  );
}

export default App;