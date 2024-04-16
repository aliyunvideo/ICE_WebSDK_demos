import {createRoot} from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';
import {HashRouter} from 'react-router-dom';
import {ROUTERS} from './routers';
import List from './List';

function App () {
  return (
    <HashRouter>
    <Routes>
      <Route path='/' element={<List />} />
      {
        ROUTERS.map((item)=>{
          return  <Route path={item.path} key={item.path} element={item.element} />
        })
      }
    </Routes>
    </HashRouter>
  )
}


const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);