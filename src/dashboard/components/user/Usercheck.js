import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CssBaseline, Stack, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import SideMenu from '../common/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';
import Header from '../common/Header'
const Usercheck = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [points, setPoints] = useState([])
  const handleNavigate = (user_no) => {
    navigate(`/userinfo/${user_no}`);
  };

  // 모든 고객 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 사용자 정보 가져오기
        const usersResponse = await fetch('http://localhost:8000/users');
        const usersData = await usersResponse.json();
  
        // 2. 포인트 정보 가져오기
        const pointsResponse = await fetch('http://localhost:8000/point');
        const pointsData = await pointsResponse.json();
  
        // 3. 사용자와 포인트 데이터를 매핑
        const mergedData = usersData.map((user) => {
          const point = pointsData.find((p) => p.user_no === user.user_no);
          return {
            ...user,
            point_total: point ? point.point_total : 0, // 매칭되지 않으면 0
            created_at: user.created_at.slice(0, 10), // 날짜를 "년-월-일"로 변환
          };
        });
  
        // 4. 최종 병합된 데이터 상태 업데이트
        setUsers(mergedData);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    fetchData(); // 데이터 가져오기 실행
  }, []); // 의존성 배열을 빈 배열로 설정하여 컴포넌트 로드 시 한 번만 실행
  
  

  // DataGrid에 사용할 컬럼 정의
  const columns = [
    { field: 'id', headerName: 'No', width: 90, headerClassName: 'header-style' },
    { field: 'user_name', headerName: '회원명', flex: 1, headerClassName: 'header-style' },
    { field: 'user_email', headerName: '이메일', flex: 1.5, headerClassName: 'header-style' },
    { field: 'created_at', headerName: '출석률', flex: 1, headerClassName: 'header-style' },
    { field: 'point_total', headerName: '포인트', flex: 1, headerClassName: 'header-style' },

    {
      field: 'actions',
      headerName: '상세정보',
      width: 150,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#e0e0e0', // 연한 그레이
            color: 'white',
            '&:hover': {
              backgroundColor: '#bdbdbd', // 호버 시 진한 그레이
            },
            textTransform: 'none',
            boxShadow: 'none',
          }}
          size="small"
          onClick={() =>
            navigate(`/userinfo/${params.row.user_no}`, {
              state: { point_total: params.row.point_total },
            })
          }
        >
          확인
        </Button>
      ),
    },
  ];

  // DataGrid에 사용할 행 데이터
  const rows = users.map((user, index) => ({
    id: index + 1,
    ...user,
  }));

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
          <Header/>
          <Stack spacing={2} sx={{ height: '100%' }}>
            <h1 className="text-3xl font-bold mb-6">회원 조회</h1>
            <Box sx={{ flexGrow: 1, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSizeOptions={[10, 20, 50]}
                checkboxSelection
                autoHeight
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                sx={{
                  '& .MuiDataGrid-row': {
                    borderBottom: '0.5px solid #ccc', // 줄 사이가 더 진하게
                  },
                  '& .MuiDataGrid-cell': {
                    fontSize: '1rem', // 글자 크기 키우기
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

export default Usercheck;
