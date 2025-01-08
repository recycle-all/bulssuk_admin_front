import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import AppTheme from '../../../shared-theme/AppTheme';
import { Box, CssBaseline, Button, Dialog, TextField, Typography } from '@mui/material';
import SideMenu from '../common/SideMenu';
import Header from '../common/Header'
import Copyright from '../../internals/components/Copyright';
const Calendar = () => {
  const [events, setEvents] = useState([]); // 이벤트 데이터
  const [monthImage, setMonthImage] = useState({ name: '기본 이미지', preview: '' });
  const [currentMonth, setCurrentMonth] = useState({ year: '2024', month: '12' }); // 기본 12월로 설정
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false); // 이미지 변경 다이얼로그 상태
  const [isRegisterImageDialogOpen, setIsRegisterImageDialogOpen] = useState(false); // 이미지 등록 다이얼로그 상태
  const [newMonthImage, setNewMonthImage] = useState(null); // 새 이미지 상태
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    calendar_name: '',
    calendar_date: '',
    calendar_content: '',
    calendar_img: null,
  });
  
  const handleOpenCreateDialog = () => setIsCreateDialogOpen(true);
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
    setNewEvent({
      calendar_name: '',
      calendar_date: '',
      calendar_content: '',
      calendar_img: null,
    });
  };
  const handleOpenChangeImageDialog = () => setIsChangeImageDialogOpen(true);
  const handleCloseChangeImageDialog = () => {
    setIsChangeImageDialogOpen(false);
    setNewMonthImage(null);
  };
  const handleOpenRegisterImageDialog = () => setIsRegisterImageDialogOpen(true);
  const handleCloseRegisterImageDialog = () => {
    setIsRegisterImageDialogOpen(false);
    setNewMonthImage(null);
  };


   // 월(Month) 커스텀 이미지 등록
const handleMonthImageRegister = async () => {
  if (!newMonthImage) {
    alert('이미지를 선택해주세요.');
    return;
  }

  const admin_no = localStorage.getItem('admin_no'); // 로컬 스토리지에서 admin_no 가져오기
  if (!admin_no) {
    alert('admin_no가 설정되지 않았습니다. 로그인 상태를 확인해주세요.');
    return;
  }

  const formData = new FormData();
  formData.append('custom_month', currentMonth.month); // 현재 월
  formData.append('image', newMonthImage); // 새 이미지 파일
  formData.append('admin_no', admin_no); // admin_no 추가
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value); // 모든 key-value를 출력
  }
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/custom_month`, {
      method: 'POST',
      body: formData,
    });


    const data = await response.json();
    console.log(data)
    if (response.ok) {
      alert('이미지가 성공적으로 등록되었습니다.');
      fetchCustomMonthData(currentMonth.month); // 등록된 이미지 갱신
      handleCloseRegisterImageDialog();
    } else {
      alert(data.message || '이미지 등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('Error registering month image:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

  // 월(Month) 커스텀 이미지 변경 
  const handleMonthImageChange = async () => {
    if (!newMonthImage) {
      alert('이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('custom_month', currentMonth.month); // 현재 월
    formData.append('image', newMonthImage); // 새 이미지 파일

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/change_month_image`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('이미지가 성공적으로 변경되었습니다.');
        fetchCustomMonthData(currentMonth.month); // 변경된 이미지 갱신
        handleCloseChangeImageDialog();
      } else {
        alert(data.message || '이미지 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error changing month image:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };


  // 월 데이터를 가져오는 함수
  const fetchCustomMonthData = async (customMonth) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/custom_month/${customMonth}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '데이터를 가져오는데 실패했습니다.');
      }
  
      if (data.length > 0) {
        console.log('서버에서 가져온 데이터:', data)
        setMonthImage({ name: data[0].custom_img, preview: `${data[0].custom_img}` });
      } else {
        setMonthImage({ name: '데이터 없음', preview: '' });
      }
    } catch (error) {
      console.error('Error fetching custom month data:', error.message);
    }
  };

  // 일 데이터를 가져오는 함수
  const fetchCustomDayData = async (year, month) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/custom_day/${year}/${month}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || '데이터를 가져오는데 실패했습니다.');
      }
  
      // 이벤트가 없으면 빈 배열로 설정
      setEvents(data.length > 0 ? data : []);
      console.log('서버에서 가져온 데이터:', data);
    } catch (error) {
      console.error('Error fetching custom day data:', error.message);
      setEvents([]); // 오류 발생 시에도 빈 배열로 초기화
    }
  };
  

  // FullCalendar의 월 변경 이벤트 핸들러
  const handleMonthChange = (info) => {
    const newDate = new Date(info.view.currentStart);
    const newYear = newDate.getFullYear().toString();
    const newMonth = (newDate.getMonth() + 1).toString().padStart(2, '0');

    setCurrentMonth({ year: newYear, month: newMonth });
    fetchCustomMonthData(newMonth); // 새로운 월 데이터 가져오기
    fetchCustomDayData(newYear, newMonth); // 새로운 일 데이터 가져오기
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    console.log(selectedEvent);
    setIsDialogOpen(true);
  };

  const handleEventUpdate = (updatedEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const { year, month } = currentMonth;
    fetchCustomMonthData(month); // 컴포넌트 로드 시 월 데이터 가져오기
    fetchCustomDayData(year, month); // 컴포넌트 로드 시 일 데이터 가져오기
  }, [currentMonth]);
// 일(Day) 이벤트 수정 함수 
const handleDayUpdate = async () => {
  if (!selectedEvent) {
    alert('수정할 이벤트가 선택되지 않았습니다.');
    return;
  }

  const formData = new FormData();
  formData.append('manage_calendar_no', selectedEvent.manage_calendar_no);
  formData.append('calendar_name', selectedEvent.calendar_name);
  formData.append('calendar_date', selectedEvent.calendar_date);
  formData.append('calendar_content', selectedEvent.calendar_content);

  if (selectedEvent.newImage) {
    formData.append('image', selectedEvent.newImage);
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/change_day`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      alert('이벤트가 성공적으로 수정되었습니다.');
      fetchCustomDayData(currentMonth.year, currentMonth.month); // 수정된 데이터 갱신
      setIsDialogOpen(false);
    } else {
      alert(data.message || '이벤트 수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('이벤트 수정 중 오류 발생:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

// 새로운 이벤트 등록 함수
const handleCreateEvent = async () => {
  const admin_no = localStorage.getItem('admin_no'); // 로컬 스토리지에서 admin_no를 가져옴
  const formData = new FormData();
  formData.append('admin_no', admin_no);
  formData.append('calendar_name', newEvent.calendar_name);
  formData.append('calendar_date', newEvent.calendar_date);
  formData.append('calendar_content', newEvent.calendar_content);
  if (newEvent.calendar_img) {
    formData.append('image', newEvent.calendar_img);
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_day`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // 인증 토큰이 필요하다면 추가
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert('이벤트가 성공적으로 생성되었습니다.');
      fetchCustomDayData(currentMonth.year, currentMonth.month); // 새로운 이벤트를 포함하여 데이터 갱신
      handleCloseCreateDialog();
    } else {
      alert(data.message || '이벤트 생성에 실패했습니다.');
    }
  } catch (error) {
    console.error('이벤트 생성 중 오류 발생:', error);
    alert('서버 오류가 발생했습니다.');
  }
};

  const renderEventContent = (eventInfo) => {
    return (
      <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        whiteSpace: 'normal', // 줄바꿈 허용
        overflow: 'hidden', // 넘치는 내용 숨김
        textOverflow: 'ellipsis', // 말줄임 표시
      }}
    >
        {eventInfo.event.extendedProps.image && (
          <img
            src={eventInfo.event.extendedProps.image}
            alt={eventInfo.event.title}
            style={{
              width: '40px', // 이미지 너비
              height: '40px', // 이미지 높이
              marginBottom: '4px', // 이미지와 텍스트 간 간격
            }}
          />
        )}
        <Typography
          variant="body2"
          textAlign="center"
          style={{ fontSize: '13px', fontWeight: 'bold' }} // 텍스트를 굵게 설정
        >
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  };

  // 이벤트 (Day) 삭제 함수
  const handleEventDelete = async (manage_calendar_no) => {
    if (!window.confirm('정말로 이 이벤트를 삭제하시겠습니까?')) {
      return;
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_day`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ manage_calendar_no }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('이벤트가 성공적으로 삭제되었습니다.');
        fetchCustomDayData(currentMonth.year, currentMonth.month); // 삭제 후 데이터 갱신
      } else {
        alert(data.message || '이벤트 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('이벤트 삭제 중 오류 발생:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
     
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 4, padding: 2 }}>
          {/* FullCalendar */}
          <Box sx={{ flex: 1 }}>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events.map((event) => ({ title: event.calendar_name, start: event.calendar_date, image:event.calendar_img }))}
              datesSet={handleMonthChange} // FullCalendar 월 변경 이벤트
              eventContent={renderEventContent} // 커스터마이즈된 이벤트 렌더러
              eventTextColor="#1A1A3A" // #0000ff(파란색), #008080(초록색), #1A1A3A(네이비)
              eventBackgroundColor="transparent" // 배경색 제거
              eventBorderColor="transparent" // 테두리 제거
              height="auto" // 캘린더 높이를 자동으로 설정
            />

          </Box>

          {/* 월 커스텀 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom>
              {`${currentMonth.month}월 이미지 커스텀`}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 4 }}>
              {monthImage.preview ? (
                <>
                  <img src={monthImage.preview} alt={monthImage.name} style={{ width: 100, height: 100 }} />
                  <Typography>{monthImage.name.replace('/uploads/images/', '')}</Typography>
                  <Button variant="outlined" onClick={handleOpenChangeImageDialog}>
                    이미지 변경
                  </Button>
                </>
              ) : (
                <>
                  <Typography>이미지가 없습니다</Typography>
                  <Button variant="outlined" onClick={handleOpenRegisterImageDialog}>
                    이미지 등록
                  </Button>
                </>
              )}
            </Box>
              {/* 이미지 변경 다이얼로그 */}
        <Dialog open={isChangeImageDialogOpen} onClose={handleCloseChangeImageDialog}>
          <Box sx={{ padding: 3 }}>
            <Typography variant="h6" mb={2}>
              월 이미지 변경
            </Typography>
            <Button variant="contained" component="label" fullWidth>
              이미지 선택
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setNewMonthImage(e.target.files[0])}
              />
            </Button>
            {newMonthImage && (
              <Box mt={2}>
                <img
                  src={URL.createObjectURL(newMonthImage)}
                  alt="Preview"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
              <Button onClick={handleCloseChangeImageDialog}>취소</Button>
              <Button variant="contained" onClick={handleMonthImageChange}>
                저장
              </Button>
            </Box>
          </Box>
        </Dialog>
            {/* 일 커스텀 */}
        {/* Day 커스텀 */}
<Box
  sx={{
    display: 'flex',
    justifyContent: 'space-between', // 양쪽 끝으로 배치
    alignItems: 'center', // 수직 정렬
    marginBottom: 4,
  }}
>
  <Typography variant="h5" gutterBottom>
    Day 커스텀
  </Typography>
  <Button
    variant="contained"
    onClick={handleOpenCreateDialog}
    sx={{
      backgroundColor: '#007bff',
      color: '#fff',
      '&:hover': {
        backgroundColor: '#0056b3',
      },
    }}
  >
    이벤트 등록
  </Button>
</Box>
            <Box sx={{ marginBottom: 4 }}>
  {events.map((event) => (
    <Box key={event.calendar_date} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
  <Typography sx={{ fontSize: '20px' }}>{`${event.calendar_date.slice(0, 10)} | ${event.calendar_name}`}</Typography>
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button variant="outlined" onClick={() => handleEventClick(event)}>
      수정
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={() => handleEventDelete(event.manage_calendar_no)}
    >
      삭제
    </Button>
  </Box>
</Box>
  ))}
</Box>

          </Box>
        </Box>

        {/* 수정 모달 */}
<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
  {selectedEvent && (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h6" gutterBottom>
        이벤트 수정
      </Typography>

      {/* 이벤트 이름 수정 */}
      <TextField
        fullWidth
        label="이벤트 이름"
        value={selectedEvent.calendar_name}
        onChange={(e) => setSelectedEvent({ ...selectedEvent, calendar_name: e.target.value })}
        margin="normal"
      />

      {/* 이벤트 날짜 수정 */}
      <TextField
  fullWidth
  label="이벤트 날짜"
  type="date"
  value={selectedEvent.calendar_date ? selectedEvent.calendar_date.slice(0, 10) : ''} // 날짜 기본값 설정
  onChange={(e) => setSelectedEvent({ ...selectedEvent, calendar_date: e.target.value })}
  margin="normal"
/>

      {/* 이미지 미리보기 */}
      <Box mb={2} display="flex" flexDirection="column" alignItems="center">
        {/* 새로운 이미지 선택 시 미리보기 */}
        {selectedEvent.newImage ? (
          <img
            src={URL.createObjectURL(selectedEvent.newImage)}
            alt="New Preview"
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
          />
        ) : (
          /* 기존 이미지 미리보기 */
          <img
            src={selectedEvent.calendar_img}
            alt="Current Preview"
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
          />
        )}
      </Box>

      {/* 이미지 변경 버튼 */}
      <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
        이미지 변경
        <input
          type="file"
          hidden
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedEvent({ ...selectedEvent, newImage: file }); // 새 이미지 업데이트
            }
          }}
        />
      </Button>

      {/* 이벤트 세부내용 수정 */}
      <TextField
  fullWidth
  label="이벤트 세부내용"
  value={selectedEvent.calendar_content || ''} // 데이터가 없을 경우 빈 문자열
  onChange={(e) => setSelectedEvent({ ...selectedEvent, calendar_content: e.target.value })} // selectedEvent 상태 업데이트
  multiline
  rows={12} // 텍스트 박스 높이를 크게 설정
  margin="normal"
  variant="outlined"
  InputLabelProps={{ shrink: true }}
  sx={{
    '& .MuiInputBase-root': {
      alignItems: 'flex-start', // 텍스트를 위쪽 정렬
      height: 'auto', // 높이를 내용에 맞춤
    },
    '& .MuiInputBase-input': {
      padding: '8px', // 내부 패딩 조정
    },
  }}
/>
      {/* 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
        <Button onClick={() => setIsDialogOpen(false)}>취소</Button>
        <Button
          variant="contained"
          onClick={() => {
            handleDayUpdate();
            setIsDialogOpen(false);
          }}
        >
          저장
        </Button>
      </Box>
    </Box>
  )}
</Dialog>


<Dialog open={isCreateDialogOpen} onClose={handleCloseCreateDialog}>
  <Box sx={{ padding: 3 }}>
    <Typography variant="h6" gutterBottom>
      새로운 이벤트 등록
    </Typography>

    <TextField
      fullWidth
      label="이벤트 이름"
      value={newEvent.calendar_name}
      onChange={(e) => setNewEvent({ ...newEvent, calendar_name: e.target.value })}
      margin="normal"
    />

    <TextField
      fullWidth
      // label="이벤트 날짜"
      type="date"
      value={newEvent.calendar_date}
      onChange={(e) => setNewEvent({ ...newEvent, calendar_date: e.target.value })}
      margin="normal"
    />

<TextField
  fullWidth
  label="이벤트 세부내용"
  value={newEvent.calendar_content}
  onChange={(e) => setNewEvent({ ...newEvent, calendar_content: e.target.value })}
  margin="normal"
  multiline // 여러 줄 입력 가능
  rows={12} // 기본 높이 설정
  variant="outlined"
  InputLabelProps={{ shrink: true }} // 항상 위에 라벨 표시
  sx={{
    '& .MuiInputBase-root': {
      alignItems: 'flex-start', // 텍스트를 위쪽 정렬
      height: 'auto', // 높이를 내용에 맞춤
    },
    '& .MuiInputBase-input': {
      padding: '8px', // 내부 패딩 조정
    },
  }}
/>
    <Button variant="contained" component="label" sx={{ marginBottom: 2 }}>
      이미지 선택
      <input
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setNewEvent({ ...newEvent, calendar_img: file });
          }
        }}
      />
    </Button>

    {newEvent.calendar_img && (
      <Box mt={2}>
        <img
          src={URL.createObjectURL(newEvent.calendar_img)}
          alt="Preview"
          style={{ width: '100%', borderRadius: '8px' }}
        />
      </Box>
    )}

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
      <Button onClick={handleCloseCreateDialog}>취소</Button>
      <Button variant="contained" onClick={handleCreateEvent}>
        등록
      </Button>
    </Box>
  </Box>
</Dialog>

            {/* 이미지 등록 다이얼로그 */}
            <Dialog open={isRegisterImageDialogOpen} onClose={handleCloseRegisterImageDialog}>
              <Box sx={{ padding: 3 }}>
                <Typography variant="h6" mb={2}>
                  월 이미지 등록
                </Typography>
                <Button variant="contained" component="label" fullWidth>
                  이미지 선택
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setNewMonthImage(e.target.files[0])}
                  />
                </Button>
                {newMonthImage && (
                  <Box mt={2}>
                    <img
                      src={URL.createObjectURL(newMonthImage)}
                      alt="Preview"
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
                  <Button onClick={handleCloseRegisterImageDialog}>취소</Button>
                  <Button variant="contained" onClick={handleMonthImageRegister}>
                    저장
                  </Button>
                </Box>
              </Box>
            </Dialog>

      </Box>
    </AppTheme>
          <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default Calendar;
