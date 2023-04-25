import { useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useImmer } from "use-immer";
import { toast } from "react-toastify";

import Spinner from "../Spinner";
import { COMMENT, ORANGE, PURPLE, SELECTION } from "../../helpers/colors";
import { getContact, updateContact } from "../../services/contactService";
import { ContactContext } from "../../context/ContactContext";
import { contactSchema } from "../../validations/contactValidation";

const EditContact = () => {
  const navigate = useNavigate();
  const { contactId } = useParams();

  const { loading, setLoading, groups, setContacts, setFilteredContacts } =
    useContext(ContactContext);

  const [contact, setContact] = useImmer({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: contactData } = await getContact(contactId);

        setLoading(false);
        setContact(contactData);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitForm = async (values) => {
    try {
      setLoading(true);

      toast.info("مخاطب با موفقیت ویرایش شد");

      const { data, status } = await updateContact(values, contactId);

      if (status === 200) {
        setLoading(false);

        setContacts((draft) => {
          const contactIndex = draft.findIndex(
            (c) => c.id === parseInt(contactId)
          );
          draft[contactIndex] = { ...data };
        });
        setFilteredContacts((draft) => {
          const contactIndex = draft.findIndex(
            (c) => c.id === parseInt(contactId)
          );
          draft[contactIndex] = { ...data };
        });

        navigate("/contacts");
      }
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p
                    className="fw-bold h4"
                    style={{ color: ORANGE }}>
                    ویرایش مخاطب
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ borderRadius: "1rem", backgroundColor: SELECTION }}>
                <div className="col-md-8">
                  <Formik
                    initialValues={contact}
                    validationSchema={contactSchema}
                    onSubmit={(values) => {
                      submitForm(values);
                    }}>
                    <Form>
                      <div className="mb-2">
                        <Field
                          name="fullname"
                          type="text"
                          className="form-control"
                          placeholder="نام و نام خانوادگی"
                        />
                        <ErrorMessage
                          name="fullname"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="photo"
                          type="text"
                          className="form-control"
                          placeholder="ادرس تصویر"
                        />
                        <ErrorMessage
                          name="photo"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="mobile"
                          type="number"
                          className="form-control"
                          placeholder="شماره موبایل"
                        />
                        <ErrorMessage
                          name="mobile"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="آدرس ایمیل"
                        />
                        <ErrorMessage
                          name="email"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="job"
                          type="text"
                          className="form-control"
                          placeholder="شغل"
                        />
                        <ErrorMessage
                          name="job"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div>
                        <Field
                          name="group"
                          as="select"
                          className="form-control">
                          <option value="">انتخاب گروه</option>
                          {groups.length > 0 &&
                            groups.map((group) => (
                              <option
                                key={group.id}
                                value={group.id}>
                                {group.name}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="group"
                          render={(msg) => (
                            <div className="text-danger">{msg}</div>
                          )}
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          className="btn"
                          type="submit"
                          value="ویرایش مخاطب"
                          style={{ backgroundColor: PURPLE }}
                        />
                        <Link
                          className="btn mx-2"
                          to={"/contacts"}
                          style={{ backgroundColor: COMMENT }}>
                          انصراف
                        </Link>
                      </div>
                    </Form>
                  </Formik>
                </div>
                <div className="col-md-4">
                  <img
                    src={contact.photo}
                    alt={contact.fullname}
                    className="img-fluid rounded"
                    style={{ border: `1px solid ${PURPLE}` }}
                  />
                </div>
              </div>
              <div className="text-center mt-1">
                <img
                  src={require("../../assets/man-taking-note.png")}
                  alt=""
                  style={{ opacity: "60%" }}
                  height={"300px"}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EditContact;
