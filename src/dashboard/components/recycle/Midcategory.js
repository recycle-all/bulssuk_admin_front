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
import Header from '../common/Header';
import Copyright from '../../internals/components/Copyright';

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  height: '180px',
  width: '180px',
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
    width: '50px',
    height: '50px',
    marginBottom: theme.spacing(2),
  },
}));

const SubcategoryItem = styled(Paper)(({ theme }) => ({
  width: '130px',
  height: '130px',
  padding: '8px',
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.grey[200], 0.5),
  color: theme.palette.text.primary,
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: theme.spacing(0.5),
  cursor: 'pointer',
}));

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40vw', // 모달 너비를 좁게 설정
  maxHeight: '90vh', // 최대 높이 설정
  height: '80vh', // 세로 크기를 늘림
  overflowY: 'auto', // 내용이 넘치면 스크롤바 표시
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

export default function Midcategory() {
  const [midCategories, setMidCategories] = useState([]);
  const [bigCategories, setBigCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [guideContent, setGuideContent] = useState('');
  const [newGuideImage, setNewGuideImage] = useState(null);
  const [guideImage, setGuideImage] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newGuideContent, setNewGuideContent] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
// 중분류 가져오기 
  const getCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/mid_category`);
      const data = await response.json();
      setMidCategories(data);
      // console.log(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
// 대분류 가져오기
const fetchCategories = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/big_category`);
    const data = await response.json();

    // status=true인 데이터만 필터링
    const filteredData = data.filter((category) => category.status === true);
    setBigCategories(filteredData);

  } catch (error) {
    console.error('Error fetching big categories:', error);
  }
};


  useEffect(() => {
    fetchCategories();
    getCategories();
  }, []);

  // 삭제 함수 추가
const handleDeactivate = async () => {
  if (!selectedSubcategory) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/deactivate_subcategory/${selectedSubcategory.subcategory_no}`, {
      method: 'PUT',
    });

    if (response.ok) {
      alert('Subcategory and related guides set to Inactive successfully!');
      setOpen(false);
      getCategories(); // 최신 데이터 불러오기
      setSelectedCategoryId(''); // 대분류 선택 초기화
      setNewCategoryName(''); // 중분류 이름 초기화
      setNewGuideContent(''); // 세부내용 초기화
      setGuideContent(''); // 세부내용 초기화
      setNewCategoryImage(null); // 이미지 초기화
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (error) {
    console.error('Error deactivating subcategory:', error);
  }
};

  // 등록 모달 열고 닫기
  const handleRegisterOpen = () => setRegisterOpen(true);
  const handleRegisterClose = () => {
    setRegisterOpen(false);
    setSelectedCategoryId(''); // 대분류 선택 초기화
    setNewCategoryName(''); // 중분류 이름 초기화
    setNewGuideContent(''); // 세부내용 초기화
    setGuideContent(''); // 세부내용 초기화
    setNewCategoryImage(null); // 이미지 초기화
  };
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
    }
  };
  // 새로 등록 함수
 // 새 중분류 등록 함수
// 새 중분류 등록 함수
const handleRegister = async () => {
  const formData = new FormData();

  // 필요한 데이터 추가
  formData.append('admin_no', localStorage.getItem('admin_no')); // 로컬 스토리지에서 admin_no 가져오기
  formData.append('category_no', selectedCategoryId);
  formData.append('subcategory_name', newCategoryName);
  console.log(guideContent);
  formData.append('guide_content', guideContent);

  if (newCategoryImage) {
    formData.append('guide_img', newCategoryImage); // 이미지 추가
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/create_mid_category`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log(formData)
      alert('새 중분류가 등록되었습니다!');
      setRegisterOpen(false); // 모달 닫기
      setSelectedCategoryId(''); // 대분류 선택 초기화
      setNewCategoryName(''); // 중분류 이름 초기화
      setNewGuideContent(''); // 세부내용 초기화
      setGuideContent(''); // 세부내용 초기화
      setNewCategoryImage(null); // 이미지 초기화
      getCategories(); // 등록 후 최신 데이터 가져오기
    } else {
      const data = await response.json();
      alert(data.error);
    }
  } catch (error) {
    console.error('Error registering new subcategory:', error);
  }
};




  // 모달 열기
// 모달 열기
const handleOpen = async (subcategory) => {
  setSelectedSubcategory(subcategory);
  setNewSubcategoryName(subcategory.subcategory_name);

  try {
    // 백엔드에서 guide_content와 guide_image를 가져오는 API 호출
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/guide/${subcategory.subcategory_no}`);
    const data = await response.json();

    if (response.ok) {
      setGuideContent(data.guide_content || '');
      setGuideImage(data.guide_img || null); // guide_image 설정
      console.log(guideImage);
    } else {
      console.error('Failed to fetch guide content:', data.error);
      setGuideContent('');
      setGuideImage(null);
    }
  } catch (error) {
    console.error('Error fetching guide content:', error);
    setGuideContent('');
    setGuideImage(null);
  }

  setOpen(true);
};

  

  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
    setGuideContent(''); // 세부내용 초기화
    setNewCategoryImage(null); // 이미지 초기화
    setSelectedCategoryId(''); // 대분류 선택 초기화
    setNewCategoryName(''); // 중분류 이름 초기화
  };

// 이미지 변경 처리
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setNewGuideImage(file);
    setGuideImage(URL.createObjectURL(file)); // 선택한 이미지의 미리보기 URL 생성
  }
};
// 업데이트 함수
const handleUpdate = async () => {
  const formData = new FormData();
  formData.append('subcategory_no', selectedSubcategory.subcategory_no);
  formData.append('subcategory_name', newSubcategoryName);
  formData.append('guide_content', guideContent);
    console.log(formData);
  if (newGuideImage) {
    formData.append('guide_img', newGuideImage);
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_mid_category`, {
      method: 'PUT',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      alert('Subcategory and guide updated successfully!');
      setOpen(false);
      window.location.reload();
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error updating subcategory and guide:', error);
  }
};


  // 카테고리 그룹화
// 카테고리 그룹화 로직 수정
const groupedCategories = bigCategories.reduce((acc, bigCategory) => {
  // 대분류 데이터 초기화
  acc[bigCategory.category_no] = {
    category_name: bigCategory.category_name,
    category_img: bigCategory.category_img,
    subcategories: midCategories
      .filter((mid) => mid.category_no === bigCategory.category_no) // 중분류 매핑
      .map((mid) => ({
        subcategory_no: mid.subcategory_no,
        subcategory_name: mid.subcategory_name,
      })),
  };
  return acc;
}, {});

return (
  <AppTheme>
    <CssBaseline enableColorScheme />
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <SideMenu />
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            중분류 관리
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button variant="contained" color="primary" onClick={handleRegisterOpen}>
              등록
            </Button>
          </Box>

          <Grid container spacing={4}>
            {Object.entries(groupedCategories).map(([categoryId, category]) => (
              <Grid container item key={categoryId} alignItems="center">
                {/* 대분류 */}
                <Grid item xs={2} sx={{ ml: 2 }}> {/* xs 값을 줄이고 왼쪽 여백 조정 */}
                  <CategoryCard>
                    <img src={category.category_img} alt={category.category_name} />
                    <Typography variant="h6">{category.category_name}</Typography>
                  </CategoryCard>
                </Grid>
                {/* 소분류 */}
                <Grid item xs={9} sx={{ ml: -2 }}> {/* ml 값을 0으로 조정 */}
                <Box display="flex" flexWrap="wrap" gap={1}> {/* gap 값을 작게 설정 */}
                    {category.subcategories.map((subcategory) => (
                      <SubcategoryItem
                        key={subcategory.subcategory_no}
                        onClick={() => handleOpen(subcategory)}
                      >
                        {subcategory.subcategory_name}
                      </SubcategoryItem>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* 중분류 수정 모달 */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            중분류 수정
          </Typography>

          {/* 카테고리 이름 표시 */}
          <Typography variant="subtitle1" mb={1}>
            대분류: {selectedSubcategory?.category_name}
          </Typography>

          {/* 중분류 이름 수정 */}
          <TextField
            label="중분류 이름"
            value={newSubcategoryName}
            onChange={(e) => setNewSubcategoryName(e.target.value)}
            fullWidth
            margin="normal"
          />

          {/* 기존 이미지 미리 보기 */}
          <Box mb={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
            {guideImage && (
              <img
                src={guideImage}
                alt="Guide"
                style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
              />
            )}
            <Button variant="contained" component="label" fullWidth>
              이미지 수정
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Box>

          {/* 세부내용 수정 */}
          <TextField
            fullWidth
            label="세부내용"
            value={guideContent}
            onChange={(e) => setGuideContent(e.target.value)}
            multiline
            rows={12}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
                height: 'auto',
              },
              '& .MuiInputBase-input': {
                padding: '8px',
              },
            }}
          />

          {/* 버튼 그룹: 삭제, 취소, 수정 */}
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

      {/* 새로운 항목 추가 모달 */}
      <Modal open={registerOpen} onClose={handleRegisterClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            새 중분류 등록
          </Typography>

          {/* 대분류 선택 */}
          <TextField
            select
            label="대분류 선택"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            fullWidth
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            {bigCategories.map((category) => (
              <option key={category.category_no} value={category.category_no}>
                {category.category_name}
              </option>
            ))}
          </TextField>

          {/* 중분류 이름 입력 */}
          <TextField
  label="중분류 이름"
  value={newCategoryName}
  onChange={(e) => setNewCategoryName(e.target.value)}
  fullWidth
  margin="normal"
  InputProps={{
    sx: {
      '& .MuiInputBase-input': {
        paddingBottom: '30px', // 내부 여백 설정
      },
    },
  }}
/>

          {/* 이미지 미리보기 */}
          {newCategoryImage && (
            <Box mb={2} display="flex" flexDirection="column" alignItems="center" gap={2}>
              <img
                src={URL.createObjectURL(newCategoryImage)}
                alt="New Guide"
                style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }}
              />
            </Box>
          )}

          {/* 이미지 업로드 버튼 */}
          <Button variant="contained" component="label" fullWidth sx={{ mb: 2 }}>
            이미지 업로드
            <input type="file" hidden onChange={handleNewImageChange} />
          </Button>

          {/* 세부내용 입력 */}
          <TextField
            fullWidth
            label="세부내용"
            value={guideContent}
            onChange={(e) => setGuideContent(e.target.value)}
            multiline
            rows={12}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiInputBase-root': {
                alignItems: 'flex-start',
                height: 'auto',
              },
              '& .MuiInputBase-input': {
                padding: '8px',
              },
            }}
          />

          {/* 등록 및 취소 버튼 */}
          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
            <Button variant="outlined" onClick={handleRegisterClose}>
              취소
            </Button>
            <Button variant="contained" color="primary" onClick={handleRegister}>
              등록
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Copyright sx={{ mt: 'auto' }} />
    </Box>
  </AppTheme>
);

}