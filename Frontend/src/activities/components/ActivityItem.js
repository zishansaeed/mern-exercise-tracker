import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import { AuthContext } from "../../shared/context/auth-context";
import "./ActivityItem.css";

const ActivityItem = (props) => {
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = () => {
    setShowConfirmModal(false);
    console.log("DELETING...");
  };
  return (
    <React.Fragment>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="activity-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this activity? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>

      <li className="activity-item">
        <Card className="activity-item__content">
          <div className="activity-item__image">
            <img src={props.image} alt={props.title} />
          </div>

          <div className="activity-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
            <span>Time: {props.time}</span>
            <span>Date: {props.date}</span>
          </div>

          <div className="activity-item__actions">
            {auth.isLoggedIn && (
              <Button to={`/activities/${props.id}`}>EDIT</Button>
            )}

            {auth.isLoggedIn && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ActivityItem;
