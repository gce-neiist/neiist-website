import '@testing-library/jest-dom'
import { render, screen, cleanup } from '@testing-library/react';
import MemberPage from "../../../pages/MemberPage";
import UserDataContext from '../../../UserDataContext';
import { act } from 'react-dom/test-utils';

describe('MembersPage', () => {
  const userDataMock = {
    "username": "ist123456",
    "displayName": "Mock Name",
    "name": "Mock First Second Name",
    "email": "mail.mock@tecnico.ulisboa.pt",
    "courses": "MEIC-A, MEIC-T",
    "status": "NaoSocio",
    "isActiveTecnicoStudent": true,
    "isActiveLMeicStudent": true,
    "isAdmin": false,
    "isGacMember": false,
    "isMember": true,
    "isCollab": false,
    "isCoordenator": false,
  };

  const electionsMock = [
    {
      id: 1,
      name: "Mock Election",
      startDate: new Date().getDate(),
      endDate: new Date(new Date() + 7 * 24 * 60 * 60 * 1000).getDay(),
      options: [
        { id: 1, name: "Option1", electionId: 1, votes: "0" },
        { id: 2, name: "Option3", electionId: 1, votes: "0" },
        { id: 3, name: "Option4", electionId: 1, votes: "0" },
        { id: 4, name: "Option2", electionId: 1, votes: "0" },
        { id: 5, name: "Other", electionId: 1, votes: "0" },
      ],
    },
    {
      id: 2,
      name: "Mock Election2",
      startDate: new Date().getDate(),
      endDate: new Date(new Date() + 7 * 24 * 60 * 60 * 1000).getDay(),
      options: [
        { id: 1, name: "Option1", electionId: 1, votes: "0" },
        { id: 2, name: "Option3", electionId: 1, votes: "0" },
        { id: 3, name: "Option4", electionId: 1, votes: "0" },
      ],
    },
    {
      id: 3,
      name: "Mock Election3",
      startDate: new Date().getDate(),
      endDate: new Date(new Date() + 7 * 24 * 60 * 60 * 1000).getDay(),
      options: [
        { id: 1, name: "Option1", electionId: 1, votes: "0" },
        { id: 2, name: "Option3", electionId: 1, votes: "0" },
      ],
    },
  ];

  const renderComponent = ( userdata ) => {
    return render(
      <UserDataContext.Provider value={{ userData: userdata }}>
        <MemberPage />
      </UserDataContext.Provider>
    );
  };

  
  describe('general tests', () => {

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        // Set member as null
        json: jest.fn().mockResolvedValueOnce(null),
      });
    });
    
    afterEach(() => {
      global.fetch.mockRestore();
      cleanup();
    });

    it('display of information', ()=> {
      //PASS
    })
  });

  describe('member not present in the DB', () => {

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        // Set member as null
        json: jest.fn().mockResolvedValueOnce(null),
      });
    });

    afterEach(() => {
      global.fetch.mockRestore();
      cleanup();
    });

    it('should display button with "Registar"', async () => {
      await act(() => { renderComponent(userDataMock); });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const renovateButton = await screen.getByRole('button', { name: /registar/i });
      expect(renovateButton).toBeInTheDocument();
    });

    it('should display warning div', async () => {
      await act(() => { renderComponent(userDataMock); });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const renovateButton = await screen.getByRole('alert');
      expect(renovateButton).toBeInTheDocument();
      expect(renovateButton).toHaveTextContent(/Dados retirados do Fênix e não presentes na nossa base de dados/i);
    })
  });

  describe('member present in the DB', () => {

    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(userDataMock),
      });
    });

    afterEach(() => {
      global.fetch.mockRestore();
      cleanup();
    });

    it('should display button with "Renovar" if status is "NaoSocio"', async () => {
      await act(() => { renderComponent(userDataMock); });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const renovateButton = await screen.getByRole('button', { name: /renovar/i });
      expect(renovateButton).toBeInTheDocument();
    });
    
    it('should display button with "Renovar" if status is "Renovar"', async () => {
      userDataMock.status = "Renovar";
      await act(() => { renderComponent(userDataMock); });
      expect(global.fetch).toHaveBeenCalledTimes(1);
      const renovateButton = await screen.getByRole('button', { name: /renovar/i });
      expect(renovateButton).toBeInTheDocument();
    });

    describe('SocioRegular', ()=>{
      it('should not display a button if status is "SocioRegular"; should display div with "Can\'t Vote"', async () => {
        userDataMock.status = "SocioRegular";
        await act(() => { renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(await screen.queryAllByRole('button').length).toBe(0);
        expect(await screen.getByText(/AINDA NÃO PODES VOTAR/i)).toBeInTheDocument();
      });
    });

    describe('SocioEleitor', ()=>{

      it('should not display a button', async () => {
        userDataMock.status = "SocioEleitor";
        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce({}),
        });
        await act(() => { renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(2);

        const buttons = await screen.queryAllByRole('button');
        expect(buttons.length).toBe(0);
      });
      
      it('when unable to get elections, display a div with "Unable to get Elections"', async () => {
        userDataMock.status = "SocioEleitor";
        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce({}),
        });
        await act(() => { renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(2);

        const buttons = await screen.queryAllByRole('button');
        expect(buttons.length).toBe(0);
        expect(await screen.getByText(/Não foi possível carregar as eleições/i)).toBeInTheDocument();
      });

      it('when there isn\'t elections, display div with "No Elections"', async () => {
        userDataMock.status = "SocioEleitor";
        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce([])
        });
        await act(() => { renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(2);

        const buttons = await screen.queryAllByRole('button');
        expect(buttons.length).toBe(0);
        expect(await screen.getByText(/Não existe atualmente eleições a decorrer/i)).toBeInTheDocument();
      });

      it('when there is one election, display h1 + card information', async () => {
        userDataMock.status = "SocioEleitor";
        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce([electionsMock[0]])
        });
        const { container } = await act(() => { return renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(2);

        const cardHeading = await screen.getByRole('heading', { name:/Eleição/i });
        const cardTitle = await container.querySelector('.card-title');
        expect(cardHeading).toBeInTheDocument();
        expect(cardTitle).toBeInTheDocument();
        expect(cardTitle.textContent).toBe(electionsMock[0].name);

        // ADD EVENT OF USER
      });

      it('when there is n elections, display h1 and card information for each one', async () => {        
        userDataMock.status = "SocioEleitor";
        global.fetch.mockResolvedValueOnce({
          json: jest.fn().mockResolvedValueOnce(electionsMock)
        });
        const { container } = await act(() => { return renderComponent(userDataMock); });
        expect(global.fetch).toHaveBeenCalledTimes(2);

        const cardHeading = await screen.getByRole('heading', { name:/Eleições/i });
        const cardTitles = await container.querySelectorAll('.card-title');
        expect(cardHeading).toBeInTheDocument();
        cardTitles.forEach((cardTitle, index) => {
          expect(cardTitle).toBeInTheDocument();
          expect(cardTitle.textContent).toBe(electionsMock[index].name);
        });

        // ADD EVENT OF USER
      });
    })
  });
});