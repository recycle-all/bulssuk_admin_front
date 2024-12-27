import React, { createContext, useContext } from 'react';

// Context 생성
const AdminContext = createContext({
  admin_name: '',
  admin_no: '',
  admin_email: '',
});

// Context를 사용하기 위한 커스텀 훅
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// Provider 컴포넌트 생성
export const AdminProvider = ({ children }) => {
  const storedAdminName = localStorage.getItem('admin_name') || 'Guest';
  const storedAdminNo = localStorage.getItem('admin_no') || null;
  const storedAdminEmail = localStorage.getItem('admin_email') || 'guest@example.com';

  return (
    <AdminContext.Provider value={{ admin_name: storedAdminName, admin_no: storedAdminNo, admin_email: storedAdminEmail }}>
      {children}
    </AdminContext.Provider>
  );
};
