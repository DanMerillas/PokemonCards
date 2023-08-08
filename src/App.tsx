/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import './App.css';
import noImage from './images/no-image.png'


function App() {

  const [cards, setCards] = React.useState<any>([])
  const [filterCards, setFilterCards] = React.useState<any>([])
  const [currentCard, setCurrentCard] = React.useState<any>(undefined)
  const [textSearch, setTextSearch] = React.useState<string>('')
  const [pagePosition, setPagePosition] = React.useState(1)

  const itemsPerPage = 12

  useEffect(() => {
    fetchApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    const filterCardsSearch = () => {

      if(textSearch.length === 1){
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



  const viewCard = (cardIndex: any) => {
    

    if(textSearch !== '' && cardIndex < filterCards.length && cardIndex >= 0){
      filterCards[cardIndex].index = cardIndex
      setCurrentCard(filterCards[cardIndex])
    }
    
    if(textSearch === '' &&  cardIndex >= 0){
      cards[cardIndex].index = cardIndex
      setCurrentCard(cards[cardIndex])
    }
  }

  const handlerErrorImagen = (event: any) => {

    if( event.target.src.toLowerCase().includes('high.webp')){
      event.target.src = event.target.src.replace('high.webp', 'low.webp')
    }
    else{
      event.target.src = noImage
    }

    
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Cartas Pokemon de Aarón</h1>
        {!currentCard && <input type="text" value={textSearch} className='App-search' placeholder='Buscar' onChange={(event) => setTextSearch(event.target.value)} />}
        <div className='App-Cards-container'>

          {!currentCard ?
            <>
              {filterCards.map((card: any, index:number) => {
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
              <div className='App-pagination' onClick={() => { viewCard(currentCard.index-1) }}>Anterior</div>
              <div className='App-pagination' onClick={() => { viewCard(currentCard.index+1) }}>Siguiente</div>

            </div>
          }
        </div>


      </header>
    </div>
  );
}

export default App;
