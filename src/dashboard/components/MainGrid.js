import * as React from 'react';
import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DataGrid } from '@mui/x-data-grid';

export default function MainGrid() {
  const [countUser, setCountUser] = useState('')
  const [notAnsweredInquiries, setNotAnsweredInquiries] = useState('')
  const [events, setEvents] = useState([])
  const [thisMonthEvents, setThisMonthEvents] = useState('')
  const [inquiries, setInquiries] = useState([]); // 문의 데이터 상태 추가
// 고객 수 세기
const fetchCountUser = async () =>{
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/count_users`)
    const data = await response.json()
    setCountUser(data)
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

const fetchInquiries = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_inquiries`);
    const data = await response.json();

    // 필터링: "답변 대기" 상태만 가져오기
    const filteredData = data
      .filter((item) => item.is_answered === '답변 대기')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 최신순 정렬
      .slice(0, 8); // 최대 10개 가져오기

    console.log('Filtered inquiries:', filteredData); // 필터링된 데이터 확인
    setInquiries(
      filteredData.map((item, index) => ({
        id: index + 1,
        question_no: item.question_no,
        question_title: item.question_title,
        user_no: item.user_no,
        created_at: item.created_at.slice(0, 10), // 날짜 형식 변경
        is_answered: item.is_answered,
      }))
    );
  } catch (error) {
    console.error('Error fetching inquiries:', error);
  }
};

// 이번 달 이벤트 개수 가져오기
const fetchThisMonthEvents = async() =>{
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/this_month_events`)
    const data = await response.json()
    setThisMonthEvents(data)
  } catch (error) {
    console.error('Error fetching this month events:', error);
  }
}
const fetchEvents = async (year, month) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/custom_day/${year}/${month}`);
    const data = await response.json();
    const formattedEvents = data.map((event) => ({
      title: event.calendar_name,
      start: event.calendar_date,
    }));
    setEvents(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
  useEffect(() => {
    fetchCountUser();
    fetchInquiries()
    fetchThisMonthEvents()
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    fetchEvents(currentYear, currentMonth);
  }, []);

  const handleMonthChange = (info) => {
    const newDate = new Date(info.view.currentStart);
    const newYear = newDate.getFullYear().toString();
    const newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');
  
    fetchEvents(newYear, newMonth); // 새로운 연도와 월로 이벤트 가져오기
  };
  const data = [
    {
      title: '고객 수',
      value: countUser,
      interval: 'Last 30 days',
      trend: 'up',
      data: [
        200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
        360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
      ],
    },
    {
      title: '대기중 문의',
      value: notAnsweredInquiries,
      interval: 'Last 30 days',
      trend: 'down',
      data: [
        1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
        780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
      ],
    },
    {
      title: '이번 달 행사',
      value: thisMonthEvents,
      interval: 'Last 30 days',
      trend: 'neutral',
      data: [
        500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
        520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
      ],
    },
  ];
  // DataGrid의 columns 정의
  const columns = [
    { field: 'id', headerName: 'No', width: 90 },
    { field: 'question_title', headerName: '문의 제목', flex: 1 },
    // { field: 'user_no', headerName: '회원 번호', flex: 1 },
    { field: 'created_at', headerName: '날짜', flex: 1 },
    {
      field: 'is_answered',
      headerName: '상태',
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: params.value === '답변 완료' ? 'green' : 'red' }}>
          {params.value}
        </span>
      ),
    },
  ];
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
      {/* FullCalendar 추가 */}
      <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Calendar
  </Typography>
  <FullCalendar
  plugins={[dayGridPlugin]}
  initialView="dayGridMonth"
  events={events}
  datesSet={handleMonthChange} // 월 변경 이벤트
  height="auto"
/>
</Box>

        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* 문의 리스트 표시 */}
          <Box sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          문의
        </Typography>
        <DataGrid
          rows={inquiries}
          columns={columns} // columns를 여기서 참조
          pageSize={5}
          autoHeight
          sx={{
            '& .MuiDataGrid-row': {
              borderBottom: '1px solid #ccc',
            },
          }}
        />
      </Box>
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        {/* Details */}
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          {/* <CustomizedDataGrid /> */}
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            {/* <CustomizedTreeView /> */}
            {/* <ChartUserByCountry /> */}
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
