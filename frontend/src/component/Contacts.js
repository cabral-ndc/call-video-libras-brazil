

import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Contacts = ({ startCall }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const contactsList = querySnapshot.docs.map((doc) => ({ email: doc.id, ...doc.data() }));
      setContacts(contactsList);
    };

    fetchContacts();
  }, []);

  return (
    <div className="mt-4 bg-gray-700 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Contatos Online</h3>
      <ul>
        {contacts.map((contact) =>
          contact.online ? (
            <li key={contact.email} className="flex justify-between items-center border-b border-gray-600 py-2">
              <span>{contact.email}</span>
              <button className="bg-green-500 px-3 py-1 rounded-md" onClick={() => startCall(contact.email)}>
                Chamar
              </button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default Contacts;
