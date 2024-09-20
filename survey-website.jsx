import React, { useState, useMemo } from 'react';

const productOptions = [
  { en: "LILIT-01", ko: "릴릿-공일" },
  { en: "LILIT-01(BR)", ko: "릴릿-공일-비알" },
  { en: "LILIT-01(K)", ko: "릴릿-공일-케이" },
  { en: "BY-01", ko: "비와이-공일" },
  { en: "HEIZER-01", ko: "하이저-공일" },
  { en: "PINO-01", ko: "피노-공일" }
];

const nationalityOptions = [
  "한국",
  "중국",
  "일본",
  "그밖의 아시아",
  "미국/캐나다",
  "유럽",
  "기타"
];

const inputStyle = {
  width: '100%', 
  padding: '5px', 
  border: '1px solid black', 
  borderRadius: '4px'
};

const SurveyWebsite = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productNameII: '',
    purchased: '',
    age: '',
    nationality: '',
    gender: '',
    responseWordingI: '',
    responseWordingII: '',
    responseWordingIII: '',
    feedback: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [responses, setResponses] = useState([]);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    const searchLower = search.toLowerCase();
    return productOptions.filter(product => 
      product.en.toLowerCase().includes(searchLower) || 
      product.ko.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleProductSearch = (e, field) => {
    const value = e.target.value;
    setSearch(value);
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  const handleProductSelect = (product, field) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: product.en
    }));
    setSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setResponses([...responses, formData]);
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      productNameII: '',
      purchased: '',
      age: '',
      nationality: '',
      gender: '',
      responseWordingI: '',
      responseWordingII: '',
      responseWordingIII: '',
      feedback: ''
    });
    setSubmitted(false);
  };

  const downloadCSV = () => {
    const headers = ['제품명', '제품명 II', '구매여부', '연령', '국적', '성별', '응대 워딩 I', '응대 워딩 II', '응대 워딩 III', '기타 피드백'];
    const csvData = [
      headers,
      ...responses.map(r => [
        r.productName,
        r.productNameII,
        r.purchased,
        r.age,
        r.nationality,
        r.gender,
        r.responseWordingI,
        r.responseWordingII,
        r.responseWordingIII,
        r.feedback
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'survey_responses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{maxWidth: '500px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center', marginBottom: '20px', fontSize: '27px', fontWeight: 'bold'}}>응대 리포트</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <div>
            <label htmlFor="productName">제품명</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={(e) => handleProductSearch(e, 'productName')}
              required
              style={inputStyle}
            />
            {search && (
              <ul style={{listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ccc'}}>
                {filteredProducts.map((product, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleProductSelect(product, 'productName')}
                    style={{padding: '5px', cursor: 'pointer', hoverBackgroundColor: '#f0f0f0'}}
                  >
                    {product.en} ({product.ko})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="productNameII">제품명 II</label>
            <input
              type="text"
              id="productNameII"
              name="productNameII"
              value={formData.productNameII}
              onChange={(e) => handleProductSearch(e, 'productNameII')}
              required
              style={inputStyle}
            />
            {search && (
              <ul style={{listStyle: 'none', padding: 0, margin: 0, border: '1px solid #ccc'}}>
                {filteredProducts.map((product, index) => (
                  <li 
                    key={index} 
                    onClick={() => handleProductSelect(product, 'productNameII')}
                    style={{padding: '5px', cursor: 'pointer', hoverBackgroundColor: '#f0f0f0'}}
                  >
                    {product.en} ({product.ko})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label>구매여부</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="purchased"
                  value="yes"
                  checked={formData.purchased === 'yes'}
                  onChange={handleChange}
                  required
                /> 예
              </label>
              <label style={{marginLeft: '10px'}}>
                <input
                  type="radio"
                  name="purchased"
                  value="no"
                  checked={formData.purchased === 'no'}
                  onChange={handleChange}
                  required
                /> 아니오
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="age">연령</label>
            <select
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">연령대 선택</option>
              <option value="10s">10대</option>
              <option value="20s">20대</option>
              <option value="30s">30대</option>
              <option value="40s">40대</option>
              <option value="50s">50대 이상</option>
            </select>
          </div>
          <div>
            <label htmlFor="nationality">국적</label>
            <select
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="">국적 선택</option>
              {nationalityOptions.map((nationality, index) => (
                <option key={index} value={nationality}>{nationality}</option>
              ))}
            </select>
          </div>
          <div>
            <label>성별</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  required
                /> 남성
              </label>
              <label style={{marginLeft: '10px'}}>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                  required
                /> 여성
              </label>
              <label style={{marginLeft: '10px'}}>
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                  required
                /> 기타
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="responseWordingI">응대 워딩 I</label>
            <input
              type="text"
              id="responseWordingI"
              name="responseWordingI"
              value={formData.responseWordingI}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="responseWordingII">응대 워딩 II</label>
            <input
              type="text"
              id="responseWordingII"
              name="responseWordingII"
              value={formData.responseWordingII}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="responseWordingIII">응대 워딩 III</label>
            <input
              type="text"
              id="responseWordingIII"
              name="responseWordingIII"
              value={formData.responseWordingIII}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="feedback">기타 피드백</label>
            <textarea
              id="feedback"
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              style={{...inputStyle, height: '100px'}}
            />
          </div>
          <button type="submit" style={{padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer'}}>제출</button>
        </form>
      ) : (
        <div style={{textAlign: 'center'}}>
          <p style={{marginBottom: '15px'}}>응답해 주셔서 감사합니다!</p>
          <button onClick={resetForm} style={{padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px'}}>다른 응답 제출</button>
          <button onClick={downloadCSV} style={{padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', cursor: 'pointer'}}>응답 다운로드 (CSV)</button>
        </div>
      )}
    </div>
  );
};

export default SurveyWebsite;
