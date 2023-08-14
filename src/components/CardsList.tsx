import { CheckBoxExistInDb } from "./CheckBoxExistInDb"


export function CardsList(props: { filterCards: any, viewCard: any, pagePosition: number, setPagePosition: any, handlerErrorImagen: any, cardsInDb: any, setExistInDb: any }) {



    return (
        <>
            {props.filterCards.map((card: any, index: number) => {
                return <div className='App-name' key={card.id}>
                    <CheckBoxExistInDb existInDb={props.cardsInDb?.filter((x: any) => x.card_id === card.id).length > 0} setExistInDb={() => props.setExistInDb(card)} className="App-check-exist-list"/>
                    <div onClick={() => props.viewCard(index)}>
                        <div className='App-Pokemon-title' >{card.name}</div>
                        <img className='preview-img' src={`${card.image}/low.webp`} alt={card.name} onError={props.handlerErrorImagen} />
                    </div>
                </div>

            })}
            <div className='App-pagination' onClick={() => { props.setPagePosition(props.pagePosition + 1) }}>Ver más</div>
        </>
    )
}