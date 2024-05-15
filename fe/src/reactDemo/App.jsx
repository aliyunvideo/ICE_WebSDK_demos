import { Routes, Route ,Navigate} from 'react-router-dom';
import ProjectDetail from './ProjectDetail';
import ProjectList from './ProjectList';
import ProjectPlayer from './Player';
import TemplateList from './TemplateList';
import Home from './Home';

function App () {
  return (
    <Routes>

        <Route path='/home'  element={<Home />} >
              <Route path=''  element={<Navigate to={'projects'}  replace />} />
              <Route path='projects' element={<ProjectList />} />
              <Route path='templates' element={<TemplateList />} />
              <Route path='detail/:projectId' element={<ProjectDetail />} />
              <Route path='player/:projectId' element={<ProjectPlayer />} />
              <Route path='template/:templateId' element={<ProjectDetail mode={'template'} />} />
        </Route>
        <Route path='/'  element={<Navigate to={'/home'}  replace />} />
    </Routes>
  )
}

export default App
