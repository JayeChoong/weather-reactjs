import './App.css';
import Weather from './components/weather';
import WeatherRaw from './components/weather-raw';
import { Routes, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={< Weather />} />
        <Route path="/weather-raw" element={< WeatherRaw />} />
      </Routes>
    </div>
  );
}

export default App;
library.add(fab, fas, far)
