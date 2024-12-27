import * as React from 'react';
import { useState, useEffect } from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { HomeRounded, PeopleRounded, AnalyticsRounded, AssignmentRounded, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const mainListItems = [
  { text: '홈', icon: <HomeRounded />, path: '/' },
  { text: '고객 관리', icon: <PeopleRounded />, path: '/usercheck' },
  { 
    text: '분리수거 관리', 
    icon: <AnalyticsRounded />, 
    subItems: [
      { text: '대분류 관리', path: '/bigcategory' },
      { text: '세부사항 관리', path: '/midcategory' },
    ]
  },
  { text: '달력 관리', icon: <AssignmentRounded />, path: '/calendar' },
  { 
    text: '기업 관리', 
    icon: <AssignmentRounded />,  
    subItems: [
      { text: '기업 관리', path: '/company' },
      { text: '상품 관리', path: '/company_product' }
    ]
  },
  { text: 'FAQ 관리', icon: <AssignmentRounded />, path: '/faq' },
  { text: '나무키우기 관리', icon: <AssignmentRounded />, path: '/tree_manage' }
];

export default function MenuContent() {
  const [openStates, setOpenStates] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 subcategory의 열림 상태를 초기화
  useEffect(() => {
    const initialOpenStates = {};
    mainListItems.forEach((item) => {
      if (item.subItems) {
        initialOpenStates[item.text] = item.subItems.some(subItem => location.pathname === subItem.path);
      }
    });
    setOpenStates(initialOpenStates);
  }, [location.pathname]);

  const handleToggle = (category) => {
    setOpenStates((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <List dense>
      {mainListItems.map((item, index) => (
        <div key={index}>
          {item.subItems ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleToggle(item.text)}
                  sx={{
                    backgroundColor: item.subItems.some(subItem => subItem.path === location.pathname) ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                  {openStates[item.text] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openStates[item.text]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItem key={subIndex} disablePadding sx={{ pl: 4 }}>
                      <ListItemButton
                        onClick={() => handleNavigate(subItem.path)}
                        sx={{
                          backgroundColor: location.pathname === subItem.path ? 'rgba(0, 0, 0, 0.12)' : 'transparent',
                          fontWeight: location.pathname === subItem.path ? 'bold' : 'normal',
                        }}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          )}
        </div>
      ))}
    </List>
  );
}
