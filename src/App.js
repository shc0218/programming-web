import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import PostEditor from './components/PostEditor';
import PostViewer from './components/PostViewer';

// 실제 서비스 시에는 환경변수(.env)로 관리하는 것이 좋습니다.
const ADMIN_PASSWORD = "0218"; 

function App() {
  const [view, setView] = useState('list');
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { fetchPosts(); }, []);

  // 비밀번호 확인 공통 로직
  const checkAdminAuth = (action) => {
    const userInput = prompt("관리자 비밀번호를 입력하세요:");
    if (userInput === ADMIN_PASSWORD) {
      action();
    } else if (userInput !== null) {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div style={{ backgroundColor: '#fdfdfd', minHeight: '100vh', fontFamily: 'Pretendard, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', marginBottom: '30px' }}>
          <h1 onClick={() => setView('list')} style={{ cursor: 'pointer', margin: 0, fontSize: '1.6rem', fontWeight: '800', color: '#1a1a1a' }}>PyDev Academy</h1>
          {view === 'list' && (
            <button 
              onClick={() => checkAdminAuth(() => { setSelectedPost(null); setView('edit'); })} 
              style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              + 새 강좌 생성
            </button>
          )}
        </nav>

        {view === 'list' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
            {posts.map(p => (
              <div key={p.id} style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ marginBottom: '8px', fontSize: '1.25rem' }}>{p.title}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>총 {p.pages?.length || 0}개 유닛 구성</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => { setSelectedPost(p); setView('detail'); }} 
                    style={{ flex: 2, padding: '12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    수강하기
                  </button>
                  <button 
                    onClick={() => checkAdminAuth(() => { setSelectedPost(p); setView('edit'); })} 
                    style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    수정
                  </button>
                  <button 
                    onClick={() => checkAdminAuth(async () => { 
                      if(window.confirm('정말 삭제하시겠습니까?')) {
                        await deleteDoc(doc(db, "posts", p.id));
                        fetchPosts();
                      }
                    })} 
                    style={{ padding: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'edit' && <PostEditor post={selectedPost} onComplete={() => { setView('list'); fetchPosts(); }} />}
        {view === 'detail' && <PostViewer post={selectedPost} onBack={() => setView('list')} />}
      </div>
    </div>
  );
}

export default App;