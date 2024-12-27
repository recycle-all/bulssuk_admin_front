import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Stack, Button, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import SideMenu from '../common/SideMenu';
import Header from '../common/Header';
import { useNavigate } from 'react-router-dom';

const Faq = () => {
  const [inquiries, setInquiries] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [filterStatus, setFilterStatus] = useState('all'); // 필터 상태
  const navigate = useNavigate();

  // 모든 문의 데이터 가져오기
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch('http://localhost:8080/all_inquiries');
        const data = await response.json();

        // 모든 사용자 데이터 가져오기
        const userNos = [...new Set(data.map((item) => item.user_no))];
        const users = await fetchUsers(userNos);

        // 사용자 데이터를 inquiries에 병합 및 정렬
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
          .sort((a, b) => a.question_no - b.question_no); // question_no로 정렬

        setInquiries(processedData);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }
    };

    fetchInquiries();
  }, []);

  // 사용자 데이터 가져오기
  const fetchUsers = async (userNos) => {
    try {
      const userDataPromises = userNos.map(async (user_no) => {
        const response = await fetch(`http://localhost:8080/user/${user_no}`);
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

  // 필터 상태 변경
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilterStatus(newFilter);
    }
  };

  // 필터링된 데이터
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (filterStatus === 'all') return true;
    return inquiry.is_answered === filterStatus;
  });

  // DataGrid 컬럼 정의
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
          <Header />
          <Stack spacing={2} sx={{ height: '100%' }}>
            <h1 className="text-3xl font-bold mb-6">문의 조회</h1>

            {/* 필터링 버튼 */}
            <ToggleButtonGroup
              value={filterStatus}
              exclusive
              onChange={handleFilterChange}
              aria-label="Filter by status"
              sx={{ marginBottom: 2 }}
            >
              <ToggleButton value="all" aria-label="All">
                전체
              </ToggleButton>
              <ToggleButton value="답변 완료" aria-label="Answered">
                답변 완료
              </ToggleButton>
              <ToggleButton value="답변 대기" aria-label="Pending">
                답변 대기
              </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <DataGrid
                rows={filteredInquiries}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                checkboxSelection={false}
                autoHeight
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                sx={{
                  '& .MuiDataGrid-row': {
                    borderBottom: '0.5px solid #ccc',
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: '1rem',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f0f0f0',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    fontSize: '1rem',
                  },
                }}
              />
            </Box>
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Faq;
