import { useState, useEffect } from 'react';
import './weather.scss';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Alert from 'react-bootstrap/Alert';
import searchIcon from '../assets/images/search-white.svg';
import cloudImg from '../assets/images/cloud.png'
import sunImg from '../assets/images/sun.png'
import { dateTimeConverter, timeConverter, getHistory } from './functions';

const api = {
    key: "36888e03dbcb8f570522eedf183f3f40",
    baseUrl: "https://api.openweathermap.org/data/2.5/"
}

function Weather() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});
    const [history, setHistory] = useState(getHistory);
    const [theme, setTheme] = useState('light-theme');
    const [error, setError] = useState('')

    useEffect(() => {
        document.body.className = theme
    }, [theme])

    const toggleTheme = () => {
        theme === "dark-theme" ? setTheme('light-theme') : setTheme('dark-theme')
    }

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
        setQuery('');
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
            <div className="weather">
                <div className="toggle-theme">
                    <input type="checkbox" class="checkbox" id="checkbox" onChange={toggleTheme} />
                    <label for="checkbox" class="checkbox-label">
                        <FontAwesomeIcon icon="fa-solid fa-moon" style={{ color: "#f1c40f" }} />
                        <FontAwesomeIcon icon="fa-solid fa-sun" style={{ color: "#f39c12" }} />
                        <span class="ball"></span>
                    </label>
                </div>
                <div className="weather-search">
                    <div class="form-floating">
                        <input type="text" className="form-control" id="floatingInput" placeholder="Country" onChange={e => setQuery(e.target.value)} value={query} />
                        <label for="floatingInput">Country</label>
                    </div>
                    <div className="search-button">
                        <button className="btn" type="button" onClick={() => search(query)}>
                            <img src={searchIcon} alt="search-icon" /></button>
                    </div>

                </div>
                <div className="weather-container">
                    {(typeof weather.main != "undefined") ? (
                        <div className="weather-details">
                            <img className="weather-image" alt="search-icon" src={weather.weather[0].main === 'Clear' ? sunImg : cloudImg} />
                            <div>Today's Weather</div>
                            <div className="weather-degree">{Math.round(weather.main.temp) + '°'}</div>
                            <div className="weather-desktop">
                                <div>H: {Math.round(weather.main.temp_min) + '° L:' + Math.round(weather.main.temp_max) + '°'}</div>
                                <div className="weather-details-list">
                                    <div className="weather-country">{weather.name}, {weather.sys.country}</div>
                                    <div>{dateTimeConverter(weather.dt)}</div>
                                    <div>Humidity: {weather.main.humidity + '%'}</div>
                                    <div>{weather.weather[0].main}</div>
                                </div>
                            </div>
                            <div className="weather-mobile">
                                <div>H: {Math.round(weather.main.temp_min) + '° L:' + Math.round(weather.main.temp_max) + '°'}</div>
                                <div className="weather-country">{weather.name}, {weather.sys.country}</div>
                                <div className="weather-details-list">
                                    <div>{weather.weather[0].main}</div>
                                    <div>Humidity: {weather.main.humidity + '%'}</div>
                                    <div>{dateTimeConverter(weather.dt)}</div>
                                </div>
                            </div>

                        </div>
                    ) : (typeof weather.message != "undefined") ? (<div><Alert key='danger' variant='danger'>{error}</Alert></div>) : ('')}
                    <div className="weather-history">
                        <div className="weather-title">Search History</div>
                        {history.length !== 0 ? <ListGroup variant="flush">
                            {history.map((item) => (
                                <ListGroup.Item key={item.id}>
                                    <div>{item.name + ', ' + item.sys.country}
                                        <div className="weather-mobile weather-datetime"> {dateTimeConverter(item.dt)}</div>
                                    </div>
                                    <div className="action-button">
                                        <div className="weather-desktop"> {timeConverter(item.dt)}</div>
                                        <button className="btn" type="button" onClick={() => search(item.name)}><FontAwesomeIcon icon="fa-solid fa-magnifying-glass" style={{ color: "#666666" }} /></button>
                                        <button className="btn" type="button" onClick={() => deleteHistory(item.id)}> <FontAwesomeIcon icon="fa-solid fa-trash" style={{ color: "#666666" }} /></button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup> : <div className="history-empty mt-5">No Record</div>}
                    </div>
                </div>
            </div>
        </>
    );

}

export default Weather;

