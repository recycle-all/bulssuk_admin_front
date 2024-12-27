import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const [formData, setFormData] = useState({
        admin_id: '',
        admin_pw: '',
        admin_email: '',
        admin_name: '',
        admin_phone: '',
      });
    
      const [message, setMessage] = useState(null);
      const [error, setError] =  useState(null);
      const navigate = useNavigate(); // useNavigate 사용
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
    
        try {
          const response = await fetch('http://localhost:8000/sign_up', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          const data = await response.json();
    
          if (!response.ok) {
            throw new Error(data.error || '회원가입에 실패했습니다.');
          }
    
          setMessage('회원가입이 완료되었습니다!');
          navigate('/login');
        } catch (err) {
          setError(err.message);
        }
      };
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">회원가입</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="admin_id" className="block text-gray-700 font-medium mb-1">
                  아이디
                </label>
                <input
                  id="admin_id"
                  name="admin_id"
                  type="text"
                  placeholder="아이디 입력"
                  value={formData.admin_id}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin_pw" className="block text-gray-700 font-medium mb-1">
                  비밀번호
                </label>
                <input
                  id="admin_pw"
                  name="admin_pw"
                  type="password"
                  placeholder="비밀번호 입력"
                  value={formData.admin_pw}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin_email" className="block text-gray-700 font-medium mb-1">
                  이메일
                </label>
                <input
                  id="admin_email"
                  name="admin_email"
                  type="email"
                  placeholder="이메일 입력"
                  value={formData.admin_email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin_name" className="block text-gray-700 font-medium mb-1">
                  이름
                </label>
                <input
                  id="admin_name"
                  name="admin_name"
                  type="text"
                  placeholder="이름 입력"
                  value={formData.admin_name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin_phone" className="block text-gray-700 font-medium mb-1">
                  전화번호
                </label>
                <input
                  id="admin_phone"
                  name="admin_phone"
                  type="text"
                  placeholder="전화번호 입력"
                  value={formData.admin_phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200"
              >
                회원가입
              </button>
              {message && <p className="text-green-500 text-center mt-4">{message}</p>}
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
          </div>
        </div>
      );
    };
    

export default Signup