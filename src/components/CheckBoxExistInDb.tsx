
export function CheckBoxExistInDb(props: { existInDb: boolean, setExistInDb: any, className: string }) {

    return (
        <div className={props.className}>
            <input type="checkbox" checked={props.existInDb} onChange={() => props.setExistInDb(!props.existInDb)} />
            <label>La tengo</label>
        </div>
    )
}