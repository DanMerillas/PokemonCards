import { CheckBoxExistInDb } from "./CheckBoxExistInDb"

export function CardDetail(props:{currentCard: any, setCurrentCard: any, viewCard: any, handlerErrorImagen: any, cardsInDb: any, setExistInDb: any}){

    return (
        <div className='App-card-Image-container'>
        <h3 className='App-return' onClick={() => props.setCurrentCard(undefined)}>Volver</h3>
        <CheckBoxExistInDb existInDb={props.cardsInDb?.filter((x: any) => x.card_id === props.currentCard.id).length > 0} setExistInDb={() => props.setExistInDb(props.currentCard)} className="App-check-exist"/>
        <img className='image-card' src={`${props.currentCard.image}/high.webp`} alt={props.currentCard.name} onError={props.handlerErrorImagen} />
        <div className='App-pagination' onClick={() => { props.viewCard(props.currentCard.index - 1) }}>Anterior</div>
        <div className='App-pagination' onClick={() => { props.viewCard(props.currentCard.index + 1) }}>Siguiente</div>
      </div>
    )
}