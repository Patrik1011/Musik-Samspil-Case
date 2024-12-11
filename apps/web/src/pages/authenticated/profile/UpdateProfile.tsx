import { UpdateProfile } from "../../../components/authenticated/profile/update-profile";
import { Layout } from "../../unauthenticated/auth/Layout.tsx";

export const UpdateProfilePage: React.FC = () => {
  return (
    <Layout>
      <UpdateProfile />
    </Layout>
  );
};

export default UpdateProfilePage;
