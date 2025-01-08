import React, { useEffect, useState } from 'react';
import AppTheme from '../../../shared-theme/AppTheme';
import { Box, CssBaseline, Typography, Grid, TextField, Button, Paper } from '@mui/material';
import SideMenu from '../common/SideMenu';
import { alpha } from '@mui/material/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import Copyright from '../../internals/components/Copyright';

const Answer = () => {
  const [inquiry, setInquiry] = useState([]); // 문의 데이터
  const [answer, setAnswer] = useState([]); // 답변 데이터
  const [editable, setEditable] = useState(false); // 수정 가능 여부
  const [answerContent, setAnswerContent] = useState(''); // 답변 내용 상태
  const { state } = useLocation();
  const { question_no } = state || {}; // 전달된 state에서 question_no 가져오기
  const { user_id } = state || {}; // 전달된 state에서 user_id 가져오기
  const navigate = useNavigate();

  // 문의와 답변 데이터 가져오기
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const inquiryResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/inquiry/${question_no}`);
        const inquiryData = await inquiryResponse.json();
        setInquiry(inquiryData);
      } catch (error) {
        console.error('Error fetching inquiry data:', error);
      }
    };

    const fetchAnswer = async () => {
      try {
        const answerResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/answer/${question_no}`);
        const answerData = await answerResponse.json();
        setAnswer(answerData);

        // 상태에 따라 초기 답변 설정
        if (answerData.length > 0) {
          setAnswerContent(answerData[0].answer_content); // 기존 답변 설정
          setEditable(false); // 수정 불가능 상태
        } else {
          setAnswerContent(''); // 빈칸으로 설정
          setEditable(true); // 수정 가능 상태
        }
      } catch (error) {
        console.error('Error fetching answer data:', error);
      }
    };

    if (question_no) {
      fetchInquiry();
      fetchAnswer();
    }
  }, [question_no]);

  // 수정 버튼 클릭
  const handleEdit = () => {
    setEditable(true); // 수정 가능 상태로 변경
  };

  const handleInputChange = (e) => {
    setAnswerContent(e.target.value); // 입력된 값을 상태에 업데이트
  };

  const handleSaveOrUpdate = async () => {
    const admin_no = localStorage.getItem('admin_no'); // localStorage에서 admin_no 가져오기
    if (!admin_no) {
      console.error('admin_no가 localStorage에 없습니다.');
      return;
    }

    try {
      const method = answer.length > 0 ? 'PUT' : 'POST'; // 수정(PUT)인지 등록(POST)인지 확인
      const url = answer.length > 0
        ? `${process.env.REACT_APP_DOMAIN}/answer/${question_no}` // 수정 시 question_no 사용
        : `${process.env.REACT_APP_DOMAIN}/answer`; // 등록 시 기본 URL 사용

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_no, // 현재 문의 번호
          admin_no, // 관리자 번호
          answer_content: answerContent, // 답변 내용
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`${method === 'POST' ? '답변 등록' : '답변 수정'} 성공:`, result);
        setEditable(false); // 저장 후 수정 불가능 상태로 변경
        alert(`${method === 'POST' ? '답변이 등록되었습니다.' : '답변이 수정되었습니다.'}`);
      } else {
        const error = await response.json();
        console.error(`${method === 'POST' ? '답변 등록' : '답변 수정'} 실패:`, error);
        alert(`${method === 'POST' ? '답변 등록에 실패했습니다.' : '답변 수정에 실패했습니다.'}`);
      }
    } catch (error) {
      console.error('Error saving or updating answer:', error);
      alert('서버와의 연결 중 문제가 발생했습니다.');
    }
  };

  const handleDeactivate = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_inquiry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question_no }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('문의 비활성화 성공:', result);
        alert('문의가 비활성화되었습니다.');
        navigate('/faq'); // 리스트 페이지로 이동
      } else {
        const error = await response.json();
        console.error('문의 비활성화 실패:', error);
        alert('문의 비활성화에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error deactivating inquiry:', error);
      alert('서버와의 연결 중 문제가 발생했습니다.');
    }
  };

  const handleBackToList = () => {
    navigate('/faq'); // 리스트 페이지로 이동
  };

  if (!inquiry || inquiry.length === 0) {
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
          <Typography variant="h4" gutterBottom>
            문의 답변하기
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
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item xs={3}><Typography variant="subtitle1">등록일</Typography></Grid>
                  <Grid item xs={3}><Typography>{inquiry[0]?.created_at || '등록일 정보 없음'}</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle1">상태</Typography></Grid>
                  <Grid item xs={3}><Typography>{inquiry[0]?.is_answered || '상태 정보 없음'}</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle1">회원 아이디</Typography></Grid>
                  <Grid item xs={3}><Typography>{user_id || '회원 정보 없음'}</Typography></Grid>
                  <Grid item xs={3}><Typography variant="subtitle1">제목</Typography></Grid>
                  <Grid item xs={3}><Typography>{inquiry[0]?.question_title || '제목 정보 없음'}</Typography></Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    p: 2,
                    borderRadius: '4px',
                    mb: 2,
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>질문</Typography>
                  <Typography>{inquiry[0]?.question_content || '질문 정보 없음'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
  <Box
    sx={{
      border: '1px solid #ccc',
      p: 2,
      borderRadius: '4px',
      backgroundColor: '#fff',
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 1 }}>답변</Typography>
    <TextField
      fullWidth
      label="세부내용"
      value={answerContent}
      onChange={handleInputChange}
      multiline
      rows={10} // 기본 높이
      margin="normal"
      variant="outlined"
      disabled={!editable} // 수정 가능 여부 제어
      InputLabelProps={{ shrink: true }} // 라벨 항상 위로 고정
      sx={{
        '& .MuiInputBase-root': {
          alignItems: 'flex-start', // 텍스트를 위쪽 정렬
          height: 'auto', // 기본적으로 내용에 맞게 조정
          minHeight: '200px', // 최소 높이 보장
        },
        '& .MuiInputBase-input': {
          padding: '12px', // 입력창 내부 여백
        },
        '& .Mui-disabled': {
          backgroundColor: '#f9f9f9', // 비활성화 상태에서의 배경색
        },
      }}
    />
  </Box>
</Grid>


              <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                {editable ? (
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#000',
                      color: '#fff',
                      mr: 2,
                      '&:hover': { backgroundColor: '#333' },
                    }}
                    onClick={handleSaveOrUpdate}
                  >
                    {answer.length > 0 ? '수정' : '등록'}
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: '#000',
                      color: '#000',
                      '&:hover': { borderColor: '#333', color: '#333' },
                    }}
                    onClick={handleEdit}
                  >
                    수정
                  </Button>
                )}

                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#000',
                    color: '#000',
                    ml: 2,
                    '&:hover': { borderColor: '#333', color: '#333' },
                  }}
                  onClick={handleDeactivate}
                >
                  삭제
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#007bff',
                    color: '#fff',
                    ml: 2,
                    '&:hover': { backgroundColor: '#0056b3' },
                  }}
                  onClick={handleBackToList}
                >
                  확인
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </AppTheme>
              <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default Answer;
