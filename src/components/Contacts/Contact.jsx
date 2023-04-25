import { Link } from "react-router-dom";

import { CURRENTLINE, CYAN, ORANGE, PURPLE, RED } from "../../helpers/colors";

const Contact = ({contact, deleteContact}) => {
  return (
    <div className="col-md-6">
      <div className="card my-2" style={{ backgroundColor: CURRENTLINE }}>
        <div className="card-body">
          <div className="row d-flex align-items-center justify-content-around">
            <div className="col-sm-4 col-md-4">
              <img
                src={contact.photo}
                alt={contact.fullname}
                className="img-fluid rounded"
                style={{ border: `1px solid ${PURPLE}` }}
              />
            </div>
            <div className="col-sm-7 col-md-7">
              <ul className="list-group">
                <li className="list-group-item list-group-item-dark">
                  نام و نام خانوادگی: <span className="fw-bold">{contact.fullname}</span>
                </li>
                <li className="list-group-item list-group-item-dark">
                  شماره همراه: <span className="fw-bold">{contact.mobile}</span>
                </li>
                <li className="list-group-item list-group-item-dark">
                  آدرس ایمیل: <span className="fw-bold">{contact.email}</span>
                </li>
              </ul>
            </div>
            <div className="col-sm-1 col-md-1 d-flex flex-column align-items-center">
              <Link to={`/contacts/${contact.id}`} className="btn my-1" style={{ backgroundColor: ORANGE }}>
                <i className="fas fa-eye" />
              </Link>
              <Link to={`/contacts/edit/${contact.id}`} className="btn my-1" style={{ backgroundColor: CYAN }}>
                <i className="fas fa-pen" />
              </Link>
              <button onClick={deleteContact} className="btn my-1" style={{ backgroundColor: RED }}>
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
