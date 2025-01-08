import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, Button, Select, MenuItem, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import SideMenu from '../common/SideMenu';
import { useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Copyright from '../../internals/components/Copyright';

const FaqManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [filteredFaqs, setFilteredFaqs] = useState([]); // 필터링된 FAQ 데이터
  const [statusFilter, setStatusFilter] = useState('전체'); // 상태 필터 추가
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 상태
  const [pageSize, setPageSize] = useState(10); // 페이지 크기 상태

  // FAQ 데이터 가져오기
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_faqs`);
        const data = await response.json();

        // 카테고리 이름 가져오기
        const processedData = await Promise.all(
          data.map(async (item) => {
            if (item.category_id) {
              const categoryName = await fetchCategoryName(item.category_id);
              return {
                id: item.faq_no,
                question: item.question,
                category: categoryName || '카테고리 정보 없음',
                status: item.is_approved,
              };
            } else {
              return {
                id: item.faq_no,
                question: item.question,
                category: '미정',
                status: item.is_approved,
              };
            }
          })
        );

        setFaqs(processedData);
        setFilteredFaqs(processedData); // 초기 필터링된 데이터 설정
      } catch (error) {
        console.error('Error fetching FAQs:', error);
      }
    };

    const fetchCategoryName = async (category_id) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/faq_category_name/${category_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data[0].category_name;
      } catch (error) {
        console.error('Error fetching FAQ Category Name data:', error);
        return null;
      }
    };

    fetchFaqs();
  }, []);

  // 상태 필터 변경 핸들러
  const handleFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);

    // 상태 필터에 따라 데이터 필터링
    if (selectedStatus === '전체') {
      setFilteredFaqs(faqs); // 전체 데이터 표시
    } else {
      setFilteredFaqs(faqs.filter((faq) => faq.status === selectedStatus));
    }
  };

  // DataGrid 컬럼 정의
  const columns = [
    { field: 'id', headerName: 'No', width: 90, headerClassName: 'header-style' },
    { field: 'question', headerName: '질문', flex: 1, headerClassName: 'header-style' },
    { field: 'category', headerName: '카테고리', flex: 1, headerClassName: 'header-style' },
    {
      field: 'status',
      headerName: '상태',
      flex: 1,
      headerClassName: 'header-style',
      renderCell: (params) => (
        <span style={{ color: getStatusColor(params.value) }}>
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
    color: 'white', // 글자 색을 흰색으로 설정
    '&:hover': {
      backgroundColor: '#bdbdbd',
    },
    textTransform: 'none',
  }}
  size="small"
  onClick={() => navigate(`/faq/${params.row.id}`)} // 상세보기 클릭 시 /faq/:faq_no로 이동
>
  확인
</Button>
      ),
    },
  ];

  // 상태에 따른 색상 반환
  const getStatusColor = (status) => {
    switch (status) {
      case '채택 완료':
        return 'green';
      case '반려':
        return 'red';
      default:
        return 'orange'; // 대기중
    }
  };

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
             <Header />
          <h1 className="text-3xl font-bold mb-6">FAQ 관리</h1>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item>
              <Select
                value={statusFilter}
                onChange={handleFilterChange}
                displayEmpty
                sx={{ minWidth: 200 }}
              >
                <MenuItem value="전체">전체</MenuItem>
                <MenuItem value="대기중">대기중</MenuItem>
                <MenuItem value="채택 완료">채택 완료</MenuItem>
                <MenuItem value="반려">반려</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <DataGrid
              rows={filteredFaqs} // 필터링된 데이터
              columns={columns} // 컬럼 정의
              pagination // 페이지네이션 활성화
              page={currentPage} // 현재 페이지
              onPageChange={(newPage) => setCurrentPage(newPage)} // 페이지 변경 이벤트
              pageSize={pageSize} // 한 페이지에 표시할 행 수
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)} // 페이지 크기 변경 이벤트
              rowsPerPageOptions={[10, 20, 50]} // 페이지 크기 옵션
              autoHeight
              sx={{
                '& .MuiDataGrid-row': {
                  borderBottom: '1.3px solid #ccc', // 행 사이의 선을 진하게 설정
                },
                '& .MuiDataGrid-cell': {
                  fontSize: '0.9rem', // 셀 폰트 크기
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

export default FaqManagement;
