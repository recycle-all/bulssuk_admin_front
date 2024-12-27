import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/common/AppNavbar';
import Header from './components/common/Header';
import MainGrid from './components/MainGrid';
import SideMenu from './components/common/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import { AdminProvider } from './context/AdminContext';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props) {
  const location = useLocation();
  
  // location.state로부터 값을 가져오고, 없으면 로컬 스토리지에서 가져오기
  const admin_name = location.state?.admin_name || localStorage.getItem('admin_name') || 'Guest';
  const admin_no = location.state?.admin_no || localStorage.getItem('admin_no') || null;
  const admin_email = location.state?.admin_email || localStorage.getItem('admin_email') || 'guest@example.com';

  return (
    <AdminProvider admin_name={admin_name} admin_no={admin_no} admin_email={admin_email}>
      <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu />
          <AppNavbar />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              <MainGrid />
            </Stack>
          </Box>
        </Box>
      </AppTheme>
    </AdminProvider>
  );
}
