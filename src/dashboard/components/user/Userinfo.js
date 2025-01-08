import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CssBaseline, Stack, Typography, Paper, Button, Divider } from '@mui/material';
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
  const location = useLocation();
  const { point_total, attendance_rate } = location.state || {};
  // X 버튼 클릭 시 /usercheck로 이동
  const handleClose = () => {
    navigate('/usercheck');
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 가져오기
        const userResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/user/${user_no}`);
        const userData = await userResponse.json();
        setUser(userData); // Assuming data is an array with one user object

        // 포인트 정보 가져오기
        const pointsResponse = await fetch(`${process.env.REACT_APP_DOMAIN}/point`);
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
    backgroundColor: '#f9f9f9', // 밝은 배경색
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // 부드러운 그림자
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

  <Typography
    variant="h4"
    component="h1"
    align="center"
    fontWeight="bold"
    mb={4}
    sx={{
      color: '#333',
      borderBottom: '2px solid #ddd',
      pb: 2,
    }}
  >
    회원 상세정보 조회
  </Typography>

  <Stack spacing={3}>
    {[
      { label: '아이디', value: user.user_id },
      { label: '회원명', value: user.user_name },
      { label: '이메일', value: user.user_email },
      { label: '가입 일자', value: user.created_at.slice(0, 10) },
      { label: '보유 포인트', value: `${point}포인트` },
      { label: '출석률', value:attendance_rate },
    ].map((item, index) => (
      <React.Fragment key={index}>
        <Box
          display="flex"
          justifyContent="space-between"
          sx={{
            backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#f5f5f5', // 홀수/짝수 행 배경색 변경
            px: 2,
            py: 1.5,
            borderRadius: '4px',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="500"
            sx={{ color: '#555', flex: 1 }}
          >
            {item.label}
          </Typography>
          <Typography
            variant="h6"
            align="right"
            sx={{ color: '#333', flex: 2 }}
          >
            {item.value}
          </Typography>
        </Box>
        {/* {index < 5 && <Divider sx={{ my: 1, borderColor: '#ddd' }} />} */}
      </React.Fragment>
    ))}
  </Stack>
</Paper>
        </Box>
      </Box>
    </AppTheme>
  );
};

export default Userinfo;
