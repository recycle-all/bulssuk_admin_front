import React, { useEffect, useState } from 'react';
import AppTheme from '../../../shared-theme/AppTheme';
import { Box, CssBaseline, Typography, Grid, Button, Paper, Select, MenuItem } from '@mui/material';
import SideMenu from '../common/SideMenu';
import { alpha } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';

const RealAnswer = () => {
  const [faq, setFaq] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { faq_no } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [isApproved, setIsApproved] = useState('');

  const fetchFaq = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/faq/${faq_no}`);
      const data = await response.json();
      setFaq(data);
      setSelectedCategory(data[0]?.category_id || '');
      setIsApproved(data[0]?.is_approved || '');
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
    }
  };

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

  useEffect(() => {
    const fetchCategoryName = async (category_id) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_DOMAIN}/faq_category_name/${category_id}`);
        const data = await response.json();
        return data[0]?.category_name || '';
      } catch (error) {
        console.error('Error fetching category name:', error);
        return '카테고리 정보 없음';
      }
    };

    if (faq && faq[0]?.category_id) {
      fetchCategoryName(faq[0]?.category_id).then(setCategoryName);
    }
  }, [faq]);

  const handleBackToList = () => {
    navigate('/faq_page');
  };

  

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleEditToggle = () => {
    setIsEditMode(true);
  };

  const handleSaveChanges = async (status) => {
    try {
      const payload = {
        faq_no,
        category_id: selectedCategory || null,
        is_approved: status, // status 값은 '채택 완료', '반려'와 정확히 일치해야 함
      };
  
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_faq`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert('FAQ가 성공적으로 수정되었습니다.');
        setIsEditMode(false);
        fetchFaq();
      } else {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        alert(`수정에 실패했습니다: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('FAQ 수정 중 오류가 발생했습니다.');
    }
  };
  
  const handleApprove = async (status) => {
    try {
      const payload = {
        faq_no: faq_no,
        action: status,
      };

      console.log(status)
      if (status === '채택 완료') {
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
        alert(`FAQ가 ${status === '채택 완료' ? '채택 완료' : '반려'}되었습니다.`);
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
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
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

  const isEditable = faq && faq[0]?.is_approved !== '대기중';

  

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box
  component="main"
  sx={(theme) => ({
    flexGrow: 1,
    display: 'flex', // Flexbox 사용
    flexDirection: 'column', // 세로 정렬
    backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
      : alpha(theme.palette.background.default, 1),
    overflow: 'hidden', // 전체 화면에서 스크롤 방지
    p: 3,
  })}
>
          <Typography variant="h4" gutterBottom sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
            FAQ 관리
          </Typography>
          <Box
    sx={{
      flex: 1, // 남은 공간을 모두 차지
      overflowY: 'auto', // 내용이 길 경우 스크롤 활성화
    }}
  >
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        height: '100%', // 전체 높이 사용
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // 버튼이 하단에 위치
      }}
    >
            <Grid container spacing={2}>
            <Grid item xs={3} sx={{ borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd',paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>등록일</Typography>
              </Grid>
              <Grid item xs={9} sx={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography sx={{ fontSize: '1rem' }}>{faq[0]?.created_at ? formatDate(faq[0].created_at) : '등록일 정보 없음'}</Typography>
              </Grid>

              <Grid item xs={3} sx={{ borderBottom: '1px solid #ddd',borderRight: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>카테고리</Typography>
              </Grid>
              <Grid item xs={9} sx={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                {(isEditMode || !isEditable) ? (
                  <Select
                    value={selectedCategory || ''}
                    onChange={handleCategoryChange}
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
                ) : (
                  <Typography sx={{ fontSize: '1rem' }}>
                    {categoryName || '카테고리 정보 없음'}
                  </Typography>
                )}
              </Grid>

  

              <Grid item xs={3} sx={{ borderBottom: '1px solid #ddd',borderRight: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', margin: '0 auto' }}>
                <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>질문</Typography>
              </Grid>
              <Grid item xs={9} sx={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography sx={{ fontSize: '1rem' }}>{faq[0]?.question || '질문 정보 없음'}</Typography>
              </Grid>

              <Grid
  item
  xs={3}
  sx={{
    borderBottom: '1px solid #ddd',
    borderRight: '1px solid #ddd',
    paddingBottom: '10px',
    paddingTop: '10px',
    width: '90%',
    display: 'flex', // 플렉스 컨테이너 설정
    justifyContent: 'center', // 수평 가운데 정렬
    alignItems: 'center', // 수직 가운데 정렬
    textAlign: 'center', // 텍스트 가운데 정렬
  }}
>
  <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
    답변
  </Typography>
</Grid>
<Grid
  item
  xs={9} // 답변 내용이 들어가는 그리드
  sx={{
    borderBottom: '1px solid #ddd',
    height: '400px', // 고정 높이 설정
    display: 'flex', // 플렉스박스를 활성화
    justifyContent: 'flex-start', // 가로 방향으로 중앙 정렬
    alignItems: 'flex-start', // 세로 방향으로 중앙 정렬
    textAlign: 'left', // 텍스트 중앙 정렬
  }}
>
                <Typography sx={{ fontSize: '1.2rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{faq[0]?.answer || '답변 정보 없음'}</Typography>
              </Grid>

              <Grid item xs={3} sx={{ borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd',paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography variant="subtitle1" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>상태</Typography>
              </Grid>
              <Grid item xs={9} sx={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', paddingTop: '10px', width: '90%' }}>
                <Typography sx={{ fontSize: '1rem' }}>{faq[0]?.is_approved || '상태 정보 없음'}</Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              {isEditMode ? (
                <>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#28a745',
                      color: '#fff',
                      mr: 2,
                      '&:hover': { backgroundColor: '#218838' },
                    }}
                    onClick={() => handleSaveChanges('채택 완료')}
                  >
                    채택완료
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#c82333' },
                    }}
                    onClick={() => handleSaveChanges('반려')}
                  >
                    반려
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#6c757d',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#5a6268' },
                      ml: 2,
                    }}
                    onClick={() => setIsEditMode(false)}
                  >
                    취소
                  </Button>
                </>
              ) : (
                <>
                  {!isEditable ? (
                    <>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: '#28a745',
                          color: '#fff',
                          mr: 2,
                          '&:hover': { backgroundColor: '#218838' },
                        }}
                        onClick={() => handleApprove('채택 완료')}
                      >
                        채택완료
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
                      onClick={handleEditToggle}
                    >
                      수정
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#c82333' },
                  ml: 2,
                }}
                onClick={handleBackToList}
              >
                뒤로가기
              </Button>
            </Grid>
          </Paper>
        </Box>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default RealAnswer;