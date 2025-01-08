import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CssBaseline,
  Button,
  Modal,
  TextField,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import SideMenu from '../common/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';
import Header from '../common/Header'
import Copyright from '../../internals/components/Copyright';
const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  height: '250px', // 카드의 높이
  width: '400px', // 카드의 너비 (넓게 설정)
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  borderRadius: '12px',
  height: 'auto', // 높이를 자동으로 설정
  cursor: 'pointer',
  transition: '0.3s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    boxShadow: theme.shadows[3],
  },
  '& img': {
    width: '180px', // 이미지 크기 고정
    height: '180px', // 이미지 크기 고정
    marginBottom: theme.spacing(2),
    borderRadius: '8px',
    objectFit: 'cover', // 이미지 비율 유지
  },
}));



const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function CompanyManagement() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [companyProducts, setCompanyProducts] = useState([]); // 기업 상품 리스트
  const [formData, setFormData] = useState({
    company_name: '',
    company_content: '',
    company_img: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

  // DB에 등록되어있는 모든 기업 정보 가져오기
  const getCompanies = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/companies`);
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  useEffect(() => {
    const fetchCompanyProducts = async () => {
      if (selectedCompany && selectedCompany.company_no) {
        try {
          const response = await fetch(`${process.env.REACT_APP_DOMAIN}/products/${selectedCompany.company_no}`);
          const data = await response.json();
  
          if (response.ok) {
            setCompanyProducts(data); // 성공적으로 데이터를 설정
          } else {
            console.error('Error fetching products:', data.error);
            setCompanyProducts([]); // 실패 시 비어 있는 배열로 설정
          }
        } catch (error) {
          console.error('Error fetching company products:', error);
          setCompanyProducts([]); // 오류 발생 시 비어 있는 배열로 설정
        }
      }
    };
  
    fetchCompanyProducts();
  }, [selectedCompany]);

  const handleOpen = (company) => {
    setFormData({
      company_name: company.company_name,
      company_content: company.company_content,
      company_img: company.company_img,
    });
    setPreviewImage(company.company_img);
    setOpen(true);
    setSelectedCompany(company)

  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompany(null);
    setPreviewImage(null);
  };

  const handleRegisterOpen = () => {
    setFormData({ company_name: '', company_content: '', company_img: null });
    setPreviewImage(null);
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, company_img: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 이미 등록되어 있는 기업 수정하기
  const handleUpdate = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('company_no', selectedCompany.company_no);
    formDataToSend.append('company_name', formData.company_name);
    formDataToSend.append('company_content', formData.company_content);
    if (formData.company_img) {
      formDataToSend.append('image', formData.company_img);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/change_company`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('기업 정보가 수정되었습니다!');
        setOpen(false);
        getCompanies();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

 // 새로운 기업 등록하기
  const handleCreateCompany = async () => {
    const formDataToSend = new FormData();
    const admin_no = localStorage.getItem('admin_no'); // 로컬 스토리지에서 가져오기
    formDataToSend.append('admin_no', admin_no);
    formDataToSend.append('company_name', formData.company_name);
    formDataToSend.append('company_content', formData.company_content);
    if (formData.company_img) {
      formDataToSend.append('image', formData.company_img);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_company`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        alert('새로운 기업이 등록되었습니다!');
        setRegisterOpen(false);
        getCompanies();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating company:', error);
    }
  };

  // 기업 삭제(비활성화)하기
  const handleDeactivate = async () => {
    if (!selectedCompany) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ company_no: selectedCompany.company_no }),
      });
  
      if (response.ok) {
        alert('기업이 성공적으로 삭제되었습니다.');
        setOpen(false);
        getCompanies(); // 데이터 새로고침
      } else {
        const data = await response.json();
        alert(data.message || '삭제 실패');
      }
    } catch (error) {
      console.error('Error deactivating company:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };
  console.log(companyProducts);
  return (
    <>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
          
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            기업 관리
          </Typography>
          <Box 
  sx={{
    display: 'flex',
    justifyContent: 'flex-end', // 오른쪽 끝으로 정렬
    mb: 3, // 아래 여백
  }}
>
  <Button 
    variant="contained" 
    color="primary" 
    onClick={handleRegisterOpen}
  >
    기업 등록
  </Button>
</Box>
          <Grid container spacing={3} justifyContent="flex-start" alignItems="stretch">
            {companies.map((company) => (
              <Grid item xs={12} sm={6} md={4} key={company.company_no} style={{ display: 'flex' }}>
                <CategoryCard onClick={() => handleOpen(company)}>
                  <img
                    src={company.company_img}
                    alt={company.company_name}
                  />
                  <Typography 
  variant="h6" 
  sx={{ fontSize: '24px' }} // 원하는 글자 크기 설정
>{company.company_name}</Typography>
                  <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 8, // 최대 3줄 표시
            WebkitBoxOrient: 'vertical',
          }}
        >
                    {company.company_content}
                  </Typography>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>

             {/* 수정 모달 */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              기업 수정
            </Typography>
            <TextField
  label="기업 이름"
  name="company_name"
  value={formData.company_name || ''} // 데이터가 없을 경우 빈 문자열
  onChange={handleInputChange}
  fullWidth
  margin="normal"
  variant="outlined"
  InputLabelProps={{
    shrink: true, // 라벨을 항상 위에 고정
  }}
  sx={{
    '& .MuiInputBase-root': {
      alignItems: 'center', // 텍스트 정렬
      height: 'auto', // 높이 자동 설정
    },
    '& .MuiInputBase-input': {
      padding: '8px', // 내부 여백
    },
  }}
/>
<TextField
  label="기업 세부내용"
  name="company_content"
  value={formData.company_content || ''} // 데이터가 없을 경우 빈 문자열
  onChange={handleInputChange}
  fullWidth
  multiline
  rows={5} // 입력창 크기를 5줄로 설정
  margin="normal"
  variant="outlined"
  InputLabelProps={{ shrink: true }} // 항상 위에 라벨 표시
  sx={{
    '& .MuiInputBase-root': {
      alignItems: 'flex-start', // 텍스트 위쪽 정렬
      height: 'auto', // 높이 자동 설정
    },
    '& .MuiInputBase-input': {
      padding: '8px', // 내부 여백
    },
  }}
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
            <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
              이미지 변경
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {/* 상품 리스트 */}
<Typography variant="h6" mb={2}>
  해당 기업의 상품 목록
</Typography>
<Box
  sx={{
    maxHeight: '200px', // 최대 높이 설정
    overflowY: 'auto', // 스크롤 활성화
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    p: 2,
  }}
>
  {companyProducts.length > 0 ? (
    companyProducts.map((product, index) => (
      <Box
        key={product.product_no}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
          p: 1,
          borderBottom: index < companyProducts.length - 1 ? '1px solid #e0e0e0' : 'none',
        }}
      >
        <Typography>{index + 1}. {product.product_name}</Typography>
        <Typography variant="body2" color="textSecondary">
          {product.product_content}
        </Typography>
      </Box>
    ))
  ) : (
    <Typography variant="body2" color="textSecondary">
      이 기업에 등록된 상품이 없습니다.
    </Typography>
  )}
</Box>
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
              <Button variant="contained" color="error" onClick={handleDeactivate}>
                삭제
              </Button>
              
              <Button variant="outlined" onClick={handleClose}>
                취소
              </Button>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                수정
              </Button>
            </Stack>
          </Box>
        </Modal>


          {/* 등록 모달 */}
          <Modal open={registerOpen} onClose={handleRegisterClose}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2}>
                기업 등록
              </Typography>
              <TextField
                label="기업 이름"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
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
              <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
                이미지 업로드
                <input type="file" hidden onChange={handleImageChange} />
              </Button>
              <TextField
                label="기업 세부내용"
                name="company_content"
                value={formData.company_content}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={5} // 입력창 크기를 5줄로 설정
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }} // 항상 위에 라벨 표시
                sx={{
                  '& .MuiInputBase-root': {
                    alignItems: 'flex-start', // 텍스트 위쪽 정렬
                    height: 'auto', // 높이 자동 설정
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px', // 내부 여백
                  },
                }}
              />
             
              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                <Button variant="outlined" onClick={handleRegisterClose}>
                  취소
                </Button>
                <Button variant="contained" color="primary" onClick={handleCreateCompany}>
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
}

