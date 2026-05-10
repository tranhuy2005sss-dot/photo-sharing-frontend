import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserDetail({ setTopBarContext }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchModel(`user/${userId}`);
        setUser(response.data);
        setTopBarContext(`${response.data.first_name} ${response.data.last_name}`);
      } catch (error){
        console.log(error);
        throw error;
      }
    }

    loadData();
  }, [userId, setTopBarContext]);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Typography variant="h4">{user.first_name} {user.last_name}</Typography>
      <Typography variant="body1">Location: {user.location}</Typography>
      <Typography variant="body1">Description: {user.description}</Typography>
      <Typography variant="body1">Occupation: {user.occupation}</Typography>
      <Button variant="contained" component={Link} to={`/photos/${user._id}`}>
        View Photos
      </Button>
    </div>
  );
}

export default UserDetail;