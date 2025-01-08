import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Button,
  Modal,
  TextField,
  Stack,
  Typography,
} from '@mui/material';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../../shared-theme/AppTheme';
import SideMenu from '../common/SideMenu';
import Header from '../common/Header';
import Copyright from '../../internals/components/Copyright';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [filteredCoupons, setFilteredCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [adminNo, setAdminNo] = useState(null); // 로컬스토리지에서 admin_no 가져오기
  const [formData, setFormData] = useState({
    coupon_name: '',
    coupon_type: '',
    coupon_quantity: '',
    expiration_date: '',
    admin_no: '',
  });
  const [previewImage, setPreviewImage] = useState(null);

  // 로컬스토리지에서 admin_no 가져오기
  useEffect(() => {
    const storedAdminNo = localStorage.getItem('admin_no');
    if (storedAdminNo) {
      setAdminNo(storedAdminNo);
    }
  }, []);

  // 쿠폰 데이터 가져오기
  const getAllCoupons = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/coupons`);
      const data = await response.json();
  
      // 날짜 변환 후 상태에 저장
      const formattedData = data.map((coupon) => ({
        ...coupon,
        expiration_date: coupon.expiration_date.split('T')[0], // T 이전 부분만 추출 (년-월-일)
      }));
  
      setCoupons(formattedData);
      setFilteredCoupons(formattedData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  // 수정 모달 열기
  const handleOpen = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      coupon_name: coupon.coupon_name,
      coupon_type: coupon.coupon_type,
      coupon_quantity: coupon.coupon_quantity,
      expiration_date: coupon.expiration_date.split('T')[0], // 날짜 변환
      admin_no: adminNo,
    });
    setPreviewImage(coupon.coupon_img);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedCoupon(null);
    setPreviewImage(null);
  };

  // 등록 모달 열기
  const handleRegisterOpen = () => {
    setFormData({
      coupon_name: '',
      coupon_type: '',
      coupon_quantity: '',
      expiration_date: '',
      admin_no: adminNo,
      image: null, // 이미지 필드 초기화
    });
    setPreviewImage(null); // 미리보기 초기화
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  // 입력 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 이미지 변경 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file }); // formData에 이미지 추가
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 이미지 설정
    }
  };
  

  // 수정 요청 함수
  const handleUpdate = async () => {
    if (!selectedCoupon || !adminNo) {
      alert('admin_no가 설정되지 않았습니다.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('coupon_no', selectedCoupon.coupon_no);
    formDataToSend.append('coupon_name', formData.coupon_name);
    formDataToSend.append('coupon_type', formData.coupon_type);
    formDataToSend.append('coupon_quantity', formData.coupon_quantity);
    formDataToSend.append('expiration_date', formData.expiration_date);
    formDataToSend.append('admin_no', adminNo);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_coupon`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('쿠폰 정보가 수정되었습니다!');
        setOpen(false);
        getAllCoupons(); // 목록 갱신
      } else {
        const errorData = await response.json();
        alert(errorData.message || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating coupon:', error);
    }
  };

  // 쿠폰 등록 함수
  const handleCreateCoupon = async () => {
    const formDataToSend = new FormData();
    console.log(formData)
    formDataToSend.append('coupon_name', formData.coupon_name);
    formDataToSend.append('coupon_type', formData.coupon_type);
    formDataToSend.append('coupon_quantity', formData.coupon_quantity);
    formDataToSend.append('expiration_date', formData.expiration_date);
    formDataToSend.append('admin_no', adminNo);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      console.log(formDataToSend)
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_coupon`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('쿠폰이 등록되었습니다!');
        setRegisterOpen(false);
        getAllCoupons(); // 목록 갱신
      } else {
        const errorData = await response.json();
        alert(errorData.message || '등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  // DataGrid 컬럼 정의
  const columns = [
    { field: 'coupon_no', headerName: 'No', width: 90 },
    { field: 'coupon_name', headerName: '쿠폰 이름', flex: 1 },
    { field: 'coupon_type', headerName: '쿠폰 타입', flex: 1 },
    { field: 'expiration_date', headerName: '만료 날짜', flex: 1 },
    { field: 'coupon_quantity', headerName: '쿠폰 재고', flex: 1},
    // {
    //   field: 'status',
    //   headerName: '상태',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <span style={{ color: params.value ? 'green' : 'red' }}>
    //       {params.value ? '활성' : '비활성'}
    //     </span>
    //   ),
    // },
    {
      field: 'actions',
      headerName: '상세보기',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => handleOpen(params.row)}
        >
          확인
        </Button>
      ),
    },
  ];

  // 쿠폰 삭제(비활성화) 함수 
  const handleDelete = async () =>{
    if (!selectedCoupon) return
    
    const confirmDelete = window.confirm('정말로 이 쿠폰을 삭제하시겠습니까?')
    if (!confirmDelete) return

    try {
      console.log(selectedCoupon);
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_coupon`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({coupon_no: selectedCoupon.coupon_no})
      })

      if (response.ok){
        alert('쿠폰이 성공적으로 삭제되었습니다.')
        setOpen(false)
        getAllCoupons()
      }
      else {
        const data = await response.json()
        alert(data.message || '쿠폰 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('서버 오류가 발생했습니다.');
    }

  }

  return (
    <>
    <AppTheme>
    <CssBaseline enableColorScheme />
    <Box
  sx={{
    display: 'flex',
    height: '100vh',
    overflowY: 'auto', // 세로 스크롤 허용
    overflowX: 'hidden', // 가로 스크롤 방지
  }}
>
      <SideMenu />
      <Box component="main" sx={{ flexGrow: 1, p: 4,  maxWidth: 'calc(100vw - 240px)', // 화면 너비에서 사이드바 너비를 뺌, overflowX: 'hidden',
           overflowX: 'hidden', // 가로 스크롤 제거
       }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          쿠폰 관리
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleRegisterOpen}>
            쿠폰 등록
          </Button>
        </Box>
        <Box sx={{ flexGrow: 1, width: '100%' }}>
  <DataGrid
    rows={filteredCoupons}
    columns={columns}
    getRowId={(row) => row.coupon_no}
    pageSize={10}
    autoHeight // 데이터 그리드 높이를 자동으로 조정
  />
</Box>
  
          {/* 수정 모달 */}
          <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
              <h2>쿠폰 수정</h2>
              <TextField
                label="쿠폰 이름"
                name="coupon_name"
                value={formData.coupon_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="쿠폰 타입"
                name="coupon_type"
                value={formData.coupon_type}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            <FormControl fullWidth margin="normal">
  <InputLabel id="coupon-quantity-label">쿠폰 재고</InputLabel>
  <Select
    labelId="coupon-quantity-label"
    name="coupon_quantity"
    value={formData.coupon_quantity} // 기본값
    onChange={handleInputChange}
  >
        {Array.from({ length: 300 }, (_, i) => i ).map((quantity) => (
      <MenuItem key={quantity} value={quantity}>
        {quantity}
      </MenuItem>
    ))}
  </Select>
</FormControl>
              <TextField
                label="만료 날짜"
                name="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%' }} />}
              <Button component="label" fullWidth>
                이미지 업로드
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="contained" color='error' onClick={handleDelete}>
                  삭제
                </Button>
                <Button variant="outlined" onClick={handleClose}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleUpdate}>
                  수정
                </Button>
              </Stack>
            </Box>
          </Modal>

          {/* 등록 모달 */}
         {/* 등록 모달 */}
<Modal open={registerOpen} onClose={handleRegisterClose}>
  <Box sx={modalStyle}>
    <h2>쿠폰 등록</h2>
    <TextField
      label="쿠폰 이름"
      name="coupon_name"
      value={formData.coupon_name}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />
    <TextField
      label="쿠폰 타입"
      name="coupon_type"
      value={formData.coupon_type}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
    />
    <FormControl fullWidth margin="normal">
      <InputLabel id="coupon-quantity-label">쿠폰 재고</InputLabel>
      <Select
        labelId="coupon-quantity-label"
        name="coupon_quantity"
        value={formData.coupon_quantity}
        onChange={handleInputChange}
      >
        {Array.from({ length: 300 }, (_, i) => i ).map((quantity) => (
          <MenuItem key={quantity} value={quantity}>
            {quantity}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label="만료 날짜"
      name="expiration_date"
      type="date"
      value={formData.expiration_date}
      onChange={handleInputChange}
      fullWidth
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    {previewImage && (
      <Box mb={2} display="flex" justifyContent="center">
        <img
          src={previewImage}
          alt="Preview"
          style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
        />
      </Box>
    )}
    <Button component="label" fullWidth>
      이미지 업로드
      <input type="file" hidden onChange={handleImageChange} />
    </Button>
    <Stack direction="row" justifyContent="flex-end" spacing={2}>
      <Button variant="outlined" onClick={handleRegisterClose}>
        취소
      </Button>
      <Button variant="contained" onClick={handleCreateCoupon}>
        등록
      </Button>
    </Stack>
  </Box>
</Modal>
        </Box>
      </Box>
    </AppTheme>
              <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default Coupon;