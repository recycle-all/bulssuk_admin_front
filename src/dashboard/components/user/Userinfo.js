import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, Stack, Typography, Paper, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import SideMenu from '../common/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';

const Userinfo = () => {
  const { user_no } = useParams();
  const [user, setUser] = useState(null);
  const [points, setPoints] = useState([]); // 전체 포인트 데이터 상태
  const [point, setPoint] = useState(0); // 특정 user_no에 해당하는 포인트
  const navigate = useNavigate();
  const { state } = useLocation(); // state에서 포인트 데이터 가져오기

  // X 버튼 클릭 시 /usercheck로 이동
  const handleClose = () => {
    navigate('/usercheck');
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 가져오기
        const userResponse = await fetch(`http://localhost:8000/user/${user_no}`);
        const userData = await userResponse.json();
        setUser(userData); // Assuming data is an array with one user object

        // 포인트 정보 가져오기
        const pointsResponse = await fetch('http://localhost:8000/point');
        const pointsData = await pointsResponse.json();
        setPoints(pointsData); // 전체 포인트 데이터를 저장

        // 특정 user_no에 해당하는 포인트 찾기
        const userPoint = pointsData.find((p) => p.user_no === Number(user_no));
        setPoint(userPoint ? userPoint.point_total : 0); // 매칭되지 않으면 0
      } catch (error) {
        console.log('Error fetching user or point data:', error);
      }
    };

    

    fetchData();
  }, [user_no]);

  if (!user) {
    return <div className="flex h-screen justify-center items-center">Loading...</div>;
  }


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
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          })}
        >

          <Paper
            elevation={3}
            sx={{
              p: 4,
              position: 'relative',
              maxWidth: '800px',
              width: '100%',
              borderRadius: 2,
            }}
          >
            {/* X 버튼 */}
            <Button
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#757575',
                fontSize: '1.5rem',
                minWidth: '32px',
                '&:hover': {
                  color: '#424242',
                },
              }}
            >
              &times;
            </Button>

            <Typography variant="h4" component="h1" align="center" fontWeight="bold" mb={4}>
              회원 상세정보 조회
            </Typography>

            {/* <Typography variant="h5" component="h2" align="center" fontWeight="600" mb={4}>
              상세정보 조회
            </Typography> */}

            <Stack spacing={3}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">아이디</Typography>
                <Typography variant="h6">{user.user_id}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">회원명</Typography>
                <Typography variant="h6">{user.user_name}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">이메일</Typography>
                <Typography variant="h6">{user.user_email}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">가입 일자</Typography>
                <Typography variant="h6">{user.created_at.slice(0, 10)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">보유 포인트</Typography>
                <Typography variant="h6">{point}포인트</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">출석률</Typography>
                <Typography variant="h6">90%</Typography>
              </Box>
              {/* <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="500">전화번호</Typography>
                <Typography variant="h6">{user.users_phone}</Typography>
              </Box> */}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Userinfo;
