import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_id: adminId, admin_pw: adminPw }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '로그인 실패');
      }

      // 로그인 성공 시 토큰 저장 및 페이지 이동
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin_name', data.admin_name);
      localStorage.setItem('admin_no', data.admin_no);
      localStorage.setItem('admin_email', data.admin_email);

      navigate('/', { state: { admin_name: data.admin_name , admin_no : data.admin_no, admin_email:data.admin_email} });

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">관리자 로그인</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="adminId" className="block text-gray-700 font-medium mb-1">
              아이디
            </label>
            <input
              id="adminId"
              type="text"
              placeholder="아이디 입력"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="adminPw" className="block text-gray-700 font-medium mb-1">
              비밀번호
            </label>
            <input
              id="adminPw"
              type="password"
              placeholder="비밀번호 입력"
              value={adminPw}
              onChange={(e) => setAdminPw(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200"
          >
            로그인
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
