import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Paper, Typography, Button, CssBaseline, Stack, Modal, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import SideMenu from '../common/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
  height: '100px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: '0.3s',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.1),
    boxShadow: theme.shadows[3],
  },
  '& img': {
    width: '40px',
    height: '40px',
    marginBottom: theme.spacing(1),
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,          // 기존 400에서 500으로 조정
  maxWidth: '90%',     // 화면이 너무 좁을 경우를 대비해 최대 너비 설정
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};


export default function BigCategory() {
  const [bigCategory, setBigCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);


    const getBigCategory = async () => {
      try {
        const response = await fetch('http://localhost:8000/big_category');
        const data = await response.json();
        setBigCategory(data);
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    };
    useEffect(() => {
    getBigCategory();
  }, []);
// 수정 모달창 띄우기 
  const handleOpen = (category) => {
    console.log('Selected category:', category);
    console.log('category_no:', category.category_no);
    setSelectedCategory(category);
    setNewCategoryName(category.category_name);
    setNewCategoryImage(null);
    setOpen(true);
  };
// 수정 모달창 닫기 
  const handleClose = () => setOpen(false);
// 수정 모달창에서 이미지 변경
  const handleImageChange = (e) => {
    setNewCategoryImage(e.target.files[0]);
  };
// 수정
  const handleUpdate = async () => {
    console.log('selectedCategory:', selectedCategory);
    console.log('newCategoryName:', newCategoryName);
    console.log('newCategoryImage:', newCategoryImage);
  
    const formData = new FormData();
 
    formData.append('category_no', selectedCategory.category_no);
    formData.append('category_name', newCategoryName);

  
    // 이미지가 선택되었을 때만 formData에 추가
    if (newCategoryImage) {
      formData.append('category_image', newCategoryImage);
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

  
    try {
      const response = await fetch('http://localhost:8000/update_big_category', {
        method: 'PUT',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Category updated successfully!');
        setOpen(false);
        window.location.reload();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

   // 삭제 (Inactive로 변경)
   const handleDeactivate = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`http://localhost:8000/deactivate_category/${selectedCategory.category_no}`, {
        method: 'PUT',
      });

      if (response.ok) {
        alert('Category deactivated successfully!');
        setOpen(false);
        getBigCategory();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (error) {
      console.error('Error deactivating category:', error);
    }
  };

// 등록 모달창 열기
  const handleOpenCreate = () => {
    setNewCategoryName('');
    setNewCategoryImage(null);
    setOpenCreate(true);
  };
// 등록 모달창 닫기  
  const handleCloseCreate = () => setOpenCreate(false);
// 등록 함수
const handleCreate = async () => {
  const formData = new FormData();
  formData.append('category_name', newCategoryName);
  if (newCategoryImage) {
    formData.append('category_image', newCategoryImage);
  }

  try {
    const response = await fetch('http://localhost:8000/create_big_category', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Category created successfully!');
      setOpenCreate(false);
      window.location.reload();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error creating category:', error);
  }
};

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
          p: 4,
          overflow: 'auto',
          position: 'relative',
        })}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            대분류 관리
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenCreate}>
            등록
          </Button>
        </Box>

        <Grid container spacing={3}>
          {bigCategory.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <CategoryCard elevation={2} onClick={() => handleOpen(category)}>
                <img src={category.category_img} alt={category.category_name} />
                <Typography variant="h6">{category.category_name}</Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* 수정 모달 */}
<Modal open={open} onClose={handleClose}>
  <Box sx={modalStyle}>
    <Typography variant="h6" mb={2}>대분류 수정</Typography>
    <TextField
      fullWidth
      label="대분류 이름"
      value={newCategoryName}
      onChange={(e) => setNewCategoryName(e.target.value)}
      margin="normal"
      InputLabelProps={{ shrink: true }}
    />
    <Box mb={2} display="flex" flexDirection="column" alignItems="center">
      {/* 이미지 미리보기 처리 */}
      {newCategoryImage ? (
        // 새로 업로드된 이미지 미리보기
        <img
          src={URL.createObjectURL(newCategoryImage)}
          alt="New Category"
          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
        />
      ) : (
        selectedCategory?.category_img && (
          // 기존 이미지 미리보기
          <img
            src={selectedCategory.category_img}
            alt="Current Category"
            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
          />
        )
      )}
    </Box>
    <Button variant="contained" component="label" fullWidth>
      이미지 수정
      <input type="file" hidden onChange={handleImageChange} />
    </Button>
    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
      <Button variant="contained" color="error" onClick={handleDeactivate}>삭제</Button>
      <Button variant="contained" onClick={handleClose}>취소</Button>
      <Button variant="contained" color="primary" onClick={handleUpdate}>수정</Button>
    </Stack>
  </Box>
</Modal>

        {/* 등록 모달 */}
        <Modal open={openCreate} onClose={handleCloseCreate}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>대분류 등록</Typography>
            <TextField
              fullWidth
              label="대분류 이름"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              margin="normal"
            />
     {/* 이미지 미리보기 */}
     {newCategoryImage && (
      <Box mb={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
        <img
          src={URL.createObjectURL(newCategoryImage)}
          alt="New Category"
          style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
        />
      </Box>
    )}

            <Button variant="contained" component="label" fullWidth>
              이미지 첨부
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {newCategoryImage && (
              <Typography variant="body2" mt={1}>
                {newCategoryImage.name}
              </Typography>
            )}
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
              <Button variant="outlined" onClick={handleCloseCreate}>취소</Button>
              <Button variant="contained" color="primary" onClick={handleCreate}>등록</Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  </AppTheme>
);


}
