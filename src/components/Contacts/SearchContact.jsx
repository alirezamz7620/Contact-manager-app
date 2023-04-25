import { useContext } from "react";

import { PURPLE } from "../../helpers/colors";
import { ContactContext } from "../../context/ContactContext";

const SearchContact = () => {
  const { contactSearch } = useContext(ContactContext);

  return (
    <div
      className="input-group mx-2 w-75"
      dir="ltr">
      <span
        className="input-group-text"
        id="basic-addon1"
        style={{ backgroundColor: PURPLE }}>
        <i className="fas fa-search" />
      </span>
      <input
        className="form-control"
        dir="rtl"
        type="text"
        onChange={(event) => contactSearch(event.target.value)}
        placeholder="جستوجوی مخاطب"
        aria-label="search"
        aria-describedby="basic-addon1"
      />
    </div>
  );
};

export default SearchContact;
