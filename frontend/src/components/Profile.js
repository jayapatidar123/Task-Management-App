import React from 'react';

const Profile = ({ profileData }) => {
  if (!profileData) {
    return <div>Loading profile...</div>; // Or a more appropriate loading indicator
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {profileData.username}</p> 
        <p><strong>Email:</strong> {profileData.email}</p>
        {/* Display other profile details as needed */}
        {/* Example: */}
        {/* <p><strong>Email:</strong> {profileData.email}</p> */}
      </div>
    </div>
  );
};

export default Profile;
