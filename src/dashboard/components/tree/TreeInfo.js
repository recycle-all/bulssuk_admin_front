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
import Copyright from '../../internals/components/Copyright';

const TreeCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  height: '250px',
  width: '250px',
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
    width: '100px',
    height: '100px',
    marginBottom: theme.spacing(2),
  },
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw',
  maxHeight: '90vh',
  height: '55vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function TreeInfo() {
  const [trees, setTrees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTree, setSelectedTree] = useState(null);
  const [treeName, setTreeName] = useState('');
  const [treeContent, setTreeContent] = useState('');
  const [treeLevel, setTreeLevel] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const fetchAllTrees = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_trees`);
      const data = await response.json();
      setTrees(data);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  useEffect(() => {
    fetchAllTrees();
  }, []);

  const handleOpenAdd = () => {
    setIsAdding(true);
    setTreeName('');
    setTreeContent('');
    setTreeLevel('');
    setNewImage(null);
    setPreviewImage('');
  };

  const handleOpenEdit = (tree) => {
    setIsEditing(true);
    setSelectedTree(tree);
    setTreeName(tree.tree_info);
    setTreeContent(tree.tree_content);
    setTreeLevel(tree.tree_level);
    setPreviewImage(tree.tree_img);
  };

  const handleClose = () => {
    setIsAdding(false);
    setIsEditing(false);
    setSelectedTree(null);
    setTreeName('');
    setTreeContent('');
    setTreeLevel('');
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

  // 나무 새로 등록 
  const handleAdd = async () => {
    const admin_no = localStorage.getItem('admin_no');
    if (!admin_no) {
      alert('관리자 번호가 없습니다. 다시 로그인하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('admin_no', admin_no);
    formData.append('tree_info', treeName);
    formData.append('tree_content', treeContent);
    formData.append('tree_level', treeLevel);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_tree`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('나무가 성공적으로 추가되었습니다!');
        fetchAllTrees();
        handleClose();
      } else {
        const data = await response.json();
        alert(`추가 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding tree:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTree) return;
    const admin_no = localStorage.getItem('admin_no');
    const formData = new FormData();
    formData.append('tree_info_no', selectedTree.tree_info_no);
    formData.append('admin_no', admin_no);
    formData.append('tree_info', treeName);
    formData.append('tree_content', treeContent);
    formData.append('tree_level', treeLevel);
    if (newImage) {
      formData.append('image', newImage);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_tree`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('나무 정보가 성공적으로 수정되었습니다!');
        fetchAllTrees();
        handleClose();
      } else {
        const data = await response.json();
        alert(`수정 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating tree:', error);
    }
  };

  // 수정 모달 내에 삭제 버튼 추가 및 삭제 핸들러 구현
const handleDeactivate = async () => {
    if (!selectedTree) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_tree`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tree_info_no: selectedTree.tree_info_no }),
      });
  
      if (response.ok) {
        alert('나무가 비활성화되었습니다.');
        fetchAllTrees(); // 최신 나무 정보 가져오기
        handleClose(); // 모달 닫기
      } else {
        const data = await response.json();
        alert(`삭제 실패: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deactivating tree:', error);
      alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            나무 키우기 관리
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleOpenAdd}>
              나무 추가
            </Button>
          </Box>
          <Grid container spacing={4} justifyContent="flex-start">
  {trees.map((tree) => (
    <Grid item key={tree.tree_info_no} xs={12} sm={6} md={2.4}>
      <TreeCard onClick={() => handleOpenEdit(tree)}>
        <img src={tree.tree_img} alt={tree.tree_info} />
        <Typography variant="h6">{tree.tree_info}</Typography>
        <Typography variant="body2">{tree.tree_content}</Typography>
      </TreeCard>
    </Grid>
  ))}
</Grid>


          {/* 추가 모달 */}
          <Modal open={isAdding} onClose={handleClose}>
            <Box sx={modalStyle}>
              <Typography variant="h6" mb={2}>
                나무 추가
              </Typography>
              <TextField
                label="나무 이름"
                value={treeName}
                onChange={(e) => setTreeName(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="나무 세부내용"
                value={treeContent}
                onChange={(e) => setTreeContent(e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="나무 레벨"
                value={treeLevel}
                onChange={(e) => setTreeLevel(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '10px' }}
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
     
          {selectedTree && (
  <Modal open={isEditing} onClose={handleClose}>
    <Box sx={modalStyle}>
      <Typography variant="h6" mb={2}>
        나무 수정
      </Typography>
      <TextField
        label="나무 이름"
        value={treeName}
        onChange={(e) => setTreeName(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="나무 세부내용"
        value={treeContent}
        onChange={(e) => setTreeContent(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="나무 레벨"
        value={treeLevel}
        onChange={(e) => setTreeLevel(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box display="flex" flexDirection="column" alignItems="center" mt={5} mb={5}>
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
}
