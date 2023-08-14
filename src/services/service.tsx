/* eslint-disable array-callback-return */
import { createClient } from '@supabase/supabase-js'

export async function getCardsFromApi () {
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

    return cardsWithImage
  }

  export async function getSeriesCardsFromApi(selectedValue:string){
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

    return cardsWithImage
  }

  export async function getSeriesFromApi(){
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
    return seriesSorted

  }



export async function readBDCards() {
    const DB_KEY = process.env.REACT_APP_DB_AP_KEY || ""
    const DB_URL = process.env.REACT_APP_DB_AP_URL || ""
  
    const supabase = createClient(DB_URL, DB_KEY)
    const resultTot = await supabase.from('Cards').select()
  
    return resultTot.data
  }

  export async function addCardInDb(card_name:string, card_id:string) {
    const DB_KEY = process.env.REACT_APP_DB_AP_KEY || ""
    const DB_URL = process.env.REACT_APP_DB_AP_URL || ""
  
    const supabase = createClient(DB_URL, DB_KEY)
    const resultTot = await supabase.from('Cards').insert({card_id: card_id, card_name: card_name})
  
    return resultTot.data
  }

  export async function removeCardInDb(card_id:string) {
    const DB_KEY = process.env.REACT_APP_DB_AP_KEY || ""
    const DB_URL = process.env.REACT_APP_DB_AP_URL || ""
      
    const supabase = createClient(DB_URL, DB_KEY)
    const resultTot = await supabase.from('Cards').delete().eq('card_id', card_id)
  
    return resultTot.data
  }