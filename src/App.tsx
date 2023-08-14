/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import './App.css';
import noImage from './images/no-image.png'
import { ISeries } from './interfaces/Iseries';
import { CardsFilter } from './components/CardsFilter';
import { CardsList } from './components/CardsList';
import { CardDetail } from './components/CardDetail';
import { addCardInDb, getCardsFromApi, getSeriesCardsFromApi, getSeriesFromApi, readBDCards, removeCardInDb } from './services/service';




function App() {

  const [cards, setCards] = React.useState<any>([])
  const [series, setSeries] = React.useState<ISeries[]>([{ name: 'Todas', id: '' }])
  const [filterCards, setFilterCards] = React.useState<any>([])
  const [currentCard, setCurrentCard] = React.useState<any>(undefined)
  const [textSearch, setTextSearch] = React.useState<string>('')
  const [pagePosition, setPagePosition] = React.useState(1)
  const [selectedValue, setSelectedValue] = React.useState('');
  const [cardsInDb, setCardsInDb] = React.useState<any>(undefined)
  const [selectedRadioButtonValue, setSelectedRadioButtonValue] = React.useState('');


  const itemsPerPage = 12

  useEffect(() => {
    fetchDBCards()
    fetchApi()
    fetchCombosFromApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    const filterCardsSearch = () => {

      if (textSearch.length === 1) {
        setPagePosition(1)
        return
      }

      let filteredCardsResults = cards.filter((card: any) => {
        if (card.name.toLowerCase().includes(textSearch.toLowerCase())) {
          return card
        }
      })

      if (selectedRadioButtonValue === 'Ihave') {
        filteredCardsResults = filteredCardsResults.filter((card: any) => {
          if (cardsInDb.find((cardDB: any) => cardDB.card_id === card.id)) {
            return card
          }
        })
      }

      if (selectedRadioButtonValue === 'IDontHave') {
        filteredCardsResults = filteredCardsResults.filter((card: any) => {
          if (!cardsInDb.find((cardDB: any) => cardDB.card_id === card.id)) {
            return card
          }
        })
      }

      let cardsPaged = filteredCardsResults.splice(0, itemsPerPage * pagePosition)

      setFilterCards(cardsPaged)
    }


    filterCardsSearch()


  }, [cards, pagePosition, textSearch, selectedRadioButtonValue, cardsInDb])

  useEffect(() => {
    if (selectedValue !== '') {
      fetchSeriesApi()
    }
    else {
      fetchApi()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue])



  const fetchApi = async () => {


    const cardsWithImage = await getCardsFromApi()

    setCards(cardsWithImage)
    //console.log(cardsWithImage.splice(0, 10))
    const cardsWithImageFiltered = cardsWithImage.splice(0, itemsPerPage * pagePosition)
    setFilterCards(cardsWithImageFiltered)
    //console.log(cardsWithImage)
  }

  const fetchSeriesApi = async () => {

    const cardsWithImage = await getSeriesCardsFromApi(selectedValue)

    setCards(cardsWithImage)
    const cardsWithImageFiltered = cardsWithImage.splice(0, itemsPerPage * pagePosition)
    setFilterCards(cardsWithImageFiltered)
  }

  const fetchCombosFromApi = async () => {

    const seriesSorted = await getSeriesFromApi()
    setSeries(seriesSorted)

  }

  const fetchDBCards = async () => {

    const dbCards = await readBDCards()

    setCardsInDb(dbCards)
  }


  const viewCard = (cardIndex: any) => {


    if (cardIndex < filterCards.length && cardIndex >= 0) {
      filterCards[cardIndex].index = cardIndex
      setCurrentCard(filterCards[cardIndex])
    }

    if(textSearch === '' &&  cardIndex >= filterCards.length){
      setPagePosition(pagePosition + 1)
    }

    // if (textSearch === '' && cardIndex >= 0) {
    //   cards[cardIndex].index = cardIndex
    //   setCurrentCard(cards[cardIndex])
    // }
  }

  const handlerErrorImagen = (event: any) => {

    if (event.target.className === 'preview-img') {
      if (event.target.src.toLowerCase().includes('low.webp')) {
        event.target.src = event.target.src.replace('low.webp', 'high.webp')
      }
      else {
        event.target.src = noImage
      }
    }
    else {
      if (event.target.src.toLowerCase().includes('high.webp')) {
        event.target.src = event.target.src.replace('high.webp', 'low.webp')
      }
      else {
        event.target.src = noImage
      }
    }




  }

  const handleChange = (event: any) => {
    setPagePosition(1)
    setSelectedValue(event.target?.value)
  }

  const addOrRemoveCardToDb = async (card: any) => {

    if (cardsInDb.find((currentCard: any) => currentCard.card_id === card.id)) {
      await removeCardInDb(card.id)
    }
    else {
      await addCardInDb(card.name, card.id)
    }

    fetchDBCards()

  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Cartas Pokemon de Aarón</h1>

        <CardsFilter changeFilter={handleChange} series={series} setRadioButtonOption={setSelectedRadioButtonValue} />


        {!currentCard && <input type="text" value={textSearch} className='App-search' placeholder='Buscar' onChange={(event) => setTextSearch(event.target.value)} />}
        <div className='App-Cards-container'>

          {!currentCard ?
            <CardsList filterCards={filterCards} viewCard={viewCard} handlerErrorImagen={handlerErrorImagen} pagePosition={pagePosition} setPagePosition={setPagePosition} cardsInDb={cardsInDb} setExistInDb={addOrRemoveCardToDb} />
            :
            <CardDetail currentCard={currentCard} setCurrentCard={setCurrentCard} handlerErrorImagen={handlerErrorImagen} viewCard={viewCard} cardsInDb={cardsInDb} setExistInDb={addOrRemoveCardToDb} />
          }
        </div>


      </header>
    </div>
  );
}

export default App;
