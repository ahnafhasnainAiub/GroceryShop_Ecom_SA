import React from "react";
import FormContainer from "../../components/FormContainer";
import ProfileForm from "../../components/ProfileForm";
import Meta from "../../components/Meta";

const AdminProfilePage = () => {
  return (
    <FormContainer>
      <Meta title={"Admin Profile"} />
      <div style={{ marginTop: "1.5rem" }}>
        <h2 className="text-white text-lg-center mb-4">Admin Profile</h2>
        <ProfileForm />
      </div>
    </FormContainer>
  );
};

export default AdminProfilePage;
