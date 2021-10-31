import {useState, useEffect, useCallback} from "react";
import {Route, Switch, useHistory} from 'react-router-dom';
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login"
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  /*popup status*/
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false)
  /*cards*/
  const [cardsData, setCardsData] = useState([])
  const [selectedCard, setSelectedCard] = useState({})
  /*user*/
  const [currentUser, setCurrentUser] = useState({
    name: "loading...",
    about: "loading...",
    avatar: "",
    _id: "",
    cohort: ""
  })
  /*auth*/
  const [isSignXSuccessful, setIsSignXSuccessful] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  /*aux*/
  const history = useHistory();

  /*------------handlers------------*/

  /*------click on card handlers------*/
  function handleCardLike(currentCard) {
    const isLiked = currentCard.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(currentCard._id, isLiked)
        .then((resCard) => {
          setCardsData((cardsData) => cardsData.map((card) => card._id === currentCard._id ? resCard : card));
        })
        .catch(console.log)
  }

  function handleCardDelete(currentCard) {
    api.deleteCard(currentCard._id)
        .then(() => {
          setCardsData((cardsData) => cardsData.filter(card => card._id !== currentCard._id))
        })
        .catch(console.log)
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  /*------aux handlers------*/

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData)
  }

  /*------close handlers------*/

  const handleEditProfileClose = useCallback(() => {
    setIsEditProfilePopupOpen(false)
  }, [setIsEditProfilePopupOpen])

  const handleEditAvatarClose = useCallback(() => {
    setIsEditAvatarPopupOpen(false)
  }, [setIsEditAvatarPopupOpen])

  const handleAddPlaceClose = useCallback(() => {
    setIsAddPlacePopupOpen(false)
  }, [setIsAddPlacePopupOpen])

  const handleImagePopupClose = useCallback(() => {
    setSelectedCard({})
  }, [setSelectedCard])

  const handleInfoTooltipClose = useCallback(() => {
    setIsInfoTooltipOpen(false)
  }, [setIsInfoTooltipOpen])

  /*------api handlers------*/

  const handleUpdateUser = (name, about, processing) => {
    processing(true);
    api.setUser(name, about)
        .then((userData) => {
          setCurrentUser(userData)
          setIsEditProfilePopupOpen(false)
        })
        .catch(console.log)
        .finally(() => {
          processing(false);
        })
  }
  /*https://i.ibb.co/XVHWHmy/ava.jpg*/
  const handleUpdateAvatar = (link, processing, reset) => {
    processing(true);
    api.setUserAvatar(link)
        .then((userData) => {
          setCurrentUser(userData)
          setIsEditAvatarPopupOpen(false)
          reset()
        })
        .catch(console.log)
        .finally(() => {
          processing(false);
        })
  }

  const handleAddPlaceSubmit = (name, link, processing, reset) => {
    processing(true);
    api.addCard(name, link)
        .then((cardData) => {
          setCardsData([cardData, ...cardsData]);
          setIsAddPlacePopupOpen(false)
          reset()
        })
        .catch(console.log)
        .finally(() => {
          processing(false);
        })
  }

  const handleRegistration = (email, password, processing, reset) => {
    processing(true);
    api.register(email, password)
        .then(() => {
          reset()
          processing(false);
          setIsSignXSuccessful(true)
          setIsInfoTooltipOpen(true)
          history.push("sign-in")
        })
        .catch((err) => {
          console.log(err);
          processing(false);
          setIsSignXSuccessful(false)
          setIsInfoTooltipOpen(true)
        })
  }

  const handleLogIn = (email, password, processing, reset) => {
    processing(true);
    api.signIn(email, password)
        .then((data) => {
          reset()
          setEmail(email)
          processing(false);
          setIsLoggedIn(true)
          history.push("/")
          localStorage.setItem("token", data.token)
        })
        .catch((err) => {
          console.log(err);
          processing(false);
          setIsSignXSuccessful(false)
          setIsInfoTooltipOpen(true)
        })
  }

  const handleLogOut = () => {
    setIsLoggedIn(false)
    localStorage.removeItem("token");
    history.push("/sign-in")
  }

  /*------------useEffects------------*/

  useEffect(() => {
    api.getCards()
        .then((cardsData) => {
          setCardsData(cardsData)
        })
        .catch(console.log)
  }, [])


  useEffect(() => {
    api.getUser()
        .then((userData) => {
          setCurrentUser(userData)
        })
        .catch(console.log)
  }, [])

  useEffect(() => {
    if (localStorage.getItem("token")) {
      api.checkToken(localStorage.getItem("token"))
          .then((data) => {
            setIsLoggedIn(true)
            setEmail(data.data.email)
            history.push("/");
          })
          .catch(console.log)
    }
  }, [history])

  /*Вызывать все сеттеры чтобы закрыть один конкретный попап это какое-то дно
    изначально сделал через передачу сеттера, после ревью переделал на хандлеры*/
  /*  const closeAllPopups = () => {
      setIsEditAvatarPopupOpen(false)
      setIsEditProfilePopupOpen(false)
      setIsAddPlacePopupOpen(false)
      setSelectedCard({})
    }*/

  return (
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header onLogOut={handleLogOut} email={email} loggedIn={isLoggedIn}/>
          <Switch>
            <ProtectedRoute component={Main} exact path="/"
                            loggedIn={isLoggedIn}
                            onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick}
                            onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
                            cardsData={cardsData} onCardLike={handleCardLike} onCardDelete={handleCardDelete}>
            </ProtectedRoute>
            <Route path="/sign-up">
              <Register onRegistration={handleRegistration}/>
            </Route>
            <Route path="/sign-in">
              <Login onLogin={handleLogIn}/>
            </Route>

          </Switch>
          <Footer/>
        </div>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={handleEditProfileClose}
                          onUpdateUser={handleUpdateUser}/>
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={handleEditAvatarClose}
                         onUpdateAvatar={handleUpdateAvatar}/>
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={handleAddPlaceClose}
                       onAddPlace={handleAddPlaceSubmit}/>
        <PopupWithForm title='Вы уверены?' name='confirmation' submitText='Да'/>
        <ImagePopup card={selectedCard} onClose={handleImagePopupClose}/>
        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={handleInfoTooltipClose} regStatus={isSignXSuccessful}/>
      </CurrentUserContext.Provider>
  );
}

export default App;
