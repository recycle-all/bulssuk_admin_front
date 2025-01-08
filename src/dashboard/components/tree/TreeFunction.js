import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Modal,
  TextField,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SideMenu from '../common/SideMenu';
import AppTheme from '../../../shared-theme/AppTheme';
import Copyright from '../../internals/components/Copyright';

const TreeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.primary,
  height: '200px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: '0.3s',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
  '& img': {
    width: '80px',
    height: '80px',
    marginBottom: theme.spacing(2),
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const TreeFunction = () => {
  const [functions, setFunctions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functionName, setFunctionName] = useState('');
  const [functionPoints, setFunctionPoints] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const fetchFunctions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_functions`);
      const data = await response.json();
      setFunctions(data);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  const handleOpenAdd = () => {
    setIsAdding(true);
    setFunctionName('');
    setFunctionPoints('');
    setNewImage(null);
    setPreviewImage('');
  };

  const handleOpenEdit = (func) => {
    setIsEditing(true);
    setSelectedFunction(func);
    setFunctionName(func.tree_manage);
    setFunctionPoints(func.manage_points);
    setPreviewImage(func.manage_img);
  };

  const handleClose = () => {
    setIsEditing(false);
    setIsAdding(false);
    setSelectedFunction(null);
    setFunctionName('');
    setFunctionPoints('');
    setNewImage(null);
    setPreviewImage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAdd = async () => {
    const admin_no = localStorage.getItem('admin_no');
    const formData = new FormData();
    formData.append('admin_no', admin_no);
    formData.append('tree_manage', functionName);
    formData.append('manage_points', functionPoints);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_function`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('기능이 성공적으로 추가되었습니다!');
        fetchFunctions();
        handleClose();
      } else {
        const data = await response.json();
        alert(`추가 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding function:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedFunction) return;
    const admin_no = localStorage.getItem('admin_no');
    const formData = new FormData();
    formData.append('tree_manage_no', selectedFunction.tree_manage_no);
    formData.append('admin_no', admin_no);
    formData.append('tree_manage', functionName);
    formData.append('manage_points', functionPoints);

    if (newImage) {
      formData.append('image', newImage);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
  }
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_function`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('기능이 성공적으로 수정되었습니다!');
        fetchFunctions();
        handleClose();
      } else {
        const data = await response.json();
        alert(`수정 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating function:', error);
    }
  };

  const handleDeactivate = async () => {
    if (!selectedFunction) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_function`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tree_manage_no: selectedFunction.tree_manage_no }),
      });

      if (response.ok) {
        alert('기능이 비활성화되었습니다!');
        fetchFunctions();
        handleClose();
      } else {
        const data = await response.json();
        alert(`비활성화 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deactivating function:', error);
    }
  };

  return (
    <>
    <AppTheme>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            나무 키우기 관리
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenAdd}>
              기능 추가
            </Button>
          </Box>
          <Grid container spacing={2} justifyContent="flex-start">
  {functions.map((func) => (
    <Grid item key={func.tree_manage_no} xs={12} sm={2} md={2}>
      <TreeCard onClick={() => handleOpenEdit(func)}>
        <img src={func.manage_img} alt={func.tree_manage} />
        <Typography variant="h6">{func.tree_manage}</Typography>
      </TreeCard>
    </Grid>
  ))}
</Grid>

          {isAdding && (
            <Modal open={isAdding} onClose={handleClose}>
              <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                  기능 추가
                </Typography>
                <TextField
                  label="기능 이름"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="기능 포인트"
                  value={functionPoints}
                  onChange={(e) => setFunctionPoints(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: '100px', height: 'auto', marginBottom: '8px' }}
                    />
                  )}
                  <Button variant="contained" component="label">
                    이미지 업로드
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
                </Box>
                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                  <Button variant="outlined" onClick={handleClose}>
                    취소
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleAdd}>
                    추가
                  </Button>
                </Stack>
              </Box>
            </Modal>
          )}

          {selectedFunction && (
            <Modal open={isEditing} onClose={handleClose}>
              <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                  기능 수정
                </Typography>
                <TextField
                  label="기능 이름"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="기능 포인트"
                  value={functionPoints}
                  onChange={(e) => setFunctionPoints(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{ maxWidth: '100px', height: 'auto', marginBottom: '8px' }}
                    />
                  )}
                  <Button variant="contained" component="label">
                    이미지 업로드
                    <input type="file" hidden onChange={handleImageChange} />
                  </Button>
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
          )}
        </Box>
      </Box>
    </AppTheme>
              <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default TreeFunction;
