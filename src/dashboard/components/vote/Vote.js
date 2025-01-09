import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { alpha } from "@mui/material/styles";
import AppTheme from "../../../shared-theme/AppTheme"; // AppTheme 컴포넌트 import
import SideMenu from "../common/SideMenu"; // 사이드 메뉴 import
import Copyright from "../../internals/components/Copyright";

// 결과 한글 변환을 위한 매핑
const translationMap = {
  plastic: "플라스틱",
  metal: "메탈",
  glass: "유리",
};

const Vote = () => {
  const [votes, setVotes] = useState([]);
  const [selectedVote, setSelectedVote] = useState(null); // 선택된 투표 데이터를 저장
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태

  // 투표 데이터를 가져오는 함수
  const fetchAllVotes = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/all_votes`);
      const data = await response.json();

      if (response.ok) {
        setVotes(data); // 성공적으로 데이터를 가져오면 votes 상태 업데이트
      } else {
        console.log("Error fetching votes:", data.error);
        setVotes([]); // 오류 발생 시 빈 배열로 초기화
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
      setVotes([]); // 네트워크 오류 시 빈 배열로 초기화
    }
  };

  // 컴포넌트가 마운트될 때 데이터 가져오기
  useEffect(() => {
    fetchAllVotes();
  }, []);

  // 모달 열기
  const openModal = (vote) => {
    setSelectedVote(vote); // 선택된 투표 데이터 설정
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedVote(null);
    setIsModalOpen(false);
  };

  // 반려하기
  const rejectVote = async () => {
    if (!selectedVote) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_DOMAIN}/update_vote`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote_no: selectedVote.vote_no }),
      });
  
      if (response.ok) {
        console.log("Vote rejected successfully");
        fetchAllVotes(); // 데이터를 새로고침하여 변경사항 반영
        closeModal();
      } else {
        console.error("Error rejecting vote");
      }
    } catch (error) {
      console.error("Error rejecting vote:", error);
    }
  };
  return (
    <>
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* 사이드 메뉴 */}
        <SideMenu />
        {/* 본문 영역 */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
            p: 3,
          })}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            투표 관리
          </Typography>
          {/* 투표 리스트 */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)", // 한 줄에 4개씩 표시
              gap: "20px",
            }}
          >
{votes.map((vote, index) => (
    <Box
      key={index}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "center",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // 호버 시 그림자 효과
        },
      }}
      onClick={() => openModal(vote)} // 클릭 시 모달 열기
    >
      <Box
        sx={{
          width: "150px", // 정사각형으로 만들기 위해 고정된 너비와 높이 설정
          height: "150px",
          margin: "0 auto", // 가운데 정렬
          overflow: "hidden", // 넘치는 이미지 잘라내기
          borderRadius: "8px", // 둥근 테두리
        }}
      >
        <img
          src={vote.img_url}
          alt={translationMap[vote.vote_result] || "이미지"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }} // 정사각형 내부에 꽉 차도록
        />
      </Box>
      <Typography variant="body1" sx={{ mt: 1 }}>
        {translationMap[vote.vote_result]}
      </Typography>
    </Box>
  ))}
</Box>

          {/* 모달 */}
          <Modal open={isModalOpen} onClose={closeModal}>
          <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "20%",
      bgcolor: "white", // 배경색을 하얀색으로 설정
      boxShadow: 24,
      p: 4,
      borderRadius: "12px", // 둥근 테두리
      display: "flex",
      flexDirection: "column", // 세로 정렬
      alignItems: "center", // 중앙 정렬
      gap: 3, // 요소 간 간격
    }}
  >
{selectedVote && (
  <>
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{ textAlign: "center", mb: 3 }}
    >
      투표 관리
    </Typography>

    {/* 이미지 영역 */}
    <Box
      sx={{
        width: "80%",
        aspectRatio: "1 / 1",
        overflow: "hidden",
        borderRadius: "8px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img
        src={selectedVote.img_url}
        alt="투표 이미지"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </Box>

    {/* 진행 상황 */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
        width: "100%",
        mt: 1,
      }}
    >
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: "normal",
        }}
      >
        유리: {selectedVote.vote_count.glass}
      </Typography>
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: "normal",
        }}
      >
        메탈: {selectedVote.vote_count.metal}
      </Typography>
      <Typography
        sx={{
          fontSize: "17px",
          fontWeight: "normal",
        }}
      >
        플라스틱: {selectedVote.vote_count.plastic}
      </Typography>
    </Box>

    <Typography
      variant="h6"
      sx={{
        fontSize: "19px",
        fontWeight: "bold",
        mt: 2,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      결과:
      <Typography
        component="span"
        sx={{
          fontSize: "19px",
          fontWeight: "bold",
          color: "blue",
        }}
      >
        {translationMap[selectedVote.vote_result]}
      </Typography>
    </Typography>

    {/* 버튼들 */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // 버튼 가운데 정렬
        gap: 2, // 버튼 간 간격
        mt: 3,
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        onClick={rejectVote}
      >
        반려
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={closeModal}
      >
        확인
      </Button>
    </Box>
  </>
)}
  </Box>
</Modal>


        </Box>
      </Box>
    </AppTheme>
              <Copyright sx={{ my: 4 }} />
    </>
  );
};

export default Vote;
