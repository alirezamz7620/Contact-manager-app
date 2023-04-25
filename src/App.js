import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { useImmer } from 'use-immer';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';

import { Navbar, Contacts, AddContact, ViewContact, EditContact } from './components';
import { createContact, deleteContact, getAllContacts, getAllGroups } from './services/contactService';
import { ContactContext } from './context/ContactContext';

import './App.css';
import { COMMENT, CURRENTLINE, FOREGROUND, PURPLE, YELLOW } from './helpers/colors';
// import { contactSchema } from './validations/contactValidation';

const App = () => {

  const [loading, setLoading] = useImmer(false);
  const [contacts, setContacts] = useImmer([]);
  const [filteredContacts, setFilteredContacts] = useImmer([]);
  const [groups, setGroups] = useImmer([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { data: contactsData } = await getAllContacts();
        const { data: groupsData } = await getAllGroups();

        setContacts(contactsData);
        setFilteredContacts(contactsData);
        setGroups(groupsData);

        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createContactForm = async (values) => {
    try {
      setLoading(draft => !draft);

      const { status, data } = await createContact(values);

      if (status === 201) {
        toast.success("مخاطب با موفقیت ساخته شد");
        setContacts(draft => {
          draft.push(data);
        })
        setFilteredContacts(draft => {
          draft.push(data);
        })

        setLoading((prevLoading) => !prevLoading);
        navigate("/contacts");
      }
    } catch (err) {
      console.log(err.message);
      setLoading((prevLoading) => !prevLoading);
    }
  }

  const confirmDelete = (contactId, contactFullname) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="p-4" dir="rtl" style={{ backgroundColor: CURRENTLINE, border: `1px solid ${PURPLE}`, borderRadius: "1em" }}>
            <h1 style={{ color: YELLOW }}>پاک کردن مخاطب</h1>
            <p style={{ color: FOREGROUND }}>
              ایا مطمئن هستید که مخاطب {contactFullname} را پاک کنید؟
            </p>
            <button
              className="btn mx-2"
              onClick={() => {
                removeContact(contactId);
                onClose();
              }}
              style={{ backgroundColor: PURPLE }} >
              مطمئن هستم
            </button>
            <button className="btn" style={{ backgroundcolor: COMMENT }} onClick={onClose} >
              انصراف
            </button>
          </div>
        )
      }
    })
  };

  const removeContact = async (contactId) => {
    const contactsBackup = [...contacts];
    try {
      setContacts(draft => draft.filter(c => c.id !== contactId));
      setFilteredContacts(draft => draft.filter(c => c.id !== contactId));

      const { status } = await deleteContact(contactId);

      toast.error("مخاطب با موفقیت حذف شد");

      if (status !== 200) {
        setContacts(contactsBackup);
        setFilteredContacts(contactsBackup);
      }
    } catch (err) {
      console.log(err.message);
      setContacts(contactsBackup);
      setFilteredContacts(contactsBackup);
    }
  }

  const contactSearch = _.debounce(query => {
    if (!query) return setFilteredContacts([...contacts]);

    setFilteredContacts(draft => draft.filter(c => c.fullname.toString().toLowerCase().includes(query.toString().toLowerCase())));
  }, 1000);


  return (
    <ContactContext.Provider value={{
      loading,
      setLoading,
      contacts,
      setContacts,
      filteredContacts,
      setFilteredContacts,
      groups,
      deleteContact: confirmDelete,
      createContact: createContactForm,
      contactSearch
    }}>
      <div className="App">
        <ToastContainer rtl={true} theme="colored" />
        <Navbar />
        <Routes>
          <Route path='/' element={<Navigate to="/contacts" />} />
          <Route path='/contacts' element={<Contacts />} />
          <Route path='/contacts/add' element={<AddContact />} />
          <Route path='/contacts/:contactId' element={<ViewContact />} />
          <Route path='/contacts/edit/:contactId' element={<EditContact />} />
        </Routes>
      </div>
    </ContactContext.Provider>
  );
}

export default App;
