import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Divider,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserPhotos({ setTopBarContext }) {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);

  // State quản lý nội dung ô nhập comment cho từng bức ảnh (dùng _id của ảnh làm key)
  const [newComments, setNewComments] = useState({});

  // 1. Tách riêng hàm fetch data để có thể tái sử dụng
  const fetchPhotos = async () => {
    try {
      const [userRes, photosRes] = await Promise.all([
        fetchModel(`/user/${userId}`),
        fetchModel(`/photosOfUser/${userId}`),
      ]);
      setPhotos(photosRes.data);
      setTopBarContext(
        `Photos of ${userRes.data.first_name} ${userRes.data.last_name}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, setTopBarContext]);

  // 2. Hàm xử lý gửi comment
  const handleAddComment = async (photoId) => {
    const commentText = newComments[photoId];

    // Chặn nếu comment rỗng
    if (!commentText || commentText.trim() === "") return;

    try {
      // Gọi API POST comment
      await fetchModel(`/commentsOfPhoto/${photoId}`, "POST", {
        comment: commentText,
      });

      // Xóa chữ trong ô input của bức ảnh đó sau khi gửi thành công
      setNewComments((prev) => ({ ...prev, [photoId]: "" }));

      // Load lại danh sách ảnh để comment mới hiện lên NGAY LẬP TỨC
      fetchPhotos();
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      alert("Không thể thêm bình luận lúc này.");
    }
  };

  if (photos.length === 0) return <Typography>Loading...</Typography>;

  return (
    <div>
      {photos.map((photo) => (
        <Card key={photo._id} style={{ marginBottom: "30px" }}>
          <CardHeader
            title={`Photo created: ${new Date(
              photo.date_time
            ).toLocaleString()}`}
          />
          <CardMedia
            component="img"
            image={`https://y9c4tj-8081.csb.app/images/${photo.file_name}`}
            alt="User photo"
          />
          <CardContent>
            {/* Hiển thị danh sách comment cũ */}
            {photo.comments &&
              photo.comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <Link
                      to={`/users/${comment.user._id}`}
                      style={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    : {comment.comment}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(comment.date_time).toLocaleString()}
                  </Typography>
                </Box>
              ))}

            <Divider sx={{ my: 2 }} />

            {/* Giao diện thêm comment mới */}
            <Box display="flex" gap={1} alignItems="flex-start">
              <TextField
                label="Add a comment..."
                variant="outlined"
                size="small"
                fullWidth
                multiline
                maxRows={3}
                value={newComments[photo._id] || ""}
                onChange={(e) =>
                  setNewComments({
                    ...newComments,
                    [photo._id]: e.target.value,
                  })
                }
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleAddComment(photo._id)}
                disabled={
                  !newComments[photo._id] ||
                  newComments[photo._id].trim() === ""
                }
                sx={{ mt: 0.5 }}
              >
                Post
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
