import React, {useState} from "react";
import { Col, Row } from "react-bootstrap";
import { useQuery } from 'react-query'
import { FaCaretDown, FaCaretRight, FaPencilAlt } from 'react-icons/fa'

// Component
import Loading from "../Loading";
import UpdateProfileModal from "../../components/modals/UpdateProfileModal";

// Other
import noAvatar from "../../images/noavatar.png";
import { IMG_PATH } from "../../utils/const";
import { API } from '../../config/api'


const MyProfile = () => {
    const [showUpdateProfil, setShowUpdateProfile] = useState(false);
    const [isGettingProfile, setIsGettingProfile] = useState(true);
    const [showProfile, setShowProfile] = useState(true);

    let { data: user, refetch: refetchUser } = useQuery("user", async () => {
        const res = await API.get("/user-info");
        setIsGettingProfile(false);
        return res.data.data;
      });

  return (
    <Row>
      {isGettingProfile ? (
        <Loading />
      ) : (
        <>
          {showUpdateProfil && (
            <UpdateProfileModal
              show={showUpdateProfil}
              closeModal={() => setShowUpdateProfile(false)}
              user={user}
              refetch={refetchUser}
            />
          )}
          <>
            <Row sm={11}>
              <Col>
                <img
                  className="rounded-4 object-fit-none img-fluid"
                  height={120}
                  width={120}
                  src={
                    user?.profile.photo === ""
                      ? noAvatar
                      : IMG_PATH + user.profile.photo
                  }
                  alt={user?.profile.photo}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="ms-1 fs-5 fw-bold d-flex align-items-center">
                  {showProfile ? (
                    <FaCaretDown
                      role={"button"}
                      onClick={() => setShowProfile(!showProfile)}
                    />
                  ) : (
                    <FaCaretRight
                      role={"button"}
                      onClick={() => setShowProfile(!showProfile)}
                    />
                  )}
                  <label htmlFor="">Profile</label>
                  <FaPencilAlt
                    onClick={() => setShowUpdateProfile(true)}
                    role={"button"}
                    title={"Edit Profile"}
                    className="ms-3 text-secondary"
                    size={"0.8em"}
                  />
                </p>
                {showProfile && (
                  <>
                    <Row className="mb-2">
                      <Col className="text-secondary">Fullname</Col>
                      <Col className="text-black fw-semibold">
                        : {user?.name}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col className="text-secondary">Email</Col>
                      <Col className="text-black fw-semibold">
                        : {user?.email}
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col className="text-secondary">Phone</Col>
                      <Col className="text-black fw-semibold">
                        : {user?.profile.phone}
                      </Col>
                    </Row>
                  </>
                )}
              </Col>
            </Row>
          </>
        </>
      )}
    </Row>
  );
};

export default MyProfile;
