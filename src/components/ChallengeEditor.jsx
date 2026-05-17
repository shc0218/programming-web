import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

const ChallengeEditor = ({ challenge, onComplete }) => {
  const [title, setTitle] = useState(challenge?.title || '');
  const [level, setLevel] = useState(challenge?.level || '1');
  const [description, setDescription] = useState(challenge?.description || '');
  const [templateCode, setTemplateCode] = useState(challenge?.templateCode || '');
  
  // 정답 코드 배열 상태 (초기값은 기존 정답이 있으면 가져오고 없으면 빈 배열)
  const [answers, setAnswers] = useState(challenge?.answers || ['']);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) return alert("제목과 문제 설명을 입력하세요.");
    
    // 빈 정답 필드는 제외하고 저장
    const filteredAnswers = answers.filter(ans => ans.trim() !== '');

    const data = {
      title,
      level: Number(level),
      description,
      templateCode,
      answers: filteredAnswers,
      updatedAt: new Date()
    };

    if (challenge?.id) {
      await updateDoc(doc(db, "challenges", challenge.id), data);
    } else {
      await addDoc(collection(db, "challenges"), { ...data, createdAt: new Date() });
    }
    onComplete();
  };

  // 정답 입력 필드 추가/수정/삭제 로직
  const addAnswerField = () => setAnswers([...answers, '']);
  const updateAnswerField = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };
  const removeAnswerField = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    setAnswers(newAnswers);
  };

  return (
    <div style={{ background: '#fff', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ margin: '0 0 20px 0' }}>{challenge ? '문제 수정하기' : '새로운 문제 출제'}</h3>
      
      {/* 제목 및 난이도 */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div style={{ flex: 3 }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>문제 제목</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>난이도 (Level)</label>
          <select value={level} onChange={e => setLevel(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>
        </div>
      </div>

      {/* 지문 입력 */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>문제 내용 설명</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', height: '150px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
      </div>

      {/* 기본 템플릿 코드 */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>기본 제공 코드 (Template)</label>
        <textarea value={templateCode} onChange={e => setTemplateCode(e.target.value)} style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }} />
      </div>

      {/* 정답 코드들 (여러 개 추가 가능) */}
      <div style={{ marginBottom: '30px', padding: '20px', background: '#f8fafc', borderRadius: '12px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#4f46e5' }}>정답 예시 등록 (여러 개 가능)</label>
        {answers.map((ans, idx) => (
          <div key={idx} style={{ marginBottom: '15px', position: 'relative' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '5px' }}>정답 #{idx + 1}</div>
            <textarea 
              value={ans} 
              onChange={e => updateAnswerField(idx, e.target.value)} 
              style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace' }}
              placeholder="정답 코드를 입력하세요"
            />
            {answers.length > 1 && (
              <button onClick={() => removeAnswerField(idx)} style={{ marginTop: '5px', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>✕ 삭제</button>
            )}
          </div>
        ))}
        <button onClick={addAnswerField} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px dashed #4f46e5', color: '#4f46e5', background: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+ 정답 코드 추가</button>
      </div>

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button onClick={onComplete} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff' }}>취소</button>
        <button onClick={handleSave} style={{ padding: '10px 25px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 'bold' }}>문제 저장하기</button>
      </div>
    </div>
  );
};

export default ChallengeEditor;