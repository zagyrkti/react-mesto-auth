import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import {useState, useEffect, useCallback} from "react";
import { Route } from 'react-router-dom';

import ImagePopup from "./ImagePopup";
import {api} from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login"
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false)
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false)
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false)
  const [isInfoTooltip, setIsInfoTooltip] = useState(false)
  const [selectedCard, setSelectedCard] = useState({})
  const [currentUser, setCurrentUser] = useState({
    name: "loading...",
    about: "loading...",
    avatar: "",
    _id: "",
    cohort: ""
  })

  const [cardsData, setCardsData] = useState([])

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

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true)
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true)
  }

  const handleCardClick = (cardData) => {
    setSelectedCard(cardData)
  }

  /*подумывал сделать через хaндлеры но не хотелось лишнего городить
    но если поприкидывать действительно самый адекватный вариант*/
  const handleEditProfileClose = useCallback(() => {
    setIsEditProfilePopupOpen(false)
  },[setIsEditProfilePopupOpen])

  const handleEditAvatarClose = useCallback(() => {
    setIsEditAvatarPopupOpen(false)
  }, [setIsEditAvatarPopupOpen])

  const handleAddPlaceClose = useCallback(() => {
    setIsAddPlacePopupOpen(false)
  }, [setIsAddPlacePopupOpen])

  const handleImagePopupClose = useCallback(() => {
    setSelectedCard({})
  },[setSelectedCard])

  const handleInfoTooltipClose = useCallback(() => {
    setIsInfoTooltip(false)
  },[setIsInfoTooltip])

  /*спасибо по catch finally спустя столько ревью выплыло ))*/
  /*закрытие и ресет внутри then и правда поюзерфрендли будет*/
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
          <Header/>
          <Route exact path="/">
          <Main onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick} onCardClick={handleCardClick}
                cardsData={cardsData} onCardLike={handleCardLike} onCardDelete={handleCardDelete}/>
          </Route>
          <Route path="/sign-up">
            <Register/>
          </Route>
          <Route path="/sign-in">
            <Login/>
          </Route>
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
        <InfoTooltip isOpen={isInfoTooltip} onClose={handleInfoTooltipClose}/>
      </CurrentUserContext.Provider>
  );
}

export default App;
