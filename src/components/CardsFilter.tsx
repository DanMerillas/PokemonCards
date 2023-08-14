import React from "react"
import { ISeries } from "../interfaces/Iseries"

export function CardsFilter(props: { changeFilter: any, series: ISeries[], setRadioButtonOption: any }) {

    const [selectedValue, setSelectedValue] = React.useState('');
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        props.changeFilter(event)
    };

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
        props.setRadioButtonOption(event.target.value)
    };

    return (
        <>
            <div className='App-filters'>
                <label className='App-label' htmlFor='cbSeries'>Series</label>
                <select id='cbSeries' title='Filtro series' value={selectedValue} onChange={handleChange}>
                    <option key='Todas' value='' title='Todas'>Todas</option>
                    {props.series.map((option: ISeries) => (
                        <option key={option.id} value={option.id} title={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="RadioButtons">
                <label className="RadioButtonItem">
                    <input type="radio" value="All" checked={selectedOption === 'All' || selectedOption === ''} onChange={handleOptionChange} />
                    Todas
                </label>
                <label className="RadioButtonItem">
                    <input type="radio" value="Ihave" checked={selectedOption === 'Ihave'} onChange={handleOptionChange} />
                    Las cartas que tengo
                </label>
                <label className="RadioButtonItem">
                    <input type="radio" value="IDontHave" checked={selectedOption === 'IDontHave'} onChange={handleOptionChange} />
                    Las cartas que no tengo
                </label>
            </div>
        </>
    )
}