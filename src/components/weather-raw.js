import { useState } from 'react';
import './weather.scss';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Alert from 'react-bootstrap/Alert';
import { dateTimeConverter, timeConverter, getHistory } from './functions';

const api = {
    key: "36888e03dbcb8f570522eedf183f3f40",
    baseUrl: "https://api.openweathermap.org/data/2.5/"
}

function WeatherRaw() {
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [weather, setWeather] = useState({});
    const [history, setHistory] = useState(getHistory);
    const [error, setError] = useState('')

    const search = (data) => {
        if (data) {
            fetch(`${api.baseUrl}weather?q=${data}&appid=${api.key}&units=metric`)
                .then(res => res.json())
                .then(result => {
                    if (result.main) {
                        storeHistory(result);
                    } else {
                        setError('No Data Found')
                    }
                    setWeather(result);
                })
                .catch(err => {
                    setError('Error')
                });
            clearSearch()

        }
    }


    const clearSearch = () => {
        setCity('');
        setCountry('');
        setWeather({});
    }

    const storeHistory = (data) => {
        let historyList = JSON.parse(localStorage.getItem('historyList'))
        let itemsList = []
        if (historyList) {
            itemsList = historyList.filter((item) => item.id !== data.id);
        }
        itemsList.unshift(data);
        localStorage.setItem('historyList', JSON.stringify(itemsList))
        setHistory(JSON.parse(localStorage.getItem('historyList')))
    }

    const deleteHistory = (id) => {
        const updatedList = history.filter((item) => item.id !== id);
        setHistory(updatedList)
        localStorage.setItem('historyList', JSON.stringify(updatedList))
    }

    return (
        <>
            <div className="raw">
                <div className="raw-weather-title">Today's Weather</div>
                <div className="row my-4 mx-1">
                    <div className="search-box col-md-4">
                        <div className="row">
                            <div className="col-auto">
                                <label className="col-form-label">City: </label>
                            </div>
                            <div className="col-auto">
                                <input type="text" className="form-control" placeholder="Search..." onChange={e => setCity(e.target.value)}
                                    value={city} />
                            </div>
                        </div>
                    </div>
                    <div className="search-box col-md-4">
                        <div className="row">
                            <div className="col-auto">
                                <label className="col-form-label">Country: </label>
                            </div>
                            <div className="col-auto">
                                <input type="text" className="form-control" placeholder="Search..." onChange={e => setCountry(e.target.value)}
                                    value={country} />
                            </div>
                        </div>

                    </div>
                    <div className="search-button col-md-4">
                        <button className="btn btn-outline-secondary mx-2" type="button" onClick={() => search(city ? city : country)}>Search</button>
                        <button className="btn btn-outline-secondary mx-2" type="button" onClick={clearSearch}>Clear</button>
                    </div>

                </div>
                {(typeof weather.main != "undefined") ? (
                    <div className="weather-details m-4">
                         <div>{weather.name}, {weather.sys.country}</div>
                         <div className="weather-details-title">{weather.weather[0].main}</div>
                         <div>Description: {weather.weather[0].description}</div>
                         <div>Temperature: {Math.round(weather.main.temp_min) + '°C ~ ' + Math.round(weather.main.temp_max) + '°C'}</div>
                         <div>Humidity: {weather.main.humidity + '%'}</div>
                         <div>Time: {dateTimeConverter(weather.dt) }</div>


                    </div>
               
                ) : (typeof weather.message != "undefined") ? (<div><Alert key='danger' variant='danger'>{error}</Alert></div>) : ('')}


                <div className="raw-weather-title">Search History</div>
                {history.length !== 0 ? <ListGroup variant="flush">
                    {history.map((item, index) => (
                        <ListGroup.Item key={item.id}>
                            {index + 1 + '. '} {item.name + ', ' + item.sys.country}
                            <div className="action-button">
                            <div> {timeConverter(item.dt) }</div>

                                <button className="btn btn-outline-secondary mx-2" type="button" onClick={() => search(item.name)}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" /></button>

                                <button className="btn btn-outline-secondary mx-2" type="button" onClick={() => deleteHistory(item.id)}> <FontAwesomeIcon icon="fa-regular fa-trash-can" /></button>
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup> : <div className="history-empty mt-5">No Record</div>}


            </div>
        </>
    );
}

export default WeatherRaw;
