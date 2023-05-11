import { Routes, Route } from 'react-router-dom'
import ProjectDetail from './ProjectDetail'
import ProjectList from './ProjectList'
import ProjectPlayer from './ProjectPlayer'

function App () {
  return (
    <Routes>
      <Route path='/' element={<ProjectList />} />
      <Route path='/detail/:projectId' element={<ProjectDetail />} />
      <Route path='/player/:projectId' element={<ProjectPlayer />} />
    </Routes>
  )
}

export default App
