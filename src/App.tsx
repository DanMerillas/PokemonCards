/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import './App.css';
import noImage from './images/no-image.png'

interface ISeries {
  name: string
  id: string
}


function App() {

  const [cards, setCards] = React.useState<any>([])
  const [series, setSeries] = React.useState<ISeries[]>([{ name: 'Todas', id: '' }])
  const [filterCards, setFilterCards] = React.useState<any>([])
  const [currentCard, setCurrentCard] = React.useState<any>(undefined)
  const [textSearch, setTextSearch] = React.useState<string>('')
  const [pagePosition, setPagePosition] = React.useState(1)
  const [selectedValue, setSelectedValue] = React.useState('');


  const itemsPerPage = 12

  useEffect(() => {
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

      const filteredCardsResults = cards.filter((card: any) => {
        if (card.name.toLowerCase().includes(textSearch.toLowerCase())) {
          return card
        }
      })

      let cardsPaged = filteredCardsResults.splice(0, itemsPerPage * pagePosition)

      setFilterCards(cardsPaged)
    }


    filterCardsSearch()


  }, [cards, pagePosition, textSearch])

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
    const result = await fetch('https://api.tcgdex.net/v2/es/cards')
    const data = await result.json()

    const cardsWithImage = data.filter((card: any) => {
      if (card.image) {
        return card
      }
    }
    ).sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
    })

    setCards(cardsWithImage)
    //console.log(cardsWithImage.splice(0, 10))
    const cardsWithImageFiltered = cardsWithImage.splice(0, itemsPerPage * pagePosition)
    setFilterCards(cardsWithImageFiltered)
    //console.log(cardsWithImage)
  }

  const fetchSeriesApi = async () => {
    const result = await fetch(`https://api.tcgdex.net/v2/es/sets/${selectedValue}`)
    const data = await result.json()

    const seriesCards = data.cards

    const cardsWithImage = seriesCards.filter((card: any) => {
      if (card.image) {
        return card
      }
    }
    ).sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
    })

    setCards(cardsWithImage)
    const cardsWithImageFiltered = cardsWithImage.splice(0, itemsPerPage * pagePosition)
    setFilterCards(cardsWithImageFiltered)
  }

  const fetchCombosFromApi = async () => {
    const resultSeries = await fetch('https://api.tcgdex.net/v2/es/sets')
    const dataSeries = await resultSeries.json()
    const seriesSorted = dataSeries.sort((a: any, b: any) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
    })
    setSeries(seriesSorted)
    
  }



  const viewCard = (cardIndex: any) => {


    if (textSearch !== '' && cardIndex < filterCards.length && cardIndex >= 0) {
      filterCards[cardIndex].index = cardIndex
      setCurrentCard(filterCards[cardIndex])
    }

    if (textSearch === '' && cardIndex >= 0) {
      cards[cardIndex].index = cardIndex
      setCurrentCard(cards[cardIndex])
    }
  }

  const handlerErrorImagen = (event: any) => {

    if (event.target.src.toLowerCase().includes('high.webp')) {
      event.target.src = event.target.src.replace('high.webp', 'low.webp')
    }
    else {
      event.target.src = noImage
    }


  }

  const handleChange = (event: any) => {
    setPagePosition(1)
    setSelectedValue(event.target.value)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Cartas Pokemon de Aarón</h1>
        
        <div className='App-filters'>
          <label className='App-label' htmlFor='cbSeries'>Series</label>
          <select id='cbSeries' title='Filtro series' value={selectedValue} onChange={handleChange}>
          <option key='Todas' value='' title='Todas'>Todas</option>
            {series.map((option: ISeries) => (
              <option key={option.id} value={option.id} title={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>


        {!currentCard && <input type="text" value={textSearch} className='App-search' placeholder='Buscar' onChange={(event) => setTextSearch(event.target.value)} />}
        <div className='App-Cards-container'>

          {!currentCard ?
            <>
              {filterCards.map((card: any, index: number) => {
                return <div className='App-name' key={card.id} onClick={() => viewCard(index)}>
                  <div className='App-Pokemon-title' >{card.name}</div>
                  <img className='preview-img' src={`${card.image}/low.webp`} alt={card.name} onError={handlerErrorImagen} />
                </div>

              })}
              <div className='App-pagination' onClick={() => { setPagePosition(pagePosition + 1) }}>Ver más</div>
            </>
            :
            <div className='App-card-Image-container'>
              <h3 className='App-return' onClick={() => setCurrentCard(undefined)}>Volver</h3>
              <img className='image-card' src={`${currentCard.image}/high.webp`} alt={currentCard.name} onError={handlerErrorImagen} />
              <div className='App-pagination' onClick={() => { viewCard(currentCard.index - 1) }}>Anterior</div>
              <div className='App-pagination' onClick={() => { viewCard(currentCard.index + 1) }}>Siguiente</div>

            </div>
          }
        </div>


      </header>
    </div>
  );
}

export default App;
