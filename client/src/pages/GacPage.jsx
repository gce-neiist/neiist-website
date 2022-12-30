import React, { useState, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import LoadSpinner from "../hooks/loadSpinner";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

import style from "./css/GacPage.module.css";
import axios from "axios";
import { fenixPhoto, summarizeName } from "../components/functions/dataTreatment";


const GacPage = () => {
  const [key, setKey] = useState('active');

  return (
    <div>
      <Tabs
        id="controlled-tab-example"
        className={style.tabs}
        activeKey={key}
        onSelect={(newKey) => setKey(newKey)}
        justify
      >
        <Tab eventKey="active" title="Ativos">
          <ActiveMembersPage
            keySelected={key}
          />
        </Tab>
        <Tab eventKey="search" title="Pesquisa">
          <div className={style.principalBody}>
            TO BE IMPLEMENTED
          </div>
        </Tab>
        <Tab eventKey="all" title="Todos">
          <AllMembersPage
            keySelected={key}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

const ActiveMembersPage = ({ keySelected }) => {
  const [activeMembers, setMembers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (keySelected === 'active' && activeMembers === null) {
      fetch("/api/mag/active")
        .then((res) => res.json())
        .then(
          (membersRes) => {
            setMembers(membersRes);
            setIsLoaded(true);
          })
        .catch(
          (err) => {
            setIsLoaded(true);
            setError(err);
          }
        );
    }
  }, [keySelected]);

  return (
    <>
      {!isLoaded && <LoadSpinner />}
      {error && (
        <div>
          Erro:
          {error.message}
        </div>
      )}
      {activeMembers && isLoaded && !error &&
        <div>
          <div className={style.principalBody}>
            <h1>
              <b>Membros ativos:</b> {activeMembers.length} Membros (
              {
                activeMembers.filter(
                  (member) =>
                    member.status === "SocioEleitor" ||
                    member.status === "Renovar"
                ).length
              }{" "}
              Ativos)
            </h1>
            <EmailButtons members={activeMembers} />
            <br />
            <div className={style.messageDiv}>
              <p>
                'Não Sócios' devem ser comunicados por email, informando que o
                estatudo de sócio eleitor expirou e que tem até X se pretender
                renovar.
              </p>
            </div>
          </div>
          <MembersTable members={activeMembers} />
        </div>
      }
    </>
  );
}

const AllMembersPage = ({ keySelected }) => {
  const [allMembers, setMembers] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (keySelected === 'all' && allMembers === null) {
      fetch("/api/mag/all")
        .then((res) => res.json())
        .then(
          (membersRes) => {
            setMembers(membersRes);
            setIsLoaded(true);
          })
        .catch(
          (err) => {
            setIsLoaded(true);
            setError(err);
          }
        );
    }
  }, [keySelected]);

  return (
    <>
      {!isLoaded && <LoadSpinner />}
      {error && (
        <div>
          Erro:
          {error.message}
        </div>
      )}
      {allMembers && (
        <div>
          <div className={style.principalBody}>
            <h1>
              <b>Membros Registados:</b> {allMembers.length}
            </h1>
          </div>
          <MembersTable members={allMembers} />
        </div>
      )}
    </>
  );
}

const EmailButtons = ({ members }) => {
  const [showRenewMembers, setshowRenewMembers] = useState(false);
  const handleCloseNonActive = () => setshowRenewMembers(false);
  const handleshowRenewMembers = () => setshowRenewMembers(true);

  const [showRenewEmails, setShowRenewEmails] = useState(false);
  const handleShowRenewEmails = () => setShowRenewEmails(true);
  const handleCloseRenewEmails = () => setShowRenewEmails(false);

  const [showRegularEmails, setShowRegularEmails] = useState(false);
  const handleShowRegularEmails = () => setShowRegularEmails(true);
  const handleCloseRegularEmails = () => setShowRegularEmails(false);

  return (
    <div className={style.buttonsDiv}>
      <Button onClick={handleShowRegularEmails}>[Emails] Sócios Regulares</Button>
      <CreateEmailsModal
        show={showRegularEmails}
        handleClose={handleCloseRegularEmails}
        members={members.filter((member) =>
          member.status === "SocioRegular"
        )}
      />
      <Button onClick={handleShowRenewEmails}>[Emails] Sócios Eleitores</Button>
      <CreateEmailsModal
        show={showRenewEmails}
        handleClose={handleCloseRenewEmails}
        members={members.filter((member) =>
          member.status === "SocioEleitor" ||
          member.status === "Renovar"
        )}
      />
      <Button onClick={handleshowRenewMembers}>Renovações</Button>
      <CreateRenewMembersModal
        show={showRenewMembers}
        handleClose={handleCloseNonActive}
        members={members?.filter((member) =>
          member.status === "Renovar"
        )}
      />
    </div>
  );
};

const CreateMoreInfoModal = ({ show, handleClose, username }) => {
  const [error, setError] = useState(null);
  const [member, setMember] = useState(null);
  const [changedEmail, setChangedEmail] = useState(null);
  const [disableEmail, setDisableEmail] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setError(null);
    if (username !== null) {
      fetch(`/api/members/${username}`)
        .then((res) => res.json())
        .then(
          (fetchMember) => {
            setMember(fetchMember);
            setIsLoaded(true);
            setChangedEmail(fetchMember.email);
          })
        .catch(
          (err) => {
            setIsLoaded(true);
            setError(err);
          }
        );
    }
  }, [username]);

  const handleUpdate = async (e, username) => {
    e.preventDefault();
    const resp = await axios.post(`/api/mag/update/email/${username}`, {changedEmail});
    if (resp) {
      setDisableEmail(!disableEmail);
      window.location.reload(false);
    }
  }

  if (member)
    return (
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className={style.modalTitle}>
            INFORMAÇÂO DE {String(member.username).toUpperCase()}
            <Button
              className={style.btnEditEmail}
              onClick={() => {setDisableEmail(!disableEmail)}}
            >
              Editar Email
            </Button>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!isLoaded && <LoadSpinner />}
          {error && <div>Error: {error}</div>}
          {member !== null && isLoaded && (
            <div className={style.infoCard}>
              <div
                className={style.infoCard_img}
                style={{
                  backgroundImage: `url(${fenixPhoto(member.username)})`,
                }}
              />
              <div className={style.infoCard_info}>
                <b>
                  {member.username} <br />
                  <p>{member.name}</p>
                  <br />
                  <p style={{ fontSize: "18px", color: "darkblue" }}>
                    ({member.courses})
                  </p>
                  <br />
                  <Form onSubmit={(e) => {handleUpdate(e, member.username)}}>
                    <fieldset disabled={disableEmail}>
                      <Form.Control
                        id="disabledEmailInput"
                        type="email"
                        className={disableEmail ? style.ControlDisable : style.ControlActive}
                        value={changedEmail}
                        onChange={(event) => setChangedEmail(event.target.value)}
                      />
                      </fieldset>
                  </Form>
                  <br />
                </b>
                <div id={style.tableDiv}>
                  <table>
                    <thead>
                      <tr>
                        <th>Registo</th>
                        <th>Sócio Eleitor</th>
                        <th style={{ width: "45%" }}>Renovação</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>{member.registerDate}</th>
                        <th>{member.canVoteDate}</th>
                        <th>
                          {member.renewStartDate} - {member.renewEndDate}
                        </th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <br />
                <div style={{display: 'flex', gap: '10px'}}>
                  {member.status === 'Renovar' &&
                    <Button
                    style={{backgroundColor:'orange', borderColor:'orange'}}
                    onClick={() => {
                      axios.put(`/api/members/${member.username}`, {
                        name: member.name,
                        email: member.email,
                        courses: member.courses
                      })
                      .then((res) => { if (res) window.location.reload(); });
                    }}>Renovar</Button>
                  }
                  {member.status !== 'NaoSocio' &&
                    <DeleteButton
                      member={member}
                      handleClose={handleClose}
                    />
                  }
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
};

const DeleteButton = ({
  member, handleClose
}) => {
  const [remove, setRemove] = useState(true);
  const [memberToRemove, setmemberToRemove] = useState('');

  const handleSubmit = (event, username, member) => {
    event.preventDefault();
    if (username === member.username)
      axios.put(`/api/mag/delete/${username}`)
        .then(() => { handleClose(); window.location.reload(false) });
  }

  return (
    <div>
      <Button
        style={remove
          ? {
            backgroundColor: 'darkRed',
            borderColor: 'darkRed',
            color: 'white',
            position: 'absolute',
            float: 'left',
            width: '100px'
          }

          : (memberToRemove === member.username)
            ? {
              backgroundColor: 'darkGreen',
              borderColor: 'darkGreen',
              color: 'white',
              position: 'absolute',
              float: 'right',
              right: '0',
              width: '100px'
            }
            : {
              backgroundColor: 'darkRed',
              borderColor: 'darkRed',
              color: 'white',
              position: 'absolute',
              float: 'right',
              right: '0',
              width: '100px'
            }
        }
        onClick={(event) => {
          if (memberToRemove === member.username)
            handleSubmit(event, memberToRemove, member);
          else
            setRemove(!remove);
        }}
      >
        Delete
      </Button>
      <div>
        <Form onSubmit={(event) => { handleSubmit(event, memberToRemove, member) }}>
          <fieldset disabled={remove}>
            <Form.Control
              id="disabledTextInput"
              type="Text"
              style={remove
                ? { display: 'none', visibility: 'hidden' }
                : { position: 'absolute', float: 'right', width: '400px' }
              }
              placeholder={'Para Remover o sócio, digite: ' + member.username}
              value={memberToRemove}
              onChange={(event) => setmemberToRemove(event.target.value)}
            />
          </fieldset>
        </Form>
      </div>
    </div>
  );
};

const CreateEmailsModal = ({ show, handleClose, members }) => {
  var everyEmail = "";

  const exportEveryEmail = () => {
    var emails = [];
    members?.forEach((member) => emails.push(member.email));
    everyEmail = emails.join(",");
    return everyEmail;
  };

  const copyAllEmails = () => {
    const emails = everyEmail !== "" ? everyEmail : exportEveryEmail();
    return navigator.clipboard.writeText(emails);
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className={style.modalTitle}>
          EMAILS DOS SÓCIOS ELEITORES
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className={style.AllMembersCard}
          style={{ height: "75px", paddingRight: "100px" }}
        >
          <div className={style.AllMembersCard_emails}>
            {exportEveryEmail()}
          </div>
          <Button onClick={copyAllEmails}>Copiar</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const CreateRenewMembersModal = ({
  show, handleClose, members
}) => {
  var nonActiveEmails = "";

  const exportNonActiveMembersEmail = () => {
    var emails = [];
    members?.forEach((member) => emails.push(member.email));
    nonActiveEmails = emails.join(",");
    return nonActiveEmails;
  };

  const copyNonActiveEmails = () => {
    const emails =
      nonActiveEmails !== "" ? nonActiveEmails : exportNonActiveMembersEmail();
    return navigator.clipboard.writeText(emails);
  };

  const sendEmail = (member) => {
    const email = `mailto:${member.email}?subject=Renova%C3%A7%C3%A3o%20do%20Estatuto%20de%20S%C3%B3cio%20Eleitor&body=${member.name}
    +', Periodo de Renovação: +${member.renewStartDate}+' - '+ ${member.renewEndDate}`;

    return window.open(email);
  };

  const copyEmail = (member) => {
    const email = `to:${member.email} ; subject=Renovação do Estatuto de Sócio Eleitor ; BODY=${member.name}
    +', Periodo de Renovação: +${member.renewStartDate}+' - '+ ${member.renewEndDate}`;

    return navigator.clipboard.writeText(email);
  };

  return (
    <Modal size="lg" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className={style.modalTitle}>
          SÓCIOS EM PERIODO DE RENOVAÇÃO
        </Modal.Title>
        <Button
          className={style.btnCopyEmailsHeader}
          onClick={copyNonActiveEmails}
        >
          Copiar Emails
        </Button>
      </Modal.Header>
      <Modal.Body>
        {Object.values(members).map((member, index) => (
          <div
            key={index}
            className={style.nonActiveCard}
            style={
              index % 2 === 1
                ? { backgroundColor: "rgb(53, 209, 250,0.25)" }
                : { backgroundColor: "rgb(36, 139, 227,0.5)" }
            }
          >
            <div
              className={style.nonActiveCard_img}
              style={{
                backgroundImage: `url(${fenixPhoto(member.username)})`,
              }}
            />
            <p>
              <b>
                {summarizeName(member.name)}
                <br />
                Periodo:
              </b>
              <p id={style.period}>
                {member.renewStartDate} - {member.renewEndDate}
              </p>
            </p>
            <Button onClick={() => sendEmail(member)}>Enviar Mail</Button>
            <Button style={{ top: "55%" }} onClick={() => copyEmail(member)}>
              Copiar Mail
            </Button>
          </div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

const MembersTable = ({ members }) => {
  const windowSize = useWindowSize();

  const [username, setUsername] = useState(null);
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const handleShowMoreInfo = () => setShowMoreInfo(true);
  const handleCloseMoreInfo = () => setShowMoreInfo(false);

  const handleMoreInfo = (username) => {
    setUsername(username);
    handleShowMoreInfo();
  };

  return (
    <div className={style.principalTable}>
      <CreateMoreInfoModal
        show={showMoreInfo}
        handleClose={handleCloseMoreInfo}
        username={username}
      />
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Username</th>
            <th>Nome</th>
            {windowSize.innerWidth > 1000 &&
              <th>E-mail</th>
            }
            {windowSize.innerWidth > 850 &&
              <th>Curso(s)</th>
            }
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(members).map((member, index) => (
            <CreateMemberRow
              key={index}
              index={index}
              member={member}
              windowSize={windowSize}
              handleMoreInfo={handleMoreInfo}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CreateMemberRow = ({
  index, member, windowSize, handleMoreInfo
}) => {
  const getName = (name) => {
    return windowSize.innerWidth > 1250 ? name : summarizeName(name);
  }

  return (
    <tr
      key={index + 1}
      className={style.fsTable}
      style={
        index % 2 === 1
          ? { backgroundColor: "rgb(53, 209, 250,0.10)" }
          : { backgroundColor: "rgb(36, 139, 227,0.25)" }
      }
    >
      <th>{index + 1}</th>
      <th>
        <div
          className={style.memberImg}
          style={{
            backgroundImage: `url(${fenixPhoto(member.username)})`,
          }}
        />
      </th>
      <th>{member.username}</th>
      <th style={{ textAlign: "left" }}>{getName(member.name)}</th>
      {windowSize.innerWidth > 1000 &&
        <th style={{ textAlign: "left" }}>{member.email}</th>
      }
      {windowSize.innerWidth > 850 &&
        <th>{member.courses}</th>
      }
      <th className={style.buttonsColumn}>
        <Button onClick={() => handleMoreInfo(member.username)}>
          <img
            style={windowSize.innerWidth < 850 ? { width: "100px" } : { width: "auto" }}
            src={`${process.env.PUBLIC_URL}/${member.status}.svg`}
          />
        </Button>
      </th>
    </tr>
  );
}

export default GacPage;
