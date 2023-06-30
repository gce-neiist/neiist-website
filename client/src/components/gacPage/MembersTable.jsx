import React, { useEffect, useState } from "react";
import { memberRow } from "./MembersRow";
import { Table, ScrollArea } from "@mantine/core";
import { CreateMoreInfoModal } from "./modals/InformationalModal";
import useWindowSize from "../../hooks/useWindowSize";

export function MembersTable({ members }) {
  const [collabs, setCollabs] = useState(null);
  const [username, setUsername] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const handleShowMoreInfo = () => setShowMoreInfo(true);
  const handleCloseMoreInfo = () => setShowMoreInfo(false);

  const handleMoreInfo = (username) => { 
    setUsername(username);
    handleShowMoreInfo();
  };

  useEffect(() => {
    fetch(`/api/collabs/resume`)
      .then((res) => res.json())
      .then((fetchMember) => {
        setCollabs(fetchMember);
      })
  }, []);

  const windowSize = useWindowSize();

  const rows = memberRow(members, collabs, handleMoreInfo);

  return (
    <>
      <CreateMoreInfoModal
        show={showMoreInfo}
        handleClose={handleCloseMoreInfo}
        username={username}
      />
      <ScrollArea>
        <Table verticalSpacing="sm">
          <thead>
            <tr>
              <th>Nome</th>
              { windowSize.innerWidth > 800 &&
                <th>Email</th>
              }
              <th>Estado</th>
              <th />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </ScrollArea>
    </>
  );
};
