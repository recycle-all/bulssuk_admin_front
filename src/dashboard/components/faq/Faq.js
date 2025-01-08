import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Button, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import SideMenu from '../common/SideMenu';
import Header from '../common/Header';
import { useNavigate } from 'react-router-dom';
import Copyright from '../../internals/components/Copyright';

const Faq = () => {
  const [inquiries, setInquiries] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [filterStatus, setFilterStatus] = useState('all'); // 필터 상태
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [pageSize, setPageSize] = useState(10); // 페이지 크기 상태

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_inquiries`);
        const data = await response.json();

        const userNos = [...new Set(data.map((item) => item.user_no))];
        const users = await fetchUsers(userNos);

        const processedData = data
          .map((item, index) => ({
            id: index + 1,
            question_no: item.question_no,
            question_title: item.question_title,
            user_no: item.user_no,
            user_id: users[item.user_no]?.user_id || '알 수 없음',
            created_at: item.created_at.slice(0, 10),
            is_answered: item.is_answered,
          }))
          .sort((a, b) => a.question_no - b.question_no);

        setInquiries(processedData);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    fetchInquiries();
  }, []);

  const fetchUsers = async (userNos) => {
    try {
      const userDataPromises = userNos.map(async (user_no) => {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/user/${user_no}`);
        const userData = await response.json();
        return { user_no, ...userData };
      });

      const allUserData = await Promise.all(userDataPromises);
      const userDetailsMap = allUserData.reduce((acc, user) => {
        acc[user.user_no] = user;
        return acc;
      }, {});

      setUserDetails(userDetailsMap);
      return userDetailsMap;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {};
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filterStatus === 'all') return true;
    return inquiry.is_answered === filterStatus;
  });

  const columns = [
    { field: 'id', headerName: 'No', width: 90, headerClassName: 'header-style' },
    { field: 'question_title', headerName: '문의 제목', flex: 1, headerClassName: 'header-style' },
    { field: 'user_id', headerName: '회원 아이디', flex: 1, headerClassName: 'header-style' },
    { field: 'created_at', headerName: '날짜', flex: 1, headerClassName: 'header-style' },
    {
      field: 'is_answered',
      headerName: '상태',
      flex: 1,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <span style={{ color: params.value === '답변 완료' ? 'grey' : 'red' }}>
          {params.value}
        </span>
      ),
    },
    {
      field: 'actions',
      headerName: '상세보기',
      width: 150,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#e0e0e0',
            color: 'white',
            '&:hover': {
              backgroundColor: '#bdbdbd',
            },
            textTransform: 'none',
          }}
          size="small"
          onClick={() =>
            navigate('/answer', {
              state: { question_no: params.row.question_no, user_id: params.row.user_id },
            })
          }
        >
          확인
        </Button>
      ),
    },
  ];

  return (
    <>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
            p: 3,
          })}
        >
          <h1 className="text-3xl font-bold mb-6">문의 조회</h1>

          {/* 필터링 Select */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              displayEmpty
              sx={{ width: 200 }}
            >
              <MenuItem value="all">전체</MenuItem>
              <MenuItem value="답변 완료">답변 완료</MenuItem>
              <MenuItem value="답변 대기">답변 대기</MenuItem>
            </Select>
          </Box>

          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filteredInquiries}
              columns={columns}
              pagination
              page={currentPage}
              onPageChange={(newPage) => setCurrentPage(newPage)}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[10, 20, 50]}
              autoHeight
              sx={{
                '& .MuiDataGrid-row': {
                  borderBottom: '1.3px solid #ccc',
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: '#f0f0f0',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                },
                '& .MuiDataGrid-footerContainer': {
                  fontSize: '0.9rem',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </AppTheme>
              <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default Faq;
