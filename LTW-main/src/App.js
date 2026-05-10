import './App.css';

import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister"; // Import component mới

const App = (props) => {
  const [topBarContext, setTopBarContext] = useState("");
  // Thêm state để lưu thông tin người dùng đang đăng nhập
  const [currentUser, setCurrentUser] = useState(null); 

  return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Truyền currentUser và setCurrentUser lên TopBar để hiển thị lời chào và xử lý Logout */}
              <TopBar 
                context={topBarContext} 
                currentUser={currentUser} 
                setCurrentUser={setCurrentUser} 
              />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {/* Chỉ render UserList khi đã có người đăng nhập */}
                {currentUser ? <UserList /> : null}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  {/* Route đăng nhập không bị chặn */}
                  <Route
                      path="/login-register"
                      element={<LoginRegister setCurrentUser={setCurrentUser} setTopBarContext={setTopBarContext} />}
                  />
                  
                  {/* Các route được bảo vệ bằng toán tử ba ngôi (Ternary Operator) */}
                  <Route
                      path="/users/:userId"
                      element={ currentUser ? <UserDetail setTopBarContext={setTopBarContext} /> : <Navigate to="/login-register" replace /> }
                  />
                  <Route
                      path="/photos/:userId"
                      element={ currentUser ? <UserPhotos setTopBarContext={setTopBarContext} /> : <Navigate to="/login-register" replace /> }
                  />
                  <Route 
                      path="/users" 
                      element={ currentUser ? <UserList /> : <Navigate to="/login-register" replace /> } 
                  />
                  
                  {/* Route mặc định chuyển hướng tùy theo trạng thái */}
                  <Route 
                      path="/" 
                      element={ currentUser ? <Navigate to="/users" replace /> : <Navigate to="/login-register" replace /> } 
                  />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;