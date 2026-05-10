import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import thêm hook điều hướng
import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

function TopBar({ context, currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetchModel("/admin/logout", "POST", {});
    } catch (error) {
      console.error("Lỗi đăng xuất phía server:", error);
    } finally {
      setCurrentUser(null);
      navigate("/login-register"); // Đăng xuất xong thì đá về trang login
    }
  };

  // 1. Hàm kích hoạt khi người dùng bấm nút Upload
  const handleUploadButtonClicked = (e) => {
    e.preventDefault();
    // Giả lập cú click chuột vào cái ô input file đang bị ẩn
    document.getElementById("photo-upload-input").click();
  };

  // 2. Hàm xử lý file sau khi người dùng chọn xong
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Nếu người dùng ấn cancel, không làm gì cả

    // Đóng gói file vào FormData
    const formData = new FormData();
    formData.append("uploadedphoto", file);

    try {
      // Dùng fetch thuần (không dùng fetchModel) để trình duyệt tự nhận diện FormData
      const response = await fetch("https://y9c4tj-8081.csb.app/photos/new", {
        method: "POST",
        body: formData,
        credentials: "include",
        // LƯU Ý: Tuyệt đối không set "Content-Type" ở đây. Trình duyệt sẽ tự động thêm boundary cho multipart/form-data.
      });

      if (!response.ok) {
        throw new Error("Lỗi khi upload ảnh");
      }

      alert("Upload ảnh thành công!");

      // Chuyển hướng người dùng thẳng về trang chứa ảnh của chính họ để xem tác phẩm
      navigate(`/photos/${currentUser._id}`);

      // Reset lại input file để có thể upload ảnh cùng tên ở lần sau
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      alert("Đã xảy ra lỗi khi tải ảnh lên.");
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" color="inherit">
            Phan Thanh Binh
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={3}>
          <Typography variant="h6" color="inherit" fontWeight="regular">
            {context}
          </Typography>

          {currentUser ? (
            <Box display="flex" alignItems="center" gap={2}>
              {/* Thẻ input ẩn dùng để chọn file */}
              <input
                type="file"
                accept="image/*"
                id="photo-upload-input"
                hidden
                onChange={handlePhotoUpload}
              />

              {/* Nút Upload hiển thị cho người dùng */}
              <Button
                variant="contained"
                color="success"
                onClick={handleUploadButtonClicked}
                size="small"
              >
                Upload Photo
              </Button>

              <Typography variant="subtitle1" fontWeight="bold">
                Hi {currentUser.first_name}
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                size="small"
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Typography variant="subtitle1" color="white"></Typography>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
