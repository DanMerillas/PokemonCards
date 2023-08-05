/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import './App.css';


function App() {

  const [cards, setCards] = React.useState([])
  const [filterCards, setFilterCards] = React.useState([])
  const [currentCard, setCurrentCard] = React.useState<any>(undefined)
  const [textSearch, setTextSearch] = React.useState<string>('')

  useEffect(() => {
    fetchApi()
  }, [])

  useEffect(() => {

    const filterCardsSearch = () => {

      const filteredCardsResults = cards.filter((card: any) => {
        if (card.name.toLowerCase().includes(textSearch.toLowerCase())) {
          return card
        }
      })
  
      setFilterCards(filteredCardsResults)
    }

    filterCardsSearch()
    
  }, [cards, textSearch])

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
    setFilterCards(cardsWithImage)
  }

  

  const viewCard = (card: any) => {
    setCurrentCard(card)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>Cartas de Pokemon de Aarón</h1>
      {!currentCard && <input type="text" value={textSearch} className='App-search' placeholder='Buscar' onChange={(event)=>setTextSearch(event.target.value)} />}
        <div className='App-Cards-container'>
        
          {!currentCard ?

            filterCards.map((card: any) => {
                return <div className='App-name' key={card.id}>
                  <span className='App-Pokemon-title'  onClick={() => viewCard(card)}>{card.name}</span>
                </div>
              
            })

            :
            <div className='App-card-Image-container'>
              <h3 className='App-return' onClick={() => setCurrentCard(undefined)}>Volver</h3>
              <img src={`${currentCard.image}/high.webp`} alt={currentCard.name} />

            </div>
          }
        </div>


      </header>
    </div>
  );
}

export default App;
