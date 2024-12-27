import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { useAdmin } from '../../context/AdminContext';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
    const { admin_name, admin_no, admin_email } = useAdmin(); // AdminContext에서 값 받기

  return (
    <Drawer
    variant="permanent"
    sx={{
      display: { xs: 'none', md: 'block' },
      [`& .${drawerClasses.paper}`]: {
        backgroundColor: 'background.paper',
        display: 'flex',           // Drawer 내부를 flex 컨테이너로 설정
        flexDirection: 'column',   // 세로 방향으로 배치
        justifyContent: 'space-between', // 상단과 하단으로 내용 분리
        height: '100%',            // Drawer 높이를 전체로 설정
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        mt: 'calc(var(--template-frame-height, 0px) + 4px)',
        p: 1.5,
      }}
    >
      <SelectContent />
    </Box>
    <Divider />
    <MenuContent />
    
    <Box sx={{ mt: 'auto' }}> {/* 하단 고정을 위해 mt: 'auto' 사용 */}
      <Divider />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {admin_name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {admin_email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Box>
  </Drawer>
  );
}
