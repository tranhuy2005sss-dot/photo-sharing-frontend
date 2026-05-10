import React, { useState, useEffect } from "react";
import { Typography, Button, TextField, Paper, Box, Grid, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function LoginRegister({ setCurrentUser, setTopBarContext }) {
  const navigate = useNavigate();

  // === STATES CHO ĐĂNG NHẬP ===
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // === STATES CHO ĐĂNG KÝ ===
  const [regUser, setRegUser] = useState({
    login_name: "",
    password: "",
    passwordConfirm: "",
    first_name: "",
    last_name: "",
    location: "",
    description: "",
    occupation: ""
  });
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  useEffect(() => {
    setTopBarContext("Vui lòng đăng nhập"); 
  }, [setTopBarContext]);

  // === XỬ LÝ ĐĂNG NHẬP ===
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetchModel("/admin/login", "POST", { 
        login_name: loginName,
        password: loginPassword // Gửi kèm password
      });
      
      setCurrentUser(response.data);
      setLoginError("");
      navigate(`/users/${response.data._id}`);
    } catch (error) {
      setLoginError("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
  };

  // === XỬ LÝ ĐĂNG KÝ ===
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (regUser.password !== regUser.passwordConfirm) {
      setRegError("Mật khẩu xác nhận không khớp!");
      setRegSuccess("");
      return;
    }

    try {
      // Tách passwordConfirm ra, chỉ gửi những field cần thiết lên server
      const { passwordConfirm, ...payload } = regUser;
      
      await fetchModel("/user", "POST", payload);
      
      setRegSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay bên trái.");
      setRegError("");
      
      // Xóa trắng form đăng ký sau khi thành công
      setRegUser({
        login_name: "", password: "", passwordConfirm: "",
        first_name: "", last_name: "", location: "", description: "", occupation: ""
      });
    } catch (error) {
      setRegError("Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.");
      setRegSuccess("");
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 900, margin: "0 auto", marginTop: 4 }}>
      <Grid container spacing={4}>
        
        {/* CỘT TRÁI: FORM ĐĂNG NHẬP */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            Đăng nhập
          </Typography>
          <form onSubmit={handleLogin}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Tên đăng nhập"
                variant="outlined"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
              <TextField
                label="Mật khẩu"
                type="password"
                variant="outlined"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              {loginError && <Typography color="error" variant="body2">{loginError}</Typography>}
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Đăng nhập
              </Button>
            </Box>
          </form>
        </Grid>

        {/* ĐƯỜNG KẺ CHIA ĐÔI */}
        <Grid item xs={12} md={2} display="flex" justifyContent="center">
          <Divider orientation="vertical" flexItem>HOẶC</Divider>
        </Grid>

        {/* CỘT PHẢI: FORM ĐĂNG KÝ */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
            Tạo tài khoản mới
          </Typography>
          <form onSubmit={handleRegister}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label="Tên đăng nhập *" name="login_name" value={regUser.login_name} onChange={handleRegisterChange} required size="small" />
              <TextField label="Tên (First Name) *" name="first_name" value={regUser.first_name} onChange={handleRegisterChange} required size="small" />
              <TextField label="Họ (Last Name) *" name="last_name" value={regUser.last_name} onChange={handleRegisterChange} required size="small" />
              <TextField label="Mật khẩu *" name="password" type="password" value={regUser.password} onChange={handleRegisterChange} required size="small" />
              <TextField label="Xác nhận mật khẩu *" name="passwordConfirm" type="password" value={regUser.passwordConfirm} onChange={handleRegisterChange} required size="small" />
              
              <Divider sx={{ my: 1 }} />
              
              <TextField label="Vị trí (Location)" name="location" value={regUser.location} onChange={handleRegisterChange} size="small" />
              <TextField label="Nghề nghiệp (Occupation)" name="occupation" value={regUser.occupation} onChange={handleRegisterChange} size="small" />
              <TextField label="Mô tả (Description)" name="description" value={regUser.description} onChange={handleRegisterChange} multiline rows={2} size="small" />

              {regError && <Typography color="error" variant="body2">{regError}</Typography>}
              {regSuccess && <Typography color="success.main" variant="body2" fontWeight="bold">{regSuccess}</Typography>}

              <Button type="submit" variant="contained" color="success" fullWidth>
                Đăng ký
              </Button>
            </Box>
          </form>
        </Grid>

      </Grid>
    </Paper>
  );
}

export default LoginRegister;