import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const PostEditor = ({ post, onComplete }) => {
  const [title, setTitle] = useState(post?.title || '');
  const [pages, setPages] = useState(post?.pages || [{ pageTitle: '', elements: [] }]);

  const addPage = () => setPages([...pages, { pageTitle: '', elements: [] }]);

  // 페이지 삭제 기능 추가
  const removePage = (pIdx) => {
    if (pages.length > 1 && window.confirm(`${pIdx + 1}번 페이지 전체를 삭제하시겠습니까?`)) {
      const newPages = pages.filter((_, index) => index !== pIdx);
      setPages(newPages);
    }
  };

  const addElement = (pIdx, type) => {
    const newPages = [...pages];
    newPages[pIdx].elements.push({ type, content: '' });
    setPages(newPages);
  };

  // 요소(텍스트/코드) 삭제 기능 추가
  const removeElement = (pIdx, eIdx) => {
    const newPages = [...pages];
    newPages[pIdx].elements = newPages[pIdx].elements.filter((_, index) => index !== eIdx);
    setPages(newPages);
  };

  const savePost = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    const data = { title, pages, updatedAt: new Date() };
    if (post?.id) await updateDoc(doc(db, "posts", post.id), data);
    else await addDoc(collection(db, "posts"), { ...data, createdAt: new Date() });
    onComplete();
  };

  return (
    <div style={{ paddingBottom: '120px' }}>
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>강좌 제목</label>
        <input 
          style={{ fontSize: '1.5rem', width: '100%', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          placeholder="강좌 전체 제목을 입력하세요" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
        />
      </div>

      {pages.map((page, pIdx) => (
        <div key={pIdx} style={{ background: '#fff', border: '1px solid #eee', padding: '25px', marginBottom: '30px', borderRadius: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4 style={{ margin: 0, color: '#4f46e5' }}>{pIdx + 1}번 페이지</h4>
            <button 
              onClick={() => removePage(pIdx)}
              style={{ padding: '5px 10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              페이지 삭제
            </button>
          </div>

          <input 
            placeholder="페이지 소제목을 입력하세요" 
            value={page.pageTitle} 
            onChange={e => {
              const newP = [...pages]; newP[pIdx].pageTitle = e.target.value; setPages(newP);
            }} 
            style={{ width: '100%', padding: '10px', marginBottom: '20px', border: 'none', borderBottom: '2px solid #e2e8f0', outline: 'none', fontSize: '1.1rem' }}
          />

          {page.elements.map((el, eIdx) => (
            <div key={eIdx} style={{ marginBottom: '20px', position: 'relative', padding: '15px', background: '#f8fafc', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
                  {el.type === 'text' ? '📝 Text Block' : '💻 Python Code'}
                </span>
                {/* 개별 요소 삭제 버튼 */}
                <button 
                  onClick={() => removeElement(pIdx, eIdx)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.2rem', lineHeight: '1' }}
                  title="삭제"
                >
                  &times;
                </button>
              </div>
              <textarea 
                value={el.content} 
                onChange={e => {
                  const newP = [...pages]; newP[pIdx].elements[eIdx].content = e.target.value; setPages(newP);
                }} 
                placeholder={el.type === 'text' ? "내용을 입력하세요..." : "# 코드를 입력하세요..."}
                style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box', fontFamily: el.type === 'code' ? 'monospace' : 'inherit' }}
              />
            </div>
          ))}

          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button onClick={() => addElement(pIdx, 'text')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #4f46e5', color: '#4f46e5', background: '#fff', cursor: 'pointer' }}>+ 텍스트 추가</button>
            <button onClick={() => addElement(pIdx, 'code')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #4f46e5', color: '#4f46e5', background: '#fff', cursor: 'pointer' }}>+ 코드 추가</button>
          </div>
        </div>
      ))}

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px', background: 'rgba(255,255,255,0.95)', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'center', gap: '15px', backdropFilter: 'blur(10px)' }}>
        <button onClick={addPage} style={{ padding: '12px 30px', borderRadius: '10px', background: '#1e293b', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ 새 페이지 추가</button>
        <button onClick={savePost} style={{ padding: '12px 40px', borderRadius: '10px', background: '#4f46e5', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>저장 및 강좌 발행</button>
      </div>
    </div>
  );
};

export default PostEditor;