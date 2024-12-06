import { Button } from "../../Button.tsx";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const navigate = useNavigate();

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  return <Button title="Update Profile" onClick={handleUpdateProfile} />;
};
