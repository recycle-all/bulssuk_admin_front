import React, { useEffect, useState } from 'react';
import AppTheme from '../../../shared-theme/AppTheme';
import { Box, CssBaseline, Typography, Grid, Button, Paper, Select, MenuItem } from '@mui/material';
import SideMenu from '../common/SideMenu';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';

const RealAnswer = () => {
  const [faq, setFaq] = useState(null); // FAQ 데이터
  const [categories, setCategories] = useState([]); // FAQ 카테고리 목록
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
  const { faq_no } = useParams(); // URL 파라미터에서 faq_no 가져오기
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState(''); // 카테고리 이름 상태 추가

  // 선택된 FAQ 정보 가져오기
  const fetchFaq = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/faq/${faq_no}`);
      const data = await response.json();
      setFaq(data);
      setSelectedCategory(data.category_id || ''); // 카테고리가 없으면 빈 값
      console.log('Selected category after fetch:', data.category_id);
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

  // FAQ 카테고리 목록 가져오기 
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/faq_categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching FAQ Category data:', error);
    }
  };

  useEffect(() => {
    fetchFaq();
    fetchCategories();
  }, [faq_no]);

  // FAQ 데이터가 로드된 후 fetchCategoryName 호출
  useEffect(() => {
    const fetchCategoryName = async (category_id) => {
      try {
        console.log(`Fetching category name for category_id: ${category_id}`);
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
        console.log(`Fetched category name: ${data[0].category_name}`);
        return data[0].category_name;
      } catch (error) {
        console.error('Error fetching FAQ Category Name data:', error);
        return null;
      }
    };

    if (faq && faq[0]?.category_id) {
      fetchCategoryName(faq[0].category_id).then((categoryName) => {
        setCategoryName(categoryName || '카테고리 정보 없음'); // 상태 업데이트
      });
    }
  }, [faq]); // faq 상태가 업데이트될 때 실행

  const handleBackToList = () => {
    navigate('/faq_page');
  };

  const handleApprove = async (status) => {
    try {
      const payload = {
        faq_no: faq_no,
        action: status,
      };

      if (status === '채택') {
        if (!selectedCategory) {
          alert('카테고리를 선택해주세요.');
          return;
        }
        payload.category_id = selectedCategory;
      }

      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/change_faq_state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert(`FAQ가 ${status === '채택' ? '채택' : '반려'}되었습니다.`);
        fetchFaq(); // 상태를 업데이트하는 대신 데이터 재요청
      } else {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        alert(`처리에 실패했습니다: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error approving FAQ:', error);
      alert('FAQ 상태를 업데이트하는 중 오류가 발생했습니다.');
    }
  };

  // 리스트에서 카테고리 고르기 
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    console.log('Selected Category ID:', newCategory); // 디버깅용 로그
    setSelectedCategory(newCategory); // 상태 업데이트
  };

  if (!faq) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography variant="h6">데이터를 불러오는 중...</Typography>
      </Box>
    );
  }

  const isCategoryEditable = faq && faq[0] && faq[0].category_id === null && faq[0].is_approved === '대기중';
  const isCategoryDisplayOnly = faq && faq[0] && faq[0].category_id !== null;

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
          <Typography variant="h4" gutterBottom>
            FAQ 관리
          </Typography>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={3}><Typography variant="subtitle1">카테고리</Typography></Grid>
              <Grid item xs={9}>
                {isCategoryEditable ? (
                  <Select
                    value={selectedCategory || ''} // 초기값 보장
                    onChange={handleCategoryChange} // 변경 핸들러
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      카테고리를 선택하세요
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : isCategoryDisplayOnly ? (
                  <Typography>{categoryName || '카테고리 정보 없음'}</Typography>
                ) : (
                  <Typography>카테고리를 설정할 수 없습니다.</Typography>
                )}
              </Grid>

              <Grid item xs={3}><Typography variant="subtitle1">상태</Typography></Grid>
              <Grid item xs={9}>
                <Typography>{faq && faq[0] ? faq[0].is_approved : '상태 정보 없음'}</Typography>
              </Grid>

              <Grid item xs={3}><Typography variant="subtitle1">등록일</Typography></Grid>
              <Grid item xs={9}>
                <Typography>{faq && faq[0] ? faq[0].created_at : '등록일 정보 없음'}</Typography>
              </Grid>

              <Grid item xs={3}><Typography variant="subtitle1">질문</Typography></Grid>
              <Grid item xs={9}>
                <Typography>{faq && faq[0] ? faq[0].question : '질문 정보 없음'}</Typography>
              </Grid>

              <Grid item xs={3}><Typography variant="subtitle1">답변</Typography></Grid>
              <Grid item xs={9}>
                <Typography>{faq && faq[0] ? faq[0].answer : '답변 정보 없음'}</Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              {faq && faq[0]?.is_approved === '대기중' ? (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      mr: 2,
                      '&:hover': { backgroundColor: '#218838' },
                    }}
                    onClick={() => handleApprove('채택')}
                  >
                    채택
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#c82333' },
                    }}
                    onClick={() => handleApprove('반려')}
                  >
                    반려
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    '&:hover': { backgroundColor: '#0056b3' },
                  }}
                  onClick={handleBackToList}
                >
                  확인
                </Button>
              )}
            </Grid>
          </Paper>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default RealAnswer;
